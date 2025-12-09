/**
 * Text Shining Component - Plugin Definition
 * Combines metadata, creator function, and UI into a single plugin
 */

import type { ComponentPlugin } from '../../../types/componentPlugin';
import { TEXT_SHINING_DEFAULT_PROPS } from './default_props';
import { createTextShining } from './animation';

// PropertyPanel will be lazy-loaded when needed by the editor UI
// Don't import it here to avoid server-side bundling issues

export const TextShiningComponent: ComponentPlugin = {
  type: 'text-shining',
  category: 'text',
  displayName: 'Text Shining',
  icon: '✨',

  defaultProps: TEXT_SHINING_DEFAULT_PROPS,
  create: createTextShining,
  // PropertyPanel: undefined, // Will be loaded dynamically by editor when needed
};
