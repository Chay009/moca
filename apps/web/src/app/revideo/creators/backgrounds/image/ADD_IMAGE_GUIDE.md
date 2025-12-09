# Adding Image Backgrounds

## Quick Steps

Open `BackgroundPicker.tsx` and add to images array:

```ts
const images = [
  // existing images...
  'url(https://your-image-url.com/image.jpg)',
];
```

## Image Format

Wrap URL in `url()`:
```
url(https://example.com/image.jpg)
url(https://images.unsplash.com/photo-id)
```

## Current Architecture

Images stored as array in BackgroundPicker.tsx

## Future Enhancement

Move to separate file with metadata:
```ts
// images.ts
export const imagePresets = [
  {
    id: 'nature-1',
    name: 'Mountain Landscape',
    url: 'https://...',
    category: 'nature',
    thumbnail: 'https://...', // smaller preview image
  },
];
```

Import in BackgroundPicker.tsx and use metadata for filtering/search
