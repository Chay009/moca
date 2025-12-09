// Three.tsx
/**
 * Production-ready Three component for Revideo / Motion Canvas
 * - Uses renderer pooling
 * - Creates composer only when needed, after size is known
 * - Supports Shadertoy-style fragment shader (post-process) via wrapper
 * - Uses Motion Canvas timeline time (useScene().playback.time)
 * this is the custom component enhacned from revideo's threejs template and added some etra function wiht the help of gpt --client-scene-play\src\components\revideo\three\gpt-enhanced-three-component.md
we tried to do the shders with motion canvas but it is not even working caused scene out of context error ,so moved to threejs version
https://threejs.org/manual/#en/shadertoy -- to use shader toy 

  YES - Three.js component can do MUCH more:

  1. 3D Models (GLTF/GLB) - Already supported by Three.js
  2. Particle systems 
  3. Physics simulations 
  4. Complex animations 
  5. Post-processing effects (already using EffectComposer)
  

  this file is the hub just keep on extending it for any use case which needs threejs

  3d-model integratin is next todo so that we can add mockups(not sure we use three or not,then glb models for assets like perfumes laptp based on brand)
*/

import { Layout, type LayoutProps } from '@revideo/2d/lib/components';
import { computed, initial, signal, initializeSignals } from '@revideo/2d/lib/decorators';
import { Vector2 } from '@revideo/core/lib/types';
import {
  Camera,
  Color,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  ShaderMaterial,
  UniformsUtils,
  Vector2 as ThreeVector2,
  Texture,
  Mesh,
  MeshBasicMaterial,// need to use these as well in future
  PlaneGeometry,
} from 'three'; // aslo nedd to installd  pnpm add --save-dev @types/three as well
import { type SimpleSignal } from '@revideo/core/lib/signals';

// Use three/examples postprocessing pieces (these paths are typical; adapt if your bundler differs)
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { wrapShadertoyFragment } from '@/app/revideo/creators/backgrounds/shaders/shadertoyWrapper';
import { useScene } from '@revideo/core';

interface RenderCallback {
  (renderer: WebGLRenderer, scene: Scene, camera: Camera): void;
}

export interface ThreeSceneData {
  // scene + camera used by RenderPass if using composer
  scene: Scene;
  camera?: Camera;

  // Optional: an in-scene mesh managed by sceneData
  mesh?: Mesh;

  // Optional per-frame update
  update?: (time: number) => void;

  // Optional: a post-processing fragment shader (as Shadertoy style or plain fragment)
  // If the string contains `mainImage`, we will wrap it into a fragment shader entry point.
  postProcessFragment?: string;

  // Optional uniforms for the post-process shader (map of name => THREE.Uniform)
  postProcessUniforms?: Record<string, any>;

  // If true, create composer + post-process pass
  needsComposer?: boolean;

  // Optional dispose callback
  dispose?: () => void;
}

export interface ThreeProps extends LayoutProps {
  scene?: Scene;
  camera?: Camera;
  quality?: number;
  background?: string;
  zoom?: number;
  onRender?: RenderCallback;
  sceneData?: ThreeSceneData;
}

export class Three extends Layout {
  @initial(1)
  @signal()
  public declare readonly quality: SimpleSignal<number, this>;

  @initial(null)
  @signal()
  public declare readonly camera: SimpleSignal<Camera | null, this>;

  @initial(null)
  @signal()
  public declare readonly scene: SimpleSignal<Scene | null, this>;

  @initial(null)
  @signal()
  public declare readonly background: SimpleSignal<string | null, this>;

  @initial(1)
  @signal()
  public declare readonly zoom: SimpleSignal<number, this>;

  private readonly renderer: WebGLRenderer;
  private readonly context: WebGLRenderingContext;
  private readonly pixelSample = new Uint8Array(4);
  public onRender: RenderCallback;

  // sceneData coming from props
  private sceneData: ThreeSceneData | null = null;

  // composer + shader pass (created lazily when size is known)
  private composer: EffectComposer | null = null;
  private shaderPass: ShaderPass | null = null;

  // Store scene reference to avoid calling useScene() in draw loop
  private revScene: any = null;

  public constructor({ onRender, sceneData, ...props }: ThreeProps) {
    super(props);
    // initialize signals from props so signals reflect initial props (safe)
    initializeSignals(this as any, props as any);

    this.renderer = borrow();
    this.context = this.renderer.getContext();
    this.onRender =
      onRender ?? ((renderer, scene, camera) => renderer.render(scene, camera));

    // store sceneData reference (we do not construct composer here)
    if (sceneData) {
      this.sceneData = sceneData;
    }

    // Store scene reference during construction (when context is available)
    try {
      this.revScene = useScene();
    } catch (err) {
      console.warn('Could not get scene in Three component constructor:', err);
    }
  }

