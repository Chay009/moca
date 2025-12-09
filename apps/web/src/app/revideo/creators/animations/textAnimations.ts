/**
 * Text-Specific Animation Types
 * Animations that only work for text components
 */

import type { BaseAnimationConfig } from './sharedAnimations';

/**
 * Text-specific effect animations
 */
export type TextEffectType =
    | 'typewriter'
    | 'glitch'
    | 'wave'
    | 'bounce-letters'
    | 'fade-letters'
    | 'scramble'
    | 'rainbow'
    | 'none';

export interface TextEffectConfig extends BaseAnimationConfig {
    type: TextEffectType;
    stagger?: number; // Delay between each letter
    intensity?: number; // Effect intensity (0-1)
}

/**
 * Default text effect configurations
 */
export const DEFAULT_TEXT_EFFECT: TextEffectConfig = {
    type: 'none',
    duration: 2,
    delay: 0,
    stagger: 0.05,
    intensity: 1,
    easing: 'linear',
};

/**
 * Text effect presets
 */
export const TEXT_EFFECT_PRESETS = {
    typewriter: { type: 'typewriter' as const, duration: 2, stagger: 0.05, easing: 'linear' as const },
    glitch: { type: 'glitch' as const, duration: 1, intensity: 0.8, easing: 'linear' as const },
    wave: { type: 'wave' as const, duration: 2, stagger: 0.1, intensity: 0.5, easing: 'easeInOut' as const },
    'bounce-letters': { type: 'bounce-letters' as const, duration: 1.5, stagger: 0.05, easing: 'bounce' as const },
    'fade-letters': { type: 'fade-letters' as const, duration: 2, stagger: 0.05, easing: 'easeIn' as const },
    scramble: { type: 'scramble' as const, duration: 1.5, stagger: 0.03, easing: 'linear' as const },
    rainbow: { type: 'rainbow' as const, duration: 3, stagger: 0.1, easing: 'linear' as const },
};
