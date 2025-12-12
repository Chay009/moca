"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import {
    useRecordingStore,
    type EffectType,
    type ElementEffect,
} from "./store/recordingStore";
import type { eventWithTime } from "rrweb";
import { EffectOverlay } from "./components/EffectOverlay";
import { Timeline } from "./components/Timeline";

export type { EffectOverlayHandle } from "./components/EffectOverlay";

const EFFECT_OPTIONS: { value: EffectType; label: string; icon: string }[] = [
    { value: "none", label: "No Effect", icon: "⊘" },
    { value: "flyIn", label: "Fly In", icon: "↗" },
    { value: "fadeIn", label: "Fade In", icon: "◐" },
    { value: "scaleIn", label: "Scale In", icon: "⤢" },
    { value: "counter", label: "Counter", icon: "🔢" },
    { value: "typewriter", label: "Typewriter", icon: "⌨" },
    { value: "highlight", label: "Highlight", icon: "✨" },
];

export default function DomCapturePage() {
    const demoRef = useRef<HTMLDivElement>(null);
    const stopperRef = useRef<(() => void) | null>(null);
    const replayerRef = useRef<any>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const interactionIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const effectOverlayRef = useRef<any>(null);

    const {
        state,
        events,
        startRecording,
        stopRecording,
        addEvent,
        clearRecording,
        selectedElementSelector,
        selectedElementTag,
        selectedElementRect,
        selectedElementText,
        selectElement,
        clearSelection,
        elementEffects,
        addEffect,
        removeEffect,
        currentPlayTime,
        setCurrentPlayTime,
    } = useRecordingStore();

    const [counter, setCounter] = useState(0);

    // Start recording
    const handleStartRecording = useCallback(async () => {
        if (!demoRef.current) return;

        try {
            const { record } = await import("rrweb");
            startRecording();

            const stop = record({
                emit: (event: eventWithTime) => {
                    addEvent(event);
                },
                // Capture inline scripts and stylesheets for better fidelity
                inlineScripts: true,
                inlineStylesheet: true,
            });

            stopperRef.current = stop;
        } catch (error) {
            console.error("Failed to start recording:", error);
        }
    }, [startRecording, addEvent]);

    // Stop recording
    const handleStopRecording = useCallback(() => {
        if (stopperRef.current) {
            stopperRef.current();
            stopperRef.current = null;
        }
        stopRecording();
    }, [stopRecording]);

    // Initialize replayer with click handling
    useEffect(() => {
        if (state !== "recorded" && state !== "playing") return;
        if (!playerContainerRef.current || events.length === 0) return;

        const initReplayer = async () => {
            const rrwebPlayer = await import("rrweb-player");
            await import("rrweb-player/dist/style.css");

            if (replayerRef.current) {
                replayerRef.current.pause();
                replayerRef.current = null;
            }
            playerContainerRef.current!.innerHTML = "";

            const replayer = new rrwebPlayer.default({
                target: playerContainerRef.current!,
                props: {
                    events,
                    width: 800,
                    height: 500,
                    autoPlay: false,
                    showController: true,
                    skipInactive: true,
                },
            });

            replayerRef.current = replayer;

            // Force pointer events to auto to allow selection
            // rrweb-player often disables this during replay
            interactionIntervalRef.current = setInterval(() => {
                const iframe = playerContainerRef.current?.querySelector("iframe") as HTMLIFrameElement;
                if (iframe) {
                    iframe.style.pointerEvents = "auto";
                }

                // Sync current play time with the replayer
                if (replayerRef.current) {
                    try {
                        const currentTime = replayerRef.current.getReplayer().getCurrentTime();
                        setCurrentPlayTime(currentTime);
                    } catch (e) {
                        // Replayer might not be ready
                    }
                }
            }, 100);

            // Add click handler for element selection
            setTimeout(() => {
                const iframe = playerContainerRef.current?.querySelector(
                    "iframe"
                ) as HTMLIFrameElement;

                if (iframe?.contentDocument) {
                    iframe.contentDocument.addEventListener(
                        "click",
                        (e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            const target = e.target as HTMLElement;
                            if (!target) return;

                            // Generate a selector for this element
                            const selector = generateSelector(target);
                            const rect = target.getBoundingClientRect();
                            const text = target.textContent?.trim().slice(0, 50) || null;

                            selectElement(
                                selector,
                                target.tagName.toLowerCase(),
                                {
                                    x: rect.x,
                                    y: rect.y,
                                    width: rect.width,
                                    height: rect.height,
                                },
                                text
                            );
                        },
                        true // Capture phase
                    );

                    // Add hover highlight
                    iframe.contentDocument.addEventListener("mouseover", (e) => {
                        const target = e.target as HTMLElement;
                        if (target && target !== iframe.contentDocument?.body) {
                            target.style.outline = "2px solid rgba(59, 130, 246, 0.5)";
                            target.style.outlineOffset = "2px";
                            target.style.cursor = "pointer";
                        }
                    });

                    iframe.contentDocument.addEventListener("mouseout", (e) => {
                        const target = e.target as HTMLElement;
                        if (target) {
                            target.style.outline = "";
                            target.style.outlineOffset = "";
                            target.style.cursor = "";
                        }
                    });
                }
            }, 500);
        };

        initReplayer();

        return () => {
            if (replayerRef.current) {
                replayerRef.current.pause();
            }
            if (interactionIntervalRef.current) {
                clearInterval(interactionIntervalRef.current);
            }
        };
    }, [state, events, selectElement]);

    useEffect(() => {
        return () => {
            if (stopperRef.current) stopperRef.current();
        };
    }, []);

    // Add effect to selected element at current play time
    const handleAddEffect = useCallback(
        (effectType: EffectType) => {
            if (!selectedElementSelector || !selectedElementTag) return;

            if (effectType === "none") {
                // Find and remove effect by selector (need to find ID)
                const existing = elementEffects.find(
                    (e) => e.elementSelector === selectedElementSelector
                );
                if (existing) removeEffect(existing.id);
            } else {
                addEffect({
                    elementSelector: selectedElementSelector,
                    elementTag: selectedElementTag,
                    effectType,
                    startTime: currentPlayTime, // Use current play position
                    duration: 0.5,
                    delay: 0,
                    direction: "left",
                });
            }
        },
        [selectedElementSelector, selectedElementTag, addEffect, removeEffect, elementEffects, currentPlayTime]
    );

    const isRecording = state === "recording";
    const isEditMode = state === "recorded" || state === "playing";

    // Get current effect for selected element
    const currentEffect = selectedElementSelector
        ? elementEffects.find((e) => e.elementSelector === selectedElementSelector)
        : null;

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center gap-4 p-4 bg-zinc-900 border-b border-zinc-800">
                <h1 className="text-xl font-semibold">DOM Capture</h1>
                <div className="flex-1" />

                {!isEditMode && (
                    <>
                        {!isRecording ? (
                            <button
                                onClick={handleStartRecording}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <span className="w-3 h-3 rounded-full bg-white" />
                                Start Recording
                            </button>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 text-red-400">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    Recording...
                                </div>
                                <button
                                    onClick={handleStopRecording}
                                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-medium transition-colors"
                                >
                                    Stop & Edit
                                </button>
                            </>
                        )}
                    </>
                )}

                {isEditMode && (
                    <>
                        <span className="text-sm text-zinc-400">
                            {events.length} events • {elementEffects.length} effects
                        </span>
                        {elementEffects.length > 0 && (
                            <button
                                onClick={() => effectOverlayRef.current?.triggerEffects()}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                ▶ Preview Effects
                            </button>
                        )}
                        <button
                            onClick={clearRecording}
                            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-medium transition-colors"
                        >
                            New Recording
                        </button>
                    </>
                )}
            </header>

            {/* Main */}
            <main className="p-6">
                {/* Recording Mode */}
                {!isEditMode && (
                    <div
                        ref={demoRef}
                        className="max-w-4xl mx-auto"
                        style={{ outline: isRecording ? "3px solid #ef4444" : "none", borderRadius: "12px" }}
                    >
                        <DemoContent counter={counter} setCounter={setCounter} />
                    </div>
                )}

                {/* Edit Mode */}
                {isEditMode && (
                    <div className="flex gap-6 max-w-7xl mx-auto">
                        {/* Player */}
                        <div className="flex-1 space-y-4">
                            <div className="bg-zinc-900 rounded-xl overflow-hidden relative">
                                <div className="p-3 border-b border-zinc-800 text-sm text-zinc-400">
                                    Click on elements to select them
                                </div>
                                <div
                                    ref={playerContainerRef}
                                    className="cursor-crosshair relative"
                                    style={{ minHeight: "500px" }}
                                >
                                    <EffectOverlay ref={effectOverlayRef} />
                                </div>
                            </div>

                            {/* Timeline */}
                            <Timeline />
                        </div>

                        {/* Sidebar */}
                        <aside className="w-96 space-y-4">
                            {/* Selected Element */}
                            <div className="bg-zinc-900 rounded-xl p-4">
                                <h3 className="font-semibold mb-3">Selected Element</h3>

                                {selectedElementSelector ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <code className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                                                {selectedElementTag}
                                            </code>
                                            <button
                                                onClick={clearSelection}
                                                className="ml-auto text-zinc-500 hover:text-white text-sm"
                                            >
                                                Clear
                                            </button>
                                        </div>

                                        {selectedElementText && (
                                            <div className="text-sm text-zinc-400 truncate">
                                                "{selectedElementText}"
                                            </div>
                                        )}

                                        {selectedElementRect && (
                                            <div className="text-xs text-zinc-500">
                                                Size: {Math.round(selectedElementRect.width)} ×{" "}
                                                {Math.round(selectedElementRect.height)}
                                            </div>
                                        )}

                                        <div className="text-xs text-zinc-600 font-mono break-all">
                                            {selectedElementSelector}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-zinc-500">
                                        Click an element in the player to select it
                                    </p>
                                )}
                            </div>

                            {/* Effects Panel */}
                            <div className="bg-zinc-900 rounded-xl p-4">
                                <h3 className="font-semibold mb-3">Animation Effect</h3>

                                {selectedElementSelector ? (
                                    <div className="space-y-4">
                                        {/* Effect Type Selector */}
                                        <div className="grid grid-cols-2 gap-2">
                                            {EFFECT_OPTIONS.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handleAddEffect(option.value)}
                                                    className={`p-3 rounded-lg text-left transition-colors ${currentEffect?.effectType === option.value ||
                                                        (!currentEffect && option.value === "none")
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                                                        }`}
                                                >
                                                    <div className="text-lg mb-1">{option.icon}</div>
                                                    <div className="text-sm font-medium">{option.label}</div>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Effect Settings */}
                                        {currentEffect && currentEffect.effectType !== "none" && (
                                            <EffectSettings effect={currentEffect} />
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-zinc-500">
                                        Select an element first
                                    </p>
                                )}
                            </div>

                            {/* Effects List */}
                            <div className="bg-zinc-900 rounded-xl p-4">
                                <h3 className="font-semibold mb-3">
                                    Applied Effects ({elementEffects.length})
                                </h3>

                                {elementEffects.length > 0 ? (
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {elementEffects.map((effect, i) => (
                                            <div
                                                key={effect.elementSelector}
                                                className="flex items-center gap-2 p-2 bg-zinc-800 rounded-lg text-sm"
                                            >
                                                <span className="text-lg">
                                                    {EFFECT_OPTIONS.find((o) => o.value === effect.effectType)?.icon}
                                                </span>
                                                <code className="text-blue-400">{effect.elementTag}</code>
                                                <span className="text-zinc-500">→</span>
                                                <span className="capitalize">{effect.effectType}</span>
                                                <button
                                                    onClick={() => removeEffect(effect.elementSelector)}
                                                    className="ml-auto text-zinc-500 hover:text-red-400"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-zinc-500">No effects added yet</p>
                                )}
                            </div>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
}

// Effect settings component
function EffectSettings({ effect }: { effect: ElementEffect }) {
    const { updateEffect } = useRecordingStore();

    return (
        <div className="space-y-3 pt-3 border-t border-zinc-700">
            {/* Duration */}
            <div>
                <label className="text-xs text-zinc-400 block mb-1">Duration (s)</label>
                <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={effect.duration}
                    onChange={(e) =>
                        updateEffect(effect.elementSelector, { duration: parseFloat(e.target.value) })
                    }
                    className="w-full"
                />
                <div className="text-xs text-zinc-500 text-right">{effect.duration}s</div>
            </div>

            {/* Delay */}
            <div>
                <label className="text-xs text-zinc-400 block mb-1">Delay (s)</label>
                <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={effect.delay}
                    onChange={(e) =>
                        updateEffect(effect.elementSelector, { delay: parseFloat(e.target.value) })
                    }
                    className="w-full"
                />
                <div className="text-xs text-zinc-500 text-right">{effect.delay}s</div>
            </div>

            {/* Direction (for flyIn) */}
            {effect.effectType === "flyIn" && (
                <div>
                    <label className="text-xs text-zinc-400 block mb-1">Direction</label>
                    <div className="grid grid-cols-4 gap-1">
                        {(["left", "right", "top", "bottom"] as const).map((dir) => (
                            <button
                                key={dir}
                                onClick={() => updateEffect(effect.elementSelector, { direction: dir })}
                                className={`px-2 py-1 rounded text-xs ${effect.direction === dir
                                    ? "bg-blue-600 text-white"
                                    : "bg-zinc-800 hover:bg-zinc-700"
                                    }`}
                            >
                                {dir}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Counter values */}
            {effect.effectType === "counter" && (
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-zinc-400 block mb-1">Start</label>
                        <input
                            type="number"
                            value={effect.startValue ?? 0}
                            onChange={(e) =>
                                updateEffect(effect.elementSelector, { startValue: parseInt(e.target.value) })
                            }
                            className="w-full px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-400 block mb-1">End</label>
                        <input
                            type="number"
                            value={effect.endValue ?? 100}
                            onChange={(e) =>
                                updateEffect(effect.elementSelector, { endValue: parseInt(e.target.value) })
                            }
                            className="w-full px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// Generate CSS selector for element
function generateSelector(element: HTMLElement): string {
    if (element.id) {
        return `#${element.id}`;
    }

    const path: string[] = [];
    let current: HTMLElement | null = element;

    while (current && current !== document.body && path.length < 4) {
        let selector = current.tagName.toLowerCase();

        if (current.className && typeof current.className === "string") {
            const classes = current.className.split(" ").filter(Boolean).slice(0, 2);
            if (classes.length) {
                selector += "." + classes.join(".");
            }
        }

        const parent = current.parentElement;
        if (parent) {
            const siblings = Array.from(parent.children).filter(
                (c) => c.tagName === current!.tagName
            );
            if (siblings.length > 1) {
                const index = siblings.indexOf(current) + 1;
                selector += `:nth-of-type(${index})`;
            }
        }

        path.unshift(selector);
        current = current.parentElement;
    }

    return path.join(" > ");
}

// Demo content
function DemoContent({
    counter,
    setCounter,
}: {
    counter: number;
    setCounter: (n: number | ((n: number) => number)) => void;
}) {
    return (
        <div className="space-y-6 p-6 bg-zinc-900 rounded-xl">
            {/* Hero */}
            <section className="text-center py-10 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl">
                <h1 className="text-4xl font-bold mb-4">Welcome to Our Product</h1>
                <p className="text-lg text-zinc-300 mb-6">The best solution for your needs</p>
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
                    Get Started
                </button>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-3 gap-4">
                <div className="p-5 bg-zinc-800 rounded-xl text-center">
                    <div className="text-3xl font-bold text-blue-400">1,234</div>
                    <div className="text-zinc-400 text-sm">Users</div>
                </div>
                <div className="p-5 bg-zinc-800 rounded-xl text-center">
                    <div className="text-3xl font-bold text-purple-400">567</div>
                    <div className="text-zinc-400 text-sm">Projects</div>
                </div>
                <div className="p-5 bg-zinc-800 rounded-xl text-center">
                    <div className="text-3xl font-bold text-green-400">89%</div>
                    <div className="text-zinc-400 text-sm">Satisfaction</div>
                </div>
            </section>

            {/* Counter */}
            <section className="p-5 bg-zinc-800 rounded-xl">
                <h2 className="text-lg font-semibold mb-4">Interactive Counter</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setCounter((c) => c - 1)}
                        className="w-10 h-10 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-xl font-bold"
                    >
                        -
                    </button>
                    <div className="text-3xl font-bold w-16 text-center">{counter}</div>
                    <button
                        onClick={() => setCounter((c) => c + 1)}
                        className="w-10 h-10 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-xl font-bold"
                    >
                        +
                    </button>
                </div>
            </section>

            {/* Form */}
            <section className="p-5 bg-zinc-800 rounded-xl">
                <h2 className="text-lg font-semibold mb-4">Contact Form</h2>
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Your name"
                        className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                        type="email"
                        placeholder="Your email"
                        className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
                        Submit
                    </button>
                </div>
            </section>
        </div>
    );
}
