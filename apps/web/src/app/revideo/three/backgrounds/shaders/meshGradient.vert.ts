/**
 * Mesh Gradient Vertex Shader
 * Simple passthrough vertex shader for fullscreen quad
 */

export const MESH_GRADIENT_VERTEX = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;
