'use client';

/**
 * TextShining Property Panel
 * Wraps unified text panel with shine effect panel
 */
import { TextPropertyPanel } from '../propertyPanel';
import { TextShiningEffectPanel } from './effectPanel';
import { PropertyPanelProps } from '../../../types/componentPlugin';

export function TextShiningPropertyPanel(props: PropertyPanelProps) {
  return (
    <TextPropertyPanel
      {...props}
      effectPanel={<TextShiningEffectPanel element={props.element} onUpdate={props.onUpdate} />}
    />
  );
}
