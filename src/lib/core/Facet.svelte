<script lang="ts">
    import { setContext, type Snippet } from 'svelte';
    import { resolveChannel } from '../helpers/resolve.js';
    import type { BaseMarkProps, DataRecord, PlotScale, RawValue } from '../types.js';
    import { identity } from '$lib/helpers';

    let {
        fx,
        fy,
        left,
        top,
        right,
        bottom,
        topEmpty,
        bottomEmpty,
        leftEmpty,
        rightEmpty,
        children
    }: {
        fx: RawValue;
        fy: RawValue;
        left: boolean;
        top: boolean;
        right: boolean;
        bottom: boolean;
        topEmpty: boolean;
        bottomEmpty: boolean;
        leftEmpty: boolean;
        rightEmpty: boolean;
        children?: Snippet;
    } = $props();

    setContext('svelteplot/facet', {
        getTestFacet() {
            return (datum: DataRecord, options: Partial<BaseMarkProps>) => {
                return (
                    (options.fx == null || resolveChannel('fx', datum, options) === fx) &&
                    (options.fy == null || resolveChannel('fy', datum, options) === fy)
                );
            };
        },
        getFacetState() {
            return {
                fx,
                fy,
                left,
                top,
                right,
                bottom,
                topEmpty,
                bottomEmpty,
                leftEmpty,
                rightEmpty
            };
        }
    });
</script>

{@render children?.()}
