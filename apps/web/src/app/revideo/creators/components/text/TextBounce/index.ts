/**
 * Text Bounce Component - Plugin Definition
 * Combines metadata, creator function, and UI into a single plugin
 */

import type { ComponentPlugin } from '../../../types/componentPlugin';
import { TEXT_BOUNCE_DEFAULT_PROPS } from './default_props';
import { createTextBounce } from './animation';

// PropertyPanel will be lazy-loaded when needed by the editor UI
// Don't import it here to avoid server-side bundling issues

export const TextBounceComponent: ComponentPlugin = {
  type: 'text-bounce',
  category: 'text',
  displayName: 'Text Bounce',
  icon: '⬆️',

  defaultProps: TEXT_BOUNCE_DEFAULT_PROPS,
  create: createTextBounce,
  // PropertyPanel: undefined, // Will be loaded dynamically by editor when needed
};
