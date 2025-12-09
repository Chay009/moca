/**
 * Simple Text Component - Plugin Definition
 * Combines metadata, creator function, and UI into a single plugin
 */

import type { ComponentPlugin } from '../../../types/componentPlugin';
import { TEXT_SIMPLE_DEFAULT_PROPS } from './default_props';
import { createTextSimple } from './animation';

// PropertyPanel will be lazy-loaded when needed by the editor UI
// Don't import it here to avoid server-side bundling issues

export const TextSimpleComponent: ComponentPlugin = {
  type: 'text-simple',
  category: 'text',
  displayName: 'Simple Text',
  icon: '📝',

  defaultProps: TEXT_SIMPLE_DEFAULT_PROPS,
  create: createTextSimple,
  // PropertyPanel: undefined, // Will be loaded dynamically by editor when needed
};
