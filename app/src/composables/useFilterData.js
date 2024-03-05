import { ref } from 'vue';

export function useFilterData() {
    const typeOptions = ref([]);
    const typeCalcOptions = ref([]);
    const sourceOptions = ref([]);
    const paramNameOptions = ref([]);

    async function loadData() {
        const optionsResponse = await import('../data/api_options.json');
        typeOptions.value = optionsResponse.actions.POST.type.choices.map(choice => ({
            value: choice.value,
            display_name: choice.display_name
        }));
        typeCalcOptions.value = optionsResponse.actions.POST.type_calc.choices.map(choice => ({
            value: choice.value,
            display_name: choice.display_name
        }));

        const dataResponse = await import('../data/api_data.json');
        const sources = new Set();
        const paramNames = new Set();
        dataResponse.default.forEach(item => {
            sources.add(item.source);
            paramNames.add(item.param_name);
        });
        sourceOptions.value = Array.from(sources);
        paramNameOptions.value = Array.from(paramNames);
    }

    return { loadData, typeOptions, typeCalcOptions, sourceOptions, paramNameOptions };
}
