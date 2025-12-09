/**
 * Root Component Registry
 * Aggregates all category registries into a single lookup
 */

import type { ComponentPlugin, ComponentRegistry } from '../types/componentPlugin';
import { textComponents } from './text/registry';
import { imageComponents } from './image/registry';
import { videoComponents } from './video/registry';
// TODO: Import other category registries as they're created
// import { shapeComponents } from './shapes/registry';
// import { customComponents } from './custom/registry';

/**
 * Global component registry - combines all categories
 */
export const componentRegistry: ComponentRegistry = {
  ...textComponents,
  ...imageComponents,
  ...videoComponents,
  // ...shapeComponents,
  // ...customComponents,
};

/**
 * Get component plugin by type
 */
export function getComponent(type: string): ComponentPlugin | undefined {
  return componentRegistry[type];
}

/**
 * Get all components in a category
 */
export function getComponentsByCategory(category: string): ComponentPlugin[] {
  return Object.values(componentRegistry).filter(
    (component) => component.category === category
  );
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  Object.values(componentRegistry).forEach((component) => {
    categories.add(component.category);
  });
  return Array.from(categories);
}

/**
 * Check if component type exists
 */
export function hasComponent(type: string): boolean {
  return type in componentRegistry;
}
