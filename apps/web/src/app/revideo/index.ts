/**
 * Revideo Component System - Main Export
 */

// Types
export * from './types/base';
export * from './types/components';
export * from './types/threeTypes';
export * from './three/types/backgroundTypes';

// Component Factory
export { createComponent } from './creators/componentFactory';

// Default component presets
export const DEFAULT_COMPONENTS = {
  text: {
    type: 'text',
    text: 'New Text',
    fontSize: 50,
    fill: '#ffffff',
    x: 0,
    y: 0,
  },
  'animated-text': {
    type: 'animated-text',
    text: 'Animated Text',
    fontSize: 50,
    fill: '#ffffff',
    x: 0,
    y: 0,
    effect: {
      type: 'typewriter',
      duration: 2,
    },
  },
  rect: {
    type: 'rect',
    width: 200,
    height: 100,
    fill: '#3b82f6',
    radius: 10,
    x: 0,
    y: 0,
  },
  circle: {
    type: 'circle',
    size: 100,
    fill: '#10b981',
    x: 0,
    y: 0,
  },
  image: {
    type: 'image',
    src: '',
    width: 400,
    height: 300,
    x: 0,
    y: 0,
  },
  video: {
    type: 'video',
    src: '',
    width: 640,
    height: 360,
    x: 0,
    y: 0,
  },
  audio: {
    type: 'audio',
    src: '',
    volume: 1,
  },
  button: {
    type: 'button',
    label: 'Click Me',
    width: 200,
    height: 50,
    fill: '#3b82f6',
    fontSize: 16,
    x: 0,
    y: 0,
  },
  card: {
    type: 'card',
    title: 'Card Title',
    description: 'Card description goes here',
    width: 300,
    height: 200,
    fill: '#ffffff',
    borderColor: '#e5e7eb',
    x: 0,
    y: 0,
  },
  badge: {
    type: 'badge',
    label: 'Badge',
    width: 80,
    height: 30,
    fill: '#10b981',
    fontSize: 12,
    x: 0,
    y: 0,
  },
  progress: {
    type: 'progress',
    value: 50,
    width: 200,
    height: 20,
    barColor: '#3b82f6',
    backgroundColor: '#e5e7eb',
    showLabel: true,
    x: 0,
    y: 0,
  },
  counter: {
    type: 'counter',
    from: 0,
    to: 100,
    fontSize: 48,
    fill: '#ffffff',
    x: 0,
    y: 0,
  },
} as const;

// Animation presets
export const ANIMATION_PRESETS = [
  { value: 'none', label: 'None' },
  { value: 'fade-in', label: 'Fade In' },
  { value: 'fade-out', label: 'Fade Out' },
  { value: 'slide-in-left', label: 'Slide In from Left' },
  { value: 'slide-in-right', label: 'Slide In from Right' },
  { value: 'slide-in-up', label: 'Slide In from Bottom' },
  { value: 'slide-in-down', label: 'Slide In from Top' },
  { value: 'scale-in', label: 'Scale In' },
  { value: 'scale-out', label: 'Scale Out' },
  { value: 'bounce-in', label: 'Bounce In' },
  { value: 'rotate-in', label: 'Rotate In' },
  { value: 'flip-in', label: 'Flip In' },
  { value: 'elastic-in', label: 'Elastic In' },
] as const;

// Text effect presets
export const TEXT_EFFECT_PRESETS = [
  { value: 'none', label: 'None' },
  { value: 'typewriter', label: 'Typewriter' },
  { value: 'glitch', label: 'Glitch' },
  { value: 'wave', label: 'Wave' },
  { value: 'bounce-letters', label: 'Bounce Letters' },
  { value: 'fade-letters', label: 'Fade Letters' },
  { value: 'gradient-shift', label: 'Gradient Shift' },
  { value: 'split-reveal', label: 'Split Reveal' },
  { value: 'scramble', label: 'Scramble' },
  { value: 'rainbow', label: 'Rainbow' },
  { value: 'blur-in', label: 'Blur In' },
  { value: 'elastic', label: 'Elastic' },
] as const;
