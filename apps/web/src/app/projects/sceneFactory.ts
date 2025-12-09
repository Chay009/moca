/**
 * Scene Factory - Converts custom Scene data to Revideo SceneDescription
 * Creates one SceneDescription per custom scene (not one MainScene for all)
 * Uses new component system with full property support
 */
import { makeScene2D } from '@revideo/2d';
import { all, waitFor } from '@revideo/core';
import type { Scene } from '@/types/project';
import { renderScene } from '@/app/revideo/creators/sceneComposer';

/**
 * Create a Revideo scene generator for a single custom scene
 * Each custom scene becomes its own Revideo scene
 * Supports animations, text effects, and audio
 */
export function createSceneGenerator(customScene: Scene) {
  // Return the raw generator function wrapped with makeScene2D
  // makeScene2D handles the wrapping for Revideo's internal system
  return makeScene2D(customScene.id, function* (view) {
    const transitionDuration = 0.5;

    // Render scene using shared composer - returns NodeWithConfig[]
    const sceneNodes = renderScene(view, customScene);

    console.log(`🎬 SceneFactory: Rendered ${sceneNodes.length} nodes for scene ${customScene.id}`);
    console.log(`📋 Scene has ${customScene.elements?.length || 0} elements`);

    // Animate scene entry based on transition type
    // Filter nodes that support animations
    // sceneNodes is NodeWithConfig[], so we destructure {node}
    const animatableNodes = sceneNodes.filter((item) => {
      const { node, elementType } = item;
      const hasOpacity = typeof node?.opacity === 'function';
      console.log(`🔍 Node check: ${elementType}, hasOpacity: ${hasOpacity}`);
      return hasOpacity;
    });

    console.log(`🎭 Found ${animatableNodes.length} animatable nodes out of ${sceneNodes.length} total nodes`);

    if (customScene.transition === 'fade' && animatableNodes.length > 0) {
      // Fade in: opacity 0 -> 1, scale 0.9 -> 1
      animatableNodes.forEach(({ node }) => {
        if (node.opacity) node.opacity(0);
        if (node.scale) node.scale(0.9);
      });

      yield* all(
        ...animatableNodes.map(({ node }) =>
          all(
            node.opacity(1, transitionDuration),  // Always fade to fully visible
            node.scale ? node.scale(1, transitionDuration) : node.opacity(1, 0)
          )
        )
      );
    } else if (customScene.transition === 'slide' && animatableNodes.length > 0) {
      // Slide in: start off-screen and invisible, slide to position and fade in
      animatableNodes.forEach(({ node }) => {
        const originalX = node.position?.x?.() ?? 0;
        (node as any)._originalX = originalX;
        if (node.opacity) node.opacity(0);
        if (node.position?.x) node.position.x(originalX + 1000);
      });

      yield* all(
        ...animatableNodes.map(({ node }) => {
          const originalX = (node as any)._originalX ?? 0;
          return all(
            node.position?.x ? node.position.x(originalX, transitionDuration) : node.opacity(1, 0),
            node.opacity(1, transitionDuration * 0.5)  // Always fade to fully visible
          );
        })
      );
    } else {
      // No transition OR fallback if filter failed - set to full opacity immediately
      console.log('⚡ No transition (or fallback) - setting opacity to 1 immediately');

      // If animatableNodes is empty but we have sceneNodes, try to set opacity on everything blindly
      const nodesToReset = animatableNodes.length > 0 ? animatableNodes : sceneNodes;

      nodesToReset.forEach((item) => {
        const n = item.node;
        if (n && typeof n.opacity === 'function') {
          console.log(`⚡ Setting opacity to 1 for node: ${item.elementType}`);
          n.opacity(1);
        }
      });
    }

    // Hold scene for its duration (minus transitions)
    const holdTime = Math.max(0, customScene.duration - transitionDuration * 2);
    if (holdTime > 0) {
      yield* waitFor(holdTime);
    }

    // Animate scene exit (only for animatable nodes)
    if (animatableNodes.length > 0) {
      yield* all(
        ...animatableNodes.map(({ node }) =>
          node.opacity(0, transitionDuration)
        )
      );
    }

    // Remove all nodes
    sceneNodes.forEach(({ node }) => {
      if (node && typeof node.remove === 'function') {
        node.remove();
      }
    });
  });
}

/**
 * Create a Revideo Project from custom scenes
 * Converts each custom scene to a SceneDescription
 *
 * Important: makeScene2D() already returns a proper SceneDescription,
 * so we can pass them directly to makeProject()
 */
export function createProjectFromScenes(customScenes: Scene[]) {
  // Map each custom scene to a Revideo scene description
  // makeScene2D already wraps it properly for makeProject()
  const sceneDescriptions = customScenes.map((scene) => createSceneGenerator(scene));
  return sceneDescriptions;
}
