/**
 * Shared Animation Library
 * Common animations that work across all component types
 */

export type AnimationEasing = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce' | 'elastic';

export interface BaseAnimationConfig {
    duration?: number;
    delay?: number;
    easing?: AnimationEasing;
}

/**
 * Common entrance animations (work for all components)
 */
export type EntranceAnimationType =
    | 'fade-in'
    | 'slide-in-left'
    | 'slide-in-right'
    | 'slide-in-up'
    | 'slide-in-down'
    | 'scale-in'
    | 'rotate-in'
    | 'none';

export interface EntranceAnimationConfig extends BaseAnimationConfig {
    type: EntranceAnimationType;
}

/**
 * Common exit animations (work for all components)
 */
export type ExitAnimationType =
    | 'fade-out'
    | 'slide-out-left'
    | 'slide-out-right'
    | 'slide-out-up'
    | 'slide-out-down'
    | 'scale-out'
    | 'rotate-out'
    | 'none';

export interface ExitAnimationConfig extends BaseAnimationConfig {
    type: ExitAnimationType;
}

/**
 * Default animation configurations
 */
export const DEFAULT_ENTRANCE_ANIMATION: EntranceAnimationConfig = {
    type: 'fade-in',
    duration: 1,
    delay: 0,
    easing: 'easeInOut',
};

export const DEFAULT_EXIT_ANIMATION: ExitAnimationConfig = {
    type: 'fade-out',
    duration: 1,
    delay: 0,
    easing: 'easeInOut',
};

/**
 * Animation presets for quick selection
 */
export const ANIMATION_PRESETS = {
    entrance: {
        'fade-in': { type: 'fade-in' as const, duration: 1, easing: 'easeInOut' as const },
        'slide-in-left': { type: 'slide-in-left' as const, duration: 0.8, easing: 'easeOut' as const },
        'slide-in-right': { type: 'slide-in-right' as const, duration: 0.8, easing: 'easeOut' as const },
        'slide-in-up': { type: 'slide-in-up' as const, duration: 0.8, easing: 'easeOut' as const },
        'slide-in-down': { type: 'slide-in-down' as const, duration: 0.8, easing: 'easeOut' as const },
        'scale-in': { type: 'scale-in' as const, duration: 0.6, easing: 'bounce' as const },
        'rotate-in': { type: 'rotate-in' as const, duration: 1, easing: 'elastic' as const },
    },
    exit: {
        'fade-out': { type: 'fade-out' as const, duration: 1, easing: 'easeInOut' as const },
        'slide-out-left': { type: 'slide-out-left' as const, duration: 0.8, easing: 'easeIn' as const },
        'slide-out-right': { type: 'slide-out-right' as const, duration: 0.8, easing: 'easeIn' as const },
        'slide-out-up': { type: 'slide-out-up' as const, duration: 0.8, easing: 'easeIn' as const },
        'slide-out-down': { type: 'slide-out-down' as const, duration: 0.8, easing: 'easeIn' as const },
        'scale-out': { type: 'scale-out' as const, duration: 0.6, easing: 'easeIn' as const },
        'rotate-out': { type: 'rotate-out' as const, duration: 1, easing: 'easeIn' as const },
    },
};
