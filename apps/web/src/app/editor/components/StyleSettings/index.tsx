/**
 * StyleSettings - Router Component
 * Routes to category-specific settings based on element type
 */

'use client';

import { useCallback } from 'react';
import { TabsContent } from "@/components/ui/tabs"
import { useSceneStore } from '@/store/sceneStore'
import { isTextComponent, isImageComponent, isVideoComponent, isDeviceComponent } from '@/app/revideo/creators/components/utils'
import { TextSettings } from './TextSettings'
import { ImageSettings } from './ImageSettings'
import { VideoSettings } from './VideoSettings'
import { DeviceSettings } from './DeviceSettings'
import { SharedSettings } from './SharedSettings'

export default function StyleSettings() {
    // Store selectors
    const selectedElementId = useSceneStore((state) => state.selectedElementId);
    const currentScene = useSceneStore((state) => state.getCurrentScene());
    const updateElementInScene = useSceneStore((state) => state.updateElementInScene);

    // Get selected element
    const selectedElement = currentScene?.elements.find((el) => el.id === selectedElementId);

    // Update property callback
    const updateProperty = useCallback((key: string, value: any) => {
        if (!selectedElementId || !currentScene) return;
        updateElementInScene(currentScene.id, selectedElementId, {
            properties: { [key]: value },
        });
    }, [selectedElementId, currentScene, updateElementInScene]);

    // Memoized callbacks for PositionControl
    const updateShadowOffsetX = useCallback((x: number) => updateProperty('shadowOffsetX', x), [updateProperty]);
    const updateShadowOffsetY = useCallback((y: number) => updateProperty('shadowOffsetY', y), [updateProperty]);

    // Early returns
    if (!selectedElementId) {
        return (
            <TabsContent value="styles" className="flex-1 outline-none w-full overflow-y-auto max-h-[calc(100vh-40px)] h-full mt-0 pb-20 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                <div className="px-3 py-8 text-center text-gray-400">
                    <p className="text-sm">Select an element to edit its properties</p>
                </div>
            </TabsContent>
        );
    }

    if (!selectedElement) {
        return (
            <TabsContent value="styles" className="flex-1 outline-none w-full overflow-y-auto max-h-[calc(100vh-40px)] h-full mt-0 pb-20 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                <div className="px-3 py-8 text-center text-gray-400">
                    <p className="text-sm">Element not found</p>
                </div>
            </TabsContent>
        );
    }

    const props = selectedElement.properties;
    const isDevice = isDeviceComponent(selectedElement.type, props);

    // Debug logging
    console.log('🎨 StyleSettings - Element Type:', selectedElement.type);
    console.log('🎨 StyleSettings - Is Text?', isTextComponent(selectedElement.type));
    console.log('🎨 StyleSettings - Is Image?', isImageComponent(selectedElement.type));
    console.log('🎨 StyleSettings - Is Device?', isDevice);
    console.log('🎨 StyleSettings - Props:', props);

    return (
        <TabsContent value="styles" className="flex-1 outline-none w-full overflow-y-auto max-h-[calc(100vh-40px)] h-full mt-0 pb-20 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            <div className="flex flex-col">

                {/* Category-Specific Settings */}
                {isTextComponent(selectedElement.type) && (
                    <TextSettings props={props} updateProperty={updateProperty} />
                )}

                {isImageComponent(selectedElement.type) && (
                    <ImageSettings props={props} updateProperty={updateProperty} />
                )}

                {isVideoComponent(selectedElement.type) && (
                    <VideoSettings props={props} updateProperty={updateProperty} />
                )}

                {isDevice && (
                    <DeviceSettings props={props} updateProperty={updateProperty} />
                )}

                {/* Shared Settings (all components) */}
                <SharedSettings
                    props={props}
                    updateProperty={updateProperty}
                    updateShadowOffsetX={updateShadowOffsetX}
                    updateShadowOffsetY={updateShadowOffsetY}
                />
            </div>
        </TabsContent>
    );
}
