const config = {
    useTabs: false,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'none',
    printWidth: 100,
    plugins: ['prettier-plugin-svelte'],
    overrides: [
        {
            files: '*.svelte',
            options: {
                parser: 'svelte',
                bracketSameLine: true,
                svelteAllowShorthand: true
            }
        },
        {
            files: '*.md',
            options: {
                printWidth: 60,
                bracketSameLine: true,
                svelteAllowShorthand: true
            }
        }
    ]
};

export default config;
