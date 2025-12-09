/**
 * Shadertoy to Three.js fragment shader wrapper
 * Detects and converts Shadertoy mainImage() format to standard GLSL
 */

/**
 * If the fragment contains `mainImage`, wrap it into a proper fragment shader entry point.
 * Otherwise return fragment as-is (assumed to contain a `main()`).
 */
export function wrapShadertoyFragment(fragment: string): string {
  // need a better npm package for this parsing
  const containsMainImage = /mainImage\s*\(/.test(fragment);

  if (!containsMainImage) {
    // User supplied a full fragment shader with gl_FragColor, return as-is
    return fragment;
  }

  // Wrap: provide iTime, iResolution, etc., and call user mainImage
  return `
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;
    varying vec2 vUv;

    // Helper to convert vUv to fragCoord style (bottom-left origin)
    vec2 fragCoordFromUv(vec2 uv) {
      return uv * iResolution;
    }

    ${fragment}

    void main() {
      vec2 fragCoord = fragCoordFromUv(vUv);
      vec4 color;
      mainImage(color, fragCoord);
      gl_FragColor = color;
    }
  `;
}
