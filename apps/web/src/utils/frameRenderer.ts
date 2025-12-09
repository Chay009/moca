import { Player, Vector2 } from '@revideo/core';
import project from '@/revideo/project';
import { Scene } from '@/store/projectStore';

export interface RenderOptions {
  width?: number;
  height?: number;
  fps?: number;
}

/**
 * Optimized frame renderer using continuous playback
 * Bypasses Stage and uses direct scene.render() for maximum performance
 */
export class FrameRenderer {
  private player: Player;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private fps: number;
  private totalFrames: number;

  constructor(scenes: Scene[], options: RenderOptions = {}) {
    this.width = options.width || 1920;
    this.height = options.height || 1080;
    this.fps = options.fps || 30;

    const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
    this.totalFrames = Math.ceil(totalDuration * this.fps);

    // Create Revideo Player (without Stage for better performance)
    this.player = new Player(project, {
      size: new Vector2(this.width, this.height),
      fps: this.fps,
      resolutionScale: 1,
    });

    this.player.setVariables({ scenes });

    // Create optimized canvas directly (bypass Stage's double-buffering overhead)
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Optimize canvas context for frame extraction
    const context = this.canvas.getContext('2d', {
      willReadFrequently: true, // Optimize for frequent reads
      alpha: false,              // Disable alpha channel (faster, smaller)
      desynchronized: true       // Allow async rendering
    });

    if (!context) {
      throw new Error('Failed to create canvas context');
    }

    this.context = context;
  }

  /**
   * Get the current canvas
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Get the player instance
   */
  getPlayer(): Player {
    return this.player;
  }

  /**
   * Get the canvas rendering context
   */
  getContext(): CanvasRenderingContext2D {
    return this.context;
  }

  /**
   * Get render configuration
   */
  getConfig() {
    return {
      width: this.width,
      height: this.height,
      fps: this.fps,
      totalFrames: this.totalFrames,
    };
  }

  /**
   * Cleanup resources
   */
  dispose() {
    this.player.deactivate();
  }
}
