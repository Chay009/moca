# Image & Video Component Implementation Guide

## 📋 Implementation Checklist

### Phase 1A: Image Components (3-4 days)

#### Day 1: ImageSimple Component
```
revideo/creators/components/image/ImageSimple/
├── default_props.ts
├── animation.tsx
├── propertyPanel.tsx
└── index.ts
```

**1. Create `default_props.ts`**
```typescript
export const IMAGE_SIMPLE_DEFAULT_PROPS = {
  // Transform
  x: 0,
  y: 0,
  width: 400,
  height: 300,
  rotation: 0,
  scale: 1,
  opacity: 1,
  zIndex: 1,

  // Image-specific
  src: '',
  fit: 'cover' as 'cover' | 'contain' | 'fill',
  clip: false,
  smoothing: true,
  radius: 0,  // Border radius

  // Filters
  brightness: 1,
  contrast: 1,
  saturate: 1,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,

  // Animation
  duration: 1,
  delay: 0,
};
```

**2. Create `animation.tsx`**
```tsx
/** @jsxImportSource @revideo/2d/lib */
import { Img } from '@revideo/2d';
import * as easings from '@revideo/core';

export function* createImageSimple(props: any) {
  const node = (
    <Img
      key={props.elementId}
      src={props.src}
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      rotation={props.rotation}
      scale={props.scale}
      opacity={props.opacity}
      radius={props.radius}
      smoothing={props.smoothing}
      clip={props.clip}
      filters={{
        brightness: props.brightness,
        contrast: props.contrast,
        saturate: props.saturate,
        blur: props.blur,
        grayscale: props.grayscale,
        sepia: props.sepia,
        hueRotate: props.hueRotate,
      }}
    />
  );

  // Optional entrance animation
  if (props.delay > 0) {
    yield* easings.waitFor(props.delay);
  }
  
  // Fade in animation
  yield* node.opacity(props.opacity, props.duration);

  return node;
}
```

**3. Create `propertyPanel.tsx`**
```tsx
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyPanelProps } from '../../../types/componentPlugin';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export function ImageSimplePropertyPanel({ element, onUpdate }: PropertyPanelProps) {
  const props = element.properties;

  const updateProperty = (key: string, value: any) => {
    onUpdate({ [key]: value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to data URI
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      updateProperty('src', dataUri);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Image Source */}
      <div>
        <Label>Image Source</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={props.src || ''}
            onChange={(e) => updateProperty('src', e.target.value)}
            placeholder="https://... or data:image/..."
            className="flex-1"
          />
          <Button size="icon" variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
            <Upload className="h-4 w-4" />
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Fit Mode */}
      <div>
        <Label>Fit Mode</Label>
        <Select value={props.fit || 'cover'} onValueChange={(value) => updateProperty('fit', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">Cover</SelectItem>
            <SelectItem value="contain">Contain</SelectItem>
            <SelectItem value="fill">Fill</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Border Radius */}
      <div>
        <div className="flex justify-between">
          <Label>Border Radius</Label>
          <span className="text-sm text-muted-foreground">{props.radius || 0}px</span>
        </div>
        <Slider
          value={[props.radius || 0]}
          onValueChange={([value]) => updateProperty('radius', value)}
          min={0}
          max={100}
          step={1}
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Filters</Label>

        {/* Brightness */}
        <div>
          <div className="flex justify-between">
            <Label className="text-xs">Brightness</Label>
            <span className="text-xs text-muted-foreground">{props.brightness || 1}</span>
          </div>
          <Slider
            value={[props.brightness || 1]}
            onValueChange={([value]) => updateProperty('brightness', value)}
            min={0}
            max={2}
            step={0.1}
          />
        </div>

        {/* Contrast */}
        <div>
          <div className="flex justify-between">
            <Label className="text-xs">Contrast</Label>
            <span className="text-xs text-muted-foreground">{props.contrast || 1}</span>
          </div>
          <Slider
            value={[props.contrast || 1]}
            onValueChange={([value]) => updateProperty('contrast', value)}
            min={0}
            max={2}
            step={0.1}
          />
        </div>

        {/* Blur */}
        <div>
          <div className="flex justify-between">
            <Label className="text-xs">Blur</Label>
            <span className="text-xs text-muted-foreground">{props.blur || 0}px</span>
          </div>
          <Slider
            value={[props.blur || 0]}
            onValueChange={([value]) => updateProperty('blur', value)}
            min={0}
            max={20}
            step={0.5}
          />
        </div>

        {/* Saturate */}
        <div>
          <div className="flex justify-between">
            <Label className="text-xs">Saturation</Label>
            <span className="text-xs text-muted-foreground">{props.saturate || 1}</span>
          </div>
          <Slider
            value={[props.saturate || 1]}
            onValueChange={([value]) => updateProperty('saturate', value)}
            min={0}
            max={2}
            step={0.1}
          />
        </div>

        {/* Grayscale */}
        <div>
          <div className="flex justify-between">
            <Label className="text-xs">Grayscale</Label>
            <span className="text-xs text-muted-foreground">{props.grayscale || 0}</span>
          </div>
          <Slider
            value={[props.grayscale || 0]}
            onValueChange={([value]) => updateProperty('grayscale', value)}
            min={0}
            max={1}
            step={0.1}
          />
        </div>
      </div>
    </div>
  );
}
```

