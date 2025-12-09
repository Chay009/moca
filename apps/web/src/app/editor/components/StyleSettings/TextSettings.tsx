/**
 * Text-Specific Settings
 * Typography controls for text components
 */

'use client';

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Type,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Section, PropertyLabel, NumberInput } from './SharedComponents'

interface TextSettingsProps {
    props: any;
    updateProperty: (key: string, value: any) => void;
}

export function TextSettings({ props, updateProperty }: TextSettingsProps) {
    return (
        <Section title="Typography" icon={Type}>
            <div className="space-y-5">

                {/* Text Content */}
                <div className="space-y-1.5">
                    <PropertyLabel>Content</PropertyLabel>
                    <textarea
                        value={props.text || ''}
                        onChange={(e) => updateProperty('text', e.target.value)}
                        className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-y text-xs font-medium transition-colors focus:bg-background"
                        placeholder="Enter text..."
                    />
                </div>

                {/* Font Family */}
                <div className="space-y-1.5">
                    <PropertyLabel>Font Family</PropertyLabel>
                    <Select
                        value={props.fontFamily || 'Inter'}
                        onValueChange={(value) => updateProperty('fontFamily', value)}
                    >
                        <SelectTrigger className="h-8 text-xs bg-background/50 focus:bg-background">
                            <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Courier New">Courier New</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                            <SelectItem value="Montserrat">Montserrat</SelectItem>
                            <SelectItem value="Poppins">Poppins</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Font Size & Weight */}
                <div className="grid grid-cols-2 gap-3">
                    <NumberInput
                        label="Size"
                        value={props.fontSize || 16}
                        onChange={(v: number) => updateProperty('fontSize', v)}
                        suffix="px"
                    />

                    <div className="space-y-1.5">
                        <PropertyLabel>Weight</PropertyLabel>
                        <Select
                            value={String(props.fontWeight || 400)}
                            onValueChange={(value) => updateProperty('fontWeight', Number(value))}
                        >
                            <SelectTrigger className="h-8 text-xs bg-background/50 focus:bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="100">Thin</SelectItem>
                                <SelectItem value="300">Light</SelectItem>
                                <SelectItem value="400">Regular</SelectItem>
                                <SelectItem value="500">Medium</SelectItem>
                                <SelectItem value="600">Semibold</SelectItem>
                                <SelectItem value="700">Bold</SelectItem>
                                <SelectItem value="900">Black</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Text Alignment */}
                <div className="space-y-1.5">
                    <PropertyLabel>Alignment</PropertyLabel>
                    <div className="flex items-center rounded-md border border-input bg-background/50 p-1 gap-1">
                        {[
                            { value: 'left', icon: AlignLeft },
                            { value: 'center', icon: AlignCenter },
                            { value: 'right', icon: AlignRight },
                            { value: 'justify', icon: AlignJustify },
                        ].map(({ value, icon: Icon }) => (
                            <Button
                                key={value}
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "flex-1 h-7 rounded-sm px-0 hover:bg-muted transition-all",
                                    props.textAlign === value && "bg-background shadow-sm text-primary hover:bg-background"
                                )}
                                onClick={() => updateProperty('textAlign', value)}
                            >
                                <Icon className="h-4 w-4" />
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Spacing Controls */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <PropertyLabel className="mb-0">Letter Spacing</PropertyLabel>
                            <span className="text-[10px] text-muted-foreground font-mono">{props.letterSpacing || 0}px</span>
                        </div>
                        <Slider
                            min={-5}
                            max={20}
                            step={0.5}
                            value={[props.letterSpacing || 0]}
                            onValueChange={([value]) => updateProperty('letterSpacing', value)}
                            className="py-1"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <PropertyLabel className="mb-0">Line Height</PropertyLabel>
                            <span className="text-[10px] text-muted-foreground font-mono">{props.lineHeight || 1.2}</span>
                        </div>
                        <Slider
                            min={0.5}
                            max={3}
                            step={0.1}
                            value={[props.lineHeight || 1.2]}
                            onValueChange={([value]) => updateProperty('lineHeight', value)}
                            className="py-1"
                        />
                    </div>
                </div>

                {/* Text Wrap */}
                <div className="flex items-center justify-between pt-1">
                    <PropertyLabel className="mb-0">Text Wrap</PropertyLabel>
                    <Switch
                        checked={props.textWrap || false}
                        onCheckedChange={(checked) => updateProperty('textWrap', checked)}
                        className="scale-90"
                    />
                </div>
            </div>
        </Section>
    );
}
