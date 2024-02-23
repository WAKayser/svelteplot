---
title: Bollinger mark
---

bollinger foo

```svelte live
<script>
    import { Plot, Line, Area, BollingerY } from '$lib';
    import { Slider } from '$lib/ui';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);

    let n = $state(20);
    let k = $state(2);
</script>

<Slider label="Window size (n)" bind:value={n} min={1} max={100} />
<Slider label="Radius (k)" bind:value={k} min={0} max={10} step={0.01} />
<Plot grid>
    <Line data={aapl} x="Date" y="Adj Close" />
    <BollingerY data={aapl} x="Date" y="Adj Close" stroke="red" {n} {k} />
</Plot>
```

```svelte
<Plot grid>
    <Line data={aapl} x="Date" y="Adj Close" />
    <BollingerY data={aapl} x="Date" y="Adj Close" stroke="red" />
</Plot>
```

For more flexibility you can also use the bollingerX and bollingerY as transforms:

```svelte live
<script>
    import { Plot, Line, Area, bollingerY } from '$lib/index';
    import { Slider } from '$lib/ui';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);

    let n = $state(20);
    let k = $state(2);

    let transformed = $derived(bollingerY({ data: aapl, x: 'Date', y: 'Adj Close' }, { n, k }));
</script>

<Slider label="Window size (n)" bind:value={n} min={1} max={100} />
<Slider label="Radius (k)" bind:value={k} min={0} max={10} step={0.01} />
<Plot grid>
    <Line data={aapl} x="Date" y="Adj Close" />
    <Line {...transformed} y="__hi" stroke="red" />
    <Line {...transformed} y="__lo" stroke="blue" />
</Plot>
```

```svelte
<script>
    import { Plot, Line, bollingerY } from 'svelteplot';
    // import data etc
    let transformed = $derived(bollingerY({ data: aapl, x: 'Date', y: 'Adj Close' }, { n, k }));
</script>

<Plot grid>
    <Line data={aapl} x="Date" y="Adj Close" />
    <Line {...transformed} y="__hi" stroke="red" />
    <Line {...transformed} y="__lo" stroke="blue" />
</Plot>
```

## BollingerX

```svelte live
<script>
    import { Plot, Line, Area, BollingerX } from '$lib';
    import { Slider } from '$lib/ui';

    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);

    let n = $state(20);
    let k = $state(2);
</script>

<Slider label="Window size (n)" bind:value={n} min={1} max={100} />
<Slider label="Radius (k)" bind:value={k} min={0} max={10} step={0.01} />
<Plot grid>
    <Line data={aapl} y="Date" x="Adj Close" />
    <BollingerX data={aapl} y="Date" x="Adj Close" stroke="red" {n} {k} />
</Plot>
```

```svelte
<Plot grid>
    <Line data={aapl} x="Date" y="Adj Close" />
    <BollingerY data={aapl} x="Date" y="Adj Close" stroke="red" />
</Plot>
```
