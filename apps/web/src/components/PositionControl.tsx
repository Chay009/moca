import React, { useCallback } from 'react';
import { TwoDSlider } from './TwoDSlider';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface PositionControlProps {
    /** The current X value */
    x: number;
    /** The current Y value */
    y: number;
    /** Callback when X value changes */
    onXChange: (value: number) => void;
    /** Callback when Y value changes */
    onYChange: (value: number) => void;
    /** Label for the control (default: "Position") */
    label?: string;
    /** Minimum value for X axis (default -1920) */
    minX?: number;
    /** Maximum value for X axis (default 1920) */
    maxX?: number;
    /** Minimum value for Y axis (default -1080) */
    minY?: number;
    /** Maximum value for Y axis (default 1080) */
    maxY?: number;
    /** Label for the X axis (default: "X") */
    xLabel?: string;
    /** Label for the Y axis (default: "Y") */
    yLabel?: string;
    /** Show fine-tune inputs below slider (default: true) */
    showInputs?: boolean;
    /** Size of the slider: 'sm' | 'md' | 'lg' (default 'md') */
    size?: 'sm' | 'md' | 'lg';
    /** Optional class name for the container */
    className?: string;
    /** Optional background image URL (e.g., video thumbnail for zoom target) */
    backgroundImage?: string;
}

/**
 * PositionControl - A reusable component for controlling X/Y coordinates
 * 
 * This component combines a TwoDSlider with optional fine-tune number inputs
 * for precise control over 2D positions.
 * 
 * @example
 * ```tsx
 * <PositionControl
 *   x={element.x}
 *   y={element.y}
 *   onXChange={(x) => updateElement({ x })}
 *   onYChange={(y) => updateElement({ y })}
 *   label="Element Position"
 * />
 * ```
 */
export const PositionControl = React.memo<PositionControlProps>(({
    x,
    y,
    onXChange,
    onYChange,
    label = 'Position',
    minX = -1920,
    maxX = 1920,
    minY = -1080,
    maxY = 1080,
    xLabel = 'X',
    yLabel = 'Y',
    showInputs = true,
    size = 'md',
    className = '',
    backgroundImage,
}) => {
    // Memoize the onChange handler to prevent TwoDSlider re-renders
    const handleSliderChange = useCallback((value: { x: number; y: number }) => {
        onXChange(value.x);
        onYChange(value.y);
    }, [onXChange, onYChange]);

    // Memoize input handlers
    const handleXInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onXChange(Number(e.target.value));
    }, [onXChange]);

    const handleYInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onYChange(Number(e.target.value));
    }, [onYChange]);

    return (
        <div className={`space-y-3 ${className}`}>
            <Label className="text-xs">{label} ({xLabel}, {yLabel})</Label>

            <TwoDSlider
                value={{ x, y }}
                onChange={handleSliderChange}
                minX={minX}
                maxX={maxX}
                minY={minY}
                maxY={maxY}
                xLabel={xLabel}
                yLabel={yLabel}
                size={size}
                backgroundImage={backgroundImage}
            />

            {showInputs && (
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label htmlFor={`${label}-x-input`} className="text-[10px] text-muted-foreground">
                            {xLabel}
                        </Label>
                        <Input
                            id={`${label}-x-input`}
                            type="number"
                            value={x}
                            onChange={handleXInputChange}
                            className="h-7 text-xs"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor={`${label}-y-input`} className="text-[10px] text-muted-foreground">
                            {yLabel}
                        </Label>
                        <Input
                            id={`${label}-y-input`}
                            type="number"
                            value={y}
                            onChange={handleYInputChange}
                            className="h-7 text-xs"
                        />
                    </div>
                </div>
            )}
        </div>
    );
});

PositionControl.displayName = 'PositionControl';
