<template>
  <ServiceSection
    fuente="Registro Civil"
    :isLoading="isLoading" 
    :errorMsg="errorMsg" 
    :results="resultsData"
    @search="executeSearch"
    @copy="copyResults"
  >
    <template #fields>
      <div class="relative group input-container">
        <input 
          v-model="ci" 
          type="text" 
          id="ci"
          placeholder=" "
          maxlength="10"
          class="custom-input peer"
        />
        <label for="ci">
          CÉDULA (EJ: 1712345678)
        </label>
      </div>
    </template>

    <template #results="{ data }">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
        <ResultCard
          v-for="(value, key) in data" :key="key"
          :label="mapKey(String(key))"
          :value="value"
          :type="detectType(String(key), value)"
        />
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

const ci = ref('');
const isLoading = ref(false);
const errorMsg = ref('');
const resultsData = ref<any>(null);

const emit = defineEmits(['refresh-stats']);

const executeSearch = async () => {
  const cleanCi = ci.value.trim();
  
  if (!cleanCi) {
    errorMsg.value = 'Por favor ingrese un número de cédula.';
    return;
  }

  if (cleanCi.length !== 10) {
    errorMsg.value = 'La cédula debe tener exactamente 10 dígitos.';
    return;
  }

  isLoading.value = true;
  errorMsg.value = '';
  resultsData.value = null;
  
  try {
    const data = await apiService.getIdCard(cleanCi);
    if (!data || Object.keys(data).length === 0) throw new Error('No se encontraron resultados para esta cédula.');
    resultsData.value = data;
    emit('refresh-stats');
  } catch (err: any) {
    errorMsg.value = err.message || 'Error en la consulta.';
  } finally {
    isLoading.value = false;
  }
};

const copyResults = () => {
  if (resultsData.value) {
    navigator.clipboard.writeText(JSON.stringify(resultsData.value, null, 2));
  }
};
</script>
