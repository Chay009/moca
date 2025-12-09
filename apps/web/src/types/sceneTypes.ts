/**
 * Scene Type Definitions
 * Core data structures for managing scenes
 */
import type { SceneElement } from './elements';
import type { ZoomEvent } from './zoom';

export type SceneTransition = 'fade' | 'slide' | 'none';

export interface SceneBackground {
  type: 'solid' | 'gradient' | 'image' | 'video' | 'shader';
  value: string; // CSS string (solid/gradient), URL (image/video), or shader config JSON
  cssString?: string; // Legacy support - will be migrated to type+value
  filters?: Array<Record<string, number>>; // CSS filters for background (blur, brightness, etc.)
}

export interface AudioTrack {
  id: string;
  name: string;
  src: string;
  duration: number;
  format?: string;           // 'mp3', 'wav', etc.
  bitrate?: string;          // '320kbps'
  category?: 'music' | 'effect' | 'sound';
  waveform?: number[];       // For waveform visualization
  startTime: number;         // When to start in scene
  volume: number;            // 0-1
  loop?: boolean;
  fadeIn?: number;
  fadeOut?: number;
}

export interface LegacyAudio {
  src: string;
  volume?: number;
  startTime?: number;
}

export interface Scene {
  id: string;
  name: string;
  duration: number;
  elements: SceneElement[];
  transition?: SceneTransition;

  // Scene background - supports solid colors, gradients, images, videos, and shaders
  background?: SceneBackground;

  // Audio track (legacy support)
  audio?: LegacyAudio;

  // Multiple audio tracks (SlideShots-style sound library)
  audioTracks?: AudioTrack[];

  // Camera zoom keyframes for screen recording effects
  zoomEvents?: ZoomEvent[];
}

