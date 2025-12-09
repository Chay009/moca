'use client';

import { useRef, ChangeEvent } from 'react';
import { AnimationPreset } from '../presets/types';
import { allPresets } from '../presets/animations';

interface DeviceControlsProps {
    onContentUpload: (file: File) => void;
    backgroundColor: string;
    onBackgroundChange: (color: string) => void;
    activePreset: AnimationPreset | null;
    onPresetChange: (preset: AnimationPreset | null) => void;
    screenContent: { type: 'image' | 'video'; url: string } | null;
}

// Color presets
const backgroundPresets = [
    { name: 'Deep Purple', color: '#1a1a2e' },
    { name: 'Dark Blue', color: '#0f172a' },
    { name: 'Charcoal', color: '#1f1f1f' },
    { name: 'Navy', color: '#0a192f' },
    { name: 'Sunset', color: '#2d1b4e' },
    { name: 'Forest', color: '#1a2f1a' },
];

export function DeviceControls({
    onContentUpload,
    backgroundColor,
    onBackgroundChange,
    activePreset,
    onPresetChange,
    screenContent,
}: DeviceControlsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onContentUpload(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-80 bg-neutral-900/95 backdrop-blur-xl border-l border-neutral-800 p-4 flex flex-col gap-6 overflow-y-auto">
            {/* Header */}
            <div className="border-b border-neutral-800 pb-4">
                <h1 className="text-lg font-semibold text-white">Device Showcase</h1>
                <p className="text-sm text-neutral-400 mt-1">Create 3D device mockups</p>
            </div>

            {/* Screen Content */}
            <section className="space-y-3">
                <h2 className="text-sm font-medium text-neutral-300">Screen Content</h2>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <button
                    onClick={handleUploadClick}
                    className="w-full py-3 px-4 rounded-lg border-2 border-dashed border-neutral-700 hover:border-indigo-500 hover:bg-indigo-500/10 transition-colors text-neutral-400 hover:text-indigo-400 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {screenContent ? 'Replace Content' : 'Upload Image or Video'}
                </button>

                {screenContent && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-neutral-800/50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${screenContent.type === 'video' ? 'bg-red-500' : 'bg-green-500'
                            }`} />
                        <span className="text-sm text-neutral-300 capitalize">
                            {screenContent.type} loaded
                        </span>
                        <button
                            onClick={() => onContentUpload(new File([], ''))}
                            className="ml-auto text-neutral-500 hover:text-red-400"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
            </section>

            {/* Animation Presets */}
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-neutral-300">Animation Preset</h2>
                    {activePreset && (
                        <button
                            onClick={() => onPresetChange(null)}
                            className="text-xs text-neutral-500 hover:text-neutral-300"
                        >
                            Clear
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-2">
                    {allPresets.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => onPresetChange(preset)}
                            className={`p-3 rounded-lg text-left transition-all ${activePreset?.id === preset.id
                                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                                    : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-800'
                                }`}
                        >
                            <div className="font-medium text-sm">{preset.name}</div>
                            <div className={`text-xs mt-0.5 ${activePreset?.id === preset.id ? 'text-indigo-200' : 'text-neutral-500'
                                }`}>
                                {preset.description}
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Background */}
            <section className="space-y-3">
                <h2 className="text-sm font-medium text-neutral-300">Background</h2>

                <div className="grid grid-cols-3 gap-2">
                    {backgroundPresets.map((preset) => (
                        <button
                            key={preset.color}
                            onClick={() => onBackgroundChange(preset.color)}
                            className={`h-12 rounded-lg transition-all ${backgroundColor === preset.color
                                    ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900'
                                    : 'hover:ring-1 hover:ring-neutral-600'
                                }`}
                            style={{ backgroundColor: preset.color }}
                            title={preset.name}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => onBackgroundChange(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                    <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => onBackgroundChange(e.target.value)}
                        className="flex-1 px-3 py-2 bg-neutral-800 rounded-lg text-sm text-neutral-300 border border-neutral-700 focus:border-indigo-500 focus:outline-none"
                    />
                </div>
            </section>

            {/* Instructions */}
            <section className="mt-auto pt-4 border-t border-neutral-800">
                <div className="text-xs text-neutral-500 space-y-1">
                    <p>🖱️ Drag to rotate the device</p>
                    <p>🔍 Scroll to zoom in/out</p>
                    <p>🎬 Select a preset to animate</p>
                </div>
            </section>
        </div>
    );
}
