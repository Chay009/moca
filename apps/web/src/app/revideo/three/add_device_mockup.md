const modelPath = props.modelPath ?? '/models/iphone-17-pro/scene.gltf';

# we have two way one is 
we get the model and use gltfjsx to convert into jsx and then we use in preview to control like rotation etc for custom which  is not impleemnred yet like rotatot which is #TODO
and then we sync back it


for effect chekc rotato.app and you 'll undetand what preset to do

const screenMeshName = props.screenMeshName ?? 'Object_55';
To add a new device model, you only need to:
Add the 3D model file to /public/models/[device-name]/scene.gltf
Pass the props when creating the element:
{
  sceneType: 'iphone',
  modelPath: '/models/samsung-s24/scene.gltf',  // Your new model
  screenMeshName: 'Screen_Mesh',                 // The screen mesh name
  deviceScale: 15,
  // ... other props
}
How to Add New Devices (No Code Changes Needed!)
Example: Adding Samsung Galaxy
addElementToScene(currentScene.id, {
  type: 'three',
  properties: {
    sceneType: 'iphone',  // Uses same scene generator
    modelPath: '/models/samsung-galaxy-s24/scene.gltf',
    screenMeshName: 'display_screen',  // Find this in the .gltf file
    devicePreset: 'floating',
    deviceScale: 12,
    // ... rest of props
  },
});
Example: Adding MacBook
{
  sceneType: 'iphone',  // Still uses same generator!
  modelPath: '/models/macbook-pro/scene.gltf',
  screenMeshName: 'laptop_screen',
  deviceScale: 20,
  // ...
}
The Magic: It's Already Generic! 🎉
The createIPhoneScene function is actually a generic device mockup renderer. The name is misleading - it should probably be called createDeviceMockupScene. It works for ANY 3D model with a screen mesh. What makes it work:
✅ Accepts any modelPath
✅ Accepts any screenMeshName
✅ Has model caching (won't reload same model)
✅ Generic lighting, camera, and rendering
✅ Device presets (floating, table, hand)
So you can add:
📱 Any phone (iPhone, Samsung, Pixel, etc.)
💻 Laptops (MacBook, Surface, etc.)
⌚ Watches (Apple Watch, Galaxy Watch, etc.)
🖥️ Desktop monitors
📱 Tablets (iPad, etc.)
All without touching the Three.js code!