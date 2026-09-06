<template>
  <ServiceSection fuente="ANT" :isLoading="isLoading" :errorMsg="errorMsg" :results="resultsData" @search="executeSearch" @copy="copyResults">
    <template #fields>
      <div class="relative group input-container">
        <input v-model="ci" type="text" id="ci_license" placeholder=" " maxlength="10" class="custom-input peer" />
        <label for="ci_license">CÉDULA CONDUCTOR (EJ: 1712345678)</label>
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

const ci = ref('');
const isLoading = ref(false);
const errorMsg = ref('');
const resultsData = ref<any>(null);
const emit = defineEmits(['refresh-stats']);

const executeSearch = async () => {
  const cleanCi = ci.value.trim();
  if (!cleanCi || cleanCi.length !== 10) { errorMsg.value = 'Ingrese una cédula de 10 dígitos.'; return; }

  isLoading.value = true;
  errorMsg.value = '';
  resultsData.value = null;
  try {
    const data = await apiService.getLicense(cleanCi);
    resultsData.value = data;
    emit('refresh-stats');
  } catch (err: any) {
    errorMsg.value = err.response?.data?.detail || 'No se hallaron licencias.';
  } finally {
    isLoading.value = false;
  }
};
const copyResults = () => navigator.clipboard.writeText(JSON.stringify(resultsData.value, null, 2));
</script>
