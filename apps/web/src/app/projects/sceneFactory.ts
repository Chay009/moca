/**
 * Scene Factory - Converts custom Scene data to Revideo SceneDescription
 * Creates one SceneDescription per custom scene (not one MainScene for all)
 * Uses new component system with full property support + real scene transitions
 * 
 * REACTIVE UPDATES: Scenes read fresh data from useScene().variables.get('scenes')
 * so property changes in the store are reflected immediately without project recreation!
 */
import { makeScene2D } from '@revideo/2d';
import { all, waitFor, useScene } from '@revideo/core';
import type { Scene, SceneTransitionConfig } from '@/types/project';
import { renderScene } from '@/app/revideo/creators/sceneComposer';
import { getTransition } from '@/app/revideo/creators/presets/sceneTransitions';

/**
 * Create a Revideo scene generator for a single custom scene
 * Each custom scene becomes its own Revideo scene
 * Supports animations, text effects, and audio
 */
export function createSceneGenerator(customScene: Scene, sceneIndex: number) {
  return makeScene2D(customScene.id, function* (view) {
    console.log(`🎬 SceneFactory: Creating scene ${customScene.id}`);

    // Read fresh scene data from Revideo variables (updated by CanvasPlayer)
    // Falls back to baked-in customScene if variables not set
    const variables = useScene().variables;
    const allScenes = variables.get('scenes', null) as unknown as Scene[] | null;
    const currentSceneData = allScenes?.[sceneIndex] ?? customScene;

    // DEBUG: Log actual values from variables
    console.log(`📦 Using ${allScenes ? 'FRESH' : 'BAKED'} scene data for ${customScene.id}`);
    if (allScenes) {
      console.log('🔍 Variables fontSize:',
        currentSceneData.elements?.map(e => ({ id: e.id, fontSize: e.properties?.fontSize }))
      );
    }

    // STEP 1: Render scene content FIRST (required before transition)
    const sceneNodes = renderScene(view, currentSceneData);
    console.log(`📋 Rendered ${sceneNodes.length} nodes for scene ${currentSceneData.id}`);

    // STEP 2: Apply REAL entrance transition (uses useTransition internally)
    if (customScene.transition) {
      const transitionConfig = typeof customScene.transition === 'string'
        ? { type: customScene.transition, enabled: true, duration: 0.8 }
        : customScene.transition as SceneTransitionConfig;

      if (transitionConfig.enabled && transitionConfig.type !== 'none') {
        const transition = getTransition(transitionConfig.type);
        if (transition) {
          console.log(`✨ Applying transition: ${transition.name}`);
          yield* transition.generator(transitionConfig.duration || transition.duration);
        }
      }
    }

    // STEP 3: Fade in elements (entrance animations)
    const animatableNodes = sceneNodes.filter((item) => typeof item.node?.opacity === 'function');
    console.log(`🎭 Found ${animatableNodes.length} animatable nodes`);

    yield* all(
      ...animatableNodes.map(({ node, config }) => {
        const duration = config.entrance?.duration || 0.5;
        return node.opacity(1, duration);
      })
    );

    // STEP 4: Run text effect animations during scene
    const componentsWithAnimation = sceneNodes.filter(item => typeof item.animate === 'function');
    if (componentsWithAnimation.length > 0) {
      console.log(`🎬 Running ${componentsWithAnimation.length} text effect animations`);
      yield* all(
        ...componentsWithAnimation.map(item => item.animate!())
      );
    }

    // STEP 5: Hold for remaining duration
    // We want the total scene duration to match customScene.duration
    // So we subtract the time already spent on Transitions, Entrances, and Text Animations.
    // We also reserve space for Exit animations at the end.
    const currentTime = useScene().playback.time;
    const exitDuration = Math.max(...sceneNodes.map(n => n.config.exit?.duration || 0.0));
    const remainingTime = Math.max(0, customScene.duration - currentTime - exitDuration);

    if (remainingTime > 0) {
      console.log(`⏱️ Holding for remaining ${remainingTime.toFixed(2)}s (Current: ${Number(currentTime).toFixed(2)}s, Target: ${customScene.duration}s)`);
      yield* waitFor(remainingTime);
    } else {
      console.warn(`⚠️ Scene animations (${Number(currentTime).toFixed(2)}s) exceeded target duration (${customScene.duration}s)`);
    }

    // STEP 6: Fade out elements (exit animations)
    yield* all(
      ...animatableNodes.map(({ node, config }) => {
        const duration = config.exit?.duration || 0.5;
        return node.opacity(0, duration);
      })
    );

    // NO manual cleanup - Motion Canvas PlaybackManager handles scene lifecycle
    // The previous scene needs to stay alive for the next scene's transition
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
  const sceneDescriptions = customScenes.map((scene, index) => createSceneGenerator(scene, index));
  return sceneDescriptions;
}
