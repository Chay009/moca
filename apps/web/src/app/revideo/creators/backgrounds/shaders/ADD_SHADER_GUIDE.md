# Adding New Shader Background

## Quick Steps

1. Create folder in `shaders/`
```
shaders/your-shader-name/
```

2. Create `shader.glsl` file
```glsl
// Shadertoy format (will auto-convert to Three.js)
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec3 col = vec3(uv.x, uv.y, 0.5);
    fragColor = vec4(col, 1.0);
}
```

3. Create `index.ts` file
```ts
import shaderCode from './shader.glsl?raw';

export const yourShaderName = {
  id: 'your-shader-name',
  name: 'Your Shader Name',
  description: 'What this shader does',
  category: 'animated', // or 'static', 'gradient', etc.
  glsl: shaderCode,
};
```

4. Register in `registry.ts`
```ts
import { yourShaderName } from './your-shader-name';

export const shaderPresets: Record<string, ShaderPreset> = {
  // existing shaders...
  'your-shader-name': yourShaderName,
};
```

## Done

Shader now appears in Background Picker shader tab.

## Available Variables

- `iTime` - animation time in seconds
- `iResolution` - canvas size (width, height)
- `fragCoord` - pixel position
- `uv` - normalized coordinates (0-1)

## Extend Three.js Component

To add advanced features:
- Edit `ThreeComponent.ts`
- Add custom uniforms in `createThreeShaderBackground.ts`
- Modify post-processing pipeline in `ThreeComponent.ts` compositor setup
