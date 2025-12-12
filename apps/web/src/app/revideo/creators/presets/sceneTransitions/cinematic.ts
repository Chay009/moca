/**
 * Cinematic Transitions
 * Film-style transitions with dramatic effects
 */

import { useScene, useTransition, type ThreadGenerator, createSignal, Vector2, easeInOutCubic, easeOutCubic, easeInCubic, easeInOutSine, all, waitFor } from '@revideo/core';

/**
 * Whip pan - fast camera whip between scenes
 */
export function* whipPanTransition(
  direction: 'left' | 'right' = 'left',
  duration: number = 0.5
): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const offset = Vector2.createSignal(Vector2.zero);
  const blur = createSignal(0);
  const opacity = createSignal(0);

  const whipDistance = direction === 'left' ? size.x * 1.5 : -size.x * 1.5;

  const endTransition = useTransition(
    ctx => {
      ctx.globalAlpha = opacity();
      ctx.translate(offset.x(), 0);
      if (blur() > 0) {
        ctx.filter = `blur(${blur()}px)`;
      }
    },
    ctx => {
      ctx.globalAlpha = 1 - opacity();
      ctx.translate(-offset.x() + whipDistance, 0);
      if (blur() > 0) {
        ctx.filter = `blur(${blur()}px)`;
      }
    }
  );

  // Fast acceleration, then deceleration with blur
  yield* all(
    offset(new Vector2(whipDistance, 0), duration / 2, easeInCubic),
    blur(20, duration / 2, easeInCubic),
    opacity(0.5, duration / 2, easeInCubic)
  );

  yield* all(
    offset(Vector2.zero, duration / 2, easeOutCubic),
    blur(0, duration / 2, easeOutCubic),
    opacity(1, duration / 2, easeOutCubic)
  );

  endTransition();
}

/**
 * Glitch transition - digital glitch effect
 */
export function* glitchTransition(duration: number = 1.0): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const glitchIntensity = createSignal(0);
  const opacity = createSignal(0);
  const chromatic = createSignal(0);

  const endTransition = useTransition(
    ctx => {
      ctx.globalAlpha = opacity();

      // Chromatic aberration (RGB split)
      if (chromatic() > 0) {
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = `rgba(255, 0, 0, ${chromatic() * 0.15})`;
        ctx.fillRect(chromatic() * 3, 0, size.x, size.y);
        ctx.fillStyle = `rgba(0, 255, 0, ${chromatic() * 0.15})`;
        ctx.fillRect(-chromatic() * 3, 0, size.x, size.y);
        ctx.globalCompositeOperation = 'source-over';
      }

      // Random glitch displacement
      if (glitchIntensity() > 0.3) {
        const glitchOffset = (Math.random() - 0.5) * glitchIntensity() * 20;
        ctx.translate(glitchOffset, 0);
      }
    },
    ctx => {
      ctx.globalAlpha = 1 - opacity();

      // Glitch the previous scene too
      if (glitchIntensity() > 0.5) {
        const glitchOffset = (Math.random() - 0.5) * glitchIntensity() * 15;
        ctx.translate(glitchOffset, glitchOffset * 0.5);
      }
    }
  );

  // Glitch ramps up, peaks, then resolves
  yield* all(
    glitchIntensity(1, duration * 0.4, easeInCubic),
    chromatic(1, duration * 0.4, easeInCubic),
    opacity(0.3, duration * 0.4, easeInCubic)
  );

  yield* all(
    glitchIntensity(0, duration * 0.6, easeOutCubic),
    chromatic(0, duration * 0.6, easeOutCubic),
    opacity(1, duration * 0.6, easeOutCubic)
  );

  endTransition();
}

/**
 * Film burn transition - vintage film burn effect
 */
