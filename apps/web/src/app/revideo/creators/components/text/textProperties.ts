/**
 * Complete Motion Canvas Txt Node Properties
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

import type { TxtProps } from '@revideo/2d'



/**
 * Complete Txt Node Properties
 * Union of all property categories
 */
export type TxtNodeProperties = TxtProps;

/**
 * Property Categories for UI Organization
 * no use of these but did for later undersanig and extensions
 */
export const PROPERTY_CATEGORIES = {
  CONTENT: 'Text Content & Typography',
  TRANSFORM: 'Transform',
  SIZE_LAYOUT: 'Size & Layout',
  SPACING: 'Spacing',
  ALIGNMENT: 'Alignment',
  ANCHORS: 'Position Anchors',
  FILL_STROKE: 'Fill & Stroke',
  SHADOW: 'Shadow',
  RENDERING: 'Rendering & Effects',
  SYSTEM: 'System',
} as const;

/**
 * Helper: Get all property keys by category
 */
export const getPropertiesByCategory = () => ({
  [PROPERTY_CATEGORIES.CONTENT]: [
    'text',
    'fontSize',
    'fontFamily',
    'fontStyle',
    'fontWeight',
    'letterSpacing',
    'lineHeight',
    'textAlign',
    'textDirection',
    'textWrap',
  ],
  [PROPERTY_CATEGORIES.TRANSFORM]: [
    'x',
    'y',
    'position',
    'rotation',
    'scale',
    'scaleX',
    'scaleY',
    'skew',
    'skewX',
    'skewY',
    'offset',
    'offsetX',
    'offsetY',
  ],
  [PROPERTY_CATEGORIES.SIZE_LAYOUT]: [
    'width',
    'height',
    'size',
    'minWidth',
    'minHeight',
    'maxWidth',
    'maxHeight',
    'ratio',
    'layout',
    'direction',
    'wrap',
    'grow',
    'shrink',
    'basis',
  ],
  [PROPERTY_CATEGORIES.SPACING]: [
    'padding',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'margin',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'gap',
    'rowGap',
    'columnGap',
  ],
  [PROPERTY_CATEGORIES.ALIGNMENT]: [
    'justifyContent',
    'alignItems',
    'alignContent',
    'alignSelf',
  ],
  [PROPERTY_CATEGORIES.ANCHORS]: [
    'top',
    'right',
    'bottom',
    'left',
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
    'middle',
  ],
  [PROPERTY_CATEGORIES.FILL_STROKE]: [
    'fill',
    'stroke',
    'lineWidth',
    'lineCap',
    'lineJoin',
    'lineDash',
    'lineDashOffset',
    'strokeFirst',
  ],
  [PROPERTY_CATEGORIES.SHADOW]: [
    'shadowBlur',
    'shadowColor',
    'shadowOffset',
    'shadowOffsetX',
    'shadowOffsetY',
  ],
  [PROPERTY_CATEGORIES.RENDERING]: [
    'opacity',
    'zIndex',
    'filters',
    'shaders',
    'composite',
    'compositeOperation',
    'antialiased',
    'clip',
    'cache',
    'cachePadding',
    'cachePaddingTop',
    'cachePaddingRight',
    'cachePaddingBottom',
    'cachePaddingLeft',
  ],
  [PROPERTY_CATEGORIES.SYSTEM]: [
    'key',
    'ref',
    'children',
    'tagName',
    'spawner',
  ],
});
