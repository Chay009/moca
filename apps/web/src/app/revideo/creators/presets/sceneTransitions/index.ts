/**
 * Scene Transitions Presets
 * Export all transition presets for easy importing
 */

// Registry and types
export * from './registry';
export type { SlideDirection } from './slide';
export type { WipeDirection } from './wipe';

// Slide transitions
export {
  slideTransition,
  pushTransition,
  slideFadeTransition,
} from './slide';

// Fade transitions
export {
  fadeTransition,
  fadeToColorTransition,
  dipToBlackTransition,
  dipToWhiteTransition,
  fadeBlurTransition,
} from './fade';

// Zoom transitions
export {
  zoomInTransition,
  zoomOutTransition,
  zoomRotateTransition,
  kenBurnsTransition,
  dollyZoomTransition,
} from './zoom';

// Cinematic transitions
export {
  whipPanTransition,
  glitchTransition,
  filmBurnTransition,
  lensFlareTransition,
  vortexTransition,
} from './cinematic';

// Wipe transitions
export {
  wipeTransition,
  clockWipeTransition,
  irisWipeTransition,
  barnDoorWipeTransition,
  diamondWipeTransition,
  diagonalWipeTransition,
} from './wipe';
