# Adding New Components - Quick Guide

## 1. Create Component Folder

```
components/text/YourComponent/
```

## 2. Create 4 Required Files

### a. `default_props.ts`
```ts
export const YOUR_COMPONENT_DEFAULT_PROPS = {
  // Common props
  x: 0,
  y: 0,
  rotation: 0,
  scale: 1,
  opacity: 1,

  // Component-specific props
  yourCustomProp: defaultValue,
};
```

### b. `animation.tsx`
```tsx
/** @jsxImportSource @revideo/2d/lib */
import { Txt } from '@revideo/2d';

export function* createYourComponent(props: any) {
  const node = (
    <Txt
      key={props.elementId}
      text={props.text}
      // ... other props
    />
  );

  // Add animation logic with yield*
  yield* node.opacity(1, props.duration);

  return node;
}
```

### c. `propertyPanel.tsx`
```tsx
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { PropertyPanelProps } from '../../types/componentPlugin';

export function YourComponentPropertyPanel({ element, onUpdate }: PropertyPanelProps) {
  const updateProperty = (key: string, value: any) => {
    onUpdate({ [key]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Your Property</Label>
        <Slider
          value={[element.properties.yourProp]}
          onValueChange={([value]) => updateProperty('yourProp', value)}
          min={0}
          max={100}
        />
      </div>
    </div>
  );
}
```

### d. `index.ts`
```ts
import { ComponentPlugin } from '../../../types/componentPlugin';
import { YOUR_COMPONENT_DEFAULT_PROPS } from './default_props';
import { createYourComponent } from './animation';
import { YourComponentPropertyPanel } from './propertyPanel';

export const YourComponent: ComponentPlugin = {
  type: 'your-component',
  category: 'text',
  displayName: 'Your Component',
  icon: '...',

  defaultProps: YOUR_COMPONENT_DEFAULT_PROPS,
  create: createYourComponent,
  PropertyPanel: YourComponentPropertyPanel,
};
```

## 3. Register Component

In `components/text/registry.ts`:
```ts
import { YourComponent } from './YourComponent/index';

export const textComponents: ComponentRegistry = {
  // ... existing
  [YourComponent.type]: YourComponent,
};
```

## 4. Done

Component is now:
- Available in UI dropdowns
- Uses default props from registry
- Has custom property panel
- Runs animations via generator function

## File Structure

```
YourComponent/
  default_props.ts    - Default values
  animation.tsx       - Motion Canvas generator function
  propertyPanel.tsx   - React UI for editing
  index.ts            - Plugin definition
```

## Notes

- Use `/** @jsxImportSource @revideo/2d/lib */` at top of animation.tsx
- Generator functions use `function*` and `yield*`
- PropertyPanel receives element and onUpdate callback
- Component type must be unique across all categories
