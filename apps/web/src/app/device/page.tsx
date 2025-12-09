'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { DeviceControls } from './components/DeviceControls';
import { AnimationPreset } from './presets/types';

// Dynamic import for Canvas (SSR-safe)
const DeviceCanvas = dynamic(
    () => import('./components/DeviceCanvas').then((mod) => mod.DeviceCanvas),
    {
        ssr: false,
        loading: () => (
            <div className="flex-1 flex items-center justify-center bg-neutral-900">
                <div className="text-neutral-400">Loading 3D Canvas...</div>
            </div>
        ),
    }
);

export default function DevicePage() {
    const [screenContent, setScreenContent] = useState<{
        type: 'image' | 'video';
        url: string;
    } | null>(null);
    const [backgroundColor, setBackgroundColor] = useState('#1a1a2e');
    const [activePreset, setActivePreset] = useState<AnimationPreset | null>(null);

    const handleContentUpload = (file: File) => {
        const url = URL.createObjectURL(file);
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        setScreenContent({ type, url });
    };

    return (
        <div className="flex h-full w-full">
            {/* 3D Canvas */}
            <div className="flex-1 relative">
                <Suspense fallback={
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                        <div className="text-neutral-400">Loading...</div>
                    </div>
                }>
                    <DeviceCanvas
                        screenContent={screenContent}
                        backgroundColor={backgroundColor}
                        activePreset={activePreset}
                    />
                </Suspense>
            </div>

            {/* Controls Panel */}
            <DeviceControls
                onContentUpload={handleContentUpload}
                backgroundColor={backgroundColor}
                onBackgroundChange={setBackgroundColor}
                activePreset={activePreset}
                onPresetChange={setActivePreset}
                screenContent={screenContent}
            />
        </div>
    );
}
