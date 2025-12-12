/**
 * Text Effects Registry
 * Maps effect type strings to effect implementations
 */

import { typewriterEffect } from './typewriter';
import { glitchEffect } from './glitch';
import { waveEffect } from './wave';
import { shimmerEffect } from './shimmer';
import { blurEffect } from './blur';

export interface TextEffect {
  createNode: (props: any) => {
    node: any;
    ref?: any;
    refs?: any[];
  };
  animate: (refs: any, props: any) => Generator<any, void, any>;
}

export const textEffectsRegistry: Record<string, TextEffect> = {
  'typewriter': typewriterEffect,
  'glitch': glitchEffect,
  'wave': waveEffect,
  'shimmer': shimmerEffect,
  'blur': blurEffect,
};
