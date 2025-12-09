'use client';

/**
 * TextShining Effect Panel
 * Shine-specific animation properties
 */
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PropertyPanelProps } from '../../../types/componentPlugin';

export function TextShiningEffectPanel({ element, onUpdate }: PropertyPanelProps) {
  const updateProperty = (key: string, value: any) => {
    onUpdate({ [key]: value });
  };

  return (
    <div>
      <h3 className="font-semibold mb-3">Shine Effect</h3>

      <div className="mb-3">
        <Label className="text-xs">Opacity</Label>
        <Slider
          value={[element.properties.shineOpacity ?? 0.6]}
          onValueChange={([value]) => updateProperty('shineOpacity', value)}
          min={0}
          max={1}
          step={0.05}
        />
      </div>

      <div className="mb-3">
        <Label className="text-xs">Speed</Label>
        <Slider
          value={[element.properties.shineSpeed ?? 1]}
          onValueChange={([value]) => updateProperty('shineSpeed', value)}
          min={0.5}
          max={3}
          step={0.1}
        />
      </div>

      <div className="mb-3">
        <Label className="text-xs">Angle</Label>
        <Slider
          value={[element.properties.shineAngle ?? 45]}
          onValueChange={([value]) => updateProperty('shineAngle', value)}
          min={0}
          max={360}
          step={5}
        />
      </div>

      <div>
        <Label className="text-xs">Width</Label>
        <Slider
          value={[element.properties.shineWidth ?? 100]}
          onValueChange={([value]) => updateProperty('shineWidth', value)}
          min={20}
          max={300}
          step={10}
        />
      </div>
    </div>
  );
}
