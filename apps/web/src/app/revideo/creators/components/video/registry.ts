/**
 * Video Components Registry
 * All video-based components
 */

import type { ComponentRegistry } from '../../types/componentPlugin';
import { VideoSimpleComponent } from './VideoSimple/index';

export const videoComponents: ComponentRegistry = {
    [VideoSimpleComponent.type]: VideoSimpleComponent,
};

