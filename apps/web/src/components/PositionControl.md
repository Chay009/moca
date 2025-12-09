# PositionControl Component

A reusable React component for controlling X/Y coordinates with an interactive 2D slider and optional fine-tune inputs.

## Overview

The `PositionControl` component wraps the `TwoDSlider` component and provides a complete UI for managing 2D positions. It includes:
- An interactive 2D slider for visual position control
- Optional fine-tune number inputs for precise adjustments
- Customizable ranges and labels
- Clean, consistent styling

## Installation

The component is already available in the project at:
```
src/components/PositionControl.tsx
```

## Basic Usage

```tsx
import { PositionControl } from '@/components/PositionControl';

function MyComponent() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <PositionControl
      x={position.x}
      y={position.y}
      onXChange={(x) => setPosition(prev => ({ ...prev, x }))}
      onYChange={(y) => setPosition(prev => ({ ...prev, y }))}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `x` | `number` | **required** | The current X value |
| `y` | `number` | **required** | The current Y value |
| `onXChange` | `(value: number) => void` | **required** | Callback when X value changes |
| `onYChange` | `(value: number) => void` | **required** | Callback when Y value changes |
| `label` | `string` | `"Position"` | Label for the control |
| `minX` | `number` | `-1920` | Minimum value for X axis |
| `maxX` | `number` | `1920` | Maximum value for X axis |
| `minY` | `number` | `-1080` | Minimum value for Y axis |
| `maxY` | `number` | `1080` | Maximum value for Y axis |
| `xLabel` | `string` | `"X"` | Label for the X axis |
| `yLabel` | `string` | `"Y"` | Label for the Y axis |
| `showInputs` | `boolean` | `true` | Show fine-tune inputs below slider |
| `className` | `string` | `""` | Optional class name for the container |

## Examples

### Element Position Control

```tsx
<PositionControl
  x={element.x}
  y={element.y}
  onXChange={(x) => updateElement({ x })}
  onYChange={(y) => updateElement({ y })}
  label="Element Position"
/>
```

### Shadow Offset Control

```tsx
<PositionControl
  x={shadowOffsetX}
  y={shadowOffsetY}
  onXChange={(x) => setShadowOffsetX(x)}
  onYChange={(y) => setShadowOffsetY(y)}
  label="Shadow Offset"
  minX={-50}
  maxX={50}
  minY={-50}
  maxY={50}
/>
```

### Camera Position Control

```tsx
<PositionControl
  x={camera.x}
  y={camera.y}
  onXChange={(x) => updateCamera({ x })}
  onYChange={(y) => updateCamera({ y })}
  label="Camera Position"
  minX={-5000}
  maxX={5000}
  minY={-5000}
  maxY={5000}
/>
```

### Anchor Point Control

```tsx
<PositionControl
  x={anchor.x}
  y={anchor.y}
  onXChange={(x) => setAnchor({ ...anchor, x })}
  onYChange={(y) => setAnchor({ ...anchor, y })}
  label="Anchor Point"
  minX={-1}
  maxX={1}
  minY={-1}
  maxY={1}
  xLabel="Horizontal"
  yLabel="Vertical"
/>
```

### Without Fine-Tune Inputs

```tsx
<PositionControl
  x={position.x}
  y={position.y}
  onXChange={setX}
  onYChange={setY}
  showInputs={false}
/>
```

## Integration with Zustand Store

When using with a Zustand store (like in StyleSettings):

```tsx
import { useSceneStore } from '@/store/sceneStore';

function ElementEditor() {
  const selectedElement = useSceneStore((state) => state.selectedElement);
  const updateElement = useSceneStore((state) => state.updateElement);

  return (
    <PositionControl
      x={selectedElement.x || 0}
      y={selectedElement.y || 0}
      onXChange={(x) => updateElement({ x })}
      onYChange={(y) => updateElement({ y })}
    />
  );
}
```

## Styling

The component uses Tailwind CSS classes and follows the project's design system. You can add custom styling using the `className` prop:

```tsx
<PositionControl
  x={x}
  y={y}
  onXChange={setX}
  onYChange={setY}
  className="my-4 p-4 bg-gray-50 rounded-lg"
/>
```

## Use Cases

The `PositionControl` component is perfect for:

1. **Element Positioning** - Position elements on a canvas
2. **Shadow Offsets** - Control shadow X/Y offsets
3. **Camera Controls** - Manage camera position in 2D/3D scenes
4. **Anchor Points** - Set transformation anchor points
5. **Offset Controls** - Any 2D offset or translation
6. **Gradient Centers** - Position gradient focal points
7. **Light Positioning** - Control light source positions
8. **Particle Emitters** - Set emitter positions
9. **Path Points** - Define control points for paths
10. **Viewport Panning** - Control viewport pan offsets

## Related Components

- **TwoDSlider** - The underlying 2D slider component
- **Input** - Shadcn UI input component for fine-tune controls
- **Label** - Shadcn UI label component

## Notes

- The component automatically handles the conversion between the slider's visual representation and the actual numeric values
- Fine-tune inputs allow for precise adjustments beyond the slider's granularity
- The component is fully keyboard accessible through the underlying TwoDSlider
- Values are clamped to the specified min/max ranges
