/**
 * Zoom Transitions
 * Zoom-based transitions between scenes
 */

import { useScene, useTransition, ThreadGenerator, createSignal, Vector2, easeInOutCubic, easeOutCubic, easeInCubic, BBox } from '@revideo/core';

/**
 * Zoom in transition - zoom into the next scene
 */
export function* zoomInTransition(
  area?: BBox,
  duration: number = 0.8
): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const scale = createSignal(1);
  const opacity = createSignal(0);

  // Use provided area or default to center
  const targetArea = area ?? new BBox(0, 0, size.x / 2, size.y / 2);
  const centerX = targetArea.center.x;
  const centerY = targetArea.center.y;

  const endTransition = useTransition(
    ctx => {
      ctx.globalAlpha = opacity();
      ctx.translate(size.x / 2, size.y / 2);
      ctx.scale(scale(), scale());
      ctx.translate(-size.x / 2, -size.y / 2);
    },
    ctx => {
      ctx.globalAlpha = 1 - opacity();
    }
  );

  yield* all(
    scale(1.5, duration, easeOutCubic),
    opacity(1, duration, easeInOutCubic)
  );

  endTransition();
}

/**
 * Zoom out transition - zoom out from the previous scene
 */
export function* zoomOutTransition(
  area?: BBox,
  duration: number = 0.8
): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const scale = createSignal(1.5);
  const opacity = createSignal(0);

  const endTransition = useTransition(
    ctx => {
      ctx.globalAlpha = opacity();
    },
    ctx => {
      ctx.globalAlpha = 1 - opacity();
      ctx.translate(size.x / 2, size.y / 2);
      ctx.scale(scale(), scale());
      ctx.translate(-size.x / 2, -size.y / 2);
    }
  );

  yield* all(
    scale(1, duration, easeInCubic),
    opacity(1, duration, easeInOutCubic)
  );

  endTransition();
}

/**
 * Zoom rotate transition - cinematic zoom with rotation
 */
export function* zoomRotateTransition(duration: number = 1.2): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const scale = createSignal(0.8);
  const rotation = createSignal(-0.15); // radians
  const opacity = createSignal(0);

  const endTransition = useTransition(
    ctx => {
      ctx.globalAlpha = opacity();
      ctx.translate(size.x / 2, size.y / 2);
      ctx.scale(scale(), scale());
      ctx.rotate(rotation());
      ctx.translate(-size.x / 2, -size.y / 2);
    },
    ctx => {
      ctx.globalAlpha = 1 - opacity();
    }
  );

  yield* all(
    scale(1, duration, easeOutCubic),
    rotation(0, duration, easeOutCubic),
    opacity(1, duration, easeInOutCubic)
  );

  endTransition();
}

/**
 * Ken Burns effect - slow zoom and pan
 */
export function* kenBurnsTransition(duration: number = 2.0): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const scale = createSignal(1);
  const panX = createSignal(0);
  const panY = createSignal(0);
  const opacity = createSignal(0);

  const endTransition = useTransition(
    ctx => {
      ctx.globalAlpha = opacity();
      ctx.translate(panX(), panY());
      ctx.translate(size.x / 2, size.y / 2);
      ctx.scale(scale(), scale());
      ctx.translate(-size.x / 2, -size.y / 2);
    },
    ctx => {
      ctx.globalAlpha = 1 - opacity();
    }
  );

  yield* all(
    scale(1.15, duration, easeInOutCubic),
    panX(size.x * 0.05, duration, easeInOutCubic),
    panY(-size.y * 0.05, duration, easeInOutCubic),
    opacity(1, duration, easeInOutCubic)
  );

  endTransition();
}

/**
 * Dolly zoom (Vertigo effect) - zoom in while scene scales out
 */
export function* dollyZoomTransition(duration: number = 1.5): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const cameraScale = createSignal(1);
  const sceneScale = createSignal(1);
  const opacity = createSignal(0);

  const endTransition = useTransition(
    ctx => {
      ctx.globalAlpha = opacity();
      ctx.translate(size.x / 2, size.y / 2);
      ctx.scale(cameraScale() / sceneScale(), cameraScale() / sceneScale());
      ctx.translate(-size.x / 2, -size.y / 2);
    },
    ctx => {
      ctx.globalAlpha = 1 - opacity();
    }
  );

  yield* all(
    cameraScale(1.3, duration, easeInOutCubic),
    sceneScale(0.8, duration, easeInOutCubic),
    opacity(1, duration, easeInOutCubic)
  );

  endTransition();
}