  protected override async draw(context: CanvasRenderingContext2D) {
    const { width, height } = this.computedSize();
    const quality = this.quality();
    const scene = this.configuredScene();
    const camera = this.configuredCamera();
    const renderer = this.configuredRenderer();

    if (width > 0 && height > 0) {
      // Ensure composer exists if requested and size now known
      if (this.sceneData?.needsComposer && !this.composer) {
        this.createComposerIfNeeded(renderer, scene, camera, width * quality, height * quality);
      }

      // Update sceneData per-frame with Motion Canvas time
      if (this.sceneData?.update) {
        // Use Motion Canvas timeline time (deterministic for exports)
        // need of this time 
        // 1. Shader Animation 
        /*   Without time, shaders are static images. The iTime uniform makes them animate:
   Gradient waves flow                                                                                                    
   Colors cycle                                                                                                           
   Patterns move ex:   Example: cos(iTime * 3.0) - without time, this is frozen at one value

     2. Deterministic Exports 

  - playback.time = Motion Canvas timeline (0s → 10s)
  - Date.now() = Real wall clock time
  - For video exports: You MUST use playback.time or each frame will have random time → broken video

   3. Scrubbing Timeline 

  When user drags timeline back/forward:
  - playback.time follows the scrubber
  - Date.now() keeps running forward
  - Shader should match timeline position
  */

        const time = this.revScene?.playback.time ?? 0;
        try {
          this.sceneData.update(time);
        } catch (err) {
          // avoid throwing inside draw loop; log for debugging
          // eslint-disable-next-line no-console
          console.error('sceneData.update error:', err);
        }
      }

      // If composer exists, update uniforms then render via composer
      if (this.composer) {
        // common Shadertoy-like uniforms
        const iTime = this.revScene?.playback.time ?? 0;
        const res = new ThreeVector2(width * quality, height * quality);

        // update shader pass uniforms if present
        if (this.shaderPass && this.shaderPass.uniforms) {
          if ('iTime' in this.shaderPass.uniforms) {
            this.shaderPass.uniforms.iTime.value = iTime;
          }
          if ('iResolution' in this.shaderPass.uniforms) {
            this.shaderPass.uniforms.iResolution.value.set(res.x, res.y);
          }
          // merge optional custom uniforms from sceneData.postProcessUniforms
          if (this.sceneData?.postProcessUniforms) {
            Object.entries(this.sceneData.postProcessUniforms).forEach(([k, v]) => {
              if (this.shaderPass && this.shaderPass.uniforms && k in this.shaderPass.uniforms) {
                this.shaderPass.uniforms[k].value = v.value ?? v;
              }
            });
          }
        }

        // Render composer; pass delta if you want (composer.render accepts delta optionally)
        try {
          this.composer.render();
        } catch (err) {
          // fall back to default render if composer fails
          // eslint-disable-next-line no-console
          console.error('composer.render error, falling back to renderer.render', err);
          if (scene) {
            this.onRender(renderer, scene, camera);
          }
        }
      } else {
        // Normal render path
        if (scene) {
          this.onRender(renderer, scene, camera);
        }
      }

      // Copy WebGL canvas into Motion Canvas 2D context
      context.imageSmoothingEnabled = false;
      context.drawImage(
        renderer.domElement,
        0,
        0,
        quality * width,
        quality * height,
        width / -2,
        height / -2,
        width,
        height
      );
    }

    super.draw(context);
  }

  @computed()
  private configuredRenderer(): WebGLRenderer {
    const size = this.computedSize();
    const quality = this.quality();

    const w = Math.max(1, Math.round(size.width * quality));
    const h = Math.max(1, Math.round(size.height * quality));

    this.renderer.setSize(w, h);

    // If composer exists, ensure it matches renderer size
    if (this.composer) {
      this.composer.setSize(w, h);
    }

    return this.renderer;
  }

  @computed()
  private configuredCamera(): Camera {
    const size = this.computedSize();
    const camera = this.camera();
    const ratio = size.width / Math.max(1, size.height);
    const scale = this.zoom() / 2;

    if (camera instanceof OrthographicCamera) {
      camera.left = -ratio * scale;
      camera.right = ratio * scale;
      camera.bottom = -scale;
      camera.top = scale;
      camera.updateProjectionMatrix();
    } else if (camera instanceof PerspectiveCamera) {
      camera.aspect = ratio;
      camera.updateProjectionMatrix();
    }

    return camera!;
  }

