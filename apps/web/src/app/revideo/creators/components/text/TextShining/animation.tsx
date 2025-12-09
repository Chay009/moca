/** @jsxImportSource @revideo/2d/lib */

/**
 * Text Shining Component - Returns JSX node
 * Following background pattern - returns JSX directly
 */

import { Txt, Layout } from '@revideo/2d';

export function createTextShining(props: any) {
  const { elementId, ...layoutProps } = props;

  return (
    <Layout
      key={elementId}
      width={props.width ?? 800}
      height={props.height ?? 200}
      x={props.x ?? 0}
      y={props.y ?? 0}
      rotation={props.rotation ?? 0}
      scale={props.scale ?? 1}
      opacity={props.opacity ?? 1}
      {...layoutProps}
    >
      <Txt
        text={props.text ?? 'Shining Text'}
        fontSize={props.fontSize ?? 80}
        fontFamily={props.fontFamily ?? 'Arial'}
        fontWeight={props.fontWeight ?? 'bold'}
        fill={props.fill ?? '#ffffff'}
        {...layoutProps}
      />
    </Layout>
  );
}
