/**
 * Mesh Gradient Fragment Shader
 * Smooth flowing gradient animation using noise and time
 */

export const MESH_GRADIENT_FRAGMENT = `
#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uSpeed;

out vec4 fragColor;

// Simple noise function
float noise(vec2 p) {
  return sin(p.x * 12.9898 + p.y * 78.233) * 43758.5453;
}

// Smoother noise
float smoothNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = noise(i);
  float b = noise(i + vec2(1.0, 0.0));
  float c = noise(i + vec2(0.0, 1.0));
  float d = noise(i + vec2(1.0, 1.0));

  float ab = mix(a, b, f.x);
  float cd = mix(c, d, f.x);
  return mix(ab, cd, f.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  // Create animated mesh gradient
  float time = uTime * uSpeed;

  // Multiple layers of noise for complex gradient
  vec3 col = vec3(0.0);

  // Red channel
  col.r = 0.5 + 0.5 * sin(uv.x * 3.0 + time * 0.5 + sin(uv.y * 2.0));

  // Green channel
  col.g = 0.5 + 0.5 * cos(uv.y * 2.5 + time * 0.3 + cos(uv.x * 1.5));

  // Blue channel
  col.b = 0.5 + 0.5 * sin((uv.x + uv.y) * 2.0 + time * 0.4);

  // Add noise for depth
  col += vec3(smoothNoise(uv * 5.0 + time) * 0.1);

  fragColor = vec4(col, 1.0);
}
`;
