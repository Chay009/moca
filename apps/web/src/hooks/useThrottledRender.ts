/**
 * Hook to throttle render requests to max 60fps
 */
import { useRef, useCallback, MutableRefObject } from 'react';
import { Player as CorePlayer } from '@revideo/core';

export function useThrottledRender(playerRef: MutableRefObject<CorePlayer | null>) {
  const rafId = useRef<number | null>(null);

  const throttledRender = useCallback(() => {
    if (rafId.current !== null) return;
    rafId.current = requestAnimationFrame(() => {
      playerRef.current?.requestRender();
      rafId.current = null;
    });
  }, [playerRef]);

  return throttledRender;
}
