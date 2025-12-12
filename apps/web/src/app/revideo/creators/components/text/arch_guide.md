# Component System Architecture
this should be same for other ele as well
## Overview
we so the same with multi node we just create it the animation.tsx and just import in mainscene 

Single text component with registry-based effects system. Effects are prop-driven, not type-driven.

## Architecture

```
Text Component (type: 'text')
  └─> reads animation.textEffect.type prop
      └─> looks up effect in registry
          └─> effect.createNode() returns node structure
          └─> effect.animate() runs animation
```

## Folder Structure

```
src/app/revideo/creators/
├── components/
│   └── text/
│       ├── Text/
│       │   ├── animation.tsx       # Main component, uses effect registry
│       │   ├── default_props.ts    # Default props
│       │   └── index.ts           # ComponentPlugin definition
│       └── registry.ts            # Component registry
│
├── effects/
│   └── textEffects/
│       ├── registry.ts            # Effect registry
│       ├── typewriter.tsx         # Multi-node effect (Layout)
│       ├── shimmer.tsx            # Multi-node effect (Layout)
│       ├── glitch.tsx             # Single-node effect (Txt)
│       └── wave.tsx               # Single-node effect (Txt)
│
└── types/
    └── animatedComponent.ts       # AnimatedComponent interface
```

## File Templates

### Effect File (effects/textEffects/[effect].tsx)

```typescript
/** @jsxImportSource @revideo/2d/lib */

import { Txt, Layout } from '@revideo/2d';
import { createRef, type Reference } from '@revideo/core';

export interface EffectNameProps {
  elementId?: string;
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  duration?: number;
  // effect-specific props
  [key: string]: any;
}

export const effectNameEffect = {
  createNode: (props: EffectNameProps) => {
    // Extract effect-specific props to avoid passing to JSX
    const { elementId, duration, ...nodeProps } = props;

    const ref = createRef<Txt>(); // or Layout for multi-node

    const node = (
      <Txt
        key={elementId}                    // REQUIRED for hit detection
        ref={ref}
        text={props.text ?? 'Text'}
        fontSize={props.fontSize ?? 50}
        fontFamily={props.fontFamily ?? 'Arial'}
        fill={props.fill ?? '#ffffff'}
        {...nodeProps}                     // REQUIRED: spreads x, y, rotation, scale
      />
    );

    return { node, ref };
  },

  animate: function* (ref: any, props: EffectNameProps) {
    const node = ref();
    const duration = props.duration ?? 2;

    // Animation logic here
    yield* node.opacity(1, duration);
  }
};
```

### Multi-Node Effect (Layout)

```typescript
export const multiNodeEffect = {
  createNode: (props: EffectProps) => {
    const { elementId, duration, ...layoutProps } = props;
    const refs: Reference<Txt>[] = [];
    const layoutRef = createRef<Layout>();

    const chars = props.text.split('');

    const node = (
      <Layout
        key={elementId}                    // REQUIRED for hit detection
        ref={layoutRef}
        layout
        direction="row"
        gap={0}
        {...layoutProps}                   // REQUIRED: spreads x, y, rotation, scale
      >
        {chars.map((char, i) => {
          const ref = createRef<Txt>();
          refs.push(ref);
          return (
            <Txt key={`char-${i}`} ref={ref} text={char} opacity={0} />
          );
        })}
      </Layout>
    );

    return { node, refs, ref: layoutRef };
  },

  animate: function* (refs: Reference<Txt>[], props: EffectProps) {
    for (let i = 0; i < refs.length; i++) {
      yield* refs[i]().opacity(1, 0.1);
    }
  }
};
```

## Adding New Effect - Step by Step

### 1. Create Effect File
Location: `effects/textEffects/yourEffect.tsx`

Requirements:
- Export interface: `YourEffectProps`
- Export object: `yourEffectEffect`
- Must have: `createNode(props)` and `animate(ref, props)`
- Extract effect-specific props before spreading: `const { elementId, duration, ...nodeProps } = props`
- Add `key={elementId}` to root node
- Spread remaining props: `{...nodeProps}` or `{...layoutProps}`

### 2. Register Effect
File: `effects/textEffects/registry.ts`

```typescript
import { yourEffectEffect } from './yourEffect';

export const textEffectsRegistry: Record<string, TextEffect> = {
  'typewriter': typewriterEffect,
  'shimmer': shimmerEffect,
  'glitch': glitchEffect,
  'wave': waveEffect,
  'yourEffect': yourEffectEffect,  // ADD THIS
};
```

### 3. Update UI
File: `app/editor/components/LeftSideBar.tsx`

