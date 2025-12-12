"use client";

import { useRecordingStore, type ElementEffect } from "../store/recordingStore";

export function Timeline() {
    const {
        recordingDuration,
        currentPlayTime,
        elementEffects,
        updateEffect,
        removeEffect,
    } = useRecordingStore();

    // Format time as mm:ss.ms
    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const millis = Math.floor((ms % 1000) / 10);
        return `${minutes}:${secs.toString().padStart(2, "0")}.${millis.toString().padStart(2, "0")}`;
    };

    // Calculate position percentage
    const getPositionPercent = (time: number) => {
        if (recordingDuration === 0) return 0;
        return (time / recordingDuration) * 100;
    };

    // Handle dragging effect on timeline
    const handleEffectDrag = (effectId: string, e: React.MouseEvent) => {
        const timeline = e.currentTarget.parentElement;
        if (!timeline) return;

        const rect = timeline.getBoundingClientRect();

        const onMouseMove = (moveEvent: MouseEvent) => {
            const x = moveEvent.clientX - rect.left;
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            const newTime = (percent / 100) * recordingDuration;
            updateEffect(effectId, { startTime: newTime });
        };

        const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    if (recordingDuration === 0) {
        return null;
    }

    return (
        <div className="bg-zinc-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Timeline</h3>
                <span className="text-sm text-zinc-400">
                    {formatTime(currentPlayTime)} / {formatTime(recordingDuration)}
                </span>
            </div>

            {/* Timeline track */}
            <div className="relative h-16 bg-zinc-800 rounded-lg overflow-hidden">
                {/* Time markers */}
                <div className="absolute inset-x-0 top-0 h-4 flex items-center border-b border-zinc-700">
                    {[0, 25, 50, 75, 100].map((percent) => (
                        <div
                            key={percent}
                            className="absolute text-xs text-zinc-500"
                            style={{ left: `${percent}%`, transform: "translateX(-50%)" }}
                        >
                            {formatTime((percent / 100) * recordingDuration)}
                        </div>
                    ))}
                </div>

                {/* Current time indicator */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
                    style={{ left: `${getPositionPercent(currentPlayTime)}%` }}
                >
                    <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
                </div>

                {/* Effect markers */}
                <div className="absolute inset-x-0 top-5 bottom-1 px-1">
                    {elementEffects.map((effect, index) => {
                        const left = getPositionPercent(effect.startTime);
                        const width = getPositionPercent(effect.duration * 1000);

                        return (
                            <div
                                key={effect.id}
                                className="absolute h-8 bg-blue-600/80 rounded cursor-move flex items-center px-2 text-xs truncate hover:bg-blue-500 transition-colors group"
                                style={{
                                    left: `${left}%`,
                                    width: `${Math.max(width, 3)}%`,
                                    top: `${(index % 2) * 36}px`,
                                }}
                                onMouseDown={(e) => handleEffectDrag(effect.id, e)}
                            >
                                <span className="truncate">
                                    {effect.elementTag} - {effect.effectType}
                                </span>
                                <button
                                    className="ml-auto opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeEffect(effect.id);
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span>Current time</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-8 h-3 bg-blue-600 rounded" />
                    <span>Effect (drag to move)</span>
                </div>
            </div>
        </div>
    );
}
