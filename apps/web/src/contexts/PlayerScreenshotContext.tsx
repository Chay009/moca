/**
 * PlayerScreenshotContext - Share player screenshot across components
 * CanvasPlayer provides screenshot, ZoomControls consumes it
 */
import { createContext, useContext } from 'react';

interface PlayerScreenshotContextType {
    thumbnailUrl: string | null;
    captureScreenshot: () => Promise<void>;
    isCapturing: boolean;
}

export const PlayerScreenshotContext = createContext<PlayerScreenshotContextType | null>(null);

export function usePlayerScreenshotContext() {
    const context = useContext(PlayerScreenshotContext);
    if (!context) {
        // Return default values if not in context (graceful degradation)
        return {
            thumbnailUrl: null,
            captureScreenshot: async () => { },
            isCapturing: false,
        };
    }
    return context;
}
