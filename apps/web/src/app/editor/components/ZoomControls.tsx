'use client';

import React, { useCallback, useEffect } from 'react';
import { PositionControl } from '@/components/PositionControl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, X } from 'lucide-react';
import { useSceneStore } from '@/store/sceneStore';
import type { ZoomEvent, ZoomEasing } from '@/types/zoom';

interface ZoomControlsProps {
    sceneId: string;
    zoomEvent: ZoomEvent;
    onClose: () => void;
}

/**
 * ZoomControls - Panel for editing zoom event properties
 * Shows crosshair overlay on player via store state
 */
export const ZoomControls: React.FC<ZoomControlsProps> = ({
    sceneId,
    zoomEvent,
    onClose,
}) => {
    const { updateZoomEvent, removeZoomEvent, showZoomTarget, hideZoomTarget } = useSceneStore();

    // Show crosshair when component mounts, hide when unmounts
    useEffect(() => {
        showZoomTarget(zoomEvent.targetX, zoomEvent.targetY);
        return () => hideZoomTarget();
    }, []);

    // Update crosshair position when target changes
    useEffect(() => {
        showZoomTarget(zoomEvent.targetX, zoomEvent.targetY);
    }, [zoomEvent.targetX, zoomEvent.targetY, showZoomTarget]);

    const handleUpdate = useCallback(
        (updates: Partial<ZoomEvent>) => {
            updateZoomEvent(sceneId, zoomEvent.id, updates);
            // Update crosshair position if X or Y changed
            if ('targetX' in updates || 'targetY' in updates) {
                showZoomTarget(
                    updates.targetX ?? zoomEvent.targetX,
                    updates.targetY ?? zoomEvent.targetY
                );
            }
        },
        [sceneId, zoomEvent, updateZoomEvent, showZoomTarget]
    );

    const handleDelete = useCallback(() => {
        hideZoomTarget();
        removeZoomEvent(sceneId, zoomEvent.id);
        onClose();
    }, [sceneId, zoomEvent.id, removeZoomEvent, onClose, hideZoomTarget]);

    const handleClose = useCallback(() => {
        hideZoomTarget();
        onClose();
    }, [hideZoomTarget, onClose]);

    return (
        <div className="p-4 space-y-4 bg-card border rounded-lg">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Zoom Settings</h3>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Target Position */}
            <PositionControl
                x={zoomEvent.targetX}
                y={zoomEvent.targetY}
                onXChange={(x) => handleUpdate({ targetX: x })}
                onYChange={(y) => handleUpdate({ targetY: y })}
                label="Zoom Target (see crosshair on player)"
                minX={-960}
                maxX={960}
                minY={-540}
                maxY={540}
                size="sm"
            />

            {/* Zoom Level */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-xs">Zoom Level</Label>
                    <span className="text-xs text-muted-foreground">
                        {zoomEvent.zoomLevel.toFixed(1)}x
                    </span>
                </div>
                <Slider
                    value={[zoomEvent.zoomLevel]}
                    onValueChange={([value]) => handleUpdate({ zoomLevel: value })}
                    min={1}
                    max={3}
                    step={0.1}
                    className="w-full"
                />
            </div>

            {/* Duration */}
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <Label className="text-xs">Duration (s)</Label>
                    <Input
                        type="number"
                        value={zoomEvent.duration}
                        onChange={(e) => handleUpdate({ duration: parseFloat(e.target.value) || 0.5 })}
                        min={0.1}
                        max={5}
                        step={0.1}
                        className="h-8 text-xs"
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Hold (s)</Label>
                    <Input
                        type="number"
                        value={zoomEvent.holdDuration}
                        onChange={(e) => handleUpdate({ holdDuration: parseFloat(e.target.value) || 1 })}
                        min={0}
                        max={10}
                        step={0.5}
                        className="h-8 text-xs"
                    />
                </div>
            </div>

            {/* Start Time */}
            <div className="space-y-1">
                <Label className="text-xs">Start Time (s)</Label>
                <Input
                    type="number"
                    value={zoomEvent.startTime}
                    onChange={(e) => handleUpdate({ startTime: parseFloat(e.target.value) || 0 })}
                    min={0}
                    step={0.1}
                    className="h-8 text-xs"
                />
            </div>

            {/* Easing */}
            <div className="space-y-1">
                <Label className="text-xs">Easing</Label>
                <Select
                    value={zoomEvent.easing}
                    onValueChange={(value) => handleUpdate({ easing: value as ZoomEasing })}
                >
                    <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="easeIn">Ease In</SelectItem>
                        <SelectItem value="easeOut">Ease Out</SelectItem>
                        <SelectItem value="easeInOut">Ease In Out</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Auto Reset Toggle */}
            <div className="flex items-center justify-between">
                <Label className="text-xs">Auto Reset After Hold</Label>
                <input
                    type="checkbox"
                    checked={zoomEvent.autoReset}
                    onChange={(e) => handleUpdate({ autoReset: e.target.checked })}
                    className="h-4 w-4"
                />
            </div>

            {/* Delete Button */}
            <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={handleDelete}
            >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Zoom
            </Button>
        </div>
    );
};

export default ZoomControls;
