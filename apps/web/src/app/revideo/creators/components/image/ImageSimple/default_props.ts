/**
 * Image Simple Component - Default Props
 */

import { DEFAULT_COMPONENT_ANIMATION } from '../../../animations';
import { BASE_IMAGE_PROPS, type ImgNodeProperties } from '../imageProperties';

/**
 * Default properties for ImageSimple component
 * Based on ImgNodeProperties with additional custom props
 */
export const IMAGE_SIMPLE_DEFAULT_PROPS: Record<string, any> = {
    // Visual props (from BASE_IMAGE_PROPS)
    ...BASE_IMAGE_PROPS, // here in this always make sure both height and width are defined if not is will show 
    // network image loading issues which is hard to debug

    // Filters (image effects like blur, brightness, etc.)
    filters: [],

    // Animation config (behavior)
    animation: {
        ...DEFAULT_COMPONENT_ANIMATION,
        imageEffect: {
            type: 'none' as const,
            duration: 0,
            intensity: 0,
        },
    },
};
