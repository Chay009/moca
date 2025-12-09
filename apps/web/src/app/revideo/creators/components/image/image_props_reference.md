

### Citations

**File:** packages/2d/src/lib/components/Img.ts (L41-54)
```typescript
export interface ImgProps extends RectProps {
  /**
   * {@inheritDoc Img.src}
   */
  src?: SignalValue<string | null>;
  /**
   * {@inheritDoc Img.alpha}
   */
  alpha?: SignalValue<number>;
  /**
   * {@inheritDoc Img.smoothing}
   */
  smoothing?: SignalValue<boolean>;
}
```

**File:** packages/2d/src/lib/components/Img.ts (L89-90)
```typescript
@nodeName('Img')
export class Img extends Rect {
```

**File:** packages/2d/src/lib/components/Img.ts (L123-132)
```typescript
  /**
   * The alpha value of this image.
   *
   * @remarks
   * Unlike opacity, the alpha value affects only the image itself, leaving the
   * fill, stroke, and children intact.
   */
  @initial(1)
  @signal()
  public declare readonly alpha: SimpleSignal<number, this>;
```

**File:** packages/2d/src/lib/components/Img.ts (L134-145)
```typescript
  /**
   * Whether the image should be smoothed.
   *
   * @remarks
   * When disabled, the image will be scaled using the nearest neighbor
   * interpolation with no smoothing. The resulting image will appear pixelated.
   *
   * @defaultValue true
   */
  @initial(true)
  @signal()
  public declare readonly smoothing: SimpleSignal<boolean, this>;
```

**File:** packages/2d/src/lib/components/Img.ts (L267-266)
```typescript

```

**File:** packages/2d/src/lib/components/Node.ts (L69-127)
```typescript
export interface NodeProps {
  ref?: ReferenceReceiver<any>;
  children?: SignalValue<ComponentChildren>;
  /**
   * @deprecated Use {@link children} instead.
   */
  spawner?: SignalValue<ComponentChildren>;
  key?: string;

  x?: SignalValue<number>;
  y?: SignalValue<number>;
  position?: SignalValue<PossibleVector2>;
  rotation?: SignalValue<number>;
  scaleX?: SignalValue<number>;
  scaleY?: SignalValue<number>;
  scale?: SignalValue<PossibleVector2>;
  skewX?: SignalValue<number>;
  skewY?: SignalValue<number>;
  skew?: SignalValue<PossibleVector2>;
  zIndex?: SignalValue<number>;

  opacity?: SignalValue<number>;
  filters?: SignalValue<Filter[]>;

  shadowColor?: SignalValue<PossibleColor>;
  shadowBlur?: SignalValue<number>;
  shadowOffsetX?: SignalValue<number>;
  shadowOffsetY?: SignalValue<number>;
  shadowOffset?: SignalValue<PossibleVector2>;

  cache?: SignalValue<boolean>;
  /**
   * {@inheritDoc Node.cachePadding}
   */
  cachePaddingTop?: SignalValue<number>;
  /**
   * {@inheritDoc Node.cachePadding}
   */
  cachePaddingBottom?: SignalValue<number>;
  /**
   * {@inheritDoc Node.cachePadding}
   */
  cachePaddingLeft?: SignalValue<number>;
  /**
   * {@inheritDoc Node.cachePadding}
   */
  cachePaddingRight?: SignalValue<number>;
  /**
   * {@inheritDoc Node.cachePadding}
   */
  cachePadding?: SignalValue<PossibleSpacing>;

  composite?: SignalValue<boolean>;
  compositeOperation?: SignalValue<GlobalCompositeOperation>;
  /**
   * @experimental
   */
  shaders?: PossibleShaderConfig;
}
```

**File:** packages/template/src/example.tsx (L141-149)
```typescript
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




```typescript
import { SignalValue } from '@motion-canvas/2d/lib/signals';

/**
 * Properties specific to the Img component for handling image data.
 */
