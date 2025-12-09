/**
 * Video Simple Component - Default Props
 */

import { DEFAULT_COMPONENT_ANIMATION } from '../../../animations';
import { BASE_VIDEO_PROPS, type VideoNodeProperties } from '../videoProperties';

/**
 * Default properties for VideoSimple component
 * Based on VideoNodeProperties with additional custom props
 */
export const VIDEO_SIMPLE_DEFAULT_PROPS: Record<string, any> = {
    // Visual props (from BASE_VIDEO_PROPS)
    ...BASE_VIDEO_PROPS,

    // Filters (video effects like blur, brightness, etc.)
    filters: [],

    // Animation config (behavior)
    animation: {
        ...DEFAULT_COMPONENT_ANIMATION,
        mediaEffect: {
            type: 'none' as const,
            duration: 0,
            intensity: 0,
        },
    },
};
