  Checklist:

  ✅ All Core Features Preserved:

  1. Continuous playback - ✓ (revideoRenderer.ts:118-119)
  2. Direct scene.render() - ✓ (revideoRenderer.ts:68)
  3. No Stage - ✓ (bypassed completely)
  4. Optimized canvas settings - ✓ (frameRenderer.ts:60-64)
  5. Parallel encoding - ✓ (videoEncoder.ts:87-93)
  6. Backpressure control - ✓ (MAX_PENDING = 5)
  7. Audio processing - ✓ (videoEncoder.ts:99-144)
  8. Performance tracking - ✓ (both files)
  9. Progress callbacks - ✓ (revideoRenderer.ts:40-43)
  10. Cleanup/dispose - ✓ (revideoRenderer.ts:133)

  ✅ All Optimizations Applied:

  - willReadFrequently: true
  - alpha: false
  - desynchronized: true
  - player.togglePlayback(true) for continuous rendering
  - onRender + onFrameChanged subscriptions

  ✅ Separation Achieved:

  - frameRenderer.ts - Pure rendering logic
  - videoEncoder.ts - Pure encoding logic
  - revideoRenderer.ts - Orchestration only

  Nothing missing! Ready to test. 🎉

  

import { Player, Stage, Vector2 } from '@revideo/core';
import { CanvasSource, AudioBufferSource, Output, Mp4OutputFormat, BufferTarget, QUALITY_HIGH } from 'mediabunny';
import project from '@/revideo/project';
import { Scene } from '@/store/sceneStore';

/**
 * how did we get this logic claude checked how the internal revideo react player actually getting the frames from so it checked the source code and found out that it uses the stage render method to get the frames so we can directly use that to render the frames without going through the whole player system
 * 
 * @param scenes 
 * @param audioSource 
 * @param totalDuration 
 */
/**
 * Process audio elements directly from scene data
 * No dependency on Revideo's node system - works with raw scene data
 */
async function processAudioFromScenes(
  scenes: Scene[],
  audioSource: AudioBufferSource,
  totalDuration: number
): Promise<void> {
  const audioContext = new AudioContext();

  let currentTime = 0;

  // Go through each scene and extract audio/video elements
  for (const scene of scenes) {
    for (const element of scene.elements) {
      // Only process audio and video elements
      if (element.type !== 'audio' && element.type !== 'video') continue;
      if (!element.properties.src) continue;

      try {
        // Fetch and decode the audio file
        const response = await fetch(element.properties.src);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const sampleRate = audioBuffer.sampleRate;
        const channels = audioBuffer.numberOfChannels;

        // Create silent buffer for the full video duration
        const totalSamples = Math.ceil(totalDuration * sampleRate);
        const paddedBuffer = audioContext.createBuffer(
          channels,
          totalSamples,
          sampleRate
        );

        // Calculate where to place the audio (at the start of its scene)
        const offsetSamples = Math.floor(currentTime * sampleRate);
        const volume = element.properties.volume ?? 1;

        // Copy audio data to the correct position with volume applied
        for (let channel = 0; channel < channels; channel++) {
          const sourceData = audioBuffer.getChannelData(channel);
          const destData = paddedBuffer.getChannelData(channel);

          for (let i = 0; i < sourceData.length && offsetSamples + i < totalSamples; i++) {
            destData[offsetSamples + i] += sourceData[i] * volume; // += to mix multiple audio sources
          }
        }

        // Add to mediabunny audio source
        await audioSource.add(paddedBuffer);
      } catch (error) {
        console.warn(`Failed to load audio from ${element.properties.src}:`, error);
      }
    }

    // Move to next scene
    currentTime += scene.duration;
  }
}