**4. Create `index.ts`**
```typescript
import { ComponentPlugin } from '../../../types/componentPlugin';
import { IMAGE_SIMPLE_DEFAULT_PROPS } from './default_props';
import { createImageSimple } from './animation';
import { ImageSimplePropertyPanel } from './propertyPanel';

export const ImageSimple: ComponentPlugin = {
  type: 'image-simple',
  category: 'image',
  displayName: 'Image',
  icon: '🖼️',

  defaultProps: IMAGE_SIMPLE_DEFAULT_PROPS,
  create: createImageSimple,
  PropertyPanel: ImageSimplePropertyPanel,
};
```

**5. Create Registry**
Create `revideo/creators/components/image/registry.ts`:
```typescript
import { ComponentRegistry } from '../../types/componentPlugin';
import { ImageSimple } from './ImageSimple/index';

export const imageComponents: ComponentRegistry = {
  [ImageSimple.type]: ImageSimple,
};
```

**6. Update Main Component Registry**
In `revideo/creators/components/registry.ts`:
```typescript
import { textComponents } from './text/registry';
import { imageComponents } from './image/registry';

export const allComponents: ComponentRegistry = {
  ...textComponents,
  ...imageComponents,
};
```

---

#### Day 2: ImageAnimated Component

Same structure as ImageSimple, but with entrance animations:

**`animation.tsx` differences:**
```tsx
export function* createImageAnimated(props: any) {
  const node = (
    <Img
      // ... same props as ImageSimple
      opacity={0}  // Start hidden
    />
  );

  yield* easings.waitFor(props.delay || 0);

  // Apply animation preset
  switch (props.animationPreset) {
    case 'fade-in':
      yield* node.opacity(props.opacity, props.duration);
      break;

    case 'scale-in':
      node.scale(0);
      yield* node.scale(props.scale, props.duration);
      yield* node.opacity(props.opacity, props.duration);
      break;

    case 'slide-in-left':
      node.x(props.x - 500);
      yield* node.x(props.x, props.duration);
      yield* node.opacity(props.opacity, props.duration);
      break;

    // Add more presets...
  }

  return node;
}
```

---

### Phase 1B: Video Components (3-4 days)

#### Day 3-4: VideoSimple Component

**1. Create `default_props.ts`**
```typescript
export const VIDEO_SIMPLE_DEFAULT_PROPS = {
  // Transform
  x: 0,
  y: 0,
  width: 640,
  height: 360,
  rotation: 0,
  scale: 1,
  opacity: 1,
  zIndex: 1,

  // Video-specific
  src: '',
  fit: 'cover' as 'cover' | 'contain' | 'fill',
  clip: false,
  radius: 0,

  // Playback
  volume: 1,
  playbackRate: 1,
  loop: false,
  play: true,

  // Trim
  trimStart: 0,
  trimEnd: 0,  // 0 = no trim

  // Filters (share with images)
  brightness: 1,
  contrast: 1,
  saturate: 1,
  blur: 0,
  grayscale: 0,

  // Animation
  duration: 1,
  delay: 0,
};
```

