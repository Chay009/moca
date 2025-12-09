/**
 * Image Components Registry
 * All image-based components
 */

import type { ComponentRegistry } from '../../types/componentPlugin';
import { ImageSimpleComponent } from './ImageSimple/index';

export const imageComponents: ComponentRegistry = {
    [ImageSimpleComponent.type]: ImageSimpleComponent,
};
