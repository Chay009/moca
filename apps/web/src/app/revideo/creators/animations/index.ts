/**
 * Animation System - Central Export
 * 
 * Architecture:
 * - Shared animations: Work for ALL components (fade, slide, scale, rotate)
 * - Component-specific: Only for certain types (text effects, media effects)
 * 
 * Usage in components:
 * 1. Add animation config to defaultProps
 * 2. Read config in animation.tsx creator function
 * 3. Apply animations via ref methods
 */

// Shared animations (all components)
export * from './sharedAnimations';

// Component-specific animations
export * from './textAnimations';
export * from './mediaAnimations';

/**
 * Complete animation configuration for any component
 */
export interface ComponentAnimationConfig {
    entrance?: import('./sharedAnimations').EntranceAnimationConfig;
    exit?: import('./sharedAnimations').ExitAnimationConfig;

    // Component-specific (optional, based on type)
    textEffect?: import('./textAnimations').TextEffectConfig;
    mediaEffect?: import('./mediaAnimations').MediaEffectConfig;
}

/**
 * Default animation config for new components
 */
export const DEFAULT_COMPONENT_ANIMATION: ComponentAnimationConfig = {
    entrance: {
        type: 'fade-in',
        duration: 1,
        delay: 0,
        easing: 'easeInOut',
    },
    exit: {
        type: 'none',
        duration: 0,
        delay: 0,
        easing: 'linear',
    },
};
