/** @jsxImportSource @revideo/2d/lib */
/**
 * Background Composition - Unified background rendering for MainScene and sceneFactory
 * Handles: solid, gradient, image, shader backgrounds with filter support
 * * NOTE: Shaders must be created directly in scene generators (MainScene.tsx, sceneFactory.ts)
 */
import { Img, Rect, Layout } from '@revideo/2d';
import {
  blur,
  brightness,
  contrast,
  grayscale,
  hue,
  invert,
  saturate,
  sepia,
} from "@revideo/2d";
import { parseBackgroundString } from './css';
import { getShaderByID, createThreeShaderBackground } from './shaders';
import { Three } from '@/app/revideo/three/ThreeComponent';

export interface BackgroundConfig {
  type: 'solid' | 'gradient' | 'image' | 'shader';
  value: string;
  filters?: Array<Record<string, number>>;  // CSS filters for background
}

export interface LegacyBackgroundConfig {
  cssString?: string;
}

/**
 * Convert filter data to Revideo Filter objects
 */
function convertFilters(filtersArray: Array<Record<string, number>> = []) {
  return filtersArray.map((filterData) => {
    const [filterName, value] = Object.entries(filterData)[0] as [string, number];

    switch (filterName) {
      case 'blur':
        return blur(value);
      case 'brightness':
        return brightness(value);
      case 'contrast':
        return contrast(value);
      case 'grayscale':
        return grayscale(value);
      case 'hue':
        return hue(value);
      case 'invert':
        return invert(value);
      case 'saturate':
        return saturate(value);
      case 'sepia':
        return sepia(value);
      default:
        return null;
    }
  }).filter((f): f is NonNullable<typeof f> => f !== null);
}

/**
 * Unified background renderer for both MainScene and sceneFactory
 * Handles all background types including shaders with Three.js
 * Uses JSX syntax - works in both generator contexts
 */
export function addBackgroundToView(
  view: any,
  background: (BackgroundConfig & LegacyBackgroundConfig) | undefined
): void {
  if (!background) return;

  // New format: type + value
  if (background.type && background.value) {
    // Shader - use Three.js with post-processing
    if (background.type === 'shader') {
      const shaderGLSL = getShaderByID(background.value);
      if (!shaderGLSL) return;

      const shaderData = createThreeShaderBackground(shaderGLSL);

      view.add(
        <Three
          width={1920}
          height={1080}
          scene={shaderData.scene}
          camera={shaderData.camera}
          sceneData={shaderData}
        />
      );
      console.log(`✅ Shader background set (Three.js): ${background.value}`);
      return;
    }

    // Solid, gradient, image - use helper with filters
    const bgNode = createBackgroundNode({
      type: background.type,
      value: background.value,
      filters: background.filters,
    });
    if (bgNode) {
      view.add(bgNode);
      console.log(`✅ Background set: ${background.type} - ${background.value}${background.filters?.length ? ` with ${background.filters.length} filters` : ''}`);
    }
    return;
  }

  // Legacy format: cssString (backward compatibility)
  if (background.cssString) {
    const fill = parseBackgroundString(background.cssString);
    if (fill) {
      view.fill(fill);
      console.log('✅ Background set (legacy):', background.cssString);
    }
  }
}

/**
 * Create a background node as JSX (for non-shader backgrounds)
 * Returns JSX node that can be added to view
 */
export function createBackgroundNode(
  backgroundConfig: BackgroundConfig
): any {
  const { type, value, filters: rawFilters } = backgroundConfig;

  if (!value?.trim()) return null;

  // Convert filters
  const filters = convertFilters(rawFilters);

  // Solid or gradient
  if (type === 'solid' || type === 'gradient') {
    const fill = parseBackgroundString(value);
    if (!fill) return null;

    return (
      <Layout size={['100%', '100%']}>
        <Rect
          size={['100%', '100%']}
          fill={fill}
          filters={filters.length > 0 ? filters : undefined}
        />
      </Layout>
    ) as any;
  }

  // Image
  if (type === 'image') {
    return (
      <Layout size={['100%', '100%']}>
        <Img
          src={value}
          size={['100%', '100%']}
          filters={filters.length > 0 ? filters : undefined}
        />
      </Layout>
    ) as any;
  }

  return null;
}
