# Revideo Component System

A comprehensive, video editor-style component system for creating animated videos with Revideo/Motion Canvas.

## Overview

This component system provides:

- **Full Motion Canvas property support** - All text, shape, and media properties
- **Custom component library** - Button, Card, Badge, Progress Bar, Counter, etc.
- **Animation presets** - Fade, slide, scale, bounce, rotate, elastic, and more
- **Text effects** - Typewriter, glitch, wave, scramble, rainbow, etc.
- **Audio integration** - Sync audio with animations
- **Dynamic property editor** - Edit all properties from the UI

## Architecture

```
src/components/revideo/
├── types/
│   ├── base.ts              # Base props with full Motion Canvas support
│   └── components.ts        # Specific component type definitions
├── animations/
│   ├── presets.ts           # Animation presets (fade, slide, bounce, etc.)
│   └── textEffects.ts       # Text effects (typewriter, glitch, wave, etc.)
├── creators/
│   └── componentFactory.ts  # Component factory that creates Revideo nodes
└── index.ts                 # Main exports and defaults
```

## Component Types

### Core Components
- **Text** - Full text styling (fontSize, fontFamily, fontWeight, textAlign, letterSpacing, etc.)
- **Animated Text** - Text with effects (typewriter, glitch, wave, etc.)
- **Rectangle** - Rounded corners, borders, shadows
- **Circle** - With size, fill, and all transform properties
- **Line** - Multi-point lines with arrows
- **Polygon** - Custom polygons with any number of sides
- **Image** - With aspect ratio, clipping, smoothing
- **Video** - With trim, volume, playback rate
- **Audio** - Background audio with fade in/out

### Custom Components
- **Button** - Interactive button with hover states
- **Card** - Content card with title and description
- **Badge** - Label badge with variants (success, warning, error)
- **Progress Bar** - Animated progress with labels
- **Counter** - Animated number counter with prefix/suffix

### Container Components
- **Layout** - Flex layout container (row, column, gap, padding)
- **Group** - Simple group container

## Properties Reference

### Transform Properties
```typescript
{
  x: number;              // X position
  y: number;              // Y position
  width: number;          // Width
  height: number;         // Height
  rotation: number;       // Rotation in degrees
  scale: number;          // Uniform scale
  scaleX: number;         // X scale
  scaleY: number;         // Y scale
  opacity: number;        // Opacity (0-1)
  zIndex: number;         // Z-index for layering
}
```

### Text Properties
```typescript
{
  text: string;                    // Text content
  fontSize: number;                // Font size in pixels
  fontFamily: string;              // Font family name
  fontWeight: number | string;     // Font weight (normal, bold, 100-900)
  fontStyle: 'normal' | 'italic';  // Font style
  textAlign: 'left' | 'center' | 'right' | 'justify';
  letterSpacing: number;           // Letter spacing
  lineHeight: number;              // Line height
  textWrap: boolean;               // Enable text wrapping
  maxWidth: number;                // Max width for wrapping
}
```

### Style Properties
```typescript
{
  fill: string;                    // Fill color (hex, rgb, hsl)
  stroke: string;                  // Stroke color
  lineWidth: number;               // Stroke width
  radius: number;                  // Border radius
  shadowColor: string;             // Shadow color
  shadowBlur: number;              // Shadow blur amount
  shadowOffsetX: number;           // Shadow X offset
  shadowOffsetY: number;           // Shadow Y offset
}
```

### Animation Configuration
```typescript
{
  animation: {
    preset: 'fade-in' | 'slide-in-left' | 'scale-in' | ...,
    duration: number;              // Animation duration in seconds
    delay: number;                 // Delay before animation starts
    easing: 'linear' | 'easeInOut' | 'bounce' | ...,
    repeat: number;                // Number of times to repeat
    yoyo: boolean;                 // Reverse on repeat
  }
}
```

### Text Effect Configuration
```typescript
{
  effect: {
    type: 'typewriter' | 'glitch' | 'wave' | ...,
    duration: number;              // Effect duration
    delay: number;                 // Delay before effect
    stagger: number;               // Delay between letters
    intensity: number;             // Effect intensity
  }
}
```

## Animation Presets

