<template>
  <ServiceSection fuente="ANT" :isLoading="isLoading" :errorMsg="errorMsg" :results="resultsData" @search="executeSearch" @copy="copyResults">
    <template #fields>
      <div class="relative group input-container">
        <input v-model="plate" type="text" id="plate_input" placeholder=" " maxlength="8" class="custom-input peer" />
        <label for="plate_input">Placa del vehículo (ej. PBQ1234)</label>
      </div>
    </template>
    <template #results="{ data }">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
        <ResultCard v-for="(v, k) in data" :key="k" :label="mapKey(String(k))" :value="v" :type="detectType(String(k), v)" />
      </div>

      <!--
        La ficha del vehiculo (arriba) ya trae el resumen de multas por
        estado (campo 'citaciones': pendientes/pagadas/etc. con su conteo),
        sin costar una consulta aparte. Este boton es solo para el desglose,
        multa por multa: una consulta adicional, asi que se pide nada mas
        si de verdad se quiere ver, no siempre que se busca un vehiculo.
      -->
      <div class="mt-xl pt-xl border-t border-[var(--border-color)]">
        <button
          v-if="!citaciones && !cargandoCitaciones"
          type="button" class="btn-secondary"
          @click="buscarCitaciones"
        >
          Ver el detalle de cada multa
        </button>
        <p v-if="!citaciones && !cargandoCitaciones" class="text-caption text-[var(--text-muted)] mt-sm">
          Cuenta como otra consulta. El resumen de arriba ya está incluido en esta.
        </p>

        <div v-else-if="cargandoCitaciones" class="flex items-center gap-sm text-caption text-[var(--text-muted)]">
          <span class="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin border-[var(--accent-color)]"></span>
          Buscando el detalle…
        </div>

        <template v-else>
          <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)] mb-md">Detalle de las multas</p>
          <p v-if="errorCitaciones" class="text-caption text-[var(--estado-error)]">{{ errorCitaciones }}</p>
          <div v-else-if="Array.isArray(citaciones) && citaciones.length" class="space-y-md">
            <div v-for="(item, idx) in citaciones" :key="idx" class="p-md rounded-base border border-[var(--border-color)] bg-[var(--input-bg)]/30">
              <ResultCard v-for="(v, k) in item" :key="k" :label="mapKey(String(k))" :value="v" :type="detectType(String(k), v)" />
            </div>
          </div>
          <p v-else class="text-caption text-[var(--text-muted)]">Sin multas registradas para esta placa.</p>
        </template>
      </div>
    </template>
  </ServiceSection>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ServiceSection from '../components/ServiceSection.vue';
import ResultCard from '../../../components/ResultCard.vue';
import { apiService } from '../../../api/apiService';
import { mapKey, detectType } from '../../../utils/formatters';

const plate = ref('');
const isLoading = ref(false);
const errorMsg = ref('');
const resultsData = ref<any>(null);
const emit = defineEmits(['refresh-stats']);

const citaciones = ref<any>(null);
const cargandoCitaciones = ref(false);
const errorCitaciones = ref('');

const executeSearch = async () => {
  const cleanPlate = plate.value.trim().toUpperCase();
  if (!cleanPlate) { errorMsg.value = 'Ingrese una placa.'; return; }

  isLoading.value = true;
  errorMsg.value = '';
  resultsData.value = null;
  // Nueva placa, nueva busqueda: las multas de la anterior no aplican aqui.
  citaciones.value = null;
  errorCitaciones.value = '';
  try {
    const data = await apiService.getVehiclesByPlate(cleanPlate);
    resultsData.value = data;
    emit('refresh-stats');
  } catch (err: any) {
    // La cuota se reembolsa en algunos errores (400/451/500/503); hay que releerla.
    emit('refresh-stats');
    errorMsg.value = err.response?.data?.detail || 'Vehículo no encontrado.';
  } finally {
    isLoading.value = false;
  }
};

const buscarCitaciones = async () => {
  const cleanPlate = plate.value.trim().toUpperCase();
  cargandoCitaciones.value = true;
  errorCitaciones.value = '';
  try {
    citaciones.value = await apiService.getCitationsByPlate(cleanPlate);
    emit('refresh-stats');
  } catch (err: any) {
    // La cuota se reembolsa en algunos errores (400/451/500/503); hay que releerla.
    emit('refresh-stats');
    errorCitaciones.value = err.response?.data?.detail || 'No se pudieron obtener las multas.';
  } finally {
    cargandoCitaciones.value = false;
  }
};

// Si se borra el resultado (nueva busqueda en curso), el bloque de multas
// tambien se oculta: mostrar multas de una placa que ya no esta en pantalla
// confundiria mas de lo que ayuda.
watch(resultsData, (v) => { if (!v) { citaciones.value = null; errorCitaciones.value = ''; } });

const copyResults = () => navigator.clipboard.writeText(JSON.stringify(resultsData.value, null, 2));
</script>
