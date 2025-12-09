/**
 * Text Effect Constants - Exports metadata for UI components
 * Maps new component registry to old preset format for backward compatibility
 */

import { textComponents } from './registry';

export type TextEffectPresetType = 'text-simple' | 'text-bounce' | 'text-shining';

export type TextEffectCategory = 'basic' | 'animated' | 'glowing';

export const TEXT_EFFECT_CATEGORIES = {
  BASIC: 'basic' as const,
  ANIMATED: 'animated' as const,
  GLOWING: 'glowing' as const,
};

export interface TextEffectPresetMetadata {
  id: TextEffectPresetType;
  label: string;
  description: string;
  category: TextEffectCategory;
  defaultConfig: any;
}

// Export metadata from registry as preset format
export const TEXT_EFFECT_PRESET_METADATA: TextEffectPresetMetadata[] = Object.values(textComponents).map((component) => ({
  id: component.type as TextEffectPresetType,
  label: component.displayName,
  description: `${component.displayName} effect`,
  category: getCategoryForComponent(component.type),
  defaultConfig: component.defaultProps,
}));

function getCategoryForComponent(type: string): TextEffectCategory {
  if (type === 'text-simple') return 'basic';
  if (type === 'text-bounce') return 'animated';
  if (type === 'text-shining') return 'glowing';
  return 'basic';
}

export function getPresetsByCategory(category: TextEffectCategory): TextEffectPresetMetadata[] {
  return TEXT_EFFECT_PRESET_METADATA.filter((preset) => preset.category === category);
}

export function getPresetMetadata(presetId: TextEffectPresetType): TextEffectPresetMetadata | undefined {
  return TEXT_EFFECT_PRESET_METADATA.find((preset) => preset.id === presetId);
}
