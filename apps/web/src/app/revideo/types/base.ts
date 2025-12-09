/**
 * Base component types with full Motion Canvas/Revideo property support
 */

// ==================== ANIMATION SYSTEM ====================

export type AnimationPreset =
  | 'none'
  | 'fade-in'
  | 'fade-out'
  | 'slide-in-left'
  | 'slide-in-right'
  | 'slide-in-up'
  | 'slide-in-down'
  | 'scale-in'
  | 'scale-out'
  | 'bounce-in'
  | 'rotate-in'
  | 'flip-in'
  | 'elastic-in'
  | 'custom';

export type EasingFunction =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'spring'
  | 'bounce';

export interface AnimationKeyframe {
  time: number;           // Time in seconds
  properties: Record<string, any>;
  easing?: EasingFunction;
}

export interface AnimationConfig {
  id?: string;              // Unique animation ID for managing multiple animations (SlideShots feature)
  preset: AnimationPreset;
  duration?: number;        // Duration in seconds (defaults to 1s if not specified)
  delay?: number;
  easing?: EasingFunction;

  // SlideShots-style timing control
  startTime?: number;       // When animation starts in scene (seconds)
  endTime?: number;         // When animation ends (calculated: startTime + duration)

  repeat?: number;
  yoyo?: boolean;
  keyframes?: AnimationKeyframe[];
  customFunction?: string;  // Custom animation code
}

// ==================== AUDIO SYSTEM ====================

export interface AudioConfig {
  src?: string;
  volume?: number;
  playbackRate?: number;
  loop?: boolean;
  startTime?: number;     // When to start playing relative to element appearance
  fadeIn?: number;        // Fade in duration
  fadeOut?: number;       // Fade out duration
}

// ==================== TEXT EFFECTS (SlideShots-style) ====================

export type TextEffectType =
  | 'none'
  | 'shadow'       // Drop shadow
  | 'outline'      // Text outline
  | 'bevel'        // 3D bevel effect
  | 'neon'         // Glowing neon text
  | 'emboss'       // Embossed text
  | 'retro'        // Retro 80s style
  | 'cinematic'    // Movie/cinematic text
  | 'metallic'     // Metallic/chrome text
  | 'noire'        // Film noir style
  | '3d-block'     // 3D block letters
  | 'anaglyph'     // Anaglyph/glitch effect
  | 'vintage'      // Vintage/aged text
  | 'cyberpunk'    // Cyberpunk style
  | 'fire'         // Fiery text
  | 'echo';        // Echo/duplicate text

export interface TextEffectConfig {
  type: TextEffectType;

  // Shadow effect properties
  shadowColor?: string;      // #RRGGBB
  shadowBlur?: number;       // 0-20
  shadowOffsetX?: number;    // -10 to 10
  shadowOffsetY?: number;    // -10 to 10

  // Outline effect properties
  outlineColor?: string;     // #RRGGBB
  outlineWidth?: number;     // 1-5

  // Neon/Glow properties
  glowColor?: string;        // #RRGGBB
  glowIntensity?: number;    // 0-3

  // 3D/Bevel properties
  bevelDepth?: number;       // 0-10
  bevelColor?: string;       // #RRGGBB

  // Fire effect
  fireColors?: string[];     // Array of colors for fire gradient

  // General intensity for effects
  intensity?: number;        // 0-1
  layers?: number;           // Number of layers (for some effects)
}

// ==================== BACKGROUND SYSTEM (SlideShots-style) ====================

export interface ColorBackground {
  type: 'color';
  color: string;             // #RRGGBB
  opacity?: number;          // 0-1
}

export interface GradientBackground {
  type: 'gradient';
  gradientType: 'linear' | 'radial';
  colors: string[];          // Array of color stops
  angle?: number;            // 0-360 (for linear gradients)
  stops?: number[];          // Positions of color stops (0-1)
}

export interface ImageBackground {
  type: 'image';
  src: string;               // Image URL or base64
  fit: 'cover' | 'contain' | 'fill' | 'none';
  position: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'custom';
  opacity?: number;          // 0-1
  positionX?: number;        // Custom X position
  positionY?: number;        // Custom Y position
}

