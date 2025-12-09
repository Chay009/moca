/**
 * Three.js Scene Generators
 * Creates different 3D scenes based on configuration
 */
import * as THREE from 'three';
import { ThreeComponentProps } from '../types/threeTypes';

// ==================== CUBE SCENE ====================

export function createCubeScene(props: ThreeComponentProps) {
  const scene = new THREE.Scene();
  const size = props.objectSize ?? 0.2;
  const color = props.objectColor ?? '#4a90e2';

  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = getMaterial(props, color);
  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);
  addLighting(scene, props);

  return { scene, mesh };
}

// ==================== SPHERE SCENE ====================

export function createSphereScene(props: ThreeComponentProps) {
  const scene = new THREE.Scene();
  const size = props.objectSize ?? 0.2;
  const color = props.objectColor ?? '#e24a90';

  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = getMaterial(props, color);
  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);
  addLighting(scene, props);

  return { scene, mesh };
}

// ==================== TORUS SCENE ====================

export function createTorusScene(props: ThreeComponentProps) {
  const scene = new THREE.Scene();
  const size = props.objectSize ?? 0.15;
  const color = props.objectColor ?? '#4ae290';

  const geometry = new THREE.TorusGeometry(size, size * 0.4, 16, 100);
  const material = getMaterial(props, color);
  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);
  addLighting(scene, props);

  return { scene, mesh };
}

// ==================== PARTICLES SCENE ====================

export function createParticlesScene(props: ThreeComponentProps) {
  const scene = new THREE.Scene();
  const count = props.objectCount ?? 1000;
  const size = props.particleSize ?? 0.002;
  const spread = props.particleSpread ?? 2;
  const color = props.objectColor ?? '#ffffff';

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * spread;
    positions[i + 1] = (Math.random() - 0.5) * spread;
    positions[i + 2] = (Math.random() - 0.5) * spread;

    velocities[i] = (Math.random() - 0.5) * 0.01;
    velocities[i + 1] = (Math.random() - 0.5) * 0.01;
    velocities[i + 2] = (Math.random() - 0.5) * 0.01;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

  const material = new THREE.PointsMaterial({
    size,
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  return { scene, mesh: particles, velocities };
}

// ==================== WAVES SCENE ====================

export function createWavesScene(props: ThreeComponentProps) {
  const scene = new THREE.Scene();
  const size = props.gridSize ?? 2;
  const divisions = props.gridDivisions ?? 50;
  const color = props.objectColor ?? '#00ffff';

  const geometry = new THREE.PlaneGeometry(size, size, divisions, divisions);
  const material = new THREE.MeshPhongMaterial({
    color: new THREE.Color(color),
    wireframe: false,
    side: THREE.DoubleSide,
    flatShading: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  addLighting(scene, props);

  return { scene, mesh };
}

// ==================== TUNNEL SCENE ====================

export function createTunnelScene(props: ThreeComponentProps) {
  const scene = new THREE.Scene();
  const radius = props.tunnelRadius ?? 0.5;
  const length = props.tunnelLength ?? 3;
  const segments = props.tunnelSegments ?? 32;
  const color = props.objectColor ?? '#ff00ff';

  const geometry = new THREE.CylinderGeometry(radius, radius, length, segments, 1, true);
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    wireframe: true,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2;
  scene.add(mesh);

  return { scene, mesh };
}

// ==================== GALAXY SCENE ====================

export function createGalaxyScene(props: ThreeComponentProps) {
  const scene = new THREE.Scene();
  const count = props.objectCount ?? 5000;
  const arms = props.galaxyArms ?? 5;
  const size = props.galaxySize ?? 2;
  const twist = props.galaxyTwist ?? 1;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const colorInside = new THREE.Color('#ff6030');
  const colorOutside = new THREE.Color('#1b3984');

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Position
    const radius = Math.random() * size;
    const spinAngle = radius * twist;
    const branchAngle = ((i % arms) / arms) * Math.PI * 2;

    const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3;
    const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3;
    const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3;

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    // Color
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / size);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: props.particleSize ?? 0.001,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  return { scene, mesh: particles };
}

// ==================== GRID SCENE ====================

export function createGridScene(props: ThreeComponentProps) {
  const scene = new THREE.Scene();
  const size = props.gridSize ?? 10;
  const divisions = props.gridDivisions ?? 20;
  const color = props.gridColor ?? '#00ff00';

  const gridHelper = new THREE.GridHelper(size, divisions, color, color);
  scene.add(gridHelper);

  return { scene, mesh: gridHelper };
}

// ==================== WIREFRAME SCENE ====================

export function createWireframeScene(props: ThreeComponentProps) {
  const scene = new THREE.Scene();
  const size = props.objectSize ?? 0.3;
  const color = props.objectColor ?? '#00ffff';
  const shape = props.objectShape ?? 'sphere';

  let geometry: THREE.BufferGeometry;

  switch (shape) {
    case 'cube':
      geometry = new THREE.BoxGeometry(size, size, size);
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry(size, 32, 32);
      break;
    case 'cone':
      geometry = new THREE.ConeGeometry(size, size * 1.5, 32);
      break;
    case 'cylinder':
      geometry = new THREE.CylinderGeometry(size, size, size * 1.5, 32);
      break;
    case 'torus':
      geometry = new THREE.TorusGeometry(size, size * 0.4, 16, 100);
      break;
    default:
      geometry = new THREE.SphereGeometry(size, 32, 32);
  }

  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    wireframe: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return { scene, mesh };
}

// ==================== HELPER: GET MATERIAL ====================

function getMaterial(props: ThreeComponentProps, defaultColor: string): THREE.Material {
  const color = props.objectColor ?? defaultColor;
  const materialType = props.materialType ?? 'normal';

  switch (materialType) {
    case 'normal':
      return new THREE.MeshNormalMaterial();

    case 'basic':
      return new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });

    case 'standard':
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: props.metalness ?? 0.7,
        roughness: props.roughness ?? 0.3,
      });

    case 'phong':
      return new THREE.MeshPhongMaterial({
        color: new THREE.Color(color),
        shininess: 100,
      });

    case 'lambert':
      return new THREE.MeshLambertMaterial({
        color: new THREE.Color(color),
      });

    case 'wireframe':
      return new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        wireframe: true,
      });

    default:
      return new THREE.MeshNormalMaterial();
  }
}

