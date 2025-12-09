'use client';

/**
 * TextBounce Effect Panel
 * Bounce-specific animation properties
 */
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PropertyPanelProps } from '../../../types/componentPlugin';

export function TextBounceEffectPanel({ element, onUpdate }: PropertyPanelProps) {
  const updateProperty = (key: string, value: any) => {
    onUpdate({ [key]: value });
  };

  return (
    <div>
      <h3 className="font-semibold mb-3">Bounce Effect</h3>

      <div className="mb-3">
        <Label className="text-xs">Height</Label>
        <Slider
          value={[element.properties.bounceHeight ?? 50]}
          onValueChange={([value]) => updateProperty('bounceHeight', value)}
          min={10}
          max={200}
          step={5}
        />
      </div>

      <div className="mb-3">
        <Label className="text-xs">Times</Label>
        <Slider
          value={[element.properties.bounceTimes ?? 3]}
          onValueChange={([value]) => updateProperty('bounceTimes', value)}
          min={1}
          max={10}
          step={1}
        />
      </div>

      <div className="mb-3">
        <Label className="text-xs">Duration</Label>
        <Slider
          value={[element.properties.bounceDuration ?? 0.5]}
          onValueChange={([value]) => updateProperty('bounceDuration', value)}
          min={0.1}
          max={3}
          step={0.1}
        />
      </div>

      <div>
        <Label className="text-xs">Delay</Label>
        <Slider
          value={[element.properties.bounceDelay ?? 0]}
          onValueChange={([value]) => updateProperty('bounceDelay', value)}
          min={0}
          max={5}
          step={0.1}
        />
      </div>
    </div>
  );
}
