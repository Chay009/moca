import { makeProject, type Project, Vector2 } from '@revideo/core';
import type { Scene } from '@/types/project';
import MainScene from '../projects/MainScene';
import { createProjectFromScenes } from '../projects/sceneFactory';
import { useProjectStore } from '@/store/projectStore';

/**
 * Project settings = For rendering/export (final video output)
 * Size, FPS, quality for exported video
 * Used by createProjectForExport() when exporting
 * 
 * Player/UI settings = For preview/editor (what you see while editing)
 * Canvas size in browser
 * Preview quality/FPS
 * Used by getProject() for the editor player
 * 
 * So you need both:
 * Add settings to getProject() for editor preview
 * Keep settings in createProjectForExport() for final render
 */

// Lazy project creation - only create when first accessed
// This ensures it's created on client side after custom elements are registered
let projectInstance: Project | null = null;
let lastScenesHash: string | null = null;

export function getProject(customScenes?: Scene[]): Project {
  const canvasSize = useProjectStore.getState().canvasSize;

  // If customScenes provided, use multi-scene architecture
  if (customScenes && customScenes.length > 0) {
    // Create hash of scenes to detect changes
    const scenesHash = JSON.stringify(customScenes.map(s => ({ id: s.id, elements: s.elements?.length })));

    // Recreate project if scenes changed
    if (!projectInstance || scenesHash !== lastScenesHash) {
      const sceneDescriptions = createProjectFromScenes(customScenes);
      lastScenesHash = scenesHash;

      projectInstance = makeProject({
        scenes: sceneDescriptions,
        variables: {},
        experimentalFeatures: true,
        settings: {
          shared: {
            size: new Vector2(canvasSize.width, canvasSize.height),
            background: '#000000',
          },
          preview: {
            fps: 30,
            resolutionScale: 1,
          },
        },
      });
    }
  } else {
    // Fallback to single MainScene for backward compatibility
    if (!projectInstance) {
      projectInstance = makeProject({
        scenes: [MainScene],
        variables: {},
        experimentalFeatures: true,
        settings: {
          shared: {
            size: new Vector2(canvasSize.width, canvasSize.height),
            background: '#000000',
          },
          preview: {
            fps: 30,
            resolutionScale: 1,
          },
        },
      });
    }
  }

  return projectInstance;
}

// Reset project instance to force recreation with new settings
export function resetProject(): void {
  projectInstance = null;
}

export function createProjectForExport(customScenes: Scene[]): Project {
  const sceneDescriptions = createProjectFromScenes(customScenes);
  const canvasSize = useProjectStore.getState().canvasSize;

  const exportProject = makeProject({
    scenes: sceneDescriptions,
    variables: { scenes: customScenes }, // Pass scenes for audio processing in exporter
    experimentalFeatures: true,
    settings: {
      shared: {
        size: new Vector2(canvasSize.width, canvasSize.height),
        // this is like default background for export when nothing is set, can be used to debug export issues if any
        background: '#000000',
      },
      // # this is just to understand how rendering settings can be set up in future if needed
      // though we are using custom renderer
      // rendering: {
      //   exporter: {
      //     name: '@revideo/core/wasm',
      //   },
      //   fps: 30,
      //   resolutionScale: 1,
      //   colorSpace: 'srgb',
      // },
      // preview: {
      //   fps: 30,
      //   resolutionScale: 1,
      // },
    },
  });
  return exportProject;
}

// NOTE: We intentionally DO NOT have a default export here.
// The old `export default getProject()` was problematic because it would
// create the project immediately at module import time, before the user
// could select an aspect ratio. Instead, components should call getProject()
// when they need the project instance.

