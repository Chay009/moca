import { CanvasSource, AudioBufferSource, Output, Mp4OutputFormat, BufferTarget, QUALITY_HIGH } from 'mediabunny';
import { Scene } from '@/store/projectStore';

/**
 * VideoEncoder using mediabunny with automatic backpressure
 * what we did here 
 * 
 * most of the params are here hardcoded but we need to expose them to user via ui and some criteria to automatically set them based on user device and video length
 * 
 * 
 * Read → [Buffer] → Encode → Output
       ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
       Memory grows fast!
        
       using limits to control memory usage

    [Reader] → (only if buffer < N) → [Encoder] → [Muxer]
     ↑                             ↓
     └─────── Backpressure ───────┘
 * Key insight from mediabunny documentation:
 * - CanvasSource.add() returns a Promise that resolves when the encoder is ready
 * - Mediabunny internally checks encoder queue size (waits when >= 4 frames)
 * - Also waits for muxer/writer capacity
 * - No manual queue management needed - just await add()
 *
 * This prevents memory bloat while keeping encoder maximally utilized.
     
     the adaptive concurrency control based on video length and hardware profile
     short videos can afford higher concurrency (more memory use, faster)
     long videos need lower concurrency (less memory, sustained load)
     we need to comewith something based on user device and user video length +flexibility to chose in ui 
     
     */
export type EncodingQuality = 'low' | 'medium' | 'high' | 'ultra';
export type HardwareProfile = 'low-end' | 'mid-range' | 'high-end' | 'custom';

export interface EncoderOptions {
  fps?: number;
  codec?: 'avc' | 'hevc' | 'vp9' | 'av1';
  videoBitrate?: number;
  audioBitrate?: number;
  onProgress?: (encoded: number, total: number) => void;

  // Performance tuning
  hardwareProfile?: HardwareProfile;
  customConcurrentLimit?: number; // Override adaptive limits
  encodingQuality?: EncodingQuality; // Affects bitrate/settings
}

export interface EncodeStats {
  totalFrames: number;
  totalTime: number;
  avgEncodeTime: number;
}

/**
 * Video encoder using mediabunny
 * Handles parallel encoding with backpressure control
 */
export class VideoEncoder {
  private output: Output;
  private target: BufferTarget;
  private videoSource: CanvasSource;
  private audioSource: AudioBufferSource;
  private fps: number;
  private totalFrames: number;
  private encodedFrames: number = 0;
  private onProgressCallback?: (encoded: number, total: number) => void;

  // Adaptive memory management based on video length
  // Short videos: Can use larger queue (memory released when done)
  // Long videos: Must be conservative (sustained load)

  // concurrentFrames: Tracks how many frames currently encoding
  private concurrentFrames: number = 0;

  // CONCURRENT_LIMIT: Max frames allowed in encoding queue
  // Higher = Faster (more parallel work) BUT more memory (each frame ~8MB)
  // Lower = Slower (less parallel) BUT safer memory (prevents spikes)
  // Example: 20 frames = ~160MB vs 6 frames = ~48MB
  private readonly CONCURRENT_LIMIT: number;

  // RETRY_DELAY: How long to wait before checking queue again (ms)
  // Lower = More responsive (checks queue faster) BUT more CPU (tight loop)
  // Higher = Less CPU overhead BUT slower to react when queue has space
  // Example: 5ms = checks 200x/sec, 8ms = checks 125x/sec
  private readonly RETRY_DELAY = 8; // ms

