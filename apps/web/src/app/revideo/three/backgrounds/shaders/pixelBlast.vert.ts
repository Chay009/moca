/**
 * PixelBlast Vertex Shader
 * Simple passthrough vertex shader for fullscreen quad
 */

export const PIXEL_BLAST_VERTEX = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;
