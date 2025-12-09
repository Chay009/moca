/**
 * Background Parser - Converts CSS gradient/color strings to Motion Canvas format
 * Uses gradient-parser npm package for robust CSS gradient parsing
 * 
 * the revideo/motion-canvas has backgrounds similar to css
 * so we use css string and convert it to motion canvas format in this way we are using a package 
 * to handle the parsing it and converting to motion canvas required format
 */
import { Gradient } from '@revideo/2d';
import * as gradientParser from 'gradient-parser';

/**
 * Convert directional keyword to angle (0-360 degrees)
 * "to bottom right" -> 315 degrees
 * // i feel it is not working or so cause in ui the angle is working but not this
 * // future fix needed
 */
function directionToAngle(dir: string): number {
  const angles: Record<string, number> = {
    'to top': 90,
    'to bottom': 270,
    'to left': 180,
    'to right': 0,
    'to top left': 135,
    'to top right': 45,
    'to bottom left': 225,
    'to bottom right': 315,
  };
  return angles[dir] ?? 0;
}

/**
 * Parse CSS gradient string to Motion Canvas Gradient
 * Uses gradient-parser package to handle complex gradient syntax
 */
export function parseCSSGradient(gradientStr: string): Gradient | null {
  try {
    const parsed = gradientParser.parse(gradientStr);
    if (!parsed || parsed.length === 0) return null;

    const gradient = parsed[0];
    if (gradient.type !== 'linear-gradient') return null;

    const colors = gradient.colorStops.map((stop: any) => stop.value);

    // Extract angle from orientation (CSS gradient angles)
    let cssAngle = 0;
    if (gradient.orientation?.[0]) {
      const orient = gradient.orientation[0];
      if (orient.type === 'angular') {
        cssAngle = parseInt(orient.value) || 0;
      } else if (orient.type === 'directional') {
        cssAngle = directionToAngle(orient.value?.toLowerCase() ?? '');
      }
    }

    // Convert CSS angle to Motion Canvas angle
    // CSS: 0deg = top→bottom, 90deg = left→right
    // Motion Canvas: 0° = right, 90° = up (standard trig)
    const motionCanvasAngle = (90 - cssAngle) % 360;

    // Convert angle to from/to points
    const width = 1920;
    const height = 1080;
    const rad = (motionCanvasAngle * Math.PI) / 180;
    const x = Math.cos(rad);
    const y = Math.sin(rad);
    const maxDist = Math.sqrt(width * width + height * height) / 2;


    // this is motion canvas element so finally returing it aftr conversion
    return new Gradient({
      type: 'linear',
      from: [width / 2 - x * maxDist, height / 2 - y * maxDist],
      to: [width / 2 + x * maxDist, height / 2 + y * maxDist],
      stops: colors.map((color: string, index: number) => ({
        offset: colors.length === 1 ? 0 : index / (colors.length - 1),
        color,
      })),
    });
  } catch (error) {
    console.error('Failed to parse CSS gradient:', error);
    return null;
  }
}

/**
 * Parse background string and return appropriate fill value
 * Returns: Color string | Gradient object | null
 */
export function parseBackgroundString(
  backgroundStr: string
): string | Gradient | null {
  if (!backgroundStr?.trim()) return null;

  const trimmed = backgroundStr.trim();

  // Check if it's a gradient using gradient-parser
  try {
    const parsed = gradientParser.parse(trimmed);
    if (parsed && parsed.length > 0) {
      return parseCSSGradient(trimmed);
    }
  } catch {
    // Not a gradient, continue to other checks
  }

  // Check if it's an image URL
  if (trimmed.startsWith('url(') && trimmed.endsWith(')')) {
    console.warn(
      'Image URLs in backgrounds are not yet supported. Use solid colors or gradients instead.',
      trimmed
    );
    return null;
  }

  // Treat everything else as solid color (let browser/canvas handle validation)
  return trimmed;
}