// ==================== HELPER: ADD LIGHTING ====================

function addLighting(scene: THREE.Scene, props: ThreeComponentProps) {
  const lightType = props.lightType ?? 'ambient';
  const lightColor = props.lightColor ?? '#ffffff';
  const lightIntensity = props.lightIntensity ?? 1;
  const lightPos = props.lightPosition ?? { x: 1, y: 1, z: 1 };

  switch (lightType) {
    case 'ambient':
      const ambientLight = new THREE.AmbientLight(lightColor, lightIntensity);
      scene.add(ambientLight);
      break;

    case 'directional':
      const directionalLight = new THREE.DirectionalLight(lightColor, lightIntensity);
      directionalLight.position.set(lightPos.x, lightPos.y, lightPos.z);
      scene.add(directionalLight);
      break;

    case 'point':
      const pointLight = new THREE.PointLight(lightColor, lightIntensity);
      pointLight.position.set(lightPos.x, lightPos.y, lightPos.z);
      scene.add(pointLight);
      break;

    case 'spot':
      const spotLight = new THREE.SpotLight(lightColor, lightIntensity);
      spotLight.position.set(lightPos.x, lightPos.y, lightPos.z);
      scene.add(spotLight);
      break;

    case 'hemisphere':
      const hemisphereLight = new THREE.HemisphereLight('#ffffff', '#080820', lightIntensity);
      scene.add(hemisphereLight);
      break;
  }
}

// ==================== HELPER: CREATE CAMERA ====================

export function createCamera(props: ThreeComponentProps): THREE.Camera {
  const cameraType = props.cameraType ?? 'perspective';
  const fov = props.cameraFov ?? 90;
  const pos = props.cameraPosition ?? { x: 0, y: 0, z: 1 };
  const rot = props.cameraRotation ?? { x: 0, y: 0, z: 0 };

  let camera: THREE.Camera;

  if (cameraType === 'orthographic') {
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
  } else {
    camera = new THREE.PerspectiveCamera(fov, 16 / 9, 0.1, 1000);
  }

  camera.position.set(pos.x, pos.y, pos.z);
  camera.rotation.set(rot.x, rot.y, rot.z);

  return camera;
}

