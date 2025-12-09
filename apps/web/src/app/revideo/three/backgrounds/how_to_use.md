src/components/revideo/three/
├── backgrounds/
│   ├── PixelBlastScene.ts          (200 lines) - Scene generator
│   ├── constants.ts                 (40 lines)  - Defaults & configs
│   └── shaders/
│       ├── pixelBlast.vert.ts       (8 lines)   - Vertex shader
│       └── pixelBlast.frag.ts       (150 lines) - Fragment shader
└── types/
    └── backgroundTypes.ts           (25 lines)  - Type definitions

|

🔧 Technical Implementation
Pure Prop-Based Pattern:

// NO React hooks, NO interactivity, NO event listeners
export function createPixelBlastScene(props) {
  // 1. Create scene from props
  // 2. Setup uniforms from props
  // 3. Return update function
  return {
    scene,
    update: (time) => {
      uniforms.uTime.value = time * speed;
    },
    updateFromProps: (newProps) => {
      // Live prop updates
    }
  };
}
Updated Files (6 files):

threeTypes.ts

Added 'pixelBlast' to ThreeSceneType
Added 8 shader properties to ThreeComponentProps
Added pixelBlast to DEFAULT_THREE_CONFIGS
sceneGenerators.ts

Exported createPixelBlastScene
componentFactory.ts

Added case 'pixelBlast' to switch
projectStore.ts

Added 8 shader properties to ElementProperties
PropertyPanel.tsx

Added "Pixel Blast (Shader)" to scene type selector
Added conditional UI section with 8 controls
index.ts

Exported background types
🚀 How to Use
Add Three.js Component: Click "3D Scene (Three.js)" in SceneElementPanel
Select Shader: In PropertyPanel, change Scene Type to "Pixel Blast (Shader)"
Customize: Adjust all 8 properties in real-time
Preview: See live updates in the canvas
