import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { useRecordingStore, type ElementEffect } from "../store/recordingStore";

export interface EffectOverlayHandle {
    triggerEffects: () => void;
    resetEffects: () => void;
}

// Track which effects have been triggered during this playback session
const triggeredEffects = new Set<string>();
let lastPlayTime = 0;

export const EffectOverlay = forwardRef<EffectOverlayHandle>((props, ref) => {
    const { elementEffects, currentPlayTime, state } = useRecordingStore();

    // Reset triggered effects when playback rewinds or effects change
    useEffect(() => {
        // If we've rewound (time went backwards), reset triggered effects
        if (currentPlayTime < lastPlayTime - 100) {
            triggeredEffects.clear();
            resetAllElements();
        }
        lastPlayTime = currentPlayTime;
    }, [currentPlayTime]);

    // Reset when effects list changes
    useEffect(() => {
        triggeredEffects.clear();
        resetAllElements();
    }, [elementEffects.length]);

    // Monitor play time and trigger effects at their start times
    useEffect(() => {
        // Only run in edit mode (recorded or playing)
        if (state !== "recorded" && state !== "playing") return;

        const iframe = document.querySelector(".rr-player iframe") as HTMLIFrameElement;
        if (!iframe?.contentDocument) return;

        // Check for effects that should trigger at current time
        elementEffects.forEach((effect) => {
            const effectEndTime = effect.startTime + effect.duration * 1000;

            // If current time is within the effect's active window and hasn't been triggered
            if (
                currentPlayTime >= effect.startTime &&
                currentPlayTime <= effectEndTime &&
                !triggeredEffects.has(effect.id)
            ) {
                try {
                    const element = iframe.contentDocument!.querySelector(
                        effect.elementSelector
                    ) as HTMLElement;
                    if (element) {
                        // Reset first, then apply
                        resetElement(element, effect);
                        setTimeout(() => {
                            applyEffect(element, effect);
                        }, 50);
                        triggeredEffects.add(effect.id);
                    }
                } catch (error) {
                    console.warn("Failed to apply effect:", error);
                }
            }

            // If we're before this effect's start time, make sure element is in reset state
            if (currentPlayTime < effect.startTime && triggeredEffects.has(effect.id)) {
                triggeredEffects.delete(effect.id);
                try {
                    const element = iframe.contentDocument!.querySelector(
                        effect.elementSelector
                    ) as HTMLElement;
                    if (element) {
                        resetElement(element, effect);
                    }
                } catch (error) {
                    console.warn("Failed to reset element:", error);
                }
            }
        });
    }, [currentPlayTime, elementEffects, state]);

    const resetAllElements = () => {
        const iframe = document.querySelector(".rr-player iframe") as HTMLIFrameElement;
        if (!iframe?.contentDocument) return;

        elementEffects.forEach((effect) => {
            try {
                const element = iframe.contentDocument!.querySelector(
                    effect.elementSelector
                ) as HTMLElement;
                if (element) {
                    resetElement(element, effect);
                }
            } catch (error) {
                console.warn("Failed to reset element:", error);
            }
        });
    };

    const triggerAllEffects = () => {
        const iframe = document.querySelector(".rr-player iframe") as HTMLIFrameElement;
        if (!iframe?.contentDocument) return;

        triggeredEffects.clear();
        resetAllElements();

        setTimeout(() => {
            elementEffects.forEach((effect) => {
                try {
                    const element = iframe.contentDocument!.querySelector(
                        effect.elementSelector
                    ) as HTMLElement;
                    if (element) {
                        applyEffect(element, effect);
                        triggeredEffects.add(effect.id);
                    }
                } catch (error) {
                    console.warn("Failed to apply effect:", error);
                }
            });
        }, 100);
    };

    useImperativeHandle(ref, () => ({
        triggerEffects: triggerAllEffects,
        resetEffects: resetAllElements,
    }));

    return null;
});

EffectOverlay.displayName = "EffectOverlay";

function resetElement(element: HTMLElement, effect: ElementEffect) {
    element.style.animation = "";
    element.style.transition = "";
    element.style.transform = "";
    element.style.boxShadow = "";
    element.style.opacity = "";

    switch (effect.effectType) {
        case "flyIn": {
            const direction = effect.direction || "left";
            const transforms = {
                left: "translateX(-100%)",
                right: "translateX(100%)",
                top: "translateY(-100%)",
                bottom: "translateY(100%)",
            };
            element.style.transform = transforms[direction];
            element.style.opacity = "0";
            break;
        }

        case "fadeIn": {
            element.style.opacity = "0";
            break;
        }

        case "scaleIn": {
            element.style.transform = "scale(0)";
            element.style.opacity = "0";
            break;
        }

        case "counter": {
            const start = effect.startValue ?? 0;
            element.textContent = start.toLocaleString();
            break;
        }

        case "typewriter": {
            if (!element.dataset.originalText) {
                element.dataset.originalText = element.textContent || "";
            }
            element.textContent = "";
            break;
        }

        case "highlight": {
            element.style.boxShadow = "none";
            break;
        }
    }
}

function applyEffect(element: HTMLElement, effect: ElementEffect) {
    const duration = effect.duration;
    const delay = effect.delay;

    switch (effect.effectType) {
        case "flyIn": {
            setTimeout(() => {
                element.style.transition = `transform ${duration}s ease-out, opacity ${duration}s ease-out`;
                element.style.transform = "translateX(0) translateY(0)";
                element.style.opacity = "1";
            }, delay * 1000);
            break;
        }

        case "fadeIn": {
            setTimeout(() => {
                element.style.transition = `opacity ${duration}s ease-out`;
                element.style.opacity = "1";
            }, delay * 1000);
            break;
        }

        case "scaleIn": {
            setTimeout(() => {
                element.style.transition = `transform ${duration}s ease-out, opacity ${duration}s ease-out`;
                element.style.transform = "scale(1)";
                element.style.opacity = "1";
            }, delay * 1000);
            break;
        }

        case "highlight": {
            setTimeout(() => {
                element.style.transition = `box-shadow ${duration}s ease-in-out`;
                element.style.boxShadow = "0 0 20px 5px rgba(59, 130, 246, 0.8)";

                setTimeout(() => {
                    element.style.boxShadow = "none";
                }, duration * 1000);
            }, delay * 1000);
            break;
        }

        case "counter": {
            const start = effect.startValue ?? 0;
            const end = effect.endValue ?? 100;
            animateCounter(element, start, end, duration * 1000, delay * 1000);
            break;
        }

        case "typewriter": {
            const text = element.dataset.originalText || element.textContent || "";
            element.textContent = "";

            setTimeout(() => {
                typewriterEffect(element, text, duration * 1000);
            }, delay * 1000);
            break;
        }
    }
}

function animateCounter(
    element: HTMLElement,
    start: number,
    end: number,
    duration: number,
    delay: number
) {
    setTimeout(() => {
        const startTime = Date.now();
        const range = end - start;

        const update = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + range * eased);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        update();
    }, delay);
}

function typewriterEffect(element: HTMLElement, text: string, duration: number) {
    const chars = text.split("");
    const delay = duration / chars.length;
    let index = 0;

    const type = () => {
        if (index < chars.length) {
            element.textContent += chars[index];
            index++;
            setTimeout(type, delay);
        }
    };

    type();
}
