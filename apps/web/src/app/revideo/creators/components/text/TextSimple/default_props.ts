/**
 * Simple Text Component - Default Props
 */

import { DEFAULT_COMPONENT_ANIMATION } from '../../../animations';

export const TEXT_SIMPLE_DEFAULT_PROPS = {
  // Text content props (visual)
  text: 'Text',
  fontSize: 50,
  fontFamily: 'Arial',
  fill: '#ffffff',

  // Transform props (visual) - (0, 0) is the center of the canvas in Revideo
  // x: 0,
  // y: 0,
  rotation: 0,
  scale: 1,
  opacity: 1,

  // Animation config (behavior)
  animation: {
    ...DEFAULT_COMPONENT_ANIMATION,
    textEffect: {
      type: 'none' as const,
      duration: 0,
      stagger: 0,
    },
  },
};

