/**
 * PixelBlast Shader Background Scene Generator
 * Pure prop-based, no interactivity
 */

import * as THREE from 'three';
import { PIXEL_BLAST_VERTEX } from './shaders/pixelBlast.vert';
import { PIXEL_BLAST_FRAGMENT } from './shaders/pixelBlast.frag';
import { DEFAULT_PIXEL_BLAST_CONFIG, SHAPE_MAP } from './constants';
import { PixelBlastBackgroundProps } from '../types/backgroundTypes';

export interface PixelBlastSceneData {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  mesh: THREE.Mesh;
  uniforms: any;
  update: (time: number) => void;
  updateFromProps: (props: Partial<PixelBlastBackgroundProps>) => void;
  dispose: () => void;
  needsComposer?: boolean;
  noiseAmount?: number;
}

export function createPixelBlastScene(
  props: PixelBlastBackgroundProps
): PixelBlastSceneData {
  // Merge with defaults
  const config = { ...DEFAULT_PIXEL_BLAST_CONFIG, ...props };

  // Create scene
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // Setup uniforms (all prop-based, no interactive uniforms)
  const uniforms = {
    // Resolution
    uResolution: {
      value: new THREE.Vector2(config.width || 1920, config.height || 1080),
    },

    // Time (updated in update function)
    uTime: { value: 0 },

    // Visual properties from props
    uColor: { value: new THREE.Color(config.objectColor || '#B19EEF') },
    uShapeType: { value: SHAPE_MAP[config.variant || 'square'] },
    uPixelSize: { value: config.pixelSize || 3 },
    uScale: { value: config.patternScale || 2 },
    uDensity: { value: config.patternDensity || 1 },
    uPixelJitter: { value: config.pixelSizeJitter || 0 },
    uEdgeFade: { value: config.edgeFade !== undefined ? config.edgeFade : 0.5 },
  };

  // Create shader material
  const material = new THREE.ShaderMaterial({
    vertexShader: PIXEL_BLAST_VERTEX,
    fragmentShader: PIXEL_BLAST_FRAGMENT,
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    glslVersion: THREE.GLSL3,
  });

  // Create fullscreen quad
  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Update function (time-based only)
  const update = (time: number) => {
    // Update time with speed multiplier
    uniforms.uTime.value = time * (config.speed || 1);
  };

  // Property update function (for live prop changes)
  const updateFromProps = (newProps: Partial<PixelBlastBackgroundProps>) => {
    if (newProps.objectColor !== undefined) {
      uniforms.uColor.value.set(newProps.objectColor);
    }
    if (newProps.pixelSize !== undefined) {
      uniforms.uPixelSize.value = newProps.pixelSize;
    }
    if (newProps.patternScale !== undefined) {
      uniforms.uScale.value = newProps.patternScale;
    }
    if (newProps.patternDensity !== undefined) {
      uniforms.uDensity.value = newProps.patternDensity;
    }
    if (newProps.pixelSizeJitter !== undefined) {
      uniforms.uPixelJitter.value = newProps.pixelSizeJitter;
    }
    if (newProps.edgeFade !== undefined) {
      uniforms.uEdgeFade.value = newProps.edgeFade;
    }
    if (newProps.variant !== undefined) {
      uniforms.uShapeType.value = SHAPE_MAP[newProps.variant];
    }
    if (newProps.width !== undefined || newProps.height !== undefined) {
      uniforms.uResolution.value.set(
        newProps.width || uniforms.uResolution.value.x,
        newProps.height || uniforms.uResolution.value.y
      );
    }
  };

  // Cleanup function
  const dispose = () => {
    geometry.dispose();
    material.dispose();
    scene.clear();
  };

  return {
    scene,
    camera,
    mesh,
    uniforms,
    update,
    updateFromProps,
    dispose,
    needsComposer: (config.noiseAmount || 0) > 0, // Flag for ThreeComponent to create composer
    noiseAmount: config.noiseAmount || 0,
  };
}
