/**
 * Scene Transitions Registry
 * Maps transition names to their implementations
 */

import { ThreadGenerator } from '@revideo/core';

// Slide transitions
import {
  slideTransition,
  pushTransition,
  slideFadeTransition,
  SlideDirection,
} from './slide';

// Fade transitions
import {
  fadeTransition,
  fadeToColorTransition,
  dipToBlackTransition,
  dipToWhiteTransition,
  fadeBlurTransition,
} from './fade';

// Zoom transitions
import {
  zoomInTransition,
  zoomOutTransition,
  zoomRotateTransition,
  kenBurnsTransition,
  dollyZoomTransition,
} from './zoom';

// Cinematic transitions
import {
  whipPanTransition,
  glitchTransition,
  filmBurnTransition,
  lensFlareTransition,
  vortexTransition,
} from './cinematic';

// Wipe transitions
import {
  wipeTransition,
  clockWipeTransition,
  irisWipeTransition,
  barnDoorWipeTransition,
  diamondWipeTransition,
  diagonalWipeTransition,
  WipeDirection,
} from './wipe';

export interface TransitionPreset {
  name: string;
  category: 'slide' | 'fade' | 'zoom' | 'cinematic' | 'wipe';
  description: string;
  duration: number; // default duration
  generator: (...args: any[]) => ThreadGenerator;
  thumbnail?: string; // optional preview image path
}

