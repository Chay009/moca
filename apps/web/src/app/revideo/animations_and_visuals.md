there are two type of things defined in docs
one is elements props and other is aniations props

so one thing is react to motioncanasv should only be via props 
react system or architecture decisision shouldn't come to animtions catrgoty


1. is image props like this https://docs.re.video/api/2d/components/ImgProps
    <Img 
      ref={imageRef}
      src="https://images.unsplash.com/photo-1679218407381-a6f1660d60e9"
      width={300}
      radius={20}
      smoothing={true}
      filters={[
        // Filter configuration
      ]}
    />
    so in image if it is imgprops or any componetprops which are used like jsx props


    2.animations https://docs.re.video/api/2d/components/Img

    these are for animtiosn
    like we create ref and attach to it and to control it we use them

    -----------------------
    const ref = createRef<Img>();
  yield view.add(
    <Img
      ref={ref}
      src="https://images.unsplash.com/photo-1679218407381-a6f1660d60e9"
      width={300}
      radius={20}
    />,
  );

  // set the background using the color sampled from the image:
  ref().fill(ref().getColorAtPoint(0));

  yield* all(
    ref().size([100, 100], 1).to([300, null], 1),
    ref().radius(50, 1).to(20, 1),
    ref().alpha(0, 1).to(1, 1),
  );
  yield* waitFor(0.5);