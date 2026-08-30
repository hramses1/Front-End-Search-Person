<template>
  <ServiceSection :isLoading="isLoading" :errorMsg="errorMsg" :results="resultsData" @search="executeSearch" @copy="copyResults">
    <template #fields>
      <div class="relative group input-container">
        <input v-model="plate" type="text" id="plate_input" placeholder=" " maxlength="8" class="custom-input peer" />
        <label for="plate_input">PLACA DEL VEHÍCULO (EJ: PBQ1234)</label>
      </div>
    </template>
    <template #results="{ data }">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
        <ResultCard v-for="(v, k) in data" :key="k" :label="mapKey(String(k))" :value="v" :type="detectType(String(k), v)" />
      </div>
    </template>
  </ServiceSection>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ServiceSection from '../components/ServiceSection.vue';
import ResultCard from '../../../components/ResultCard.vue';
import { apiService } from '../../../api/apiService';
import { mapKey, detectType } from '../../../utils/formatters';

const plate = ref('');
const isLoading = ref(false);
const errorMsg = ref('');
const resultsData = ref<any>(null);
const emit = defineEmits(['refresh-stats']);

const executeSearch = async () => {
  const cleanPlate = plate.value.trim().toUpperCase();
  if (!cleanPlate) { errorMsg.value = 'Ingrese una placa.'; return; }

  isLoading.value = true;
  errorMsg.value = '';
  resultsData.value = null;
  try {
    const data = await apiService.getVehiclesByPlate(cleanPlate);
    resultsData.value = data;
    emit('refresh-stats');
  } catch (err: any) {
    errorMsg.value = err.response?.data?.detail || 'Vehículo no encontrado.';
  } finally {
    isLoading.value = false;
  }
};
const copyResults = () => navigator.clipboard.writeText(JSON.stringify(resultsData.value, null, 2));
</script>
