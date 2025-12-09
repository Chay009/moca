/**
 * Media-Specific Animation Presets
 * Cinematic effects for image/video components with filter support
 */

import type { BaseAnimationConfig } from './sharedAnimations';

/**
 * Media-specific effect animations
 */
export type MediaEffectType =
    | 'ken-burns' // Slow zoom and pan
    | 'parallax'
    | 'blur-in'
    | 'blur-out'
    | 'pixelate-in'
    | 'pixelate-out'
    | 'photo-reveal'
    | 'zoom-in'
    | 'zoom-out'
    | 'polaroid-flip'
    | 'grayscale-fade'
    | 'color-pop'
    | 'vintage-fade'
    | 'glitch'
    | 'fade-through-black'
    | 'none';

export interface MediaEffectConfig extends BaseAnimationConfig {
    type: MediaEffectType;
    intensity?: number; // Effect intensity (0-1)
    direction?: 'horizontal' | 'vertical' | 'diagonal'; // For parallax/ken-burns
}

/**
 * Animation preset with property configurations
 */
export interface MediaAnimationPreset {
    name: string;
    description: string;
    category: 'entrance' | 'exit' | 'emphasis' | 'cinematic' | 'transition';
    duration: number;
    properties: Record<string, any>;
    easing: string;
}

/**
 * Default media effect configurations
 */
export const DEFAULT_MEDIA_EFFECT: MediaEffectConfig = {
    type: 'none',
    duration: 3,
    delay: 0,
    intensity: 0.5,
    easing: 'easeInOut',
};

/**
 * Comprehensive Media Animation Presets
 */
export const MEDIA_ANIMATION_PRESETS: Record<string, MediaAnimationPreset> = {
    'ken-burns': {
        name: 'Ken Burns',
        description: 'Classic documentary-style pan and zoom',
        category: 'cinematic',
        duration: 5,
        properties: {
            scale: { from: 1, to: 1.2 },
            x: { from: 0, to: -50 },
            y: { from: 0, to: -30 },
        },
        easing: 'easeInOut',
    },
    'photo-reveal': {
        name: 'Photo Reveal',
        description: 'Horizontal wipe revealing the image',
        category: 'entrance',
        duration: 1.5,
        properties: {
            clip: { from: true, to: true },
            width: { from: 0, to: 'auto' },
            opacity: { from: 1, to: 1 },
        },
        easing: 'easeOut',
    },
    'zoom-in': {
        name: 'Zoom In',
        description: 'Scale up from small to normal size',
        category: 'entrance',
        duration: 1,
        properties: {
            scale: { from: 0.5, to: 1 },
            opacity: { from: 0, to: 1 },
        },
        easing: 'easeOut',
    },
    'zoom-out': {
        name: 'Zoom Out',
        description: 'Scale down and fade out',
        category: 'exit',
        duration: 1,
        properties: {
            scale: { from: 1, to: 1.5 },
            opacity: { from: 1, to: 0 },
        },
        easing: 'easeIn',
    },
    parallax: {
        name: 'Parallax Scroll',
        description: 'Slow vertical pan for depth effect',
        category: 'cinematic',
        duration: 4,
        properties: {
            y: { from: 0, to: -100 },
        },
        easing: 'linear',
    },
    'polaroid-flip': {
        name: 'Polaroid Flip',
        description: 'Flip in like a polaroid photo',
        category: 'entrance',
        duration: 1.2,
        properties: {
            rotation: { from: -15, to: 0 },
            scale: { from: 0.8, to: 1 },
            opacity: { from: 0, to: 1 },
            y: { from: 50, to: 0 },
        },
        easing: 'easeOut',
    },
    'blur-in': {
        name: 'Blur In',
        description: 'Fade in from blurred state',
        category: 'entrance',
        duration: 1.5,
        properties: {
            filters: {
                from: [{ blur: 20 }],
                to: [{ blur: 0 }],
            },
            opacity: { from: 0, to: 1 },
        },
        easing: 'easeOut',
    },
    'blur-out': {
        name: 'Blur Out',
        description: 'Fade out to blurred state',
        category: 'exit',
        duration: 1.5,
        properties: {
            filters: {
                from: [{ blur: 0 }],
                to: [{ blur: 20 }],
            },
            opacity: { from: 1, to: 0 },
        },
        easing: 'easeIn',
    },
    'grayscale-fade': {
        name: 'Grayscale Fade',
        description: 'Fade from grayscale to full color',
        category: 'emphasis',
        duration: 2,
        properties: {
            filters: {
                from: [{ grayscale: 1 }],
                to: [{ grayscale: 0 }],
            },
        },
        easing: 'easeInOut',
    },
    'color-pop': {
        name: 'Color Pop',
        description: 'Boost saturation for vibrant effect',
        category: 'emphasis',
        duration: 1,
        properties: {
            filters: {
                from: [{ saturate: 1 }],
                to: [{ saturate: 2 }],
            },
            scale: { from: 1, to: 1.05 },
        },
        easing: 'easeOut',
    },
    'vintage-fade': {
        name: 'Vintage Fade',
        description: 'Fade to vintage sepia tone',
        category: 'emphasis',
        duration: 2,
        properties: {
            filters: {
                from: [{ sepia: 0 }],
                to: [{ sepia: 0.8 }, { brightness: 1.1 }],
            },
        },
        easing: 'easeInOut',
    },
    glitch: {
        name: 'Glitch Effect',
        description: 'Digital glitch with hue shift',
        category: 'emphasis',
        duration: 0.5,
        properties: {
            filters: {
                from: [{ hue: 0 }],
                to: [{ hue: 180 }],
            },
            x: { from: 0, to: 10 },
        },
        easing: 'linear',
    },
    'fade-through-black': {
        name: 'Fade Through Black',
        description: 'Fade to black and back',
        category: 'transition',
        duration: 2,
        properties: {
            filters: {
                from: [{ brightness: 1 }],
                to: [{ brightness: 0 }],
            },
        },
        easing: 'easeInOut',
    },
    'pixelate-in': {
        name: 'Pixelate In',
        description: 'Fade in from pixelated state',
        category: 'entrance',
        duration: 1.5,
        properties: {
            filters: {
                from: [{ blur: 10 }],
                to: [{ blur: 0 }],
            },
            opacity: { from: 0, to: 1 },
        },
        easing: 'easeOut',
    },
    'pixelate-out': {
        name: 'Pixelate Out',
        description: 'Fade out to pixelated state',
        category: 'exit',
        duration: 1.5,
        properties: {
            filters: {
                from: [{ blur: 0 }],
                to: [{ blur: 10 }],
            },
            opacity: { from: 1, to: 0 },
        },
        easing: 'easeIn',
    },
};

