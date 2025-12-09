

/**
 * Custom hook for drag and drop functionality using Revideo signals
 */
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Player as CorePlayer } from '@revideo/core';
import { Scene2D, Shape } from '@revideo/2d';
import { createSignal } from '@revideo/core';
import { useSceneStore, type SceneElement } from '@/store/sceneStore';


interface UseDragAndDropOptions {
  playerRef: React.RefObject<CorePlayer | null>;
  playerRect: DOMRect | null;
  transformMatrix: DOMMatrix | null;
  scenes: any[];
  currentSceneIndex: number;
}

export function useElementDragAndDrop({
  playerRef,
  playerRect,
  transformMatrix,
  scenes,
  currentSceneIndex,
}: UseDragAndDropOptions) {
  // Use props instead of store selectors
  const currentIndex = currentSceneIndex;

  // Refs for stable references
  const currentSceneRef = useRef(scenes[currentIndex]);

  // Signals for drag/resize state
  const initialLeftSignal = useRef(createSignal(0));
  const initialTopSignal = useRef(createSignal(0));
  const initialWidthSignal = useRef(createSignal(0));
  const initialHeightSignal = useRef(createSignal(0));
  const dragTranslateXSignal = useRef(createSignal(0));
  const dragTranslateYSignal = useRef(createSignal(0));

  // Local state for selection (no re-renders from store)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Sync to store for other components (PropertyPanel) - one way only
  const syncSelectedToStore = useSceneStore((state) => state.setSelectedElementId);

  // Drag state
  const [draggingElement, setDraggingElement] = useState<{ id: string; node: Shape } | null>(null);
  const overlayBoxRef = useRef<HTMLDivElement | null>(null);

  // Keep refs in sync
  // Build element map only when elements actually change
  const elementMap = useMemo(() => {
    const map = new Map<string, SceneElement>();
    if (scenes[currentIndex]) {
      scenes[currentIndex].elements.forEach((el) => {
        map.set(el.id, el);
      });
    }
    console.log('🗺️ ElementMap rebuilt, size:', map.size, 'keys:', Array.from(map.keys()));
    return map;
  }, [scenes, currentIndex]);

  useEffect(() => {
    setSelectedElementId(null);
    syncSelectedToStore(null);
    setDraggingElement(null);

    // Hide overlay box
    if (overlayBoxRef.current) {
      overlayBoxRef.current.style.display = 'none';
    }
  }, [currentIndex, syncSelectedToStore]);

  // ✅ ENHANCED: Sync overlay box with node position on player/viewport resize
  useEffect(() => {
    if (!selectedElementId || !draggingElement || !overlayBoxRef.current || !playerRect || !transformMatrix) {
      return;
    }

    const node = draggingElement.node;

    try {
      // Get node's current world position
      const worldMatrix = node.localToWorld();
      const centerPoint = new DOMPoint(worldMatrix.m41, worldMatrix.m42);

      // Convert to screen coordinates
      const screenCenter = centerPoint.matrixTransform(transformMatrix.inverse());

      // Calculate screen-space dimensions
      // For text nodes, width() and height() already include the scale effect
      const screenWidth = node.width() / transformMatrix.a;
      const screenHeight = node.height() / transformMatrix.d;

      const rotation = node.rotation?.() || 0;
      // node.scaleX?.(); later for image or so try this once set then replace the text in this or usemovableahnd;ers
      // with scale instead of fontsize

      // Update overlay box with new screen coordinates
      overlayBoxRef.current.style.left = `${screenCenter.x - screenWidth / 2 - playerRect.left}px`;
      overlayBoxRef.current.style.top = `${screenCenter.y - screenHeight / 2 - playerRect.top}px`;
      overlayBoxRef.current.style.width = `${screenWidth}px`;
      overlayBoxRef.current.style.height = `${screenHeight}px`;
      overlayBoxRef.current.style.transform = `rotate(${rotation}deg)`;
      overlayBoxRef.current.style.transformOrigin = 'center center';

      // ✅ CRITICAL: Update signals with new baseline values
      // This ensures next drag/resize starts from correct position
      initialLeftSignal.current(screenCenter.x - screenWidth / 2 - playerRect.left);
      initialTopSignal.current(screenCenter.y - screenHeight / 2 - playerRect.top);
      initialWidthSignal.current(screenWidth);
      initialHeightSignal.current(screenHeight);

      console.log('🔄 Overlay synced on resize:', {
        screenWidth,
        screenHeight,
        left: screenCenter.x - screenWidth / 2 - playerRect.left,
        top: screenCenter.y - screenHeight / 2 - playerRect.top
      });

    } catch (error) {
      console.error('Error syncing overlay on resize:', error);
    }
  }, [playerRect, transformMatrix, selectedElementId, draggingElement]);

  // Store initial state in signals
  const storeInitialState = useCallback((target: HTMLElement) => {
    initialLeftSignal.current(parseFloat(target.style.left || '0'));
    initialTopSignal.current(parseFloat(target.style.top || '0'));
    initialWidthSignal.current(parseFloat(target.style.width || '0'));
    initialHeightSignal.current(parseFloat(target.style.height || '0'));
    dragTranslateXSignal.current(0);
    dragTranslateYSignal.current(0);
  }, []);

  // Computed center position (reactive)
  const getComputedCenter = useCallback((width: number, height: number) => {
    if (!playerRect) return { x: 0, y: 0 };

    const centerX =
      initialLeftSignal.current() +
      width / 2 +
      dragTranslateXSignal.current() +
      playerRect.left;

    const centerY =
      initialTopSignal.current() +
      height / 2 +
      dragTranslateYSignal.current() +
      playerRect.top;

    return { x: centerX, y: centerY };
  }, [playerRect]);

  // Transform point from screen to scene coordinates
  const transformPoint = useCallback((
    x: number,
    y: number,
    matrix: DOMMatrix
  ): { x: number; y: number } => {
    const point = new DOMPoint(x, y);
    const transformedPoint = point.matrixTransform(matrix);
    return { x: transformedPoint.x, y: transformedPoint.y };
  }, []);

  // Handle pointer down - select element
  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!playerRect || !transformMatrix || !currentSceneRef.current) return;

    // Skip if clicking on moveable controls
    const target = event.target as HTMLElement;
    const isMoveableControl = target.classList?.contains('moveable-control') ||
      target.classList?.contains('moveable-line') ||
      target.closest?.('.moveable-control-box');

    if (isMoveableControl) return;

    const { x: sceneX, y: sceneY } = transformPoint(
      event.clientX,
      event.clientY,
      transformMatrix
    );

    const scene = playerRef.current?.playback.currentScene as Scene2D;
    if (!scene) {
      console.log('❌ No scene available');
      return;
    }

    console.log('🖱️ Click at scene coords:', sceneX, sceneY);

    let hitNode = scene.getNodeByPosition(sceneX, sceneY) as Shape;
    console.log('🎯 Hit node:', hitNode, 'key:', hitNode?.key);

    while (hitNode) {
      const elementId = hitNode.key;  // Use key property, not elementId
      console.log('🔍 Checking node key:', elementId, 'in elementMap:', elementMap.has(elementId));

      if (elementId) {
        const element = elementMap.get(elementId);
        if (element) {
          console.log('✅ Found element, selecting:', elementId);
          setDraggingElement({ id: elementId, node: hitNode });
          setSelectedElementId(elementId);
          syncSelectedToStore(elementId);

          // Update overlay box position immediately
          if (overlayBoxRef.current && playerRect) {
            const worldMatrix = hitNode.localToWorld();
            const centerPoint = new DOMPoint(worldMatrix.m41, worldMatrix.m42);
            const screenCenter = centerPoint.matrixTransform(transformMatrix.inverse());

            // Calculate dimensions - width() already includes scale for text nodes
            const width = hitNode.width() / transformMatrix.a;
            const height = hitNode.height() / transformMatrix.d;

            const rotation = hitNode.rotation?.() || 0;

            overlayBoxRef.current.style.display = 'block';
            overlayBoxRef.current.style.left = `${screenCenter.x - width / 2 - playerRect.left}px`;
            overlayBoxRef.current.style.top = `${screenCenter.y - height / 2 - playerRect.top}px`;
            overlayBoxRef.current.style.width = `${width}px`;
            overlayBoxRef.current.style.height = `${height}px`;
            overlayBoxRef.current.style.transform = `rotate(${rotation}deg)`;
            overlayBoxRef.current.style.transformOrigin = 'center center';
          }
          return;
        }
      }
      // Safely get parent - check if parent() method exists
      if (typeof hitNode.parent === 'function') {
        hitNode = hitNode.parent() as Shape;
      } else {
        // No parent method available, stop traversal
        break;
      }
    }

    // Clicked on empty space - clear selection
    setSelectedElementId(null);
    syncSelectedToStore(null);
    setDraggingElement(null);
    if (overlayBoxRef.current) {
      overlayBoxRef.current.style.display = 'none';
    }
  }, [playerRect, transformMatrix, transformPoint, playerRef, elementMap]);
  // the elementmap as dependecy here is key here since we are using usecallback instead
  // of useEffect when clicking on elements it is not detecting whene we are hit the node with 
  //map coz the usecallback cause stale closure-the old elementmap that didnt have the new elements

  // Get current rotation from node
  const getRotation = useCallback(() => {
    if (draggingElement) {
      return draggingElement.node.rotation?.() || 0;
    }
    return 0;
  }, [draggingElement]);

  return {
    selectedElementId,
    overlayBoxRef,
    draggingElement,
    handlePointerDown,
    playerRect,
    transformMatrix,
    initialLeftSignal,
    initialTopSignal,
    initialWidthSignal,
    initialHeightSignal,
    dragTranslateXSignal,
    dragTranslateYSignal,
    storeInitialState,
    getComputedCenter,
    getRotation,
  };
}