  @computed()
  private configuredScene(): Scene | null {
    const scene = this.scene();
    const background = this.background();
    if (scene) {
      scene.background = background ? new Color(background) : null;
    }
    return scene;
  }

  /**
   * Lazily create EffectComposer + RenderPass + ShaderPass when size is known.
   * We do this here (not in constructor) to ensure the renderer has a real size.
   */
  private createComposerIfNeeded(
    renderer: WebGLRenderer,
    scene: Scene | null,
    camera: Camera | null,
    widthPx: number,
    heightPx: number
  ) {
    if (!this.sceneData || !this.sceneData.needsComposer) return;
    if (!scene) return;
    if (!camera) return;

    // Basic composer + render pass
    try {
      this.composer = new EffectComposer(renderer);
      const rp = new RenderPass(this.sceneData.scene, camera);
      this.composer.addPass(rp);

      // If a post-process fragment shader is provided, create a ShaderPass
      if (this.sceneData.postProcessFragment) {
        const frag = this.wrapShadertoyFragmentIfNeeded(this.sceneData.postProcessFragment);
        console.log('🔍 Wrapped fragment shader:', frag);
        // Base uniforms: iResolution and iTime
        const baseUniforms: any = {
          iResolution: { value: new ThreeVector2(widthPx, heightPx) },
          iTime: { value: this.revScene?.playback.time ?? 0 },
        };

        // merge user-provided uniforms (if any)
        const merged = Object.assign({}, baseUniforms, this.sceneData.postProcessUniforms ?? {});

        // Build ShaderMaterial for ShaderPass
        const material = new ShaderMaterial({
          uniforms: UniformsUtils.clone(merged),
          vertexShader: this.fullScreenVertexShader(),
          fragmentShader: frag,
        });

        // Create a ShaderPass from the material (ShaderPass expects a material or a shader)
        const sp = new ShaderPass({
          uniforms: material.uniforms,
          vertexShader: material.vertexShader,
          fragmentShader: material.fragmentShader,
        } as any);

        // Ensure the pass renders to screen
        sp.renderToScreen = true;
        this.composer.addPass(sp);
        this.shaderPass = sp;
      }

      // final size
      this.composer.setSize(widthPx, heightPx);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('createComposerIfNeeded error:', err);
      // Clean up partial results
      if (this.composer) {
        try {
          this.composer.dispose();
        } catch { }
        this.composer = null;
      }
      this.shaderPass = null;
    }
  }

  /**
   * If the fragment contains `mainImage`, wrap it into a proper fragment shader entry point.
   * Otherwise return fragment as-is (assumed to contain a `main()`).
   */
  private wrapShadertoyFragmentIfNeeded(fragment: string): string {
    return wrapShadertoyFragment(fragment);
  }

  /** Simple fullscreen vertex shader that exposes vUv */
  private fullScreenVertexShader(): string {
    return `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `;
  }

  public getColorAtPoint(position: Vector2) {
    const relativePosition = position.scale(this.quality());
    this.context.readPixels(
      relativePosition.x,
      relativePosition.y,
      1,
      1,
      this.context.RGBA,
      this.context.UNSIGNED_BYTE,
      this.pixelSample
    );
    const color = new Color();
    color.setRGB(
      this.pixelSample[0] / 255,
      this.pixelSample[1] / 255,
      this.pixelSample[2] / 255
    );
    return color;
  }

  // Hit detection is inherited from Layout - no override needed
  // Layout uses computedSize() for bounds-based hit testing

  public dispose() {
    // call user dispose if provided
    if (this.sceneData?.dispose) {
      try {
        this.sceneData.dispose();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('sceneData.dispose error:', err);
      }
    }

    // dispose composer & passes
    if (this.shaderPass) {
      try {
        // @ts-ignore - ShaderPass doesn't expose a dispose method in types
        if (typeof (this.shaderPass as any).dispose === 'function') {
          (this.shaderPass as any).dispose();
        }
      } catch { }
      this.shaderPass = null;
    }
    if (this.composer) {
      try {
        this.composer.dispose();
      } catch { }
      this.composer = null;
    }

    dispose(this.renderer);
  }
}

/* ---------- renderer pooling ---------- */
const pool: WebGLRenderer[] = [];

function borrow(): WebGLRenderer {
  if (pool.length) {
    return pool.pop()!;
  } else {
    return new WebGLRenderer({
      canvas: document.createElement('canvas'),
      alpha: true,
      stencil: true,
    });
  }
}

function dispose(renderer: WebGLRenderer) {
  // reset size to reduce memory
  try {
    renderer.setSize(1, 1);
  } catch { }
  pool.push(renderer);
}
