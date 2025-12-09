/**
 * Mesh Gradient Scene - Three.js Shader Background
 * Smooth flowing gradient animation
 */

import * as THREE from 'three';
import { MESH_GRADIENT_VERTEX } from './shaders/meshGradient.vert';
import { MESH_GRADIENT_FRAGMENT } from './shaders/meshGradient.frag';

export function createMeshGradientScene(props: any) {
  // Create scene
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // Setup uniforms
  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(props.width || 1920, props.height || 1080) },
    uSpeed: { value: props.speed || 1 },
  };

  // Create shader material
  const material = new THREE.ShaderMaterial({
    vertexShader: MESH_GRADIENT_VERTEX,
    fragmentShader: MESH_GRADIENT_FRAGMENT,
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

  // Update function for animation
  const update = (time: number) => {
    uniforms.uTime.value = time * (props.speed || 1);
  };

  // Property update function for live changes
  const updateFromProps = (newProps: any) => {
    if (newProps.speed !== undefined) {
      uniforms.uSpeed.value = newProps.speed;
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
  };
}
