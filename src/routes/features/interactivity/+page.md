---
title: Interactivity
---

Svelte makes interactive plots easy!

Pointer mark

```svelte live
<script>
    import { Plot, Line, Dot, Text, Pointer } from 'svelteplot';
    import { page } from '$app/state';
    let { aapl } = $derived(page.data.data);
</script>

<Plot testid="aapl-line-frame">
    <Line data={aapl} x="Date" y="Close" />
    <Pointer
        data={aapl}
        x="Date"
        y="Close"
        maxDistance={30}>
        {#snippet children({ data })}
            <Text
                {data}
                fill="currentColor"
                stroke="var(--svelteplot-bg)"
                strokeWidth="3"
                x="Date"
                y="Close"
                text={(d) => d.Close.toFixed()}
                lineAnchor="bottom"
                fontWeight="bold"
                dy="-10" />
            <Dot {data} x="Date" y="Close" fill="var(--svp-red)" />
        {/snippet}
    </Pointer>
</Plot>
```

```svelte
<Plot>
    <Line data={aapl} x="Date" y="Close" />
    <Pointer
        data={aapl}
        x="Date"
        y="Close"
        maxDistance={30}>
        {#snippet children({ data })}
            <Text
                {data}
                fill="currentColor"
                stroke="var(--svelteplot-bg)"
                strokeWidth="3"
                x="Date"
                y="Close"
                text={(d) => d.Close.toFixed()}
                lineAnchor="bottom"
                fontWeight="bold"
                dy="-10" />
            <Dot {data} x="Date" y="Close" fill />
        {/snippet}
    </Pointer>
</Plot>
```

You can create a "crosshair" mark

```svelte live
<script>
    import {
        Plot,
        Line,
        RuleX,
        RuleY,
        AxisX,
        AxisY,
        Pointer
    } from 'svelteplot';
    import { page } from '$app/state';
    let { aapl } = $derived(page.data.data);
</script>

<Plot testid="aapl-line-frame">
    <AxisX />
    <AxisY />
    <Line data={aapl} x="Date" y="Close" />
    <Pointer
        data={aapl}
        x="Date"
        y="Close"
        maxDistance={30}>
        {#snippet children({ data })}
            <RuleX {data} x="Date" opacity="0.5" stroke="var(--svp-red)" />
            <RuleY {data} y="Close" opacity="0.5" stroke="var(--svp-red)" />
            <AxisX
                data={data.map((d) => d.Date)}
                tickFormat={(d) => d.getFullYear()} />
            <AxisY
                data={data.map((d) => d.Close)}
                tickFormat={(d) => d.toFixed()} />
        {/snippet}
    </Pointer>
</Plot>
```

Pointer along the y axis:

```svelte live
<script>
    import {
        Plot,
        Line,
        RuleY,
        Dot,
        Text,
        Pointer
    } from 'svelteplot';
    import { page } from '$app/state';
    let { aapl } = $derived(page.data.data);
</script>

<Plot testid="aapl-line-frame" marginRight={20}>
    <Line data={aapl} x="Date" y="Close" />
    <Pointer data={aapl} y="Close" maxDistance={30}>
        {#snippet children({ data })}
            <RuleY {data} y="Close" opacity="0.5" stroke="var(--svp-red)" />
            <Text
                {data}
                fill="currentColor"
                stroke="var(--svelteplot-bg)"
                strokeWidth="3"
                x="Date"
                y="Close"
                text={(d) => d.Close.toFixed()}
                lineAnchor="bottom"
                fontWeight="bold"
                dy="-10" />
            <Dot {data} x="Date" y="Close" fill />
        {/snippet}
    </Pointer>
</Plot>
```

```svelte live
<script>
    import {
        Plot,
        Line,
        RuleX,
        Dot,
        Text,
        Pointer
    } from 'svelteplot';
    import { page } from '$app/state';
    let { aapl } = $derived(page.data.data);
</script>

<Plot testid="aapl-line-frame" marginRight={20}>
    <Line data={aapl} x="Date" y="Close" />
    <Pointer data={aapl} x="Date" maxDistance={30}>
        {#snippet children({ data })}
            <RuleX {data} x="Date" opacity={0.2} />
            <Text
                {data}
                fill="currentColor"
                stroke="var(--svelteplot-bg)"
                strokeWidth="3"
                x="Date"
                y="Close"
                text={(d) => d.Close.toFixed()}
                lineAnchor="bottom"
                fontWeight="bold"
                dy="-10" />
            <Dot {data} x="Date" y="Close" fill />
        {/snippet}
    </Pointer>
</Plot>
```

Pointer along the x dimension