export const sceneTransitionsRegistry: Record<string, TransitionPreset> = {
  // Slide transitions
  'slide-left': {
    name: 'Slide Left',
    category: 'slide',
    description: 'Slide to the left',
    duration: 0.8,
    generator: (duration = 0.8) => slideTransition('left', duration),
  },
  'slide-right': {
    name: 'Slide Right',
    category: 'slide',
    description: 'Slide to the right',
    duration: 0.8,
    generator: (duration = 0.8) => slideTransition('right', duration),
  },
  'slide-up': {
    name: 'Slide Up',
    category: 'slide',
    description: 'Slide upward',
    duration: 0.8,
    generator: (duration = 0.8) => slideTransition('up', duration),
  },
  'slide-down': {
    name: 'Slide Down',
    category: 'slide',
    description: 'Slide downward',
    duration: 0.8,
    generator: (duration = 0.8) => slideTransition('down', duration),
  },
  'push-left': {
    name: 'Push Left',
    category: 'slide',
    description: 'Push scene to the left',
    duration: 0.8,
    generator: (duration = 0.8) => pushTransition('left', duration),
  },
  'slide-fade': {
    name: 'Slide Fade',
    category: 'slide',
    description: 'Slide with fade effect',
    duration: 1.0,
    generator: (duration = 1.0, direction: SlideDirection = 'left') =>
      slideFadeTransition(direction, duration),
  },

  // Fade transitions
  'fade': {
    name: 'Fade',
    category: 'fade',
    description: 'Simple crossfade',
    duration: 0.6,
    generator: (duration = 0.6) => fadeTransition(duration),
  },
  'fade-to-black': {
    name: 'Fade to Black',
    category: 'fade',
    description: 'Fade through black',
    duration: 1.0,
    generator: (duration = 1.0) => fadeToColorTransition('#000000', duration),
  },
  'dip-to-black': {
    name: 'Dip to Black',
    category: 'fade',
    description: 'Quick dip to black',
    duration: 0.8,
    generator: (duration = 0.8) => dipToBlackTransition(duration),
  },
  'dip-to-white': {
    name: 'Dip to White',
    category: 'fade',
    description: 'Quick dip to white',
    duration: 0.8,
    generator: (duration = 0.8) => dipToWhiteTransition(duration),
  },
  'fade-blur': {
    name: 'Fade with Blur',
    category: 'fade',
    description: 'Crossfade with blur effect',
    duration: 1.0,
    generator: (duration = 1.0) => fadeBlurTransition(duration),
  },

  // Zoom transitions
  'zoom-in': {
    name: 'Zoom In',
    category: 'zoom',
    description: 'Zoom into the scene',
    duration: 0.8,
    generator: (duration = 0.8, area?) => zoomInTransition(area, duration),
  },
  'zoom-out': {
    name: 'Zoom Out',
    category: 'zoom',
    description: 'Zoom out from the scene',
    duration: 0.8,
    generator: (duration = 0.8, area?) => zoomOutTransition(area, duration),
  },
  'zoom-rotate': {
    name: 'Zoom Rotate',
    category: 'zoom',
    description: 'Cinematic zoom with rotation',
    duration: 1.2,
    generator: (duration = 1.2) => zoomRotateTransition(duration),
  },
  'ken-burns': {
    name: 'Ken Burns',
    category: 'zoom',
    description: 'Slow zoom and pan effect',
    duration: 2.0,
    generator: (duration = 2.0) => kenBurnsTransition(duration),
  },
  'dolly-zoom': {
    name: 'Dolly Zoom (Vertigo)',
    category: 'zoom',
    description: 'Classic Hitchcock vertigo effect',
    duration: 1.5,
    generator: (duration = 1.5) => dollyZoomTransition(duration),
  },

  // Cinematic transitions
  'whip-pan-left': {
    name: 'Whip Pan Left',
    category: 'cinematic',
    description: 'Fast camera whip to the left',
    duration: 0.5,
    generator: (duration = 0.5) => whipPanTransition('left', duration),
  },
  'whip-pan-right': {
    name: 'Whip Pan Right',
    category: 'cinematic',
    description: 'Fast camera whip to the right',
    duration: 0.5,
    generator: (duration = 0.5) => whipPanTransition('right', duration),
  },
  'glitch': {
    name: 'Glitch',
    category: 'cinematic',
    description: 'Digital glitch effect',
    duration: 1.0,
    generator: (duration = 1.0) => glitchTransition(duration),
  },
  'film-burn': {
    name: 'Film Burn',
    category: 'cinematic',
    description: 'Vintage film burn effect',
    duration: 1.5,
    generator: (duration = 1.5) => filmBurnTransition(duration),
  },
  'lens-flare': {
    name: 'Lens Flare',
    category: 'cinematic',
    description: 'Bright light flare sweep',
    duration: 1.2,
    generator: (duration = 1.2) => lensFlareTransition(duration),
  },
  'vortex': {
    name: 'Vortex',
    category: 'cinematic',
    description: 'Spiral rotation and zoom',
    duration: 1.5,
    generator: (duration = 1.5) => vortexTransition(duration),
  },

  // Wipe transitions
  'wipe-left': {
    name: 'Wipe Left',
    category: 'wipe',
    description: 'Wipe from right to left',
    duration: 0.8,
    generator: (duration = 0.8) => wipeTransition('left', duration),
  },
  'wipe-right': {
    name: 'Wipe Right',
    category: 'wipe',
    description: 'Wipe from left to right',
    duration: 0.8,
    generator: (duration = 0.8) => wipeTransition('right', duration),
  },
  'clock-wipe': {
    name: 'Clock Wipe',
    category: 'wipe',
    description: 'Circular wipe like a clock',
    duration: 1.0,
    generator: (duration = 1.0, clockwise = true) =>
      clockWipeTransition(clockwise, duration),
  },
  'iris-expand': {
    name: 'Iris Expand',
    category: 'wipe',
    description: 'Circular expand from center',
    duration: 0.8,
    generator: (duration = 0.8) => irisWipeTransition(true, undefined, undefined, duration),
  },
  'iris-contract': {
    name: 'Iris Contract',
    category: 'wipe',
    description: 'Circular contract to center',
    duration: 0.8,
    generator: (duration = 0.8) => irisWipeTransition(false, undefined, undefined, duration),
  },
  'barn-door-horizontal': {
    name: 'Barn Door (Horizontal)',
    category: 'wipe',
    description: 'Doors open horizontally',
    duration: 1.0,
    generator: (duration = 1.0) => barnDoorWipeTransition(true, duration),
  },
  'barn-door-vertical': {
    name: 'Barn Door (Vertical)',
    category: 'wipe',
    description: 'Doors open vertically',
    duration: 1.0,
    generator: (duration = 1.0) => barnDoorWipeTransition(false, duration),
  },
  'diamond-wipe': {
    name: 'Diamond Wipe',
    category: 'wipe',
    description: 'Diamond shape expansion',
    duration: 1.0,
    generator: (duration = 1.0) => diamondWipeTransition(duration),
  },
  'diagonal-wipe': {
    name: 'Diagonal Wipe',
    category: 'wipe',
    description: 'Diagonal corner-to-corner wipe',
    duration: 0.8,
    generator: (duration = 0.8, topLeftToBottomRight = true) =>
      diagonalWipeTransition(topLeftToBottomRight, duration),
  },
};

/**
 * Helper function to get transitions by category
 */
export function getTransitionsByCategory(
  category: TransitionPreset['category']
): TransitionPreset[] {
  return Object.values(sceneTransitionsRegistry).filter(
    (preset) => preset.category === category
  );
}

/**
 * Helper function to get all transition names
 */
export function getAllTransitionNames(): string[] {
  return Object.keys(sceneTransitionsRegistry);
}

/**
 * Helper function to get transition by name
 */
export function getTransition(name: string): TransitionPreset | undefined {
  return sceneTransitionsRegistry[name];
}
