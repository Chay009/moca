/** @jsxImportSource @revideo/2d/lib */

/**
 * Simple Text Component - Motion Canvas Creator
 * Returns plain text node with no effects
 */

import { Txt } from '@revideo/2d';

export function createTextSimple(props: any) {
  const { elementId, ...rest } = props;

  return (
    <Txt
      key={elementId}
      text={props.text ?? 'Text'}
      fontSize={props.fontSize ?? 50}
      fontFamily={props.fontFamily ?? 'Arial'}
      fill={props.fill ?? '#ffffff'}
      {...rest}

    />
  );
}
