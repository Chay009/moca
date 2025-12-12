/** @jsxImportSource @revideo/2d/lib */

import { Txt } from '@revideo/2d';
import { createRef, easeInOutCubic } from '@revideo/core';

export interface BlurEffectProps {
  elementId?: string;
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  duration?: number;
  intensity?: number;
  [key: string]: any;
}

export const blurEffect = {
  createNode: (props: BlurEffectProps) => {
    const { elementId, duration, intensity, ...txtProps } = props;
    const ref = createRef<Txt>();

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

  animate: function* (ref: any, props: BlurEffectProps) {
    const txtRef = ref();
    const duration = props.duration ?? 2;
    const maxBlur = (props.intensity ?? 1) * 20;

    // Blur in, then blur out
    yield* txtRef.filters.blur(maxBlur, duration / 2, easeInOutCubic);
    yield* txtRef.filters.blur(0, duration / 2, easeInOutCubic);
  }
};
