 /**
 * what is main scene
 *   Your Data Structure:

  // In sceneStore (Zustand state)
  scenes: [
    {
      id: 'scene-1',
      duration: 5,
      elements: [
        { id: 'text-1', type: 'text-simple', properties: {...} },
        { id: 'rect-1', type: 'rect', properties: {...} }
      ]
    },
    {
      id: 'scene-2',
      duration: 3,
      elements: [
        { id: 'text-2', type: 'text-typewriter', properties: {...} }
      ]
    }
  ]

  What MainScene Does:

  // MainScene receives:
  const scenes = variables.get('scenes', []);  // Array of YOUR custom scenes
  const currentSceneIndex = variables.get('currentSceneIndex', 0);  // Which one to show

  // Shows only ONE at a time:
  const currentScene = scenes[currentSceneIndex];  // scene-1 or scene-2

  // Renders that scene's elements:
  renderContentOnly(view, currentScene);

  So:

  - User's perspective: Multiple scenes (scene-1, scene-2, scene-3...)
  - Revideo's perspective: ONE scene (MainScene) that shows different content
  - MainScene's job: Take array of custom scenes, render the current one

  It's like a slideshow player:
  - You have 10 slides (custom scenes)
  - But only 1 projector (MainScene)
  - Projector shows whichever slide is "current"
 */
 
 
 
 
 
  Converts each custom scene → separate Revideo scene for export

  // You have 3 custom scenes:
  customScenes = [
    { id: 'scene-1', duration: 5, elements: [...] },
    { id: 'scene-2', duration: 3, elements: [...] },
    { id: 'scene-3', duration: 4, elements: [...] }
  ]

  // sceneFactory converts them:
  createProjectFromScenes(customScenes)
    ↓
  [
    makeScene2D('scene-1', function* (view) { /* render scene-1 */ }),
    makeScene2D('scene-2', function* (view) { /* render scene-2 */ }),
    makeScene2D('scene-3', function* (view) { /* render scene-3 */ })
  ]

  // Export project:
  makeProject({
    scenes: [RevideoScene1, RevideoScene2, RevideoScene3]
  })

  Comparison:

  |                 | MainScene                            | sceneFactory                           |
  |-----------------|--------------------------------------|----------------------------------------|
  | Purpose         | Live editor preview                  | Video export                           |
  | Revideo scenes  | 1 scene (shows different content)    | N scenes (one per custom scene)        |
  | Timeline        | All custom scenes share one timeline | Each scene has own timeline            |
  | When created    | Once at app start                    | Every export                           |
  | Scene switching | Change currentSceneIndex variable    | Revideo plays Scene1 → Scene2 → Scene3 |

  Why Both Exist:

  MainScene (Preview):
  - Fast - no project recreation when editing
  - Shows scenes[currentSceneIndex]
  - User can jump between scenes instantly

  sceneFactory (Export):
  - Proper video structure
  - Each scene is independent Revideo scene
  - Better for rendering/transitions
  - Can't jump between scenes (plays sequentially)

  So sceneFactory = "Convert my custom scene array into proper Revideo scenes for export"


   sceneComposer - What It Does:

  Shared rendering logic used by BOTH MainScene and sceneFactory

  // Both MainScene and sceneFactory need to:
  // 1. Take your custom scene data
  // 2. Create components (text, shapes, video, etc.)
  // 3. Add them to Revideo view
  // 4. Return nodes with animation configs

  // sceneComposer does this work:
  export function renderContentOnly(target, customScene) {
    const createdNodes = [];

    for (const element of customScene.elements) {
      // Create component using registry
      const componentResult = createComponent({
        elementId: element.id,
        type: element.type,  // 'text-typewriter', 'rect', etc.
        ...element.properties
      });

      // Extract node and animate function
      const node = componentResult.node ?? componentResult;
      const hasAnimate = componentResult.animate;

      // Add to view
      target.add(node);

      // Store for MainScene/sceneFactory to use
      createdNodes.push({
        node,
        config: element.properties.animation,
        animate: hasAnimate ? componentResult.animate : undefined
      });
    }

    return createdNodes;
  }

  Why sceneComposer Exists:

  Without sceneComposer (code duplication):
  // MainScene.tsx
  for (const element of scene.elements) {
    const component = createComponent({...});  // 🔴 Duplicate code
    view.add(component.node);
  }

  // sceneFactory.ts
  for (const element of scene.elements) {
    const component = createComponent({...});  // 🔴 Same code again!
    view.add(component.node);
  }

  With sceneComposer (DRY principle):
  // MainScene.tsx
  const nodes = renderContentOnly(view, currentScene);  // ✅ Reuse

  // sceneFactory.ts
  const nodes = renderScene(view, customScene);  // ✅ Reuse

  Summary:

  | File          | Purpose                                                                             |
  |---------------|-------------------------------------------------------------------------------------|
  | sceneComposer | Shared function: "Take custom scene data → create Revideo components → add to view" |
  | MainScene     | Uses sceneComposer to render current scene for preview                              |
  | sceneFactory  | Uses sceneComposer to render each scene for export                                  |

  sceneComposer = DRY helper so you don't write component creation logic twice.