// ==================== SHADER BACKGROUNDS ====================

export { createPixelBlastScene } from './backgrounds/PixelBlastScene';

// ==================== DEVICE MOCKUPS (GLB MODELS) ====================

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { type ThreeSceneData } from './ThreeComponent';

// Animation preset functions (mirrors device/presets/animations.ts)
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const easeOutBack = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// Built-in animation presets (same as device/presets/animations.ts)
const DEVICE_PRESETS: Record<string, {
  duration: number;
  animate: (time: number, duration: number) => { rotation: [number, number, number]; position: [number, number, number]; scale: number };
}> = {
  'hero-entrance': {
    duration: 2.5,
    animate: (elapsedTime, duration) => {
      const progress = Math.min(elapsedTime / duration, 1);
      const eased = easeOutBack(progress);
      return {
        rotation: [-0.3 * (1 - eased), 0.2 * (1 - eased), 0] as [number, number, number],
        position: [0, -2 + 2 * eased, 1 - 1 * eased] as [number, number, number],
        scale: 0.5 + 0.5 * eased,
      };
    },
  },
  'floating': {
    duration: 4,
    animate: (elapsedTime, duration) => {
      const progress = (elapsedTime % duration) / duration;
      const wave = Math.sin(progress * Math.PI * 2);
      const wave2 = Math.cos(progress * Math.PI * 2);
      return {
        rotation: [0.05 * wave, 0.1 * wave2, 0.02 * wave] as [number, number, number],
        position: [0.1 * wave2, 0.15 * wave, 0] as [number, number, number],
        scale: 1,
      };
    },
  },
  'rotate-360': {
    duration: 4,
    animate: (elapsedTime, duration) => {
      const progress = Math.min(elapsedTime / duration, 1);
      const eased = easeInOutCubic(progress);
      return {
        rotation: [0, Math.PI * 2 * eased, 0] as [number, number, number],
        position: [0, 0, 0] as [number, number, number],
        scale: 1,
      };
    },
  },
  'tilted-zoom-out': {
    duration: 3,
    animate: (elapsedTime, duration) => {
      const progress = Math.min(elapsedTime / duration, 1);
      const eased = easeOutBack(progress);
      return {
        rotation: [0.1 * (1 - eased), Math.PI * 0.1 * eased, -0.05 * (1 - eased)] as [number, number, number],
        position: [0, 0.5 * (1 - eased), 2 - 1.5 * eased] as [number, number, number],
        scale: 1 + 0.3 * (1 - eased),
      };
    },
  },
};

// Model cache to avoid reloading
const modelCache = new Map<string, THREE.Group>();

/**
 * Create iPhone/Device mockup scene
 * Loads GLB model and applies screen texture + animation presets
 */
