/**
 * 

---------------
 we use the props from the revideo and extend for our use case like if we have glow text then we extend it;s props
 ----------
 these props are actually from lib itself but we are using this to understsnd about the props for ai and humans as well these are quick refernce and issue tracling but we use from ib like import type{txtprops} from "...."

 
 Complete Motion Canvas Txt Node Properties
 * All 90+ properties from the Txt API
 * Organized by category for UI implementation
 */

/**
 * this is how it need to be used
 * examples uses of few all of these 
 * <Txt text="Hello World" fontSize={20} fontFamily="Arial" />
 * reference: https://motioncanvas.io/api/2d/components/Txt#Properties
 * if we pass chiledern to txt node
 * <Txt> 
 * {children nodes}
 * </Txt>
 * i believe we don;t need children for text not sure!!
 */
/**
 * Text Content & Typography Properties
 */

import type {TxtProps} from '@revideo/2d'
export interface TextContentProperties {
  /** The text content to display */
  text?: string;

  /** Font size in pixels */
  fontSize?: number;

  /** Font family name (e.g., 'Arial', 'Helvetica') */
  fontFamily?: string;

  /** Font style: 'normal' | 'italic' | 'oblique' */
  fontStyle?: string;

  /** Font weight: 'normal' | 'bold' | '100'-'900' */
  fontWeight?: string | number;

  /** Letter spacing in pixels */
  letterSpacing?: number;

  /** Line height multiplier or pixel value */
  lineHeight?: number | string;

  /** Text alignment: 'left' | 'center' | 'right' | 'start' | 'end' */
  textAlign?: string;

  /** Text direction: 'ltr' | 'rtl' */
  textDirection?: string;

  /** Text wrapping behavior */
  textWrap?: boolean | string;
}

/**
 * Transform Properties
 */
export interface TransformProperties {
  /** X position */
  x?: number;

  /** Y position */
  y?: number;

  /** Position as [x, y] tuple */
  position?: [number, number];

  /** Rotation in degrees */
  rotation?: number;

  /** Uniform scale */
  scale?: number;

  /** X-axis scale */
  scaleX?: number;

  /** Y-axis scale */
  scaleY?: number;

  /** Skew transformation */
  skew?: number;

  /** X-axis skew */
  skewX?: number;

  /** Y-axis skew */
  skewY?: number;

  /** Offset as [x, y] tuple */
  offset?: [number, number];

  /** X offset */
  offsetX?: number;

  /** Y offset */
  offsetY?: number;
}

/**
 * Size & Layout Properties
 */
export interface SizeLayoutProperties {
  /** Width in pixels */
  width?: number;

  /** Height in pixels */
  height?: number;

  /** Size as [width, height] tuple */
  size?: [number, number];

  /** Minimum width */
  minWidth?: number;

  /** Minimum height */
  minHeight?: number;

  /** Maximum width */
  maxWidth?: number;

  /** Maximum height */
  maxHeight?: number;

  /** Aspect ratio */
  ratio?: number;

  /** Layout mode */
  layout?: boolean | string;

  /** Flex direction: 'row' | 'column' | 'row-reverse' | 'column-reverse' */
  direction?: string;

  /** Content wrapping */
  wrap?: string;

  /** Flex grow factor */
  grow?: number;

  /** Flex shrink factor */
  shrink?: number;

  /** Flex basis */
  basis?: number | string;
}

/**
 * Spacing Properties
 */
export interface SpacingProperties {
  /** Padding (all sides) */
  padding?: number;

  /** Padding top */
  paddingTop?: number;

  /** Padding right */
  paddingRight?: number;

  /** Padding bottom */
  paddingBottom?: number;

  /** Padding left */
  paddingLeft?: number;

  /** Margin (all sides) */
  margin?: number;

  /** Margin top */
  marginTop?: number;

  /** Margin right */
  marginRight?: number;

  /** Margin bottom */
  marginBottom?: number;

  /** Margin left */
  marginLeft?: number;

  /** Gap between children */
  gap?: number;

  /** Row gap */
  rowGap?: number;

  /** Column gap */
  columnGap?: number;
}

/**
 * Alignment Properties
 */
export interface AlignmentProperties {
  /** Justify content: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' */
  justifyContent?: string;

  /** Align items: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline' */
  alignItems?: string;

  /** Align content */
  alignContent?: string;

  /** Align self */
  alignSelf?: string;
}

/**
 * Position Anchors
 */
export interface PositionAnchorProperties {
  /** Top anchor */
  top?: number;

  /** Right anchor */
  right?: number;

  /** Bottom anchor */
  bottom?: number;

  /** Left anchor */
  left?: number;

  /** Top-left corner as [x, y] */
  topLeft?: [number, number];

  /** Top-right corner as [x, y] */
  topRight?: [number, number];

  /** Bottom-left corner as [x, y] */
  bottomLeft?: [number, number];

  /** Bottom-right corner as [x, y] */
  bottomRight?: [number, number];

  /** Middle/center position */
  middle?: [number, number];
}

/**
 * Fill & Stroke Properties
 */
export interface FillStrokeProperties {
  /** Fill color (hex, rgb, gradient) */
  fill?: string;

  /** Stroke color */
  stroke?: string;

  /** Stroke width in pixels */
  lineWidth?: number;

  /** Line cap style: 'butt' | 'round' | 'square' */
  lineCap?: string;

  /** Line join style: 'miter' | 'round' | 'bevel' */
  lineJoin?: string;

  /** Line dash pattern [dash, gap] */
  lineDash?: number[];

  /** Line dash offset */
  lineDashOffset?: number;

  /** Whether stroke is drawn first (before fill) */
  strokeFirst?: boolean;
}

/**
 * Shadow Properties
 */
export interface ShadowProperties {
  /** Shadow blur radius */
  shadowBlur?: number;

  /** Shadow color */
  shadowColor?: string;

  /** Shadow offset as [x, y] */
  shadowOffset?: [number, number];

  /** Shadow X offset */
  shadowOffsetX?: number;

  /** Shadow Y offset */
  shadowOffsetY?: number;
}

/**
 * Rendering & Effects Properties
 */
export interface RenderingProperties {
  /** Opacity (0-1) */
  opacity?: number;

  /** Z-index for layering */
  zIndex?: number;

  /** Filters array (blur, brightness, etc.) */
  filters?: any[];

  /** Custom shaders */
  shaders?: any[];

  /** Composite operation: 'source-over' | 'multiply' | 'screen' | etc. */
  composite?: boolean;

  /** Composite operation type */
  compositeOperation?: string;

  /** Enable antialiasing */
  antialiased?: boolean;

  /** Clipping region */
  clip?: boolean;

  /** Enable caching for performance */
  cache?: boolean;

  /** Cache padding (all sides) */
  cachePadding?: number;

  /** Cache padding top */
  cachePaddingTop?: number;

  /** Cache padding right */
  cachePaddingRight?: number;

  /** Cache padding bottom */
  cachePaddingBottom?: number;

  /** Cache padding left */
  cachePaddingLeft?: number;
}

/**
 * React/Motion Canvas System Properties
 */
export interface SystemProperties {
  /** React key */
  key?: string;

  /** React ref */
  ref?: any;

  /** Child nodes */
  children?: any;

  /** HTML tag name (for custom rendering) */
  tagName?: string;

  /** Spawner function for advanced animation */
  spawner?: any;
}