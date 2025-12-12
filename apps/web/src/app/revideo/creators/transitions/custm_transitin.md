Yes, you can create custom cinematic transitions in Revideo using the `useTransition` hook and the signal system. Here are generator function examples for advanced cinematic transitions:

## Custom Transition Foundation

Use `useTransition` to manipulate the canvas context before scenes render [1](#1-0) :

```typescript
export function* cinematicTextTransition(duration = 1.5): ThreadGenerator {
  const scene = useScene();
  const textReveal = createSignal(0);
  const cameraZoom = createSignal(1.5);
  const cameraRotation = createSignal(0.1);
  
  const endTransition = useTransition(
    // Current scene transformations
    ctx => {
      ctx.save();
      ctx.translate(scene.getSize().x / 2, scene.getSize().y / 2);
      ctx.scale(cameraZoom(), cameraZoom());
      ctx.rotate(cameraRotation());
      ctx.translate(-scene.getSize().x / 2, -scene.getSize().y / 2);
      
      // Text reveal effect
      ctx.globalAlpha = textReveal();
    },
    // Previous scene transformations  
    ctx => {
      ctx.save();
      ctx.globalAlpha = 1 - textReveal();
      ctx.scale(1.2, 1.2);
    }
  );
  
  yield* all(
    textReveal(1, duration, easeOutCubic),
    cameraZoom(1, duration, easeOutCubic),
    cameraRotation(0, duration, easeOutCubic)
  );
  
  endTransition();
}
```

## Camera Movement Transition

```typescript
export function* cameraPanTransition(direction: 'left' | 'right' | 'up' | 'down', duration = 1.2): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const cameraOffset = Vector2.createSignal();
  
  // Set initial camera position based on direction
  const initialOffset = {
    left: [-size.x, 0],
    right: [size.x, 0], 
    up: [0, -size.y],
    down: [0, size.y]
  }[direction];
  
  cameraOffset(initialOffset);
  
  const endTransition = useTransition(
    ctx => ctx.translate(cameraOffset.x(), cameraOffset.y()),
    ctx => ctx.translate(cameraOffset.x() * 0.5, cameraOffset.y() * 0.5)
  );
  
  yield* cameraOffset(Vector2.zero, duration, easeInOutCubic);
  endTransition();
}
```

## Glitch Text Transition

```typescript
export function* glitchTextTransition(duration = 2): ThreadGenerator {
  const glitch = createSignal(0);
  const textOpacity = createSignal(0);
  const chromatic = createSignal(0);
  
  const endTransition = useTransition(
    ctx => {
      // RGB split effect
      if (chromatic() > 0) {
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = `rgba(255, 0, 0, ${chromatic() * 0.1})`;
        ctx.fillRect(2, 0, scene.getSize().x, scene.getSize().y);
        ctx.fillStyle = `rgba(0, 255, 0, ${chromatic() * 0.1})`;
        ctx.fillRect(-2, 0, scene.getSize().x, scene.getSize().y);
      }
      ctx.globalAlpha = textOpacity();
    },
    ctx => {
      ctx.globalAlpha = 1 - textOpacity();
      // Glitch effect on previous scene
      if (glitch() > 0.5) {
        ctx.translate(Math.random() * 4 - 2, Math.random() * 4 - 2);
      }
    }
  );
  
  yield* all(
    glitch(1, duration * 0.3, easeInOutBounce),
    textOpacity(1, duration, easeOutCubic),
    chromatic(1, duration * 0.5, easeInOutSine)
  );
  
  endTransition();
}
```

## Usage in Scenes

```typescript
export default makeScene2D(function* (view) {
  // Your scene content here
  
  // Apply custom transition at the end
  yield* cinematicTextTransition();
});
```

## Notes

All custom transitions follow the same pattern as built-in ones like `slideTransition`<cite repo="redotvideo/revideo" path="packages/core/src/transitions/slideTransition.ts" start="28" end="46"> - they create signals for animation properties, use `useTransition` to apply canvas transformations, then animate the signals using the tweening system with various timing functions<cite repo="redotvideo/revideo" path="packages/core/src/tweening/timingFunctions.ts" start="246" end="279"> for cinematic effects.

Wiki pages you might want to explore:
- [Signal System (redotvideo/revideo)](/wiki/redotvideo/revideo#2.3)

### Citations

**File:** packages/core/src/transitions/useTransition.ts (L11-36)
```typescript
export function useTransition(
  current: (ctx: CanvasRenderingContext2D) => void,
  previous?: (ctx: CanvasRenderingContext2D) => void,
  previousOnTop?: SignalValue<boolean>,
) {
  if (previous == null) {
    previous = () => {
      // do nothing
    };
  }

  const scene = useScene();
  const prior = scene.previous;
  scene.previousOnTop = previousOnTop ?? false;

  const unsubPrev = prior?.lifecycleEvents.onBeforeRender.subscribe(previous);
  const unsubNext = scene.lifecycleEvents.onBeforeRender.subscribe(current);

  scene.enterInitial();

  return () => {
    scene.enterAfterTransitionIn();
    unsubPrev?.();
    unsubNext();
  };
}
```
