/**
 * DeviceEditorSheet - React-Three-Fiber 3D editor for device mockups
 * Opens in a Sheet with interactive 3D preview and controls
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RotateCcw, Play, Pause, Camera, Move3D } from 'lucide-react';

// Dynamic import for Canvas (SSR-safe)
const DevicePreview = dynamic(
    () => import('./DevicePreview').then((mod) => mod.DevicePreview),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-[300px] flex items-center justify-center bg-neutral-900 rounded-lg">
                <div className="text-neutral-400">Loading 3D Preview...</div>
            </div>
        ),
    }
);

interface DeviceEditorSheetProps {
    props: Record<string, any>;
    updateProperty: (key: string, value: any) => void;
    onClose: () => void;
}

// Animation presets
const DEVICE_PRESETS = [
    { id: 'floating', name: 'Floating', duration: 4 },
    { id: 'hero-entrance', name: 'Hero Entrance', duration: 2.5 },
    { id: 'rotate-360', name: 'Rotate 360°', duration: 4 },
    { id: 'tilted-zoom-out', name: 'Tilted Zoom Out', duration: 3 },
];

export function DeviceEditorSheet({ props, updateProperty, onClose }: DeviceEditorSheetProps) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 4 });

    const currentPreset = props.devicePreset || 'floating';
    const deviceScale = props.deviceScale || 15;
    const screenSrc = props.screenSrc || '';
    const backgroundColor = props.background || '#1a1a2e';

    const handleResetCamera = () => {
        setCameraPosition({ x: 0, y: 0, z: 4 });
    };

    return (
        <div className="flex flex-col h-full">
            {/* 3D Preview Area */}
            <div className="relative bg-neutral-900 border-b">
                <Suspense fallback={
                    <div className="w-full h-[300px] flex items-center justify-center">
                        <div className="text-neutral-400">Loading...</div>
                    </div>
                }>
                    <DevicePreview
                        screenContent={screenSrc ? { type: screenSrc.includes('.mp4') ? 'video' : 'image', url: screenSrc } : null}
                        backgroundColor={backgroundColor}
                        activePreset={currentPreset}
                        isPlaying={isPlaying}
                    />
                </Suspense>

                {/* Preview Controls */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                        {isPlaying ? 'Pause' : 'Play'}
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleResetCamera}
                    >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reset View
                    </Button>
                </div>
            </div>

            {/* Controls Panel */}
            <div className="flex-1 overflow-y-auto p-4">
                <Tabs defaultValue="animation" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="animation">
                            <Move3D className="w-4 h-4 mr-1" />
                            Animation
                        </TabsTrigger>
                        <TabsTrigger value="camera">
                            <Camera className="w-4 h-4 mr-1" />
                            Camera
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="animation" className="space-y-4 mt-4">
                        {/* Preset Selector */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Animation Preset</Label>
                            <Select
                                value={currentPreset}
                                onValueChange={(value) => updateProperty('devicePreset', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {DEVICE_PRESETS.map((preset) => (
                                        <SelectItem key={preset.id} value={preset.id}>
                                            {preset.name} ({preset.duration}s)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Scale Slider */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-medium">Device Scale</Label>
                                <span className="text-sm text-muted-foreground">{deviceScale}</span>
                            </div>
                            <Slider
                                value={[deviceScale]}
                                onValueChange={([value]) => updateProperty('deviceScale', value)}
                                min={5}
                                max={30}
                                step={1}
                            />
                        </div>

                        {/* Background Color */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Background</Label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={backgroundColor}
                                    onChange={(e) => updateProperty('background', e.target.value)}
                                    className="w-10 h-10 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={backgroundColor}
                                    onChange={(e) => updateProperty('background', e.target.value)}
                                    className="flex-1 px-3 py-2 text-sm border rounded"
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="camera" className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Camera FOV</Label>
                            <Slider
                                value={[props.cameraFov || 50]}
                                onValueChange={([value]) => updateProperty('cameraFov', value)}
                                min={30}
                                max={90}
                                step={1}
                            />
                            <p className="text-xs text-muted-foreground">
                                Field of view: {props.cameraFov || 50}°
                            </p>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-sm text-muted-foreground">
                                💡 Drag in the 3D preview to rotate the view.
                                Changes are applied to the Motion Canvas player in real-time.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Footer Actions */}
            <div className="border-t p-4 flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                    Done
                </Button>
            </div>
        </div>
    );
}
