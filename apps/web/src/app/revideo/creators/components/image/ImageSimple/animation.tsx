/** @jsxImportSource @revideo/2d/lib */

/**
 * Image Simple Component - Motion Canvas Creator
 * Returns image node with filter support
 */

import { Img } from '@revideo/2d';
import {
    blur,
    brightness,
    contrast,
    grayscale,
    hue,
    invert,
    saturate,
    sepia,
} from "@revideo/2d";

export function createImageSimple(props: any) {
    // Destructure filters separately so it doesn't get spread into the Img component
    const { elementId, filters: rawFilters, ...rest } = props;

    console.log('🖼️ Creating image with elementId:', elementId, 'props:', props);

    // Convert filter data to Motion Canvas Filter objects
    const filtersArray = rawFilters ?? [];
    console.log('🎨 Filters array from props:', filtersArray);

    const filters = filtersArray.map((filterData: any) => {
        const [filterName, value] = Object.entries(filterData)[0] as [string, number];

        console.log('🎨 Converting filter:', filterName, 'value:', value, 'filterData:', filterData);
        // these are css filters 
        switch (filterName) {
            case 'blur':
                return blur(value);
            case 'brightness':
                return brightness(value);
            case 'contrast':
                return contrast(value);
            case 'grayscale':
                return grayscale(value);
            case 'hue':
                return hue(value);
            case 'invert':
                return invert(value);
            case 'saturate':
                return saturate(value);
            case 'sepia':
                return sepia(value);
            default:
                return null;
        }
    }).filter(Boolean);

    console.log('🎨 Converted filters:', filters);

    return (
        <Img
            key={elementId}
            src={props.src ?? ''}
            width={props.width ?? 300}
            height={props.height ?? null}
            smoothing={props.smoothing ?? true}
            alpha={props.alpha ?? 1}
            x={props.x ?? 0}
            y={props.y ?? 0}
            rotation={props.rotation ?? 0}
            scale={props.scale ?? 1}
            opacity={props.opacity ?? 1}
            radius={props.radius ?? 0}
            clip={props.clip ?? false}
            {...rest}
            filters={filters.length > 0 ? filters : undefined}
        />
    );
}
