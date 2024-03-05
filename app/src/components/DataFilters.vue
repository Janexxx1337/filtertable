<template>
  <div class="data-filters">
    <select v-model="selectedType">
      <option value="">Выберите тип</option>
      <option v-for="option in typeOptions" :value="option.value" :key="option.value">
        {{ option.display_name }}
      </option>
    </select>

    <select v-model="selectedTypeCalc">
      <option value="">Выберите тип расчёта</option>
      <option v-for="option in typeCalcOptions" :value="option.value" :key="option.value">
        {{ option.display_name }}
      </option>
    </select>

    <input v-model="selectedSource" placeholder="Источник">
    <input v-model="selectedParamName" placeholder="Параметр">
    <button @click="applyFilters">Применить</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  typeOptions: Array,
  typeCalcOptions: Array
});

const selectedType = ref('');
const selectedTypeCalc = ref('');
const selectedSource = ref('');
const selectedParamName = ref('');

function applyFilters() {
  const filters = {
    type: selectedType.value,
    typeCalc: selectedTypeCalc.value,
    source: selectedSource.value,
    paramName: selectedParamName.value,
  };
  // Вызываем событие с обновленными фильтрами
  emit('update:filters', filters);
}
</script>

<style scoped>
.data-filters {
  display: flex;
  flex-direction: column;
height: 200px;
}
</style>
