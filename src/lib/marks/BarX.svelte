<!--
    @component
    For horizontal bar charts using a band scale as y axis
-->
<script lang="ts">
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { stackX, recordizeX, intervalX, sort } from '$lib/index.js';
    import type { PlotContext, BaseMarkProps, RectMarkProps, ChannelAccessor } from '../types.js';
    import type { StackOptions } from '$lib/transforms/stack.js';
    import type { DataRow } from '$lib/types.js';
    import GroupMultiple from './helpers/GroupMultiple.svelte';
    import RectPath from './helpers/RectPath.svelte';

    type BarXProps = BaseMarkProps & {
        data: DataRow[];
        x?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        y?: ChannelAccessor;
        stack?: StackOptions;
    } & RectMarkProps;

    let { data = [{}], class: className = null, stack, ...options }: BarXProps = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    const plot = $derived(getPlotState());

    const args = $derived(
        stackX(
            intervalX(
                // by default, sort by y channel (the ordinal labels)
                sort(recordizeX({ data, sort: { channel: 'y' }, ...options })),
                { plot }
            ),
            stack
        )
    );
</script>

<Mark
    type="barX"
    requiredScales={{ y: ['band'] }}
    channels={['x1', 'x2', 'y', 'fill', 'stroke', 'opacity', 'fillOpacity', 'strokeOpacity']}
    {...args}>
    {#snippet children({ mark, usedScales, scaledData })}
        <GroupMultiple class="bar-x" length={scaledData.length}>
            {#each scaledData as d}
                {@const bw = plot.scales.y.fn.bandwidth()}
                {@const minx = Math.min(d.x1, d.x2)}
                {@const maxx = Math.max(d.x1, d.x2)}
                {#if d.valid}
                    <RectPath
                        {usedScales}
                        class={className}
                        {options}
                        datum={d}
                        x={minx}
                        useInsetAsFallbackHorizontally={false}
                        y={d.y - bw * 0.5}
                        width={maxx - minx}
                        height={bw} />
                {/if}
            {/each}
        </GroupMultiple>
    {/snippet}
</Mark>
