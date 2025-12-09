/**
 * usePlayerScreenshot - Capture player and save to localStorage
 * Simple approach - no context needed
 */
import { useRef, useCallback, useState, useEffect } from 'react';
import { domToPng } from 'modern-screenshot';

const SCREENSHOT_KEY = 'player-screenshot';

interface CaptureOptions {
    quality?: number;
    width?: number;
    height?: number;
}

export function usePlayerScreenshot() {
    const elementRef = useRef<HTMLElement | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(SCREENSHOT_KEY);
        if (stored) {
            setThumbnailUrl(stored);
        }
    }, []);

    const capture = useCallback(async (options: CaptureOptions = {}) => {
        console.log('📸 Capture called, elementRef:', elementRef.current);

        if (!elementRef.current) {
            console.warn('📸 No element to capture - ref is null');
            return null;
        }

        setIsCapturing(true);
        try {
            console.log('📸 Starting domToPng...');
            const dataUrl = await domToPng(elementRef.current, {
                quality: options.quality || 0.8,
                width: options.width,
                height: options.height,
            });
            console.log('📸 Screenshot captured, length:', dataUrl?.length);

            // Save to localStorage
            localStorage.setItem(SCREENSHOT_KEY, dataUrl);
            setThumbnailUrl(dataUrl);

            // Dispatch event so other components know screenshot updated
            window.dispatchEvent(new CustomEvent('player-screenshot-updated', { detail: dataUrl }));

            return dataUrl;
        } catch (error) {
            console.error('📸 Failed to capture screenshot:', error);
            return null;
        } finally {
            setIsCapturing(false);
        }
    }, []);

    // Helper to set ref (for combining with other refs)
    const setRef = useCallback((el: HTMLElement | null) => {
        console.log('📸 setRef called with:', el?.tagName);
        elementRef.current = el;
    }, []);

    return { elementRef, setRef, capture, isCapturing, thumbnailUrl };
}

/**
 * Hook to read screenshot from localStorage
 * Use in ZoomControls
 */
export function usePlayerScreenshotUrl() {
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

    useEffect(() => {
        // Load initial value
        const stored = localStorage.getItem(SCREENSHOT_KEY);
        console.log('📸 usePlayerScreenshotUrl loaded:', stored ? 'found' : 'empty');
        if (stored) {
            setThumbnailUrl(stored);
        }

        // Listen for updates
        const handleUpdate = (e: CustomEvent) => {
            console.log('📸 Screenshot updated event received');
            setThumbnailUrl(e.detail);
        };

        window.addEventListener('player-screenshot-updated', handleUpdate as EventListener);
        return () => {
            window.removeEventListener('player-screenshot-updated', handleUpdate as EventListener);
        };
    }, []);

    return thumbnailUrl;
}
