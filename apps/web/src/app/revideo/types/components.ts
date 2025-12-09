/**
 * Specific component type definitions
 */
import { BaseComponentProps } from './base';

// ==================== TEXT EFFECT TYPES ====================

export type TextEffect =
  | 'none'
  | 'typewriter'
  | 'glitch'
  | 'wave'
  | 'bounce-letters'
  | 'fade-letters'
  | 'gradient-shift'
  | 'split-reveal'
  | 'scramble'
  | 'rainbow'
  | 'blur-in'
  | 'elastic';

export interface TextEffectConfig {
  type: TextEffect;
  duration?: number;
  delay?: number;
  stagger?: number;      // Delay between letters
  intensity?: number;    // Effect intensity
  custom?: Record<string, any>;
}

// ==================== TEXT COMPONENT ====================

export interface TextComponentProps extends BaseComponentProps {
  type: 'text' | 'animated-text';

  // Text effect
  effect?: TextEffectConfig;

  // Gradient text
  gradient?: {
    colors: string[];
    angle?: number;
  };

  // Outline
  outline?: {
    color: string;
    width: number;
  };
}

// ==================== SHAPE COMPONENTS ====================

export interface RectComponentProps extends BaseComponentProps {
  type: 'rect';

  // Rounded corners (per corner)
  radiusTopLeft?: number;
  radiusTopRight?: number;
  radiusBottomRight?: number;
  radiusBottomLeft?: number;
}

export interface CircleComponentProps extends BaseComponentProps {
  type: 'circle';

  // Circle specific
  startAngle?: number;
  endAngle?: number;
  closed?: boolean;
}

export interface LineComponentProps extends BaseComponentProps {
  type: 'line';

  points?: { x: number; y: number }[];

  // Arrow
  startArrow?: boolean;
  endArrow?: boolean;
  arrowSize?: number;
}

export interface PolygonComponentProps extends BaseComponentProps {
  type: 'polygon';

  sides?: number;
  points?: { x: number; y: number }[];
}

// ==================== MEDIA COMPONENTS ====================

export interface ImageComponentProps extends BaseComponentProps {
  type: 'image';

  // Image specific
  src: string;
  alt?: string;
}

export interface VideoComponentProps extends BaseComponentProps {
  type: 'video';

  // Video specific
  src: string;
  poster?: string;
  trim?: {
    start: number;
    end: number;
  };
}

export interface AudioComponentProps extends BaseComponentProps {
  type: 'audio';

  // Audio specific (no visual representation)
  src: string;
}

// ==================== CUSTOM COMPONENTS ====================

export interface ButtonComponentProps extends BaseComponentProps {
  type: 'button';

  label: string;

  // Button states
  hoverColor?: string;
  activeColor?: string;
  disabledColor?: string;

  // Icon
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export interface CardComponentProps extends BaseComponentProps {
  type: 'card';

  // Content
  title?: string;
  description?: string;
  image?: string;

  // Styling
  borderWidth?: number;
  borderColor?: string;
  elevation?: number;    // Shadow elevation
}

export interface BadgeComponentProps extends BaseComponentProps {
  type: 'badge';

  label: string;

  // Badge variants
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export interface IconComponentProps extends BaseComponentProps {
  type: 'icon';

  icon: string;         // Icon name or path
  color?: string;
}

export interface ProgressBarComponentProps extends BaseComponentProps {
  type: 'progress';

  value: number;        // 0-100

  // Styling
  barColor?: string;
  backgroundColor?: string;
  showLabel?: boolean;
}

export interface CounterComponentProps extends BaseComponentProps {
  type: 'counter';

  from: number;
  to: number;

  // Formatting
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

// ==================== CONTAINER COMPONENTS ====================

export interface LayoutComponentProps extends BaseComponentProps {
  type: 'layout';

  // Layout is already defined in BaseComponentProps
  children: ComponentProps[];
}

export interface GroupComponentProps extends BaseComponentProps {
  type: 'group';

  children: ComponentProps[];
}

// ==================== UNION TYPE ====================

export type ComponentProps =
  | TextComponentProps
  | RectComponentProps
  | CircleComponentProps
  | LineComponentProps
  | PolygonComponentProps
  | ImageComponentProps
  | VideoComponentProps
  | AudioComponentProps
  | ButtonComponentProps
  | CardComponentProps
  | BadgeComponentProps
  | IconComponentProps
  | ProgressBarComponentProps
  | CounterComponentProps
  | LayoutComponentProps
  | GroupComponentProps;

// Note: ThreeComponentProps is exported separately from threeTypes.ts
