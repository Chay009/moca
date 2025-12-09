/** @jsxImportSource @revideo/2d/lib */
/**
 * VideoSimple Animation Creator
 * Renders a video element with filters support
 */

import { Video } from '@revideo/2d';
import {
    blur,
    brightness,
    contrast,
    grayscale,
    hue,
    invert,
    saturate,
    sepia,
} from '@revideo/2d';

interface VideoSimpleProps {
    src: string;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    rotation?: number;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    opacity?: number;
    alpha?: number;
    smoothing?: boolean;
    radius?: number;
    clip?: boolean;
    filters?: Array<Record<string, number>>;
    play?: boolean;
    playbackRate?: number;
    volume?: number;
    time?: number;
    [key: string]: any;
}

export function createVideoSimple(props: VideoSimpleProps) {
    console.log('🎬 Creating VideoSimple with props:', props);

    // Convert filter objects to Revideo Filter instances
    const filterMap: Record<string, (value: number) => any> = {
        blur,
        brightness,
        contrast,
        grayscale,
        hue,
        invert,
        saturate,
        sepia,
    };

    // Extract elementId for key and destructure filters separately
    const { elementId, filters: rawFilters, ...rest } = props;

    // Convert plain filter objects to Revideo Filter instances
    const filters = (rawFilters || [])
        .map((filterObj) => {
            const filterName = Object.keys(filterObj)[0];
            const filterValue = filterObj[filterName];
            const filterFn = filterMap[filterName];
            return filterFn ? filterFn(filterValue) : null;
        })
        .filter((f): f is NonNullable<typeof f> => f !== null);

    console.log('🎬 Video props - elementId:', elementId, 'src:', props.src, 'width:', props.width, 'height:', props.height);

    return (
        <Video
            key={elementId}
            {...rest}
            src={props.src}
            width={props.width}
            height={props.height}
            filters={filters}
            play={props.play || false}
            playbackRate={props.playbackRate || 1}
            volume={props.volume || 1}
            time={props.time || 0}
            awaitCanPlay={true}
        />
    );
}
