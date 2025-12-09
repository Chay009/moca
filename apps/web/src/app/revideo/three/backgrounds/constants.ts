/**
 * Default configurations for shader backgrounds
 */

import { PixelBlastBackgroundProps } from '../types/backgroundTypes';

export const DEFAULT_PIXEL_BLAST_CONFIG: Partial<PixelBlastBackgroundProps> = {
  // Visual
  variant: 'square',
  pixelSize: 3,
  pixelSizeJitter: 0,

  // Pattern
  patternScale: 2,
  patternDensity: 1,

  // Animation
  speed: 1,

  // Effects
  noiseAmount: 0,
  edgeFade: 0.5,

  // Colors
  objectColor: '#B19EEF',
  backgroundColor: '#000000',

  // Dimensions
  width: 1920,
  height: 1080,
};

export const SHAPE_MAP = {
  square: 0,
  circle: 1,
  triangle: 2,
  diamond: 3,
} as const;