```svelte live
<script>
    import {
        Plot,
        Line,
        RuleX,
        Dot,
        Text,
        Pointer
    } from 'svelteplot';
    import { page } from '$app/state';
    let { stocks } = $derived(page.data.data);
    let stocks2 = $derived(
        stocks.filter((d) => d.Date < new Date(2018, 0, 1))
    );
</script>

<Plot
    testid="stocks-line-frame"
    y={{ type: 'log' }}
    marginRight={20}>
    <Line
        data={stocks2}
        x="Date"
        y="Close"
        stroke="Symbol" />
    <Pointer
        data={stocks2}
        x="Date"
        z="Symbol"
        maxDistance={30}>
        {#snippet children({ data })}
            <RuleX
                data={data.length ? [data[0]] : []}
                x="Date"
                opacity="0.5" stroke="var(--svp-red)" />
            <Text
                {data}
                fill="Symbol"
                stroke="var(--svelteplot-bg)"
                strokeWidth="3"
                x="Date"
                y="Close"
                text={(d) => d.Close.toFixed()}
                lineAnchor="bottom"
                fontWeight="bold"
                dy="-10" />
            <Dot {data} x="Date" y="Close" fill="Symbol" />
        {/snippet}
    </Pointer>
</Plot>
```

Click the bar chart!

```svelte live
<script>
    import { Plot, RuleY, BarY } from 'svelteplot';

    let clicked = $state();

    let title = $derived(
        clicked
            ? `You clicked ${JSON.stringify(clicked)}`
            : 'Click the bars'
    );
</script>

<Plot x={{ axis: false }} y={{ grid: true }} {title}>
    <BarY
        data={[-2, -1, 2, 4, 6, 9, 5]}
        cursor="pointer"
        opacity={{
            scale: null,
            value: (d) =>
                !clicked || clicked === d ? 1 : 0.5
        }}
        onclick={(event, d) => {
            clicked = d;
        }} />
    <RuleY data={[0]} />
</Plot>
```

```svelte
<Plot x={{ axis: false }} y={{ grid: true }} {title}>
    <BarY
        data={[-2, -1, 2, 4, 6, 9, 5]}
        cursor="pointer"
        opacity={{
            scale: null,
            value: (d) =>
                !clicked || clicked === d ? 1 : 0.5
        }}
        onclick={(d) => (clicked = d)} />
    <RuleY data={[0]} />
</Plot>
```

:::note
Note how we're wrapping the `opacity` channel accessor in a `scale: null, value: accessor` object to disable the automatic opacity scale.
:::

## Tooltips

You can use the [HTMLTooltip](/marks/tooltip) mark to show custom HTML tooltips in your plot.

```svelte live
<script>
    import { Plot, Dot, HTMLTooltip } from 'svelteplot';

    import { page } from '$app/state';
    let { penguins } = $derived(page.data.data);

    const speciesImages = {
        Adelie: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Hope_Bay-2016-Trinity_Peninsula%E2%80%93Ad%C3%A9lie_penguin_%28Pygoscelis_adeliae%29_04.jpg/346px-Hope_Bay-2016-Trinity_Peninsula%E2%80%93Ad%C3%A9lie_penguin_%28Pygoscelis_adeliae%29_04.jpg',
        Chinstrap:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/A_chinstrap_penguin_%28Pygoscelis_antarcticus%29_on_Deception_Island_in_Antarctica.jpg/201px-A_chinstrap_penguin_%28Pygoscelis_antarcticus%29_on_Deception_Island_in_Antarctica.jpg',
        Gentoo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/00_0304_Gentoo_Penguins.jpg/160px-00_0304_Gentoo_Penguins.jpg'
    };
</script>

<Plot grid height={500} symbol={{ legend: true }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species"
        symbol="species" />
    {#snippet overlay()}
        <HTMLTooltip
            data={penguins}
            x="culmen_length_mm"
            y="culmen_depth_mm">
            {#snippet children({ datum })}
                <div class="tt">
                    <div>Species: {datum.species}</div>
                    <div>Island: {datum.island}</div>
                    <div>
                        <img
                            src={speciesImages[
                                datum.species
                            ]} />
                    </div>
                </div>
            {/snippet}
        </HTMLTooltip>
    {/snippet}
</Plot>

<style>
    .tt {
        display: flex;
        gap: 5px;
        flex-direction: column;
    }
    img {
        max-width: 120px;
    }
</style>
```

You can even put another tiny plot inside the HTML tooltips:

```svelte live
<script>
    import { Plot, Dot, HTMLTooltip, BarX } from 'svelteplot';
    import { page } from '$app/state';
    let { penguins } = $derived(page.data.data);
</script>

<Plot grid height={500}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species"
        symbol="species" />
    {#snippet overlay()}
        <HTMLTooltip
            data={penguins}
            x="culmen_length_mm"
            y="culmen_depth_mm">
            {#snippet children({ datum })}
                <div style="width: 150px">
                    <Plot
                        inset={4}
                        margins={0}
                        x={{ label: null, axis: false }}
                        y={{ label: null, axis: false }}
                        height={130}>
                        <Dot
                            data={penguins}
                            x="culmen_length_mm"
                            y="culmen_depth_mm"
                            stroke="species"
                            r={2}
                            opacity={0.2} />
                        <Dot
                            data={[datum]}
                            x="culmen_length_mm"
                            y="culmen_depth_mm"
                            r={4}
                            fill="currentColor" />
                    </Plot>
                </div>
            {/snippet}
        </HTMLTooltip>
    {/snippet}
</Plot>

<style>
    .tt {
        display: flex;
        gap: 5px;
        flex-direction: column;
    }
    img {
        max-width: 120px;
    }
</style>
```
