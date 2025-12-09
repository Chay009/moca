/**
 * Zoom Event Types
 * Defines the structure for camera zoom keyframes
 */

export type ZoomEasing = 'linear' | 'easeInOut' | 'easeIn' | 'easeOut';

export interface ZoomEvent {
    /** Unique identifier */
    id: string;
    /** When zoom starts (in seconds from scene start) */
    startTime: number;
    /** Duration of zoom animation (seconds) */
    duration: number;
    /** X coordinate to zoom to (scene coordinates) */
    targetX: number;
    /** Y coordinate to zoom to (scene coordinates) */
    targetY: number;
    /** Zoom level: 1 = normal, 2 = 2x zoom, etc. */
    zoomLevel: number;
    /** Animation easing function */
    easing: ZoomEasing;
    /** How long to hold the zoom before resetting (seconds) */
    holdDuration: number;
    /** Whether to auto-reset zoom after hold */
    autoReset: boolean;
}

/** Default values for new zoom events */
export const DEFAULT_ZOOM_EVENT: Omit<ZoomEvent, 'id' | 'startTime'> = {
    duration: 0.5,
    targetX: 0,
    targetY: 0,
    zoomLevel: 1.5,
    easing: 'easeInOut',
    holdDuration: 1,
    autoReset: true,
};
