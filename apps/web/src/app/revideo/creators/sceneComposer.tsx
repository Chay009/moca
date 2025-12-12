/** @jsxImportSource @revideo/2d/lib */
/**
 * Scene Composer - Shared rendering logic for MainScene and sceneFactory
 * Handles backgrounds, elements, and audio tracks
 * Returns nodes with animation configs for yield* pattern
 */
import { Audio } from '@revideo/2d';
import { addBackgroundToView } from './backgrounds/backgroundComposition';
import { createComponent } from '@/app/revideo';

interface SceneData {
  background?: any;
  elements: any[];
  audioTracks?: any[];
}

interface AnimationConfig {
  entrance?: { type?: string; duration?: number };
  exit?: { type?: string; duration?: number };
  holdDuration?: number;
  startTime?: number;
}

interface NodeWithConfig {
  node: any;
  config: AnimationConfig;
  elementType: string;
  /** Optional animate method from AnimatedComponent */
  animate?: () => Generator<any, void, any>;
  /** Reference to main element for external animation */
  ref?: any;
}

/**
 * Unified scene rendering - follows background pattern
 * Returns nodes with their animation configs for MainScene to yield* animations
 */
export function renderScene(view: any, scene: SceneData): NodeWithConfig[] {
  const createdNodes: NodeWithConfig[] = [];

  // Step 1: Add background
  addBackgroundToView(view, scene.background);

  // Step 2: Add all elements using component registry
  for (const element of scene.elements) {
    // DEBUG: Log the actual properties being used
    console.log(`🔧 Creating ${element.type} with props:`, {
      id: element.id,
      fontSize: element.properties?.fontSize,
      text: element.properties?.text,
      x: element.properties?.x,
      y: element.properties?.y,
    });

    const componentResult = createComponent({
      elementId: element.id,
      type: element.type,
      ...element.properties,
    }) as any; // Cast to any - runtime handles all cases

    if (componentResult) {
      // NEW PATTERN: componentResult is { node, ref, animate? } OR legacy Node
      // Extract the actual node to add to view
      const node = componentResult.node ?? componentResult; // Fallback for legacy components
      const hasAnimateMethod = componentResult.animate && typeof componentResult.animate === 'function';

      // Set initial opacity to 0 for entrance animation
      if (typeof node.opacity === 'function') {
        node.opacity(0);
      }

      view.add(node);

      // Extract animation config from element properties
      const animConfig = element.properties?.animation || {};

      // holdDuration is kept for backward compatibility but not used in MainScene
      // MainScene now uses scene.duration directly
      const holdDuration = animConfig.holdDuration || animConfig.hold || 3;

      createdNodes.push({
        node,
        config: {
          entrance: animConfig.entrance || { type: 'fade', duration: 0.5 },
          exit: animConfig.exit || { type: 'fade', duration: 0.5 },
          holdDuration,
          startTime: animConfig.startTime || 0,
        },
        elementType: element.type,
        // NEW: Store animate function if component has one
        animate: hasAnimateMethod ? componentResult.animate : undefined,
        ref: componentResult.ref,
      });
    }
  }

  // Step 3: Add audio tracks
  if (scene.audioTracks && scene.audioTracks.length > 0) {
    console.log(`🔊 Adding ${scene.audioTracks.length} audio tracks`);
    for (const track of scene.audioTracks) {
      const audioNode = (
        <Audio
          src={track.src}
          volume={track.volume}
          loop={track.loop ?? false}
          time={track.startTime}
        />
      );
      view.add(audioNode);
      console.log(`✅ Audio track added: ${track.name} (starts at ${track.startTime}s)`);
    }
  }

  return createdNodes;
}

/**
 * Render only content (skip background) - for Camera wrapping
 * Background should be rendered separately to view (stays fixed)
 * Content is rendered to Camera (can zoom)
 */
export function renderContentOnly(target: any, scene: SceneData): NodeWithConfig[] {
  const createdNodes: NodeWithConfig[] = [];

  // Add all elements (skip background)
  for (const element of scene.elements) {
    const componentResult = createComponent({
      elementId: element.id,
      type: element.type,
      ...element.properties,
    }) as any; // Cast to any - runtime handles all cases

    if (componentResult) {
      // NEW PATTERN: componentResult is { node, ref, animate? } OR legacy Node
      const node = componentResult.node ?? componentResult;
      const hasAnimateMethod = componentResult.animate && typeof componentResult.animate === 'function';

      // Set initial opacity to 0 for entrance animation
      if (typeof node.opacity === 'function') {
        node.opacity(0);
      }

      target.add(node);

      // Extract animation config from element properties
      const animConfig = element.properties?.animation || {};
      const holdDuration = animConfig.holdDuration || animConfig.hold || 3;

      createdNodes.push({
        node,
        config: {
          entrance: animConfig.entrance || { type: 'fade', duration: 0.5 },
          exit: animConfig.exit || { type: 'fade', duration: 0.5 },
          holdDuration,
          startTime: animConfig.startTime || 0,
        },
        elementType: element.type,
        animate: hasAnimateMethod ? componentResult.animate : undefined,
        ref: componentResult.ref,
      });
    }
  }

  // Add audio tracks to target
  if (scene.audioTracks && scene.audioTracks.length > 0) {
    console.log(`🔊 Adding ${scene.audioTracks.length} audio tracks`);
    for (const track of scene.audioTracks) {
      const audioNode = (
        <Audio
          src={track.src}
          volume={track.volume}
          loop={track.loop ?? false}
          time={track.startTime}
        />
      );
      target.add(audioNode);
      console.log(`✅ Audio track added: ${track.name} (starts at ${track.startTime}s)`);
    }
  }

  return createdNodes;
}


