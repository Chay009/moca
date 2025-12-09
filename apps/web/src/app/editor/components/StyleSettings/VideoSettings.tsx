/**
 * Video-Specific Settings
 * Video source and playback controls for video components
 * Future: Add FFmpeg integration for trim/crop/compress
 */

'use client';

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Video as VideoIcon, Upload } from "lucide-react"
import { Section, PropertyLabel, NumberInput } from './SharedComponents'

interface VideoSettingsProps {
    props: any;
    updateProperty: (key: string, value: any) => void;
}

export function VideoSettings({ props, updateProperty }: VideoSettingsProps) {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                const result = event.target?.result as string
                updateProperty('src', result)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <Section title="Video" icon={VideoIcon}>
            <div className="space-y-5">

                {/* Video Source */}
                <div className="space-y-1.5">
                    <PropertyLabel>Source URL</PropertyLabel>
                    <div className="flex gap-2">
                        <Input
                            value={props.src || ''}
                            onChange={(e) => updateProperty('src', e.target.value)}
                            placeholder="https://... or paste base64"
                            className="h-8 text-xs bg-background/50 focus:bg-background transition-colors flex-1"
                        />
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3"
                            onClick={() => document.getElementById('video-upload')?.click()}
                        >
                            <Upload className="w-3.5 h-3.5" />
                        </Button>
                        <input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                    </div>
                </div>

                {/* Size */}
                <div className="grid grid-cols-2 gap-3">
                    <NumberInput
                        label="Width"
                        value={props.width || 640}
                        onChange={(v: number) => updateProperty('width', v)}
                        suffix="px"
                    />
                    <NumberInput
                        label="Height"
                        value={props.height || 360}
                        onChange={(v: number) => updateProperty('height', v)}
                        suffix="px"
                    />
                </div>

                {/* Corner Radius */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <PropertyLabel className="mb-0">Corner Radius</PropertyLabel>
                        <span className="text-[10px] text-muted-foreground font-mono">
                            {props.radius || 0}px
                        </span>
                    </div>
                    <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[props.radius || 0]}
                        onValueChange={([value]) => updateProperty('radius', value)}
                        className="py-1"
                    />
                </div>

                {/* Alpha */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <PropertyLabel className="mb-0">Alpha</PropertyLabel>
                        <span className="text-[10px] text-muted-foreground font-mono">
                            {((props.alpha || 1) * 100).toFixed(0)}%
                        </span>
                    </div>
                    <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={[props.alpha || 1]}
                        onValueChange={([value]) => updateProperty('alpha', value)}
                        className="py-1"
                    />
                </div>

                {/* Smoothing */}
                <div className="flex items-center justify-between">
                    <div>
                        <PropertyLabel className="mb-0">Smoothing</PropertyLabel>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                            Disable for pixelated effect
                        </p>
                    </div>
                    <Switch
                        checked={props.smoothing !== false}
                        onCheckedChange={(checked) => updateProperty('smoothing', checked)}
                        className="scale-90"
                    />
                </div>

                {/* Clip */}
                <div className="flex items-center justify-between">
                    <div>
                        <PropertyLabel className="mb-0">Clip to Bounds</PropertyLabel>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                            Clip content outside radius
                        </p>
                    </div>
                    <Switch
                        checked={props.clip || false}
                        onCheckedChange={(checked) => updateProperty('clip', checked)}
                        className="scale-90"
                    />
                </div>
            </div>
        </Section>
    );
}
