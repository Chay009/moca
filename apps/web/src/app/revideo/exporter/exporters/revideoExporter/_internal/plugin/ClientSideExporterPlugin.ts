import {
  type Exporter,
  type ExporterClass,
  type Project,
  type RendererSettings,
  RendererResult,
} from '@revideo/core';
import { VideoEncoder } from '@/utils/videoEncoder';
import type { Scene } from '@/store/projectStore';

/**
 * This fucn is sync with internal rendererRun.ts function intenral run function of revideo
 * Client-side video exporter for Revideo
 * Bypasses server requirements and encodes video directly in the browser
 *
 * Implements full Exporter interface with all pipeline stages:
 * - start() - Initialize encoder and tracking
 * - handleFrame() - Encode each rendered frame
 * - generateAudio() - Process audio from scene data
 * - downloadVideos() - Prepare video media
 * - mergeMedia() - Finalize and merge audio + video
 * - stop() - Finalize encoding
 * - kill() - Cleanup on abort
 *
 * This exporter:
 * - Captures frames directly from canvas
 * - Encodes using mediabunny (WebCodecs)
 * - Processes audio from scene data
 * - Downloads final video as MP4
 */
export class ClientSideExporter implements Exporter {
  private encoder: VideoEncoder | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private totalFrames: number = 0;
  private currentFrame: number = 0;
  private fps: number = 30;
  private scenes: Scene[] = [];

  // Performance tracking
  private renderStartTime: number = 0;
  private totalRenderTime: number = 0;
  private totalEncodeTime: number = 0;
  private frameCount: number = 0;

  // Export state tracking
  private exportSuccess: boolean = false;

  constructor(
    private project: Project,
    private settings: RendererSettings
  ) {
    this.fps = settings.fps || 30;
    // Calculate total frames from settings range
    const from = settings.range[0] * this.fps;
    const to = settings.range[1] * this.fps;
    this.totalFrames = Math.ceil(to - from);
  }

  /**
   * Initialize the exporter before rendering starts
   * Note: Revideo's Exporter interface doesn't pass parameters to start()
   * We get duration from the renderer settings instead
   */
  async start(): Promise<void> {
    console.log('🎬 Starting client-side export...');

    this.renderStartTime = performance.now();
    this.currentFrame = 0;
    this.frameCount = 0;
    this.totalRenderTime = 0;
    this.totalEncodeTime = 0;

    // Get scenes from project variables
    if (this.project.variables && this.project.variables['scenes']) {
      const scenesVar = this.project.variables['scenes'];
      this.scenes = typeof scenesVar === 'function' ? scenesVar() : scenesVar;
    }

    console.log(`📋 Found ${this.scenes.length} scenes to export`);
  }

  /**
   * Get encoder reference for backpressure checks
   */
  getEncoder(): VideoEncoder | null {
    return this.encoder;
  }

  /**
   * Handle each rendered frame
   */
  async handleFrame(
    canvas: HTMLCanvasElement,
    frame: number,
    sceneFrame: number,
    sceneName: string,
    signal: AbortSignal,
  ): Promise<void> {
    // Initialize encoder on first frame
    if (!this.encoder) {
      this.canvas = canvas;
      this.encoder = new VideoEncoder(canvas, this.totalFrames, {
        fps: this.fps,
        codec: 'avc',
        onProgress: (encoded, total) => {
          // Progress callback if needed
        },
      });
      await this.encoder.start();
      console.log('🎥 Video encoder initialized');
    }

    // Check for abort
    if (signal.aborted) {
      return;
    }

    // Encode the frame
    const encodeStart = performance.now();
    await this.encoder.encodeFrame(frame);
    const encodeEnd = performance.now();

    this.totalEncodeTime += encodeEnd - encodeStart;
    this.currentFrame = frame;
    this.frameCount++;

    // Log progress every 30 frames
    if (frame % 30 === 0 && frame > 0) {
      const avgEncode = (this.totalEncodeTime / this.frameCount).toFixed(2);
      const progress = ((frame / this.totalFrames) * 100).toFixed(1);
      console.log(`📊 Frame ${frame}/${this.totalFrames} (${progress}%) - Encode: ${avgEncode}ms/frame`);
    }
  }