Add dropdown option:
```typescript
<SelectContent>
  <SelectItem value="none">None</SelectItem>
  <SelectItem value="glitch">Glitch</SelectItem>
  <SelectItem value="wave">Wave</SelectItem>
  <SelectItem value="typewriter">Typewriter</SelectItem>
  <SelectItem value="shimmer">Shimmer</SelectItem>
  <SelectItem value="yourEffect">Your Effect</SelectItem>  // ADD THIS
</SelectContent>
```

### 4. Test
- Add text element (type: 'text')
- Select effect from dropdown
- Verify animation runs
- Verify element is clickable after animation
- Verify drag/drop works
- Verify overlay syncs correctly

## Critical Requirements

### 1. elementId as key (REQUIRED)
```typescript
// WRONG - not clickable
<Txt ref={ref} text="Hello" />

// CORRECT - clickable
<Txt key={elementId} ref={ref} text="Hello" />
```

Why: Hit detection system uses `node.key` to match clicked node to elementMap.

### 2. Spread Props (REQUIRED)
```typescript
// WRONG - no position/transform
const { elementId, duration } = props;
<Txt key={elementId} ref={ref} text={props.text} />

// CORRECT - includes x, y, rotation, scale
const { elementId, duration, ...nodeProps } = props;
<Txt key={elementId} ref={ref} {...nodeProps} />
```

Why: Overlay sync calculation expects node to have x, y position. Without spread, node is at (0,0).

### 3. Extract Effect Props (REQUIRED)
```typescript
// WRONG - passes 'duration' to JSX (warning/error)
<Txt {...props} />

// CORRECT - filters effect-specific props
const { elementId, duration, intensity, ...nodeProps } = props;
<Txt {...nodeProps} />
```

Why: JSX nodes don't accept arbitrary props. Only spread valid node properties.

## Effect Registry Pattern

### Effect Lookup Flow
```typescript
// 1. User changes dropdown to 'glitch'
updateTextEffect('type', 'glitch')

// 2. Text component receives props
props.animation.textEffect.type = 'glitch'

// 3. Component looks up effect
const effect = textEffectsRegistry['glitch']

// 4. Effect creates node
const { node, ref } = effect.createNode(props)

// 5. MainScene calls animate
yield* effect.animate(ref, props)
```

### Registry Type
```typescript
export interface TextEffect {
  createNode: (props: any) => {
    node: any;
    ref?: any;
    refs?: any[];
  };
  animate: (refs: any, props: any) => Generator<any, void, any>;
}
```

## Common Patterns

### Single-node effect (Txt)
- One Txt element
- Simple animations (glitch, wave, fade)
- Returns: `{ node, ref }`
- Animate receives: single ref

### Multi-node effect (Layout)
- Layout with multiple Txt children
- Per-character animations (typewriter, shimmer)
- Returns: `{ node, refs, ref }`
- Animate receives: array of refs

Example effects:
- typewriter: Characters appear one by one
- shimmer: Characters light up in sequence with color/scale change

## MainScene Integration

Execution flow:
1. sceneComposer calls `createComponent({ type: 'text', ...props })`
2. Text component calls `effect.createNode(props)`
3. Node added to view
4. Entrance animation (opacity 0 -> 1)
5. Component animate() called: `yield* effect.animate(refs, props)`
6. Hold phase
7. Exit animation

## Component vs Effect

Component:
- File: `components/text/Text/`
- Registered in: `components/text/registry.ts`
- Creates: single component type ('text')
- Role: reads effect type from props, delegates to effect registry

Effect:
- File: `effects/textEffects/effectName.tsx`
- Registered in: `effects/textEffects/registry.ts`
- Creates: node structure + animation
- Role: implements specific animation behavior

## Checklist for New Effect

- [ ] Create effect file in `effects/textEffects/`
- [ ] Export interface with props
- [ ] Export effect object with createNode and animate
- [ ] Extract effect props: `const { elementId, duration, ...nodeProps } = props`
- [ ] Add `key={elementId}` to root node
- [ ] Spread props: `{...nodeProps}` or `{...layoutProps}`
- [ ] Register in `effects/textEffects/registry.ts`
- [ ] Add to LeftSideBar dropdown
- [ ] Test: animation, click detection, drag, overlay sync

## Troubleshooting

**Element not clickable after animation:**
- Check: Does root node have `key={elementId}`?
- Check: Is elementId passed to createNode()?

**Overlay not syncing:**
- Check: Does node have `{...nodeProps}` spread?
- Check: Are x, y props being passed through?

**Animation not running:**
- Check: Is effect registered in registry.ts?
- Check: Does effect.animate return generator?

**Props warning in console:**
- Check: Are effect-specific props extracted before spread?
- Example: `const { duration, intensity, ...rest } = props`
