<script lang="ts">
    import Line, { type BaseLineMarkProps } from './Line.svelte';
    import { recordizeX } from '$lib/index.js';

    let { data = [{}], ...rest }: BaseLineMarkProps = $props();

    let args = $derived(recordizeX({ data, ...rest }));
</script>

<Line {...args} />
