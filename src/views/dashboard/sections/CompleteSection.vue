<template>
  <ServiceSection
    fuente="Registro Civil, ANT, Función Judicial, Salud Pública y SRI"
    :isLoading="isLoading"
    :errorMsg="errorMsg"
    :results="resultsData"
    @search="executeSearch"
    @copy="copyResults"
  >
    <template #fields>
      <!--
        Alerta fija, no solo en el error: esta consulta cuesta 7 (una por
        fuente, haya datos o no) y se descuentan de una vez antes de saber
        si el usuario de verdad quería las siete. Tiene que verse ANTES de
        pulsar el botón, no despues de gastarlas.
      -->
      <div class="rounded-base border border-amber-500/20 bg-amber-500/5 p-md flex items-start gap-sm" role="note">
        <span class="text-body leading-none mt-xs" aria-hidden="true">⚠️</span>
        <p class="text-caption leading-relaxed" style="color: var(--estado-aviso);">
          Esta consulta revisa <strong>7 fuentes a la vez</strong> (identidad, licencia,
          multas, denuncias, causas judiciales, citas médicas y RUC) y descuenta
          <strong>7 consultas</strong> de tu cupo, haya datos o no en cada una.
        </p>
      </div>

      <div class="relative group input-container">
        <input
          v-model="ci"
          type="text"
          id="ci_completa"
          placeholder=" "
          maxlength="10"
          class="custom-input peer"
        />
        <label for="ci_completa">Cédula (ej. 1712345678)</label>
      </div>
    </template>

    <template #results="{ data }">
      <div class="space-y-xl">
        <!--
          Encabezado: el nombre y, en una sola linea, los datos que NO
          aparecen en ningun bloque de abajo (vigencia y puntos de la
          licencia, multas pendientes). Todo lo demas del resumen —
          "tiene licencia", "tiene RUC"— ya lo dice el estado de cada
          fuente, asi que no se repite aqui.
        -->
        <div v-if="nombreCompleto(data) || resumenFacts(data).length">
          <p v-if="nombreCompleto(data)" class="text-h5 font-medium text-[var(--text-primary)]">
            {{ nombreCompleto(data) }}
          </p>
          <p v-if="resumenFacts(data).length" class="text-caption text-[var(--text-secondary)] mt-xs">
            {{ resumenFacts(data).join(' · ') }}
          </p>
        </div>

        <!-- CADA FUENTE, con su propio estado -->
        <div v-for="f in FUENTES" :key="f.key" class="border-t border-[var(--border-color)] pt-lg">
          <div class="flex flex-wrap items-center justify-between gap-sm mb-md">
            <div>
              <h4 class="text-body font-semibold text-[var(--text-primary)]">{{ f.label }}</h4>
              <p class="text-caption text-[var(--text-muted)]">{{ f.fuente }}</p>
            </div>
            <span
              class="inline-flex items-center gap-xs text-caption font-medium px-sm py-xs rounded-full border w-fit"
              :class="badgeEstado(estadoDe(data, f.key)).clase"
            >
              {{ badgeEstado(estadoDe(data, f.key)).texto }}
            </span>
          </div>

          <!-- ok: la fuente respondio y hay datos -->
          <template v-if="estadoDe(data, f.key) === 'ok'">
            <!--
              Resumen por estado (pendientes/pagadas… con su conteo):
              ResultCard lo reconoce por la forma y lo pinta en chips,
              compacto. Una lista larga de registros no se vuelca aqui:
              solo el conteo, y el detalle se ve en su propia consulta.
            -->
            <ResultCard
              v-if="esResumenConteo(datosDe(data, f.key))"
              :label="f.label" :value="datosDe(data, f.key)"
            />
            <p
              v-else-if="Array.isArray(datosDe(data, f.key))"
              class="text-caption text-[var(--text-secondary)]"
            >
              {{ (datosDe(data, f.key) as any[]).length }}
              {{ (datosDe(data, f.key) as any[]).length === 1 ? 'registro' : 'registros' }}.
              Ábrelos en la consulta de {{ f.label.toLowerCase() }}.
            </p>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
              <ResultCard
                v-for="(v, k) in (datosDe(data, f.key) || {})" :key="k"
                :label="mapKey(String(k))" :value="v" :type="detectType(String(k), v)"
              />
            </div>
          </template>

          <!-- La fuente no entrego datos: da igual el motivo. -->
          <p v-else class="text-caption text-[var(--text-secondary)]">
            No se encontraron datos.
          </p>
        </div>
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

