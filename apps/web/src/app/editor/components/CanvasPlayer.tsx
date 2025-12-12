'use client';

/**
 * Revideo player component with drag and drop using signals
 * 
 * 
 see when migrated tomut scene project sol where we create project on add slide and 
 we create hash to prevent issue of rener or cache not sure which 
 but with this we faced a probel which is 
 User changes fontSize → Store updates → CanvasPlayer detects change → 
Need to reload/refresh player → This is expensive and can break things
to do that we passed the complete store to player as var but 
since it strigify's internally we cannot have store which has func inside it
this causes [setting variabes ] to player which have the func cause this error
cannot set props gettter revideopaluer
 */
import { Crosshair } from "lucide-react"
import { useRef, useState, useEffect } from 'react';
import { Player } from '@revideo/player-react';
import { Player as CorePlayer, Vector2 } from '@revideo/core';
import { useProjectStore } from '@/store/projectStore';
import { useElementDragAndDrop } from '@/hooks/drag_and_control/useElementDragAndDrop';
import { usePlayerSync } from '@/hooks/usePlayerSync';
import { usePlayerMatrix } from '@/hooks/usePlayerMatrix';
import { useThrottledRender } from '@/hooks/useThrottledRender';
import { useMoveableHandlers } from '@/hooks/drag_and_control/useMoveableHandlers';
import Moveable from 'react-moveable';
import { useSceneStore } from '@/store/sceneStore';


