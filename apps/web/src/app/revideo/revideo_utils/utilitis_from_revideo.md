there are two type of utils one core and other is 2d
2d is components like react for analogy and core is like anaimtions

Utils in Revideo are collections of helper functions organized by package and domain. They provide common functionality used throughout the framework.

## Core Utils

The main utils are in `packages/core/src/utils/` [1](#7-0) , which exports:

- **Reference utilities**: `createRef`, `createRefArray`, `createRefMap` for component references
- **Scene utilities**: `beginSlide`, `useScene`, `usePlayback`, `useThread`, `useTime` for scene management
- **Debug utilities**: `debug`, `errorToLog`, `ExperimentalError`, `experimentalLog`
- **Math utilities**: `range` and other math functions
- **General helpers**: `capitalize`, `deprecate`, `DetailedError`, `Semaphore`

## UI Utils

UI-specific utilities are in `packages/ui/src/utils/` [2](#7-1) :

- `clamp` - Number clamping
- `compareVersions` - Version comparison
- `formatDuration` - Time formatting
- `localStorage` - Local storage helpers
- `LoggerManager` - Logging management
- `mouse` - Mouse event utilities
- `openOutputPath` - File path operations

## FFmpeg Utils

FFmpeg package has its own utilities in `packages/ffmpeg/src/utils.ts` [3](#7-2) :

- `resolvePath` - Resolves asset paths (handles HTTP/HTTPS/data URLs)
- `makeSureFolderExists` - Ensures directories exist

## Math Helpers

Additional math utilities are in the tweening package [4](#7-3) :

- `map` - Linear interpolation between numbers
- `remap` - Map value from one range to another
- `clamp` - Clamp value between min and max
- `clampRemap` - Combined clamp and remap operation

## Notes

- Utils are organized by domain (core, ui, ffmpeg) to keep concerns separate
- Each package exports its utils through an index file for clean imports
- Core utils provide the foundational helpers used across the entire framework
- Math utilities support animation and interpolation operations

Wiki pages you might want to explore:
- [Core System (redotvideo/revideo)](/wiki/redotvideo/revideo#2)

Wiki pages you might want to explore:
- [Signal System (redotvideo/revideo)](/wiki/redotvideo/revideo#2.3)

### Citations

**File:** packages/core/src/utils/index.ts (L1-26)
```typescript
/**
 * General utilities and helper functions.
 *
 * @packageDocumentation
 */

export * from './beginSlide';
export * from './capitalize';
export * from './createRef';
export * from './createRefArray';
export * from './createRefMap';
export * from './debug';
export * from './deprecate';
export * from './DetailedError';
export * from './errorToLog';
export * from './ExperimentalError';
export * from './experimentalLog';
export * from './getContext';
export * from './math';
export * from './range';
export * from './Semaphore';
export * from './useContext';
export * from './usePlayback';
export * from './useScene';
export * from './useThread';
export * from './useTime';
```

**File:** packages/ui/src/utils/index.ts (L1-11)
```typescript
export * from './clamp';
export * from './compareVersions';
export * from './formatDuration';
export * from './localStorage';
export * from './LoggerManager';
export * from './mouse';
export * from './openOutputPath';
export * from './sourceMaps';
export * from './withLoader';

```

**File:** packages/ffmpeg/src/utils.ts (L10-33)
```typescript
export function resolvePath(output: string, assetPath: string) {
  let resolvedPath: string;
  if (
    assetPath.startsWith('http://') ||
    assetPath.startsWith('https://') ||
    assetPath.startsWith('data:')
  ) {
    resolvedPath = assetPath;
  } else {
    resolvedPath = path.join(output, '../public', assetPath);
  }
  return resolvedPath;
}

export async function makeSureFolderExists(folderPath: string) {
  if (
    await fs.promises
      .access(folderPath)
      .then(() => false)
      .catch(() => true)
  ) {
    await fs.promises.mkdir(folderPath, {recursive: true});
  }
}
```

**File:** packages/core/src/tweening/helpers.ts (L1-30)
```typescript
export function map(from: number, to: number, value: number) {
  return from + (to - from) * value;
}

export function remap(
  fromIn: number,
  toIn: number,
  fromOut: number,
  toOut: number,
  value: number,
) {
  return fromOut + ((value - fromIn) * (toOut - fromOut)) / (toIn - fromIn);
}

export function clamp(min: number, max: number, value: number) {
  return value < min ? min : value > max ? max : value;
}

export function clampRemap(
  fromIn: number,
  toIn: number,
  fromOut: number,
  toOut: number,
  value: number,
) {
  const remappedValue = remap(fromIn, toIn, fromOut, toOut, value);
  if (fromOut > toOut) [fromOut, toOut] = [toOut, fromOut];

  return clamp(fromOut, toOut, remappedValue);
}
```
