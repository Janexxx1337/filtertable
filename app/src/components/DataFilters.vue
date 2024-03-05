<template>
  <div class="data-filters">
    <!-- Фильтр для типа недвижимости -->
    <div class="filter-group">
      <span class="filter-title">Тип недвижимости</span>
      <div v-for="option in typeOptions" :key="option.value" class="form-check">
        <input
            type="checkbox"
            :id="`type-${option.value}`"
            class="form-check-input"
            :value="option.value"
            v-model="selectedFilters.type"
        />
        <label :for="`type-${option.value}`" class="form-check-label">{{ option.display_name }}</label>
      </div>
    </div>

    <!-- Фильтр для типа расчета -->
    <div class="filter-group">
      <span class="filter-title">Тип расчета</span>
      <div v-for="option in typeCalcOptions" :key="option.value" class="form-check">
        <input
            type="checkbox"
            :id="`type-calc-${option.value}`"
            class="form-check-input"
            :value="option.value"
            v-model="selectedFilters.typeCalc"
        />
        <label :for="`type-calc-${option.value}`" class="form-check-label">{{ option.display_name }}</label>
      </div>
    </div>

    <div class="filter-group">
      <span class="filter-title">Источник информации</span>
      <div v-for="option in sourceOptions" :key="`source-${option}`" class="form-check">
        <input
            type="checkbox"
            :id="`source-${option}`"
            class="form-check-input"
            :value="option"
            v-model="selectedFilters.source"
        />
        <label :for="`source-${option}`" class="form-check-label">{{ option }}</label>
      </div>
    </div>

    <!-- Фильтр для 'param_name' -->
    <div class="filter-group">
      <span class="filter-title">Наименование ценообразующего параметра</span>
      <div v-for="option in paramNameOptions" :key="`param-name-${option}`" class="form-check">
        <input
            type="checkbox"
            :id="`param-name-${option}`"
            class="form-check-input"
            :value="option"
            v-model="selectedFilters.paramName"
        />
        <label :for="`param-name-${option}`" class="form-check-label">{{ option }}</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits, watch } from 'vue';

const emit = defineEmits(['update-filters']);
const selectedFilters = ref({
  type: [],
  typeCalc: [],
  source: [],
  paramName: []
});

const typeOptions = ref([]);
const typeCalcOptions = ref([]);
const sourceOptions = ref([]);
const paramNameOptions = ref([]);

// Функция для излучения текущих фильтров
const emitCurrentFilters = () => {
  emit('update-filters', selectedFilters.value);
};

// Установка наблюдателя за изменениями в каждом из фильтров
watch(selectedFilters, emitCurrentFilters, { deep: true });

onMounted(async () => {
  const optionsResponse = await import('../data/api_options.json');
  typeOptions.value = optionsResponse.actions.POST.type.choices.map(choice => ({
    value: choice.value,
    display_name: choice.display_name
  }));
  typeCalcOptions.value = optionsResponse.actions.POST.type_calc.choices.map(choice => ({
    value: choice.value,
    display_name: choice.display_name
  }));

  // Дополнительно загружаем 'api_data.json' для фильтров 'source' и 'param_name'
  const dataResponse = await import('../data/api_data.json');
  const sources = new Set();
  const paramNames = new Set();
  dataResponse.default.forEach(item => {
    sources.add(item.source);
    paramNames.add(item.param_name);
  });
  sourceOptions.value = Array.from(sources);
  paramNameOptions.value = Array.from(paramNames);
});

const emitFilters = () => {
  emit('update-filters', selectedFilters.value);
};
</script>
<style scoped>
.filter-group {
  margin-bottom: 1rem;
 text-align: center;
}

.filter-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

</style>
