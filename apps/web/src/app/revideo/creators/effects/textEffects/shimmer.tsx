/** @jsxImportSource @revideo/2d/lib */

import { Txt, Layout } from '@revideo/2d';
import { createRef, all, waitFor, chain, easeInOutCubic, type Reference } from '@revideo/core';

export interface ShimmerEffectProps {
  elementId?: string;
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  duration?: number;
  [key: string]: any;
}

const splitIntoCharacters = (text: string): string[] => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new (Intl as any).Segmenter('en', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), ({ segment }: any) => segment);
  }
  return Array.from(text);
};

export const shimmerEffect = {
  createNode: (props: ShimmerEffectProps) => {
    const { elementId, duration, ...layoutProps } = props;
    const textRefs: Reference<Txt>[] = [];
    const layoutRef = createRef<Layout>();

    const text = props.text ?? 'Text';
    const chars = splitIntoCharacters(text);

    const node = (
      <Layout
        key={elementId}
        ref={layoutRef}
        layout
        direction="row"
        gap={0}
        alignItems="center"
        {...layoutProps}
      >
        {chars.map((char, index) => {
          const ref = createRef<Txt>();
          textRefs.push(ref);

          return (
            <Txt
              key={`char-${index}`}
              ref={ref}
              text={char === ' ' ? '\u00A0' : char}
              fontSize={props.fontSize ?? 50}
              fontFamily={props.fontFamily ?? 'Arial'}
              fill={props.fill ?? '#ffffff'}
              fontWeight={props.fontWeight}
              fontStyle={props.fontStyle}
            />
          );
        })}
      </Layout>
    );

    return { node, refs: textRefs, ref: layoutRef };
  },

  animate: function* (refs: Reference<Txt>[], props: ShimmerEffectProps) {
    const totalDuration = props.duration ?? 2;
    const stagger = totalDuration / refs.length / 2;

    // Wave of brightness increase then decrease
    yield* all(
      ...refs.map((ref, i) =>
        chain(
          waitFor(i * stagger),
          all(
            ref().fill('#ffff00', 0.3, easeInOutCubic),  // Bright yellow
            ref().scale(1.2, 0.3, easeInOutCubic)
          ),
          all(
            ref().fill(props.fill ?? '#ffffff', 0.3, easeInOutCubic),  // Back to original
            ref().scale(1, 0.3, easeInOutCubic)
          )
        )
      )
    );
  }
};
