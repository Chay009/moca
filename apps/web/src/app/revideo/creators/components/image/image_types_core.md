Here are code examples showing how to use filters with the `<Img>` component in Revideo:

# these are css filters

## Basic Filter Usage

Import individual filter functions from the filters module and apply them to any component:

```tsx
import { Img } from '@revideo/2d';
import { grayscale, brightness, blur, sepia } from '@revideo/2d';

// Single filter
<Img
  src={myImage}
  filters={[grayscale(1)]}
/>

// Multiple filters
<Img
  src={myImage}
  filters={[
    brightness(1.2),
    contrast(1.1),
    saturate(0.8)
  ]}
/>
```

## Available Filter Functions

The filter system provides these built-in functions [1](#2-0) :

- `invert(value)` - Inverts colors (0-1)
- `sepia(value)` - Sepia tone effect (0-1)
- `grayscale(value)` - Grayscale effect (0-1)
- `brightness(value)` - Brightness adjustment (default: 1)
- `contrast(value)` - Contrast adjustment (default: 1)
- `saturate(value)` - Saturation adjustment (default: 1)
- `hue(value)` - Hue rotation in degrees
- `blur(value)` - Gaussian blur in pixels

## Animated Filters

Filters can be animated using Revideo's animation system:

```tsx
import { createRef, all } from '@revideo/core';
import { Img } from '@revideo/2d';
import { grayscale, brightness, blur } from '@revideo/2d';

const imageRef = createRef<Img>();

view.add(
  <Img
    ref={imageRef}
    src={myImage}
    filters={[grayscale(0), brightness(1)]}
  />
);

// Animate filters
yield* all(
  imageRef().filters.grayscale(1, 1),  // Fade to grayscale over 1 second
  imageRef().filters.brightness(0.5, 1) // Dim brightness over 1 second
);
```

## Advanced Example with Multiple Effects

```tsx
import { Img } from '@revideo/2d';
import { 
  grayscale, 
  brightness, 
  contrast, 
  saturate, 
  hue, 
  blur,
  sepia 
} from '@revideo/2d';

<Img
  src={myImage}
  width={300}
  height={200}
  radius={10}
  filters={[
    brightness(1.1),
    contrast(1.05),
    saturate(1.2),
    hue(15)  // Slight hue rotation
  ]}
  stroke={'#333'}
  lineWidth={2}
/>
```

## Notes

- Filters are applied in the order they appear in the array [2](#2-1) 
- Each filter has a default value that represents "no effect" [3](#2-2) 
- The `filters` prop is available on all Node-based components, not just Img [4](#2-3) 
- Filters can be accessed and animated individually via the filters signal (e.g., `node.filters.brightness()`)

### Citations

**File:** packages/2d/src/lib/partials/Filter.ts (L9-17)
```typescript
export type FilterName =
  | 'invert'
  | 'sepia'
  | 'grayscale'
  | 'brightness'
  | 'contrast'
  | 'saturate'
  | 'hue'
  | 'blur';
```

**File:** packages/2d/src/lib/partials/Filter.ts (L24-57)
```typescript
export const FILTERS: Record<string, Partial<FilterProps>> = {
  invert: {
    name: 'invert',
  },
  sepia: {
    name: 'sepia',
  },
  grayscale: {
    name: 'grayscale',
  },
  brightness: {
    name: 'brightness',
    default: 1,
  },
  contrast: {
    name: 'contrast',
    default: 1,
  },
  saturate: {
    name: 'saturate',
    default: 1,
  },
  hue: {
    name: 'hue-rotate',
    unit: 'deg',
    scale: 1,
  },
  blur: {
    name: 'blur',
    transform: true,
    unit: 'px',
    scale: 1,
  },
};
```

**File:** packages/2d/src/lib/components/Node.ts (L90-92)
```typescript
  opacity?: SignalValue<number>;
  filters?: SignalValue<Filter[]>;

```

**File:** packages/2d/src/lib/components/Node.ts (L461-471)
```typescript
  protected filterString(): string {
    let filters = '';
    const matrix = this.compositeToWorld();
    for (const filter of this.filters()) {
      if (filter.isActive()) {
        filters += ' ' + filter.serialize(matrix);
      }
    }

    return filters;
  }
```