export function* filmBurnTransition(duration: number = 1.5): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const burn = createSignal(0);
  const opacity = createSignal(0);
  const flickerSignal = createSignal(1);

  const endTransition = useTransition(
    ctx => {
      // Flickering opacity (old film effect)
      const opacityVal = opacity();
      const flickerVal = flickerSignal();
      ctx.globalAlpha = opacityVal * flickerVal;

      // Sepia tone
      const burnVal = burn();
      ctx.filter = `sepia(${burnVal * 0.8}) brightness(${1 + burnVal * 0.5})`;

      // Vignette effect
      if (burnVal > 0) {
        const gradient = ctx.createRadialGradient(
          size.x / 2, size.y / 2, 0,
          size.x / 2, size.y / 2, size.x * 0.7
        );
        gradient.addColorStop(0, `rgba(255, 200, 100, 0)`);
        gradient.addColorStop(1, `rgba(255, 100, 0, ${burnVal * 0.6})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size.x, size.y);
      }
    },
    ctx => {
      const opacityVal = opacity();
      const flickerVal = flickerSignal();
      const burnVal = burn();
      ctx.globalAlpha = (1 - opacityVal) * flickerVal;
      ctx.filter = `sepia(${(1 - burnVal) * 0.3})`;
    }
  );

  // Random flicker animation
  function* flickerAnimation(): Generator {
    for (let i = 0; i < 10; i++) {
      flickerSignal(0.8 + Math.random() * 0.2);
      yield* waitFor(duration / 10);
    }
  }

  yield* all(
    burn(1, duration, easeInOutCubic),
    opacity(1, duration, easeInOutCubic),
    flickerAnimation()
  );

  endTransition();
}

/**
 * Lens flare transition - bright light flare wipe
 */
export function* lensFlareTransition(duration: number = 1.2): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const flarePos = createSignal(-size.x * 0.2);
  const brightness = createSignal(0);
  const opacity = createSignal(0);

  const endTransition = useTransition(
    ctx => {
      ctx.globalAlpha = opacity();

      // Lens flare gradient moving across screen
      const flareX = flarePos();
      const gradient = ctx.createRadialGradient(
        flareX, size.y / 2, 0,
        flareX, size.y / 2, size.x * 0.4
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${brightness()})`);
      gradient.addColorStop(0.3, `rgba(255, 220, 150, ${brightness() * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size.x, size.y);
    },
    ctx => {
      ctx.globalAlpha = 1 - opacity();
      ctx.filter = `brightness(${1 + brightness() * 0.5})`;
    }
  );

  yield* all(
    flarePos(size.x * 1.2, duration, easeInOutSine),
    brightness(1, duration / 2, easeInCubic),
    opacity(0.5, duration / 2, easeInCubic)
  );

  yield* all(
    brightness(0, duration / 2, easeOutCubic),
    opacity(1, duration / 2, easeOutCubic)
  );

  endTransition();
}

/**
 * Vortex transition - spiral rotation and zoom
 */
export function* vortexTransition(duration: number = 1.5): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const rotation = createSignal(0);
  const scale = createSignal(1);
  const opacity = createSignal(0);

  const endTransition = useTransition(
    ctx => {
      ctx.globalAlpha = opacity();
      ctx.translate(size.x / 2, size.y / 2);
      ctx.rotate(rotation());
      ctx.scale(scale(), scale());
      ctx.translate(-size.x / 2, -size.y / 2);
    },
    ctx => {
      ctx.globalAlpha = 1 - opacity();
      ctx.translate(size.x / 2, size.y / 2);
      ctx.rotate(-rotation() * 0.5);
      ctx.scale(1 / scale(), 1 / scale());
      ctx.translate(-size.x / 2, -size.y / 2);
    }
  );

  yield* all(
    rotation(Math.PI * 2, duration, easeInOutCubic),
    scale(0.5, duration / 2, easeInCubic),
    opacity(0.5, duration / 2, easeInCubic)
  );

  yield* all(
    scale(1, duration / 2, easeOutCubic),
    opacity(1, duration / 2, easeOutCubic)
  );

  endTransition();
}
