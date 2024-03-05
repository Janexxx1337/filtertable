<template>
<div class="table-container">
  <DataFilters
      :type-options="typeOptions"
      :type-calc-options="typeCalcOptions"
      @update-filters="handleFilterUpdate"
  />
  <div class="table-responsive">
    <table class="table table-sm table-striped table-hover">
      <thead>
      <tr>
        <!-- Генерация заголовков таблицы для выбранных колонок -->
        <th v-for="column in filteredColumns" :key="column.key">{{ column.label }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in data" :key="item.id">
        <td v-for="column in filteredColumns" :key="column.key">
          <!-- Проверяем, является ли это колонка 'type' или 'type_calc', если да, то используем соответствующий маппинг -->
          {{ column.key === 'type' ? typeMapping[item[column.key]] : column.key === 'type_calc' ? typeCalcMapping[item[column.key]] : item[column.key] }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import DataFilters from './DataFilters.vue';
const data = ref([]);
const filteredData = ref([]);
const columns = ref([]);
// Создаем маппинги для 'type' и 'type_calc'
const typeMapping = ref({});
const typeCalcMapping = ref({});

const activeFilters = ref({
  type: [],
  typeCalc: [],
  source: [],
  paramName: []
});

const handleFilterUpdate = (filters) => {
  // Обновляем активные фильтры
  Object.assign(activeFilters.value, filters);

  // Применяем фильтры к данным
  filteredData.value = data.value.filter((item) => {
    return (!activeFilters.value.type.length || activeFilters.value.type.includes(item.type)) &&
        (!activeFilters.value.typeCalc.length || activeFilters.value.typeCalc.includes(item.type_calc)) &&
        (!activeFilters.value.source.length || activeFilters.value.source.includes(item.source)) &&
        (!activeFilters.value.paramName.length || activeFilters.value.paramName.includes(item.param_name));
  });
};

const typeOptions = computed(() => Object.values(typeMapping.value));
const typeCalcOptions = computed(() => Object.values(typeCalcMapping.value));

filteredData.value = data.value; // По умолчанию отображаем все данные

const displayColumns = ['id', 'name_unique', 'type', 'type_calc', 'source', 'param_name'];

onMounted(async () => {
  const optionsResponse = await import('../data/api_options.json');

  optionsResponse.actions.POST.type.choices.forEach(choice => {
    typeMapping.value[choice.value] = choice.display_name;
  });
  optionsResponse.actions.POST.type_calc.choices.forEach(choice => {
    typeCalcMapping.value[choice.value] = choice.display_name;
  });

  columns.value = Object.keys(optionsResponse.actions.POST)
      .filter(key => displayColumns.includes(key))
      .map(key => ({
        key,
        label: optionsResponse.actions.POST[key].label
      }));

  const dataResponse = await import('../data/api_data.json');
  data.value = dataResponse.default;
});

const filteredColumns = computed(() => {
  return columns.value.filter(column => displayColumns.includes(column.key));
});
</script>

<style scoped>

.table-container {
  display: flex;
}

.table-responsive {
  max-width: 100%;
  margin: 20px auto;
}

.table th {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  z-index: 1;
}
</style>
