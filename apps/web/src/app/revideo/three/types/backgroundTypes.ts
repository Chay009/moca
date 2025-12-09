/**
 * Type definitions for shader-based background scenes
 */

import { ThreeComponentProps } from './threeTypes';

export type ShaderBackgroundType = 'pixelBlast';

export interface PixelBlastBackgroundProps extends ThreeComponentProps {
  type: 'three';
  sceneType: 'pixelBlast';

  // Visual Properties
  variant?: 'square' | 'circle' | 'triangle' | 'diamond';
  pixelSize?: number;
  pixelSizeJitter?: number;

  // Pattern Properties
  patternScale?: number;
  patternDensity?: number;

  // Animation
  speed?: number;

  // Effects
  noiseAmount?: number;
  edgeFade?: number;

  // Standard props inherited from ThreeComponentProps:
  // objectColor, backgroundColor, width, height, x, y, etc.
}

export type BackgroundProps = PixelBlastBackgroundProps;
