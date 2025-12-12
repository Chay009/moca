/** @jsxImportSource @revideo/2d/lib */

import { Txt, Layout } from '@revideo/2d';
import { createRef, waitFor, linear, type Reference } from '@revideo/core';

export interface TypewriterEffectProps {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  fontWeight?: number | string;
  fontStyle?: string;
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

export const typewriterEffect = {
  createNode: (props: TypewriterEffectProps) => {
    const textRefs: Reference<Txt>[] = [];
    const layoutRef = createRef<Layout>();

    const text = props.text ?? 'Text';
    const chars = splitIntoCharacters(text);

    // Extract effect-specific props
    const { elementId, duration, ...layoutProps } = props;

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
              textAlign={'center'}
              opacity={0}
            />
          );
        })}
      </Layout>
    );

    return { node, refs: textRefs, ref: layoutRef };
  },

  animate: function* (refs: Reference<Txt>[], props: TypewriterEffectProps) {
    const duration = props.duration ?? 2;
    const charDelay = duration / refs.length;

    for (let i = 0; i < refs.length; i++) {
      yield* refs[i]().opacity(1, 0.05, linear);
      if (i < refs.length - 1) {
        yield* waitFor(charDelay);
      }
    }
  }
};
