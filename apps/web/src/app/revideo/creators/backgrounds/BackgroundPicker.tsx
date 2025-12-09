'use client'
// source of this component is - https://gradient.page/picker
// feature-later: Add advanced gradient customizer using react-best-gradient-color-picker
// Package: https://www.npmjs.com/package/react-best-gradient-color-picker
// This will allow users to:
// - Add/remove color stops with drag & drop
// - Adjust color positions and angles
// - Live gradient preview
// better we seperate the gradeints and solid in code and file based but together in ui
// - Support for linear and radial gradients
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Paintbrush } from 'lucide-react'
import Link from 'next/link' // TODO: Enable when migrating to Next.js
import { useMemo } from 'react'
import { getAllShaderPresets } from './shaders'
import { solidPresets } from './css/solids'
import { gradientPresets } from './css/gradients'
import { imagePresets } from './image/images'



export function BackgroundPicker({
  background,
  setBackground,
  className,
}: {
  background: string
  setBackground: (value: string, type: 'solid' | 'gradient' | 'image' | 'shader') => void
  className?: string
}) {
  // Helper to detect background type
  const detectType = (value: string): 'solid' | 'gradient' | 'image' | 'shader' => {
    if (value.includes('url(')) return 'image'
    if (value.includes('gradient')) return 'gradient'
    return 'solid'
  }
  const solids = solidPresets
  const gradients = gradientPresets
  const images = imagePresets

  const defaultTab = useMemo(() => {
    if (background.includes('url')) return 'image'
    if (background.includes('gradient')) return 'gradient'
    return 'solid'
  }, [background])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[220px] justify-start text-left font-normal',
            !background && 'text-muted-foreground',
            className
          )}
        >
          <div className="w-full flex items-center gap-2">
            {background ? (
              <div
                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                style={{ background }}
              ></div>
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="truncate flex-1">
              {background ? background.substring(0, 30) : 'Pick a background'}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="w-full mb-4 grid grid-cols-4">
            <TabsTrigger value="solid">
              Solid
            </TabsTrigger>
            <TabsTrigger value="gradient">
              Gradient
            </TabsTrigger>
            <TabsTrigger value="image">
              Image
            </TabsTrigger>
            <TabsTrigger value="shader">
              Shader
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solid" className="flex flex-wrap gap-1 mt-0">
            {solids.map((s) => (
              <div
                key={s}
                style={{ background: s }}
                className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                onClick={() => setBackground(s, 'solid')}
              />
            ))}
          </TabsContent>

          <TabsContent value="gradient" className="mt-0">
            <div className="flex flex-wrap gap-1 mb-2">
              {gradients.map((s) => (
                <div
                  key={s}
                  style={{ background: s }}
                  className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                  onClick={() => setBackground(s, 'gradient')}
                />
              ))}
            </div>

            <GradientButton background={background}>
              💡 Get more at{' '}
              <Link
                href="https://gradient.page/ui-gradients"
                className="hover:underline font-bold"
                target="_blank"
              >
                Gradient Page
              </Link>
            </GradientButton>
          </TabsContent>

          <TabsContent value="image" className="mt-0">
            <div className="grid grid-cols-2 gap-1 mb-2">
              {images.map((s) => (
                <div
                  key={s}
                  style={{ backgroundImage: s }}
                  className="rounded-md bg-cover bg-center h-12 w-full cursor-pointer active:scale-105"
                  onClick={() => setBackground(s.replace('url(', '').replace(')', ''), 'image')}
                />
              ))}
            </div>

            <GradientButton background={background}>
              🎁 Get abstract{' '}
              <Link
                href="https://gradient.page/wallpapers"
                className="hover:underline font-bold"
                target="_blank"
              >
                wallpapers
              </Link>
            </GradientButton>
          </TabsContent>

          <TabsContent value="shader" className="mt-0">
            <div className="grid grid-cols-2 gap-1 mb-2">
              {getAllShaderPresets().map((shader) => (
                <div
                  key={shader.id}
                  className="rounded-md bg-purple-900/30 border border-purple-500/30 h-12 w-full cursor-pointer active:scale-105 flex items-center justify-center text-xs text-purple-200"
                  onClick={() => setBackground(shader.id, 'shader')}
                  title={shader.description}
                >
                  ✨ {shader.name}
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Click a shader preset
            </div>
          </TabsContent>
        </Tabs>

        <Input
          id="custom"
          value={background}
          className="col-span-2 h-8 mt-4"
          onChange={(e) => {
            const value = e.currentTarget.value;
            setBackground(value, detectType(value));
          }}
          placeholder="Enter color, gradient, image, or video URL"
        />
      </PopoverContent>
    </Popover>
  )
}

const GradientButton = ({
  background,
  children,
}: {
  background: string
  children: React.ReactNode
}) => {
  return (
    <div
      className="p-0.5 rounded-md relative !bg-cover !bg-center transition-all"
      style={{ background }}
    >
      <div className="bg-popover/80 rounded-md p-1 text-xs text-center">
        {children}
      </div>
    </div>
  )
}
