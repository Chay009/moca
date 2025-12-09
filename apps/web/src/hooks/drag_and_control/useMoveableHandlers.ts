/**
 * Moveable event handlers for drag, resize, and rotate operations
 */
import { type RefObject } from 'react';
import { Player as CorePlayer } from '@revideo/core';
import { Shape } from '@revideo/2d';
import { isDeviceComponent } from '@/app/revideo/creators/components/utils';

interface MoveableHandlersOptions {
  playerRef: RefObject<CorePlayer | null>;
  playerRect: DOMRect | null;
  transformMatrix: DOMMatrix | null;
  draggingElement: { id: string; node: Shape } | null;
  rotationRef: RefObject<number>;
  selectedElementId: string | null;
  scenes: any[];
  currentSceneIndex: number;
  updateElementInScene: (sceneId: string, elementId: string, updates: any) => void;
  throttledRender: () => void;
  storeInitialState: (target: HTMLElement) => void;
  getComputedCenter: (width: number, height: number) => { x: number; y: number };
  dragTranslateXSignal: RefObject<(value?: number) => number>;
  dragTranslateYSignal: RefObject<(value?: number) => number>;
  initialLeftSignal: RefObject<(value?: number) => number>;
  initialTopSignal: RefObject<(value?: number) => number>;
}

