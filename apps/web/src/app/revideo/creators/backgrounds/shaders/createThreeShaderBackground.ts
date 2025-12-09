/**
 * Create Three.js shader background for Revideo
 * Uses ThreeComponent's post-processing pipeline for shader backgrounds
 */
import * as THREE from 'three';
import type { ThreeSceneData } from '@/app/revideo/three/ThreeComponent';

/*
 * Creates a Three.js scene with post-processing shader for use as a background
 * Uses the new sceneData pattern with postProcessFragment
 *
 * @param fragmentShader - GLSL fragment shader code (Shadertoy or standard)
 * @returns ThreeSceneData that can be passed to Three component
 */
export function createThreeShaderBackground(fragmentShader: string): ThreeSceneData {
  // Create empty Three.js scene (shader runs as post-process)
  const scene = new THREE.Scene();

  // Create orthographic camera
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // Optional: Add a simple quad to the scene so there's something to render
  // (The post-process will run on top of this)
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Dispose function - cleanup
  const dispose = () => {
    geometry.dispose();
    material.dispose();
  };

  return {
    scene,
    camera,
    mesh,
    postProcessFragment: fragmentShader, // Shader runs as post-process
    needsComposer: true, // Enable composer for post-processing
    dispose,
  };
}
