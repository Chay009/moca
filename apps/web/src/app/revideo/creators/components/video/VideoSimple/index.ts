
/**
 * Video Simple Component - Plugin Definition
 * Combines metadata, creator function, and UI into a single plugin
 */

import type { ComponentPlugin } from '../../../types/componentPlugin';
import { VIDEO_SIMPLE_DEFAULT_PROPS } from './default_props';
import { createVideoSimple } from './animation';

export const VideoSimpleComponent: ComponentPlugin = {
    type: 'video-simple',
    category: 'media',
    displayName: 'Video',
    icon: '🎬',

    defaultProps: VIDEO_SIMPLE_DEFAULT_PROPS,
    create: createVideoSimple,
};

