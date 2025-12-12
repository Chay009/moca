 Normal Motion Canvas Pattern:

  export default makeScene2D(function* (view) {
    // Create and add in one place
    const text = createRef<Txt>();
    view.add(<Txt ref={text} text="Hello" />);

    // Animate immediately
    yield* text().opacity(1, 1);
  });

  Your Template System Problem:

  You need dynamic components based on user data, so you can't hardcode them in the scene.

  Your Solution:

  // 1. Factory creates node separately
  export function createTextTypewriter(props) {
    // this is the jsut like motion canvas scene we jsut logically define first here and animte in mainscene 
    return {
      node: <Layout>...</Layout>,  // Created but not added yet
      animate: function* () { }     // Animation ready but not run yet
    };
  }

  // 2. MainScene adds nodes
  const { node, animate } = createComponent(props);
  view.add(node);  // Now it exists in scene

  // 3. MainScene runs animations
  yield* animate();  // Now we can animate it