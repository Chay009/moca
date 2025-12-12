/**
 * Slide Transitions
 * Slides between scenes in various directions
 */

import { useScene, useTransition, ThreadGenerator, Vector2, easeInOutCubic } from '@revideo/core';

export type SlideDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Classic slide transition - current scene slides in, previous slides out
 */
export function* slideTransition(
  direction: SlideDirection = 'left',
  duration: number = 0.8
): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const currentPos = Vector2.createSignal();
  const previousPos = Vector2.createSignal(Vector2.zero);

  // Calculate slide offsets based on direction
  const offsets = {
    left: new Vector2(size.x, 0),
    right: new Vector2(-size.x, 0),
    up: new Vector2(0, size.y),
    down: new Vector2(0, -size.y),
  };

  const slideOffset = offsets[direction];
  currentPos(slideOffset);

  const endTransition = useTransition(
    // Current scene - slide in from offset to center
    ctx => ctx.translate(currentPos.x(), currentPos.y()),
    // Previous scene - slide out in opposite direction
    ctx => ctx.translate(previousPos.x(), previousPos.y())
  );

  // Animate both scenes simultaneously
  yield* currentPos(Vector2.zero, duration, easeInOutCubic);
  yield* previousPos(slideOffset.scale(-1), duration, easeInOutCubic);

  endTransition();
}

/**
 * Push transition - current scene pushes previous scene out
 */
export function* pushTransition(
  direction: SlideDirection = 'left',
  duration: number = 0.8
): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const offset = Vector2.createSignal();

  const offsets = {
    left: new Vector2(size.x, 0),
    right: new Vector2(-size.x, 0),
    up: new Vector2(0, size.y),
    down: new Vector2(0, -size.y),
  };

  const slideOffset = offsets[direction];
  offset(slideOffset);

  const endTransition = useTransition(
    // Current scene starts off-screen
    ctx => ctx.translate(offset.x(), offset.y()),
    // Previous scene gets pushed out
    ctx => ctx.translate(offset.x() - slideOffset.x, offset.y() - slideOffset.y)
  );

  yield* offset(Vector2.zero, duration, easeInOutCubic);

  endTransition();
}

/**
 * Slide and fade - combines slide with opacity fade
 */
export function* slideFadeTransition(
  direction: SlideDirection = 'left',
  duration: number = 1.0
): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const currentPos = Vector2.createSignal();
  const currentAlpha = createSignal(0);
  const previousAlpha = createSignal(1);

  const offsets = {
    left: new Vector2(size.x * 0.3, 0),
    right: new Vector2(-size.x * 0.3, 0),
    up: new Vector2(0, size.y * 0.3),
    down: new Vector2(0, -size.y * 0.3),
  };

  currentPos(offsets[direction]);

  const endTransition = useTransition(
    ctx => {
      ctx.translate(currentPos.x(), currentPos.y());
      ctx.globalAlpha = currentAlpha();
    },
    ctx => {
      ctx.globalAlpha = previousAlpha();
    }
  );

  yield* all(
    currentPos(Vector2.zero, duration, easeInOutCubic),
    currentAlpha(1, duration, easeInOutCubic),
    previousAlpha(0, duration, easeInOutCubic)
  );

  endTransition();
}
