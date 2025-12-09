'use client';

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Focus, Image, MoreHorizontal, Redo, Smartphone, Type, Undo, Video, ZoomIn, ZoomOut } from "lucide-react"
import { useSceneStore } from "@/store/sceneStore"
import { useProjectStore } from "@/store/projectStore"
import { toast } from "sonner"
import { getComponentByType, getDefaultProps } from '@/app/revideo/creators/components/utils'
import { getVideoMetadata } from '@/utils/mediaMetadata'

export const AddElements = () => {
  const currentProject = useProjectStore((state) => state.getCurrentProject())
  const currentSceneIndex = useSceneStore((state) => state.currentSceneIndex)
  const currentTime = useSceneStore((state) => state.currentTime)
  const addElementToScene = useSceneStore((state) => state.addElementToScene)
  const updateSceneDuration = useSceneStore((state) => state.updateSceneDuration)
  const addZoomEvent = useSceneStore((state) => state.addZoomEvent)

  const currentScene = currentProject?.scenes[currentSceneIndex] || null

  const handleAddText = () => {
    if (!currentScene) {
      toast.error('No scene selected')
      return
    }

    const component = getComponentByType('text-simple')
    if (component) {
      addElementToScene(currentScene.id, {
        type: 'text-simple',
        properties: getDefaultProps('text-simple'),
      })
      toast.success(`${component.displayName} added`)
    } else {
      toast.error('Text component not found in registry')
    }
  }

  const handleAddImage = () => {
    if (!currentScene) {
      toast.error('No scene selected')
      return
    }

    const component = getComponentByType('image-simple')
    if (component) {
      addElementToScene(currentScene.id, {
        type: 'image-simple',
        properties: {
          ...getDefaultProps('image-simple'),
          // src: 'https://images.unsplash.com/photo-1688822863426-8c5f9b257090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90', // Placeholder image
        },
      })
      toast.success(`${component.displayName} added`)
    } else {
      toast.error('Image component not found in registry')
    }
  }

  const handleAddVideo = async () => {
    if (!currentScene) {
      toast.error('No scene selected')
      return
    }

    const component = getComponentByType('video-simple')
    if (!component) {
      toast.error('Video component not found in registry')
      return
    }

    const videoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'

    try {
      // Extract video metadata (duration, dimensions)
      const metadata = await getVideoMetadata(videoUrl)

      // Add video element with duration
      addElementToScene(currentScene.id, {
        type: 'video-simple',
        properties: {
          ...getDefaultProps('video-simple'),
          src: videoUrl,
          mediaDuration: metadata.duration,
          width: metadata.width || 640,
          height: metadata.height || 360,
        },
      })

      // Update scene duration to match video (with buffer for animations)
      const newDuration = metadata.duration + 1 // +0.5 entrance +0.5 exit
      if (newDuration > currentScene.duration) {
        updateSceneDuration(currentScene.id, newDuration)
      }

      toast.success(`${component.displayName} added (${metadata.duration.toFixed(1)}s)`)
    } catch (error) {
      console.error('Failed to get video metadata:', error)
      // Add video anyway with default duration
      addElementToScene(currentScene.id, {
        type: 'video-simple',
        properties: {
          ...getDefaultProps('video-simple'),
          src: videoUrl,
        },
      })
      toast.success(`${component.displayName} added`)
    }
  }

  const handleAddZoom = () => {
    if (!currentScene) {
      toast.error('No scene selected')
      return
    }

    addZoomEvent(currentScene.id, currentTime)
    toast.success('Zoom keyframe added at current time')
  }

  const handleAddIPhone = () => {
    if (!currentScene) {
      toast.error('No scene selected')
      return
    }

    addElementToScene(currentScene.id, {
      type: 'three',
      properties: {
        sceneType: 'iphone',
        width: 1920,
        height: 1080,
        x: 0,
        y: 0,
        modelPath: '/models/iphone-17-pro/scene.gltf',
        screenMeshName: 'Object_55',
        devicePreset: 'floating',
        deviceScale: 15,
        cameraFov: 50,
        quality: 1,
      },
    })
    toast.success('iPhone Mockup added')
  }

  return (<>
    <Card className="fixed bottom-0 left-0 right-0 mx-auto max-w-fit p-2 mb-5 flex items-center justify-between bg-white/80 backdrop-blur-xl shadow-sm border rounded-xl z-50">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" title="Zoom Out (⌘-)">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Reset Zoom (⌘0)" className="min-w-[44px]">
            <span className="text-xs font-medium">100%</span>
          </Button>
          <Button variant="ghost" size="sm" title="Zoom In (⌘+)">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" title="Undo (⌘Z)" disabled>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Redo (⌘⇧Z)" disabled>
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="ghost" size="sm" onClick={handleAddText}>
          <Type className="h-4 w-4" />
          <span className="hidden md:inline-block ml-1">Text</span>
        </Button>

        <Button variant="ghost" size="sm" title="Add Image (I)" onClick={handleAddImage}>
          <Image className="h-4 w-4" />
          <span className="hidden md:inline-block ml-1">Image</span>
        </Button>

        <Button variant="ghost" size="sm" title="Add Video (V)" className="relative" onClick={handleAddVideo}>
          <div className="absolute -top-2 -right-1 bg-blue-100 text-blue-600 text-xs px-1 py-0 rounded border border-blue-400 z-10">
            New
          </div>
          <Video className="h-4 w-4" />
          <span className="hidden md:inline-block ml-1">Video</span>
        </Button>

        <Button variant="ghost" size="sm" title="Add Zoom (Z)" className="relative" onClick={handleAddZoom}>
          <div className="absolute -top-2 -right-1 bg-purple-100 text-purple-600 text-xs px-1 py-0 rounded border border-purple-400 z-10">
            New
          </div>
          <Focus className="h-4 w-4" />
          <span className="hidden md:inline-block ml-1">Zoom</span>
        </Button>

        <Button variant="ghost" size="sm" title="Add iPhone Mockup" className="relative" onClick={handleAddIPhone}>
          <div className="absolute -top-2 -right-1 bg-green-100 text-green-600 text-xs px-1 py-0 rounded border border-green-400 z-10">
            New
          </div>
          <Smartphone className="h-4 w-4" />
          <span className="hidden md:inline-block ml-1">iPhone</span>
        </Button>

        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  </>)
}