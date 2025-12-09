import React, { useRef, useState, useCallback, useMemo } from 'react';
import { useDrag } from '@use-gesture/react';

interface TwoDSliderProps {
    /** The current value {x, y} */
    value: Point;
    /** Callback when value changes */
    onChange: (value: Point) => void;
    /** Minimum value for X axis (default -1) */
    minX?: number;
    /** Maximum value for X axis (default 1) */
    maxX?: number;
    /** Minimum value for Y axis (default -1) */
    minY?: number;
    /** Maximum value for Y axis (default 1) */
    maxY?: number;
    /** Label for the X axis */
    xLabel?: string;
    /** Label for the Y axis */
    yLabel?: string;
    /** Size of the slider: 'sm' | 'md' | 'lg' (default 'md') */
    size?: 'sm' | 'md' | 'lg';
    /** Optional class name for the container */
    className?: string;
    /** Optional background image URL (e.g., video thumbnail) */
    backgroundImage?: string;
}
interface Point {
    x: number;
    y: number;
}
export const TwoDSlider = React.memo<TwoDSliderProps>(({
    value,
    onChange,
    minX = -1,
    maxX = 1,
    minY = -1,
    maxY = 1,
    xLabel = 'X',
    yLabel = 'Y',
    size = 'md',
    className = '',
    backgroundImage,
}) => {


    const containerRef = useRef<HTMLDivElement>(null);
    const [focused, setFocused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Helper: Normalize value to percentage (0-1) for CSS positioning
    const getPercentage = useCallback((val: number, min: number, max: number) => {
        return Math.max(0, Math.min(1, (val - min) / (max - min)));
    }, []);

    const bind = useDrag(({ active, xy: [clientX, clientY], event }) => {
        if (!containerRef.current) return;

        setIsDragging(active);

        // Prevent default touch behaviors (scrolling) while dragging
        if (active && event.cancelable) event.preventDefault();
        if (!focused) setFocused(true);

        const rect = containerRef.current.getBoundingClientRect();

        // Calculate relative position (0 to 1)
        const rawX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const rawY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

        // Map to coordinate space
        const newX = minX + rawX * (maxX - minX);
        const newY = maxY - rawY * (maxY - minY); // Inverted Y: Bottom is Min, Top is Max

        onChange({ x: newX, y: newY });
    }, {
        eventOptions: { passive: false },
        filterTaps: true,
    });

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const stepX = (maxX - minX) / 20;
        const stepY = (maxY - minY) / 20;
        let { x, y } = value;

        switch (e.key) {
            case 'ArrowUp': y = Math.min(maxY, y + stepY); break;
            case 'ArrowDown': y = Math.max(minY, y - stepY); break;
            case 'ArrowRight': x = Math.min(maxX, x + stepX); break;
            case 'ArrowLeft': x = Math.max(minX, x - stepX); break;
            default: return;
        }

        e.preventDefault();
        onChange({ x, y });
    };

    // Position calculation - memoized to avoid recalculation on every render
    const leftPercent = useMemo(() => getPercentage(value.x, minX, maxX) * 100, [value.x, minX, maxX, getPercentage]);
    const topPercent = useMemo(() => (1 - getPercentage(value.y, minY, maxY)) * 100, [value.y, minY, maxY, getPercentage]);

    // Grid Origin calculation - memoized
    const zeroX = useMemo(() => getPercentage(0, minX, maxX) * 100, [minX, maxX, getPercentage]);
    const zeroY = useMemo(() => (1 - getPercentage(0, minY, maxY)) * 100, [minY, maxY, getPercentage]);

    // Height based on size
    const heightClass = size === 'sm' ? 'h-32' : size === 'lg' ? 'h-64' : 'h-48';

    return (
        <div
            className={`relative select-none touch-none group ${className}`}
            aria-label="2D Parameter Slider"
        >
            <div
                ref={containerRef}
                {...bind()}
                className={`
          relative w-full ${heightClass} bg-white/50 rounded-xl border border-zinc-200 overflow-hidden
          cursor-crosshair transition-all duration-300 ease-out outline-none
          ${focused ? 'ring-2 ring-indigo-500/20 border-indigo-500/50 shadow-sm' : 'hover:border-zinc-300'}
        `}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            >
                {/* Background Image (e.g., video thumbnail) */}
                {backgroundImage && (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-90 pointer-events-none"
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                    />
                )}

                {/* Technical Grid Pattern - hidden when background image is present */}
                {/* Large Grid */}
                {!backgroundImage && (
                    <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}
                    />
                )}
                {/* Fine Grid */}
                {!backgroundImage && (
                    <div
                        className="absolute inset-0 opacity-[0.02] pointer-events-none"
                        style={{
                            backgroundImage: `linear-gradient(#000 0.5px, transparent 0.5px), linear-gradient(90deg, #000 0.5px, transparent 0.5px)`,
                            backgroundSize: '10px 10px'
                        }}
                    />
                )}

                {/* Zero/Origin Axes */}
                <div className="absolute left-0 right-0 h-px bg-zinc-300 pointer-events-none" style={{ top: `${zeroY}%` }} />
                <div className="absolute top-0 bottom-0 w-px bg-zinc-300 pointer-events-none" style={{ left: `${zeroX}%` }} />

                {/* Dynamic Crosshair Guide Lines */}
                <div className={`transition-opacity duration-300 ${isDragging || focused ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`}>
                    {/* Horizontal Guide */}
                    <div
                        className="absolute h-px w-full border-t border-indigo-500/50 border-dashed pointer-events-none"
                        style={{ top: `${topPercent}%` }}
                    />
                    {/* Vertical Guide */}
                    <div
                        className="absolute w-px h-full border-l border-indigo-500/50 border-dashed pointer-events-none"
                        style={{ left: `${leftPercent}%` }}
                    />
                </div>

                {/* Labels positioned at edges */}
                <div className="absolute top-2 right-3 text-[10px] font-bold tracking-widest text-zinc-400 pointer-events-none uppercase">
                    {xLabel}
                </div>
                <div className="absolute bottom-3 left-2 text-[10px] font-bold tracking-widest text-zinc-400 pointer-events-none uppercase"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                    {yLabel}
                </div>

                {/* The Unique Selector Handle */}
                <div
                    className="absolute w-0 h-0 pointer-events-none z-10"
                    style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                >
                    {/* Pulsing effect when dragging */}
                    <div className={`
             absolute -inset-4 rounded-full bg-indigo-500/30 animate-ping
             ${isDragging ? 'opacity-100' : 'opacity-0'}
           `} />

                    {/* The actual visual handle */}
                    <div className={`
             absolute -ml-3 -mt-3 w-6 h-6 rounded-full border-2 
             flex items-center justify-center shadow-lg transition-all duration-200
             ${isDragging
                            ? 'border-indigo-600 bg-indigo-50 scale-110'
                            : 'border-zinc-800 bg-white scale-100'}
           `}>
                        {/* Internal crosshairs */}
                        <div className={`absolute w-full h-px ${isDragging ? 'bg-indigo-300' : 'bg-zinc-200'}`} />
                        <div className={`absolute h-full w-px ${isDragging ? 'bg-indigo-300' : 'bg-zinc-200'}`} />

                        {/* Center Dot */}
                        <div className={`
                w-1.5 h-1.5 rounded-full z-10 transition-colors duration-200
                ${isDragging ? 'bg-indigo-600' : 'bg-zinc-800'}
             `} />
                    </div>

                    {/* Value Tooltip (only visible on drag) */}
                    <div className={`
                absolute left-4 top-4 bg-zinc-900 text-white text-[10px] font-mono 
                px-2 py-1 rounded opacity-0 transition-opacity duration-200 whitespace-nowrap pointer-events-none
                ${isDragging ? 'opacity-100' : 'opacity-0'}
           `}>
                        {value.x.toFixed(2)}, {value.y.toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    );
});

TwoDSlider.displayName = 'TwoDSlider';