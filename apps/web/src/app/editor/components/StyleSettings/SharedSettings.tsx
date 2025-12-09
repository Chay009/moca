/**
 * Shared Settings
 * Common controls for all component types (colors, transform, effects)
 */

'use client';

import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Palette, Move } from "lucide-react"
import { PositionControl } from '@/components/PositionControl'
import { Section, PropertyLabel, NumberInput, ColorInput } from './SharedComponents'
import { FilterControls } from './FilterControls'

interface SharedSettingsProps {
    props: any;
    updateProperty: (key: string, value: any) => void;
    updateShadowOffsetX: (x: number) => void;
    updateShadowOffsetY: (y: number) => void;
}

export function SharedSettings({ props, updateProperty, updateShadowOffsetX, updateShadowOffsetY }: SharedSettingsProps) {
    return (
        <>
            {/* Colors & Effects Section */}
            <Section title="Colors & Effects" icon={Palette}>
                <div className="space-y-5">

                    {/* Fill & Stroke */}
                    <div className="space-y-4">
                        <ColorInput
                            label="Fill Color"
                            value={props.fill}
                            onChange={(v: string) => updateProperty('fill', v)}
                        />

                        <ColorInput
                            label="Stroke Color"
                            value={props.stroke}
                            onChange={(v: string) => updateProperty('stroke', v)}
                        />

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <PropertyLabel className="mb-0">Stroke Width</PropertyLabel>
                                <span className="text-[10px] text-muted-foreground font-mono">{props.lineWidth || 0}px</span>
                            </div>
                            <Slider
                                min={0}
                                max={20}
                                step={0.5}
                                value={[props.lineWidth || 0]}
                                onValueChange={([value]) => updateProperty('lineWidth', value)}
                                className="py-1"
                            />
                        </div>
                    </div>

                    <Separator className="bg-border/50" />

                    {/* Opacity */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <PropertyLabel className="mb-0">Opacity</PropertyLabel>
                            <span className="text-[10px] text-muted-foreground font-mono">{((props.opacity || 1) * 100).toFixed(0)}%</span>
                        </div>
                        <Slider
                            min={0}
                            max={1}
                            step={0.01}
                            value={[props.opacity || 1]}
                            onValueChange={([value]) => updateProperty('opacity', value)}
                            className="py-1"
                        />
                    </div>

                    <Separator className="bg-border/50" />

                    {/* Shadow */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <PropertyLabel className="mb-0">Drop Shadow</PropertyLabel>
                        </div>

                        <ColorInput
                            label="Shadow Color"
                            value={props.shadowColor}
                            onChange={(v: string) => updateProperty('shadowColor', v)}
                        />

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <PropertyLabel className="mb-0">Blur Radius</PropertyLabel>
                                <span className="text-[10px] text-muted-foreground font-mono">{props.shadowBlur || 0}px</span>
                            </div>
                            <Slider
                                min={0}
                                max={50}
                                step={1}
                                value={[props.shadowBlur || 0]}
                                onValueChange={([value]) => updateProperty('shadowBlur', value)}
                                className="py-1"
                            />
                        </div>

                        <div className="pt-2">
                            <PositionControl
                                x={props.shadowOffsetX || 0}
                                y={props.shadowOffsetY || 0}
                                onXChange={updateShadowOffsetX}
                                onYChange={updateShadowOffsetY}
                                label="Shadow Offset"
                                minX={-50}
                                maxX={50}
                                minY={-50}
                                maxY={50}
                                size="sm"
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Filters Section - Available for all components */}
            <FilterControls
                filters={props.filters || []}
                updateProperty={updateProperty}
            />

            {/* Transform Section */}
            <Section title="Transform" icon={Move}>
                <div className="space-y-5">

                    {/* Rotation & Scale */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <PropertyLabel className="mb-0">Rotation</PropertyLabel>
                                <span className="text-[10px] text-muted-foreground font-mono">{props.rotation || 0}°</span>
                            </div>
                            <Slider
                                min={0}
                                max={360}
                                step={1}
                                value={[props.rotation || 0]}
                                onValueChange={([value]) => updateProperty('rotation', value)}
                                className="py-1"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <PropertyLabel className="mb-0">Scale</PropertyLabel>
                                <span className="text-[10px] text-muted-foreground font-mono">{props.scale || 1}x</span>
                            </div>
                            <Slider
                                min={0.1}
                                max={3}
                                step={0.1}
                                value={[props.scale || 1]}
                                onValueChange={([value]) => updateProperty('scale', value)}
                                className="py-1"
                            />
                        </div>
                    </div>

                    {/* Skew */}
                    <div className="space-y-1.5">
                        <PropertyLabel>Skew</PropertyLabel>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Slider
                                    min={-45}
                                    max={45}
                                    step={1}
                                    value={[props.skewX || 0]}
                                    onValueChange={([value]) => updateProperty('skewX', value)}
                                />
                                <div className="text-[10px] text-center text-muted-foreground">X: {props.skewX || 0}°</div>
                            </div>
                            <div className="space-y-2">
                                <Slider
                                    min={-45}
                                    max={45}
                                    step={1}
                                    value={[props.skewY || 0]}
                                    onValueChange={([value]) => updateProperty('skewY', value)}
                                />
                                <div className="text-[10px] text-center text-muted-foreground">Y: {props.skewY || 0}°</div>
                            </div>
                        </div>
                    </div>

                    {/* Z-Index */}
                    <div className="space-y-1.5">
                        <NumberInput
                            label="Z-Index"
                            value={props.zIndex || 0}
                            onChange={(v: number) => updateProperty('zIndex', v)}
                        />
                    </div>
                </div>
            </Section>
        </>
    );
}
