/**
 * Main component factory - registry-based component creation
 * Uses component plugin registry for extensible, clean architecture
 *
 * Retur
ns a generator function that creates and animates the component.
 * Use with yield* in scenes: yield* createComponent({...})
 */
import type { ComponentProps } from '../types/components';
import { componentRegistry } from './components/registry';

// Import legacy creators (TODO: migrate these to plugin system)
import { createThreeComponent } from './threeCreator';
/**
 * Component factory - returns generator for component creation and animation
 *
 * @param props - Component properties including type and elementId
 * @returns Generator function that creates and animates the component, or null if type not found
 */
export function createComponent(props: ComponentProps) {
  const component = componentRegistry[props.type];

  // Use registry if component exists - merge default props and create
  if (component) {
    // Merge default props with provided props
    const mergedProps = { ...component.defaultProps, ...props };
    return component.create(mergedProps as any);
  }

  // Fallback for legacy components not yet in registry
  // TODO: Migrate these to plugin system
  const type = (props as any).type;
  switch (type) {
    case 'three':
      return createThreeComponent(props as any);



    case 'text-effect-preset':
      console.warn('Text effect presets should be created through createTextEffectPreset(), not component factory');
      return null;

    default:
      console.warn(`Unknown component type: ${type}`);
      return null;
  }
}
