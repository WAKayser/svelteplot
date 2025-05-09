<!--
    @component
    For vertical column charts using a band scale as x axis
-->
<script lang="ts">
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { intervalY, stackY, recordizeY, sort } from '$lib/index.js';
    import { resolveProp, resolveStyles } from '../helpers/resolve.js';
    import { roundedRect } from '../helpers/roundedRect.js';
    import {
        type PlotContext,
        type BaseMarkProps,
        type ChannelAccessor,
        type DataRow
    } from '../types.js';
    import type { StackOptions } from '$lib/transforms/stack.js';
    import { maybeData } from '$lib/helpers/index.js';
    import { addEventHandlers } from './helpers/events.js';
    import GroupMultiple from './helpers/GroupMultiple.svelte';

    type BarYProps = BaseMarkProps & {
        data: DataRow[];
        x?: ChannelAccessor;
        y?: ChannelAccessor;
        y1?: ChannelAccessor;
        y2?: ChannelAccessor;
        stack?: StackOptions;
        /**
         * Converts y into y1/y2 ranges based on the provided interval. Disables the
         * implicit stacking
         */
        interval?: number | string;
        borderRadius?:
            | number
            | {
                  topLeft?: number;
                  topRight?: number;
                  bottomRight?: number;
                  bottomLeft?: number;
              };
    };

    let { data = [{}], class: className = null, stack, ...options }: BarYProps = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    const plot = $derived(getPlotState());

    const args = $derived(
        stackY(
            intervalY(
                // by default, sort by x channel (the ordinal labels)
                sort(recordizeY({ data, sort: { channel: 'x' }, ...options })),
                { plot }
            ),
            stack
        )
    );
</script>

<Mark
    type="barY"
    requiredScales={{ x: ['band'] }}
    channels={['x', 'y1', 'y2', 'fill', 'stroke', 'opacity', 'fillOpacity', 'strokeOpacity']}
    {...args}>
    {#snippet children({ mark, scaledData, usedScales })}
        <GroupMultiple class="bar-y" length={scaledData.length}>
            {#each scaledData as d}
                {@const bw = plot.scales.x.fn.bandwidth()}
                {@const miny = Math.min(d.y1, d.y2)}
                {@const maxy = Math.max(d.y1, d.y2)}
                {@const insetLeft = resolveProp(args.insetLeft || args.inset, d.datum, 0)}
                {@const insetRight = resolveProp(args.insetRight || args.inset, d.datum, 0)}
                {@const insetTop = resolveProp(args.insetTop, d.datum, 0)}
                {@const insetBottom = resolveProp(args.insetBottom, d.datum, 0)}
                {@const dx = resolveProp(args.dx, d.datum, 0)}
                {@const dy = resolveProp(args.dy, d.datum, 0)}
                {#if d.valid}
                    {@const [style, styleClass] = resolveStyles(plot, d, args, 'fill', usedScales)}
                    <path
                        d={roundedRect(
                            0,
                            0,
                            bw - insetLeft - insetRight,
                            maxy - miny - insetTop - insetBottom,
                            options.borderRadius
                        )}
                        class={[styleClass, className]}
                        {style}
                        transform="translate({[
                            d.x + insetLeft + dx - bw * 0.5,
                            miny + dy + insetTop
                        ]})"
                        use:addEventHandlers={{
                            getPlotState,
                            options: args,
                            datum: d.datum
                        }} />
                {/if}
            {/each}
        </GroupMultiple>
    {/snippet}
</Mark>
