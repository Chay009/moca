/**
 * Scene Converter - Transforms custom Scene format to Revideo Scene2D generator
 *
 * This extracts the MainScene logic and makes it reusable for workers
 * Converts custom Scene elements (text, rect, circle, etc.) to Revideo 2D components
 */

import { Txt, Rect, Circle, Img, Audio } from '@revideo/2d';
import { all, waitFor } from '@revideo/core';
import { Scene, SceneElement } from '@/store/projectStore';

/**
 * Convert a custom Scene element to Revideo 2D component
 */
export function elementToRevideo(element: SceneElement): any {
  const props = element.properties;
  let node;

  switch (element.type) {
    case 'text':
      node = new Txt({
        text: props.text || 'Text',
        fontSize: props.fontSize || 50,
        fill: props.fill || '#ffffff',
        x: props.x || 0,
        y: props.y || 0,
        opacity: 0,
      });
      break;

    case 'rect':
      node = new Rect({
        width: props.width || 200,
        height: props.height || 100,
        fill: props.fill || '#3b82f6',
        x: props.x || 0,
        y: props.y || 0,
        radius: 20,
        opacity: 0,
      });
      break;

    case 'circle':
      node = new Circle({
        size: props.radius ? props.radius * 2 : 100,
        fill: props.fill || '#10b981',
        x: props.x || 0,
        y: props.y || 0,
        opacity: 0,
      });
      break;

    case 'image':
      node = new Img({
        src: props.src || '',
        width: props.width || 400,
        height: props.height || 300,
        x: props.x || 0,
        y: props.y || 0,
        opacity: 0,
      });
      break;

    // Video removed - not supported
    // case 'video':
    //   node = new Video({
    //     src: props.src || '',
    //     width: props.width || 640,
    //     height: props.height || 360,
    //     x: props.x || 0,
    //     y: props.y || 0,
    //     volume: props.volume ?? 1,
    //     playbackRate: props.playbackRate ?? 1,
    //     loop: props.loop ?? false,
    //     play: true,
    //     opacity: 0,
    //   });
    //   break;

    case 'audio':
      node = new Audio({
        src: props.src || '',
        volume: props.volume ?? 1,
        playbackRate: props.playbackRate ?? 1,
        loop: props.loop ?? false,
        play: true,
      });
      break;
  }

  return node;
}

/**
 * Create a Revideo generator function from custom Scene
 * This is the core logic from MainScene, extracted for reuse
 */
export function createSceneGenerator(scenes: Scene[]) {
  return function* (view: any) {
    if (!scenes || scenes.length === 0) {
      yield* waitFor(1);
      return;
    }

    // Process each scene sequentially
    for (const scene of scenes) {
      const sceneNodes: any[] = [];

      // Create all elements for this scene
      for (const element of scene.elements) {
        const node = elementToRevideo(element);

        if (node) {
          view.add(node);
          sceneNodes.push(node);
        }
      }

      // Animate scene entry based on transition type
      const transitionDuration = 0.5;

      if (scene.transition === 'fade') {
        // Set initial scale before animation
        sceneNodes.forEach((node) => {
          if (node.scale) node.scale(0.9);
        });

        yield* all(
          ...sceneNodes.map((node) =>
            all(
              node.opacity(1, transitionDuration),
              node.scale ? node.scale(1, transitionDuration) : node.opacity(1, 0)
            )
          )
        );
      } else if (scene.transition === 'slide') {
        // Store original positions and set initial offset
        sceneNodes.forEach((node) => {
          const originalX = node.x?.() ?? 0;
          (node as any)._originalX = originalX;
          if (node.x) node.x(originalX + 1000);
        });

        yield* all(
          ...sceneNodes.map((node) => {
            const originalX = (node as any)._originalX ?? 0;
            return all(
              node.x ? node.x(originalX, transitionDuration) : node.opacity(1, 0),
              node.opacity(1, transitionDuration * 0.5)
            );
          })
        );
      } else {
        // No transition
        yield* all(...sceneNodes.map((node) => node.opacity(1, 0.1)));
      }

      // Hold scene for its duration (minus transitions)
      const holdTime = scene.duration - transitionDuration * 2;
      if (holdTime > 0) {
        yield* waitFor(holdTime);
      }

      // Animate scene exit
      yield* all(
        ...sceneNodes.map((node) => node.opacity(0, transitionDuration))
      );

      // Remove nodes
      sceneNodes.forEach((node) => node.remove());
    }
  };
}
