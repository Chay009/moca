'use client';

/**
 * Unified Text Property Panel
 * Core properties only - Layout, Text, Opacity, Fill, Stroke, Shadow
 * Effect-specific properties passed as children component
 */
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyPanelProps } from '../../types/componentPlugin';
import { ReactNode } from 'react';

const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Comic Sans MS',
];

interface TextPropertyPanelProps extends PropertyPanelProps {
  effectPanel?: ReactNode;
}

export function TextPropertyPanel({ element, onUpdate, effectPanel }: TextPropertyPanelProps) {
  const updateProperty = (key: string, value: any) => {
    onUpdate({ [key]: value });
  };

  return (
    <div className="space-y-6 p-4">
      {/* Layout Section */}
      <div>
        <h3 className="font-semibold mb-3">Layout</h3>

        {/* Position */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <Label className="text-xs">Position</Label>
            <div className="flex gap-1">
              <Input
                type="number"
                value={element.properties.x ?? 0}
                onChange={(e) => updateProperty('x', Number(e.target.value))}
                placeholder="X"
                size={1}
              />
              <Input
                type="number"
                value={element.properties.y ?? 0}
                onChange={(e) => updateProperty('y', Number(e.target.value))}
                placeholder="Y"
                size={1}
              />
            </div>
          </div>

          {/* Size */}
          <div>
            <Label className="text-xs">Size</Label>
            <div className="flex gap-1">
              <Input
                type="number"
                value={element.properties.width ?? ''}
                onChange={(e) => updateProperty('width', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="W"
                size={1}
              />
              <Input
                type="number"
                value={element.properties.height ?? ''}
                onChange={(e) => updateProperty('height', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="H"
                size={1}
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Angle</Label>
            <Input
              type="number"
              value={element.properties.rotation ?? 0}
              onChange={(e) => updateProperty('rotation', Number(e.target.value))}
              placeholder="0"
            />
          </div>
          <div>
            <Label className="text-xs">Scale</Label>
            <Slider
              value={[element.properties.scale ?? 1]}
              onValueChange={([value]) => updateProperty('scale', value)}
              min={0.1}
              max={3}
              step={0.1}
            />
          </div>
        </div>
      </div>

      {/* Text Section */}
      <div>
        <h3 className="font-semibold mb-3">Text</h3>

        {/* Font Family */}
        <div className="mb-3">
          <Label className="text-xs">Font Family</Label>
          <Select
            value={element.properties.fontFamily ?? 'Arial'}
            onValueChange={(value) => updateProperty('fontFamily', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem key={font} value={font}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Style & Weight */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <Label className="text-xs">Style</Label>
            <Select
              value={element.properties.fontStyle ?? 'normal'}
              onValueChange={(value) => updateProperty('fontStyle', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Regular</SelectItem>
                <SelectItem value="italic">Italic</SelectItem>
                <SelectItem value="oblique">Oblique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Weight</Label>
            <Select
              value={String(element.properties.fontWeight ?? 'normal')}
              onValueChange={(value) => updateProperty('fontWeight', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="300">300</SelectItem>
                <SelectItem value="500">500</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Font Size */}
        <div className="mb-3">
          <Label className="text-xs">Size</Label>
          <Slider
            value={[element.properties.fontSize ?? 50]}
            onValueChange={([value]) => updateProperty('fontSize', value)}
            min={8}
            max={200}
            step={1}
          />
        </div>

        {/* Text Alignment */}
        <div className="mb-3">
          <Label className="text-xs">Text Align</Label>
          <Select
            value={element.properties.textAlign ?? 'left'}
            onValueChange={(value) => updateProperty('textAlign', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
              <SelectItem value="justify">Justify</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Line Height */}
        <div className="mb-3">
          <Label className="text-xs">Line Height</Label>
          <Slider
            value={[element.properties.lineHeight ?? 1]}
            onValueChange={([value]) => updateProperty('lineHeight', value)}
            min={0.5}
            max={3}
            step={0.1}
          />
        </div>

        {/* Letter Spacing */}
        <div>
          <Label className="text-xs">Letter Spacing</Label>
          <Slider
            value={[element.properties.letterSpacing ?? 0]}
            onValueChange={([value]) => updateProperty('letterSpacing', value)}
            min={-5}
            max={20}
            step={1}
          />
        </div>
      </div>

      {/* Opacity Section */}
      <div>
        <Label className="text-xs">Opacity</Label>
        <Slider
          value={[element.properties.opacity ?? 1]}
          onValueChange={([value]) => updateProperty('opacity', value)}
          min={0}
          max={1}
          step={0.01}
        />
      </div>

      {/* Fill Section */}
      <div>
        <Label className="text-xs">Fill</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={element.properties.fill ?? '#ffffff'}
            onChange={(e) => updateProperty('fill', e.target.value)}
            className="w-12 h-8"
          />
          <Input
            type="text"
            value={element.properties.fill ?? '#ffffff'}
            onChange={(e) => updateProperty('fill', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {/* Stroke Section */}
      <div>
        <Label className="text-xs">Stroke</Label>
        <div className="flex gap-2 mb-2">
          <Input
            type="color"
            value={element.properties.stroke ?? '#000000'}
            onChange={(e) => updateProperty('stroke', e.target.value)}
            className="w-12 h-8"
          />
          <Input
            type="text"
            value={element.properties.stroke ?? '#000000'}
            onChange={(e) => updateProperty('stroke', e.target.value)}
            className="flex-1"
          />
        </div>
        <Label className="text-xs">Line Width</Label>
        <Slider
          value={[element.properties.lineWidth ?? 0]}
          onValueChange={([value]) => updateProperty('lineWidth', value)}
          min={0}
          max={10}
          step={0.5}
        />
      </div>

      {/* Shadow Section */}
      <div>
        <h3 className="font-semibold mb-3">Shadow</h3>

        <div className="mb-3">
          <Label className="text-xs">Blur</Label>
          <Slider
            value={[element.properties.shadowBlur ?? 0]}
            onValueChange={([value]) => updateProperty('shadowBlur', value)}
            min={0}
            max={50}
            step={1}
          />
        </div>

        <div>
          <Label className="text-xs">Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={element.properties.shadowColor ?? '#000000'}
              onChange={(e) => updateProperty('shadowColor', e.target.value)}
              className="w-12 h-8"
            />
            <Input
              type="text"
              value={element.properties.shadowColor ?? '#000000'}
              onChange={(e) => updateProperty('shadowColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Effect Section - Passed as children */}
      {effectPanel}
    </div>
  );
}
