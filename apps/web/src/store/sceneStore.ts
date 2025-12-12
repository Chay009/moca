/**
 * Scene Store - Scene, Element, and Playback management with Zustand
 * Manages scene state (playback, scene index, selected elements) for the current project
 * No persistence for now - simplifies Next.js hydration
 */
import { create } from 'zustand';

import type { SceneElement } from '@/types/elements';
import type { Scene } from '@/types/project';
import type { ZoomEvent } from '@/types/zoom';
import { DEFAULT_ZOOM_EVENT } from '@/types/zoom';
import { useProjectStore, generateSceneId, generateElementId, createDefaultScene } from './projectStore';

// Zoom target overlay for crosshair on player
interface ZoomTargetOverlay {
  visible: boolean;
  x: number;
  y: number;
}

interface SceneStore {
  // Scene state (current project only)
  currentSceneIndex: number;
  currentTime: number;
  isPlaying: boolean;
  selectedElementId: string | null;
  selectedRevideoNode: any | null; // Reference to actual Revideo node for direct updates
  playMode: 'scene' | 'all'; // Play current scene or all scenes with transitions

  // Zoom target overlay (for crosshair on player)
  zoomTargetOverlay: ZoomTargetOverlay;

  // Computed getters
  getCurrentScenes: () => Scene[];
  getCurrentScene: () => Scene | null;

  // Scene operations (within current project)
  addScene: () => void;
  removeScene: (id: string) => void;
  updateScene: (id: string, updates: Partial<Scene>) => void;
  updateSceneDuration: (sceneId: string, durationInSeconds: number) => void;
  setCurrentScene: (index: number) => void;

  // Element operations (within current scene of current project)
  addElementToScene: (sceneId: string, element: Omit<SceneElement, 'id'>) => void;
  removeElementFromScene: (sceneId: string, elementId: string) => void;
  updateElementInScene: (sceneId: string, elementId: string, updates: Partial<SceneElement>) => void;

  // Playback
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlayMode: (mode: 'scene' | 'all') => void;
  setSelectedElementId: (id: string | null) => void;
  setSelectedRevideoNode: (node: any | null) => void; // Set Revideo node reference

  // Zoom target overlay
  setZoomTargetOverlay: (overlay: Partial<ZoomTargetOverlay>) => void;
  showZoomTarget: (x: number, y: number) => void;
  hideZoomTarget: () => void;

  // Zoom event operations (within current scene)
  addZoomEvent: (sceneId: string, startTime: number) => void;
  updateZoomEvent: (sceneId: string, zoomId: string, updates: Partial<ZoomEvent>) => void;
  removeZoomEvent: (sceneId: string, zoomId: string) => void;



  // Force player refresh/render
  refreshTrigger: number;
  refreshPlayer: () => void;

  // Computed
  getTotalDuration: () => number;
  reset: () => void;
}