/**
 * Use Revideo's Stage to render frames + collect audio from Audio/Video nodes
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

  // Create Revideo Player (without Stage for better performance)
  const player = new Player(project, {
    size: new Vector2(width, height),
    fps,
    resolutionScale: 1,
  });

  player.setVariables({ scenes });

  // Create optimized canvas directly (bypass Stage's double-buffering overhead)
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  // Optimize canvas context for frame extraction
  const context = canvas.getContext('2d', {
    willReadFrequently: true, // Optimize for frequent reads (mediabunny)
    alpha: false,              // Disable alpha channel (faster, smaller)
    desynchronized: true       // Allow async rendering
  });

  if (!context) {
    throw new Error('Failed to create canvas context');
  }

  // Initialize mediabunny output
  const output = new Output({
    format: new Mp4OutputFormat(),
    target: new BufferTarget(),
  });

  // Track encoding progress
  let encodedFrames = 0;

  // Setup video track with encoding progress callback
  const videoSource = new CanvasSource(canvas, {
    codec: 'avc',
    bitrate: QUALITY_HIGH,
    onEncodedPacket: () => {
      encodedFrames++;
      if (options.onProgress) {
        // Report encoding progress
        options.onProgress(encodedFrames / totalFrames);
      }
    },
  });
  output.addVideoTrack(videoSource);

  // Setup audio track - will collect from Revideo's Audio/Video nodes
  const audioSource = new AudioBufferSource({
    codec: 'aac',
    bitrate: QUALITY_HIGH,
  });
  output.addAudioTrack(audioSource);

  await output.start();

  player.activate();

  const frameDuration = 1 / fps;

  // Performance tracking
  let totalRenderTime = 0;
  let totalEncodeTime = 0;
  let frameCount = 0;

  // Parallel encoding with backpressure control
  const MAX_PENDING = 5;
  const pendingEncodes: Promise<void>[] = [];

  console.log('🎬 Starting video render (continuous mode)...');
  const renderStartTime = performance.now();

  // Use continuous rendering instead of frame-by-frame seeking
  // This is significantly faster as it uses Player's natural update loop
  await new Promise<void>((resolve, reject) => {
    let currentFrame = 0;

    // Subscribe to render events
    const unsubscribeRender = player.onRender.subscribe(async () => {
      try {
        const currentScene = player.playback.currentScene;

        if (currentScene) {
          // Track render time
          const renderStart = performance.now();
          context.clearRect(0, 0, width, height);
          await currentScene.render(context);
          const renderEnd = performance.now();
          totalRenderTime += renderEnd - renderStart;

          // Track encode time
          const encodeStart = performance.now();
          const encodePromise = videoSource.add(currentFrame / fps, frameDuration).then(() => {
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
            unsubscribeRender();
            unsubscribeFrame();
            resolve();
          }
        }
      } catch (error) {
        unsubscribeRender();
        unsubscribeFrame();
        reject(error);
      }
    });

    // Subscribe to frame changes to trigger renders
    const unsubscribeFrame = player.onFrameChanged.subscribe(() => {
      if (currentFrame < totalFrames) {
        player.requestRender();
      }
    });

    // Start playback from frame 0
    player.requestSeek(0);
    player.togglePlayback(true);
  });

  // Wait for all remaining frames to finish encoding
  await Promise.all(pendingEncodes);

  // Stop playback
  player.togglePlayback(false);

  const renderEndTime = performance.now();
  const totalTime = ((renderEndTime - renderStartTime) / 1000).toFixed(2);

  // Final statistics
  console.log('\n🎉 Render Complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`⏱️  Total Time: ${totalTime}s`);
  console.log(`🎞️  Total Frames: ${frameCount}`);
  console.log(`📈 Average Times:`);
  console.log(`   - Render: ${(totalRenderTime / frameCount).toFixed(2)}ms/frame`);
  console.log(`   - Encode: ${(totalEncodeTime / frameCount).toFixed(2)}ms/frame`);
  console.log(`📊 Time Distribution:`);
  console.log(`   - Render: ${((totalRenderTime / (renderEndTime - renderStartTime)) * 100).toFixed(1)}%`);
  console.log(`   - Encode: ${((totalEncodeTime / (renderEndTime - renderStartTime)) * 100).toFixed(1)}%`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Process audio directly from scene data (no dependency on Revideo nodes)
  // This avoids async property access warnings
  try {
    await processAudioFromScenes(scenes, audioSource, totalDuration);
  } catch (error) {
    console.warn('Audio processing failed:', error);
    // Continue without audio
  }

  await output.finalize();
  player.deactivate();

  return new Blob([output.target.buffer], { type: 'video/mp4' });
}
