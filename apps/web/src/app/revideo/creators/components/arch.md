componentFactory is the boilerplate/template generator for each component      
  type.

  How it works:

  User clicks "Add Rect"
    ↓
  projectStore.addElementToScene({ type: 'rect', properties: { width: 200 } })
    ↓
  MainScene reads from store
    ↓
  createComponent({ type: 'rect', elementId: 'el-123', width: 200 })
    ↓
  componentFactory routes to createRectComponent()
    ↓
  Returns: <Rect key="el-123" width={200} ... />
    ↓
  MainScene adds it to view

  componentFactory is the "factory" that:
  1. Takes generic props (type, elementId, width, etc.)
  2. Routes to the correct component creator function
  3. Returns JSX with proper defaults and structure

  Think of it like:
  - projectStore = Database (stores what elements exist)
  - componentFactory = Blueprint/Template (knows how to build each type)
  - MainScene = Construction site (assembles everything)

  Benefits:
  - ✅ All component creation logic in one place
  - ✅ Easy to add new component types
  - ✅ Consistent defaults across the app
  - ✅ Type-specific customization (buttons have labels, circles have size, etc.)

  
  1. They're imported in componentFactory.tsx:11-27:
  import {
    createTextComponent,
    createRectComponent,
    createCircleComponent,
    // ... etc
  } from './components';

  2. They're called by the factory:
  case 'text':
    return createTextComponent(props as any);
  case 'rect':
    return createRectComponent(props as any);

  3. The factory returns nodes that get added to the scene:

  In MainScene.tsx (somewhere in your scene generation code):
  const node = createComponent(element);  // Calls createTextComponent,
  createRectComponent, etc.
  if (node) {
    this.add(node);  // YES - adds as child to the scene!
  }

  So YES, they do get added as children!

  Why we split them:
  - Before: All logic was in one 656-line componentFactory.tsx file
  - After: Each component type in its own file (easier to maintain)
  - They're just organizational - same functionality, better structu