  /**
   * Generate audio from scene data
   * Called by rendererRun during rendering
   * Waits for encoder to be initialized if not ready yet
   */
  async generateAudio(mediaByFrames: any, from: number, to: number): Promise<void> {
    console.log('🔊 Preparing audio generation...');

    // Wait for encoder to be initialized (happens when first frame is rendered)
    let maxWaitTime = 30000; // 30 seconds timeout
    const startTime = performance.now();

    while (!this.encoder && (performance.now() - startTime) < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!this.encoder) {
      console.error('❌ Encoder was not initialized within timeout period');
      throw new Error('Encoder initialization timeout');
    }

    console.log('🔊 Generating audio from scene data...');
    const totalDuration = this.totalFrames / this.fps;

    try {
      await this.encoder.processAudio(this.scenes, totalDuration);
      console.log('✅ Audio generated successfully');
    } catch (error) {
      console.error('❌ Audio generation failed:', error);
      throw error;
    }
  }

  /**
   * Download and process video media
   * Called by rendererRun during rendering
   */
  async downloadVideos(mediaByFrames: any): Promise<void> {
    console.log('📥 Downloading video media...');
    // VideoEncoder already handles video encoding through encodeFrame()
    // This is a placeholder for any additional video processing
    console.log('✅ Video media ready for encoding');
  }

  /**
   * Merge audio and video into final output
   * Called by rendererRun after all frames are encoded
   */
  async mergeMedia(): Promise<void> {
    if (!this.encoder) {
      console.error('❌ Encoder not initialized');
      return;
    }

    console.log('🎬 Merging audio and video...');

    try {
      // Finalize encoding (combines video + audio)
      const blob = await this.encoder.finalize();

      // Calculate final statistics
      const renderEndTime = performance.now();
      const totalTime = ((renderEndTime - this.renderStartTime) / 1000).toFixed(2);
      const avgEncode = (this.totalEncodeTime / this.frameCount).toFixed(2);

      console.log('\n🎉 Export Complete!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`⏱️  Total Time: ${totalTime}s`);
      console.log(`🎞️  Total Frames: ${this.frameCount}`);
      console.log(`📈 Average Encode: ${avgEncode}ms/frame`);
      console.log(`📊 Time Distribution:`);
      console.log(`   - Encode: ${((this.totalEncodeTime / (renderEndTime - this.renderStartTime)) * 100).toFixed(1)}%`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // Download the video
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.settings.name || 'video'}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('✅ Video downloaded successfully!');
      this.exportSuccess = true; // Mark export as successful
    } catch (error) {
      console.error('❌ Media merge failed:', error);
      this.exportSuccess = false;
      throw error;
    }
  }

  /**
   * Finalize the export
   * Called by rendererRun at the end
   * Note: mergeMedia() handles the actual finalization and download
   */
  async stop(result: RendererResult): Promise<void> {
    console.log(`📌 Export stopped with result: ${result}`);

    if (result !== 0) { // 0 = RendererResult.Success
      console.warn('⚠️ Export did not complete successfully');
    }
  }

  /**
   * Clean up resources if rendering is aborted
   * Note: kill() is always called by rendererRun, even on success
   * We only log cleanup warning if export actually failed
   */
  async kill?(): Promise<void> {
    if (!this.exportSuccess) {
      console.log('⚠️ Export aborted - cleaning up...');
    } else {
      console.log('✅ Export cleanup complete');
    }
    this.encoder = null;
    this.canvas = null;
  }
}

/**
 * ExporterClass implementation for plugin registration
 */
export const ClientSideExporterClass: ExporterClass = {
  id: 'revideo-motion-editor/client-side',
  displayName: 'Client-Side Video Export',

  async create(project: Project, settings: RendererSettings): Promise<Exporter> {
    return new ClientSideExporter(project, settings);
  },
};
