'use client';

/**
 * Scene Transitions Panel
 * Allows users to select and configure transitions between scenes
 */

import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, Zap, Wand2, Eye, Grid3x3 } from "lucide-react";
import { useSceneStore } from "@/store/sceneStore";
import { getTransitionsByCategory, type TransitionPreset } from "@/app/revideo/creators/presets/sceneTransitions";
import type { SceneTransitionConfig } from "@/types/project";

export default function SceneTransitionsPanel() {
  const currentScene = useSceneStore((state) => state.getCurrentScene());
  const updateScene = useSceneStore((state) => state.updateScene);

  if (!currentScene) {
    return (
      <Card className="p-4">
        <div className="text-center text-gray-400">
          <Film className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No scene selected</p>
        </div>
      </Card>
    );
  }

  // Get current transition config
  const currentTransition = currentScene.transition;

  let transitionConfig: SceneTransitionConfig;

  if (!currentTransition) {
    transitionConfig = { type: 'none', enabled: false, duration: 0.8 };
  } else if (typeof currentTransition === 'string') {
    // Legacy format
    transitionConfig = {
      type: currentTransition === 'none' ? 'none' : currentTransition,
      enabled: currentTransition !== 'none',
      duration: 0.8,
    };
  } else {
    transitionConfig = currentTransition;
  }

  const updateTransition = (updates: Partial<SceneTransitionConfig>) => {
    const newConfig: SceneTransitionConfig = {
      ...transitionConfig,
      ...updates,
    };
    updateScene(currentScene.id, { transition: newConfig });
  };

  // Get transitions by category
  const slideTransitions = getTransitionsByCategory('slide');
  const fadeTransitions = getTransitionsByCategory('fade');
  const zoomTransitions = getTransitionsByCategory('zoom');
  const cinematicTransitions = getTransitionsByCategory('cinematic');
  const wipeTransitions = getTransitionsByCategory('wipe');

  const renderTransitionCard = (preset: TransitionPreset) => {
    const isActive = transitionConfig.type === preset.name.toLowerCase().replace(/\s+/g, '-');

    return (
      <Card
        key={preset.name}
        className={`p-3 cursor-pointer transition-all hover:shadow-md ${
          isActive ? 'ring-2 ring-primary bg-primary/5' : ''
        }`}
        onClick={() => updateTransition({ type: preset.name.toLowerCase().replace(/\s+/g, '-'), enabled: true })}
      >
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-semibold">{preset.name}</h4>
            <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
          </div>
          {isActive && (
            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
          )}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {preset.duration}s
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Scene Transition</h3>
          </div>
          <Switch
            checked={transitionConfig.enabled}
            onCheckedChange={(enabled) => updateTransition({ enabled })}
          />
        </div>

        {transitionConfig.enabled && (
          <div className="space-y-4">
            {/* Duration Control */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-xs">Duration</Label>
                <span className="text-xs text-muted-foreground">
                  {transitionConfig.duration || 0.8}s
                </span>
              </div>
              <Slider
                value={[transitionConfig.duration || 0.8]}
                onValueChange={([value]) => updateTransition({ duration: value })}
                min={0.2}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Current Selection */}
            <div className="p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Current Transition</p>
              <p className="text-sm font-medium capitalize">
                {transitionConfig.type.replace(/-/g, ' ')}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Transition Categories */}
      {transitionConfig.enabled && (
        <Card className="p-4">
          <Tabs defaultValue="slide" className="w-full">
            <TabsList className="grid grid-cols-5 w-full h-auto gap-1">
              <TabsTrigger value="slide" className="text-xs py-1.5">
                <Zap className="h-3 w-3 mr-1" />
                Slide
              </TabsTrigger>
              <TabsTrigger value="fade" className="text-xs py-1.5">
                <Eye className="h-3 w-3 mr-1" />
                Fade
              </TabsTrigger>
              <TabsTrigger value="zoom" className="text-xs py-1.5">
                <Wand2 className="h-3 w-3 mr-1" />
                Zoom
              </TabsTrigger>
              <TabsTrigger value="cinematic" className="text-xs py-1.5">
                <Film className="h-3 w-3 mr-1" />
                Film
              </TabsTrigger>
              <TabsTrigger value="wipe" className="text-xs py-1.5">
                <Grid3x3 className="h-3 w-3 mr-1" />
                Wipe
              </TabsTrigger>
            </TabsList>

            {/* Slide Transitions */}
            <TabsContent value="slide" className="space-y-2 mt-3">
              <p className="text-xs text-muted-foreground mb-2">
                {slideTransitions.length} slide transitions
              </p>
              {slideTransitions.map(renderTransitionCard)}
            </TabsContent>

            {/* Fade Transitions */}
            <TabsContent value="fade" className="space-y-2 mt-3">
              <p className="text-xs text-muted-foreground mb-2">
                {fadeTransitions.length} fade transitions
              </p>
              {fadeTransitions.map(renderTransitionCard)}
            </TabsContent>

            {/* Zoom Transitions */}
            <TabsContent value="zoom" className="space-y-2 mt-3">
              <p className="text-xs text-muted-foreground mb-2">
                {zoomTransitions.length} zoom transitions
              </p>
              {zoomTransitions.map(renderTransitionCard)}
            </TabsContent>

            {/* Cinematic Transitions */}
            <TabsContent value="cinematic" className="space-y-2 mt-3">
              <p className="text-xs text-muted-foreground mb-2">
                {cinematicTransitions.length} cinematic transitions
              </p>
              {cinematicTransitions.map(renderTransitionCard)}
            </TabsContent>

            {/* Wipe Transitions */}
            <TabsContent value="wipe" className="space-y-2 mt-3">
              <p className="text-xs text-muted-foreground mb-2">
                {wipeTransitions.length} wipe transitions
              </p>
              {wipeTransitions.map(renderTransitionCard)}
            </TabsContent>
          </Tabs>
        </Card>
      )}

      {/* Info Box */}
      <Card className="p-3 bg-blue-50 border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>Tip:</strong> Transitions play when switching from the previous scene to this one.
          Use "All" mode in player controls to preview transitions.
        </p>
      </Card>
    </div>
  );
}