export async function createIPhoneScene(props: ThreeComponentProps): Promise<ThreeSceneData> {
  const scene = new THREE.Scene();
  const camera = createCamera({
    ...props,
    cameraPosition: props.cameraPosition ?? { x: 0, y: 0, z: 2.8 },
    cameraFov: props.cameraFov ?? 40,
  });

  // Model settings
  const modelPath = props.modelPath ?? '/models/iphone-17-pro/scene.gltf';
  const screenMeshName = props.screenMeshName ?? 'Object_55';
  const deviceScale = props.deviceScale ?? 30;
  const presetId = props.devicePreset ?? 'floating';

  // Check cache first
  let model: THREE.Group;
  if (modelCache.has(modelPath)) {
    model = modelCache.get(modelPath)!.clone();
  } else {
    // Load GLB model
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(modelPath);
    modelCache.set(modelPath, gltf.scene.clone());
    model = gltf.scene;
  }

  model.scale.setScalar(deviceScale);
  scene.add(model);

  // Apply screen texture if provided
  if (props.screenSrc) {
    const textureLoader = new THREE.TextureLoader();
    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
      textureLoader.load(props.screenSrc!, resolve, undefined, reject);
    });
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;

    // Find screen mesh and apply texture
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.name === screenMeshName) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          map: texture,
          toneMapped: false,
        });
      }
    });
  }

  // Add lighting (same as DeviceCanvas.tsx)
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight1.position.set(5, 5, 5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight2.position.set(-5, 5, 5);
  scene.add(dirLight2);

  const spotLight = new THREE.SpotLight(0xffffff, 0.5);
  spotLight.position.set(0, 5, 0);
  spotLight.angle = 0.6;
  spotLight.penumbra = 1;
  scene.add(spotLight);

  // Get animation preset
  const preset = DEVICE_PRESETS[presetId] || DEVICE_PRESETS['floating'];

  // Update function for animation (called each frame)
  const update = (time: number) => {
    if (preset && model) {
      const { rotation, position, scale } = preset.animate(time, preset.duration);
      model.rotation.set(rotation[0], rotation[1], rotation[2]);
      model.position.set(position[0], position[1], position[2]);
      model.scale.setScalar(scale * deviceScale);
    }
  };

  return {
    scene,
    camera,
    mesh: model as any,
    update,
    needsComposer: false,
  };
}

/**
 * Synchronous version of createIPhoneScene for use in threeCreator.ts
 * Returns scene immediately, loads model asynchronously
 */
export function createIPhoneSceneSync(props: ThreeComponentProps): ThreeSceneData {
  const scene = new THREE.Scene();
  const camera = createCamera({
    ...props,
    cameraPosition: props.cameraPosition ?? { x: 0, y: 0, z: 2.8 },
    cameraFov: props.cameraFov ?? 40,
  });

  // Model settings
  const modelPath = props.modelPath ?? '/models/iphone-17-pro/scene.gltf';
  const screenMeshName = props.screenMeshName ?? 'Object_55';
  const deviceScale = props.deviceScale ?? 30;
  const presetId = props.devicePreset ?? 'floating';

  // Placeholder for model (loaded async)
  let model: THREE.Group | null = null;
  let isLoading = false;

  // Get animation preset
  const preset = DEVICE_PRESETS[presetId] || DEVICE_PRESETS['floating'];

  // Add lighting immediately (same as DeviceCanvas.tsx)
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight1.position.set(5, 5, 5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight2.position.set(-5, 5, 5);
  scene.add(dirLight2);

  const spotLight = new THREE.SpotLight(0xffffff, 0.5);
  spotLight.position.set(0, 5, 0);
  spotLight.angle = 0.6;
  spotLight.penumbra = 1;
  scene.add(spotLight);

  // Start loading model asynchronously
  const loadModel = async () => {
    if (isLoading || model) return;
    isLoading = true;

    try {
      // Check cache first
      if (modelCache.has(modelPath)) {
        model = modelCache.get(modelPath)!.clone();
      } else {
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(modelPath);
        modelCache.set(modelPath, gltf.scene.clone());
        model = gltf.scene;
      }

      model.scale.setScalar(deviceScale);
      scene.add(model);

      // Apply screen texture if provided
      if (props.screenSrc) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(props.screenSrc, (texture) => {
          texture.flipY = false;
          texture.colorSpace = THREE.SRGBColorSpace;

          model?.traverse((child) => {
            if ((child as THREE.Mesh).isMesh && child.name === screenMeshName) {
              (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
                map: texture,
                toneMapped: false,
              });
            }
          });
        });
      }
    } catch (error) {
      console.error('Failed to load iPhone model:', error);
    }
  };

  // Start loading immediately
  loadModel();

  // Update function for animation (called each frame)
  const update = (time: number) => {
    if (model && preset) {
      const { rotation, position, scale } = preset.animate(time, preset.duration);
      model.rotation.set(rotation[0], rotation[1], rotation[2]);
      model.position.set(position[0], position[1], position[2]);
      model.scale.setScalar(scale * deviceScale);
    }
  };

  return {
    scene,
    camera,
    mesh: null as any, // Model loaded async
    update,
    needsComposer: false,
  };
}