**2. Create `animation.tsx`**
```tsx
/** @jsxImportSource @revideo/2d/lib */
import { Video } from '@revideo/2d';
import * as easings from '@revideo/core';

export function* createVideoSimple(props: any) {
  const node = (
    <Video
      key={props.elementId}
      src={props.src}
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      rotation={props.rotation}
      scale={props.scale}
      opacity={props.opacity}
      radius={props.radius}
      clip={props.clip}
      volume={props.volume}
      playbackRate={props.playbackRate}
      loop={props.loop}
      play={props.play}
      filters={{
        brightness: props.brightness,
        contrast: props.contrast,
        saturate: props.saturate,
        blur: props.blur,
        grayscale: props.grayscale,
      }}
    />
  );

  if (props.delay > 0) {
    yield* easings.waitFor(props.delay);
  }

  // Start video playback
  if (props.play) {
    yield* node.play();
  }

  // Apply trim
  if (props.trimStart > 0) {
    yield* node.seek(props.trimStart);
  }

  if (props.trimEnd > 0) {
    yield* easings.waitUntil(props.trimEnd);
    yield* node.pause();
  }

  return node;
}
```

**3. Create `propertyPanel.tsx`**
```tsx
export function VideoSimplePropertyPanel({ element, onUpdate }: PropertyPanelProps) {
  const props = element.properties;

  const updateProperty = (key: string, value: any) => {
    onUpdate({ [key]: value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      updateProperty('src', dataUri);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Video Source */}
      <div>
        <Label>Video Source</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={props.src || ''}
            onChange={(e) => updateProperty('src', e.target.value)}
            placeholder="https://... or data:video/..."
            className="flex-1"
          />
          <Button size="icon" variant="outline" onClick={() => document.getElementById('video-upload')?.click()}>
            <Upload className="h-4 w-4" />
          </Button>
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Playback Controls */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Playback</Label>

        {/* Volume */}
        <div>
          <div className="flex justify-between">
            <Label className="text-xs">Volume</Label>
            <span className="text-xs text-muted-foreground">{Math.round((props.volume || 1) * 100)}%</span>
          </div>
          <Slider
            value={[props.volume || 1]}
            onValueChange={([value]) => updateProperty('volume', value)}
            min={0}
            max={1}
            step={0.1}
          />
        </div>

        {/* Playback Rate */}
        <div>
          <Label className="text-xs">Speed</Label>
          <Select value={String(props.playbackRate || 1)} onValueChange={(value) => updateProperty('playbackRate', Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.25">0.25x</SelectItem>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="0.75">0.75x</SelectItem>
              <SelectItem value="1">1x (Normal)</SelectItem>
              <SelectItem value="1.25">1.25x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loop */}
        <div className="flex items-center justify-between">
          <Label className="text-xs">Loop</Label>
          <Switch
            checked={props.loop || false}
            onCheckedChange={(checked) => updateProperty('loop', checked)}
          />
        </div>
      </div>

      {/* Trim Controls */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Trim</Label>

        <div>
          <Label className="text-xs">Start Time (seconds)</Label>
          <Input
            type="number"
            value={props.trimStart || 0}
            onChange={(e) => updateProperty('trimStart', Number(e.target.value))}
            min={0}
            step={0.1}
          />
        </div>

        <div>
          <Label className="text-xs">End Time (seconds, 0 = no trim)</Label>
          <Input
            type="number"
            value={props.trimEnd || 0}
            onChange={(e) => updateProperty('trimEnd', Number(e.target.value))}
            min={0}
            step={0.1}
          />
        </div>
      </div>

      {/* Filters - Same as Images */}
      {/* ... Copy filter sliders from ImageSimplePropertyPanel ... */}
    </div>
  );
}
```

---

### Phase 2: StyleSettings.tsx Expansion

Update `StyleSettings.tsx` to handle images and videos:

