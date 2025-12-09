"use client"

import React, { useState, useCallback } from "react"
import Cropper, { type Area } from "react-easy-crop"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Check, X, RotateCcw, ZoomIn, Crop as CropIcon } from "lucide-react"

interface ImageCropperProps {
  imageSrc: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCropComplete: (croppedImageBase64: string) => void
}

const ASPECT_RATIOS = [
  { label: "Free", value: 0 },
  { label: "16:9 (Landscape)", value: 16 / 9 },
  { label: "1:1 (Square)", value: 1 },
  { label: "4:5 (Portrait)", value: 4 / 5 },
  { label: "9:16 (Story)", value: 9 / 16 },
  { label: "5:4 (Standard)", value: 5 / 4 },
]

export function ImageCropper({
  imageSrc,
  open,
  onOpenChange,
  onCropComplete,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [aspect, setAspect] = useState<number>(0) // 0 = Free
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const onRotationChange = (rotation: number) => {
    setRotation(rotation)
  }

  const onCropCompleteHandler = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const handleCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      )
      if (croppedImage) {
        onCropComplete(croppedImage)
        onOpenChange(false)
        // Reset states
        setZoom(1)
        setRotation(0)
        setAspect(0)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <CropIcon className="w-5 h-5" />
            Crop Image
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[400px] bg-black/90">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect > 0 ? aspect : undefined}
              onCropChange={onCropChange}
              onCropComplete={onCropCompleteHandler}
              onZoomChange={onZoomChange}
              onRotationChange={onRotationChange}
            />
          )}
        </div>

        <div className="p-4 space-y-4 bg-muted/20">
          {/* Controls Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">

            {/* Aspect Ratio */}
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                Aspect Ratio
              </Label>
              <Select
                value={String(aspect)}
                onValueChange={(val) => setAspect(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Aspect Ratio" />
                </SelectTrigger>
                <SelectContent>
                  {ASPECT_RATIOS.map((ratio) => (
                    <SelectItem key={ratio.label} value={String(ratio.value)}>
                      {ratio.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rotation */}
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <div className="flex justify-between">
                <Label className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                  Rotation
                </Label>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono">{rotation}°</span>
                  <RotateCcw
                    className="w-3 h-3 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setRotation(0)}
                  />
                </div>
              </div>
              <Slider
                value={[rotation]}
                min={0}
                max={360}
                step={1}
                onValueChange={(vals) => setRotation(vals[0])}
                className="py-1.5"
              />
            </div>

            {/* Zoom */}
            <div className="space-y-2 col-span-2">
              <div className="flex justify-between">
                <Label className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                  Zoom
                </Label>
                <span className="text-xs font-mono">{zoom.toFixed(1)}x</span>
              </div>
              <div className="flex items-center gap-3">
                <ZoomIn className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.1}
                  onValueChange={(vals) => setZoom(vals[0])}
                  className="flex-1 py-1.5"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 border-t bg-muted/10">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleCrop}>
            <Check className="w-4 h-4 mr-2" />
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Helper to crop the image
 */
export const createTask = async (imageSrc: string) => {
  const image = await createImage(imageSrc)
  return image
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.setAttribute("crossOrigin", "anonymous") // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })
}

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation)

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<string | null> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return null
  }

  const rotRad = getRadianAngle(rotation)

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  )

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
  ctx.translate(-image.width / 2, -image.height / 2)

  // draw the rotated image
  ctx.drawImage(image, 0, 0)

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  )

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0)

  // As Base64 string
  return canvas.toDataURL("image/jpeg")
}
