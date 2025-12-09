/**
 * DeviceSettings - Settings panel for device mockups (iPhone, etc.)
 * Shows device-specific controls and an "Edit in 3D" button that opens React-Three editor
 */

'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Section } from './SharedComponents';
import { Smartphone, Edit3, Upload } from 'lucide-react';
import { DeviceEditorSheet } from './DeviceEditorSheet';

interface DeviceSettingsProps {
    props: Record<string, any>;
    updateProperty: (key: string, value: any) => void;
}

// Animation presets available
const DEVICE_PRESETS = [
    { id: 'floating', name: 'Floating', description: 'Gentle hover motion' },
    { id: 'hero-entrance', name: 'Hero Entrance', description: 'Dramatic rise from below' },
    { id: 'rotate-360', name: 'Rotate 360°', description: 'Full rotation' },
    { id: 'tilted-zoom-out', name: 'Tilted Zoom Out', description: 'Zoom out reveal' },
];

export function DeviceSettings({ props, updateProperty }: DeviceSettingsProps) {
    const [editorOpen, setEditorOpen] = useState(false);

    const currentPreset = props.devicePreset || 'floating';
    const deviceScale = props.deviceScale || 15;
    const screenSrc = props.screenSrc || '';
    const sceneType = props.sceneType || 'iphone';

    const handleScreenUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            updateProperty('screenSrc', url);
        }
    };

    return (
        <>
            {/* Device Type Header */}
            <Section
                title="Device Mockup"
                icon={Smartphone}
            >
                <div className="space-y-4">
                    {/* Model Info */}
                    <div className="bg-muted/50 rounded-lg p-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Smartphone className="w-4 h-4" />
                            <span className="font-medium">iPhone 17 Pro</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            3D model with customizable screen content
                        </p>
                    </div>

                    {/* Animation Preset */}
                    <div className="space-y-2">
                        <Label className="text-xs">Animation Preset</Label>
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
                                        <div className="flex flex-col">
                                            <span>{preset.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {DEVICE_PRESETS.find(p => p.id === currentPreset)?.description}
                        </p>
                    </div>

                    {/* Scale Slider */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs">Scale</Label>
                            <span className="text-xs text-muted-foreground">{deviceScale}</span>
                        </div>
                        <Slider
                            value={[deviceScale]}
                            onValueChange={([value]) => updateProperty('deviceScale', value)}
                            min={5}
                            max={30}
                            step={1}
                        />
                    </div>

                    {/* Screen Content */}
                    <div className="space-y-2">
                        <Label className="text-xs">Screen Content</Label>
                        {screenSrc ? (
                            <div className="relative">
                                <div className="w-full h-20 bg-muted rounded-lg overflow-hidden">
                                    {screenSrc.includes('video') || screenSrc.endsWith('.mp4') ? (
                                        <video src={screenSrc} className="w-full h-full object-cover" muted />
                                    ) : (
                                        <img src={screenSrc} alt="Screen content" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-1 right-1"
                                    onClick={() => updateProperty('screenSrc', '')}
                                >
                                    ✕
                                </Button>
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleScreenUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="w-full h-20 bg-muted rounded-lg flex flex-col items-center justify-center gap-1 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                                    <Upload className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Upload image/video</span>
                                </div>
                            </div>
                        )}
                        <Input
                            placeholder="Or paste URL..."
                            value={screenSrc}
                            onChange={(e) => updateProperty('screenSrc', e.target.value)}
                            className="text-xs"
                        />
                    </div>

                    {/* Edit in 3D Button */}
                    <Sheet open={editorOpen} onOpenChange={setEditorOpen}>
                        <SheetTrigger asChild>
                            <Button className="w-full" variant="outline">
                                <Edit3 className="w-4 h-4 mr-2" />
                                Edit in 3D View
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[500px] sm:w-[600px] p-0">
                            <SheetHeader className="px-4 py-3 border-b">
                                <SheetTitle>3D Device Editor</SheetTitle>
                            </SheetHeader>
                            <DeviceEditorSheet
                                props={props}
                                updateProperty={updateProperty}
                                onClose={() => setEditorOpen(false)}
                            />
                        </SheetContent>
                    </Sheet>
                </div>
            </Section>
        </>
    );
}
