/** @jsxImportSource @revideo/2d/lib */

/**
 * Text Bounce Component - Returns JSX node
 * Animations handled by sceneFactory transitions
 */

import { Txt } from '@revideo/2d';

export function createTextBounce(props: any) {
  const { elementId, ...rest } = props;

  return (
    <Txt
      key={elementId}
      text={props.text ?? 'Bounce Text'}
      fontSize={props.fontSize ?? 50}
      fontFamily={props.fontFamily ?? 'Arial'}
      fill={props.fill ?? '#ffffff'}
      {...rest}
    />
  );
}
