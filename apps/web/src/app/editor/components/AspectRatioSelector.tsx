'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3';

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onValueChange: (value: AspectRatio) => void;
}

const ASPECT_RATIOS: Record<AspectRatio, { label: string; dimensions: string }> = {
  '16:9': { label: '16:9 Landscape', dimensions: '1920×1080' },
  '9:16': { label: '9:16 Portrait', dimensions: '1080×1920' },
  '1:1': { label: '1:1 Square', dimensions: '1080×1080' },
  '4:3': { label: '4:3 Classic', dimensions: '1440×1080' },
};

export function AspectRatioSelector({ value, onValueChange }: AspectRatioSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-9">
        <SelectValue>
          {ASPECT_RATIOS[value].label} ({ASPECT_RATIOS[value].dimensions})
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="z-50">
        {Object.entries(ASPECT_RATIOS).map(([ratio, { label, dimensions }]) => (
          <SelectItem key={ratio} value={ratio}>
            <div className="flex flex-col">
              <span className="font-medium">{label}</span>
              <span className="text-xs text-muted-foreground">{dimensions}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
