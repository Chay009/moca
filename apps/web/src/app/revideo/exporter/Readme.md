
the export video is the etry where our ui calls 

now the folder structure is such that it explain the heiracy
now the exporter have multiple exporters 
the two exporters are 
1. this is legacy where it use to pull the frame of player which is meant to be preview real time so for 10 mins video it needs 10 min just to read since real time is 1:1
2. then we have revideoexporter 
    this is responsible for multiple things 
    sine revideo dont let us connect custom expter this is other way around
     
     this revideo--renderScenesWithRevideo
     takes scenes and intializes project (this setup is for having multiple scenes dynamicaaly which revideo/motioncanvas won't allow)
     then is our customrenderer which initialzes the rendering

     the rendering is reading+encoding

     so the customrender registee the rendererrun func from internal code

     we did all this to register our new soultion to work with exporters like ffmpegclient,image...
     so we made it as plugin which is class which follows all rendererrun exposes it is like source 
     of truth to manage the internal rendering state,status optmizations.

     so internal rennererun registers the plugin

    # NOTE
    all the ui states must be mostly by the plugin only not custom i mean all the frames state project intialization everyhting is optmial if we track fromt there.