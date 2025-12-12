/**
 * usePlayerSync - Synchronizes Revideo player state with store
 * Extracted from RevideoPlayer for better separation of concerns
 */
import { useEffect, useRef, type RefObject } from 'react';
import { Player as CorePlayer } from '@revideo/core';

interface UsePlayerSyncProps {
  playerRef: RefObject<CorePlayer | null>;
  isPlaying: boolean;
  currentSceneIndex: number;
  scenes: any[];
}

/**
 * Syncs player playback state and scene changes
 */
export function usePlayerSync({
  playerRef,
  isPlaying,
  currentSceneIndex,
  scenes,
}: UsePlayerSyncProps) {
  // Track last scene index to avoid unnecessary seeks
  const lastSceneIndexRef = useRef<number>(currentSceneIndex);

  // Control playback from store
  useEffect(() => {
    if (!playerRef.current) return;

    if (isPlaying) {
      // Set fresh variables before starting playback to ensure replay uses updated data
      playerRef.current.setVariables({
        scenes,
        currentSceneIndex
      });
      console.log('▶️ Playback starting - variables set with fresh scene data');

      playerRef.current.togglePlayback(true);
    } else {
      playerRef.current.togglePlayback(false);
    }
  }, [isPlaying, playerRef, scenes, currentSceneIndex]);

  // Navigate to actual Revideo scene when currentSceneIndex changes
  useEffect(() => {
    if (!playerRef.current) return;

    // Only seek if scene index actually changed
    if (lastSceneIndexRef.current === currentSceneIndex) {
      return;
    }

    lastSceneIndexRef.current = currentSceneIndex;

    const playback = playerRef.current.playback;
    const allScenes = playback.onScenesRecalculated?.current || [];

    // Navigate to the scene at currentSceneIndex
    if (allScenes[currentSceneIndex]) {
      // Calculate the frame where this scene starts
      const targetFrame = allScenes
        .slice(0, currentSceneIndex)
        .reduce((sum: number, scene: any) => sum + (scene.lastFrame - scene.firstFrame), 0);

      console.log(`📍 Navigating to scene ${currentSceneIndex}, frame ${targetFrame}`);
      playerRef.current.requestSeek(targetFrame);
    } else {
      // Fallback: seek to beginning
      playerRef.current.requestSeek(0);
    }
  }, [currentSceneIndex, scenes, playerRef]);
}
