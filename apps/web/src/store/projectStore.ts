/**
 * Project Store - Multi-project management with Zustand
 * Manages project CRUD operations and multi-project state
 * No persistence for now - simplifies Next.js hydration
 */
import { create } from 'zustand';
import type { Project as RevideoProject } from '@revideo/core';
import type { Scene, Project } from '@/types/project';

interface ProjectStore {
  // Multi-project state
  projects: Project[];
  currentProjectId: string | null;

  // Revideo project instance (auto-created from current project's scenes)
  revideoProject: RevideoProject | null;

  // Canvas settings (aspect ratio)
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3';
  canvasSize: { width: number; height: number };

  // Player settings
  playerSettings: {
    fps: number;
    resolutionScale: number;
    range: [number, number];
  };

  // Computed getters
  getCurrentProject: () => Project | null;

  // Project CRUD
  createProject: (name: string) => string;
  deleteProject: (id: string) => void;
  renameProject: (id: string, name: string) => void;
  duplicateProject: (id: string) => void;
  setCurrentProject: (id: string) => void;

  // Canvas settings
  setAspectRatio: (ratio: '16:9' | '9:16' | '1:1' | '4:3') => void;
  setPlayerSettings: (settings: Partial<ProjectStore['playerSettings']>) => void;

  // Helper method for editorStore to update scenes
  updateProjectScenes: (projectId: string, scenes: Scene[]) => void;

  // Revideo project management
  recreateRevideoProject: () => void;
}

// Counter for deterministic IDs
let projectIdCounter = 0;

// Default project factory
const createDefaultProject = (name: string): Project => {
  projectIdCounter++;
  const newScene = createDefaultScene();
  return {
    id: `project-${projectIdCounter}`,
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
    scenes: [newScene],
    settings: {
      resolution: { width: 1920, height: 1080 },
      fps: 30,
      backgroundColor: '#000000',
    },
  };
};

// Default scene factory (exported for editorStore)
export let sceneIdCounter = 0;
let elementIdCounter = 0;

export const createDefaultScene = (): Scene => {
  sceneIdCounter++;
  elementIdCounter++;
  return {
    id: `scene-${sceneIdCounter}`,
    name: 'Scene 1',
    duration: 3,
    transition: 'fade',
    elements: [
      {
        id: `el-${elementIdCounter}`,
        type: 'text',
        properties: {
          x: 0,
          y: -100,
          text: "Let's GO",
          fontSize: 60,
          fill: '#e11d48',
        },
      },
    ],
  };
};

export const generateSceneId = (): string => {
  sceneIdCounter++;
  return `scene-${sceneIdCounter}`;
};

export const generateElementId = (): string => {
  elementIdCounter++;
  return `el-${elementIdCounter}`;
};

// Aspect ratio presets
const ASPECT_RATIOS = {
  '16:9': { width: 1920, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
  '1:1': { width: 1080, height: 1080 },
  '4:3': { width: 1440, height: 1080 },
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  // Initial state
  projects: [],
  currentProjectId: null,
  revideoProject: null, // Will be created when first project is added
  aspectRatio: '16:9',
  canvasSize: ASPECT_RATIOS['16:9'],
  playerSettings: {
    fps: 60,
    resolutionScale: 1,
    range: [0, Infinity],
  },

  // Getters
  getCurrentProject: () => {
    const { projects, currentProjectId } = get();
    return projects.find((p) => p.id === currentProjectId) || null;
  },

  // Project operations
  createProject: (name) => {
    const newProject = createDefaultProject(name);
    set((state) => ({
      projects: [...state.projects, newProject],
      currentProjectId: newProject.id,
    }));
    return newProject.id;
  },

  deleteProject: (id) =>
    set((state) => {
      const filteredProjects = state.projects.filter((p) => p.id !== id);
      const newCurrentProjectId = state.currentProjectId === id ? filteredProjects[0]?.id || null : state.currentProjectId;
      return {
        projects: filteredProjects,
        currentProjectId: newCurrentProjectId,
      };
    }),

  renameProject: (id, name) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, name, updatedAt: new Date() } : p
      ),
    })),

  duplicateProject: (id) => {
    const project = get().projects.find((p) => p.id === id);
    if (!project) return;

    projectIdCounter++;
    const duplicated: Project = {
      ...JSON.parse(JSON.stringify(project)),
      id: `project-${projectIdCounter}`,
      name: `${project.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      projects: [...state.projects, duplicated],
      currentProjectId: duplicated.id,
    }));
  },

  setCurrentProject: (id) =>
    set({
      currentProjectId: id,
    }),

  // Aspect ratio setting
  setAspectRatio: (ratio) => {
    set({
      aspectRatio: ratio,
      canvasSize: ASPECT_RATIOS[ratio],
    });
    // Canvas size updates are handled by Player component width/height props
  },

  // Player settings
  setPlayerSettings: (settings) => {
    set((state) => ({
      playerSettings: {
        ...state.playerSettings,
        ...settings,
      },
    }));
  },

  // Helper method for editorStore to update scenes in the current project
  updateProjectScenes: (projectId, scenes) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, scenes, updatedAt: new Date() } : p
      ),
    }));
    // Auto-recreate Revideo project when scenes change
    get().recreateRevideoProject();
  },

  // Recreate Revideo project from current project's scenes
  recreateRevideoProject: () => {
    const currentProject = get().getCurrentProject();
    if (!currentProject || !currentProject.scenes || currentProject.scenes.length === 0) {
      set({ revideoProject: null });
      return;
    }

    // Create hash of scene STRUCTURE only (not properties) - recreation is expensive!
    // Properties should be handled by setVariables + reload, not full recreation
    const sceneStructureHash = JSON.stringify(
      currentProject.scenes.map(s => ({
        id: s.id,
        elementIds: s.elements?.map(e => e.id),
        elementTypes: s.elements?.map(e => e.type),
        transition: s.transition,
        background: s.background,
      }))
    );

    // Check if structure actually changed
    const lastHash = (get() as any)._lastSceneStructureHash;
    if (lastHash === sceneStructureHash) {
      console.log('⏭️ Scene structure unchanged, skipping project recreation');
      return;
    }

    // Import here to avoid circular dependency
    const { makeProject, Vector2 } = require('@revideo/core');
    const { createProjectFromScenes } = require('@/app/projects/sceneFactory');

    const canvasSize = get().canvasSize;
    const sceneDescriptions = createProjectFromScenes(currentProject.scenes);

    const newRevideoProject = makeProject({
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

    set({ revideoProject: newRevideoProject, _lastSceneStructureHash: sceneStructureHash } as any);
    console.log('🎬 Revideo project recreated in store');
  },
}));

// Re-export types for backward compatibility
export type { Scene, Project } from '@/types/project';
