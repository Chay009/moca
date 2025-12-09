
-----------------------------
reference:https://motioncanvas.io/docs/camera/
-----------------------







import {makeProject} from '@revideo/core';

import {
  Circle,
  Img,
  Line,
  makeScene2D,
  Node,
  QuadBezier,
  Rect,
  Spline,
  Txt,
} from '@revideo/2d';
import {all, chain, createRef, linear, waitFor} from '@revideo/core';
import {Camera} from './Camera';
import {CustomExporter} from './CustomExporter';

// Register the custom exporter globally for Re.video UI (if supported)
if (typeof window !== 'undefined') {
  (window as any).revideoExporters = (window as any).revideoExporters || [];
  (window as any).revideoExporters.push(CustomExporter);
}

/**
 * SIMPLE TEST: Verify camera centerOn works correctly
 * If centerOn is inverted, the rect will move AWAY from center
 * If centerOn is correct, the rect will move TO center
 */
const sceneSimpleCenterTest = makeScene2D('simple-center-test', function* (view) {
  const camera = createRef<Camera>();
  const rect = createRef<Rect>();

  view.add(
    <Camera ref={camera}>
      {/* Red rect at position [300, 200] - top right */}
      <Rect
        ref={rect}
        fill={'red'}
        size={100}
        position={[300, 200]}
      />
      {/* Yellow circle at center [0, 0] for reference */}
      <Circle
        fill={'yellow'}
        size={50}
        position={[0, 0]}
      />
      {/* Text label at the rect's position */}
      <Txt
        text="TARGET"
        fill={'white'}
        fontSize={30}
        position={[300, 260]}
      />
    </Camera>
  );

  yield* waitFor(1);

  // This should move the camera so the RED RECT appears at screen center
  // If inverted (wrong), the rect will move AWAY from center
  // If correct, the rect will move TO the center
  yield* camera().centerOn(rect(), 2);

  yield* waitFor(2);
});

/**
 * Test 0: Motion Canvas Example - QuadBezier followCurve
 */
const sceneMotionCanvasTest = makeScene2D('motion-canvas-test', function* (view) {
  const camera = createRef<Camera>();
  const path = createRef<QuadBezier>();

  view.add(
    // <Camera ref={camera}>
    //   <QuadBezier
    //     ref={path}
    //     lineWidth={6}
    //     stroke={'lightseagreen'}
    //     p0={[-200, 0]}
    //     p1={[0, 200]}
    //     p2={[200, 0]}
    //   />
    //   {/* Test element at center - should move WITH curve if camera is following */}
    //   <Circle
    //     fill={'red'}
    //     size={40}
    //     position={[0, 0]}
    //   />
    // </Camera>
      <Camera ref={camera}>
      <Rect size={100} fill={'lightseagreen'} position={[-100, -30]} />
      <Circle size={80} fill={'hotpink'} position={[100, 30]} />
    </Camera>
    
  );

  // yield* camera().followCurve(path(), 2.5, linear);
     yield* camera().zoom(2, 1);
  yield* camera().zoom(0.5, 1.5);
  yield* camera().zoom(1, 1);
});

/**
 * Test 1: Basic Camera Movement - centerOn, zoom, rotation, reset
 */
const scene1 = makeScene2D('basic-camera-movement', function* (view) {
  const cameraRef = createRef<Camera>();
  const rectRef = createRef<Rect>();
  const circleRef = createRef<Circle>();

  view.add(
    <Camera ref={cameraRef}>
      <Rect
        ref={rectRef}
        fill={'lightseagreen'}
        size={[200, 200]}
        position={[300, -200]}
      />
      <Circle
        ref={circleRef}
        fill={'hotpink'}
        size={250}
        position={[-300, 200]}
      />
      <Rect fill={'orange'} size={[150, 150]} position={[0, 0]} />
    </Camera>,
  );

  // Test centerOn with zoom and rotation together
  yield* all(
    cameraRef().centerOn(rectRef(), 2),
    cameraRef().zoom(2, 2),
    cameraRef().rotation(45, 2),
  );

  yield* waitFor(1);

  // Test centerOn on second object
  yield* all(
    cameraRef().centerOn(circleRef(), 2),
    cameraRef().zoom(1.5, 2),
    cameraRef().rotation(-90, 2),
  );

  yield* waitFor(1);

  // Test centerOn by position
  yield* cameraRef().centerOn([0, 0], 2);

  yield* waitFor(1);

  // Test reset - returns to initial state
  yield* cameraRef().reset(2);

  yield* waitFor(1);
});

