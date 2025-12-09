'use client';

/**
 * Revideo player component with drag and drop using signals
 */
import { Crosshair } from "lucide-react"
import { useRef, useState, useEffect, useMemo } from 'react';
import { Player } from '@revideo/player-react';
import { Player as CorePlayer, Vector2 } from '@revideo/core';
import { useProjectStore } from '@/store/projectStore';
import { getProject } from '../../projects/project';
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

  // Get project instance once - don't recreate on aspect ratio changes
  // This prevents losing scenes when canvas size changes
  const project = useMemo(() => {
    return getProject(); // Only create once on mount
  }, []); // Empty deps - only create once

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
    player.setVariables({ scenes, currentSceneIndex });
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
    project.settings.shared.size = new Vector2(canvasSize.width, canvasSize.height);
    if (playerRef.current) {
      playerRef.current.requestSeek(playerRef.current.status.time);
    }
  }, [canvasSize.width, canvasSize.height, project]);

  // Smart reload detection - only reload for CONTENT changes, skip for zoom-only changes
  const prevContentHashRef = useRef<string>('');

  useEffect(() => {
    if (!playerRef.current) return;

    // Create hash of content WITHOUT zoomEvents (to detect content-only changes)
    const contentHash = JSON.stringify(scenes.map(s => ({
      id: s.id,
      name: s.name,
      duration: s.duration,
      elements: s.elements,
      background: s.background,
      // Deliberately exclude: zoomEvents
    }))) + currentSceneIndex;

    // Update variables first
    playerRef.current.setVariables({ scenes, currentSceneIndex });

    if (prevContentHashRef.current !== contentHash) {
      // Content changed (new element, duration change, etc.) - need reload
      console.log('📺 Content changed, reloading...');
      const currentFrame = playerRef.current.playback.frame;
      playerRef.current.playback.reload();
      playerRef.current.requestSeek(currentFrame);
      prevContentHashRef.current = contentHash;
    } else {
      // Zoom-only change - just refresh current frame without reload
      console.log('🔍 Zoom-only change, no reload');
      playerRef.current.requestSeek(playerRef.current.playback.frame);
    }
  }, [scenes, currentSceneIndex]);

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
      <Player
        project={project}
        onPlayerReady={handlePlayerReady}
        onTimeUpdate={handleTimeUpdate}
        onPlayerResize={(rect: DOMRect) => setPlayerRect(rect)}
        controls={false}
        playing={isPlaying}
      />

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
            {zoomTargetOverlay.x.toFixed(0)}, {zoomTargetOverlay.y.toFixed(0)}
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