/**
 * Legacy preset configs (for backward compatibility)
 */
export const MEDIA_EFFECT_PRESETS = {
    'ken-burns': {
        type: 'ken-burns' as const,
        duration: 5,
        intensity: 0.3,
        direction: 'diagonal' as const,
        easing: 'easeInOut' as const
    },
    parallax: {
        type: 'parallax' as const,
        duration: 2,
        intensity: 0.5,
        direction: 'horizontal' as const,
        easing: 'linear' as const
    },
    'blur-in': {
        type: 'blur-in' as const,
        duration: 1,
        intensity: 1,
        easing: 'easeOut' as const
    },
    'blur-out': {
        type: 'blur-out' as const,
        duration: 1,
        intensity: 1,
        easing: 'easeIn' as const
    },
    'pixelate-in': {
        type: 'pixelate-in' as const,
        duration: 1.5,
        intensity: 1,
        easing: 'easeOut' as const
    },
    'pixelate-out': {
        type: 'pixelate-out' as const,
        duration: 1.5,
        intensity: 1,
        easing: 'easeIn' as const
    },
};

/**
 * Get animations by category
 */
export const getMediaAnimationsByCategory = (category: string) => {
    return Object.values(MEDIA_ANIMATION_PRESETS).filter(
        (anim) => anim.category === category
    );
};

/**
 * Animation categories
 */
export const MEDIA_ANIMATION_CATEGORIES = {
    ENTRANCE: 'entrance',
    EXIT: 'exit',
    EMPHASIS: 'emphasis',
    CINEMATIC: 'cinematic',
    TRANSITION: 'transition',
} as const;
