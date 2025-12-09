/**
 * ThumbnailExtractor - Extract video frames using MediaBunny
 * O(log n) binary search through video packets for efficient frame seeking
 */
import {
    Input,
    ALL_FORMATS,
    BlobSource,
    CanvasSink,
} from 'mediabunny';

/**
 * Get a thumbnail from a video file at a specific timestamp
 * @param videoFile - The video File object
 * @param timestamp - Time in seconds to extract frame from
 * @param width - Optional width for the thumbnail (default: 320)
 * @returns HTMLCanvasElement or OffscreenCanvas with the frame
 */
export async function getThumbnailFromFile(
    videoFile: File,
    timestamp: number,
    width: number = 320
): Promise<HTMLCanvasElement | OffscreenCanvas> {
    const input = new Input({
        formats: ALL_FORMATS,
        source: new BlobSource(videoFile),
    });

    return extractFrame(input, timestamp, width);
}

/**
 * Get a thumbnail from a video URL at a specific timestamp
 * @param videoUrl - URL of the video
 * @param timestamp - Time in seconds to extract frame from
 * @param width - Optional width for the thumbnail (default: 320)
 * @returns HTMLCanvasElement or OffscreenCanvas with the frame
 */
export async function getThumbnailFromUrl(
    videoUrl: string,
    timestamp: number,
    width: number = 320
): Promise<HTMLCanvasElement | OffscreenCanvas> {
    // Fetch the video as a blob first
    const response = await fetch(videoUrl);
    const blob = await response.blob();

    const input = new Input({
        formats: ALL_FORMATS,
        source: new BlobSource(blob),
    });

    return extractFrame(input, timestamp, width);
}

/**
 * Get thumbnail as data URL for use in img tags
 */
export async function getThumbnailDataUrl(
    videoSource: File | string,
    timestamp: number,
    width: number = 320
): Promise<string> {
    const canvas = typeof videoSource === 'string'
        ? await getThumbnailFromUrl(videoSource, timestamp, width)
        : await getThumbnailFromFile(videoSource, timestamp, width);

    // Convert canvas to data URL
    if (canvas instanceof HTMLCanvasElement) {
        return canvas.toDataURL('image/jpeg', 0.8);
    } else {
        // OffscreenCanvas - convert to blob then to data URL
        const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 });
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    }
}

/**
 * Internal helper to extract frame from input
 */
async function extractFrame(
    input: Input,
    timestamp: number,
    width: number
): Promise<HTMLCanvasElement | OffscreenCanvas> {
    const videoTrack = await input.getPrimaryVideoTrack();
    if (!videoTrack) {
        throw new Error('No video track found');
    }

    const decodable = await videoTrack.canDecode();
    if (!decodable) {
        throw new Error('Video track cannot be decoded');
    }

    const sink = new CanvasSink(videoTrack, {
        width: width,
    });

    const result = await sink.getCanvas(timestamp);
    return result.canvas;
}