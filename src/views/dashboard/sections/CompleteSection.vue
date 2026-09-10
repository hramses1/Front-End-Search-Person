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
      <div class="space-y-2xl">
        <!-- RESUMEN: lo justo para leer de un vistazo, sin abrir cada fuente -->
        <div>
          <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)] mb-md">Resumen</p>

          <p v-if="resumen(data)?.nombre || resumen(data)?.apellido" class="text-h5 font-medium text-[var(--text-primary)] mb-md">
            {{ [resumen(data)?.nombre, resumen(data)?.apellido].filter(Boolean).join(' ') }}
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-sm">
            <div v-for="fila in indicadoresResumen(data)" :key="fila.etiqueta" class="flex flex-col gap-xs">
              <span class="text-overline uppercase tracking-[0.1em] text-[var(--text-muted)]">{{ fila.etiqueta }}</span>
              <span
                class="inline-flex items-center gap-xs text-caption font-medium px-sm py-xs rounded-full border w-fit"
                :class="fila.clase"
              >
                {{ fila.texto }}
              </span>
            </div>
          </div>

          <p v-if="fuentesSinRespuesta(data) > 0" class="text-caption text-[var(--text-muted)] mt-md">
            {{ fuentesSinRespuesta(data) }} {{ fuentesSinRespuesta(data) === 1 ? 'fuente no respondió' : 'fuentes no respondieron' }}.
            Se marcan abajo con "No se pudo consultar".
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
            <div v-if="Array.isArray(datosDe(data, f.key))" class="space-y-sm">
              <div
                v-for="(item, i) in (datosDe(data, f.key) as any[])" :key="i"
                class="p-md rounded-base border border-[var(--border-color)] bg-[var(--input-bg)]/30"
              >
                <ResultCard v-for="(v, k) in item" :key="k" :label="mapKey(String(k))" :value="v" :type="detectType(String(k), v)" />
              </div>
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
              <ResultCard
                v-for="(v, k) in (datosDe(data, f.key) || {})" :key="k"
                :label="mapKey(String(k))" :value="v" :type="detectType(String(k), v)"
              />
            </div>
          </template>

          <!-- sin_datos: la fuente respondio y no hay nada. Aqui si se afirma. -->
          <p v-else-if="estadoDe(data, f.key) === 'sin_datos'" class="text-caption text-[var(--text-secondary)]">
            La fuente respondió: no hay {{ f.label.toLowerCase() }} registrada{{ f.plural ? 's' : '' }}.
          </p>

          <!-- no_disponible: la fuente no respondio. -->
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

const fuentesSinRespuesta = (data: any): number => resumen(data)?.fuentes_sin_respuesta ?? 0;

const badgeEstado = (estado: string | undefined) => {
  if (estado === 'ok') return { texto: 'Con datos', clase: 'bg-green-500/10 text-green-400 border-green-500/20' };
  if (estado === 'sin_datos') return { texto: 'Sin datos', clase: 'border-[var(--border-color)] text-[var(--text-secondary)] opacity-80' };
  // no_disponible, o cualquier valor que no reconozcamos: nunca "no tiene".
  return { texto: 'No se pudo consultar', clase: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
};

/*
 * Regla de pintado del backend: false es "no tiene", null es "no se pudo
 * consultar, reintenta". Mezclarlos le diria a alguien que esta limpio
 * cuando nadie lo comprobo, asi que cada uno tiene su propio color.
 */
const indicadorBooleano = (valor: boolean | null | undefined) => {
  if (valor === true) return { texto: 'Sí', clase: 'bg-green-500/10 text-green-400 border-green-500/20' };
  if (valor === false) return { texto: 'No', clase: 'border-[var(--border-color)] text-[var(--text-secondary)]' };
  return { texto: 'No se pudo verificar', clase: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
};

const indicadorNumero = (valor: number | null | undefined, singular: string, plural: string) => {
  if (valor === null || valor === undefined) return { texto: 'No se pudo verificar', clase: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
  return { texto: `${valor} ${valor === 1 ? singular : plural}`, clase: 'border-[var(--border-color)] text-[var(--text-primary)]' };
};

const indicadoresResumen = (data: any) => {
  const r = resumen(data);
  if (!r) return [];
  const filas = [
    { etiqueta: 'Licencia', ...indicadorBooleano(r.tiene_licencia) },
    { etiqueta: 'Denuncias', ...indicadorBooleano(r.tiene_denuncias) },
    { etiqueta: 'Causas judiciales', ...indicadorBooleano(r.tiene_causas_judiciales) },
    { etiqueta: 'Citas médicas', ...indicadorBooleano(r.tiene_citas_medicas) },
    { etiqueta: 'RUC', ...indicadorBooleano(r.tiene_ruc) },
    { etiqueta: 'Multas pendientes', ...indicadorNumero(r.multas_pendientes, 'multa', 'multas') }
  ];
  // La vigencia de la licencia solo tiene sentido si de verdad tiene una.
  if (r.tiene_licencia) {
    filas.splice(1, 0, { etiqueta: 'Licencia vigente', ...indicadorBooleano(r.licencia_vigente) });
    if (typeof r.puntos === 'number') {
      filas.splice(2, 0, { etiqueta: 'Puntos', texto: `${r.puntos} de 30`, clase: 'border-[var(--border-color)] text-[var(--text-primary)]' });
    }
  }
  return filas;
};

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
