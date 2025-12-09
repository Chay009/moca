## Quick Answer
all nodes extend layout wo like div wcan add layout styling 

but why we revideo ahev aseperate ayout node

The `Layout` component exists as a dedicated container for grouping and arranging other components when you don't need visual properties like fill, stroke, or specific shapes. It's essentially a "div" equivalent in Revideo - invisible but provides flexbox layout capabilities.

## Detailed Explanation

### Layout as a Container Component

While all visual components (Txt, Rect, Circle, Video, etc.) inherit flexbox properties from Layout [1](#9-0) , the standalone `Layout` component serves specific purposes:

1. **Pure Layout Container**: When you need to group elements without adding visual styling
2. **Structural Organization**: Creating logical groups in your component hierarchy
3. **Performance**: Lighter weight than shape components since it has no rendering logic

### When to Use Layout vs Other Components

```tsx
// Use Layout for pure container purposes
<Layout direction="row" gap={20}>
  <Txt text="Item 1" />
  <Txt text="Item 2" />
</Layout>

// Use Rect when you need a visible container with styling
<Rect direction="row" gap={20} fill="blue" stroke="white">
  <Txt text="Item 1" />
  <Txt text="Item 2" />
</Rect>
```

### Layout's Minimal Implementation

The Layout component is essentially just the Layout class with no additional rendering logic [2](#9-1) . It creates a DOM element with flexbox styling [3](#9-2)  but doesn't draw anything to the canvas.

### Real-world Example

In the template example, Layout is used to structure the scene:
```tsx
<Layout ref={outerLayoutRef} layout alignItems={'center'} gap={40}>
  <Img src={repoImage()} width={100} height={100} />
  <Layout ref={innerLayoutRef} direction={'column'}>
    <Txt text={repoName()} />
  </Layout>
</Layout>
``` [4](#9-3) 

Here, Layout components provide structure without adding visual elements themselves.

## Notes

- Layout is the only component that's purely for layout - all others have visual rendering capabilities
- You can nest Layout components to create complex layouts
- Layout components still support all positioning, size, and transform properties from Node
- The `layout` property on Layout components enables the flexbox system (defaults to false)

Wiki pages you might want to explore:
- [2D Components (redotvideo/revideo)](/wiki/redotvideo/revideo#3)

### Citations

**File:** packages/2d/src/lib/components/Layout.ts (L82-94)
```typescript
  direction?: SignalValue<FlexDirection>;
  basis?: SignalValue<FlexBasis>;
  grow?: SignalValue<number>;
  shrink?: SignalValue<number>;
  wrap?: SignalValue<FlexWrap>;

  justifyContent?: SignalValue<FlexContent>;
  alignContent?: SignalValue<FlexContent>;
  alignItems?: SignalValue<FlexItems>;
  alignSelf?: SignalValue<FlexItems>;
  rowGap?: SignalValue<Length>;
  columnGap?: SignalValue<Length>;
  gap?: SignalValue<Length>;
```

**File:** packages/2d/src/lib/components/Layout.ts (L196-201)
```typescript
@nodeName('Layout')
export class Layout extends Node {
  @initial(null)
  @interpolation(boolLerp)
  @signal()
  public declare readonly layout: SimpleSignal<LayoutMode, this>;
```

**File:** packages/2d/src/lib/components/Layout.ts (L1087-1092)
```typescript
addInitializer<Layout>(Layout.prototype, instance => {
  instance.element = document.createElement('div');
  instance.element.style.display = 'flex';
  instance.element.style.boxSizing = 'border-box';
  instance.styles = getComputedStyle(instance.element);
});
```

**File:** packages/template/src/example.tsx (L132-161)
```typescript
      <Layout
        ref={outerLayoutRef}
        layout
        alignItems={'center'}
        gap={40}
        x={-870}
        y={-400}
        offset={[-1, 0]}
      >
        <Img
          src={repoImage()}
          width={100}
          height={100}
          stroke={'#555555'}
          lineWidth={8}
          strokeFirst={true}
          radius={10}
        />
        <Layout ref={innerLayoutRef} direction={'column'}>
          <Txt
            fontFamily={'Roboto'}
            text={repoName()}
            fill={'#ffffff'}
            x={-520}
            y={-395}
            fontSize={50}
            fontWeight={600}
          />
        </Layout>
      </Layout>
```
