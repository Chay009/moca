# Category‑Based Component System – Quick Guide

## Purpose
Provide a short, actionable reference for developers (or agents) to understand and extend the category‑based component architecture.

## 1. Core Utility Functions
Create **`utils.ts`** (already exists) with the following helpers:
```ts
export const getComponentByType = (type: string) => componentRegistry[type];
export const isCategory = (type: string, category: string) => getComponentByType(type)?.category === category;
export const isTextComponent = (type: string) => isCategory(type, 'text');
export const isMediaComponent = (type: string) => isCategory(type, 'media');
export const isShapeComponent = (type: string) => isCategory(type, 'shapes');
export const getDisplayName = (type: string) => getComponentByType(type)?.displayName ?? type;
export const getDefaultProps = (type: string) => getComponentByType(type)?.defaultProps ?? {};
```
These functions replace direct registry look‑ups and string matching.

## 2. Update UI Components
### StyleSettings.tsx
```tsx
import { isTextComponent } from '@/app/revideo/creators/components/utils';
const isTextElement = isTextComponent(selectedElement.type);
```
Use `isTextComponent` wherever a text‑specific UI block is needed.

### SceneElementPanel.tsx
Replace the element label logic with:
```tsx
import { isTextComponent, getDisplayName } from '@/app/revideo/creators/components/utils';
{(() => {
  if (isTextComponent(element.type)) {
    return element.properties.text || getDisplayName(element.type);
  }
  return getDisplayName(element.type);
})()}
```

### AddElements.tsx
When adding a new element, use the helpers:
```tsx
import { getComponentByType, getDefaultProps } from '@/app/revideo/creators/components/utils';
const component = getComponentByType('text-simple');
if (component) {
  addElementToScene(currentScene.id, {
    type: 'text-simple',
    properties: getDefaultProps('text-simple'),
  });
  toast.success(`${component.displayName} added`);
}
```
Apply the same pattern for other component types.

## 3. Adding a New Component (e.g., Image)
1. **Create component folder** `media/ImageSimple/` with `index.ts`, `default_props.ts`, `animation.tsx`, `propertyPanel.tsx`.
2. **Define the plugin** in `index.ts`:
   ```ts
   export const ImageSimpleComponent: ComponentPlugin = {
     type: 'image-simple',
     category: 'media',
     displayName: 'Image',
     defaultProps: IMAGE_DEFAULT_PROPS,
     create: createImage,
   };
   ```
3. **Register** it in `media/registry.ts` and add the export to the root `componentRegistry`.
4. **UI updates** – the existing utility functions automatically expose the new component:
   * `isMediaComponent('image-simple')` returns `true`.
   * `getDisplayName('image-simple')` provides the label.
   * `getDefaultProps('image-simple')` supplies default properties for `AddElements`.
5. **StyleSettings** – add any media‑specific controls (e.g., width/height) using the same pattern as text controls.

## 4. Benefits
- **Single source of truth** – all metadata lives in the registry.
- **No fragile string checks** – category helpers are type‑safe.
- **Easy extension** – add a new component, update its `category`, and the UI picks it up automatically.

---
*Use this guide as the starting point for any future component additions or UI adjustments.*
