/**
 * Filter Controls Component
 * Provides UI controls for applying filters/effects to images
 * Supports: blur, brightness, contrast, grayscale, hue, invert, saturate, sepia
 * 
 * Filters format: [{ blur: 5 }, { brightness: 1.2 }]
 */

'use client';

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { X } from "lucide-react"
import { Section, PropertyLabel } from './SharedComponents'
import { Sparkles } from 'lucide-react'

type FilterName = 'blur' | 'brightness' | 'contrast' | 'grayscale' | 'hue' | 'invert' | 'saturate' | 'sepia';
type FilterObject = Record<string, number>;

interface FilterControlsProps {
    filters: FilterObject[];
    updateProperty: (key: string, value: any) => void;
}

const FILTER_CONFIGS: Record<FilterName, { label: string; min: number; max: number; step: number; suffix: string; default: number }> = {
    blur: { label: 'Blur', min: 0, max: 50, step: 1, suffix: 'px', default: 5 },
    brightness: { label: 'Brightness', min: 0, max: 2, step: 0.1, suffix: 'x', default: 1 },
    contrast: { label: 'Contrast', min: 0, max: 3, step: 0.1, suffix: 'x', default: 1 },
    grayscale: { label: 'Grayscale', min: 0, max: 1, step: 0.01, suffix: '', default: 1 },
    hue: { label: 'Hue Rotate', min: 0, max: 360, step: 1, suffix: '°', default: 180 },
    invert: { label: 'Invert', min: 0, max: 1, step: 0.01, suffix: '', default: 1 },
    saturate: { label: 'Saturation', min: 0, max: 3, step: 0.1, suffix: 'x', default: 1.5 },
    sepia: { label: 'Sepia', min: 0, max: 1, step: 0.01, suffix: '', default: 1 },
};

const AVAILABLE_FILTERS: FilterName[] = ['blur', 'brightness', 'contrast', 'grayscale', 'hue', 'invert', 'saturate', 'sepia'];

export function FilterControls({ filters = [], updateProperty }: FilterControlsProps) {

    const addFilter = (filterName: FilterName) => {
        const config = FILTER_CONFIGS[filterName];
        const newFilter = { [filterName]: config.default };
        const newFilters = [...(filters || []), newFilter];

        console.log('🎨 Adding filter:', filterName, 'config:', config);
        console.log('🎨 New filter object:', newFilter);
        console.log('🎨 All filters:', newFilters);

        updateProperty('filters', newFilters);
    };

    const removeFilter = (index: number) => {
        const newFilters = filters.filter((_, i) => i !== index);
        updateProperty('filters', newFilters);
    };

    const updateFilter = (index: number, filterName: string, value: number) => {
        const newFilters = [...filters];
        newFilters[index] = { [filterName]: value };
        updateProperty('filters', newFilters);
    };

    // Get applied filter names
    const appliedFilterNames = new Set(
        filters.flatMap(filter => Object.keys(filter))
    );
    const availableToAdd = AVAILABLE_FILTERS.filter(name => !appliedFilterNames.has(name));

    return (
        <Section title="Image Filters" icon={Sparkles}>
            <div className="space-y-5">
                {/* Applied Filters */}
                {(filters || []).length > 0 && (
                    <div className="space-y-4">
                        <div className="text-[10px] font-bold text-foreground/70 uppercase tracking-wide">Active Filters</div>
                        {filters.map((filter, index) => {
                            const filterName = Object.keys(filter)[0] as FilterName;
                            const filterValue = filter[filterName];
                            const config = FILTER_CONFIGS[filterName];

                            if (!config) return null;

                            return (
                                <div key={`${filterName}-${index}`} className="space-y-3 p-3 bg-background/30 rounded-lg border border-border/50">
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <PropertyLabel className="mb-0">{config.label}</PropertyLabel>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-muted-foreground font-mono min-w-[40px] text-right">
                                                {filterValue.toFixed(config.step >= 1 ? 0 : 2)}{config.suffix}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeFilter(index)}
                                                className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <Slider
                                        min={config.min}
                                        max={config.max}
                                        step={config.step}
                                        value={[filterValue]}
                                        onValueChange={([value]) => updateFilter(index, filterName, value)}
                                        className="py-1"
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Add Filter Buttons */}
                {availableToAdd.length > 0 && (
                    <div className="space-y-2">
                        <div className="text-[10px] font-bold text-foreground/70 uppercase tracking-wide">
                            {filters?.length > 0 ? 'Add More Filters' : 'Add Filter'}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {availableToAdd.map((filterName) => (
                                <Button
                                    key={filterName}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addFilter(filterName)}
                                    className="text-[11px] h-7 capitalize hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    + {FILTER_CONFIGS[filterName].label}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {(filters || []).length === 0 && (
                    <div className="text-center py-4">
                        <p className="text-[10px] text-muted-foreground mb-4">No filters applied</p>
                        <div className="grid grid-cols-2 gap-2">
                            {availableToAdd.slice(0, 4).map((filterName) => (
                                <Button
                                    key={filterName}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addFilter(filterName)}
                                    className="text-[11px] h-7 capitalize hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    {FILTER_CONFIGS[filterName].label}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Section>
    );
}
