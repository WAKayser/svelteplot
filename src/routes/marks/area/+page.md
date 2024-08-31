---
title: Area mark
---

<script lang="ts">
    import AreaLineRulePlot from './AreaLineRulePlot.svelte';
    import AreaY1Plot from './AreaY1Plot.svelte';
    import StackedAreaPlot from './StackedAreaPlot.svelte';
    import Streamgraph from './Streamgraph.svelte';
</script>

The **area mark** draws the region between a baseline (x1, y1) and a topline (x2, y2) as in an area chart. Often the baseline represents y = 0, and because the area mark interpolates between adjacent data points, typically both the x and y scales are quantitative or temporal.

Supplying undefined values is not the same as filtering the data: the latter will interpolate between the data points. Observe the conspicuous straight lines below!

```svelte live
<script lang="ts">
    import { Plot, AreaY, LineY, RuleY } from '$lib/index';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid>
    <AreaY
        data={aapl}
        filter={(d) => d.Date.getUTCMonth() >= 3}
        x="Date"
        y="Close"
        fillOpacity={0.3}
    />
    <LineY data={aapl} y={(d) => (d.Date.getUTCMonth() < 3 ? NaN : d.Close)} x="Date" />
    <RuleY data={[0]} />
</Plot>
```

```svelte
<script lang="ts">
    import { Plot, AreaY, LineY, RuleY } from 'svelteplot';
    import aapl from 'data/aapl.csv';
</script>

<Plot grid>
    <AreaY
        data={aapl}
        filter={(d) => d.Date.getUTCMonth() >= 3}
        x="Date"
        y="Close"
        fillOpacity={0.3}
    />
    <LineY data={aapl} y={(d) => (d.Date.getUTCMonth() < 3 ? NaN : d.Close)} x="Date" />
    <RuleY data={[0]} />
</Plot>
```

## AreaY

<AreaY1Plot />

```svelte
<Plot>
    <AreaY data={aapl} x="Date" y="Close" />
</Plot>
```

If you need a different baseline you can pass <b>y1</b> and <b>y2</b> channels instead of
<b>y</b> to disable the implicit stacking:

```svelte live
<script>
    import { Plot, AreaY } from '$lib/index';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid>
    <AreaY data={aapl} x="Date" y1={120} y2="Close" />
</Plot>
```

```svelte
<Plot grid>
    <AreaY data={aapl} x="Date" y1={120} y2="Close" />
</Plot>
```

Implicit stacking over y

Required channels:

-   `x`
-   either `y` for implicit stacking or `y1` and `y2` if you want to control the offsets directly

You can also just pass an array of numbers to <b>AreaY</b> for a quick plot:

```svelte live
<script>
    import { Plot, AreaY, RuleY } from '$lib';
    import { range } from 'd3-array';
</script>

<Plot testid="area-y-numbers" grid height={200} y={{ ticks: [-1, 0, 1] }}>
    <AreaY data={range(100).map((v) => Math.cos(v / 5))} opacity={0.5} />
    <RuleY data={[0]} />
</Plot>
```

```svelte
<Plot grid height={200} y={{ ticks: [-1, 0, 1] }}>
    <AreaY data={range(100).map((v) => Math.cos(v / 5))} opacity={0.5} />
    <RuleY data={[0]} />
</Plot>
```

To create a stacked area chart you can use the implicit [stackY](/transforms/stack) transform built into the AreaY mark:

```svelte live
<script>
    import { Plot, AreaY } from '$lib';
    import { page } from '$app/stores';
    let { riaa } = $derived($page.data.data);
</script>

<Plot>
    <AreaY data={riaa} x="year" y="revenue" z="format" fill="group" />
</Plot>
```

```svelte
<Plot>
    <AreaY data={riaa} x="year" y="revenue" z="format" fill="group" />
</Plot>
```

You can control the stacking for the implicit [stackY](/transforms/stack) transform using the `stack` options:

-   `order` - can be one of `none`, `appearance`, `inside-out`, or `sum`.
-   `reverse` - for reversing the order
-   `offset`

```svelte live
<script>
    import { Plot, AreaY } from '$lib';
    import { page } from '$app/stores';
    import { Select } from '$lib/ui';
    let { riaa } = $derived($page.data.data);

    const CURVES =
        'basis,basis-open,bump-x,bump-y,bundle,cardinal,cardinal-open,catmull-rom,catmull-rom-open,catmull,linear,monotone-x,monotone-y,natural,step,step-after,step-before'.split(',');
    let curve = $state('linear');

    let reverse = $state(false);
    let order = $state('none');
</script>

<Select label="curve" options={CURVES} bind:value={curve} />
<Select label="order" options={['none', 'appearance', 'inside-out', 'sum']} bind:value={order} />
<Plot>
    <AreaY 
        data={riaa} 
        x="year" 
        y="revenue" 
        z="format" 
        fill="group"
        {curve}
        stack={{ order, reverse }} />
</Plot>
```

Streamgraph example:

<Streamgraph stackControls />

## AreaX

For "vertical" area charts you can use the <b>AreaX</b> mark as shorthand

```svelte live
<script>
    import { Plot, AreaX } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid testid="area-x" height={600} maxWidth="300px">
    <AreaX data={aapl} y="Date" x="Close" />
</Plot>
```

## Area

The **Area** mark is useful for area charts. It pairs nicely with a <b>Line</b> mark for
the topline and a <b>RuleY</b> for the baseline:

Required channels for horizontal area charts:

-   `x`, `y1`, and `y2` (for horizontal → area charts)
-   `y`, `x1` and `x2` (for vertical area charts)
-   `z` to group multiple areas

```svelte live
<script lang="ts">
    import { Plot, Frame, Area, AreaX, AreaY, Line, RuleY } from '$lib/index.js';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid testid="area-line-rule">
    <Area data={aapl} x1="Date" y1={0} y2="Close" opacity={0.25} />
    <Line data={aapl} x="Date" y="Close" />
    <RuleY data={[0]} />
</Plot>
```

```svelte
<Plot grid>
    <Area data={aapl} x1="Date" y1={0} y2="Close" opacity={0.25} />
    <Line data={aapl} x="Date" y="Close" />
    <RuleY data={[0]} />
</Plot>
```

Typically, you won't want to use the <b>Area</b> mark directly, but want to use <b>AreaY</b>
for "horizontal" area charts, where the time axis going from left to right:
