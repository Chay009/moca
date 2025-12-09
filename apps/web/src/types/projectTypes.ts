/**
 * Project Type Definitions
 * Core data structures for managing projects
 */
import type { Scene } from './sceneTypes';

export interface ProjectSettings {
  resolution?: { width: number; height: number };
  fps?: number;
  backgroundColor?: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  scenes: Scene[];
  settings?: ProjectSettings;
  description?: string;
}