/**
 * Test 2: Camera following a Spline curve
 */
const scene2 = makeScene2D('camera-follow-curve', function* (view) {
  const cameraRef = createRef<Camera>();
  const splineRef = createRef<Spline>();
  const markerRef = createRef<Circle>();

  view.add(
    <Camera ref={cameraRef}>
      {/* Spline path */}
      <Spline
        ref={splineRef}
        lineWidth={8}
        stroke={'#99C'}
        points={[
          [-400, -300],
          [-200, 200],
          [200, -100],
          [400, 300],
        ]}
        smoothness={0.5}
      />

      {/* Elements that stay centered */}
      <Circle
        ref={markerRef}
        fill={'yellow'}
        size={100}
        position={[0, 0]}
      />
      <Rect fill={'lightblue'} size={[80, 80]} position={[-150, 0]} />
      <Rect fill={'lightgreen'} size={[80, 80]} position={[150, 0]} />
    </Camera>,
  );

  yield* waitFor(0.5);

  // Camera follows the spline curve
  yield* cameraRef().followCurve(splineRef(), 4);

  yield* waitFor(1);

  // Camera follows the curve in reverse
  yield* cameraRef().followCurveReverse(splineRef(), 4);

  yield* waitFor(1);
});

/**
 * Test 3: Camera following curve with rotation
 */
const scene3 = makeScene2D('camera-follow-with-rotation', function* (view) {
  const cameraRef = createRef<Camera>();
  const splineRef = createRef<Spline>();
  const arrowRef = createRef<Line>();

  view.add(
    <>
      {/* Curved path - stays still as visual guide */}
      <Spline
        ref={splineRef}
        lineWidth={6}
        stroke={'#C9C'}
        points={[
          [-500, 0],
          [-250, -300],
          [0, 0],
          [250, 300],
          [500, 0],
        ]}
        smoothness={0.6}
      />

      {/* Camera with content that follows the path */}
      <Camera ref={cameraRef}>
        <Line
          ref={arrowRef}
          lineWidth={10}
          stroke={'red'}
          points={[
            [0, 0],
            [100, 0],
          ]}
          endArrow
        />
        <Rect fill={'purple'} size={[60, 60]} position={[-80, 0]} />
      </Camera>
    </>,
  );

  yield* waitFor(0.5);

  // Camera follows curve and rotates to follow tangent
  yield* cameraRef().followCurveWithRotation(splineRef(), 5);

  yield* waitFor(1);

  // Camera follows in reverse with rotation
  yield* cameraRef().followCurveWithRotationReverse(splineRef(), 5);

  yield* waitFor(1);
});

/**
 * Test 4: Multiple cameras using Camera.Stage
 */
const scene4 = makeScene2D('multiple-cameras', function* (view) {
  const camera1Ref = createRef<Camera>();
  const camera2Ref = createRef<Camera>();
  const rectRef = createRef<Rect>();
  const circleRef = createRef<Circle>();

  // Shared scene content
  const sharedScene = (
    <Node>
      <Rect
        ref={rectRef}
        fill={'teal'}
        size={[150, 150]}
        position={[-200, 0]}
      />
      <Circle ref={circleRef} fill={'coral'} size={180} position={[200, 0]} />
      <Rect fill={'gold'} size={[100, 100]} position={[0, -150]} />
    </Node>
  );

  view.add(
    <>
      {/* Camera 1 - Left side */}
      <Camera.Stage
        cameraRef={camera1Ref}
        scene={sharedScene}
        size={[850, 480]}
        position={[-475, 0]}
        fill={'#222'}
      />

      {/* Camera 2 - Right side */}
      <Camera.Stage
        cameraRef={camera2Ref}
        scene={sharedScene}
        size={[850, 480]}
        position={[475, 0]}
        fill={'#333'}
      />
    </>,
  );

  yield* waitFor(0.5);

  // Both cameras move differently, showing the same scene from different perspectives
  yield* all(
    camera1Ref().centerOn(rectRef(), 3),
    camera1Ref().zoom(2.5, 3),
    camera2Ref().centerOn(circleRef(), 3),
    camera2Ref().zoom(1.8, 3),
    camera2Ref().rotation(180, 3),
  );

  yield* waitFor(1);

  // Swap views
  yield* all(
    camera1Ref().centerOn(circleRef(), 2),
    camera1Ref().rotation(90, 2),
    camera2Ref().centerOn(rectRef(), 2),
    camera2Ref().rotation(0, 2),
  );

  yield* waitFor(1);

  // Reset both
  yield* all(camera1Ref().reset(2), camera2Ref().reset(2));

  yield* waitFor(1);
});

