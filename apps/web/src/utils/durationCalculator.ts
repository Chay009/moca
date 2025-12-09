/**
 * Duration Calculator Utility
 * Calculates scene duration from element animations
 */

import type { SceneElement } from '@/types/elements';

interface AnimationTiming {
    entrance?: { duration?: number };
    exit?: { duration?: number };
    hold?: number;
    startTime?: number;
    holdDuration?: number;
}

/**
 * Calculate element's total time on screen
 */
export function calculateElementDuration(element: SceneElement): number {
    const props = element.properties;
    const animation = props.animation as AnimationTiming | undefined;

    // Default timings
    const entranceDuration = animation?.entrance?.duration ?? 0.5;
    const exitDuration = animation?.exit?.duration ?? 0.5;
    const holdDuration = animation?.holdDuration ?? animation?.hold ?? 3;
    const startTime = animation?.startTime ?? 0;

    // For video/audio, use media duration if available
    if (element.type === 'video-simple' || element.type === 'audio') {
        const mediaDuration = props.mediaDuration as number | undefined;
        if (mediaDuration && mediaDuration > 0) {
            return startTime + mediaDuration + exitDuration;
        }
    }

    // Total element time = startOffset + entrance + hold + exit
    return startTime + entranceDuration + holdDuration + exitDuration;
}

/**
 * Calculate scene duration from all elements
 * Returns the maximum end time across all elements
 */
export function calculateSceneDuration(elements: SceneElement[]): number {
    if (!elements || elements.length === 0) {
        return 3; // Default 3 seconds for empty scenes
    }

    const durations = elements.map(calculateElementDuration);
    const maxDuration = Math.max(...durations);

    // Add a small buffer for transitions
    return Math.max(3, maxDuration + 0.5);
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
}
