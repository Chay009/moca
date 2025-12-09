import {
  RendererSettings,
  RendererResult,
  PlaybackState,
  clampRemap,
} from '@revideo/core';
import { ClientSideExporterClass } from './plugin/ClientSideExporterPlugin';

/**
 * THIS FUNCTION IS A MODIFIED VERSION OF Revideo'S INTERNAL RENDERER RUN METHOD  WE JUST COPIED AND EDITED TO SUPPORT OUR CUSTOM EXPORTER
 * UNLESS THE REVIDEO CHANGES THE RUN FUCNTION THIS SHOULD WORK FINE
 * 
 * Custom run function extracted from Revideo's internal Renderer
 * This bypasses the hardcoded exporter list to support ClientSideExporter
 * 
 */
export async function customRendererRun(
  rendererInstance: any,
  settings: RendererSettings,
  signal: AbortSignal,
): Promise<RendererResult> {
  console.log('🔧 CustomRenderer patched run() - using custom exporter list');

  // MODIFIED: Include our custom exporter in the array
  const exporters = [
    ClientSideExporterClass,
    // Note: FFmpegExporterClient, ImageExporter, WasmExporter would go here
    // but we only need ClientSideExporter for browser-based rendering
  ];

  const exporterClass = exporters.find(
    exporter => exporter.id === settings.exporter.name,
  );

  if (!exporterClass) {
    rendererInstance.project.logger.error(
      `Could not find the "${settings.exporter.name}" exporter.`,
    );
    console.error('❌ Available exporters:', exporters.map((e: any) => e.id));
    return RendererResult.Error;
  }

  console.log('✅ Found exporter:', exporterClass.id);

  // Instantiate exporter
  rendererInstance.exporter = await exporterClass.create(
    rendererInstance.project,
    settings,
  );
  if (rendererInstance.exporter.configuration) {
    settings = {
      ...settings,
      ...((await rendererInstance.exporter.configuration()) ?? {}),
    };
  }

  const stage = rendererInstance.stage;
  const playback = rendererInstance.playback;
  const status = rendererInstance.status;
  const frame = rendererInstance.frame;
  const estimator = rendererInstance.estimator;
  const exporter = rendererInstance.exporter;
  const project = rendererInstance.project;

  stage.configure(settings);
  playback.fps = settings.fps;
  playback.state = PlaybackState.Rendering;

  const from = status.secondsToFrames(settings.range[0]);
  frame.current = from;

  // Reset
  await rendererInstance.reloadScenes(settings);
  await playback.recalculate();
  await playback.reset();

  const to = Math.min(
    playback.duration,
    status.secondsToFrames(settings.range[1]),
  );
  await playback.seek(from);

  if (signal.aborted) return RendererResult.Aborted;

  await exporter.start?.();

  let lastRefresh = performance.now();
  let result = RendererResult.Success;

  const mediaByFrames = await rendererInstance.getMediaByFrames(settings);

  // Start audio export
  let generateAudioPromise: Promise<void> | undefined;
  if (exporter && exporter.generateAudio) {
    generateAudioPromise = exporter.generateAudio(mediaByFrames, from, to);
  }

  if (exporter && exporter.downloadVideos) {
    await exporter.downloadVideos(mediaByFrames);
  }

  // Main rendering loop
  await playback.seek(from);

  try {
    estimator.reset(1 / (to - from));
    await rendererInstance.exportFrame(signal);
    estimator.update(clampRemap(from, to, 0, 1, playback.frame));
    estimator.reportProgress();

    if (signal.aborted) {
      result = RendererResult.Aborted;
    } else {
      let finished = false;
      while (!finished) {
        await playback.progress();
        await rendererInstance.exportFrame(signal);
        estimator.update(clampRemap(from, to, 0, 1, playback.frame));
        estimator.reportProgress();

        if (performance.now() - lastRefresh > 1 / 30) {
          lastRefresh = performance.now();
          await new Promise(resolve => setTimeout(resolve, 0));
        }

        if (playback.finished || playback.frame >= to) {
          finished = true;
        }

        if (signal.aborted) {
          result = RendererResult.Aborted;
          finished = true;
        }
      }
    }
  } catch (e) {
    project.logger.error(e);
    result = RendererResult.Error;
  }

  await exporter.stop?.(result);

  // Only merge media when rendering images was actually successful
  if (
    result === RendererResult.Success &&
    exporter &&
    exporter.mergeMedia &&
    generateAudioPromise
  ) {
    try {
      await generateAudioPromise;
      await exporter.mergeMedia();
    } catch (e) {
      project.logger.error(e);
      result = RendererResult.Error;
    }
  }

  await exporter?.kill?.();
  rendererInstance.exporter = null;

  return result;
}
