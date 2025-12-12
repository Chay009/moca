/**
 * Text Effect Constants - Exports metadata for UI components
 * Updated for new registry-based text component system
 */

import { textComponents } from './registry';

export type TextEffectPresetType = 'text';

export type TextEffectCategory = 'basic';

export const TEXT_EFFECT_CATEGORIES = {
  BASIC: 'basic' as const,
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
  category: 'basic' as TextEffectCategory,
  defaultConfig: component.defaultProps,
}));

export function getPresetsByCategory(category: TextEffectCategory): TextEffectPresetMetadata[] {
  return TEXT_EFFECT_PRESET_METADATA.filter((preset) => preset.category === category);
}

export function getPresetMetadata(presetId: TextEffectPresetType): TextEffectPresetMetadata | undefined {
  return TEXT_EFFECT_PRESET_METADATA.find((preset) => preset.id === presetId);
}
