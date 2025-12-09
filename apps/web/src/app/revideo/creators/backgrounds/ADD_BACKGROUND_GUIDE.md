# Background System Guide

## Overview

Three background types with different architectures.

## 1. Solid + Gradient (CSS-based)

Location: `css/`

Files:
- `backgroundParser.ts` - converts CSS to Revideo format
- `BackgroundPicker.tsx` - UI arrays

Add new:
- Edit gradients array in BackgroundPicker.tsx
- Uses standard CSS syntax

Guide: See `css/ADD_GRADIENT_GUIDE.md`

## 2. Image (Asset-based)

Location: `image/`

Files:
- `BackgroundPicker.tsx` - URL array

Add new:
- Edit images array in BackgroundPicker.tsx
- Wrap URL in `url()`

Guide: See `image/ADD_IMAGE_GUIDE.md`

## 3. Shader (Three.js)

Location: `shaders/`

Files:
- `registry.ts` - shader preset registry
- `shadertoyWrapper.ts` - GLSL converter
- `createThreeShaderBackground.ts` - Three.js factory
- `ThreeComponent.ts` - renderer
- Each shader in own folder with .glsl + index.ts

Add new:
- Create shader folder with shader.glsl + index.ts
- Register in registry.ts
- Uses Shadertoy GLSL format (auto-converts)

Guide: See `shaders/ADD_SHADER_GUIDE.md`

## Rendering Flow

Solid/Gradient: CSS → Parser → Rect fill
Image: URL → Img component in Layout
Shader: GLSL → Three.js → Post-processing → Canvas composite

## Files Modified When Adding

Solid/Gradient: BackgroundPicker.tsx only
Image: BackgroundPicker.tsx only
Shader: Create folder + registry.ts
