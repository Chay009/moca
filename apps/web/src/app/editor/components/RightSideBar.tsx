'use client';

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Focus, GripVertical, Layout, MoreHorizontal, Plus, Trash2, Film } from "lucide-react";

import StyleSettings from "./StyleSettings";
import CanvasSettings from "./CanvasSettings";
import { ZoomControls } from "./ZoomControls";
import SceneTransitionsPanel from "./SceneTransitionsPanel";
import { useSceneStore } from "@/store/sceneStore";
import { useProjectStore } from "@/store/projectStore";
import type { ZoomEvent } from "@/types/zoom";

export default function RightSidebar() {
  const [selectedZoomId, setSelectedZoomId] = useState<string | null>(null);

  const currentProject = useProjectStore((state) => state.getCurrentProject());
  const currentSceneIndex = useSceneStore((state) => state.currentSceneIndex);
  const removeZoomEvent = useSceneStore((state) => state.removeZoomEvent);

  const currentScene = currentProject?.scenes[currentSceneIndex] || null;
  const zoomEvents = currentScene?.zoomEvents || [];
  const selectedZoomEvent = zoomEvents.find(z => z.id === selectedZoomId);

  return (
    <>
      <div className="h-screen border-l border-gray-200 flex flex-col justify-between relative z-50 bg-white">
        <Tabs defaultValue="pages" className="flex flex-col w-full relative gap-1">
          <div className="px-2 pt-2 pb-0 absolute bg-gray-50/50 backdrop-blur-md z-50 w-full">
            <TabsList className="bg-gray-200/40 relative items-center justify-center p-1 grid grid-cols-5 rounded-xl border border-gray-200 w-full">
              <TabsTrigger value="pages" className="text-xs py-1 font-inter">Scenes</TabsTrigger>
              <TabsTrigger value="canvas" className="text-xs py-1 font-inter">Canvas</TabsTrigger>
              <TabsTrigger value="styles" className="text-xs py-1 font-inter">Styles</TabsTrigger>
              <TabsTrigger value="zoom" className="text-xs py-1 font-inter relative">
                Zoom
                {zoomEvents.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {zoomEvents.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="transitions" className="text-xs py-1 font-inter">
                <Film className="h-3 w-3 mr-1 inline" />
                Transitions
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="pages" className="flex-1 outline-none mt-2 pt-12 w-full max-h-[calc(100vh)] h-full !mt-0">
            <div className="flex flex-col h-full overflow-auto">
              <div className="flex flex-col mt-2 h-full">
                <div className="flex items-center justify-between px-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs text-gray-500">1 page</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Page
                  </Button>
                </div>
                <ul className="grid p-3 gap-1.5">
                  <li className="w-full">
                    <div className="py-1.5 px-1 rounded-md cursor-pointer transition-all duration-100 -mx-1 bg-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 flex-shrink-0">
                            <GripVertical className="h-4 w-4" />
                          </div>
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <div className="rounded size-5 border border-gray-200 overflow-hidden text-gray-500 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-1 flex-shrink-0">
                              <Layout className="h-3 w-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm truncate text-black">Page 1</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Button variant="ghost" size="sm" className="h-5 px-1">
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-5 px-1">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="canvas" className="flex-1 outline-none mt-2 pt-12 w-full max-h-[calc(100vh)] h-full !mt-0 z-[42] overflow-auto">
            <CanvasSettings />
          </TabsContent>

          <TabsContent value="styles" className="flex-1 outline-none mt-2 pt-12 w-full overflow-y-auto max-h-[calc(100vh)] h-full !mt-0 pb-10">
            <StyleSettings />
          </TabsContent>

          <TabsContent value="zoom" className="flex-1 outline-none mt-2 pt-12 w-full overflow-y-auto max-h-[calc(100vh)] h-full !mt-0 pb-10">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Zoom Keyframes</h3>
                <Badge variant="secondary" className="text-xs">
                  {zoomEvents.length} {zoomEvents.length === 1 ? 'event' : 'events'}
                </Badge>
              </div>

              {zoomEvents.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-500">
                  <Focus className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No zoom keyframes yet</p>
                  <p className="text-xs mt-1">Click the Zoom button in the toolbar to add</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Zoom event list */}
                  {!selectedZoomEvent && (
                    <ul className="space-y-2">
                      {zoomEvents.map((zoom, index) => (
                        <li
                          key={zoom.id}
                          className="p-3 rounded-lg border bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedZoomId(zoom.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <p className="text-sm font-medium">Zoom {zoom.zoomLevel}x</p>
                                <p className="text-xs text-gray-500">
                                  at {(zoom.startTime || 0).toFixed(1)}s • {zoom.duration}s duration
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (currentScene) {
                                  removeZoomEvent(currentScene.id, zoom.id);
                                }
                              }}
                            >
                              <Trash2 className="h-3 w-3 text-gray-400 hover:text-red-500" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Zoom event editor */}
                  {selectedZoomEvent && currentScene && (
                    <ZoomControls
                      sceneId={currentScene.id}
                      zoomEvent={selectedZoomEvent}
                      onClose={() => setSelectedZoomId(null)}
                    />
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="transitions" className="flex-1 outline-none mt-2 pt-12 w-full overflow-y-auto max-h-[calc(100vh)] h-full !mt-0 pb-10">
            <div className="p-3">
              <SceneTransitionsPanel />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}