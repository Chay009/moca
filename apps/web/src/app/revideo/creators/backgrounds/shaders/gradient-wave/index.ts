/**
 * Gradient Wave Shader Preset
 * Animated colorful gradient that changes over time
 */
// import shaderCode from './shader.glsl?raw';

const gradientwaveShader:string=`
// Animated gradient wave shader
// Pure Shadertoy format - will be wrapped automatically

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Normalize coordinates
    vec2 uv = fragCoord / iResolution.xy;

    // Create animated gradient
    vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0.0, 2.0, 4.0));

    // Output color
    fragColor = vec4(col, 1.0);
}


`
export const gradientWave = {
  id: 'gradient-wave',
  name: 'Gradient Wave',
  description: 'Animated colorful gradient wave effect',
  category: 'animated',
  glsl: gradientwaveShader, // Raw Shadertoy code - will be wrapped by Three component
};
