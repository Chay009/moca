'use client';

/**
 * TextSimple Property Panel
 * Wraps unified text panel with no effect panel
 */
import { TextPropertyPanel } from '../propertyPanel';
import { TextSimpleEffectPanel } from './effectPanel';
import { PropertyPanelProps } from '../../../types/componentPlugin';

export function TextSimplePropertyPanel(props: PropertyPanelProps) {
  return (
    <TextPropertyPanel
      {...props}
      effectPanel={<TextSimpleEffectPanel />}
    />
  );
}
