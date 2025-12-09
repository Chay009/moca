import { type Scene } from '@/store/projectStore';
import { Vector2 } from '@revideo/core';

import { CustomRenderer } from './_internal/CustomRenderer';
import { createProjectForExport } from '@/app/projects/project';

/**
 * Render scenes using Revideo's rendering pipeline with custom ClientSideExporter
 *
 * This function orchestrates the complete rendering process:
 * 1. Create Revideo project with scenes
 * 2. Initialize CustomRenderer (patches Revideo's renderer with custom exporter)
 * 3. Configure rendering settings (resolution, fps, exporter options)
 * 4. Execute render - Revideo handles frame-by-frame rendering
 * 5. ClientSideExporter captures frames and encodes to video in browser
 * 6. Video is automatically downloaded when complete
 */
export async function renderScenesWithRevideo(
  scenes: Scene[],
  options: {
    width?: number;
    height?: number;
    fps?: number;
    onProgress?: (progress: number) => void;
  } = {}
): Promise<void> {
  const width = options.width || 1920;
  const height = options.height || 1080;
  const fps = options.fps || 30;

  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
  const totalFrames = Math.ceil(totalDuration * fps);

  console.log('🎬 Starting video export with Revideo Renderer...');
  console.log(`📋 Rendering ${scenes.length} scenes (${totalFrames} frames @ ${fps}fps)`);

  try {
    // Step 1: Create Revideo project with custom exporter plugin
    console.log('📦 Creating Revideo project...');
    const project = createProjectForExport(scenes);
    console.log('✅ Project created with ClientSideExporterPlugin');

    // Step 2: Initialize Custom Renderer (extends Renderer)
    console.log('🎮 Initializing Custom Renderer...');
    const Customrenderer = new CustomRenderer(project);

    // Step 2.1: Configure rendering settings
    const settings: any = {
      name: 'revideo-export',
      range: [0, totalDuration], // Range is in SECONDS not frames!
      fps,
      size: new Vector2(width, height),
      resolutionScale: 1,
      exporter: {
        name: 'revideo-motion-editor/client-side', // Our custom exporter ID
        options: {},
      },
    };

    console.log('⚙️  Rendering settings configured:');
    console.log(`   - Resolution: ${width}x${height}`);
    console.log(`   - FPS: ${fps}`);
    console.log(`   - Exporter: ${settings.exporter.name}`);

    // Start rendering
    console.log('▶️  Starting render...');

    // Step 2.2: Run the rendering
    await Customrenderer.render(settings);
    console.log('✅ Rendering completed!');
    console.log('📥 Video has been encoded and merged with audio by ClientSideExporter');

    /**
     * CustomRenderer.render() returns a Promise<RendererResult>
     *
     * What CustomRenderer outputs during rendering:
     * 1. Console logs:
     *    - "🔧 CustomRenderer patched run() - using custom exporter list"
     *    - "✅ Found exporter: revideo-motion-editor/client-side"
     *
     * 2. Frame-by-frame rendering:
     *    - Renders each frame sequentially
     *    - Progress updates via estimator.reportProgress()
     *
     * 3. Audio generation (if exporter supports it):
     *    - generateAudio() processes all frames in parallel with rendering
     *    - Outputs audio data
     *
     * 4. Video download/encoding (if exporter supports it):
     *    - downloadVideos() fetches and processes video media
     *    - Encodes frames to video format
     *
     * 5. Media merging:
     *    - mergeMedia() combines audio and video into final output
     *    - Creates downloadable video file
     *
     * 6. Return value (RendererResult):
     *    - 0 = Success: All frames rendered, video exported successfully
     *    - 1 = Aborted: Rendering stopped by abort signal
     *    - 2+ = Error: Exporter not found, rendering failed, or media merge failed
     *
     * ClientSideExporter handles the actual frame capture and video encoding
     */


    return;
  } catch (error) {
    console.error('❌ Export failed with exception:', error);
    console.error('Stack trace:', (error as Error).stack);
    console.error('Full error object:', error);
    throw error;
  }
}
