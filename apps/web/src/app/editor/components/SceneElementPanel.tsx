/**
 * Panel for managing elements in the current scene
 * Extended to support all component types with video editor-style UX
 */
import { useState } from 'react';
import { useSceneStore } from '@/store/sceneStore';
import type { SceneElement } from '@/store/sceneStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BackgroundPicker } from '@/app/revideo/creators/backgrounds/BackgroundPicker';
import {
  Plus,
  Type,
  Square,
  Circle,
  Image,
  Video as VideoIcon,
  Music,
  Trash2,
  Clock,
  MousePointer,
  CreditCard,
  Tag,
  Activity,
  Hash,
  Layout as LayoutIcon,
  Layers,
  Sparkles,
  Zap,
  Box,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
// import { DEFAULT_COMPONENTS } from '@/components/revideo';
import { componentRegistry } from '@/app/revideo/creators/components/registry';
import { isTextComponent, getDisplayName } from '@/app/revideo/creators/components/utils';
import { useProjectStore } from '@/store/projectStore';
import { getVideoMetadata, getAudioMetadata } from '@/utils/mediaMetadata';

export const SceneElementPanel = () => {
  const currentProject = useProjectStore((state) => state.getCurrentProject());
  const currentSceneIndex = useSceneStore((state) => state.currentSceneIndex);
  const currentScene = currentProject?.scenes[currentSceneIndex] || null;
  const addElementToScene = useSceneStore((state) => state.addElementToScene);
  const updateSceneDuration = useSceneStore((state) => state.updateSceneDuration);
  const removeElementFromScene = useSceneStore((state) => state.removeElementFromScene);
  const updateScene = useSceneStore((state) => state.updateScene);

  const [selectedType, setSelectedType] = useState<SceneElement['type']>('text');
  const [text, setText] = useState('New Text');
  const [mediaUrl, setMediaUrl] = useState('');
  const [autoAdjustDuration, setAutoAdjustDuration] = useState(true);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [selectedShader, setSelectedShader] = useState('pixelBlast');
  if (!currentScene) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground text-center">No scene selected</p>
      </Card>
    );
  }

  const handleAddElement = async () => {
    // Check if component exists in registry
    const component = componentRegistry[selectedType];

    if (component) {
      // Use default props from registry
      addElementToScene(currentScene.id, {
        type: selectedType,
        properties: component.defaultProps,
      });
      toast.success(`${component.displayName} added successfully`);
      return;
    }

    // Fallback for legacy components not yet in registry
    // TODO: Move these to component registry
    const baseElement = {
      type: selectedType,
      properties: {},
    };

    switch (selectedType) {
      case 'video':
      case 'audio': {
        // Extract metadata and update scene duration
        try {
          const metadata = selectedType === 'video'
            ? await getVideoMetadata(mediaUrl)
            : await getAudioMetadata(mediaUrl);

          addElementToScene(currentScene.id, {
            ...baseElement,
            properties: {
              src: mediaUrl,
              mediaDuration: metadata.duration,
              ...(selectedType === 'video' && {
                x: 0,
                y: 0,
                width: metadata.width || 640,
                height: metadata.height || 360,
              }),
              volume: 1,
            },
          });

          const newDuration = metadata.duration + 1;
          if (newDuration > currentScene.duration) {
            updateSceneDuration(currentScene.id, newDuration);
          }



          toast.success(`${selectedType} added (${metadata.duration.toFixed(1)}s)`);
        } catch (error) {
          console.error('Failed to get media metadata:', error);
          addElementToScene(currentScene.id, {
            ...baseElement,
            properties: { src: mediaUrl, volume: 1 },
          });
          toast.success(`${selectedType} added`);
        }
        break;
      }
      case 'three':
        if (selectedShader === 'pixelBlast') {
          addElementToScene(currentScene.id, {
            ...baseElement,
            properties: {
              sceneType: 'pixelBlast',
              width: 1920,
              height: 1080,
              x: 0,
              y: 0,
              variant: 'square',
              pixelSize: 3,
              objectColor: '#B19EEF',
              patternScale: 2,
              patternDensity: 1,
              pixelSizeJitter: 0,
              speed: 0.5,
              edgeFade: 0.5,
              noiseAmount: 0,
            },
          });
          toast.success('Pixel Blast shader added successfully');
        } else if (selectedShader === 'iphone') {
          addElementToScene(currentScene.id, {
            ...baseElement,
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
          });
          toast.success('iPhone Mockup added successfully');
        } else {
          addElementToScene(currentScene.id, {
            ...baseElement,
            properties: {
              sceneType: 'cube',
              width: 800,
              height: 600,
              x: 0,
              y: 0,
              objectColor: '#4a90e2',
              objectSize: 0.2,
              rotationSpeed: 0.01,
              autoRotate: true,
              rotationAxis: 'y',
              cameraType: 'perspective',
              cameraFov: 90,
              materialType: 'normal',
              lightType: 'ambient',
              lightColor: '#ffffff',
              lightIntensity: 1,
              quality: 1,
              backgroundColor: '#000000',
            },
          });
          toast.success('3D object added successfully');
        }
        break;
      default:
        toast.error(`Component type "${selectedType}" not found in registry`);
    }
  };

  const iconMap: Record<string, any> = {
    text: Type,
    'text-effect-preset': Sparkles,
    rect: Square,
    circle: Circle,
    image: Image,
    video: VideoIcon,
    audio: Music,
    three: Box,
  };

  return (
    <div className="space-y-4">
      {/* Scene settings */}
      <Card className="p-4 space-y-3">
        <h3 className="font-semibold text-lg">{currentScene.name}</h3>

        <div>
          <Label>Scene Name</Label>
          <Input
            value={currentScene.name}
            onChange={(e) =>
              updateScene(currentScene.id, { name: e.target.value })
            }
          />
        </div>

        <div>
          <Label className="flex items-center gap-2">
            <Clock size={14} />
            Duration (seconds)
          </Label>
          <Input
            type="number"
            value={currentScene.duration}
            onChange={(e) =>
              updateScene(currentScene.id, { duration: Number(e.target.value) })
            }
            min={0.1}
            step={0.1}
          />
        </div>

        <div>
          <Label>Transition</Label>
          <Select
            value={currentScene.transition}
            onValueChange={(v) =>
              updateScene(currentScene.id, { transition: v as any })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fade">Fade</SelectItem>
              <SelectItem value="slide">Slide</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
      {/* Background */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold">Background</h3>
        <div className="space-y-3">
          <Label>Color, Gradient, or Image</Label>
          <BackgroundPicker
            background={currentScene.background?.value ?? currentScene.background?.cssString ?? '#000000'}
            setBackground={(value, type) => {
              updateScene(currentScene.id, {
                background: { type, value },
              });
              toast.success('Background updated');
            }}
          />
        </div>
      </Card>


      {/* Add element */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold">Add Element</h3>

        <div className="space-y-3">
          <div>
            <Label>Type</Label>
            <Select value={selectedType} onValueChange={(v) => setSelectedType(v as SceneElement['type'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="image-simple">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedType === 'three' && (
            <Tabs defaultValue="shaders" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="objects">3D Objects</TabsTrigger>
                <TabsTrigger value="shaders">Shaders</TabsTrigger>
                <TabsTrigger value="mockups">Mockups</TabsTrigger>
              </TabsList>
              <TabsContent value="objects">
                <p className="text-sm text-muted-foreground">Coming soon...</p>
              </TabsContent>
              <TabsContent value="shaders" className="space-y-3">
                <Label>Shader</Label>
                <Select value={selectedShader} onValueChange={setSelectedShader}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pixelBlast">Pixel Blast</SelectItem>
                  </SelectContent>
                </Select>
              </TabsContent>
              <TabsContent value="mockups" className="space-y-3">
                <Label>Device Mockup</Label>
                <Select value={selectedShader} onValueChange={setSelectedShader}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iphone">iPhone 17 Pro</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Drag content to the screen or edit in Style panel
                </p>
              </TabsContent>
            </Tabs>
          )}

          {selectedType === 'text' && (
            <div>
              <Label>Text</Label>
              <Input value={text} onChange={(e) => setText(e.target.value)} />
            </div>
          )}

          {(selectedType === 'video' || selectedType === 'audio' || selectedType === 'image') && (
            <div>
              <Label>{selectedType === 'audio' ? 'Audio' : selectedType === 'video' ? 'Video' : 'Image'} URL</Label>
              <Input
                placeholder="https://example.com/file.mp4"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
              />
            </div>
          )}

          {(selectedType === 'video' || selectedType === 'audio') && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto-duration"
                checked={autoAdjustDuration}
                onCheckedChange={(checked) => setAutoAdjustDuration(checked as boolean)}
              />
              <Label htmlFor="auto-duration" className="text-sm cursor-pointer">
                Auto-adjust scene duration to match media
              </Label>
            </div>
          )}

          <Button onClick={handleAddElement} className="w-full" disabled={isLoadingMetadata}>
            <Plus className="mr-2" size={16} />
            {isLoadingMetadata ? 'Loading...' : 'Add Element'}
          </Button>
        </div>
      </Card>

      {/* Elements list */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">
          Elements ({currentScene.elements.length})
        </h3>
        <div className="space-y-2">
          {currentScene.elements.map((element) => {
            const Icon = iconMap[element.type] || Layers;
            return (
              <div
                key={element.id}
                className="flex items-center justify-between p-2 bg-secondary rounded-md"
              >
                <div className="flex items-center gap-2">
                  {Icon && <Icon size={16} />}
                  <span className="text-sm">
                    {(() => {
                      // Show text content for text category elements
                      if (isTextComponent(element.type)) {
                        return element.properties.text || getDisplayName(element.type);
                      }
                      // Show display name from registry or fallback to type
                      return getDisplayName(element.type);
                    })()}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeElementFromScene(currentScene.id, element.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
