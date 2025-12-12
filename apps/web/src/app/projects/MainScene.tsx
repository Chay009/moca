/** @jsxImportSource @revideo/2d/lib */
/**
 * Main Revideo scene - renders scenes with transitions
 * Supports two modes:
 * - "scene": Preview current scene only
 * - "all": Play all scenes sequentially with transitions
 */

import { makeScene2D } from '@revideo/2d';
import { all, waitFor, useScene, createRef, easeInOutCubic, linear, easeInCubic, easeOutCubic, createSignal } from '@revideo/core';
import { renderContentOnly } from '@/app/revideo/creators/sceneComposer';
import { addBackgroundToView } from '@/app/revideo/creators/backgrounds/backgroundComposition';
import { Camera } from '@/app/revideo/camera/Camera';
import { getTransition } from '@/app/revideo/creators/presets/sceneTransitions';
import type { Scene, SceneTransitionConfig } from '@/types/project';
import type { ZoomEvent, ZoomEasing } from '@/types/zoom';

// Map easing names to functions
const easingMap: Record<ZoomEasing, typeof easeInOutCubic> = {
  linear: linear,
  easeIn: easeInCubic,
  easeOut: easeOutCubic,
  easeInOut: easeInOutCubic,
};

export default makeScene2D('main', function* (view) {
  // Get scenes and play mode from player variables
  const scenesVar = useScene().variables.get<Scene[]>('scenes', []);
  const currentSceneIndexVar = useScene().variables.get<number>('currentSceneIndex', 0);
  const playModeVar = useScene().variables.get<string>('playMode', 'scene');

  const scenes = scenesVar();
  const currentSceneIndex = currentSceneIndexVar();
  const playMode = playModeVar();

  if (!scenes || scenes.length === 0) {
    console.warn('⚠️ MainScene: No scenes received');
    yield* waitFor(1);
    return;
  }

  // Play mode: "scene" or "all"
  if (playMode === 'all') {
    console.log(`🎬 Playing all ${scenes.length} scenes with transitions`);

    // Play all scenes sequentially with transitions
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      console.log(`▶️ Playing scene ${i + 1}/${scenes.length}: ${scene.name}`);

      yield* renderSingleScene(view, scene);

      // Apply transition before next scene (if not last scene)
      if (i < scenes.length - 1) {
        const nextScene = scenes[i + 1];
        yield* applySceneTransition(view, nextScene);
      }
    }
  } else {
    // Play current scene only (preview mode)
    const currentScene = scenes[currentSceneIndex];

    if (!currentScene) {
      console.warn(`⚠️ MainScene: No scene at index ${currentSceneIndex}`);
      yield* waitFor(1);
      return;
    }

    console.log(`▶️ Playing scene ${currentSceneIndex + 1}: ${currentScene.name}`);
    yield* renderSingleScene(view, currentScene);
  }
});

/**
 * Render a single scene (entrance → hold → exit)
 */
function* renderSingleScene(view: any, scene: Scene): Generator {
  // Step 1: Add FIXED background to view
  addBackgroundToView(view, scene.background);

  // Step 2: Determine if we need Camera (for zoom)
  const hasZoomEvents = scene.zoomEvents && scene.zoomEvents.length > 0;

  let nodes;
  let cameraRef: ReturnType<typeof createRef<Camera>> | null = null;

  if (hasZoomEvents) {
    // Create Camera for zoomable content
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

    // Render content into Camera's scene
    nodes = renderContentOnly(cameraRef().scene(), scene);
  } else {
    // No zoom - render content directly to view
    nodes = renderContentOnly(view, scene);
  }

  // Filter animatable nodes
  const animatableNodes = nodes.filter(({ node }) => typeof node?.opacity === 'function');

  if (animatableNodes.length === 0) {
    if (hasZoomEvents && cameraRef) {
      yield* processZoomEvents(cameraRef(), scene.zoomEvents || [], scene.duration);
    } else {
      yield* waitFor(scene.duration);
    }
    return;
  }

  // Calculate animation durations
  const entranceDuration = Math.max(...nodes.map(n => n.config.entrance?.duration || 0.5));
  const exitDuration = Math.max(...nodes.map(n => n.config.exit?.duration || 0.5));
  const holdDuration = Math.max(0, scene.duration - entranceDuration - exitDuration);

  // ===== ENTRANCE ANIMATIONS =====
  yield* all(
    ...animatableNodes.map(({ node, config }) => {
      const duration = config.entrance?.duration || 0.5;
      return node.opacity(1, duration);
    })
  );

  // ===== HOLD PHASE with TEXT EFFECTS + ZOOM EVENTS =====
  const componentsWithAnimation = nodes.filter(item => typeof item.animate === 'function');
  if (componentsWithAnimation.length > 0) {
    console.log(`🎬 Running ${componentsWithAnimation.length} text effect animations`);
    yield* all(
      ...componentsWithAnimation.map(item => item.animate!())
    );
  }

  if (hasZoomEvents && cameraRef) {
    yield* processZoomEvents(cameraRef(), scene.zoomEvents || [], holdDuration);
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

  // Clean up - remove nodes from view for next scene
  view.removeChildren();
}

/**
 * Apply scene transition based on scene configuration
 */
function* applySceneTransition(view: any, nextScene: Scene): Generator {
  if (!nextScene.transition) {
    console.log('⏭️ No transition configured, continuing to next scene');
    return;
  }

  // Support both legacy string format and new config format
  let transitionType: string;
  let transitionDuration: number | undefined;
  let enabled = true;

  if (typeof nextScene.transition === 'string') {
    // Legacy format: 'fade', 'slide', 'none'
    transitionType = nextScene.transition;
    if (transitionType === 'none') {
      enabled = false;
    }
  } else {
    // New format: SceneTransitionConfig
    const config = nextScene.transition as SceneTransitionConfig;
    transitionType = config.type;
    transitionDuration = config.duration;
    enabled = config.enabled;
  }

  if (!enabled || transitionType === 'none') {
    console.log('⏭️ Transition disabled, continuing to next scene');
    return;
  }

  // Get transition from registry
  const transition = getTransition(transitionType);

  if (!transition) {
    console.warn(`⚠️ Transition "${transitionType}" not found in registry`);
    return;
  }

  console.log(`✨ Applying transition: ${transition.name} (${transitionDuration || transition.duration}s)`);

  // Apply the transition generator
  try {
    yield* transition.generator(transitionDuration || transition.duration);
  } catch (error) {
    console.error(`❌ Transition error:`, error);
  }
}

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

    // Zoom in
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
