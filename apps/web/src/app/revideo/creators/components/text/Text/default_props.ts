import { DEFAULT_COMPONENT_ANIMATION } from '../../../animations';

export const TEXT_DEFAULT_PROPS = {
  text: 'Text',
  fontSize: 50,
  fontFamily: 'Arial',
  fill: '#ffffff',
  rotation: 0,
  scale: 1,
  opacity: 1,
  animation: {
    ...DEFAULT_COMPONENT_ANIMATION,
    textEffect: {
      type: 'none' as const,
      duration: 2,
    },
  },
};
