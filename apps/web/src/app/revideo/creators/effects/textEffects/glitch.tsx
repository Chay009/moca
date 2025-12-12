/** @jsxImportSource @revideo/2d/lib */

import { Txt } from '@revideo/2d';
import { createRef, waitFor } from '@revideo/core';

export interface GlitchEffectProps {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  duration?: number;
  intensity?: number;
  [key: string]: any;
}

export const glitchEffect = {
  createNode: (props: GlitchEffectProps) => {
    const ref = createRef<Txt>();

    // Extract effect-specific props
    const { elementId, duration, intensity, ...txtProps } = props;

    const node = (
      <Txt
        key={elementId}
        ref={ref}
        text={props.text ?? 'Text'}
        fontSize={props.fontSize ?? 50}
        fontFamily={props.fontFamily ?? 'Arial'}
        fill={props.fill ?? '#ffffff'}
        {...txtProps}
      />
    );

    return { node, ref };
  },

  animate: function* (ref: any, props: GlitchEffectProps) {
    const txtRef = ref() as Txt;
    const duration = props.duration ?? 2;
    const intensity = props.intensity ?? 1;

    const originalX = txtRef.position.x();
    const originalY = txtRef.position.y();
    const glitchAmount = 10 * intensity;

    const iterations = 15;
    const iterDuration = duration / iterations;

    for (let i = 0; i < iterations; i++) {
      const offsetX = (Math.random() - 0.5) * glitchAmount;
      const offsetY = (Math.random() - 0.5) * glitchAmount;

      txtRef.position.x(originalX + offsetX);
      txtRef.position.y(originalY + offsetY);

      yield* waitFor(iterDuration);
    }

    // Reset position
    txtRef.position.x(originalX);
    txtRef.position.y(originalY);
  }
};
