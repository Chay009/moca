/**
 * Image Simple Component - Plugin Definition
 * Combines metadata, creator function, and UI into a single plugin
 */

import type { ComponentPlugin } from '../../../types/componentPlugin';
import { IMAGE_SIMPLE_DEFAULT_PROPS } from './default_props';
import { createImageSimple } from './animation';

export const ImageSimpleComponent: ComponentPlugin = {
    type: 'image-simple',
    category: 'image',
    displayName: 'Image',
    icon: '🖼️',

    defaultProps: IMAGE_SIMPLE_DEFAULT_PROPS,
    create: createImageSimple,
};