### Available Presets
- `fade-in` - Fade in from transparent
- `fade-out` - Fade out to transparent
- `slide-in-left` - Slide in from left
- `slide-in-right` - Slide in from right
- `slide-in-up` - Slide in from bottom
- `slide-in-down` - Slide in from top
- `scale-in` - Scale from zero
- `scale-out` - Scale to zero
- `bounce-in` - Bounce in with elastic effect
- `rotate-in` - Rotate and scale in
- `flip-in` - Flip in horizontally
- `elastic-in` - Elastic bounce in

## Text Effects

### Available Effects
- `typewriter` - Type text character by character
- `glitch` - Glitch/distortion effect
- `wave` - Wave/oscillate effect
- `bounce-letters` - Bounce each letter
- `fade-letters` - Fade in each letter
- `gradient-shift` - Shift through gradient colors
- `split-reveal` - Split and reveal text
- `scramble` - Scramble then reveal
- `rainbow` - Cycle through rainbow colors
- `blur-in` - Blur in effect
- `elastic` - Elastic bounce effect

## Usage Examples

### Adding a Text Element
```typescript
const element = {
  type: 'text',
  properties: {
    text: 'Hello World',
    fontSize: 60,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fill: '#ffffff',
    x: 0,
    y: 0,
    animation: {
      preset: 'fade-in',
      duration: 1,
    },
  },
};
```

### Adding Animated Text with Effect
```typescript
const element = {
  type: 'animated-text',
  properties: {
    text: 'Animated Text',
    fontSize: 50,
    fill: '#ff0000',
    effect: {
      type: 'typewriter',
      duration: 2,
      stagger: 0.05,
    },
  },
};
```

### Adding a Button
```typescript
const button = {
  type: 'button',
  properties: {
    label: 'Click Me',
    width: 200,
    height: 50,
    fill: '#3b82f6',
    fontSize: 16,
    textColor: '#ffffff',
    radius: 8,
    animation: {
      preset: 'scale-in',
      duration: 0.5,
    },
  },
};
```

### Adding a Card
```typescript
const card = {
  type: 'card',
  properties: {
    title: 'My Card',
    description: 'Card description text',
    width: 300,
    height: 200,
    fill: '#ffffff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    radius: 12,
    animation: {
      preset: 'slide-in-up',
      duration: 0.8,
    },
  },
};
```

## Property Editor

The `PropertyPanel` component provides a dynamic UI for editing all component properties:

### Features
- **Transform Tab** - Position, size, rotation, scale, opacity
- **Style Tab** - Colors, strokes, shadows, borders
- **Content Tab** - Text, media URLs, labels, etc.
- **Animation Tab** - Animation presets and text effects

### Usage
```tsx
import { PropertyPanel } from '@/components/PropertyEditor/PropertyPanel';

<PropertyPanel />
```

The PropertyPanel automatically adapts to the selected element's type and shows relevant properties.

## Integration

### Store Integration
The store has been extended to support all new component types and properties:

```typescript
// Add element to scene
store.addElementToScene(sceneId, {
  type: 'button',
  properties: {
    label: 'Click Me',
    ...buttonProps,
  },
});

// Update element properties
store.updateElementInScene(sceneId, elementId, {
  properties: {
    fontSize: 60,
    fill: '#ff0000',
  },
});
```

### Scene Factory Integration
The scene factory automatically creates Revideo nodes from component props:

```typescript
import { createComponent } from '@/components/revideo';

const node = createComponent({
  type: 'text',
  elementId: 'my-text',
  text: 'Hello',
  fontSize: 50,
  ...otherProps,
});
```

## Best Practices

1. **Use DEFAULT_COMPONENTS** - Import default component configurations
2. **Apply animations** - Use animation presets for smooth transitions
3. **Text effects** - Use text effects for dynamic text animations
4. **Property organization** - Group related properties in the UI
5. **Performance** - Use `cache: true` for text elements
6. **Audio sync** - Configure audio timing with animations

## Future Enhancements

- [ ] Timeline-based animation editor
- [ ] Keyframe editor
- [ ] More text effects
- [ ] Shape morphing
- [ ] Particle effects
- [ ] Video filters
- [ ] Audio waveform visualization
- [ ] Component templates
- [ ] Animation curves editor
- [ ] Export/import component presets

## Contributing

To add a new component type:

1. Define props interface in `types/components.ts`
2. Add component creator in `creators/componentFactory.ts`
3. Add default config in `index.ts`
4. Update property editor in `PropertyPanel.tsx`
5. Test with scene factory

## License

MIT
