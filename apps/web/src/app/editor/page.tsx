// app/editor/page.tsx
'use client'

import {
  ZoomOut,
  ZoomIn,
  Undo,
  Redo,
  MonitorPlay,
  RotateCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { AddElements } from "./components/AddElements"
import { useProjectStore } from "@/store/projectStore"
import { AspectRatio } from "@/components/ui/aspect-ratio"
// Dynamic imports
const RightSidebar = dynamic(() => import("./components/RightSideBar"), { ssr: false })
const PlayerControls = dynamic(() => import("./components/PlayerControls").then(mod => ({ default: mod.PlayerControls })), { ssr: false })
const CanvasPlayer = dynamic(() => import("./components/CanvasPlayer").then(mod => ({ default: mod.CanvasPlayer })), { ssr: false })

// Aspect ratio mapping
const ASPECT_RATIO_VALUES = {
  '16:9': 16 / 9,
  '9:16': 9 / 16,
  '1:1': 1 / 1,
  '4:3': 4 / 3,
} as const

export default function EditorPage() {
  const aspectRatio = useProjectStore((state) => state.aspectRatio) || '16:9'
  const ratio = ASPECT_RATIO_VALUES[aspectRatio]

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">

      {/* TOP TOOLBAR */}
      <div className="h-14 border-b bg-card px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <AddElements />
          <div className="h-6 w-px bg-border mx-2" />
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8"><Undo className="h-4 w-4 text-muted-foreground" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Redo className="h-4 w-4 text-muted-foreground" /></Button>
          </div>
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT SIDEBAR - SCENES */}
        <div className="w-48 border-r bg-muted/10 flex flex-col shrink-0">
          <div className="p-3 border-b bg-background">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Scenes</span>
          </div>
          <div className="p-2 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-video bg-background border rounded-md shadow-sm flex items-center justify-center text-xs text-muted-foreground">1</div>
              <div className="aspect-video bg-background border rounded-md shadow-sm flex items-center justify-center text-xs text-muted-foreground">2</div>
              <div className="aspect-video bg-background border rounded-md shadow-sm flex items-center justify-center text-xs text-muted-foreground">3</div>
              <div className="aspect-video bg-background border rounded-md shadow-sm flex items-center justify-center text-xs text-muted-foreground">4</div>
            </div>
          </div>
        </div>

        {/* CENTER - CANVAS + TIMELINE */}
        <div className="flex-1 flex flex-col bg-muted/30">

          {/* Canvas Area */}
          <div className="flex-1 py-2 flex items-center justify-center overflow-hidden">
            <div
              className="max-w-full h-full shadow-2xl max-h-full border rounded-lg overflow-hidden"
              style={{
                aspectRatio: ratio,
              }}
            >
              <CanvasPlayer />
            </div>
          </div>

          {/* TIMELINE */}
          <div className="h-64 border-t bg-background flex flex-col shrink-0 z-10">
            <div className="h-8 border-b flex items-center px-4 bg-muted/20 justify-between">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <MonitorPlay className="w-3 h-3" /> Timeline
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-6 w-6"><RotateCcw className="w-3 h-3" /></Button>
              </div>
            </div>

            <div className="flex-1 relative w-full overflow-hidden">
              <PlayerControls />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - PROPERTIES */}
        <div className="w-80 border-l bg-background flex flex-col shrink-0">
          <RightSidebar />
        </div>

      </div>
    </div>
  )
}