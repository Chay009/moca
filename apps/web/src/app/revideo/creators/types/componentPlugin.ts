/**
 * Component Plugin System
 * Each component is a self-contained plugin with:
 * - Metadata (type, category, displayName)
 * - Default props
 * - Motion Canvas generator function
 * - Custom React PropertyPanel UI
 */

import { Node } from '@revideo/2d';

export interface ComponentPlugin {
  /** Unique component type identifier (e.g., 'text-bounce') */
  type: string;

  /** Component category for organization (e.g., 'text', 'shapes', 'media') */
  category: string;

  /** Display name shown in UI (e.g., 'Text Bounce') */
  displayName: string;

  /** Icon for component (optional) */
  icon?: string;

  /** Default props for this component */
  defaultProps: Record<string, any>;

  /** Motion Canvas creator function - returns Node or Generator */
  create: (props: any) => Node | Generator<any, Node | null, any>;

  /** Custom React component for property panel UI (optional - can be lazy loaded) */
  PropertyPanel?: React.ComponentType<PropertyPanelProps>;
}

export interface PropertyPanelProps {
  /** Current element data from project store */
  element: any;

  /** Callback to update element properties */
  onUpdate: (updates: Record<string, any>) => void;
}

export type ComponentRegistry = Record<string } from>;
