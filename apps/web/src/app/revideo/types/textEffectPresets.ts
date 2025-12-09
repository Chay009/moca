/**
 * Text Effect Preset Type Definitions
 * Defines configuration interfaces for all text effect presets
 */
import { BaseComponentProps } from './base';
import { TextEffectPresetType } from '../creators/components/text/constants';

// ==================== BASE CONFIG ====================

/**
 * Base configuration for all text effect presets
 * Includes common Motion Canvas text properties + custom effect properties
 */
export interface BaseTextEffectPresetConfig extends BaseComponentProps {
  // Element identification (for selection/drag)
  elementId?: string;

  // Text content
  text: string;

  // Typography
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number | string;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;

  // Visual styling
  fill?: string;
  stroke?: string;
  lineWidth?: number;

  // Effect-specific custom properties
  customProps?: Record<string, any>;
}

// ==================== SHINING TEXT ====================

export interface ShiningTextCustomProps {
  shineOpacity?: number;      // 0-1, default 0.6
  shineSpeed?: number;         // Animation speed multiplier, default 1
  shineAngle?: number;         // Angle in degrees, default 45
  shineWidth?: number;         // Width of shine effect, default 100
}

export interface ShiningTextConfig extends BaseTextEffectPresetConfig {
  customProps?: ShiningTextCustomProps;
}

// ==================== GLITTER TEXT ====================

export interface GlitterTextCustomProps {
  particleCount?: number;      // Number of particles, default 50
  sparkleIntensity?: number;   // 0-1, default 0.8
  particleSize?: number;       // Particle size in pixels, default 3
  sparkleSpeed?: number;       // Animation speed, default 1
  particleColor?: string;      // Particle color, defaults to text fill
}

export interface GlitterTextConfig extends BaseTextEffectPresetConfig {
  customProps?: GlitterTextCustomProps;
}

// ==================== NEON TEXT ====================

export interface NeonTextCustomProps {
  glowIntensity?: number;      // Glow blur amount, default 20
  glowColor?: string;          // Glow color, defaults to text fill
  pulseSpeed?: number;         // Pulse animation speed, default 0.5
  strokeGlow?: boolean;        // Apply glow to stroke, default true
  innerGlow?: boolean;         // Add inner glow, default false
}

export interface NeonTextConfig extends BaseTextEffectPresetConfig {
  customProps?: NeonTextCustomProps;
}

// ==================== GRADIENT FLOW TEXT ====================

export interface GradientFlowTextCustomProps {
  gradientColors?: string[];   // Array of colors, default ['#ff0080', '#ff8c00', '#40e0d0']
  flowSpeed?: number;          // Animation speed, default 1
  gradientAngle?: number;      // Gradient angle in degrees, default 90
  animated?: boolean;          // Animate gradient, default true
  gradientType?: 'linear' | 'radial'; // Gradient type, default 'linear'
}

export interface GradientFlowTextConfig extends BaseTextEffectPresetConfig {
  customProps?: GradientFlowTextCustomProps;
}

// ==================== OUTLINE POP TEXT ====================

export interface OutlinePopTextCustomProps {
  outlineColor?: string;       // Outline color, default '#ff00ff'
  maxOutlineWidth?: number;    // Maximum outline width, default 10
  popSpeed?: number;           // Animation speed, default 1
  loop?: boolean;              // Loop animation, default true
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'; // Easing function
}

export interface OutlinePopTextConfig extends BaseTextEffectPresetConfig {
  customProps?: OutlinePopTextCustomProps;
}

// ==================== SHADOW PULSE TEXT ====================

export interface ShadowPulseTextCustomProps {
  shadowColor?: string;        // Shadow color, default '#000000'
  maxShadowBlur?: number;      // Maximum shadow blur, default 40
  pulseSpeed?: number;         // Pulse speed, default 0.8
  shadowOpacity?: number;      // Shadow opacity 0-1, default 0.7
  shadowOffsetX?: number;      // Shadow X offset, default 0
  shadowOffsetY?: number;      // Shadow Y offset, default 0
}

export interface ShadowPulseTextConfig extends BaseTextEffectPresetConfig {
  customProps?: ShadowPulseTextCustomProps;
}

// ==================== CHROMATIC TEXT ====================

export interface ChromaticTextCustomProps {
  offsetDistance?: number;     // RGB split distance, default 5
  redAngle?: number;           // Red channel angle, default 0
  greenAngle?: number;         // Green channel angle, default 120
  blueAngle?: number;          // Blue channel angle, default 240
  animated?: boolean;          // Animate chromatic aberration, default true
  animationSpeed?: number;     // Animation speed, default 1
}

export interface ChromaticTextConfig extends BaseTextEffectPresetConfig {
  customProps?: ChromaticTextCustomProps;
}

// ==================== LIQUID TEXT ====================

export interface LiquidTextCustomProps {
  waveAmplitude?: number;      // Wave height, default 10
  waveFrequency?: number;      // Wave frequency, default 2
  flowSpeed?: number;          // Flow animation speed, default 0.5
  viscosity?: number;          // Liquid viscosity 0-1, default 0.7
  direction?: 'horizontal' | 'vertical' | 'radial'; // Flow direction
}

export interface LiquidTextConfig extends BaseTextEffectPresetConfig {
  customProps?: LiquidTextCustomProps;
}

// ==================== UNION TYPES ====================

/**
 * Union type of all text effect preset configs
 */
export type TextEffectPresetConfig =
  | ShiningTextConfig
  | GlitterTextConfig
  | NeonTextConfig
  | GradientFlowTextConfig
  | OutlinePopTextConfig
  | ShadowPulseTextConfig
  | ChromaticTextConfig
  | LiquidTextConfig;

/**
 * Map of preset types to their custom props interfaces
 */
export interface TextEffectPresetCustomPropsMap {
  shining: ShiningTextCustomProps;
  glitter: GlitterTextCustomProps;
  neon: NeonTextCustomProps;
  'gradient-flow': GradientFlowTextCustomProps;
  'outline-pop': OutlinePopTextCustomProps;
  'shadow-pulse': ShadowPulseTextCustomProps;
  chromatic: ChromaticTextCustomProps;
  liquid: LiquidTextCustomProps;
}

/**
 * Helper type to get custom props type from preset type
 */
export type GetCustomProps<T extends TextEffectPresetType> =
  T extends keyof TextEffectPresetCustomPropsMap
    ? TextEffectPresetCustomPropsMap[T]
    : never;
