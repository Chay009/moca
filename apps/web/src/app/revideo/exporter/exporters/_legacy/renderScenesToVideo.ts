import { Scene } from '@/store/projectStore';
import { Player, Vector2 } from '@revideo/core';
import { VideoEncoder } from '../../../utils/videoEncoder';
import { createProjectForExport } from '@/revideo/project';

/**
 * Optimized video rendering using dynamic Revideo project
 * Creates separate scene descriptions for each custom scene
 *
 * Architecture:
 * - createProject(): Converts custom scenes → Revideo SceneDescription[]
 * - Player: Manages playback with onRender subscription
 * - VideoEncoder: Captures frames via mediabunny
 *
 * Each custom scene becomes its own Revideo scene (proper architecture)
 */
export async function renderScenesToVideo(
  scenes: Scene[],
  options: {
    width?: number;
    height?: number;
    fps?: number;
    onProgress?: (progress: number) => void;
  } = {}
): Promise<Blob> {
  const width = options.width || 1920;
  const height = options.height || 1080;
  const fps = options.fps || 30;

  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
  const totalFrames = Math.ceil(totalDuration * fps);

  console.log('🎬 Starting video export with dynamic scenes...');
  console.log(`📋 Rendering ${scenes.length} scenes (${totalFrames} frames @ ${fps}fps)`);
  const pipelineStart = performance.now();

  // Performance tracking
  let totalRenderTime = 0;
  let totalEncodeTime = 0;
  let frameCount = 0;

  try {
    // Step 1: Create Revideo project from custom scenes
    // Each custom scene becomes a separate SceneDescription
    console.log(`📦 Creating Revideo project with ${scenes.length} scenes...`);
    console.log('📋 Scenes data:', JSON.stringify(scenes.map(s => ({ id: s.id, name: s.name, duration: s.duration, elements: s.elements.length }))));

    const project = createProjectForExport(scenes);

    if (!project) {
      throw new Error('Failed to create Revideo project');
    }

    console.log('✅ Project created successfully');

    // Step 2: Initialize Player with dynamic project
    console.log('🎮 Initializing Player...');
    const player = new Player(project, {
      size: new Vector2(width, height),
      fps,
      resolutionScale: 1,
    });

    console.log('✅ Player initialized');

    // Step 3: Create canvas for frame capture
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', {
      willReadFrequently: true,
      alpha: false,
      desynchronized: true,
    });

    if (!context) {
      throw new Error('Failed to get canvas context');
    }

    console.log(`📐 Canvas created: ${width}x${height}`);

    // Step 4: Initialize encoder
    const encoder = new VideoEncoder(canvas, totalFrames, {
      fps,
      onProgress: (encoded, total) => {
        if (options.onProgress) {
          options.onProgress(encoded / total);
        }
      },
    });

    await encoder.start();

    // Step 5: Render frames via continuous playback and capture to canvas
    await new Promise<void>((resolve, reject) => {
      let currentFrame = 0;
      const pendingEncodes: Promise<void>[] = [];
      const MAX_PENDING = 5; // Allow more frames to encode in parallel (like Motion Canvas)

      player.activate();

      const unsubscribeRender = player.onRender.subscribe(async () => {
        try {
          // Get the actual rendered content from Player
          const playback = (player as any).playback;
          const currentScene = playback?.currentScene;

          if (currentScene) {
            // Track render time
            const renderStart = performance.now();
            context.clearRect(0, 0, width, height);

            // Render the current scene to our canvas
            await currentScene.render(context);

            const renderEnd = performance.now();
            totalRenderTime += renderEnd - renderStart;

            // Encode frame
            const encodeStart = performance.now();
            const encodePromise = encoder.encodeFrame(currentFrame).then(() => {
              const encodeEnd = performance.now();
              totalEncodeTime += encodeEnd - encodeStart;
            });
            pendingEncodes.push(encodePromise);

            // Respect backpressure
            if (pendingEncodes.length >= MAX_PENDING) {
              await pendingEncodes.shift();
            }

            frameCount++;
            currentFrame++;

            // Log progress every 30 frames
            if (currentFrame % 30 === 0 && currentFrame > 0) {
              const avgRender = (totalRenderTime / frameCount).toFixed(2);
              const avgEncode = (totalEncodeTime / frameCount).toFixed(2);
              console.log(`📊 Frame ${currentFrame}/${totalFrames} - Render: ${avgRender}ms | Encode: ${avgEncode}ms`);
            }

            // Check if we're done
            if (currentFrame >= totalFrames) {
              await Promise.all(pendingEncodes);
              unsubscribeRender();
              unsubscribeFrame();
              player.togglePlayback(false);
              resolve();
            }
          }
        } catch (error) {
          unsubscribeRender();
          unsubscribeFrame();
          reject(error);
        }
      });

      const unsubscribeFrame = player.onFrameChanged.subscribe(() => {
        if (currentFrame < totalFrames) {
          player.requestRender();
        }
      });

      // Start continuous playback
      console.log('▶️  Starting playback...');
      player.requestSeek(0);
      player.togglePlayback(true);
    });

    // Step 6: Process audio
    try {
      await encoder.processAudio(scenes, totalDuration);
    } catch (error) {
      console.warn('⚠️  Audio processing failed:', error);
    }

    // Step 7: Finalize encoding
    const blob = await encoder.finalize();

    // Cleanup
    player.deactivate();

    const pipelineEnd = performance.now();
    const totalTime = ((pipelineEnd - pipelineStart) / 1000).toFixed(2);

    // Final statistics
    console.log('\n🎉 Export Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`⏱️  Total Time: ${totalTime}s`);
    console.log(`🎞️  Total Frames: ${frameCount}`);
    console.log(`📈 Average Times:`);
    console.log(`   - Render: ${(totalRenderTime / frameCount).toFixed(2)}ms/frame`);
    console.log(`   - Encode: ${(totalEncodeTime / frameCount).toFixed(2)}ms/frame`);
    console.log(`📊 Time Distribution:`);
    console.log(`   - Render: ${((totalRenderTime / (pipelineEnd - pipelineStart)) * 100).toFixed(1)}%`);
    console.log(`   - Encode: ${((totalEncodeTime / (pipelineEnd - pipelineStart)) * 100).toFixed(1)}%`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return blob;
  } catch (error) {
    console.error('❌ Rendering failed:', error);
    throw error;
  }
}
