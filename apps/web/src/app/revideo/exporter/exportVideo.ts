import { type Scene } from '@/store/projectStore';
import { renderScenesToVideo } from './exporters/_legacy/renderScenesToVideo';
import { renderScenesWithRevideo } from './exporters/revideoExporter/revideoExporter';

interface ExportOptions {
  width?: number;
  height?: number;
  fps?: number;
  onProgress?: (progress: number) => void;
  useRenderer?: boolean; // Use Revideo Renderer with custom exporter
}

/**
 * Export scenes to video
 *
 * Two methods available:
 * 1. useRenderer=true: Uses Revideo's official Renderer with ClientSideExporter (RECOMMENDED)
 *    - Proper Revideo rendering pipeline
 *    - Custom exporter plugin
 *    - Better architecture
 *
 * 2. useRenderer=false: Direct Player rendering (legacy)
 *    - Manual Player control
 *    - Direct frame capture
 *    - Faster but less reliable
 */
export async function exportVideo(
  scenes: Scene[],
  options: ExportOptions = {}
): Promise<Blob | void> {
  if (options.useRenderer) {
    // Use Revideo Renderer with custom exporter plugin
    await renderScenesWithRevideo(scenes, options);
    return; // Video is downloaded by exporter
  } else {
    // Use legacy direct Player rendering
    // return await renderScenesToVideo(scenes, options);
  }
}
