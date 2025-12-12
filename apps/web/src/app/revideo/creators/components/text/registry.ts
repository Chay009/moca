/**
 * Text Components Registry
 * All text-based components with their effects
 *
 * feature-later: Add audio prop support for text components
 * - Example: Typewriter effect with typing sound (default audio, user can modify)
 * - Audio should be part of component default props and property panel
 * - Sync audio with text animation timing
 * 
 *   Future implementation would add:
  - audioUrl?: string to default props
  - Audio player in property panel
  - <Audio> node in animation.tsx synced with text timing
 */

import type { ComponentRegistry } from '../../types/componentPlugin';
import { TextComponent } from './Text/index';

export const textComponents: ComponentRegistry = {
  [TextComponent.type]: TextComponent,
};
