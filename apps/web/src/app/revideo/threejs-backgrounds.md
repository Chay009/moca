Here's exactly how we'll integrate it:

1. Add as a Component Type
Add 'three' to our component types:

export type ElementType =
  | 'text' | 'animated-text'
  | 'rect' | 'circle' | 'line' | 'polygon'
  | 'image' | 'video' | 'audio'
  | 'button' | 'card' | 'badge' | 'progress' | 'counter'
  | 'layout' | 'group'
  | 'three';  // ← NEW!
2. Props-Based Configuration
interface ThreeComponentProps {
  type: 'three';
  
  // Scene configuration
  sceneType: 'cube' | 'sphere' | 'particles' | 'waves' | 'custom';
  
  // Camera settings
  cameraType: 'perspective' | 'orthographic';
  cameraPosition: { x: number; y: number; z: number };
  cameraRotation: { x: number; y: number; z: number };
  
  // Visual settings
  background: string;
  quality: number;
  zoom: number;
  
  // Animation
  rotationSpeed: number;
  autoRotate: boolean;
  
  // Object properties (for built-in scenes)
  objectColor: string;
  objectSize: number;
  objectCount: number;
  
  // Lighting
  lightType: 'ambient' | 'directional' | 'point' | 'spot';
  lightColor: string;
  lightIntensity: number;
}
3. Built-in 3D Scene Presets
We can create prebuilt 3D backgrounds:

🎨 Scene Presets:

Rotating Cube (like the example)
Particle Field (stars, snow, etc.)
Geometric Shapes (spheres, pyramids, etc.)
Waves (animated waves)
Tunnel (3D tunnel effect)
Galaxy (rotating galaxy)
Grid (animated grid background)
Wireframe (wireframe objects)
🎛️ UI Controls (Property Panel)
In the Property Panel, you'd see:

┌─────────────────────────────────┐
│ 3D Background Settings          │
│                                 │
│ Scene Type: [Rotating Cube ▼]  │
│                                 │
│ Camera Position:                │
│   X: [====|===] 0               │
│   Y: [====|===] 0               │
│   Z: [===|====] 0.5             │
│                                 │
│ Rotation Speed: [==|=====] 1.0  │
│ Auto Rotate: [✓]                │
│                                 │
│ Object Color: [🎨] #00ff00      │
│ Object Size:  [===|====] 0.2    │
│                                 │
│ Background:   [🎨] #000000      │
│ Quality:      [====|==] 1.0     │
│                                 │
│ Animation:    [Slow Spin  ▼]    │
└─────────────────────────────────┘
💡 Example Usage Scenarios
Scenario 1: Video Background
// Add 3D particle field as background
const background = {
  type: 'three',
  properties: {
    sceneType: 'particles',
    objectCount: 1000,
    objectColor: '#ffffff',
    rotationSpeed: 0.5,
    background: '#000033',
    cameraPosition: { x: 0, y: 0, z: 5 },
    zIndex: -1, // Behind everything
  },
};
Scenario 2: Animated 3D Logo
const logo3D = {
  type: 'three',
  properties: {
    sceneType: 'cube',
    objectSize: 0.3,
    objectColor: '#3b82f6',
    autoRotate: true,
    rotationSpeed: 1.5,
    animation: {
      preset: 'scale-in',
      duration: 1,
    },
  },
};
Scenario 3: Tunnel Effect
const tunnel = {
  type: 'three',
  properties: {
    sceneType: 'tunnel',
    objectColor: '#00ffff',
    rotationSpeed: 2,
    zoom: 1.5,
    background: '#000000',
  },
};