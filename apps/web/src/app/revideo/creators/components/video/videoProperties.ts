/**
 * Video Component Properties
 * All properties from the Video API (extends Rect, which extends Node)
 * Organized by category for UI implementation
 */

import type { VideoProps } from '@revideo/2d';

/**
 * Complete Video Node Properties
 * This is the full type from Revideo - use this for type safety
 */
export type VideoNodeProperties = VideoProps;

/**
 * Property Categories for UI Organization
 */
export const PROPERTY_CATEGORIES = {
    CORE: 'Video Source & Playback',
    TRANSFORM: 'Transform',
    SIZE_LAYOUT: 'Size & Layout',
    FILL_STROKE: 'Fill & Stroke',
    SHADOW: 'Shadow',
    RENDERING: 'Rendering & Effects',
    SYSTEM: 'System',
} as const;

/**
 * Helper: Get all property keys by category
 */
export const getPropertiesByCategory = () => ({
    [PROPERTY_CATEGORIES.CORE]: [
        'src',        // Video source URL
        'alpha',      // Video-only transparency (0-1)
        'smoothing',  // Video smoothing (true = smooth, false = pixelated)
        'play',       // Auto-play on load
        'playbackRate', // Playback speed (1 = normal, 2 = 2x, etc.)
        'volume',     // Audio volume (0-1)
        'time',       // Current playback time (seek)
    ],
    [PROPERTY_CATEGORIES.TRANSFORM]: [
        'x',
        'y',
        'position',
        'rotation',
        'scale',
        'scaleX',
        'scaleY',
        'skew',
        'skewX',
        'skewY',
        'offset',
        'offsetX',
        'offsetY',
    ],
    [PROPERTY_CATEGORIES.SIZE_LAYOUT]: [
        'width',
        'height',
        'size',
        'ratio',      // Aspect ratio override
        'radius',     // Corner radius
        'clip',       // Clip content to bounds
    ],
    [PROPERTY_CATEGORIES.FILL_STROKE]: [
        'fill',       // Background color (behind video)
        'stroke',     // Border color
        'lineWidth',  // Border width
        'lineCap',
        'lineJoin',
        'lineDash',
        'lineDashOffset',
        'strokeFirst',
    ],
    [PROPERTY_CATEGORIES.SHADOW]: [
        'shadowBlur',
        'shadowColor',
        'shadowOffset',
        'shadowOffsetX',
        'shadowOffsetY',
    ],
    [PROPERTY_CATEGORIES.RENDERING]: [
        'opacity',    // Overall transparency (affects everything)
        'zIndex',
        'filters',    // CSS filters (blur, brightness, etc.)
        'shaders',
        'composite',
        'compositeOperation',
        'cache',
        'cachePadding',
    ],
    [PROPERTY_CATEGORIES.SYSTEM]: [
        'key',
        'ref',
        'children',
    ],
});

/**
 * Base video properties for UI controls and default props
 */
export const BASE_VIDEO_PROPS = {
    // Core video props
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    alpha: 1,
    smoothing: true,
    play: true,
    playbackRate: 1,
    volume: 1,
    time: 0,

    // Layout 
    width: 640,
    height: 360,
    x: 0,
    y: 0,
    ratio: undefined,

    // Visual
    fill: undefined,
    stroke: undefined,
    lineWidth: 0,
    radius: 0,
    opacity: 1,
    clip: false,

    // Transform
    rotation: 0,
    scale: 1,
    scaleX: undefined,
    scaleY: undefined,
    skewX: 0,
    skewY: 0,

    // Effects
    filters: [],
    shadowBlur: 0,
    shadowColor: undefined,
    shadowOffsetX: 0,
    shadowOffsetY: 0,

    // System
    zIndex: 0,
};

/**
 * Video property categories for UI organization (legacy)
 */
export const VIDEO_PROPERTY_CATEGORIES = {
    CORE: 'Video Source & Playback',
    LAYOUT: 'Size & Position',
    VISUAL: 'Colors & Effects',
    TRANSFORM: 'Transform',
};