/** Las siete fuentes que trae /api/main/complete/, en el orden en que se pintan. */
const FUENTES = [
  { key: 'identidad', label: 'Identidad', fuente: 'Registro Civil', plural: false },
  { key: 'licencia', label: 'Licencia de conducir', fuente: 'ANT', plural: false },
  { key: 'multas', label: 'Multas e infracciones', fuente: 'ANT y municipios', plural: true },
  { key: 'denuncias', label: 'Denuncias', fuente: 'Función Judicial', plural: true },
  { key: 'judicial', label: 'Causas judiciales', fuente: 'Función Judicial', plural: true },
  { key: 'citas_medicas', label: 'Citas médicas', fuente: 'Sistema Público de Salud', plural: true },
  { key: 'ruc', label: 'RUC', fuente: 'SRI', plural: false }
];

/*
 * Cada una de las siete claves de la respuesta trae { estado, datos }. El
 * bloque 'resumen' aparte duplica los mismos estados para pintar tarjetas
 * sin abrir cada seccion, asi que si por lo que sea faltara la clave de
 * primer nivel (respuesta parcial, version vieja del backend) se cae a la
 * copia del resumen antes que a nada.
 */
const estadoDe = (data: any, key: string): string | undefined =>
  data?.[key]?.estado ?? data?.resumen?.estados?.[key];

const datosDe = (data: any, key: string): any => data?.[key]?.datos;

const resumen = (data: any) => data?.resumen;

const badgeEstado = (estado: string | undefined) => {
  if (estado === 'ok') return { texto: 'Con datos', clase: 'bg-green-500/10 text-green-400 border-green-500/20' };
  // sin_datos y no_disponible se ven igual: si la fuente no entregó nada,
  // al usuario le da lo mismo el motivo tecnico.
  return { texto: 'Sin datos', clase: 'border-[var(--border-color)] text-[var(--text-secondary)] opacity-80' };
};

const nombreCompleto = (data: any): string => {
  const r = resumen(data);
  return r ? [r.nombre, r.apellido].filter(Boolean).join(' ') : '';
};

/*
 * Solo los datos del resumen que NO salen en ningun bloque: la vigencia y
 * los puntos de la licencia, y las multas pendientes. Lo demas ("tiene
 * licencia", "tiene RUC"…) ya lo dice el estado de cada fuente.
 */
const resumenFacts = (data: any): string[] => {
  const r = resumen(data);
  if (!r) return [];
  const out: string[] = [];
  if (r.tiene_licencia) {
    if (r.licencia_vigente === true) out.push('Licencia vigente');
    else if (r.licencia_vigente === false) out.push('Licencia vencida');
    if (typeof r.puntos === 'number') out.push(`${r.puntos}/30 puntos`);
  }
  if (typeof r.multas_pendientes === 'number') {
    out.push(`${r.multas_pendientes} ${r.multas_pendientes === 1 ? 'multa pendiente' : 'multas pendientes'}`);
  }
  return out;
};

/*
 * ¿Es el resumen por estado (array de {status/estado, count}) y no una
 * lista de registros? Se mira la forma: cada item es un objeto con un
 * numero dentro. ResultCard ya lo pinta en chips.
 */
const esResumenConteo = (valor: any): boolean =>
  Array.isArray(valor) &&
  valor.length > 0 &&
  valor.every((o) => o && typeof o === 'object' && Object.values(o).some((v) => typeof v === 'number'));

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
    const data = await apiService.getComplete(cleanCi);
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
