'use client';

/**
 * Left Sidebar - Text Effects Controls
 * Allows users to select and apply text effects to selected text elements
 * Now with tabs for Single-node effects, Multi-character effects, and Font combinations
 */

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Sparkles, Layers, Type, Wand2 } from "lucide-react";
import { useSceneStore } from "@/store/sceneStore";
import { isTextComponent } from "@/app/revideo/creators/components/utils";

export default function LeftSidebar() {
  const selectedElementId = useSceneStore((state) => state.selectedElementId);
  const currentScene = useSceneStore((state) => state.getCurrentScene());
  const updateElementInScene = useSceneStore((state) => state.updateElementInScene);

  const selectedElement = currentScene?.elements.find((el) => el.id === selectedElementId);

  if (!selectedElement || !currentScene) {
    return (
      <div className="h-screen w-64 border-r border-gray-200 flex flex-col bg-white p-4">
        <div className="text-center text-gray-400 mt-8">
          <Sparkles className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Select an element to edit</p>
        </div>
      </div>
    );
  }

  const textEffect = (selectedElement.properties?.animation as any)?.textEffect || { type: 'none', duration: 2, intensity: 1, stagger: 0.05 };
  const currentAnimation = selectedElement.properties?.animation || {};

  const updateTextEffect = (key: string, value: any) => {
    console.log('🎬 Updating textEffect:', key, value);
    if (!selectedElementId) return;
    updateElementInScene(currentScene.id, selectedElementId, {
      properties: {
        animation: {
          ...currentAnimation,
          textEffect: {
            ...textEffect,
            [key]: value,
          },
        } as any,
      },
    });
  };

  return (
    <div className="h-screen w-64 border-r border-gray-200 flex flex-col bg-white">
      <Tabs defaultValue="scenes" className="flex flex-col w-full h-full">
        <div className="px-2 pt-2 pb-0 bg-gray-50/50 backdrop-blur-md z-50 w-full border-b">
          <TabsList className="bg-gray-200/40 items-center justify-center p-1 grid grid-cols-2 rounded-xl border border-gray-200 w-full">
            <TabsTrigger value="scenes" className="text-xs py-1 font-inter">
              <Layers className="h-3 w-3 mr-1" />
              Scenes
            </TabsTrigger>
            <TabsTrigger value="effects" className="text-xs py-1 font-inter">
              <Sparkles className="h-3 w-3 mr-1" />
              Effects
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scenes Tab */}
        <TabsContent value="scenes" className="flex-1 mt-0 overflow-y-auto">
          <div className="p-3 border-b bg-background">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Scenes</span>
          </div>
          <div className="p-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-video bg-background border rounded-md shadow-sm flex items-center justify-center text-xs text-muted-foreground">1</div>
              <div className="aspect-video bg-background border rounded-md shadow-sm flex items-center justify-center text-xs text-muted-foreground">2</div>
            </div>
          </div>
        </TabsContent>

        {/* Effects Tab */}
        <TabsContent value="effects" className="flex-1 mt-0 overflow-y-auto">
          {!isTextComponent(selectedElement.type) ? (
            <div className="px-3 py-8 text-center text-gray-400">
              <p className="text-sm">No effects available for this element type</p>
              <p className="text-xs mt-1 text-muted-foreground">Select a text element to apply effects</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Sub-tabs for different effect categories */}
              <Tabs defaultValue="single" className="flex flex-col flex-1">
                <div className="px-2 pt-2 bg-background border-b">
                  <TabsList className="bg-muted w-full grid grid-cols-3 h-8">
                    <TabsTrigger value="single" className="text-[10px] px-1">
                      <Wand2 className="h-3 w-3 mr-0.5" />
                      Basic
                    </TabsTrigger>
                    <TabsTrigger value="multi" className="text-[10px] px-1">
                      <Type className="h-3 w-3 mr-0.5" />
                      Letters
                    </TabsTrigger>
                    <TabsTrigger value="fonts" className="text-[10px] px-1" disabled>
                      Fonts
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Single-node Effects */}
                <TabsContent value="single" className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Basic Text Effects</h3>
                    <p className="text-xs text-muted-foreground mb-3">Animate entire text as one</p>
                  </div>

                  {/* Effect Type Selector */}
                  <div>
                    <Label className="text-xs">Effect Type</Label>
                    <Select
                      value={textEffect.type || 'none'}
                      onValueChange={(value) => updateTextEffect('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select effect" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="glitch">Glitch</SelectItem>
                        <SelectItem value="wave">Wave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Show controls only if effect is selected */}
                  {textEffect.type && textEffect.type !== 'none' && (
                    <>
                      {/* Duration */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-xs">Duration</Label>
                          <span className="text-xs text-muted-foreground">{textEffect.duration || 2}s</span>
                        </div>
                        <Slider
                          value={[textEffect.duration || 2]}
                          onValueChange={([value]) => updateTextEffect('duration', value)}
                          min={0.5}
                          max={5}
                          step={0.1}
                        />
                      </div>

                      {/* Intensity (for glitch and wave) */}
                      {['glitch', 'wave'].includes(textEffect.type) && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label className="text-xs">Intensity</Label>
                            <span className="text-xs text-muted-foreground">{textEffect.intensity || 1}</span>
                          </div>
                          <Slider
                            value={[textEffect.intensity || 1]}
                            onValueChange={([value]) => updateTextEffect('intensity', value)}
                            min={0}
                            max={2}
                            step={0.1}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {/* Info Message */}
                  <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-xs text-blue-800">
                      <strong>Basic Effects:</strong> Animate text as a single unit. Use "Letters" tab for character-by-character effects.
                    </p>
                  </div>
                </TabsContent>

                {/* Multi-character Effects */}
                <TabsContent value="multi" className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Letter-by-Letter Effects</h3>
                    <p className="text-xs text-muted-foreground mb-3">Animate individual characters</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                      <p className="text-xs text-purple-800 font-semibold mb-2">Typewriter Effect</p>
                      <p className="text-xs text-purple-700">
                        Classic typewriter animation where characters appear one by one.
                      </p>
                    </div>

                    {/* Effect Type Selector */}
                    <div>
                      <Label className="text-xs mb-2 block">Effect Type</Label>
                      <Select
                        value={textEffect.type || 'none'}
                        onValueChange={(value) => updateTextEffect('type', value)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select effect" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="glitch">Glitch</SelectItem>
                          <SelectItem value="wave">Wave</SelectItem>
                          <SelectItem value="typewriter">Typewriter</SelectItem>
                          <SelectItem value="shimmer">Shimmer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Duration Control */}
                    {textEffect.type !== 'none' && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-xs">Duration</Label>
                          <span className="text-xs text-muted-foreground">{textEffect.duration || 2}s</span>
                        </div>
                        <Slider
                          value={[textEffect.duration || 2]}
                          onValueChange={([value]) => updateTextEffect('duration', value)}
                          min={0.5}
                          max={5}
                          step={0.1}
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Font Combinations (Future) */}
                <TabsContent value="fonts" className="flex-1 overflow-y-auto p-4">
                  <div className="text-center py-8 text-gray-400">
                    <Type className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Font combinations coming soon</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
