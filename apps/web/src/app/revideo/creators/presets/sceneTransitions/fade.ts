/**
 * Fade Transitions
 * Various fade effects between scenes
 */

import { useScene, useTransition, ThreadGenerator, createSignal, easeInOutCubic, easeOutCubic, easeInCubic } from '@revideo/core';

/**
 * Simple cross-fade between scenes
 */
export function* fadeTransition(duration: number = 0.6): ThreadGenerator {
  const opacity = createSignal(0);

  const endTransition = useTransition(
    ctx => {
      ctx.globalAlpha = opacity();
    },
    ctx => {
      ctx.globalAlpha = 1 - opacity();
    }
  );

  yield* opacity(1, duration, easeInOutCubic);

  endTransition();
}

/**
 * Fade through black (or custom color)
 */
export function* fadeToColorTransition(
  color: string = '#000000',
  duration: number = 1.0
): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const fadeOut = createSignal(0);
  const fadeIn = createSignal(1);

  const endTransition = useTransition(
    ctx => {
      ctx.globalAlpha = fadeIn();
    },
    ctx => {
      ctx.globalAlpha = 1 - fadeOut();
    }
  );

  // Fade out previous scene
  yield* fadeOut(1, duration / 2, easeInCubic);

  // Draw color overlay at midpoint
  const canvas = scene.getView().getCanvasContext();
  canvas.fillStyle = color;
  canvas.fillRect(0, 0, size.x, size.y);

  // Fade in current scene
  yield* fadeIn(1, duration / 2, easeOutCubic);

  endTransition();
}

/**
 * Dip to black - quick fade to black and back
 */
export function* dipToBlackTransition(duration: number = 0.8): ThreadGenerator {
  yield* fadeToColorTransition('#000000', duration);
}

/**
 * Dip to white - quick fade to white and back
 */
export function* dipToWhiteTransition(duration: number = 0.8): ThreadGenerator {
  yield* fadeToColorTransition('#ffffff', duration);
}

/**
 * Crossfade with blur effect
 */
export function* fadeBlurTransition(duration: number = 1.0): ThreadGenerator {
  const opacity = createSignal(0);
  const blur = createSignal(0);

  const endTransition = useTransition(
    ctx => {
      ctx.globalAlpha = opacity();
      if (blur() > 0) {
        ctx.filter = `blur(${blur()}px)`;
      }
    },
    ctx => {
      ctx.globalAlpha = 1 - opacity();
      if (blur() > 0) {
        ctx.filter = `blur(${blur()}px)`;
      }
    }
  );

  // Blur both scenes, then fade
  yield* all(
    blur(10, duration / 2, easeInOutCubic),
    opacity(0.5, duration / 2, easeInOutCubic)
  );

  yield* all(
    blur(0, duration / 2, easeInOutCubic),
    opacity(1, duration / 2, easeInOutCubic)
  );

  endTransition();
}
