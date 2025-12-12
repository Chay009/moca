/** @jsxImportSource @revideo/2d/lib */

import { Txt } from '@revideo/2d';
import { createRef } from '@revideo/core';

export interface WaveEffectProps {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  duration?: number;
  [key: string]: any;
}

export const waveEffect = {
  createNode: (props: WaveEffectProps) => {
    const ref = createRef<Txt>();

    // Extract effect-specific props
    const { elementId, duration, ...txtProps } = props;

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

  animate: function* (ref: any, props: WaveEffectProps) {
    const txtRef = ref() as Txt;
    const duration = props.duration ?? 2;

    const originalY = txtRef.position.y();
    const waveHeight = 20;

    // Wave up
    yield* txtRef.position.y(originalY - waveHeight, duration * 0.5);
    // Wave down
    yield* txtRef.position.y(originalY, duration * 0.5);
  }
};