export function useMoveableHandlers({
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
}: MoveableHandlersOptions) {
  // Store resize values to avoid signal context issues
  let currentResizeValues: { width: number; height: number } | null = null;

  // ==================== DRAG HANDLERS ====================
  const handleDragStart = (e: any) => {
    const { target } = e;
    if (target instanceof HTMLElement) {
      storeInitialState(target);
    }
  };

  const handleDrag = (e: any) => {
    const { target, beforeTranslate } = e;
    if (!(target instanceof HTMLElement)) return;

    const currentRotation = rotationRef.current;
    target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px) rotate(${currentRotation}deg)`;
    dragTranslateXSignal.current(beforeTranslate[0]);
    dragTranslateYSignal.current(beforeTranslate[1]);

    if (draggingElement && playerRect && transformMatrix) {
      const width = parseFloat(target.style.width);
      const height = parseFloat(target.style.height);
      const { x: centerX, y: centerY } = getComputedCenter(width, height);

      const point = new DOMPoint(centerX, centerY);
      const scenePoint = point.matrixTransform(transformMatrix);

      draggingElement.node.position.x(scenePoint.x - 1920 / 2);
      draggingElement.node.position.y(scenePoint.y - 1080 / 2);

      if (playerRef.current) {
        throttledRender();
      }
    }
  };

  const handleDragEnd = (e: any) => {
    const { target, lastEvent } = e;
    if (!(target instanceof HTMLElement) || !lastEvent) return;

    const finalLeft = initialLeftSignal.current() + lastEvent.beforeTranslate[0];
    const finalTop = initialTopSignal.current() + lastEvent.beforeTranslate[1];
    const currentRotation = rotationRef.current;

    target.style.left = `${finalLeft}px`;
    target.style.top = `${finalTop}px`;
    target.style.transform = currentRotation !== 0 ? `rotate(${currentRotation}deg)` : '';

    dragTranslateXSignal.current(0);
    dragTranslateYSignal.current(0);

    if (draggingElement) {
      const finalX = draggingElement.node.position.x();
      const finalY = draggingElement.node.position.y();

      const currentScene = scenes[currentSceneIndex];
      if (currentScene) {
        updateElementInScene(currentScene.id, draggingElement.id, {
          properties: { x: finalX, y: finalY },
        });
        console.log('💾 Saved position:', { x: finalX, y: finalY });
      }
    }
  };

  // ==================== RESIZE HANDLERS ====================
  const handleResizeStart = (e: any) => {
    const { target } = e;
    if (target instanceof HTMLElement) {
      storeInitialState(target);

      // Store initial dimensions and fontSize for resize calculations
      if (draggingElement) {
        const currentScene = scenes[currentSceneIndex];
        const element = currentScene?.elements.find((el: any) => el.id === draggingElement.id);
        const initialFontSize = element?.properties?.fontSize || 50;

        target.setAttribute('data-initial-fontSize', String(initialFontSize));
        target.setAttribute('data-initial-width', target.style.width || '0');
        target.setAttribute('data-initial-height', target.style.height || '0');
      }
    }
  };

  const handleResize = (e: any) => {
    const { target, width, height, drag } = e;
    if (!(target instanceof HTMLElement)) return;

    const currentRotation = rotationRef.current;

    if (draggingElement && playerRect && transformMatrix) {
      const { x: centerX, y: centerY } = getComputedCenter(width, height);

      const point = new DOMPoint(centerX, centerY);
      const scenePoint = point.matrixTransform(transformMatrix);

      draggingElement.node.position.x(scenePoint.x - 1920 / 2);
      draggingElement.node.position.y(scenePoint.y - 1080 / 2);

      // Get the element's current properties
      const currentScene = scenes[currentSceneIndex];
      const element = currentScene?.elements.find((el: any) => el.id === draggingElement.id);

      // Check element type
      const isTextElement = element?.properties?.fontSize !== undefined;
      const isMediaElement = element?.type?.includes('image') || element?.type?.includes('video');
      const isDeviceElement = isDeviceComponent(element?.type, element?.properties);

      if (isTextElement) {
        // For text: change fontSize based on overlay box size change
        const initialFontSize = parseFloat(target.getAttribute('data-initial-fontSize') || '50');
        const initialWidth = parseFloat(target.getAttribute('data-initial-width') || String(width));

        if (initialWidth > 0) {
          // Calculate how much the overlay has grown
          const scaleFactor = width / initialWidth;
          const newFontSize = initialFontSize * scaleFactor;

          // Apply new fontSize to the node
          if (draggingElement.node && typeof draggingElement.node.fontSize === 'function') {
            try {
              draggingElement.node.fontSize(newFontSize);
            } catch (error) {
              // Silently skip if fontSize can't be set
            }
          }
        }
      } else if (isMediaElement || isDeviceElement) {
        // For images, videos, and device mockups: set width/height directly
        // Video components use computedSize() in draw(), not scale
        const sceneWidth = width * transformMatrix.a;
        const sceneHeight = height * transformMatrix.d;

        // Store values for handleResizeEnd (avoid signal context issues)
        currentResizeValues = { width: sceneWidth, height: sceneHeight };

        if (typeof draggingElement.node.width === 'function') {
          draggingElement.node.width(sceneWidth);
        }
        if (typeof draggingElement.node.height === 'function') {
          draggingElement.node.height(sceneHeight);
        }
      } else {
        // For shapes: use scale
        const baseNodeWidth = draggingElement.node?.width();
        const baseNodeHeight = draggingElement.node?.height();
        const sceneWidth = width * transformMatrix.a;
        const sceneHeight = height * transformMatrix.d;
        const scaleX = baseNodeWidth > 0 ? sceneWidth / baseNodeWidth : 1;
        const scaleY = baseNodeHeight > 0 ? sceneHeight / baseNodeHeight : 1;
        const newScale = (scaleX + scaleY) / 2;

        if (typeof draggingElement.node.scale === 'function') {
          draggingElement.node.scale(newScale);
        }
      }

      // Update overlay box - use actual width/height from Moveable
      target.style.width = `${width}px`;
      target.style.height = `${height}px`;
      target.style.transform = `translate(${drag.translate[0]}px, ${drag.translate[1]}px) rotate(${currentRotation}deg)`;

      dragTranslateXSignal.current(drag.translate[0]);
      dragTranslateYSignal.current(drag.translate[1]);

      if (playerRef.current) {
        throttledRender();
      }
    } else {
      // Fallback when no element is being dragged
      target.style.width = `${width}px`;
      target.style.height = `${height}px`;
      target.style.transform = `translate(${drag.translate[0]}px, ${drag.translate[1]}px) rotate(${currentRotation}deg)`;

      dragTranslateXSignal.current(drag.translate[0]);
      dragTranslateYSignal.current(drag.translate[1]);
    }
  };

  const handleResizeEnd = (e: any) => {
    const { target, lastEvent } = e;
    if (!(target instanceof HTMLElement) || !lastEvent) return;

    const finalLeft = initialLeftSignal.current() + lastEvent.drag.translate[0];
    const finalTop = initialTopSignal.current() + lastEvent.drag.translate[1];
    const currentRotation = rotationRef.current;

    target.style.left = `${finalLeft}px`;
    target.style.top = `${finalTop}px`;
    target.style.width = `${lastEvent.width}px`;
    target.style.height = `${lastEvent.height}px`;
    target.style.transform = currentRotation !== 0 ? `rotate(${currentRotation}deg)` : '';

    dragTranslateXSignal.current(0);
    dragTranslateYSignal.current(0);

    if (draggingElement && transformMatrix) {
      const finalX = draggingElement.node.position.x();
      const finalY = draggingElement.node.position.y();

      const currentScene = scenes[currentSceneIndex];
      if (currentScene) {
        const element = currentScene.elements.find((el: any) => el.id === draggingElement.id);
        const isTextElement = element?.properties?.fontSize !== undefined;
        const isMediaElement = element?.type?.includes('image') || element?.type?.includes('video');
        const isDeviceElement = isDeviceComponent(element?.type, element?.properties);

        if (isTextElement) {
          // For text: save fontSize
          const finalFontSize = typeof draggingElement.node.fontSize === 'function'
            ? draggingElement.node.fontSize()
            : element?.properties?.fontSize || 50;

          updateElementInScene(currentScene.id, draggingElement.id, {
            properties: { x: finalX, y: finalY, fontSize: finalFontSize },
          });
          console.log('💾 Saved fontSize/position:', { x: finalX, y: finalY, fontSize: finalFontSize });
        } else if (isMediaElement || isDeviceElement) {
          // For images, videos, and device mockups: save width/height
          // Use stored values from handleResize (MCP docs recommendation)
          const finalWidth = currentResizeValues?.width || element?.properties?.width || 300;
          const finalHeight = currentResizeValues?.height || element?.properties?.height || null;

          updateElementInScene(currentScene.id, draggingElement.id, {
            properties: { x: finalX, y: finalY, width: finalWidth, height: finalHeight },
          });
          console.log('💾 Saved width/height/position:', { x: finalX, y: finalY, width: finalWidth, height: finalHeight });

          // Clear stored values
          currentResizeValues = null;
        } else {
          // For shapes: save scale
          const finalScale = typeof draggingElement.node.scale === 'function'
            ? draggingElement.node.scale()
            : 1;

          updateElementInScene(currentScene.id, draggingElement.id, {
            properties: { x: finalX, y: finalY, scale: finalScale },
          });
          console.log('💾 Saved scale/position:', { x: finalX, y: finalY, scale: finalScale });
        }
      }
    }
  };

  // ==================== ROTATE HANDLERS ====================
  const handleRotate = (e: any) => {
    const { target, beforeDist, drag } = e;
    if (!(target instanceof HTMLElement)) return;

    // beforeDist is the absolute rotation value from Moveable
    target.style.transform = `translate(${drag.translate[0]}px, ${drag.translate[1]}px) rotate(${beforeDist}deg)`;

    if (selectedElementId && playerRef.current?.playback.currentScene) {
      try {
        const scene = playerRef.current.playback.currentScene as any;
        // Try to find node by walking the scene graph
        const findNodeByElementId = (node: any): any => {
          if (node?.elementId === selectedElementId) return node;
          if (node?.children) {
            for (const child of node.children) {
              const found = findNodeByElementId(child);
              if (found) return found;
            }
          }
          return null;
        };

        const node = findNodeByElementId(scene);
        if (node) {
          node.rotation(beforeDist);
          rotationRef.current = beforeDist;
          throttledRender();
        }
      } catch (error) {
        console.error('Error updating rotation during onRotate:', error);
      }
    }
  };

  const handleRotateEnd = (e: any) => {
    const { target, lastEvent } = e;
    if (!(target instanceof HTMLElement) || !lastEvent) return;

    const finalRotation = lastEvent.beforeDist;
    target.style.transform = finalRotation !== 0 ? `rotate(${finalRotation}deg)` : '';

    console.log('🔄 onRotateEnd triggered:', { selectedElementId, finalRotation, currentSceneIndex });

    if (selectedElementId) {
      const currentScene = scenes[currentSceneIndex];
      console.log('📍 Current scene:', currentScene?.id, currentScene?.name);

      if (currentScene) {
        console.log('📝 Updating element:', selectedElementId, 'with rotation:', finalRotation);
        updateElementInScene(currentScene.id, selectedElementId, {
          properties: { rotation: finalRotation },
        });
        console.log('💾 Saved rotation:', finalRotation);
      } else {
        console.warn('⚠️ No current scene found');
      }
    } else {
      console.warn('⚠️ No selectedElementId');
    }
  };

  return {
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleResizeStart,
    handleResize,
    handleResizeEnd,
    handleRotate,
    handleRotateEnd,
  };
}
