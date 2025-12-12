import { create } from "zustand";
import type { eventWithTime } from "rrweb";

export type RecordingState = "idle" | "recording" | "recorded" | "playing";

export type EffectType =
    | "flyIn"
    | "fadeIn"
    | "scaleIn"
    | "counter"
    | "typewriter"
    | "highlight"
    | "none";

export interface ElementEffect {
    id: string; // Unique ID for each effect
    elementSelector: string;
    elementTag: string;
    effectType: EffectType;
    startTime: number; // When to trigger (ms from recording start)
    duration: number; // in seconds
    delay: number; // additional delay after startTime (seconds)
    direction?: "left" | "right" | "top" | "bottom";
    // For counter effect
    startValue?: number;
    endValue?: number;
}

interface RecordingStore {
    // Recording state
    state: RecordingState;
    events: eventWithTime[];

    // Timeline
    recordingDuration: number; // Total duration in ms
    currentPlayTime: number; // Current playback position in ms

    // Selected element info
    selectedElementSelector: string | null;
    selectedElementTag: string | null;
    selectedElementRect: { x: number; y: number; width: number; height: number } | null;
    selectedElementText: string | null;

    // Element effects
    elementEffects: ElementEffect[];

    // Actions
    startRecording: () => void;
    stopRecording: () => void;
    addEvent: (event: eventWithTime) => void;
    setEvents: (events: eventWithTime[]) => void;
    clearRecording: () => void;
    setPlaying: (playing: boolean) => void;

    // Timeline
    setCurrentPlayTime: (time: number) => void;
    setRecordingDuration: (duration: number) => void;

    // Element selection
    selectElement: (
        selector: string | null,
        tag: string | null,
        rect: { x: number; y: number; width: number; height: number } | null,
        text: string | null
    ) => void;
    clearSelection: () => void;

    // Effects
    addEffect: (effect: Omit<ElementEffect, "id">) => void;
    updateEffect: (id: string, updates: Partial<ElementEffect>) => void;
    removeEffect: (id: string) => void;
    getEffectForElement: (selector: string) => ElementEffect | undefined;
    getEffectsAtTime: (time: number) => ElementEffect[];
}

let effectIdCounter = 0;

export const useRecordingStore = create<RecordingStore>((set, get) => ({
    // Initial state
    state: "idle",
    events: [],
    recordingDuration: 0,
    currentPlayTime: 0,

    selectedElementSelector: null,
    selectedElementTag: null,
    selectedElementRect: null,
    selectedElementText: null,

    elementEffects: [],

    // Actions
    startRecording: () =>
        set({
            state: "recording",
            events: [],
            elementEffects: [],
            recordingDuration: 0,
            currentPlayTime: 0,
        }),

    stopRecording: () =>
        set((s) => {
            // Calculate duration from events
            const duration =
                s.events.length > 0
                    ? s.events[s.events.length - 1].timestamp - s.events[0].timestamp
                    : 0;
            return {
                state: s.events.length > 0 ? "recorded" : "idle",
                recordingDuration: duration,
            };
        }),

    addEvent: (event) =>
        set((s) => ({
            events: [...s.events, event],
        })),

    setEvents: (events) =>
        set({
            events,
            state: "recorded",
            recordingDuration:
                events.length > 0
                    ? events[events.length - 1].timestamp - events[0].timestamp
                    : 0,
        }),

    clearRecording: () =>
        set({
            state: "idle",
            events: [],
            selectedElementSelector: null,
            selectedElementTag: null,
            selectedElementRect: null,
            selectedElementText: null,
            elementEffects: [],
            recordingDuration: 0,
            currentPlayTime: 0,
        }),

    setPlaying: (playing) => set({ state: playing ? "playing" : "recorded" }),

    setCurrentPlayTime: (time) => set({ currentPlayTime: time }),

    setRecordingDuration: (duration) => set({ recordingDuration: duration }),

    selectElement: (selector, tag, rect, text) =>
        set({
            selectedElementSelector: selector,
            selectedElementTag: tag,
            selectedElementRect: rect,
            selectedElementText: text,
        }),

    clearSelection: () =>
        set({
            selectedElementSelector: null,
            selectedElementTag: null,
            selectedElementRect: null,
            selectedElementText: null,
        }),

    addEffect: (effect) => {
        const id = `effect-${++effectIdCounter}`;
        set((s) => ({
            elementEffects: [...s.elementEffects, { ...effect, id }],
        }));
    },

    updateEffect: (id, updates) =>
        set((s) => ({
            elementEffects: s.elementEffects.map((e) =>
                e.id === id ? { ...e, ...updates } : e
            ),
        })),

    removeEffect: (id) =>
        set((s) => ({
            elementEffects: s.elementEffects.filter((e) => e.id !== id),
        })),

    getEffectForElement: (selector) =>
        get().elementEffects.find((e) => e.elementSelector === selector),

    getEffectsAtTime: (time) =>
        get().elementEffects.filter(
            (e) => time >= e.startTime && time <= e.startTime + e.duration * 1000
        ),
}));
