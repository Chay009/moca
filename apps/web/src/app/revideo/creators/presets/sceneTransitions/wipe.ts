/**
 * Wipe Transitions
 * Screen wipe transitions (directional reveals)
 */

import { useScene, useTransition, ThreadGenerator, createSignal, Vector2, easeInOutCubic, easeInCubic, easeOutCubic } from '@revideo/core';

export type WipeDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Classic wipe - one scene wipes over another
 */
export function* wipeTransition(
  direction: WipeDirection = 'left',
  duration: number = 0.8
): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const progress = createSignal(0);

  const endTransition = useTransition(
    ctx => {
      // Clip the current scene based on wipe direction
      ctx.save();
      ctx.beginPath();

      switch (direction) {
        case 'left':
          ctx.rect(0, 0, size.x * progress(), size.y);
          break;
        case 'right':
          ctx.rect(size.x * (1 - progress()), 0, size.x * progress(), size.y);
          break;
        case 'up':
          ctx.rect(0, 0, size.x, size.y * progress());
          break;
        case 'down':
          ctx.rect(0, size.y * (1 - progress()), size.x, size.y * progress());
          break;
      }

      ctx.clip();
    },
    ctx => {
      // Previous scene stays visible behind
    }
  );

  yield* progress(1, duration, easeInOutCubic);

  endTransition();
}

/**
 * Clock wipe - circular wipe like a clock hand
 */
export function* clockWipeTransition(
  clockwise: boolean = true,
  duration: number = 1.0
): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const angle = createSignal(clockwise ? -Math.PI / 2 : Math.PI / 2);

  const endTransition = useTransition(
    ctx => {
      ctx.save();
      ctx.beginPath();

      const centerX = size.x / 2;
      const centerY = size.y / 2;
      const radius = Math.max(size.x, size.y);

      // Create pie-slice clip path
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        radius,
        -Math.PI / 2,
        angle(),
        !clockwise
      );
      ctx.lineTo(centerX, centerY);

      ctx.clip();
    },
    ctx => {
      // Previous scene visible behind
    }
  );

  const targetAngle = clockwise
    ? -Math.PI / 2 + Math.PI * 2
    : Math.PI / 2 - Math.PI * 2;

  yield* angle(targetAngle, duration, easeInOutCubic);

  endTransition();
}

/**
 * Iris wipe - circular expand/contract wipe
 */
export function* irisWipeTransition(
  expand: boolean = true,
  centerX?: number,
  centerY?: number,
  duration: number = 0.8
): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const radius = createSignal(expand ? 0 : Math.max(size.x, size.y));

  const cx = centerX ?? size.x / 2;
  const cy = centerY ?? size.y / 2;
  const maxRadius = Math.sqrt(
    Math.max(cx, size.x - cx) ** 2 + Math.max(cy, size.y - cy) ** 2
  );

  const endTransition = useTransition(
    ctx => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius(), 0, Math.PI * 2);
      ctx.clip();
    },
    ctx => {
      if (!expand) {
        // When contracting, show previous scene outside iris
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius(), 0, Math.PI * 2);
        ctx.rect(0, 0, size.x, size.y);
        ctx.clip('evenodd');
      }
    }
  );

  yield* radius(expand ? maxRadius : 0, duration, easeInOutCubic);

  endTransition();
}

/**
 * Barn door wipe - doors opening/closing from center
 */
export function* barnDoorWipeTransition(
  horizontal: boolean = true,
  duration: number = 1.0
): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const progress = createSignal(0);

  const endTransition = useTransition(
    ctx => {
      ctx.save();
      ctx.beginPath();

      if (horizontal) {
        // Doors open horizontally from center
        const doorWidth = (size.x / 2) * progress();
        ctx.rect(0, 0, doorWidth, size.y);
        ctx.rect(size.x - doorWidth, 0, doorWidth, size.y);
      } else {
        // Doors open vertically from center
        const doorHeight = (size.y / 2) * progress();
        ctx.rect(0, 0, size.x, doorHeight);
        ctx.rect(0, size.y - doorHeight, size.x, doorHeight);
      }

      ctx.clip();
    },
    ctx => {
      // Previous scene visible in center
    }
  );

  yield* progress(1, duration, easeInOutCubic);

  endTransition();
}

/**
 * Diamond wipe - diamond shape expands from center
 */
export function* diamondWipeTransition(duration: number = 1.0): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const progress = createSignal(0);

  const endTransition = useTransition(
    ctx => {
      ctx.save();
      ctx.beginPath();

      const centerX = size.x / 2;
      const centerY = size.y / 2;
      const maxDist = Math.max(size.x, size.y);
      const dist = maxDist * progress();

      // Diamond shape
      ctx.moveTo(centerX, centerY - dist);
      ctx.lineTo(centerX + dist, centerY);
      ctx.lineTo(centerX, centerY + dist);
      ctx.lineTo(centerX - dist, centerY);
      ctx.closePath();

      ctx.clip();
    },
    ctx => {
      // Previous scene behind
    }
  );

  yield* progress(1, duration, easeInOutCubic);

  endTransition();
}

/**
 * Diagonal wipe - wipe diagonally across screen
 */
export function* diagonalWipeTransition(
  topLeftToBottomRight: boolean = true,
  duration: number = 0.8
): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const progress = createSignal(0);

  const endTransition = useTransition(
    ctx => {
      ctx.save();
      ctx.beginPath();

      const diagonal = Math.sqrt(size.x ** 2 + size.y ** 2);
      const offset = diagonal * progress();

      if (topLeftToBottomRight) {
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.min(offset, size.x), 0);
        ctx.lineTo(0, Math.min(offset, size.y));

        if (offset > size.x) {
          ctx.lineTo(size.x, offset - size.x);
          ctx.lineTo(size.x, 0);
        }
        if (offset > size.y) {
          ctx.lineTo(offset - size.y, size.y);
          ctx.lineTo(0, size.y);
        }
        if (offset > diagonal - size.x) {
          ctx.lineTo(size.x, size.y);
        }
      } else {
        ctx.moveTo(size.x, 0);
        ctx.lineTo(Math.max(size.x - offset, 0), 0);
        ctx.lineTo(size.x, Math.min(offset, size.y));

        if (offset > size.x) {
          ctx.lineTo(0, offset - size.x);
          ctx.lineTo(0, 0);
        }
        if (offset > size.y) {
          ctx.lineTo(size.x - (offset - size.y), size.y);
          ctx.lineTo(size.x, size.y);
        }
        if (offset > diagonal - size.x) {
          ctx.lineTo(0, size.y);
        }
      }

      ctx.closePath();
      ctx.clip();
    },
    ctx => {
      // Previous scene behind
    }
  );

  yield* progress(1, duration, easeInOutCubic);

  endTransition();
}
