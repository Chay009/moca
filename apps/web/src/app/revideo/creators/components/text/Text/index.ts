import type { ComponentPlugin } from '../../../types/componentPlugin';
import { TEXT_DEFAULT_PROPS } from './default_props';
import { createText } from './animation';

export const TextComponent: ComponentPlugin = {
  type: 'text',
  category: 'text',
  displayName: 'Text',
  icon: 'T',
  defaultProps: TEXT_DEFAULT_PROPS,
  create: createText,
};
