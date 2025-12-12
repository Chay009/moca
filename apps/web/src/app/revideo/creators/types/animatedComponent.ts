/**
 * Animated Component Type Definition
 * Components return this type to support the animation system
 */

import type { ThreadGenerator } from '@revideo/core';

export interface AnimatedComponent {
  /** The JSX node to render */
  node: any;

  /** Primary ref to the node (for single-node components) */
  ref?: any;

  /** Multiple refs (for multi-node components like character-split text) */
  refs?: any[];

  /** Optional animation function that yields animation generators */
  animate?: () => ThreadGenerator;
}