```tsx
export default function StyleSettings() {
  // ... existing code ...

  const isTextElement = selectedElement.type.includes('text') || selectedElement.type === 'animated-text';
  const isImageElement = selectedElement.type.includes('image');
  const isVideoElement = selectedElement.type.includes('video');

  return (
    <TabsContent value="styles" ...>
      <div className="flex flex-col">

        {/* Typography Section - Only for text */}
        {isTextElement && (
          <Section title="Typography" icon={Type}>
            {/* ... existing text controls ... */}
          </Section>
        )}

        {/* Image/Video Section */}
        {(isImageElement || isVideoElement) && (
          <Section title={isImageElement ? "Image" : "Video"} icon={isImageElement ? Image : Video}>
            <div className="space-y-5">
              
              {/* Source URL */}
              <div className="space-y-1.5">
                <PropertyLabel>Source</PropertyLabel>
                <Input
                  value={props.src || ''}
                  onChange={(e) => updateProperty('src', e.target.value)}
                  placeholder={isImageElement ? "Image URL" : "Video URL"}
                  className="text-xs"
                />
              </div>

              {/* Fit Mode */}
              <div className="space-y-1.5">
                <PropertyLabel>Fit Mode</PropertyLabel>
                <Select value={props.fit || 'cover'} onValueChange={(v) => updateProperty('fit', v)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="fill">Fill</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Video-specific controls */}
              {isVideoElement && (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <PropertyLabel className="mb-0">Volume</PropertyLabel>
                      <span className="text-[10px] text-muted-foreground">{Math.round((props.volume || 1) * 100)}%</span>
                    </div>
                    <Slider
                      value={[props.volume || 1]}
                      onValueChange={([value]) => updateProperty('volume', value)}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>

                  <NumberInput
                    label="Playback Speed"
                    value={props.playbackRate || 1}
                    onChange={(v: number) => updateProperty('playbackRate', v)}
                    suffix="x"
                    min={0.25}
                    max={2}
                    step={0.25}
                  />
                </>
              )}

              {/* Filters Section */}
              <Separator />
              
              <div className="space-y-3">
                <PropertyLabel>Filters</PropertyLabel>
                
                <div className="flex justify-between items-center">
                  <PropertyLabel className="mb-0 text-[9px]">Brightness</PropertyLabel>
                  <span className="text-[10px] text-muted-foreground">{props.brightness || 1}</span>
                </div>
                <Slider
                  value={[props.brightness || 1]}
                  onValueChange={([value]) => updateProperty('brightness', value)}
                  min={0}
                  max={2}
                  step={0.1}
                />

                {/* Add more filter sliders: contrast, blur, saturate, grayscale */}
              </div>
            </div>
          </Section>
        )}

        {/* Colors & Effects - All elements */}
        <Section title="Colors & Effects" icon={Palette}>
          {/* ... existing code ... */}
        </Section>

        {/* Transform - All elements */}
        <Section title="Transform" icon={Move}>
          {/* ... existing code ... */}
        </Section>

      </div>
    </TabsContent>
  );
}
```

---

## 🎯 Testing Checklist

### Images
- [ ] Upload image file
- [ ] Paste image URL
- [ ] Adjust fit mode (cover/contain/fill)
- [ ] Adjust border radius
- [ ] Test all filters (brightness, contrast, blur, etc.)
- [ ] Test transforms (scale, rotate, position)
- [ ] Test opacity
- [ ] Test with animations (fade-in, scale-in)

### Videos
- [ ] Upload video file
- [ ] Paste video URL
- [ ] Adjust volume
- [ ] Adjust playback speed
- [ ] Toggle loop
- [ ] Trim start/end
- [ ] Test all filters
- [ ] Test transforms
- [ ] Test video plays in preview
- [ ] Test video syncs with timeline

---

## 🚀 Quick Start Commands

```bash
# Create directory structure
mkdir -p src/app/revideo/creators/components/image/ImageSimple
mkdir -p src/app/revideo/creators/components/image/ImageAnimated
mkdir -p src/app/revideo/creators/components/video/VideoSimple

# Create files
touch src/app/revideo/creators/components/image/ImageSimple/{default_props.ts,animation.tsx,propertyPanel.tsx,index.ts}
touch src/app/revideo/creators/components/image/registry.ts
touch src/app/revideo/creators/components/video/VideoSimple/{default_props.ts,animation.tsx,propertyPanel.tsx,index.ts}
touch src/app/revideo/creators/components/video/registry.ts
```

---

## 💡 Pro Tips

1. **Share filter code** - Create a shared `FilterControls` component for images and videos
2. **Upload to cloud** - For production, use Cloudinary or Uploadcare instead of data URIs
3. **Video thumbnails** - Extract first frame as thumbnail for better UX
4. **Lazy loading** - Only load videos when they're visible in timeline
5. **Format validation** - Check file types before upload
6. **Error handling** - Show errors for invalid URLs or failed uploads
7. **Progress indicators** - Show upload progress for large files

---

## 🔄 Next Steps After Implementation

1. **Test thoroughly** - All controls, uploads, playback
2. **Add to component picker** - Make images/videos selectable from UI
3. **Update documentation** - Document new component types
4. **Build example templates** - Create 2-3 example projects using images/videos
5. **Performance optimization** - Lazy load, caching, compression
