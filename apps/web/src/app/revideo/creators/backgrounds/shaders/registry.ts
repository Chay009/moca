/**
 * Shader Preset Registry
 * Central registry for all shader background presets
 *
 * feature-later: Add per-shader UI controls with custom uniforms
 * - Extend ShaderPreset interface with uniforms property
 * - Each uniform defines: type (float/vec2/color), default, min, max, label
 * - Create shader property panel component
 * - Pass custom uniform values to createThreeShaderBackground()
 * - ThreeComponent already supports postProcessUniforms
 * if you need similar custom panel for each then follow the text arch  client-scene-play\src\components\revideo\creators\components\arch.md 
 * where it add a custom ui component to show based on effect which might be needed as each shader differnt param to be tweaked
 */
import { gradientWave } from './gradient-wave';
import { testSimple } from './test-simple';

export interface ShaderPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  glsl: string; // Motion Canvas compatible GLSL code
  // uniforms?: Record<string, { type: 'float' | 'vec2' | 'color', default: any, min?: number, max?: number, label: string }>;
}

/**
 * All available shader presets
 * Store only ID in database, load GLSL at runtime
 */
export const shaderPresets: Record<string, ShaderPreset> = {
  'gradient-wave': gradientWave,
  'test-simple': testSimple,
};

/**
 * Get shader GLSL code by preset ID
 */
export function getShaderByID(presetId: string): string | null {
  const preset = shaderPresets[presetId];
  return preset ? preset.glsl : null;
}

/**
 * Get all shader presets for UI picker
 */
export function getAllShaderPresets(): ShaderPreset[] {
  return Object.values(shaderPresets);
}