// only these are the imag prps this is extension of rect props
export interface ImgCoreProps {
  /**
   * The source of this asset.
   * Can be a local or remote URL.
   */
  src?: SignalValue<string | null>;

  /**
   * The alpha value of this image.
   * Unlike opacity, the alpha value affects only the image itself,
   * leaving the fill, stroke, and children intact.
   */
  alpha?: SignalValue<number>;

  /**
   * Whether the image should be smoothed.
   * When disabled, the image will be scaled using the nearest neighbor
   * interpolation with no smoothing. The resulting image will appear pixelated.
   * @default true
   */
  smoothing?: SignalValue<boolean>;
}
```

### 2. Layout and Sizing Properties

These properties control the position, size, and layout behavior of the image within its parent. These are inherited from `RectProps`.

```typescript
import { 
  SignalValue, 
  PossibleVector2, 
  Length, 
  FlexDirection, 
  FlexItems, 
  FlexContent, 
  FlexWrap, 
  PossibleSpacing,
  LengthLimit
} from '@motion-canvas/2d/lib/types';

/**
 * Properties for controlling the layout, size, and position of a node.
 */
export interface LayoutProps {
  // Size
  size?: SignalValue<PossibleVector2<Length>>;
  width?: SignalValue<Length>;
  height?: SignalValue<Length>;

  // Position
  position?: SignalValue<PossibleVector2<number>>;
  x?: SignalValue<number>;
  y?: SignalValue<number>;

  // Layout (Flexbox)
  layout?: 'none' | 'overlay';
  direction?: SignalValue<FlexDirection>;
  alignItems?: SignalValue<FlexItems>;
  alignSelf?: SignalValue<FlexItems>;
  alignContent?: SignalValue<FlexContent>;
  justifyContent?: SignalValue<FlexContent>;
  wrap?: SignalValue<FlexWrap>;
  grow?: SignalValue<number>;
  shrink?: SignalValue<number>;
  basis?: SignalValue<FlexBasis>;

  // Spacing
  margin?: SignalValue<PossibleSpacing>;
  marginTop?: SignalValue<number>;
  marginRight?: SignalValue<number>;
  marginBottom?: SignalValue<number>;
  marginLeft?: SignalValue<number>;

  padding?: SignalValue<PossibleSpacing>;
  paddingTop?: SignalValue<number>;
  paddingRight?: SignalValue<number>;
  paddingBottom?: SignalValue<number>;
  paddingLeft?: SignalValue<number>;

  gap?: SignalValue<Length>;
  columnGap?: SignalValue<Length>;
  rowGap?: SignalValue<Length>;

  // Constraints
  minWidth?: SignalValue<LengthLimit>;
  maxWidth?: SignalValue<LengthLimit>;
  minHeight?: SignalValue<LengthLimit>;
  maxHeight?: SignalValue<LengthLimit>;

  // Ratio
  ratio?: SignalValue<number>;
}

/**
 * Positional shortcut properties.
 */
export interface PositionalProps {
  top?: SignalValue<PossibleVector2<number>>;
  bottom?: SignalValue<PossibleVector2<number>>;
  left?: SignalValue<PossibleVector2<number>>;
  right?: SignalValue<PossibleVector2<number>>;
  middle?: SignalValue<PossibleVector2<number>>;
  topLeft?: SignalValue<PossibleVector2<number>>;
  topRight?: SignalValue<PossibleVector2<number>>;
  bottomLeft?: SignalValue<PossibleVector2<number>>;
  bottomRight?: SignalValue<PossibleVector2<number>>;
}
```

### 3. Visual and Styling Properties

These properties define the appearance of the image, including borders, effects, and corners. These are also inherited from `RectProps`.

```typescript
import { 
  SignalValue, 
  PossibleCanvasStyle, 
  PossibleColor, 
  Filter,
  GlobalCompositeOperation 
} from '@motion-canvas/2d/lib/types';

/**
 * Properties for controlling the visual appearance of a node.
 */
