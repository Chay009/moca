/**
 * usePlayerMatrix - Calculates transform matrix for canvas-to-DOM coordinate conversion
 * Extracted from RevideoPlayer for better separation of concerns
 */
import { useEffect, useState } from 'react';
import { useProjectStore } from '@/store/projectStore';

/**
 * Calculates the transform matrix for converting canvas coordinates to DOM coordinates
 * Uses dynamic canvas size from the store to support different aspect ratios
 * @param playerRect - The player's DOM bounding rectangle
 * @returns Transform matrix for coordinate conversion
 */
export function usePlayerMatrix(playerRect: DOMRect | null): DOMMatrix | null {
  const [transformMatrix, setTransformMatrix] = useState<DOMMatrix | null>(null);
  const canvasSize = useProjectStore((state) => state.canvasSize);

  useEffect(() => {
    if (!playerRect) {
      setTransformMatrix(null);
      return;
    }

    // Calculate scale factors (canvas → screen) using dynamic canvas size
    const scaleX = canvasSize.width / playerRect.width;
    const scaleY = canvasSize.height / playerRect.height;

    // Create transform matrix
    const matrix = new DOMMatrix();
    matrix.scaleSelf(scaleX, scaleY);
    matrix.translateSelf(-playerRect.left, -playerRect.top);

    setTransformMatrix(matrix);
  }, [playerRect, canvasSize.width, canvasSize.height]);

  return transformMatrix;
}
