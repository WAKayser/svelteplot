<script>
    import { Line, Plot } from 'svelteplot';
    let args = $props();
</script>

<Plot width={100} height={100} axes={false}>
    <Line {...args} />
</Plot>
