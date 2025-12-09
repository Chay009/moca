/**
 * Image-Specific Settings
 * Image source and display controls for image components
 * in future we might add pixels/unsplash assets along with url uplaod and ai generated images
 */

'use client';

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Image as ImageIcon, Crop, Upload } from "lucide-react"
import { Section, PropertyLabel, NumberInput } from './SharedComponents'
import { ImageCropper } from '@/components/image-cropper'

interface ImageSettingsProps {
    props: any;
    updateProperty: (key: string, value: any) => void;
}

export function ImageSettings({ props, updateProperty }: ImageSettingsProps) {
    const [cropperOpen, setCropperOpen] = useState(false)

    const handleCropComplete = (croppedImageBase64: string) => {
        updateProperty('src', croppedImageBase64)
    }

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
        <>
            <Section title="Image" icon={ImageIcon}>
                <div className="space-y-5">

                    {/* Image Source */}
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
                                onClick={() => document.getElementById('image-upload')?.click()}
                            >
                                <Upload className="w-3.5 h-3.5" />
                            </Button>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </div>
                    </div>

                    {/* Crop Button */}
                    {props.src && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-8"
                            onClick={() => setCropperOpen(true)}
                        >
                            <Crop className="w-3.5 h-3.5 mr-2" />
                            Crop Image
                        </Button>
                    )}

                    {/* Size */}
                    <div className="grid grid-cols-2 gap-3">
                        <NumberInput
                            label="Width"
                            value={props.width || 300}
                            onChange={(v: number) => updateProperty('width', v)}
                            suffix="px"
                        />
                        <NumberInput
                            label="Height"
                            value={props.height || 300}
                            onChange={(v: number) => updateProperty('height', v)}
                            suffix="px"
                        />
                    </div>
                    <p className="text-[10px] text-muted-foreground -mt-3">
                        Adjust size to fit your design
                    </p>

                    {/* Radius (Rounded Corners) */}
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

            {/* Image Cropper Dialog */}
            <ImageCropper
                imageSrc={props.src}
                open={cropperOpen}
                onOpenChange={setCropperOpen}
                onCropComplete={handleCropComplete}
            />
        </>
    );
}