export interface VideoBackground {
  type: 'video';
  src: string;               // Video URL
  fit: 'cover' | 'contain';
  opacity?: number;          // 0-1
  volume?: number;           // 0-1
  playbackRate?: number;
  loop?: boolean;
  autoPlay?: boolean;
}

export type BackgroundConfig = ColorBackground | GradientBackground | ImageBackground | VideoBackground;

// ==================== AUDIO TRACK (SlideShots-style sound library) ====================

export interface AudioTrack {
  id: string;
  name: string;
  src: string;               // URL or data URL
  duration: number;          // In seconds
  format?: string;           // 'mp3', 'wav', etc.
  bitrate?: string;          // '320kbps'
  category?: 'music' | 'effect' | 'sound';
  waveform?: number[];       // Array of amplitude values for visualization
  startTime: number;         // When to start in scene (seconds)
  volume: number;            // 0-1
  loop?: boolean;
  fadeIn?: number;           // Fade in duration
  fadeOut?: number;          // Fade out duration
}

// ==================== BASE PROPERTIES ====================

/**
 * Core transform properties that all visual components share
 */
export interface TransformProperties {
  // Position
  x?: number;
  y?: number;

  // Size
  width?: number;
  height?: number;
  size?: number;          // For circles/squares

  // Transform
  rotation?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  skew?: number;
  skewX?: number;
  skewY?: number;

  // Opacity
  opacity?: number;

  // Z-index/layering
  zIndex?: number;
}

/**
 * Visual styling properties
 */
export interface StyleProperties {
  // Fill
  fill?: string;
  fillOpacity?: number;

  // Stroke
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  lineWidth?: number;
  lineDash?: number[];
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'miter' | 'round' | 'bevel';

  // Shadow
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;

  // Filters
  blur?: number;
  brightness?: number;
  contrast?: number;
  saturate?: number;
  hue?: number;

  // Border radius (for rects)
  radius?: number;
  cornerRadius?: number;

  // Composite
  compositeOperation?: 'source-over' | 'source-in' | 'source-out' | 'source-atop' |
                       'destination-over' | 'destination-in' | 'destination-out' | 'destination-atop' |
                       'lighter' | 'copy' | 'xor' | 'multiply' | 'screen' | 'overlay' | 'darken' |
                       'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' |
                       'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';
}

/**
 * Text-specific properties (full Motion Canvas support)
 */
export interface TextProperties {
  text?: string;

  // Font
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic' | 'oblique';

  // Alignment
  textAlign?: 'left' | 'center' | 'right' | 'justify' | 'start' | 'end';
  textBaseline?: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';
  textDirection?: 'ltr' | 'rtl';

  // Spacing
  letterSpacing?: number;
  lineHeight?: number;
  wordSpacing?: number;

  // Decoration
  textDecoration?: 'none' | 'underline' | 'overline' | 'line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  // Wrapping
  textWrap?: boolean;
  maxWidth?: number;
  maxHeight?: number;

  // Cache (for performance)
  cache?: boolean;
}

/**
 * Media properties (Image, Video)
 */
export interface MediaProperties {
  src?: string;

  // Playback (Video/Audio)
  volume?: number;
  playbackRate?: number;
  loop?: boolean;
  autoPlay?: boolean;

  // Image specific
  smoothing?: boolean;

  // Clipping
  clip?: boolean;

  // Aspect ratio
  aspectRatio?: number;
}

/**
 * Layout properties (for container components)
 */
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

/**
 * Complete base component properties
 */
export interface BaseComponentProps extends
  TransformProperties,
  StyleProperties,
  TextProperties,
  MediaProperties,
  LayoutProperties {

  // Core identification
  elementId?: string;
  type: string;
  name?: string;

  // Animation (single, for backward compatibility)
  animation?: AnimationConfig;

  // Animations array (SlideShots-style: support multiple animations per element)
  animations?: AnimationConfig[];

  // Audio
  audio?: AudioConfig;

  // Text Effects (SlideShots-style)
  textEffect?: TextEffectConfig;

  // Metadata
  metadata?: Record<string, any>;

  // Children (for composite components)
  children?: BaseComponentProps[];
}
