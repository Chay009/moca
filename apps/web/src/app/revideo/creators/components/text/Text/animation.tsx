/** @jsxImportSource @revideo/2d/lib */

import { Txt } from '@revideo/2d';
import { createRef } from '@revideo/core';
import type { AnimatedComponent } from '../../../types/animatedComponent';
import { textEffectsRegistry } from '../../../effects/textEffects/registry';

export interface TextProps {
  elementId?: string;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  fontWeight?: number | string;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  animation?: {
    textEffect?: {
      type?: string;
      duration?: number;
      [key: string]: any;
    };
  };
  [key: string]: any;
}

/**
 * Unified Text Component
 * Uses effect registry to support multiple text effects via props
 */
export function createText(props: TextProps): AnimatedComponent {
  const { elementId, animation, ...rest } = props;
  const effectType = animation?.textEffect?.type;
  const effectDuration = animation?.textEffect?.duration ?? 2;

  // Check if effect exists in registry
  const effect = effectType ? textEffectsRegistry[effectType] : null;

  if (effect) {
    // Use effect from registry
    const effectProps = {
      ...rest,
      elementId,
      text: props.text,
      duration: effectDuration,
    };

    const { node, ref, refs } = effect.createNode(effectProps);

    return {
      node,
      ref,
      refs,
      animate: function* () {
        yield* effect.animate(refs || ref, effectProps);
      }
    };
  }

  // Default: simple text with no effect
  const ref = createRef<Txt>();
  const node = (
    <Txt
      key={elementId}
      ref={ref}
      text={props.text ?? 'Text'}
      fontSize={props.fontSize ?? 50}
      fontFamily={props.fontFamily ?? 'Arial'}
      fill={props.fill ?? '#ffffff'}
      fontWeight={props.fontWeight}
      fontStyle={props.fontStyle}
      {...rest}
    />
  );

  return {
    node,
    ref,
    animate: function* () {
      // No animation for default text
    }
  };
}
