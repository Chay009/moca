/**
 * usePlayerSync - Synchronizes Revideo player state with store
 * Extracted from RevideoPlayer for better separation of concerns
 */
import { useEffect, type RefObject } from 'react';
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
  // Control playback from store
  useEffect(() => {
    if (!playerRef.current) return;

    if (isPlaying) {
      // why are we doing this? the requestseek?
      playerRef.current.requestSeek(playerRef.current.status.time);
      playerRef.current.togglePlayback(true);
    } else {
      playerRef.current.togglePlayback(false);
    }
  }, [isPlaying, playerRef]);

  // Force player to recalculate when scene changes
  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.requestSeek(0);
    // Removed requestRender() to match Vite version and prevent race conditions
  }, [currentSceneIndex, scenes, playerRef]);
}