  constructor(
    canvas: HTMLCanvasElement,
    totalFrames: number,
    options: EncoderOptions = {}
  ) {
    this.fps = options.fps || 30;
    this.totalFrames = totalFrames;
    this.onProgressCallback = options.onProgress;

    // Determine concurrent limit based on hardware profile and video duration
    if (options.customConcurrentLimit) {
      // User override
      this.CONCURRENT_LIMIT = options.customConcurrentLimit;
      console.log(`🎛️  Custom mode: CONCURRENT_LIMIT = ${this.CONCURRENT_LIMIT}`);
    } else {
      // Hardware profile multipliers
      const profileMultipliers: Record<HardwareProfile, number> = {
        'low-end': 0.5,    // Conservative (limit * 0.5)
        'mid-range': 1.0,  // Default
        'high-end': 1.5,   // Aggressive (limit * 1.5)
        'custom': 1.0,
      };

      const multiplier = profileMultipliers[options.hardwareProfile || 'mid-range'];
      const durationSeconds = totalFrames / this.fps;

      // Base limits by video duration
      let baseLimit: number;
      if (durationSeconds <= 30) {
        baseLimit = 20; // Short video
      } else if (durationSeconds <= 120) {
        baseLimit = 12; // Medium video
      } else {
        baseLimit = 6;  // Long video
      }

      this.CONCURRENT_LIMIT = Math.max(4, Math.floor(baseLimit * multiplier));

      const profile = options.hardwareProfile || 'mid-range';
      const videoMode = durationSeconds <= 30 ? 'short' : durationSeconds <= 120 ? 'medium' : 'long';
      console.log(`⚙️  ${profile} / ${videoMode} video: CONCURRENT_LIMIT = ${this.CONCURRENT_LIMIT}`);
    }

    // Initialize mediabunny output
    this.target = new BufferTarget();
    this.output = new Output({
      format: new Mp4OutputFormat(),
      target: this.target,
    });

    // Determine video bitrate based on quality setting
    let videoBitrate: number | typeof QUALITY_HIGH = options.videoBitrate;
    if (!videoBitrate && options.encodingQuality) {
      const qualityBitrates: Record<EncodingQuality, number | typeof QUALITY_HIGH> = {
        'low': 2_000_000,      // 2 Mbps
        'medium': 5_000_000,   // 5 Mbps
        'high': QUALITY_HIGH,  // mediabunny's QUALITY_HIGH constant
        'ultra': 20_000_000,   // 20 Mbps
      };
      videoBitrate = qualityBitrates[options.encodingQuality];
    }
    if (!videoBitrate) {
      videoBitrate = QUALITY_HIGH; // Default
    }

    // Setup video track with encoding progress callback
    //
    // Hardware Acceleration Notes:
    // - WebCodecs can use GPU (hardware) or CPU (software) encoding
    // - Default: hardwareAcceleration: 'no-preference' (browser decides)
    // - H.264/AVC: Usually GPU on modern systems
    // - VP9/AV1: Often CPU (less hardware support)
    // - If GPU unavailable: VideoEncoder.isConfigSupported() returns false
    // - Mediabunny does NOT auto-fallback - must handle error manually
    //
    // To check what's available:
    //   const config = await VideoEncoder.isConfigSupported({
    //     codec: 'avc1.42001e',
    //     hardwareAcceleration: 'prefer-hardware',
    //     width: 1920, height: 1080
    //   });
    //   if (config.supported) { /* GPU available */ }
    //
    // To force CPU/GPU:
    //   hardwareAcceleration: 'prefer-hardware' (GPU)
    //   hardwareAcceleration: 'prefer-software' (CPU)
    //
    this.videoSource = new CanvasSource(canvas, {
      codec: options.codec || 'avc',
      bitrate: videoBitrate,
      // hardwareAcceleration: 'no-preference', // Default, not specified
      onEncodedPacket: () => {
        this.encodedFrames++;
        if (this.onProgressCallback) {
          this.onProgressCallback(this.encodedFrames, this.totalFrames);
        }
      },
    });
    this.output.addVideoTrack(this.videoSource);

    // Setup audio track
    this.audioSource = new AudioBufferSource({
      codec: 'aac',
      bitrate: options.audioBitrate || QUALITY_HIGH,
    });
    this.output.addAudioTrack(this.audioSource);
  }

  /**
   * Start the encoding process
   */
  async start(): Promise<void> {
    await this.output.start();
    console.log('🎥 Video encoder started');
  }

  /**
   * Encode a single frame with adaptive concurrency
   *
   * Strategy: Use FFmpeg-style polling with adaptive limits
   * - Short videos: Higher limit (20) = faster, temp memory spike OK
   * - Long videos: Lower limit (6) = slower, sustained stability
   *
   * Polling (vs direct await) gives event loop chances to GC
   */
  async encodeFrame(frameNumber: number): Promise<void> {
    // Poll-wait if at concurrent limit
    while (this.concurrentFrames >= this.CONCURRENT_LIMIT) {
      await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
    }

    const timestamp = frameNumber / this.fps;
    const duration = 1 / this.fps;

    // Fire-and-forget with counter tracking
    this.concurrentFrames++;
    this.videoSource.add(timestamp, duration)
      .then(() => {
        this.concurrentFrames--;
      })
      .catch((error) => {
        this.concurrentFrames--;
        console.error('❌ Encode error:', error);
      });
  }

