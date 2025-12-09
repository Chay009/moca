/** @jsxImportSource @revideo/2d/lib */
import type { ThreeComponentProps } from '../types/threeTypes';
import { Three } from '../three/ThreeComponent';
import {
  createCubeScene,
  createSphereScene,
  createTorusScene,
  createParticlesScene,
  createWavesScene,
  createTunnelScene,
  createGalaxyScene,
  createGridScene,
  createWireframeScene,
  createPixelBlastScene,
  createIPhoneSceneSync,
  createCamera,
} from '../three/sceneGenerators';

export function createThreeComponent(props: ThreeComponentProps) {
  const sceneType = props.sceneType || 'cube';

  // Create the 3D scene based on type
  let sceneData: any;

  switch (sceneType) {
    case 'cube':
      sceneData = createCubeScene(props);
      break;
    case 'sphere':
      sceneData = createSphereScene(props);
      break;
    case 'torus':
      sceneData = createTorusScene(props);
      break;
    case 'particles':
      sceneData = createParticlesScene(props);
      break;
    case 'waves':
      sceneData = createWavesScene(props);
      break;
    case 'tunnel':
      sceneData = createTunnelScene(props);
      break;
    case 'galaxy':
      sceneData = createGalaxyScene(props);
      break;
    case 'grid':
      sceneData = createGridScene(props);
      break;
    case 'wireframe':
      sceneData = createWireframeScene(props);
      break;
    case 'pixelBlast':
      sceneData = createPixelBlastScene(props as any);
      break;
    case 'iphone':
      sceneData = createIPhoneSceneSync(props);
      break;
    default:
      sceneData = createCubeScene(props);
  }

  // Create camera (for non-shader scenes that don't provide their own camera)
  const camera = sceneData.camera || createCamera(props);

  // Extract elementId for key
  const { elementId, ...restProps } = props as any;

  // iPhone gets transparent background, others get specified or default black
  const background = sceneType === 'iphone' ? null : (props.background || '#000000');

  // Device mockups should have smaller dimensions to fit the device, not full canvas
  // iPhone aspect ratio is ~19.5:9 (height:width) or ~0.48:1 (width:height)
  const defaultWidth = sceneType === 'iphone' ? 350 : (props.width || 1920);
  const defaultHeight = sceneType === 'iphone' ? 750 : (props.height || 1080);

  // Return JSX (like other components)
  return (
    <Three
      key={elementId}
      width={props.width || defaultWidth}
      height={props.height || defaultHeight}
      scene={sceneData.scene}
      camera={camera}
      background={background}
      quality={props.quality || 1}
      zoom={props.zoom || 1}
      x={props.x || 0}
      y={props.y || 0}
      opacity={props.opacity ?? 1}
      sceneData={sceneData}
      {...restProps}
    />
  );
}
