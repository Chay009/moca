/**
 * TextShining Component Types
 * Extends base TxtNodeProperties with shine-specific animation props
 */

import { TxtNodeProperties } from '../textProperties';

/**
 * Shine animation effect configuration
 */
export interface ShineEffectProps {
  /** Opacity of the shine effect (0-1) */
  shineOpacity?: number;

  /** Speed of the shine animation */
  shineSpeed?: number;

  /** Angle of the shine effect in degrees */
  shineAngle?: number;

  /** Width of the shine gradient in pixels */
  shineWidth?: number;
}

/**
 * TextShining component props
 * Inherits all 90+ Motion Canvas Txt properties
 * Adds shine-specific animation properties
 */
export interface TextShiningProps extends TxtNodeProperties, ShineEffectProps {}
