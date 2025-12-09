/** @jsxImportSource @revideo/2d/lib */
/**
 * Main Revideo scene - renders all scenes sequentially
 * Background is FIXED, content wrapped in Camera for zoom effects
 */
import { makeScene2D } from '@revideo/2d';
import { all, waitFor, useScene, createRef, easeInOutCubic, linear, easeInCubic, easeOutCubic } from '@revideo/core';
import { renderContentOnly } from '@/app/revideo/creators/sceneComposer';
import { addBackgroundToView } from '@/app/revideo/creators/backgrounds/backgroundComposition';
import { Camera } from '@/app/revideo/camera/Camera';
import type { Scene } from '@/types/project';
import type { ZoomEvent, ZoomEasing } from '@/types/zoom';

// Map easing names to functions
const easingMap: Record<ZoomEasing, typeof easeInOutCubic> = {
  linear: linear,
  easeIn: easeInCubic,
  easeOut: easeOutCubic,
  easeInOut: easeInOutCubic,
};

export default makeScene2D('main', function* (view) {
  // Get scenes and current scene index from player variables
  const scenesVar = useScene().variables.get<Scene[]>('scenes', []);
  const currentSceneIndexVar = useScene().variables.get<number>('currentSceneIndex', 0);

  const scenes = scenesVar();
  const currentSceneIndex = currentSceneIndexVar();

  if (!scenes || scenes.length === 0) {
    console.warn('⚠️ MainScene: No scenes received');
    yield* waitFor(1);
    return;
  }

  const currentScene = scenes[currentSceneIndex];

  if (!currentScene) {
    console.warn(`⚠️ MainScene: No scene at index ${currentSceneIndex}`);
    yield* waitFor(1);
    return;
  }

  // Step 1: Add FIXED background to view
  addBackgroundToView(view, currentScene.background);

  // Step 2: Determine if we need Camera (for zoom)
  const hasZoomEvents = currentScene.zoomEvents && currentScene.zoomEvents.length > 0;

  let nodes;
  let cameraRef: ReturnType<typeof createRef<Camera>> | null = null;

  if (hasZoomEvents) {
    // Create Camera for zoomable content
    // Explicitly disable layout and set defaults to match View coordinates
    cameraRef = createRef<Camera>();
    view.add(
      <Camera
        ref={cameraRef}
        layout={false}
        position={[0, 0]}
        scale={1}
        rotation={0}
      />
    );

    // Render content (video, text, etc.) into Camera's scene
    nodes = renderContentOnly(cameraRef().scene(), currentScene);
  } else {
    // No zoom - render content directly to view (more efficient)
    nodes = renderContentOnly(view, currentScene);
  }

  // Filter animatable nodes (ones with opacity function)
  const animatableNodes = nodes.filter(({ node }) => typeof node?.opacity === 'function');

  if (animatableNodes.length === 0) {
    if (hasZoomEvents && cameraRef) {
      yield* processZoomEvents(cameraRef(), currentScene.zoomEvents || [], currentScene.duration);
    } else {
      yield* waitFor(currentScene.duration);
    }
    return;
  }

  // Calculate animation durations
  const entranceDuration = Math.max(...nodes.map(n => n.config.entrance?.duration || 0.5));
  const exitDuration = Math.max(...nodes.map(n => n.config.exit?.duration || 0.5));
  const holdDuration = Math.max(0, currentScene.duration - entranceDuration - exitDuration);

  // ===== ENTRANCE ANIMATIONS =====
  yield* all(
    ...animatableNodes.map(({ node, config }) => {
      const duration = config.entrance?.duration || 0.5;
      return node.opacity(1, duration);
    })
  );

  // the thing is in ftiutr llm gives the coordinates po o fhwhere to zoom
  // currently it is for canvas but llm gives for video so need to do it accordingly  
  // ===== HOLD PHASE with ZOOM EVENTS =====
  if (hasZoomEvents && cameraRef) {
    yield* processZoomEvents(cameraRef(), currentScene.zoomEvents || [], holdDuration);
  } else {
    yield* waitFor(holdDuration);
  }

  // ===== EXIT ANIMATIONS =====
  yield* all(
    ...animatableNodes.map(({ node, config }) => {
      const duration = config.exit?.duration || 0.5;
      return node.opacity(0, duration);
    })
  );
});

/**
 * Process zoom events during hold phase
 * Handles zoom in, hold, and optionally zoom out
 */
function* processZoomEvents(
  camera: Camera,
  zoomEvents: ZoomEvent[],
  totalDuration: number
): Generator {
  if (!zoomEvents || zoomEvents.length === 0) {
    yield* waitFor(totalDuration);
    return;
  }

  // Sort events by start time
  const sortedEvents = [...zoomEvents].sort((a, b) => a.startTime - b.startTime);
  let currentTime = 0;

  for (const zoom of sortedEvents) {
    // Wait until this zoom event starts
    if (zoom.startTime > currentTime) {
      yield* waitFor(zoom.startTime - currentTime);
      currentTime = zoom.startTime;
    }

    const easing = easingMap[zoom.easing] || easeInOutCubic;

    // Zoom in - use scale directly (1/zoomLevel makes content bigger)
    // Camera applies inverse transform, so scale 0.5 = 2x zoom in
    const zoomScale = 1 / zoom.zoomLevel;
    yield* all(
      camera.position([zoom.targetX, zoom.targetY], zoom.duration, easing),
      camera.scale(zoomScale, zoom.duration, easing)
    );
    currentTime += zoom.duration;

    // Hold zoom
    yield* waitFor(zoom.holdDuration);
    currentTime += zoom.holdDuration;

    // Zoom out if auto-reset enabled
    if (zoom.autoReset) {
      yield* all(
        camera.position([0, 0], zoom.duration, easing),
        camera.scale(1, zoom.duration, easing)
      );
      currentTime += zoom.duration;
    }
  }

  // Wait for remaining duration
  if (currentTime < totalDuration) {
    yield* waitFor(totalDuration - currentTime);
  }
}
