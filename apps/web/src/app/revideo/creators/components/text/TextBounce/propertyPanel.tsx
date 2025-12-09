'use client';

/**
 * TextBounce Property Panel
 * Wraps unified text panel with bounce effect panel
 */
import { TextPropertyPanel } from '../propertyPanel';
import { TextBounceEffectPanel } from './effectPanel';
import { PropertyPanelProps } from '../../../types/componentPlugin';

export function TextBouncePropertyPanel(props: PropertyPanelProps) {
  return (
    <TextPropertyPanel
      {...props}
      effectPanel={<TextBounceEffectPanel element={props.element} onUpdate={props.onUpdate} />}
    />
  );
}
