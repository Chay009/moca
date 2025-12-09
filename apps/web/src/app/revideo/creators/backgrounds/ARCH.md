# Background System Architecture

## File Structure

```
backgrounds/
├── css/
│   ├── gradients.ts          - gradient preset array
│   ├── backgroundParser.ts   - CSS to Revideo converter
│   ├── ADD_GRADIENT_GUIDE.md
│   └── index.ts
├── image/
│   ├── images.ts              - image URL array
│   ├── ADD_IMAGE_GUIDE.md
│   └── index.ts
├── shaders/
│   ├── registry.ts            - shader preset registry
│   ├── shadertoyWrapper.ts    - GLSL converter
│   ├── createThreeShaderBackground.ts - Three.js factory
│   ├── [preset-folders]/      - individual shader presets
│   ├── ADD_SHADER_GUIDE.md
│   └── index.ts
├── BackgroundPicker.tsx       - UI component
├── backgroundComposition.tsx  - JSX node factory
├── ADD_BACKGROUND_GUIDE.md
└── ARCH.md                    - this file
```

## Data Flow

### Solid + Gradient
```
gradients.ts
  → BackgroundPicker.tsx (UI)
    → backgroundComposition.tsx
      → backgroundParser.ts (CSS → Revideo)
        → <Rect fill={parsed} />
          → MainScene.tsx / sceneFactory.ts
```

### Image
```
images.ts
  → BackgroundPicker.tsx (UI)
    → backgroundComposition.tsx
      → <Img src={url} />
        → MainScene.tsx / sceneFactory.ts
```

### Shader
```
preset-folder/shader.glsl + index.ts
  → registry.ts
    → BackgroundPicker.tsx (UI)
      → MainScene.tsx / sceneFactory.ts
        → getShaderByID()
          → createThreeShaderBackground()
            → shadertoyWrapper.ts (auto-wrap)
              → ThreeComponent
                → Post-processing pipeline
```

## Component Relationships

### BackgroundPicker.tsx
- Imports: gradients.ts, images.ts, shaders/registry
- Exports: UI component
- Calls: setBackground(value, type)

### backgroundComposition.tsx
- Imports: backgroundParser.ts, Revideo components
- Used by: MainScene, sceneFactory
- Returns: JSX nodes for solid/gradient/image
- Does NOT handle shaders (created directly in scenes)

### MainScene.tsx + sceneFactory.ts
- Import: backgroundComposition, shaders/index
- Solid/Gradient/Image: uses backgroundComposition helper
- Shader: creates Three component directly with sceneData

### ThreeComponent.ts
- Location: ../../../three/ThreeComponent.ts
- Receives: sceneData with postProcessFragment
- Handles: WebGL rendering, post-processing, shader wrapping

## Type Flow

```
BackgroundConfig {
  type: 'solid' | 'gradient' | 'image' | 'shader'
  value: string
}
  ↓
backgroundComposition (solid/gradient/image only)
  ↓
JSX Node
  ↓
view.add()
```

```
Shader:
  value (preset ID)
    ↓
  getShaderByID()
    ↓
  GLSL string
    ↓
  createThreeShaderBackground()
    ↓
  ThreeSceneData
    ↓
  <Three sceneData={...} />
```

## Adding New Backgrounds

Solid: Edit BackgroundPicker.tsx solids array
Gradient: Edit css/gradients.ts
Image: Edit image/images.ts
Shader: Create folder + register in shaders/registry.ts

## Future Refactors

1. backgroundComposition.tsx - replace if/else with object mapping
2. Move solid colors to css/solids.ts
3. Add metadata to gradient/image arrays (id, name, category)
4. Unify MainScene and sceneFactory background logic
