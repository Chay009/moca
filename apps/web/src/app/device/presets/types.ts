export interface AnimationPreset {
    id: string;
    name: string;
    description: string;
    duration: number; // in seconds
    thumbnail?: string;
    animate: (elapsedTime: number, duration: number) => {
        rotation: [number, number, number];
        position: [number, number, number];
        scale: number;
    };
}

export interface AnimationState {
    isPlaying: boolean;
    currentTime: number;
    preset: AnimationPreset | null;
}
