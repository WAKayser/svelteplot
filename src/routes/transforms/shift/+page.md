---
title: Shift transform
---

The shift transform takes the datasets and shifts either the x or y channel by a defined interval. The output of the shifting can be either used as new x or y channel, or be used as additional channel, e.g. x1 or y2.

In this example, we're shifting a line by adding 2 months to the x values.

```svelte live
<script lang="ts">
    import { Plot, Line, shiftX } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot y={{ grid: true }}>
    <Line data={aapl} x="Date" y="Close" />
    <Line
        {...shiftX(
            { data: aapl, x: 'Date', y: 'Close' },
            '2 months'
        )}
        stroke="var(--svp-red)" />
</Plot>
```

```svelte
<Plot y={{ grid: true }}>
    <Line data={aapl} x="Date" y="Close" />
    <Line
        {...shiftX(
            { data: aapl, x: 'Date', y: 'Close' },
            '2 months'
        )}
        stroke="red" />
</Plot>
```

You can also define exactly which channels the shifted values should be stored into:

```svelte live
<script lang="ts">
    import { Plot, Line, AreaY, shiftY } from '$lib';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot y={{ grid: true }}>
    <Line data={aapl} x="Date" y="Close" />
    <AreaY
        {...shiftY(
            { data: aapl, x: 'Date', y: 'Close' },
            { y1: -10, y2: +10 }
        )}
        fill="var(--svp-red)"
        opacity="0.2" />
</Plot>
```

```svelte
<Plot y={{ grid: true }}>
    <Line data={aapl} x="Date" y="Close" />
    <AreaY
        {...shiftY(
            { data: aapl, x: 'Date', y: 'Close' },
            { y1: -10, y2: +10 }
        )}
        fill="red"
        opacity="0.2" />
</Plot>
```

Note that data values can only be shifted by a constant.

Under the hood, the shift transform is using the interval helpers from [d3-time](https://d3js.org/d3-time#_interval). You can produce the exact same result without using the shift transform, as shown below:

```svelte live
<script lang="ts">
    import { Plot, Line, AreaY } from '$lib';
    import { page } from '$app/stores';
    import { timeMonth } from 'd3-time';
    let { aapl } = $derived($page.data.data);
</script>

<Plot y={{ grid: true }}>
    <Line data={aapl} x="Date" y="Close" />
    <Line
        data={aapl}
        x={(d) => timeMonth.offset(d.Date, 3)}
        y="Close"
        stroke="var(--svp-red)" />
    <AreaY
        data={aapl}
        x="Date"
        y1={(d) => d.Close - 10}
        y2={(d) => d.Close + 10}
        fill="gray"
        opacity="0.2" />
</Plot>
```

```svelte
<Plot y={{ grid: true }}>
    <Line data={aapl} x="Date" y="Close" />
    <!-- shift x by 3 months -->
    <Line
        data={aapl}
        x={(d) => timeMonth.offset(d.Date, 3)}
        y="Close"
        stroke="red" />
    <!-- shift y by -10 and +10 -->
    <AreaY
        data={aapl}
        x="Date"
        y1={(d) => d.Close - 10}
        y2={(d) => d.Close + 10}
        fill="gray"
        opacity="0.2" />
</Plot>
```

## shiftX

Shift the data points in x direction.

## shiftY

Shift the data points in y direction.
