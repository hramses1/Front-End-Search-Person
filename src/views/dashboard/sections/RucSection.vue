<template>
  <ServiceSection fuente="SRI" :isLoading="isLoading" :errorMsg="errorMsg" :results="resultsData" @search="executeSearch" @copy="copyResults">
    <template #fields>
      <div class="relative group input-container">
        <input v-model="ruc" type="text" id="ruc" placeholder=" " maxlength="13" class="custom-input peer" />
        <label for="ruc">NÚMERO DE RUC (EJ: 1712345678001)</label>
      </div>
    </template>
    <template #results="{ data }">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
        <ResultCard v-for="(value, key) in data" :key="key" :label="mapKey(String(key))" :value="value" :type="detectType(String(key), value)" />
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

const ruc = ref('');
const isLoading = ref(false);
const errorMsg = ref('');
const resultsData = ref<any>(null);
const emit = defineEmits(['refresh-stats']);

const executeSearch = async () => {
  const cleanRuc = ruc.value.trim();
  if (!cleanRuc) { errorMsg.value = 'Ingrese un número de RUC.'; return; }
  if (cleanRuc.length !== 13) { errorMsg.value = 'El RUC debe tener 13 dígitos.'; return; }

  isLoading.value = true;
  errorMsg.value = '';
  resultsData.value = null;
  try {
    const data = await apiService.getRuc(cleanRuc);
    resultsData.value = data;
    emit('refresh-stats');
  } catch (err: any) {
    errorMsg.value = err.message || 'Error en la consulta.';
  } finally {
    isLoading.value = false;
  }
};
const copyResults = () => navigator.clipboard.writeText(JSON.stringify(resultsData.value, null, 2));
</script>