export interface VisualProps {
  // Fill and Stroke
  fill?: SignalValue<PossibleCanvasStyle>;
  stroke?: SignalValue<PossibleCanvasStyle>;
  lineWidth?: SignalValue<number>;
  strokeFirst?: SignalValue<boolean>;

  // Effects
  filters?: SignalValue<Filter[]>;
  shadowBlur?: SignalValue<number>;
  shadowColor?: SignalValue<PossibleColor>;
  shadowOffset?: SignalValue<PossibleVector2<number>>;

  // Corners
  radius?: SignalValue<PossibleSpacing>;
  cornerSharpness?: SignalValue<number>;
  smoothCorners?: SignalValue<boolean>;

  // Blending
  composite?: SignalValue<boolean>;
  compositeOperation?: SignalValue<GlobalCompositeOperation>;

  // Cache
  cache?: SignalValue<boolean>;
  cachePadding?: SignalValue<PossibleSpacing>;

  // Clipping
  clip?: SignalValue<boolean>;

  // Opacity
  opacity?: SignalValue<number>;

  // Antialiasing
  antialiased?: SignalValue<boolean>;
}
```

### 4. Transformation Properties

These properties control transformations like rotation, scaling, and skewing. Inherited from `RectProps`.

```typescript
import { SignalValue, PossibleVector2 } from '@motion-canvas/2d/lib/types';

/**
 * Properties for controlling the transformation of a node.
 */
export interface TransformProps {
  // Rotation
  rotation?: SignalValue<number>;

  // Scale
  scale?: SignalValue<PossibleVector2<number>>;
  scaleX?: SignalValue<number>;
  scaleY?: SignalValue<number>;

  // Skew
  skew?: SignalValue<PossibleVector2<number>>;
  skewX?: SignalValue<number>;
  skewY?: SignalValue<number>;

  // Origin (Offset)
  offset?: SignalValue<PossibleVector2<number>>;
  offsetX?: SignalValue<number>;
  offsetY?: SignalValue<number>;
}
```

### 5. Common Node Properties

These are generic properties that most nodes in the library share.

```typescript
import { SignalValue, ComponentChildren, ReferenceReceiver } from '@motion-canvas/2d/lib/types';

/**
 * Properties common to most scene graph nodes.
 */
export interface CommonNodeProps {
  children?: SignalValue<ComponentChildren>;
  ref?: ReferenceReceiver<any>;
  key?: string;
  zIndex?: SignalValue<number>;
}
```

### 6. Complete `ImgProps` Interface

Finally, we combine all these smaller interfaces to create the complete `ImgProps`. This interface is what you would use when typing the props for an `Img` component.

```typescript
/**
 * Props for the {@link Img} component.
 * The Img component is used for displaying images.
 */
export interface ImgProps extends
  ImgCoreProps,
  LayoutProps,
  PositionalProps,
  VisualProps,
  TransformProps,
  CommonNodeProps {
  // All properties are covered by the extended interfaces.
}
```

### How to Use

You would use these interfaces when creating an `<Img>` node in your scene. The properties defined in `ImgProps` are the attributes you can set directly in the JSX tag.

```typescript
import { makeScene2D } from '@motion-canvas/2d';
import { Img } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/2d/lib/utils';
import { all } from '@motion-canvas/core/lib/tweening';

// In your scene file:
export default makeScene2D(function* (view) {
  const imageRef = createRef<Img>();

  // Here you are using the ImgProps interface to configure the component
  yield view.add(
    <Img
      ref={imageRef}
      // ImgCoreProps
      src="https://images.unsplash.com/photo-1679218407381-a6f1660d60e9"
      alpha={1}
      smoothing={true}

      // LayoutProps
      width={300}
      height={null} // null means automatic height based on aspect ratio
      position={[0, 0]}

      // VisualProps
      radius={20}
      filters={[]} // e.g., [{ blur: 5 }]

      // TransformProps
      rotation={0}
      scale={1}
    />
  );

  // You can then animate these properties using the class methods
  yield* all(
    imageRef().rotation(360, 2),
    imageRef().scale(1.5, 2),
  );
});
```