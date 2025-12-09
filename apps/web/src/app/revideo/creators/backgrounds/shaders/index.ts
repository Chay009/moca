/**
 * Shader backgrounds (Three.js)
 * Handles GLSL shaders via Three.js post-processing
 */

export { createThreeShaderBackground } from './createThreeShaderBackground';
export { wrapShadertoyFragment } from './shadertoyWrapper';
export { getShaderByID, getAllShaderPresets } from './registry';
export type { ShaderPreset } from './registry';
