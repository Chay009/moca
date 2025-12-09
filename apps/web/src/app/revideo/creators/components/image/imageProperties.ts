/**
 * Complete Image Component Properties
 * All properties from the Img API (extends Rect, which extends Node)
 * Organized by category for UI implementation
 */

import type { ImgProps } from '@revideo/2d';

/**
 * Complete Img Node Properties
 * This is the full type from Revideo - use this for type safety
 */
export type ImgNodeProperties = ImgProps;

/**
 * Property Categories for UI Organization
 */
export const PROPERTY_CATEGORIES = {
    CORE: 'Image Source & Display',
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
        'src',        // Image source URL
        'alpha',      // Image-only transparency (0-1)
        'smoothing',  // Image smoothing (true = smooth, false = pixelated)
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
        'fill',       // Background color (behind image)
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
        'cachePaddingTop',
        'cachePaddingRight',
        'cachePaddingBottom',
        'cachePaddingLeft',
    ],
    [PROPERTY_CATEGORIES.SYSTEM]: [
        'key',
        'ref',
        'children',
    ],
});

/**
 * Base image properties for UI controls and default props
 */
export const BASE_IMAGE_PROPS = {
    // Core image props
    src: 'https://images.unsplash.com/photo-1688822863426-8c5f9b257090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90',
    alpha: 1,
    smoothing: true,

    // Layout 
    // #####
    width: 300,
    height: 300,
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
 * Image property categories for UI organization (legacy)
 */
export const IMAGE_PROPERTY_CATEGORIES = {
    CORE: 'Image Source & Display',
    LAYOUT: 'Size & Position',
    VISUAL: 'Colors & Effects',
    TRANSFORM: 'Transform',
};