export const CanvasPlayer = () => {
  // Store selectors - subscribe to projects array to detect changes
  const currentProjectId = useProjectStore((state) => state.currentProjectId);
  const projects = useProjectStore((state) => state.projects);
  const currentProject = projects.find(p => p.id === currentProjectId) || null;
  const scenes = currentProject?.scenes || [];
  const canvasSize = useProjectStore((state) => state.canvasSize);
  const currentSceneIndex = useSceneStore((state) => state.currentSceneIndex);
  const isPlaying = useSceneStore((state) => state.isPlaying);
  const setCurrentTime = useSceneStore((state) => state.setCurrentTime);
  const updateElementInScene = useSceneStore((state) => state.updateElementInScene);
  const zoomTargetOverlay = useSceneStore((state) => state.zoomTargetOverlay);
  const playMode = useSceneStore((state) => state.playMode);
  // Subscribe to refresh trigger (force re-render without reload)
  const refreshTrigger = useSceneStore((state) => state.refreshTrigger);

  // Get Revideo project from store (auto-created when scenes change)
  const revideoProject = useProjectStore((state) => state.revideoProject);
  const recreateRevideoProject = useProjectStore((state) => state.recreateRevideoProject);

  // Create project on mount if it doesn't exist
  useEffect(() => {
    if (!revideoProject) {
      recreateRevideoProject();
    }
  }, [revideoProject, recreateRevideoProject]);

  // Use the project from store
  const project = revideoProject;

  const playerRef = useRef<CorePlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerRect, setPlayerRect] = useState<DOMRect | null>(null);

  const rotationRef = useRef(0);

  // Player synchronization hooks
  usePlayerSync({ playerRef, isPlaying, currentSceneIndex, scenes });
  const transformMatrix = usePlayerMatrix(playerRect);

  // Use drag and drop hook with signals
  const {
    selectedElementId,
    overlayBoxRef,
    draggingElement,
    handlePointerDown,
    storeInitialState,
    getComputedCenter,
    dragTranslateXSignal,
    dragTranslateYSignal,
    initialLeftSignal,
    getRotation,
    initialTopSignal,
  } = useElementDragAndDrop({
    playerRef,
    playerRect,
    transformMatrix,
    scenes,
    currentSceneIndex,
  });

  const handlePlayerReady = (player: CorePlayer) => {
    playerRef.current = player;
    // Set variables immediately when player is ready (MCP docs recommendation)
    player.setVariables({ scenes, currentSceneIndex, playMode });

    // Expose player to window for effect preview
    (window as any).__revideoPlayer = player;

    const event = new CustomEvent('revideo-player-ready', { detail: player });
    window.dispatchEvent(event);
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  // NOTE: Duration is now extracted and set when adding video elements
  // via getVideoMetadata() in AddElements.tsx and SceneElementPanel.tsx

  // Throttle render requests to max 60fps
  const throttledRender = useThrottledRender(playerRef);

  // Sync rotation ref when selection changes
  useEffect(() => {
    rotationRef.current = getRotation();
  }, [selectedElementId, getRotation]);

  const togglePlay = () => {
    useSceneStore.getState().setIsPlaying(!isPlaying);
  };

  // Update canvas size dynamically when aspect ratio changes
  useEffect(() => {
    if (project) {
      project.settings.shared.size = new Vector2(canvasSize.width, canvasSize.height);
      if (playerRef.current) {
        playerRef.current.requestSeek(playerRef.current.status.time);
      }
    }
  }, [canvasSize.width, canvasSize.height, project]);

  // Get serializable scene data FRESH from store (not closure!)
  const getSerializableScenes = () => {
    // Get fresh data directly from store to avoid stale closure issue
    const store = useProjectStore.getState();
    const project = store.projects.find(p => p.id === store.currentProjectId);
    const freshScenes = project?.scenes || [];

    return freshScenes.map(s => ({
      id: s.id,
      name: s.name,
      duration: s.duration,
      elements: s.elements?.map(e => ({
        id: e.id,
        type: e.type,
        properties: e.properties,
      })),
      background: s.background,
      transition: s.transition,
      audioTracks: s.audioTracks,
    }));
  };

  // Handle scene changes with smart hash (excludes position for drag support)
  const prevSceneHashRef = useRef<string>('');
  useEffect(() => {
    if (!playerRef.current) return;

    // Get FRESH data from store (not stale closure!)
    const freshScenes = getSerializableScenes();

    // Hash includes ALL properties (including x/y) to ensure persistence
    const sceneHash = JSON.stringify(freshScenes.map(s => ({
      id: s.id,
      name: s.name,
      duration: s.duration,
      background: s.background,
      transition: s.transition,
      elements: s.elements?.map(e => {
        return { id: e.id, type: e.type, props: e.properties };
      }),
    })));

    // Only reload if something changed
    if (prevSceneHashRef.current !== sceneHash && prevSceneHashRef.current !== '') {
      console.log('📦 Scene properties changed, updating variables for next run...');

      // Update variables so FUTURE renders (e.g. replay, scrub) use new data
      // Do NOT seek here - seeking causes scene to reset to baked data
      playerRef.current.setVariables({
        scenes: freshScenes,
        currentSceneIndex
      });

      console.log('✅ Variables updated (will take effect on next scene run)');
    }
    prevSceneHashRef.current = sceneHash;
  }, [scenes, currentSceneIndex]);

  // Handle forced refresh/render (from StyleSettings property updates)
  useEffect(() => {
    if (!playerRef.current) return;

    // Use requestRender() to repaint canvas WITHOUT seeking
    // This preserves current scene state while showing updated node properties
    playerRef.current.requestRender();

    console.log('🎨 Forced re-render via requestRender()');
  }, [refreshTrigger]);

  // Get Moveable handlers
  const {
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleResizeStart,
    handleResize,
    handleResizeEnd,
    handleRotate,
    handleRotateEnd,
  } = useMoveableHandlers({
    playerRef,
    playerRect,
    transformMatrix,
    draggingElement,
    rotationRef,
    selectedElementId,
    scenes,
    currentSceneIndex,
    updateElementInScene,
    throttledRender,
    storeInitialState,
    getComputedCenter,
    dragTranslateXSignal,
    dragTranslateYSignal,
    initialLeftSignal,
    initialTopSignal,
  });


  return (
    <div
      ref={containerRef}
      className="relative w-full bg-gray-50 overflow-hidden shadow-lg"
      onPointerDown={handlePointerDown}
    >
      {project ? (
        <Player
          project={project}
          onPlayerReady={handlePlayerReady}
          onTimeUpdate={handleTimeUpdate}
          onPlayerResize={(rect: DOMRect) => setPlayerRect(rect)}
          controls={false}
          // playing={isPlaying}
          playing={true}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading project...</p>
        </div>
      )}

      {/* DOM overlay for selection box */}
      <div
        ref={overlayBoxRef}
        className="absolute overlay-box"
        style={{
          display: 'none',
          boxSizing: 'border-box',
        }}
      />

      {/* Zoom Target Crosshair Overlay */}
      {zoomTargetOverlay.visible && playerRect && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            // Convert scene coordinates to screen coordinates
            // Scene center (0,0) maps to player center
            left: `${(playerRect.width / 2) + (zoomTargetOverlay.x / canvasSize.width * playerRect.width)}px`,
            top: `${(playerRect.height / 2) - (zoomTargetOverlay.y / canvasSize.height * playerRect.height)}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Crosshair SVG */}
          <Crosshair />
          {/* Coordinate label */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
            {Number(zoomTargetOverlay.x || 0).toFixed(0)}, {Number(zoomTargetOverlay.y || 0).toFixed(0)}
          </div>
        </div>
      )}

      {/* React Moveable with auto-sync observers */}
      {selectedElementId && overlayBoxRef.current && (
        <Moveable
          className="canvas-moveable"
          target={overlayBoxRef.current}
          draggable={true}
          resizable={true}
          rotatable={true}
          keepRatio={false}
          throttleDrag={0}
          throttleResize={0}
          throttleRotate={0}
          renderDirections={['nw', 'ne', 'se', 'sw']}
          edge={false}
          useResizeObserver={true}
          useMutationObserver={true}
          transformOrigin={['50%', '50%']}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onResizeStart={handleResizeStart}
          onResize={handleResize}
          onResizeEnd={handleResizeEnd}
          onRotate={handleRotate}
          onRotateEnd={handleRotateEnd}
        />
      )}
    </div>
  );
}