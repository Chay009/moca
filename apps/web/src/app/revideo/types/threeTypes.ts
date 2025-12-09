/**
 * Three.js component types and scene configurations
 */
import { BaseComponentProps } from './base';

// ==================== THREE.JS SCENE TYPES ====================

export type ThreeSceneType =
  | 'cube'
  | 'sphere'
  | 'torus'
  | 'particles'
  | 'waves'
  | 'tunnel'
  | 'galaxy'
  | 'grid'
  | 'wireframe'
  | 'pixelBlast'
  | 'iphone'
  | 'custom';

export type ThreeLightType = 'ambient' | 'directional' | 'point' | 'spot' | 'hemisphere';

export type ThreeCameraType = 'perspective' | 'orthographic';

// ==================== THREE.JS COMPONENT PROPS ====================

export interface ThreeComponentProps extends BaseComponentProps {
  type: 'three';

  // Scene configuration
  sceneType: ThreeSceneType;

  // Camera settings
  cameraType?: ThreeCameraType;
  cameraPosition?: { x: number; y: number; z: number };
  cameraRotation?: { x: number; y: number; z: number };
  cameraFov?: number; // Field of view for perspective camera

  // Visual settings
  background?: string;
  quality?: number; // Render quality (0.5 - 2)
  zoom?: number;

  // Animation
  rotationSpeed?: number; // Rotation speed
  autoRotate?: boolean;
  rotationAxis?: 'x' | 'y' | 'z' | 'all';

  // Object properties
  objectColor?: string;
  objectSize?: number;
  objectCount?: number; // For particle systems
  objectShape?: 'cube' | 'sphere' | 'cone' | 'cylinder' | 'torus';

  // Lighting
  lightType?: ThreeLightType;
  lightColor?: string;
  lightIntensity?: number;
  lightPosition?: { x: number; y: number; z: number };

  // Material properties
  materialType?: 'normal' | 'basic' | 'standard' | 'phong' | 'lambert' | 'wireframe';
  metalness?: number; // For standard material
  roughness?: number; // For standard material
  emissive?: string; // Emissive color
  emissiveIntensity?: number;

  // Particle system properties
  particleSize?: number;
  particleSpread?: number;
  particleSpeed?: number;

  // Wave properties
  waveAmplitude?: number;
  waveFrequency?: number;
  waveSpeed?: number;

  // Grid properties
  gridSize?: number;
  gridDivisions?: number;
  gridColor?: string;

  // Tunnel properties
  tunnelRadius?: number;
  tunnelLength?: number;
  tunnelSegments?: number;

  // Galaxy properties
  galaxyArms?: number;
  galaxySize?: number;
  galaxyTwist?: number;

  // Shader background properties (PixelBlast)
  variant?: 'square' | 'circle' | 'triangle' | 'diamond';
  pixelSize?: number;
  pixelSizeJitter?: number;
  patternScale?: number;
  patternDensity?: number;
  speed?: number; // Animation speed multiplier
  noiseAmount?: number;
  edgeFade?: number;

  // iPhone/Device mockup properties
  modelPath?: string; // Path to GLB model
  screenSrc?: string; // Video/image URL for screen
  screenMeshName?: string; // Name of mesh to apply texture to (default: Object_55)
  devicePreset?: string; // Animation preset ID (heroEntrance, floating, etc.)
  deviceScale?: number; // Model scale (default: 15)
}

// ==================== DEFAULT THREE.JS CONFIGS ====================

export const DEFAULT_THREE_CONFIGS: Record<ThreeSceneType, Partial<ThreeComponentProps>> = {
  cube: {
    sceneType: 'cube',
    objectSize: 0.2,
    objectColor: '#4a90e2',
    rotationSpeed: 1,
    autoRotate: true,
    rotationAxis: 'y',
    cameraPosition: { x: 0, y: 0, z: 0.5 },
    background: '#000000',
    lightType: 'ambient',
    lightIntensity: 1,
    materialType: 'normal',
  },
  sphere: {
    sceneType: 'sphere',
    objectSize: 0.2,
    objectColor: '#e24a90',
    rotationSpeed: 0.8,
    autoRotate: true,
    cameraPosition: { x: 0, y: 0, z: 0.6 },
    background: '#000033',
    lightType: 'directional',
    lightIntensity: 1.5,
    materialType: 'standard',
    metalness: 0.7,
    roughness: 0.3,
  },
  torus: {
    sceneType: 'torus',
    objectSize: 0.15,
    objectColor: '#4ae290',
    rotationSpeed: 1.2,
    autoRotate: true,
    rotationAxis: 'all',
    cameraPosition: { x: 0, y: 0, z: 0.7 },
    background: '#001a33',
    materialType: 'phong',
  },
  particles: {
    sceneType: 'particles',
    objectCount: 1000,
    particleSize: 0.002,
    particleSpread: 2,
    particleSpeed: 0.5,
    objectColor: '#ffffff',
    rotationSpeed: 0.2,
    autoRotate: true,
    cameraPosition: { x: 0, y: 0, z: 1 },
    background: '#000033',
  },
  waves: {
    sceneType: 'waves',
    waveAmplitude: 0.3,
    waveFrequency: 2,
    waveSpeed: 1,
    objectColor: '#00ffff',
    gridSize: 2,
    gridDivisions: 50,
    cameraPosition: { x: 0, y: 0.5, z: 1 },
    cameraRotation: { x: -0.5, y: 0, z: 0 },
    background: '#000000',
  },
  tunnel: {
    sceneType: 'tunnel',
    tunnelRadius: 0.5,
    tunnelLength: 3,
    tunnelSegments: 32,
    objectColor: '#ff00ff',
    rotationSpeed: 1,
    autoRotate: true,
    cameraPosition: { x: 0, y: 0, z: 0 },
    background: '#000000',
    materialType: 'wireframe',
  },
  galaxy: {
    sceneType: 'galaxy',
    galaxyArms: 5,
    galaxySize: 2,
    galaxyTwist: 1,
    objectCount: 5000,
    particleSize: 0.001,
    rotationSpeed: 0.3,
    autoRotate: true,
    cameraPosition: { x: 0, y: 1, z: 2 },
    cameraRotation: { x: -0.5, y: 0, z: 0 },
    background: '#000000',
  },
  grid: {
    sceneType: 'grid',
    gridSize: 10,
    gridDivisions: 20,
    gridColor: '#00ff00',
    objectColor: '#00ff00',
    cameraPosition: { x: 0, y: 2, z: 2 },
    cameraRotation: { x: -0.7, y: 0, z: 0 },
    background: '#000000',
  },
  wireframe: {
    sceneType: 'wireframe',
    objectSize: 0.3,
    objectShape: 'sphere',
    objectColor: '#00ffff',
    rotationSpeed: 0.5,
    autoRotate: true,
    rotationAxis: 'all',
    cameraPosition: { x: 0, y: 0, z: 0.8 },
    background: '#000033',
    materialType: 'wireframe',
  },
  pixelBlast: {
    sceneType: 'pixelBlast',
    variant: 'square',
    pixelSize: 3,
    pixelSizeJitter: 0,
    patternScale: 2,
    patternDensity: 1,
    speed: 1,
    noiseAmount: 0,
    edgeFade: 0.5,
    objectColor: '#B19EEF',
    background: '#000000',
    cameraType: 'orthographic',
  },
  custom: {
    sceneType: 'custom',
    cameraPosition: { x: 0, y: 0, z: 1 },
    background: '#000000',
  },
};