/**
 * Test 5: Camera with actual Revideo assets
 */
const scene5 = makeScene2D('camera-with-assets', function* (view) {
  const cameraRef = createRef<Camera>();
  const logoRef = createRef<Img>();

  view.add(
    <Camera ref={cameraRef}>
      <Img
        ref={logoRef}
        width={200}
        src={
          'https://revideo-example-assets.s3.amazonaws.com/revideo-logo-white.png'
        }
        position={[0, 0]}
      />
      <Circle fill={'#4A90E2'} size={150} position={[-300, -200]} />
      <Rect fill={'#E24A90'} size={[120, 120]} position={[300, 200]} />
      <Circle fill={'#90E24A'} size={180} position={[-300, 200]} />
      <Rect fill={'#E2904A'} size={[100, 140]} position={[300, -200]} />
    </Camera>,
  );

  // Zoom in on logo
  yield* all(
    cameraRef().centerOn(logoRef(), 2),
    cameraRef().zoom(3, 2),
  );

  yield* waitFor(0.5);

  // Rotate while zoomed
  yield* cameraRef().rotation(360, 3);

  yield* waitFor(0.5);

  // Zoom out and rotate back
  yield* all(cameraRef().zoom(1, 2), cameraRef().rotation(0, 2));

  yield* waitFor(0.5);

  // Pan around the scene
  yield* cameraRef().centerOn([-300, -200], 1.5);
  yield* cameraRef().centerOn([300, 200], 1.5);
  yield* cameraRef().centerOn([-300, 200], 1.5);
  yield* cameraRef().centerOn([300, -200], 1.5);

  yield* waitFor(0.5);

  // Reset
  yield* cameraRef().reset(2);

  yield* waitFor(1);
});

/**
 * Test 6: Complex camera movements combining all features
 */
const scene6 = makeScene2D('complex-camera-demo', function* (view) {
  const cameraRef = createRef<Camera>();
  const curveRef = createRef<Spline>();
  const target1 = createRef<Rect>();
  const target2 = createRef<Circle>();

  view.add(
    <>
      {/* Curved path - stays still as visual guide */}
      <Spline
        ref={curveRef}
        lineWidth={4}
        stroke={'#666'}
        points={[
          [-600, -300],
          [-300, 300],
          [0, -200],
          [300, 200],
          [600, -300],
        ]}
        smoothness={0.7}
        opacity={0.3}
      />

      {/* Camera with content that follows the path */}
      <Camera ref={cameraRef}>
        <Rect
          ref={target1}
          fill={'#FF6B6B'}
          size={[120, 120]}
          position={[-400, 0]}
        />
        <Circle
          ref={target2}
          fill={'#4ECDC4'}
          size={140}
          position={[400, 0]}
        />
        <Rect fill={'#95E1D3'} size={[80, 80]} position={[0, -250]} />
        <Rect fill={'#F38181'} size={[80, 80]} position={[0, 250]} />
      </Camera>
    </>,
  );

  // Complex sequence
  yield* chain(
    // Start with centering and zoom
    all(
      cameraRef().centerOn(target1(), 2),
      cameraRef().zoom(2.2, 2),
    ),

    waitFor(0.5),

    // Follow the curve while zoomed
    cameraRef().followCurve(curveRef(), 4),

    waitFor(0.5),

    // Center on second target with rotation
    all(
      cameraRef().centerOn(target2(), 2),
      cameraRef().rotation(180, 2),
      cameraRef().zoom(1.5, 2),
    ),

    waitFor(0.5),

    // Follow curve in reverse with rotation
    cameraRef().followCurveWithRotationReverse(curveRef(), 5),

    waitFor(0.5),

    // Final reset
    cameraRef().reset(2.5),

    waitFor(1),
  );
});