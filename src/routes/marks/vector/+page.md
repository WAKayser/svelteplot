---
title: Vector mark
---

```svelte live
<script>
    import { Plot, Vector } from '$lib';
    import { page } from '$app/stores';
    let { wind } = $derived($page.data.data);
</script>

<Plot
    inset={10}
    aspectRatio={1}
    color={{
        label: 'Speed (m/s)',
        zero: true,
        legend: true
    }}>
    <Vector
        data={wind}
        x="longitude"
        y="latitude"
        rotate={({ u, v }) =>
            (Math.atan2(u, v) * 180) / Math.PI}
        length={({ u, v }) => Math.hypot(u, v)}
        stroke={({ u, v }) => Math.hypot(u, v)} />
</Plot>
```

Here's an example where all arrows point towards the mouse cursor:

```svelte live
<script>
    import { Plot, Vector, Frame } from '$lib';
    import { page } from '$app/stores';
    import { range } from 'd3-array';

    const data = range(50)
        .map((x) => range(30).map((y) => ({ x, y })))
        .flat();
    let pointer = $state([0, 0]);
</script>

<Plot
    inset={10}
    margins={0}
    x={{ axis: false }}
    y={{ axis: false }}
    aspectRatio={1}
    length={{ range: [3.5, 20] }}>
    <Vector
        {data}
        x="x"
        y="y"
        length={(d) =>
            Math.sqrt(
                (d.x - pointer[0]) ** 2 +
                    (d.y - pointer[1]) ** 2
            )}
        rotate={(d) =>
            (Math.atan2(
                pointer[0] - d.x,
                pointer[1] - d.y
            ) *
                180) /
            Math.PI} />
    <Frame
        stroke="none"
        fill="transparent"
        onmousemove={(evt) => {
            pointer = [evt.dataX, evt.dataY];
        }} />
</Plot>
```

```svelte
<script>
    // ...
    const data = range(50)
        .map((x) => range(30).map((y) => ({ x, y })))
        .flat();
    let pointer = $state([0, 0]);
</script>

<Plot
    inset={10}
    aspectRatio={1}
    length={{ range: [3.5, 20] }}>
    <Vector
        {data}
        x="x"
        y="y"
        length={(d) =>
            Math.sqrt(
                (d.x - pointer[0]) ** 2 +
                    (d.y - pointer[1]) ** 2
            )}
        rotate={(d) =>
            (Math.atan2(
                pointer[0] - d.x,
                pointer[1] - d.y
            ) *
                180) /
            Math.PI} />
    <Frame
        stroke="none"
        fill="transparent"
        onmousemove={(evt) => {
            pointer = [evt.dataX, evt.dataY];
        }} />
</Plot>
```

Vector mark can deal with projection system:

```svelte live
<script>
    import { Plot, Geo, Vector, geoCentroid } from '$lib';
    import * as topojson from 'topojson-client';
    import { page } from '$app/stores';
    let { us, election } = $derived($page.data.data);

    let nation = $derived(
        topojson.feature(us, us.objects.nation)
    );
    let stateMesh = $derived(
        topojson.mesh(us, us.objects.states)
    );
    let _election = new Map(
        election.map((d) => [d.fips, d])
    );

    let counties = $derived(
        topojson
            .feature(us, us.objects.counties)
            .features.map((feat) => {
                return {
                    ...feat,
                    properties: {
                        ...feat.properties,
                        ...(_election.get(+feat.id) || {})
                    }
                };
            })
    );
</script>

<Plot
    projection="albers-usa"
    length={{ type: 'sqrt', range: [3, 40] }}
    color={{ scheme: 'BuRd' }}>
    <Geo data={[nation]} stroke="currentColor" />
    <Geo
        data={[stateMesh]}
        stroke="currentColor"
        strokeWidth="0.5" />
    <Vector
        {...geoCentroid({ data: counties })}
        length={(d) =>
            Math.abs(
                d.properties.margin2020 * d.properties.votes
            )}
        stroke={(d) =>
            d.properties.margin2020 > 0
                ? 'var(--svp-red)'
                : 'var(--svp-blue)'}
        rotate={(d) =>
            d.properties.margin2020 > 0 ? 60 : -60} />
</Plot>
```

## Vector options

