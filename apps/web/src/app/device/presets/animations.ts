import { AnimationPreset } from './types';

// Easing functions
const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const easeOutBack = (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// ==================== TILTED ZOOM OUT ====================
export const tiltedZoomOut: AnimationPreset = {
    id: 'tilted-zoom-out',
    name: 'Tilted Zoom Out',
    description: 'Starts close and tilted, zooms out to reveal full device',
    duration: 3,
    animate: (elapsedTime, duration) => {
        const progress = Math.min(elapsedTime / duration, 1);
        const eased = easeOutBack(progress);

        return {
            rotation: [
                0.1 * (1 - eased), // Tilt forward at start
                Math.PI * 0.1 * eased, // Rotate slightly
                -0.05 * (1 - eased), // Roll correction
            ],
            position: [
                0,
                0.5 * (1 - eased), // Start slightly up
                2 - 1.5 * eased, // Zoom out from close
            ],
            scale: 1 + 0.3 * (1 - eased), // Start larger
        };
    },
};

// ==================== FLOATING ====================
export const floating: AnimationPreset = {
    id: 'floating',
    name: 'Floating',
    description: 'Gentle floating motion with subtle rotation',
    duration: 4,
    animate: (elapsedTime, duration) => {
        const progress = (elapsedTime % duration) / duration;
        const wave = Math.sin(progress * Math.PI * 2);
        const wave2 = Math.cos(progress * Math.PI * 2);

        return {
            rotation: [
                0.05 * wave, // Gentle pitch
                0.1 * wave2, // Gentle yaw
                0.02 * wave, // Subtle roll
            ],
            position: [
                0.1 * wave2, // Slight X drift
                0.15 * wave, // Float up/down
                0,
            ],
            scale: 1,
        };
    },
};

// ==================== ROTATE 360 ====================
export const rotate360: AnimationPreset = {
    id: 'rotate-360',
    name: 'Rotate 360°',
    description: 'Full rotation around Y axis',
    duration: 4,
    animate: (elapsedTime, duration) => {
        const progress = Math.min(elapsedTime / duration, 1);
        const eased = easeInOutCubic(progress);

        return {
            rotation: [
                0,
                Math.PI * 2 * eased, // Full rotation
                0,
            ],
            position: [0, 0, 0],
            scale: 1,
        };
    },
};

// ==================== SHOWCASE SPIN ====================
export const showcaseSpin: AnimationPreset = {
    id: 'showcase-spin',
    name: 'Showcase Spin',
    description: 'Elegant spin with tilt for product showcase',
    duration: 5,
    animate: (elapsedTime, duration) => {
        const progress = Math.min(elapsedTime / duration, 1);
        const eased = easeInOutCubic(progress);

        // Phase 1: Zoom in (0-30%)
        // Phase 2: Rotate (30-70%)
        // Phase 3: Settle (70-100%)

        let rotation: [number, number, number];
        let position: [number, number, number];
        let scale: number;

        if (progress < 0.3) {
            const phase = progress / 0.3;
            rotation = [0.2 * easeInOutCubic(phase), 0, 0];
            position = [0, 0, -0.5 * easeInOutCubic(phase)];
            scale = 1;
        } else if (progress < 0.7) {
            const phase = (progress - 0.3) / 0.4;
            rotation = [0.2, Math.PI * phase, 0];
            position = [0, 0, -0.5];
            scale = 1;
        } else {
            const phase = (progress - 0.7) / 0.3;
            rotation = [0.2 * (1 - easeInOutCubic(phase)), Math.PI, 0];
            position = [0, 0, -0.5 + 0.5 * easeInOutCubic(phase)];
            scale = 1;
        }

        return { rotation, position, scale };
    },
};

// ==================== HERO ENTRANCE ====================
export const heroEntrance: AnimationPreset = {
    id: 'hero-entrance',
    name: 'Hero Entrance',
    description: 'Dramatic entrance from below with bounce',
    duration: 2.5,
    animate: (elapsedTime, duration) => {
        const progress = Math.min(elapsedTime / duration, 1);
        const eased = easeOutBack(progress);

        return {
            rotation: [
                -0.3 * (1 - eased), // Start tilted back
                0.2 * (1 - eased), // Start slightly rotated
                0,
            ],
            position: [
                0,
                -2 + 2 * eased, // Rise from below
                1 - 1 * eased, // Move forward
            ],
            scale: 0.5 + 0.5 * eased, // Scale up
        };
    },
};

// Export all presets
export const allPresets: AnimationPreset[] = [
    tiltedZoomOut,
    floating,
    rotate360,
    showcaseSpin,
    heroEntrance,
];

export const getPresetById = (id: string): AnimationPreset | undefined => {
    return allPresets.find((preset) => preset.id === id);
};