  /**
   * Process audio from scene data
   */
  async processAudio(scenes: Scene[], totalDuration: number): Promise<void> {
    console.log('🔊 Processing audio...');
    const audioContext = new AudioContext();
    let currentTime = 0;

    for (const scene of scenes) {
      for (const element of scene.elements) {
        if (element.type !== 'audio' && element.type !== 'video') continue;
        if (!element.properties.src) continue;

        try {
          const response = await fetch(element.properties.src);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          const sampleRate = audioBuffer.sampleRate;
          const channels = audioBuffer.numberOfChannels;

          const totalSamples = Math.ceil(totalDuration * sampleRate);
          const paddedBuffer = audioContext.createBuffer(
            channels,
            totalSamples,
            sampleRate
          );

          const offsetSamples = Math.floor(currentTime * sampleRate);
          const volume = element.properties.volume ?? 1;

          for (let channel = 0; channel < channels; channel++) {
            const sourceData = audioBuffer.getChannelData(channel);
            const destData = paddedBuffer.getChannelData(channel);

            for (let i = 0; i < sourceData.length && offsetSamples + i < totalSamples; i++) {
              destData[offsetSamples + i] += sourceData[i] * volume;
            }
          }

          await this.audioSource.add(paddedBuffer);
        } catch (error) {
          console.warn(`Failed to load audio from ${element.properties.src}:`, error);
        }
      }

      currentTime += scene.duration;
    }
  }

  /**
   * Finalize encoding and return the video blob
   */
  async finalize(): Promise<Blob> {
    console.log('⏳ Finalizing video encoding...');

    // Wait for all concurrent frames to drain
    while (this.concurrentFrames > 0) {
      await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
    }

    await this.output.finalize();

    console.log('✅ Video encoding complete');

    return new Blob([this.target.buffer], { type: 'video/mp4' });
  }

  /**
   * Get current encoding progress
   */
  getProgress(): { encoded: number; total: number; percentage: number } {
    return {
      encoded: this.encodedFrames,
      total: this.totalFrames,
      percentage: (this.encodedFrames / this.totalFrames) * 100,
    };
  }

}

/**
 * Standalone function to encode frames with performance tracking
 */
export async function encodeVideo(
  canvas: HTMLCanvasElement,
  totalFrames: number,
  scenes: Scene[],
  totalDuration: number,
  options: EncoderOptions = {}
): Promise<{ blob: Blob; stats: EncodeStats }> {
  console.log('🎬 Starting video encoding...');
  const startTime = performance.now();

  let totalEncodeTime = 0;
  let frameCount = 0;

  const encoder = new VideoEncoder(canvas, totalFrames, options);
  await encoder.start();

  // Encode frames (this would be called from renderer loop)
  const fps = options.fps || 30;
  for (let frame = 0; frame < totalFrames; frame++) {
    const encodeStart = performance.now();
    await encoder.encodeFrame(frame);
    const encodeEnd = performance.now();
    totalEncodeTime += encodeEnd - encodeStart;
    frameCount++;

    // Log progress every 30 frames
    if (frame % 30 === 0 && frame > 0) {
      const avgEncode = (totalEncodeTime / frameCount).toFixed(2);
      console.log(`📊 Encoding frame ${frame}/${totalFrames} - Encode: ${avgEncode}ms/frame`);
    }
  }

  // Process audio
  try {
    await encoder.processAudio(scenes, totalDuration);
  } catch (error) {
    console.warn('Audio processing failed:', error);
  }

  // Finalize
  const blob = await encoder.finalize();

  const endTime = performance.now();
  const totalTime = (endTime - startTime) / 1000;

  console.log('\n🎉 Encoding Complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`⏱️  Total Time: ${totalTime.toFixed(2)}s`);
  console.log(`📈 Average Encode Time: ${(totalEncodeTime / frameCount).toFixed(2)}ms/frame`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return {
    blob,
    stats: {
      totalFrames: frameCount,
      totalTime,
      avgEncodeTime: totalEncodeTime / frameCount,
    },
  };
}
