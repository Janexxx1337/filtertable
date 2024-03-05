<template>
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const data = ref([]);
const columns = ref([]);
// Создаем маппинги для 'type' и 'type_calc'
const typeMapping = ref({});
const typeCalcMapping = ref({});

const displayColumns = ['id', 'name_unique', 'type', 'type_calc', 'source', 'param_name'];

onMounted(async () => {
  const optionsResponse = await import('../data/api_options.json');

  // Заполняем маппинги
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
