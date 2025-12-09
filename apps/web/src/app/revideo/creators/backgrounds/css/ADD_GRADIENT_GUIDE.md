# Adding Gradients

## Quick Steps

Open `BackgroundPicker.tsx` and add to gradients array:

```ts
const gradients = [
  // existing gradients...
  'linear-gradient(to right, #ff0000, #00ff00)',
  'radial-gradient(circle, #ff0000, #0000ff)',
];
```

## Gradient Format

Standard CSS gradient syntax:

Linear:
```
linear-gradient(to right, #color1, #color2)
linear-gradient(45deg, #color1, #color2, #color3)
```

Radial:
```
radial-gradient(circle, #color1, #color2)
radial-gradient(ellipse, #color1, #color2)
```

## Future Enhancement

Move gradient array to separate file with metadata:
```ts
// gradients.ts
export const gradientPresets = [
  {
    id: 'sunset',
    name: 'Sunset',
    value: 'linear-gradient(to right, #ff6b6b, #ffa500)',
    category: 'warm',
  },
];
```

Then import in BackgroundPicker.tsx
