# Scene Transition Presets

Cinematic transitions between scenes using the Motion Canvas `useTransition` pattern.

## Categories

### 1. Slide Transitions (5 presets)
- **slide-left/right/up/down** - Classic directional slide
- **push-left** - Current scene pushes previous scene out
- **slide-fade** - Slide with opacity fade

### 2. Fade Transitions (5 presets)
- **fade** - Simple crossfade
- **fade-to-black** - Fade through black
- **dip-to-black** - Quick dip to black
- **dip-to-white** - Quick dip to white
- **fade-blur** - Crossfade with blur effect

### 3. Zoom Transitions (5 presets)
- **zoom-in** - Zoom into the scene
- **zoom-out** - Zoom out from the scene
- **zoom-rotate** - Cinematic zoom with rotation
- **ken-burns** - Slow zoom and pan (documentary style)
- **dolly-zoom** - Vertigo effect (Hitchcock style)

### 4. Cinematic Transitions (6 presets)
- **whip-pan-left/right** - Fast camera whip with motion blur
- **glitch** - Digital glitch with RGB split
- **film-burn** - Vintage film burn effect with sepia
- **lens-flare** - Bright light flare sweep
- **vortex** - Spiral rotation and zoom

### 5. Wipe Transitions (9 presets)
- **wipe-left/right/up/down** - Directional wipe reveals
- **clock-wipe** - Circular wipe like a clock hand
- **iris-expand/contract** - Circular iris effect
- **barn-door-horizontal/vertical** - Doors opening from center
- **diamond-wipe** - Diamond shape expansion
- **diagonal-wipe** - Corner-to-corner wipe

## Usage

### Direct Import
```typescript
import { fadeTransition, slideTransition } from '@/app/revideo/creators/presets/sceneTransitions';

export default makeScene2D(function* (view) {
  // Add your scene content
  view.add(<Txt text="Scene 2" />);

  // Apply transition at the beginning
  yield* fadeTransition(1.0);

  // Continue with your animation
  yield* waitFor(3);
});
```

### Using Registry
```typescript
import { getTransition } from '@/app/revideo/creators/presets/sceneTransitions';

export default makeScene2D(function* (view) {
  view.add(<Txt text="Scene 2" />);

  // Get transition from registry
  const transition = getTransition('glitch');
  if (transition) {
    yield* transition.generator(transition.duration);
  }

  yield* waitFor(3);
});
```

### Dynamic Selection (from UI)
```typescript
// In your scene generator
export default makeScene2D(function* (view) {
  view.add(/* scene content */);

  // Get transition name from scene data
  const transitionName = useScene().variables.get('transition', 'fade');
  const transition = getTransition(transitionName);

  if (transition) {
    yield* transition.generator(transition.duration);
  }

  yield* waitFor(3);
});
```

## Customization

All transitions accept optional parameters:

```typescript
// Custom duration
yield* fadeTransition(2.0); // 2 seconds instead of default 0.6

// Custom direction
yield* slideTransition('right', 1.0);

// Custom color
yield* fadeToColorTransition('#ff0000', 1.5); // fade through red

// Custom parameters
yield* irisWipeTransition(
  true,              // expand (vs contract)
  960,               // center x
  540,               // center y
  1.2                // duration
);
```

## Architecture

Each transition follows the `useTransition` pattern:

1. **Create signals** for animation properties (position, opacity, scale, etc.)
2. **Set up transition** with two context callbacks:
   - Current scene transformations
   - Previous scene transformations
3. **Animate signals** using tweening functions
4. **End transition** to clean up

Example structure:
```typescript
export function* customTransition(duration = 1.0): ThreadGenerator {
  const scene = useScene();
  const opacity = createSignal(0);

  const endTransition = useTransition(
    ctx => ctx.globalAlpha = opacity(),      // Current scene
    ctx => ctx.globalAlpha = 1 - opacity()   // Previous scene
  );

  yield* opacity(1, duration, easeInOutCubic);

  endTransition();
}
```

## Adding New Transitions

1. Create transition file in appropriate category folder
2. Export generator function following the pattern above
3. Add to registry in `registry.ts`
4. Export from `index.ts`

## Notes

- All transitions use generator functions (`function*`)
- Transitions run at the START of the new scene
- Always add scene content BEFORE yielding transition
- Use `finishScene()` to trigger transition early while animating
- Easing functions available: `easeInOutCubic`, `easeInCubic`, `easeOutCubic`, `linear`, etc.

## Total: 30 Transition Presets

Perfect for any video editing workflow!