-   **shape** - Either _arrow_ or _spike_, or a custom shape object (see below)
-   **anchor** - Controls where the vector is anchored in relation to the x, y position. If set to _'start'_, the arrow will start at the x, y position. If set to _'middle'_, the arrow will be centered at the x, y position. If set to _'end'_, the arrow will end at the x, y position. Default is _middle_.

### Custom shapes

You can use the Vector mark with **custom shapes** by passing an object with a `draw` method that takes a _context_, _length_, and _radius_ as argument. Here's an example with a custom shape object for drawing little "A" characters:

```svelte
<script>
    // ...
    const shapeA = {
        draw(context, l, r) {
            context.moveTo(-r, 0);
            context.lineTo(0, -l);
            context.lineTo(r, 0);
            context.moveTo(-r * 0.7, -l * 0.3);
            context.lineTo(r * 0.7, -l * 0.3);
        }
    };
</script>

<Plot
    ><Vector {data} x="x" y="y" shape={shapeA} ... /></Plot>
```

```svelte live
<script>
    import { Plot, Vector, Frame } from '$lib';
    import { page } from '$app/stores';
    import { range } from 'd3-array';

    const shapeA = {
        draw(context, l, r) {
            context.moveTo(-r, 0);
            context.lineTo(0, -l);
            context.lineTo(r, 0);
            context.moveTo(-r * 0.7, -l * 0.3);
            context.lineTo(r * 0.7, -l * 0.3);
        }
    };

    const data = range(40)
        .map((x) => range(20).map((y) => ({ x, y })))
        .flat();
    let pointer = $state([0, 0]);
</script>

<Plot
    inset={10}
    margins={0}
    x={{ axis: false }}
    y={{ axis: false }}
    aspectRatio={1}
    length={{ range: [5, 15] }}>
    <Vector
        {data}
        x="x"
        y="y"
        shape={shapeA}
        anchor="start"
        length={(d) =>
            Math.sqrt(
                (d.x - pointer[0]) ** 2 +
                    (d.y - pointer[1]) ** 2
            )}
        rotate={(d) =>
            (Math.atan2(
                pointer[0] - d.x,
                pointer[1] - d.y
            ) *
                180) /
            Math.PI} />
    <Frame
        stroke="none"
        fill="transparent"
        onmousemove={(evt) => {
            pointer = [evt.dataX, evt.dataY];
        }} />
</Plot>
```

## Vector

```svelte
<Vector
    {data}
    x="x"
    y="y"
    anchor="start"
    length={(d) =>
        Math.sqrt(
            (d.x - pointer[0]) ** 2 +
                (d.y - pointer[1]) ** 2
        )}
    rotate={(d) =>
        (Math.atan2(pointer[0] - d.x, pointer[1] - d.y) *
            180) /
        Math.PI} />
```

## Spike

The **Spike** mark is a convenience wrapper around the Vector mark that sets nice defaults.

```svelte live
<script>
    import { Plot, Geo, Spike, geoCentroid } from '$lib';
    import * as topojson from 'topojson-client';
    import { page } from '$app/stores';
    let { us, election } = $derived($page.data.data);

    let nation = topojson.feature(us, us.objects.nation);
    let stateMesh = topojson.mesh(us, us.objects.states);

    let _election = new Map(
        election.map((d) => [d.fips, d])
    );

    let counties = $derived(
        topojson
            .feature(us, us.objects.counties)
            .features.map((feat) => {
                return {
                    ...feat,
                    properties: {
                        ...feat.properties,
                        ...(_election.get(+feat.id) || {})
                    }
                };
            })
    );
</script>

<Plot projection="albers-usa" length={{ range: [0, 100] }}>
    <Geo
        data={[nation]}
        fill="white"
        stroke="currentColor" />
    <Geo
        data={[stateMesh]}
        stroke="currentColor"
        strokeWidth="0.5" />
    <Spike
        {...geoCentroid({ data: counties })}
        stroke="var(--svp-green)"
        length={(d) => d.properties.votes} />
</Plot>
```

```svelte
<Plot projection="albers-usa" length={{ range: [0, 100] }}>
    <Geo data={[nation]} stroke="currentColor" />
    <Geo
        data={[stateMesh]}
        stroke="currentColor"
        strokeWidth="0.5" />
    <Spike
        {...geoCentroid({ data: counties })}
        stroke="green"
        length={(d) => d.properties.votes} />
</Plot>
```
