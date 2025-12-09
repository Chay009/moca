/**
 * TextBounce Component Types
 * Extends base TxtNodeProperties with bounce-specific animation props
 */

import { TxtNodeProperties } from '../textProperties';

/**
 * Bounce animation effect configuration
 */
export interface BounceEffectProps {
  /** Height of each bounce in pixels */
  bounceHeight?: number;

  /** Number of times to bounce */
  bounceTimes?: number;

  /** Duration of one bounce cycle in seconds */
  bounceDuration?: number;

  /** Delay before bounce animation starts in seconds */
  bounceDelay?: number;
}

/**
 * TextBounce component props
 * Inherits all 90+ Motion Canvas Txt properties
 * Adds bounce-specific animation properties
 */
export interface TextBounceProps extends TxtNodeProperties, BounceEffectProps {}
