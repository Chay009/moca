'use client';

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  ChevronDown,
  Palette,
  Maximize2
} from "lucide-react"
import { BackgroundPicker } from "@/app/revideo/creators/backgrounds/BackgroundPicker"
import { useSceneStore } from "@/store/sceneStore"
import { useProjectStore } from "@/store/projectStore"
import { AspectRatioSelector } from "./AspectRatioSelector"
import { FilterControls } from "./StyleSettings/FilterControls"

export default function CanvasSettings() {
  const currentProject = useProjectStore((state) => state.getCurrentProject())
  const currentSceneIndex = useSceneStore((state) => state.currentSceneIndex)
  const updateScene = useSceneStore((state) => state.updateScene)

  // Aspect ratio settings from store
  const aspectRatio = useProjectStore((state) => state.aspectRatio)
  const setAspectRatio = useProjectStore((state) => state.setAspectRatio)

  const currentScene = currentProject?.scenes[currentSceneIndex] || null

  // Update background property (including filters)
  const updateBackgroundProperty = (key: string, value: any) => {
    if (!currentScene) return;

    updateScene(currentScene.id, {
      background: {
        ...currentScene.background,
        [key]: value,
      },
    });
  };

  return (
    <div className="h-full flex flex-col min-h-full">
      <div className="grid px-3 grid-cols-1 gap-4 mt-3">
        {/* Aspect Ratio Selector */}
        <div>
          <Label className="text-xs font-medium font-inter text-gray-500">Aspect Ratio</Label>
          <div className="mt-2">
            <AspectRatioSelector
              value={aspectRatio}
              onValueChange={setAspectRatio}
            />
          </div>
        </div>

        <Separator className="-mx-3" />

        <div className="grid grid-cols-[0.6fr_1fr] gap-4 items-center justify-between">
          <Label htmlFor="smart-resize" className="text-gray-500 text-xs font-medium font-inter relative">
            Optimize Layout
          </Label>
          <Button id="smart-resize" variant="outline" size="sm" className="h-7 rounded-lg px-3 w-auto gap-2 ml-auto">
            <Maximize2 className="w-4 h-4" />
            Smart Resize
          </Button>
        </div>

        <div className="flex gap-2 items-center justify-between">
          <Label htmlFor="canvas-width" className="text-gray-500 text-xs font-medium font-inter">
            Width
          </Label>
          <Input
            id="canvas-width"
            type="text"
            inputMode="decimal"
            defaultValue="800.0"
            className="h-7 rounded-md px-3 w-[100px] shadow-sm"
          />
        </div>

        <div className="flex gap-2 items-center justify-between">
          <Label htmlFor="canvas-height" className="text-gray-500 text-xs font-medium font-inter">
            Height
          </Label>
          <Input
            id="canvas-height"
            type="text"
            inputMode="decimal"
            defaultValue="800.0"
            className="h-7 rounded-md px-3 w-[100px] shadow-sm"
          />
        </div>

        <Separator className="-mx-3" />

        {currentScene && (
          <>
            <div>
              <Label className="text-gray-500 text-xs font-medium font-inter">
                Background
              </Label>
              <BackgroundPicker
                background={currentScene.background?.value ?? currentScene.background?.cssString ?? '#000000'}
                setBackground={(value, type) => {
                  updateScene(currentScene.id, {
                    background: {
                      type,
                      value,
                      filters: currentScene.background?.filters || [],
                    },
                  });
                }}
              />
            </div>

            {/* Background Filters - Only show for solid/gradient/image backgrounds */}
            {currentScene.background?.type && currentScene.background.type !== 'shader' && (
              <div className="-mt-2">
                <FilterControls
                  filters={currentScene.background?.filters || []}
                  updateProperty={updateBackgroundProperty}
                />
              </div>
            )}
          </>
        )}

        <Separator className="-mx-3" />

        <div className="flex gap-2 items-center justify-between">
          <Label htmlFor="canvas-border-width" className="text-gray-500 text-xs font-medium font-inter">
            Border Width
          </Label>
          <Input
            id="canvas-border-width"
            type="text"
            inputMode="decimal"
            defaultValue="0.0"
            className="h-7 rounded-md px-3 w-[100px] shadow-sm"
          />
        </div>

        <div className="flex gap-2 items-center justify-between">
          <Label htmlFor="canvas-border-color" className="text-gray-500 text-xs font-medium font-inter">
            Border Color
          </Label>
          <Button
            variant="outline"
            className="h-7 rounded-lg px-3 w-auto justify-start text-left overflow-hidden font-normal pl-1 pr-2 py-1 bg-white border border-gray-200 hover:border-gray-300 flex items-center gap-2 group w-[100px]"
          >
            <div className="size-4.5 bg-black group-hover:bg-black shadow-sm ring-[1px] ring-white/40 flex items-center justify-center rounded-[4px] text-gray-500">
              <Palette className="w-4 h-4 group-hover:scale-[1.1] duration-100 ease-in-out" />
            </div>
            <span className="text-sm text-gray-300 mix-blend-exclusion inline-flex gap-1 items-center tabular-nums">#000000</span>
          </Button>
        </div>

        <div className="flex gap-2 items-center justify-between">
          <Label htmlFor="canvas-border-style" className="text-gray-500 text-xs font-medium font-inter">
            Border Style
          </Label>
          <Select defaultValue="solid">
            <SelectTrigger className="h-7 rounded-md w-[100px] flex items-center gap-1 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
              <SelectItem value="dotted">Dotted</SelectItem>
              <SelectItem value="double">Double</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}