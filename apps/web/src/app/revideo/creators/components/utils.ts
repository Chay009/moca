/**
 * Component Registry Utilities
 * Helper functions for working with the component registry
 */

import { componentRegistry } from '@/app/revideo/creators/components/registry';
import type { ComponentPlugin } from '@/app/revideo/creators/types/componentPlugin';

/**
 * Get component from registry by type
 */
export function getComponentByType(type: string): ComponentPlugin | undefined {
    return componentRegistry[type];
}

/**
 * Check if element type belongs to a specific category
 */
export function isCategory(elementType: string, category: string): boolean {
    const component = componentRegistry[elementType];
    return component?.category === category;
}

/**
 * Check if element is a text component
 */
export function isTextComponent(elementType: string): boolean {
    return isCategory(elementType, 'text');
}

/**
 * Check if element is a media component (image/video/audio)
 */
export function isMediaComponent(elementType: string): boolean {
    return isCategory(elementType, 'media');
}

/**
 * Check if element is an image component
 */
export function isImageComponent(elementType: string): boolean {
    return isCategory(elementType, 'image');
}

/**
 * Check if element is a video component
 */
export function isVideoComponent(elementType: string): boolean {
    return elementType === 'video-simple' || isCategory(elementType, 'media');
}

/**
 * Check if element is a shape component
 */
export function isShapeComponent(elementType: string): boolean {
    return isCategory(elementType, 'shapes');
}

/**
 * Get display name for element type
 */
export function getDisplayName(elementType: string): string {
    const component = componentRegistry[elementType];
    return component?.displayName || elementType;
}

/**
 * Get default props for element type
 */
export function getDefaultProps(elementType: string): Record<string, any> {
    const component = componentRegistry[elementType];
    return component?.defaultProps || {};
}

/**
 * Check if element is a device mockup component (three type with device sceneType)
 */
export function isDeviceComponent(elementType: string, properties?: Record<string, any>): boolean {
    if (elementType !== 'three') return false;
    const sceneType = properties?.sceneType;
    return sceneType === 'iphone' || sceneType === 'device';
}
