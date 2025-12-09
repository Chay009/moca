/**
 * Shared UI Components for StyleSettings
 * Reusable components used across all category-specific settings
 */

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export const Section = ({ title, icon: Icon, children, className }: {
    title: string;
    icon: any;
    children: React.ReactNode;
    className?: string
}) => (
    <div className={cn("px-4 py-6 border-b border-border/50 last:border-0", className)}>
        <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                <Icon className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/90">{title}</h3>
        </div>
        {children}
    </div>
);

export const PropertyLabel = ({ children, className }: {
    children: React.ReactNode;
    className?: string
}) => (
    <Label className={cn("text-[10px] uppercase font-bold text-muted-foreground mb-1.5 block tracking-wide", className)}>
        {children}
    </Label>
);

export const NumberInput = ({ value, onChange, label, suffix, min, max, step }: any) => (
    <div className="space-y-1.5">
        {label && <PropertyLabel>{label}</PropertyLabel>}
        <div className="relative group">
            <Input
                type="number"
                value={value ?? ''}
                onChange={(e) => onChange(Number(e.target.value))}
                className="h-8 text-xs pr-8 bg-background/50 focus:bg-background transition-colors"
                min={min}
                max={max}
                step={step}
            />
            {suffix && (
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium select-none">
                    {suffix}
                </span>
            )}
        </div>
    </div>
);

export const ColorInput = ({ value, onChange, label }: any) => (
    <div className="space-y-1.5">
        {label && <PropertyLabel>{label}</PropertyLabel>}
        <div className="flex gap-2">
            <div className="relative h-8 w-10 rounded-md border border-input overflow-hidden shrink-0 shadow-sm transition-shadow hover:shadow-md">
                <input
                    type="color"
                    value={value || '#000000'}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 h-[150%] w-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0 opacity-0"
                />
                <div
                    className="h-full w-full"
                    style={{ backgroundColor: value || '#000000' }}
                />
            </div>
            <Input
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#000000"
                className="h-8 text-xs font-mono flex-1 uppercase"
            />
        </div>
    </div>
);
