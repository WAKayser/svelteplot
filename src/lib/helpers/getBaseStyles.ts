import type { Channels } from '$lib/types.js';
import type { MarkStyleProps, DataRow } from '$lib/types.js';
import { resolveProp } from './resolve.js';

/**
 * all style props that can be applied via channels but
 * are not scaled
 */
const styleProps: Partial<Record<MarkStyleProps, string | null>> = {
    strokeWidth: 'stroke-width',
    strokeDasharray: 'stroke-dasharray',
    strokeLinejoin: 'stroke-linejoin',
    strokeLinecap: 'stroke-linecap',
    blend: 'mix-blend-mode',
    clipPath: 'clip-path',
    mask: 'mask',
    fontSize: 'font-size',
    fontWeight: 'font-weight',
    fontStyle: 'font-style',
    textAnchor: 'text-anchor',
    cursor: 'cursor',
    pointerEvents: 'pointer-events'
};

const styleDefaults: Partial<Record<MarkStyleProps, string | null>> = {
    fontWeight: 'normal'
};

export function getBaseStylesObject(datum: DataRow, props: Partial<Channels>) {
    return Object.fromEntries(
        (Object.entries(styleProps) as [MarkStyleProps, string][])
            .filter(([key, cssKey]) => cssKey && props[key] != null)
            .map(([key, cssKey]) => [
                cssKey,
                maybeToPixel(cssKey, resolveProp(props[key], datum, styleDefaults[key] || null))
            ])
    );
}

export default function (datum: DataRow, props: Partial<Channels>) {
    return Object.entries(getBaseStylesObject(datum, props))
        .map(([key, value]) => `${key}: ${value}`)
        .join(';');
}

export function maybeToPixel(cssKey: string, value: string | number) {
    if (cssKey === 'font-size' || cssKey === 'stroke-width') {
        return typeof value === 'number' ? `${value}px` : value;
    }
    return value;
}
