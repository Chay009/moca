/**
 * Barrel export for Project and Scene types
 * Re-exports types from projectTypes and sceneTypes for backward compatibility
 * this is left so that it is not broken in vite so later we need to modiy the name and import flow according to the new structure
 */
export * from './projectTypes';
export * from './sceneTypes';
