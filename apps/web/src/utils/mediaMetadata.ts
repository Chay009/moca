/**
 * Utility to extract metadata from video/audio files
 */

export interface MediaMetadata {
  duration: number;
  width?: number;
  height?: number;
  hasAudio?: boolean;
}

/**
 * Get metadata from video file
 */
export async function getVideoMetadata(src: string): Promise<MediaMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        hasAudio: true, // Assume video has audio (can't easily detect without playing)
      });

      // Cleanup
      video.src = '';
      video.load();
    };

    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
    };

    video.src = src;
  });
}

/**
 * Get metadata from audio file
 */
export async function getAudioMetadata(src: string): Promise<MediaMetadata> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio');
    audio.preload = 'metadata';

    audio.onloadedmetadata = () => {
      resolve({
        duration: audio.duration,
      });

      // Cleanup
      audio.src = '';
      audio.load();
    };

    audio.onerror = () => {
      reject(new Error('Failed to load audio metadata'));
    };

    audio.src = src;
  });
}

/**
 * Get metadata from media file (auto-detects type)
 */
export async function getMediaMetadata(src: string, type: 'video' | 'audio'): Promise<MediaMetadata> {
  if (type === 'video') {
    return getVideoMetadata(src);
  } else {
    return getAudioMetadata(src);
  }
}
