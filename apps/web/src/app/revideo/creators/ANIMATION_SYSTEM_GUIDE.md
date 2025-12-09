# Animation System Architecture Guide

## Overview
The animation system uses a **hybrid approach**: shared animations that work for all components + component-specific effects.


for media like image and video not sure for others but 
we use something called partials import {blur,brightness,contrast,grayscale,hue,invert,saturate,sepia} from "@revideo/2d/lib/partials";
in aniamtion system not in prop system prop system have filters prop on node
## Structure

```
animations/
├── sharedAnimations.ts    # Common entrance/exit (fade, slide, scale, rotate)
├── textAnimations.ts      # Text-only effects (typewriter, glitch, wave)
├── mediaAnimations.ts     # Media-only effects (ken-burns, parallax, blur)
└── index.ts               # Central export
```

## 1. Animation Props vs Visual Props

### Visual Props (Static Appearance)
Defined in component props reference (e.g., `image_props_reference.md`, `text_props_reference.md`):
```ts
{
  fontSize: 50,
  fill: '#ffffff',
  src: 'image.jpg',
  width: 300
}
```

### Animation Props (Behavior Over Time)
Defined in `animations/` directory:
```ts
{
  animation: {
    entrance: { type: 'fade-in', duration: 1 },
    exit: { type: 'fade-out', duration: 1 },
    textEffect: { type: 'typewriter', duration: 2 }  // Component-specific
  }
}
```

## 2. Component Default Props Pattern

Each component's `default_props.ts` includes BOTH visual and animation props:

```ts
// TextSimple/default_props.ts
import { DEFAULT_COMPONENT_ANIMATION } from '../../../animations';

export const TEXT_SIMPLE_DEFAULT_PROPS = {
  // Visual props
  text: 'Text',
  fontSize: 50,
  fill: '#ffffff',
  
  // Animation props
  animation: {
    ...DEFAULT_COMPONENT_ANIMATION,  // entrance + exit
    textEffect: { type: 'none', duration: 0 }  // text-specific
  }
};
```

## 3. Animation Execution in Creator Functions

The `animation.tsx` file reads animation config and applies it via ref methods:

```tsx
// TextSimple/animation.tsx
import { createRef } from '@revideo/core';
import { Txt } from '@revideo/2d';

export function* createTextSimple(props: any, view: any) {
  const ref = createRef<Txt>();
  
  // Add node with visual props
  yield view.add(
    <Txt
      ref={ref}
      text={props.text}
      fontSize={props.fontSize}
      fill={props.fill}
    />
  );
  
  // Apply entrance animation
  if (props.animation?.entrance?.type === 'fade-in') {
    yield* ref().opacity(0, 0);  // Start invisible
    yield* ref().opacity(1, props.animation.entrance.duration);  // Fade in
  }
  
  // Apply text effect
  if (props.animation?.textEffect?.type === 'typewriter') {
    yield* ref().text('', 0);  // Start empty
    yield* ref().text(props.text, props.animation.textEffect.duration);  // Type out
  }
}
```

## 4. Shared vs Component-Specific Animations

### Shared Animations (All Components)
```ts
// From sharedAnimations.ts
entrance: {
  type: 'fade-in' | 'slide-in-left' | 'scale-in' | 'rotate-in'
}
exit: {
  type: 'fade-out' | 'slide-out-right' | 'scale-out'
}
```

### Text-Specific
```ts
// From textAnimations.ts
textEffect: {
  type: 'typewriter' | 'glitch' | 'wave' | 'bounce-letters'
}
```

### Media-Specific
```ts
// From mediaAnimations.ts
mediaEffect: {
  type: 'ken-burns' | 'parallax' | 'blur-in' | 'pixelate-in'
}
```

## 5. Adding New Components with Animations

### Step 1: Define Default Props
```ts
// media/ImageSimple/default_props.ts
import { DEFAULT_COMPONENT_ANIMATION } from '../../../animations';

export const IMAGE_SIMPLE_DEFAULT_PROPS = {
  // Visual props
  src: '',
  width: 300,
  smoothing: true,
  
  // Animation props
  animation: {
    ...DEFAULT_COMPONENT_ANIMATION,  // entrance + exit
    mediaEffect: { type: 'none', duration: 0 }  // media-specific
  }
};
```

### Step 2: Implement Creator Function
```tsx
// media/ImageSimple/animation.tsx
export function* createImageSimple(props: any, view: any) {
  const ref = createRef<Img>();
  
  yield view.add(<Img ref={ref} src={props.src} width={props.width} />);
  
  // Apply entrance
  if (props.animation?.entrance?.type === 'scale-in') {
    yield* ref().scale(0, 0);
    yield* ref().scale(1, props.animation.entrance.duration);
  }
  
  // Apply media effect
  if (props.animation?.mediaEffect?.type === 'ken-burns') {
    yield* ref().scale(1.2, props.animation.mediaEffect.duration);
  }
}
```

### Step 3: Register Component
```ts
// media/ImageSimple/index.ts
export const ImageSimpleComponent: ComponentPlugin = {
  type: 'image-simple',
  category: 'media',
  displayName: 'Image',
  defaultProps: IMAGE_SIMPLE_DEFAULT_PROPS,
  create: createImageSimple,
};
```

## 6. UI Integration

### StyleSettings.tsx
Add animation controls based on category:
```tsx
if (isTextComponent(element.type)) {
  // Show text effect dropdown
  <Select value={props.animation?.textEffect?.type}>
    <SelectItem value="typewriter">Typewriter</SelectItem>
    <SelectItem value="glitch">Glitch</SelectItem>
  </Select>
}

if (isMediaComponent(element.type)) {
  // Show media effect dropdown
  <Select value={props.animation?.mediaEffect?.type}>
    <SelectItem value="ken-burns">Ken Burns</SelectItem>
    <SelectItem value="parallax">Parallax</SelectItem>
  </Select>
}

// All components get entrance/exit
<Select value={props.animation?.entrance?.type}>
  <SelectItem value="fade-in">Fade In</SelectItem>
  <SelectItem value="slide-in-left">Slide In Left</SelectItem>
</Select>
```

## 7. Key Principles

1. **Visual props** = appearance (fontSize, fill, src)
2. **Animation props** = behavior over time (entrance, exit, effects)
3. **Shared animations** = work for all components
4. **Component-specific** = only for certain categories
5. **Creator function** = bridges props to Revideo ref methods
6. **Default props** = include both visual AND animation config

---
*Use this guide when adding new components or extending animation capabilities.*
