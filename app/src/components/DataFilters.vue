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
      <span class="filter-title sticky">Наименование ценообразующего параметра</span>
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
import { useFilterData } from '../composables/useFilterData';

const { loadData, typeOptions, typeCalcOptions, sourceOptions, paramNameOptions } = useFilterData();

onMounted(async () => {
  await loadData();
});

const emit = defineEmits(['update-filters']);
const selectedFilters = ref({
  type: [],
  typeCalc: [],
  source: [],
  paramName: []
});

// Функция для излучения текущих фильтров
const emitCurrentFilters = () => {
  emit('update-filters', selectedFilters.value);
};

// Установка наблюдателя за изменениями в каждом из фильтров
watch(selectedFilters, emitCurrentFilters, { deep: true });

</script>


<style scoped>
.filter-group {
  margin-bottom: 1rem;
  text-align: center;
  max-height: 250px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background-color: #fff;
  margin-top: 20px;
  overflow-x: hidden;
}

.filter-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

.form-check-label {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150px;
}
</style>
