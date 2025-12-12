/**
 * Element Type Definitions
 * All element property interfaces and types for the Revideo project
 */
import type { AnimationConfig, AudioConfig, TextEffectConfig } from '@/app/revideo';

// Extended element types (supports all component types including Three.js)
export type ElementType =
  | 'text' | 'animated-text'
  | 'rect' | 'circle' | 'line' | 'polygon'
  | 'image' | 'image-simple' | 'video' | 'video-simple' | 'audio'  // Media types
  | 'button' | 'card' | 'badge' | 'progress' | 'counter'
  | 'layout' | 'group'
  | 'three'
  | 'shader'
  | 'text-effect-preset'
  | 'icon';

// ==================== CATEGORY-BASED PROPERTY TYPES ====================
// Organized by responsibility for better maintainability

/** Transform and positioning properties */
export interface TransformProperties {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  size?: number;
  rotation?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  skew?: number;
  skewX?: number;
  skewY?: number;
  opacity?: number;
  zIndex?: number;
}

/** Text rendering and typography properties */
export interface TextProperties {
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number | string;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  textAlign?: 'left' | 'center' | 'right' | 'justify' | 'start' | 'end';
  textBaseline?: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';
  letterSpacing?: number;
  lineHeight?: number;
  wordSpacing?: number;
  textDecoration?: 'none' | 'underline' | 'overline' | 'line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textWrap?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  textColor?: string;
}

/** Fill, stroke, and visual styling properties */
export interface StyleProperties {
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  lineWidth?: number;
  lineDash?: number[];
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'miter' | 'round' | 'bevel';
  radius?: number;
  cornerRadius?: number;
  radiusTopLeft?: number;
  radiusTopRight?: number;
  radiusBottomRight?: number;
  radiusBottomLeft?: number;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  gradient?: {
    colors: string[];
    angle?: number;
  };
  outline?: {
    color: string;
    width: number;
  };
}

/** Shadow and visual effect properties */
export interface EffectProperties {
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  blur?: number;
  brightness?: number;
  contrast?: number;
  saturate?: number;
  hue?: number;
  elevation?: number;
}

/** Media playback properties (video, audio, images) */
export interface MediaProperties {
  src?: string;
  volume?: number;
  playbackRate?: number;
  loop?: boolean;
  autoPlay?: boolean;
  smoothing?: boolean;
  clip?: boolean;
  aspectRatio?: number;
  poster?: string;
  mediaDuration?: number; // Actual duration of video/audio in seconds
  trim?: {
    start: number;
    end: number;
  };
}

/** Layout and flexbox properties */
export interface LayoutProperties {
  layout?: boolean;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  gap?: number;
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  wrap?: boolean;
}

/** Custom composite component properties (buttons, cards, badges, etc.) */
export interface CompositeComponentProperties {
  label?: string;
  title?: string;
  description?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  value?: number;
  from?: number;
  to?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  barColor?: string;
  showLabel?: boolean;
  variant?: string;
  hoverColor?: string;
  activeColor?: string;
  disabledColor?: string;
  titleColor?: string;
  titleFontSize?: number;
  descColor?: string;
  descFontSize?: number;
}

/** Animation configuration properties */
export interface AnimationProperties {
  animation?: AnimationConfig;
  animations?: AnimationConfig[];
}

/** Audio configuration properties */
export interface AudioProperties {
  audio?: AudioConfig;
}

/** Text effect configuration properties */
export interface TextEffectProperties {
  effect?: TextEffectConfig;
}

/** Text effect preset properties */
export interface TextEffectPresetProperties {
  presetType?: TextEffectPresetType; // Uses imported type from constants registry
  customProps?: Record<string, any>;  // Effect-specific custom properties
}

/** Three.js 3D scene properties */
export interface ThreeJSProperties {
  sceneType?: 'cube' | 'sphere' | 'torus' | 'particles' | 'waves' | 'tunnel' | 'galaxy' | 'grid' | 'wireframe' | 'pixelBlast' | 'mesh-gradient' | 'custom';
  cameraType?: 'perspective' | 'orthographic';
  cameraPosition?: { x: number; y: number; z: number };
  cameraRotation?: { x: number; y: number; z: number };
  cameraFov?: number;
  quality?: number;
  rotationSpeed?: number;
  autoRotate?: boolean;
  rotationAxis?: 'x' | 'y' | 'z' | 'all';
  objectColor?: string;
  objectSize?: number;
  objectCount?: number;
  objectShape?: 'cube' | 'sphere' | 'cone' | 'cylinder' | 'torus';
  lightType?: 'ambient' | 'directional' | 'point' | 'spot' | 'hemisphere';
  lightColor?: string;
  lightIntensity?: number;
  lightPosition?: { x: number; y: number; z: number };
  materialType?: 'normal' | 'basic' | 'standard' | 'phong' | 'lambert' | 'wireframe';
  metalness?: number;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  particleSize?: number;
  particleSpread?: number;
  particleSpeed?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  waveSpeed?: number;
  gridSize?: number;
  gridDivisions?: number;
  gridColor?: string;
  tunnelRadius?: number;
  tunnelLength?: number;
  tunnelSegments?: number;
  galaxyArms?: number;
  galaxySize?: number;
  galaxyTwist?: number;
}

/** Shader background properties (PixelBlast and other shaders) */
export interface ShaderProperties {
  variant?: 'square' | 'circle' | 'triangle' | 'diamond';
  pixelSize?: number;
  pixelSizeJitter?: number;
  patternScale?: number;
  patternDensity?: number;
  speed?: number;
  noiseAmount?: number;
  edgeFade?: number;
}

/** Miscellaneous properties */
export interface MiscProperties {
  cache?: boolean;
  metadata?: Record<string, any>;
  duration?: number; // Legacy support
}

/**
 * Combined element properties - intersection of all category types
 * This provides the same interface as before but with better organization
 */
export type ElementProperties =
  & TransformProperties
  & TextProperties
  & StyleProperties
  & EffectProperties
  & MediaProperties
  & LayoutProperties
  & CompositeComponentProperties
  & AnimationProperties
  & AudioProperties
  & TextEffectProperties
  & TextEffectPresetProperties
  & ThreeJSProperties
  & ShaderProperties
  & MiscProperties;

export interface SceneElement {
  id: string;
  type: ElementType;
  properties: ElementProperties;
}
