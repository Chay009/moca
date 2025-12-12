/**
 * PlayerControls Component
 * A comprehensive video player controls bar inspired by SlideShots UI
 *
 * Features:
 * - Playback controls (play/pause, stop, scene navigation)
 * - Progress bar with time markers
 * - Scene timeline with thumbnails
 * - Canvas size selection
 * - Export functionality
 * - Volume control
 * - Fullscreen toggle
 */

import { useState, useEffect, useRef } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useSceneStore } from '@/store/sceneStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Download,
  Maximize,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Scene } from '@/types/project';
import { exportVideo } from '@/app/revideo/exporter/exportVideo';
import { toast } from 'sonner';

// Canvas size presets
type CanvasSize = 'desktop' | 'mobile' | 'square' | 'custom';

interface CanvasSizeOption {
  id: CanvasSize;
  label: string;
  ratio: string;
  width: number;
  height: number;
}

const CANVAS_SIZES: CanvasSizeOption[] = [
  { id: 'desktop', label: 'Desktop', ratio: '16:9', width: 1920, height: 1080 },
  { id: 'mobile', label: 'Mobile', ratio: '9:16', width: 1080, height: 1920 },
  { id: 'square', label: 'Square', ratio: '1:1', width: 1080, height: 1080 },
  { id: 'custom', label: 'Custom', ratio: 'Custom', width: 1920, height: 1080 },
];

interface PlayerControlsProps {
  onExport?: () => void;
  onFullscreen?: () => void;
  className?: string;
}

