import type { PageLoad } from './$types.js';

export const load: PageLoad = () => {
    return { datasets: ['stateage'] };
};
