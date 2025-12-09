import { Renderer, Project, RendererSettings, RendererResult } from '@revideo/core';
import { customRendererRun } from './rendererRun';

/**
 * CustomRenderer - Revideo's Renderer with ClientSideExporter support
 *
 * Monkey-patches the private run() method to include our custom exporter
 * in the exporter selection logic.
 */
export class CustomRenderer extends Renderer {
  constructor(project: Project) {
    super(project);
    this.patchRunMethod();
  }

  private patchRunMethod() {
    // Only patch the run() method, not render()
    // The render() method will call our patched run() internally
    (this as any).run = async (
      settings: RendererSettings,
      signal: AbortSignal,
    ): Promise<RendererResult> => {
      console.log('🔧 CustomRenderer.run() called (patched)');
      const result = await customRendererRun(this, settings, signal);
      console.log('✅ customRendererRun() returned:', result);
      return result;
    };
  }
}