export const useSceneStore = create<SceneStore>((set, get) => ({
  // Initial state
  currentSceneIndex: 0,
  currentTime: 0,
  playMode: 'scene',
  isPlaying: true, // this is must tand this is respsonsible for player to be played the actual animations
  selectedElementId: null,
  selectedRevideoNode: null, // Reference to actual Revideo node

  // Zoom target overlay (for crosshair on player)
  zoomTargetOverlay: { visible: false, x: 0, y: 0 },

  refreshTrigger: 0,



  // Getters
  getCurrentScenes: () => {
    const currentProject = useProjectStore.getState().getCurrentProject();
    return currentProject?.scenes || [];
  },

  getCurrentScene: () => {
    const scenes = get().getCurrentScenes();
    const { currentSceneIndex } = get();
    return scenes[currentSceneIndex] || null;
  },

  // Scene operations
  addScene: () => {
    const currentProject = useProjectStore.getState().getCurrentProject();
    if (!currentProject) return;

    const newScene = createDefaultScene();
    const updatedScenes = [...currentProject.scenes, newScene];
    useProjectStore.getState().updateProjectScenes(currentProject.id, updatedScenes);
  },

  removeScene: (id) => {
    const currentProject = useProjectStore.getState().getCurrentProject();
    if (!currentProject) return;

    const updatedScenes = currentProject.scenes.filter((s) => s.id !== id);
    useProjectStore.getState().updateProjectScenes(currentProject.id, updatedScenes);

    set((state) => ({
      currentSceneIndex: Math.max(0, state.currentSceneIndex - 1),
    }));
  },

  updateScene: (id, updates) => {
    const currentProject = useProjectStore.getState().getCurrentProject();
    if (!currentProject) return;

    const updatedScenes = currentProject.scenes.map((s) =>
      s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s
    );
    useProjectStore.getState().updateProjectScenes(currentProject.id, updatedScenes);
  },

  // Update scene duration from Revideo's auto-calculated value
  updateSceneDuration: (sceneId, durationInSeconds) => {
    const currentProject = useProjectStore.getState().getCurrentProject();
    if (!currentProject) return;

    // Only update if duration is valid and different
    const scene = currentProject.scenes.find(s => s.id === sceneId);
    if (!scene || Math.abs(scene.duration - durationInSeconds) < 0.1) return;

    console.log(`⏱️ Auto-updating scene ${sceneId} duration: ${scene.duration}s → ${durationInSeconds.toFixed(2)}s`);

    const updatedScenes = currentProject.scenes.map((s) =>
      s.id === sceneId ? { ...s, duration: durationInSeconds } : s
    );
    useProjectStore.getState().updateProjectScenes(currentProject.id, updatedScenes);
  },

  setCurrentScene: (index) => set({ currentSceneIndex: index }),

  // Element operations
  addElementToScene: (sceneId, element) => {
    const currentProject = useProjectStore.getState().getCurrentProject();
    if (!currentProject) return;

    const updatedScenes = currentProject.scenes.map((s) =>
      s.id === sceneId
        ? {
          ...s,
          elements: [
            ...s.elements,
            { ...element, id: generateElementId() },
          ],
        }
        : s
    );
    useProjectStore.getState().updateProjectScenes(currentProject.id, updatedScenes);
  },

  removeElementFromScene: (sceneId, elementId) => {
    const currentProject = useProjectStore.getState().getCurrentProject();
    if (!currentProject) return;

    const updatedScenes = currentProject.scenes.map((s) =>
      s.id === sceneId
        ? {
          ...s,
          elements: s.elements.filter((el) => el.id !== elementId),
        }
        : s
    );
    useProjectStore.getState().updateProjectScenes(currentProject.id, updatedScenes);
  },

  updateElementInScene: (sceneId, elementId, updates) => {
    const currentProject = useProjectStore.getState().getCurrentProject();
    if (!currentProject) return;

    const updatedScenes = currentProject.scenes.map((s) =>
      s.id === sceneId
        ? {
          ...s,
          elements: s.elements.map((el) =>
            el.id === elementId
              ? {
                ...el,
                ...updates,
                properties: updates.properties
                  ? { ...el.properties, ...updates.properties }
                  : el.properties,
              }
              : el
          ),
        }
        : s
    );
    useProjectStore.getState().updateProjectScenes(currentProject.id, updatedScenes);
  },

  // Removed addMediaElementWithMetadata - now using Revideo's automatic duration calculation
  // Duration is updated via onDurationChanged event subscription in CanvasPlayer

  // Playback
  setPlayMode: (mode) => set({ playMode: mode }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setSelectedElementId: (id) => set({ selectedElementId: id }),
  setSelectedRevideoNode: (node) => set({ selectedRevideoNode: node }),

  // Zoom target overlay actions
  setZoomTargetOverlay: (overlay) => set((state) => ({
    zoomTargetOverlay: { ...state.zoomTargetOverlay, ...overlay }
  })),
  showZoomTarget: (x, y) => set({ zoomTargetOverlay: { visible: true, x, y } }),
  hideZoomTarget: () => set((state) => ({
    zoomTargetOverlay: { ...state.zoomTargetOverlay, visible: false }
  })),

  // Force player refresh
  refreshPlayer: () => set(state => ({ refreshTrigger: state.refreshTrigger + 1 })),



  // Zoom event operations
  addZoomEvent: (sceneId, startTime) => {
    const project = useProjectStore.getState().getCurrentProject();
    if (!project) return;

    const zoomEvent: ZoomEvent = {
      ...DEFAULT_ZOOM_EVENT,
      id: `zoom-${Date.now()}`,
      startTime,
    };

    const updatedScenes = project.scenes.map((scene) =>
      scene.id === sceneId
        ? { ...scene, zoomEvents: [...(scene.zoomEvents || []), zoomEvent] }
        : scene
    );

    useProjectStore.getState().updateProjectScenes(project.id, updatedScenes);
  },

  updateZoomEvent: (sceneId, zoomId, updates) => {
    const project = useProjectStore.getState().getCurrentProject();
    if (!project) return;

    const updatedScenes = project.scenes.map((scene) =>
      scene.id === sceneId
        ? {
          ...scene,
          zoomEvents: (scene.zoomEvents || []).map((zoom) =>
            zoom.id === zoomId ? { ...zoom, ...updates } : zoom
          ),
        }
        : scene
    );

    useProjectStore.getState().updateProjectScenes(project.id, updatedScenes);
  },

  removeZoomEvent: (sceneId, zoomId) => {
    const project = useProjectStore.getState().getCurrentProject();
    if (!project) return;

    const updatedScenes = project.scenes.map((scene) =>
      scene.id === sceneId
        ? {
          ...scene,
          zoomEvents: (scene.zoomEvents || []).filter((zoom) => zoom.id !== zoomId),
        }
        : scene
    );

    useProjectStore.getState().updateProjectScenes(project.id, updatedScenes);
  },

  // Computed
  getTotalDuration: () => {
    const scenes = get().getCurrentScenes();
    return scenes.reduce((total, scene) => total + scene.duration, 0);
  },

  reset: () =>
    set({
      currentTime: 0,
      isPlaying: true,
      currentSceneIndex: 0,
      selectedElementId: null,
    }),
}));

// Re-export types for backward compatibility
// these need to be cleaned up coz now we are chaging the code and refctogin to be clean
export type {
  ElementType,
  TransformProperties,
  TextProperties,
  StyleProperties,
  EffectProperties,
  MediaProperties,
  LayoutProperties,
  CompositeComponentProperties,
  AnimationProperties,
  AudioProperties,
  TextEffectProperties,
  TextEffectPresetProperties,
  ThreeJSProperties,
  ShaderProperties,
  MiscProperties,
  ElementProperties,
  SceneElement,
} from '@/types/elements';

export type { Scene } from '@/types/project';
