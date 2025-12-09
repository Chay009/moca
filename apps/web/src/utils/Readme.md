we tried to create a custom render to direclty render the canvas but the plugin sysntem didn't allowed use so uing the image seq which already did the same mediabunny dooes and exporting in client side.

https://deepwiki.com/search/hi_e6691344-b0b4-4791-a7e2-732fed5cce2f?mode=fast

1. src/utils/exportVideo.ts:1-149 - Correct mediabunny API implementation:
  - ✅ Uses Output + BufferTarget + Mp4OutputFormat
  - ✅ Creates CanvasSource with canvas element
  - ✅ Manually renders each frame to canvas (mimics your Revideo scenes)
  - ✅ Calls canvasSource.add(timestamp, duration) per frame
  - ✅ Finalizes and returns MP4 Blob

  2. src/components/SceneTimeline.tsx:88-91 - Export button:
  - ✅ "Export Video" button with loading state
  - ✅ Triggers browser-based export
  - ✅ Downloads MP4 file automatically



  