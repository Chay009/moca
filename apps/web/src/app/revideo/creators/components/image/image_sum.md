

Of course. The `ImgProps` interface defines all the properties you can pass to an `<Img>` component when you create it in your code. It inherits all the properties from a `Rect` component, as an image is essentially a textured rectangle, and then adds its own specific properties for handling image data.

Here are the TypeScript interfaces for the `Img` component's properties, broken down into logical categories for clarity.

which are used like this
<Img filters={[{ blur: 5 }]} / > etc etc
# 1. Core Image Properties

These are the properties specific to the `Img` component itself, primarily for handling the image source and its alpha channel.


The `<Img>` component in Revideo supports several props for visual effects, both specific to images and inherited from its parent classes.

## Img-Specific Props

The `Img` component has three specific props [1](#1-0) :

- **`src`** - The image source (URL or import)
- **`alpha`** - Controls transparency of only the image (0-1), leaving fill/stroke/children intact [2](#1-1) 
- **`smoothing`** - Whether to smooth the image when scaling (default: true). When false, uses nearest neighbor interpolation for pixelated effect [3](#1-2) 

## Inherited Visual Effects

Since `Img` extends `Rect` [4](#1-3) , it inherits all visual effect props from `Node` [5](#1-4) :

### Appearance Effects
- **`opacity`** - Overall transparency
- **`filters`** - Array of CSS filters to apply
- **`fill`** - Background color/gradient
- **`stroke`** - Outline color
- **`lineWidth`** - Outline thickness

### Shadow Effects
- **`shadowColor`** - Shadow color
- **`shadowBlur`** - Shadow blur amount
- **`shadowOffset`** - Shadow offset (x, y)

### Transform Effects
- **`rotation`** - Rotation in degrees
- **`scale`** - Scale factor (x, y)
- **`skew`** - Skew transformation
- **`position`** - Position (x, y)

### Layout Effects
- **`radius`** - Corner radius for rounded corners
- **`size`** - Width and height
- **`ratio`** - Aspect ratio override

## Example Usage

Here's a practical example from the codebase showing multiple effects applied [6](#1-5) :

```tsx
<Img
  src={repoImage()}
  width={100}
  height={100}
  stroke={'#555555'}
  lineWidth={8}
  strokeFirst={true}
  radius={10}
/>
```

## Notes

- The `alpha` prop is different from `opacity` - it only affects the image content, not any stroke or fill
- Image smoothing can be disabled for pixel art or retro effects
- All standard Node transformation and styling props work on images
- Images automatically maintain their aspect ratio unless explicitly overridden with `size` or `ratio` props [7](#1-6) 

Wiki pages you might want to explore:
- [Core System (redotvideo/revideo)](/wiki/redotvideo/revideo#2)