export const PlayerControls = ({
  onExport,
  onFullscreen,
  className,
}: PlayerControlsProps) => {
  // Store state - Subscribe to projects directly to ensure reactivity
  const currentProjectId = useProjectStore((state) => state.currentProjectId);
  const projects = useProjectStore((state) => state.projects);
  const currentProject = projects.find(p => p.id === currentProjectId);
  const scenes = currentProject?.scenes || [];

  const currentSceneIndex = useSceneStore((state) => state.currentSceneIndex);
  const currentTime = useSceneStore((state) => state.currentTime);
  const isPlaying = useSceneStore((state) => state.isPlaying);
  const playMode = useSceneStore((state) => state.playMode);

  // Store actions
  const setCurrentScene = useSceneStore((state) => state.setCurrentScene);
  const setIsPlaying = useSceneStore((state) => state.setIsPlaying);
  const setCurrentTime = useSceneStore((state) => state.setCurrentTime);
  const setPlayMode = useSceneStore((state) => state.setPlayMode);
  const getTotalDuration = useSceneStore((state) => state.getTotalDuration);
  const addScene = useSceneStore((state) => state.addScene);
  const removeScene = useSceneStore((state) => state.removeScene);
  const canvasSize = useProjectStore((state) => state.canvasSize);
  const setAspectRatio = useProjectStore((state) => state.setAspectRatio);

  // Local state
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCanvasSize, setSelectedCanvasSize] = useState<CanvasSize>('desktop');
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const totalDuration = getTotalDuration();
  const currentScene = scenes[currentSceneIndex];

  // Apply canvas size when selection changes
  const handleCanvasSizeChange = (sizeId: CanvasSize) => {
    setSelectedCanvasSize(sizeId);
    const size = CANVAS_SIZES.find(s => s.id === sizeId);
    if (size && size.ratio !== 'Custom') {
      // Map to aspect ratio format
      const ratioMap: Record<string, '16:9' | '9:16' | '1:1' | '4:3'> = {
        '16:9': '16:9',
        '9:16': '9:16',
        '1:1': '1:1',
        '4:3': '4:3',
      };
      const aspectRatio = ratioMap[size.ratio];
      if (aspectRatio) {
        setAspectRatio(aspectRatio);
      }
    }
  };

  // Calculate cumulative time for each scene
  const getSceneStartTime = (index: number) => {
    return scenes.slice(0, index).reduce((total, s) => total + s.duration, 0);
  };

  const getSceneEndTime = (index: number) => {
    return getSceneStartTime(index) + scenes[index].duration;
  };

  // Format time as MM:SS or SS.SS
  const formatTime = (seconds: number) => {
    if (seconds === undefined || seconds === null || isNaN(seconds)) return '0.00s';
    if (seconds < 60) {
      return `${seconds.toFixed(2)}s`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(0).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Playback controls
  const handlePlayPause = () => {
    if (!isPlaying) {
      // Starting playback - check if we need to reset to start
      const sceneEndTime = getSceneEndTime(currentSceneIndex);
      if (currentTime >= sceneEndTime) {
        // We're at or past the end of the scene, reset to scene start
        setCurrentTime(getSceneStartTime(currentSceneIndex));
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(getSceneStartTime(currentSceneIndex));
  };

  const handlePreviousScene = () => {
    if (currentSceneIndex > 0) {
      const newIndex = currentSceneIndex - 1;
      setCurrentScene(newIndex);
      setCurrentTime(getSceneStartTime(newIndex));
      setIsPlaying(false);
    }
  };

  const handleNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      const newIndex = currentSceneIndex + 1;
      setCurrentScene(newIndex);
      setCurrentTime(getSceneStartTime(newIndex));
      setIsPlaying(false);
    }
  };

  const handleSceneClick = (index: number) => {
    setCurrentScene(index);
    setCurrentTime(getSceneStartTime(index));
    setIsPlaying(false);
  };

  // Progress bar interaction
  const handleProgressChange = (value: number[]) => {
    const newTime = (value[0] / 100) * totalDuration;
    setCurrentTime(newTime);

    // Find which scene this time belongs to
    let sceneIndex = 0;
    let accumulatedTime = 0;
    for (let i = 0; i < scenes.length; i++) {
      if (newTime < accumulatedTime + scenes[i].duration) {
        sceneIndex = i;
        break;
      }
      accumulatedTime += scenes[i].duration;
      sceneIndex = i;
    }
    setCurrentScene(sceneIndex);
  };

  // Volume controls
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Export video handler
  const handleExport = async () => {
    if (scenes.length === 0) {
      toast.error('No scenes to export');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    toast.info(`🎬 Exporting ${scenes.length} scenes...`);

    try {
      await exportVideo(scenes, {
        width: canvasSize.width,
        height: canvasSize.height,
        fps: 30,
        useRenderer: true,
        onProgress: (progress) => {
          setExportProgress(Math.round(progress * 100));
        },
      });
      toast.success('✅ Video exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // Handle add scene
  const handleAddScene = () => {
    addScene();
    toast.success('Scene added!');
  };

  // Handle remove scene
  const handleRemoveScene = (sceneId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (scenes.length <= 1) {
      toast.error('Cannot delete the last scene');
      return;
    }
    removeScene(sceneId);
    toast.success('Scene removed');
  };

  // Auto-advance to next scene when current scene ends (if playing all)
  useEffect(() => {
    if (!isPlaying) return;

    const sceneEndTime = getSceneEndTime(currentSceneIndex);

    if (playMode === 'scene') {
      // Stop at end of current scene
      if (currentTime >= sceneEndTime) {
        setIsPlaying(false);
        setCurrentTime(getSceneStartTime(currentSceneIndex));
      }
    } else {
      // Continue to next scene
      if (currentTime >= sceneEndTime && currentSceneIndex < scenes.length - 1) {
        setCurrentScene(currentSceneIndex + 1);
      } else if (currentTime >= totalDuration) {
        // Stop at end of all scenes
        setIsPlaying(false);
        setCurrentTime(0);
        setCurrentScene(0);
      }
    }
  }, [currentTime, isPlaying, playMode, currentSceneIndex, scenes.length, totalDuration]);

  // Time markers for progress bar
  const generateTimeMarkers = () => {
    const markers = [];
    const interval = totalDuration > 10 ? 1 : 0.5; // 1s or 0.5s intervals

    for (let time = 0; time <= totalDuration; time += interval) {
      markers.push(time);
    }

    return markers;
  };

  const timeMarkers = generateTimeMarkers();
  const progressPercentage = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Main Controls Bar */}
      <Card className="p-4 bg-neutral-50 border-neutral-200">
        <div className="flex items-center gap-3">
          {/* Left Side Controls */}
          <div className="flex items-center gap-2">
            {/* Scene Navigation */}
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousScene}
              disabled={currentSceneIndex === 0}
              className="h-9 w-9"
              title="Previous Scene"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            {/* Play/Pause */}
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayPause}
              className="h-9 w-9"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            {/* Stop */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleStop}
              className="h-9 w-9"
              title="Stop"
            >
              <Square className="h-4 w-4" />
            </Button>

            {/* Next Scene */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextScene}
              disabled={currentSceneIndex === scenes.length - 1}
              className="h-9 w-9"
              title="Next Scene"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            {/* Volume */}
            <div className="flex items-center gap-2 ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="h-9 w-9"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-20"
              />
            </div>

            {/* Play Mode Toggle - Two separate buttons */}
            <div className="flex items-center gap-1 ml-2 border rounded-md p-0.5">
              <Button
                variant={playMode === 'scene' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setPlayMode('scene')}
                title="Play current scene only"
              >
                Scene
              </Button>
              <Button
                variant={playMode === 'all' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setPlayMode('all')}
                title="Play all scenes continuously"
              >
                All
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 mx-4">
            <div className="relative">
              {/* Time display */}
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span className="tabular-nums">{formatTime(currentTime)}</span>
                <span className="tabular-nums">{formatTime(totalDuration)}</span>
              </div>

              {/* Progress slider */}
              <div className="relative">
                <Slider
                  value={[progressPercentage]}
                  onValueChange={handleProgressChange}
                  max={100}
                  step={0.1}
                  className="cursor-pointer [&_[role=slider]]:bg-red-500 [&_[role=slider]]:border-red-500"
                />

                {/* Custom track coloring */}
                <div
                  className="absolute top-[10px] left-0 h-1 bg-red-500 rounded-l pointer-events-none"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Time markers */}
              <div className="relative h-4 mt-1">
                {timeMarkers.map((time, index) => {
                  const position = (time / totalDuration) * 100;
                  return (
                    <div
                      key={index}
                      className="absolute top-0 flex flex-col items-center"
                      style={{ left: `${position}%` }}
                    >
                      <div className="w-px h-2 bg-neutral-300" />
                      <span className="text-[10px] text-muted-foreground mt-0.5">
                        {time.toFixed(2)}s
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            {/* Canvas Size */}
            <Select value={selectedCanvasSize} onValueChange={(v) => handleCanvasSizeChange(v as CanvasSize)}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CANVAS_SIZES.map((size) => (
                  <SelectItem key={size.id} value={size.id}>
                    {size.label} ({size.ratio})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-green-600 hover:bg-green-700 h-9"
              size="sm"
            >
              <Download className="h-4 w-4 mr-1" />
              {isExporting ? `Exporting ${exportProgress}%` : 'Export'}
            </Button>

            {/* Fullscreen */}
            <Button
              variant="outline"
              size="icon"
              onClick={onFullscreen}
              className="h-9 w-9"
              title="Fullscreen"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Scene Timeline */}
      <Card className="p-4 bg-neutral-50 border-neutral-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-neutral-700">Scenes</h3>
            <span className="text-xs text-muted-foreground">
              ({scenes.length} scene{scenes.length !== 1 ? 's' : ''})
            </span>
          </div>
          <Button
            onClick={handleAddScene}
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs"
          >
            <Plus className="h-3 w-3" />
            Add Scene
          </Button>
        </div>

        <div className="relative" ref={timelineRef}>
          {/* Navigation arrows for overflow */}
          {scenes.length > 5 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md h-8 w-8"
                onClick={() => {
                  timelineRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md h-8 w-8"
                onClick={() => {
                  timelineRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Scene cards */}
          <div className="flex gap-3 overflow-x-auto pb-2 px-8 scrollbar-hide">
            {scenes.map((scene, index) => {
              const startTime = getSceneStartTime(index);
              const isActive = currentSceneIndex === index;
              const isCurrentlyPlaying =
                currentTime >= startTime &&
                currentTime < startTime + scene.duration;

              return (
                <Card
                  key={scene.id}
                  onClick={() => handleSceneClick(index)}
                  className={cn(
                    'flex-shrink-0 w-40 h-28 cursor-pointer transition-all hover:scale-105 hover:shadow-lg relative overflow-hidden group',
                    isActive && 'ring-2 ring-primary shadow-lg',
                    isCurrentlyPlaying && 'ring-2 ring-red-500 ring-offset-2'
                  )}
                >
                  {/* Scene preview/background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200" />

                  {/* Content */}
                  <div className="relative h-full p-3 flex flex-col justify-between">
                    {/* Scene info */}
                    <div>
                      <h4 className="font-semibold text-sm truncate text-neutral-800">
                        {scene.name || `Scene ${index + 1}`}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {scene.elements.length} element{scene.elements.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-1 text-xs text-neutral-600">
                      <Clock className="h-3 w-3" />
                      <span className="font-medium tabular-nums">
                        {(scene.duration || 0).toFixed(2)}s
                      </span>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  {isCurrentlyPlaying && (
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-red-500 transition-all"
                      style={{
                        width: `${((currentTime - startTime) / scene.duration) * 100}%`,
                      }}
                    />
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                  )}

                  {/* Delete button (visible on hover) */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleRemoveScene(scene.id, e)}
                    title="Delete Scene"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};
