import { loadDatasets } from '$lib/helpers/data.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ fetch }) => {
    return {
        data: await loadDatasets(
            [
                'countries',
                'aapl',
                'seattle',
                'penguins',
                'countries_2020',
                'symlog',
                'kneeling',
                'cars'
            ],
            fetch
        )
    };
};
