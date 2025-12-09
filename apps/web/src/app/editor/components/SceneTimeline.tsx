import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Monitor,
  Scissors,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Volume2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Trash2,
  Plus,
} from "lucide-react";
import { useSceneStore } from "@/store/sceneStore";
import { useProjectStore } from "@/store/projectStore";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { exportVideo } from "@/app/revideo/exporter/exportVideo";
import { toast } from "sonner";
export default function SceneTimeline() {
  const currentProject = useProjectStore((state) => state.getCurrentProject());
  const scenes = currentProject?.scenes || [];
  const canvasSize = useProjectStore((state) => state.canvasSize); // Get selected aspect ratio

  const currentSceneIndex = useSceneStore((state) => state.currentSceneIndex);
  const currentTime = useSceneStore((state) => state.currentTime);
  const isPlaying = useSceneStore((state) => state.isPlaying);
  const addScene = useSceneStore((state) => state.addScene);
  const removeScene = useSceneStore((state) => state.removeScene);
  const setCurrentScene = useSceneStore((state) => state.setCurrentScene);
  const setIsPlaying = useSceneStore((state) => state.setIsPlaying);
  const reset = useSceneStore((state) => state.reset);
  const getTotalDuration = useSceneStore((state) => state.getTotalDuration);
  const setCurrentTime = useSceneStore((state) => state.setCurrentTime);

  const totalDuration = getTotalDuration();
  const [zoom, setZoom] = useState(50); // pixels per second
  const timelineRef = useRef<HTMLDivElement>(null);

  // Format time as MM:SS.ms
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + timelineRef.current.scrollLeft;
    const newTime = Math.max(0, Math.min(x / zoom, totalDuration));
    setCurrentTime(newTime);
  };

  const getSceneStartTime = (index: number) => {
    return scenes.slice(0, index).reduce((total, s) => total + s.duration, 0);
  };


  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [eta, setEta] = useState<string>('');
  const [exportTime, setExportTime] = useState<number | null>(null);

  const handleExport = async () => {
    if (scenes.length === 0) {
      toast.error('No scenes to export');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setEta('Calculating...');
    setExportTime(null);

    toast.info(`🎬 Exporting ${scenes.length} scenes (Legacy Method)...`);

    const startTime = Date.now();

    try {
      const videoBlob = await exportVideo(scenes, {
        width: canvasSize.width,
        height: canvasSize.height,
        fps: 30,
        useRenderer: false, // Legacy direct Player method
        onProgress: (progress) => {
          const percent = Math.round(progress * 100);
          setExportProgress(percent);

          // Calculate ETA
          if (percent > 0) {
            const elapsed = Date.now() - startTime;
            const estimated = (elapsed / progress) * (1 - progress);
            const seconds = Math.round(estimated / 1000);
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            setEta(mins > 0 ? `${mins}m ${secs}s` : `${secs}s`);
          }
        },
      });

      const totalTime = (Date.now() - startTime) / 1000;
      setExportTime(totalTime);

      // Download the video
      if (videoBlob) {
        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `video-legacy-${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      toast.success(`✅ Video exported in ${totalTime.toFixed(1)}s`);
      console.log(`✅ Export complete: ${totalTime.toFixed(2)}s for ${scenes.length} scenes`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsExporting(false);
      setExportProgress(0);
      setEta('');
    }
  };

  const handleExportWithRenderer = async () => {
    if (scenes.length === 0) {
      toast.error('No scenes to export');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setEta('Calculating...');
    setExportTime(null);

    toast.info(`🎬 Exporting ${scenes.length} scenes (Renderer Method)...`);

    const startTime = Date.now();

    try {
      await exportVideo(scenes, {
        width: canvasSize.width,
        height: canvasSize.height,
        fps: 30,
        useRenderer: true, // Use Revideo Renderer with custom exporter
        onProgress: (progress) => {
          const percent = Math.round(progress * 100);
          setExportProgress(percent);

          // Calculate ETA
          if (percent > 0) {
            const elapsed = Date.now() - startTime;
            const estimated = (elapsed / progress) * (1 - progress);
            const seconds = Math.round(estimated / 1000);
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            setEta(mins > 0 ? `${mins}m ${secs}s` : `${secs}s`);
          }
        },
      });

      const totalTime = (Date.now() - startTime) / 1000;
      setExportTime(totalTime);

      toast.success(`✅ Video exported in ${totalTime.toFixed(1)}s`);
      console.log(`✅ Renderer export complete: ${totalTime.toFixed(2)}s for ${scenes.length} scenes`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsExporting(false);
      setExportProgress(0);
      setEta('');
    }
  };


  return (
    <div className="flex flex-col h-full w-full bg-white select-none">
      {/* Top Control Bar */}
      <div className="h-16 border-b flex items-center justify-between px-4 relative z-20 bg-white">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          <Select defaultValue="youtube">
            <SelectTrigger className="w-[160px] h-9 bg-gray-50 border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Monitor size={14} />
                <span className="text-xs font-medium">YouTube (16:9)</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube">YouTube (16:9)</SelectItem>
              <SelectItem value="tiktok">TikTok (9:16)</SelectItem>
              <SelectItem value="instagram">Instagram (1:1)</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="h-9 bg-gray-50 border-gray-200 rounded-lg text-xs font-medium gap-2 text-gray-700">
            <Scissors size={14} />
            Split tool
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-9 bg-blue-50 border-blue-200 rounded-lg text-xs font-medium gap-2 text-blue-700 hover:bg-blue-100"
            onClick={addScene}
          >
            <Plus size={14} />
            Add Scene
          </Button>
        </div>

        {/* Center Floating Playback Controls */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center gap-4 bg-[#1a1a1a] text-white px-6 py-2.5 rounded-full shadow-xl">
            <span className="text-xs font-mono text-gray-400 w-12 text-right">
              {formatTime(currentTime)}
            </span>

            <div className="flex items-center gap-3">
              <button className="hover:text-gray-300 transition-colors" onClick={() => setCurrentTime(Math.max(0, currentTime - 5))}>
                <SkipBack size={16} fill="currentColor" />
              </button>

              <button
                className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause size={14} fill="currentColor" />
                ) : (
                  <Play size={14} fill="currentColor" className="ml-0.5" />
                )}
              </button>

              <button className="hover:text-gray-300 transition-colors" onClick={() => setCurrentTime(Math.min(totalDuration, currentTime + 5))}>
                <SkipForward size={16} fill="currentColor" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-gray-400 border-l border-gray-700 pl-4 ml-1">
              <Volume2 size={14} />
              <span className="text-xs font-mono">
                {formatTime(totalDuration)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <Button
            variant="default"
            size="sm"
            className="h-8 text-xs font-medium bg-black hover:bg-gray-800 text-white"
            onClick={handleExportWithRenderer}
            disabled={isExporting}
          >
            {isExporting ? `Exporting ${exportProgress}%` : 'Export Video'}
          </Button>

          <div className="h-4 w-px bg-gray-200 mx-1" />

          <div className="flex items-center gap-2 w-32">
            <ZoomOut size={14} className="text-gray-400" />
            <Slider
              value={[zoom]}
              min={10}
              max={200}
              step={10}
              onValueChange={(val) => setZoom(val[0])}
              className="w-full"
            />
            <ZoomIn size={14} className="text-gray-400" />
          </div>

          <div className="h-4 w-px bg-gray-200 mx-1" />

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-black" onClick={reset}>
              <RotateCcw size={14} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-black">
              <RotateCw size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline Area */}
      <div
        className="flex-1 overflow-x-auto overflow-y-hidden relative bg-white custom-scrollbar"
        ref={timelineRef}
      >
        <div
          className="relative h-full min-w-full"
          style={{ width: `${Math.max(100, totalDuration * zoom + 200)}px` }}
        >
          {/* Ruler */}
          <div className="h-8 border-b flex items-end text-[10px] text-gray-400 select-none relative">
            {Array.from({ length: Math.ceil(totalDuration) + 5 }).map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 flex flex-col items-start"
                style={{ left: `${i * zoom}px` }}
              >
                <div className="h-1.5 w-px bg-gray-300 mb-1" />
                <span className="ml-1 -translate-x-1/2">{i}s</span>
                {/* Sub-ticks */}
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="absolute h-1 w-px bg-gray-200"
                    style={{ left: `${(j + 1) * (zoom / 5)}px`, bottom: '4px' }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Tracks */}
          <div className="p-4 relative" onClick={handleTimelineClick}>
            <div className="flex relative h-24">
              {scenes.map((scene, index) => {
                const startTime = getSceneStartTime(index);
                const isActive = currentSceneIndex === index;

                return (
                  <div
                    key={scene.id}
                    className={cn(
                      "absolute top-0 h-full rounded-xl overflow-hidden border-2 transition-all group cursor-pointer",
                      isActive ? "border-blue-500 z-10 ring-2 ring-blue-500/20" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    )}
                    style={{
                      left: `${startTime * zoom}px`,
                      width: `${scene.duration * zoom}px`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentScene(index);
                    }}
                  >
                    {/* Scene Content */}
                    <div className="h-full w-full relative">
                      {/* Background/Thumbnail placeholder */}
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-rose-100 opacity-50" />

                      {/* Content */}
                      <div className="relative p-2 flex flex-col justify-between h-full">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-[10px] font-bold shadow-sm">
                            {index + 1}
                          </div>
                          <span className="text-xs font-medium text-gray-700 truncate">{scene.name}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-1">
                            {scene.elements.slice(0, 3).map((el, i) => (
                              <div key={el.id} className="w-4 h-4 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[8px] z-[3-i]">
                                {el.type[0].toUpperCase()}
                              </div>
                            ))}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeScene(scene.id);
                            }}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>

                      {/* Waveform placeholder */}
                      <div className="absolute bottom-0 left-0 right-0 h-8 opacity-20 flex items-end gap-0.5 px-1 pb-1">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gray-900 rounded-full"
                            style={{ height: `${Math.random() * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-px bg-black z-30 pointer-events-none"
            style={{ left: `${currentTime * zoom}px` }}
          >
            <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-black transform rotate-45 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
