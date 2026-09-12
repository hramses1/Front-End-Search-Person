<template>
  <!--
    Si no hay dato real que mostrar, la fila entera desaparece: nada de
    "NO REGISTRA" ni del relleno suelto que manda la fuente (una comilla
    sola, un guion) cuando no tiene el campo. Mejor una ficha mas corta
    que una con basura.
  -->
  <div v-if="!isEmpty" class="flex flex-col gap-xs py-md border-b last:border-0" style="border-color: var(--border-color);">
    <span class="text-overline uppercase tracking-[0.14em] font-mono text-[var(--text-secondary)]" style="color: var(--text-secondary);">
      {{ label }}
    </span>

    <!-- Slot para contenido personalizado -->
    <slot>
      <!--
        Resumen por estado (pendientes/pagadas/etc. con su conteo): en vez
        de una sub-tarjeta apilada por cada uno de los cinco estados (dos
        filas cada una, "Estado" y "count" repetidos diez veces en total),
        una sola fila de chips. Se reconoce por la forma del dato, no por
        el nombre de la clave que lo contiene, asi que sirve venga donde
        venga en la respuesta.
      -->
      <div v-if="resumenDeEstados" class="flex flex-wrap gap-sm mt-xs">
        <span
          v-for="r in resumenDeEstados" :key="r.estado"
          class="inline-flex items-center gap-xs text-caption font-medium px-sm py-xs rounded-full border"
          :class="esEstadoAbierto(r.estado) ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'"
        >
          {{ etiquetaEstado(r.estado) }}
          <span class="font-mono tabular-nums">{{ r.cantidad }}</span>
        </span>
      </div>

      <!-- Array de objetos – muestra sub-tarjetas compactas -->
      <div v-else-if="isArrayOfObjects" class="mt-sm">
        <ListaConLimite :items="(value as any[])">
          <template #default="{ item }">
            <div
              class="rounded-base border p-md shadow-sm"
              style="background-color: var(--card-bg); border-color: var(--border-color);"
            >
              <div v-for="(v, k) in item" :key="k" class="py-sm border-b last:border-0" style="border-color: var(--border-color);">

                <!-- Contenido HTML o Textos muy largos (bloque completo) -->
                <template v-if="isHtmlContent(v)">
                  <div class="flex flex-col gap-sm">
                    <span class="text-[var(--text-secondary)] uppercase tracking-wider text-caption" style="color: var(--text-secondary);">{{ formatKey(String(k)) }}</span>
                    <div
                      class="prose prose-sm prose-invert max-w-none w-full opacity-90 p-md rounded-base bg-black/20 border border-white/10 overflow-x-auto"
                      v-html="sanitizeHTML(String(v))"
                    ></div>
                  </div>
                </template>

                <!-- Si el sub-valor es a su vez un objeto o array, llamamos a ResultCard recursivamente -->
                <template v-else-if="v !== null && typeof v === 'object'">
                  <ResultCard :label="formatKey(String(k))" :value="v" />
                </template>

                <!-- Textos puros de longitud mediana/larga (bloque completo) -->
                <template v-else-if="typeof v === 'string' && v.length > 50">
                  <div class="flex flex-col gap-xs">
                    <span class="text-[var(--text-secondary)] uppercase tracking-wider text-caption" style="color: var(--text-secondary);">{{ formatKey(String(k)) }}</span>
                    <span class="font-medium text-body whitespace-pre-line leading-relaxed pb-xs" :style="{ color: isBadgeValue(String(v)) ? badgeColor(String(v)) : 'var(--text-primary)' }">{{ v }}</span>
                  </div>
                </template>

                <!-- Datos cortos (en línea) -->
                <template v-else>
                  <div class="flex justify-between items-start gap-md text-body">
                    <span class="text-[var(--text-secondary)] uppercase tracking-wider text-caption" style="color: var(--text-secondary);">{{ formatKey(String(k)) }}</span>
                    <span class="font-medium text-right break-words max-w-[60%]" :style="{ color: isBadgeValue(String(v)) ? badgeColor(String(v)) : 'var(--text-primary)' }">{{ v ?? '—' }}</span>
                  </div>
                </template>

              </div>
            </div>
          </template>
        </ListaConLimite>
      </div>

      <!-- Array de primitivos -->
      <div v-else-if="Array.isArray(value)" class="flex flex-wrap gap-sm mt-xs">
        <span
          v-for="(item, i) in (value as any[])" :key="i"
          class="px-sm py-xs rounded-full text-caption border font-mono"
          style="border-color: var(--border-color); color: var(--text-primary);"
        >{{ item }}</span>
      </div>

      <!-- Objeto simple – pares clave/valor -->
      <div v-else-if="isPlainObject" class="mt-sm space-y-xs">
        <div v-for="(v, k) in (value as any)" :key="k" class="py-xs border-b last:border-0" style="border-color: var(--border-color);">
          <template v-if="isHtmlContent(v)">
            <div class="flex flex-col gap-sm">
              <span class="text-[var(--text-secondary)] uppercase tracking-wider text-caption" style="color: var(--text-secondary);">{{ formatKey(String(k)) }}</span>
              <div class="prose prose-sm prose-invert max-w-none w-full opacity-90 p-md rounded-base bg-black/20 border border-white/10 overflow-x-auto" v-html="sanitizeHTML(String(v))"></div>
            </div>
          </template>
          <!-- Si el sub-valor es a su vez un objeto o array, llamamos a ResultCard recursivamente -->
          <template v-else-if="v !== null && typeof v === 'object'">
            <ResultCard :label="formatKey(String(k))" :value="v" />
          </template>
          <template v-else-if="typeof v === 'string' && v.length > 50">
            <div class="flex flex-col gap-xs">
              <span class="text-[var(--text-secondary)] uppercase tracking-wider text-caption" style="color: var(--text-secondary);">{{ formatKey(String(k)) }}</span>
              <span class="font-medium text-body whitespace-pre-line leading-relaxed" :style="{ color: isBadgeValue(String(v)) ? badgeColor(String(v)) : 'var(--text-primary)' }">{{ v }}</span>
            </div>
          </template>
          <template v-else>
            <div class="flex justify-between text-body">
              <span class="text-[var(--text-secondary)] uppercase tracking-wider text-caption" style="color: var(--text-secondary);">{{ formatKey(String(k)) }}</span>
              <span class="font-medium text-right break-words max-w-[60%]" :style="{ color: isBadgeValue(String(v)) ? badgeColor(String(v)) : 'var(--text-primary)' }">{{ v ?? '—' }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- Badge de estado -->
      <span v-else-if="type === 'badge'"
        class="inline-flex items-center gap-sm text-caption font-medium px-sm py-xs rounded-full w-fit tracking-wider mt-xs"
        :class="badgeClass"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
        {{ displayValue }}
      </span>

      <!-- Alerta booleana: al reves de un badge comun, aqui "true" es lo
           que hay que notar (bloqueado), no un estado bueno. -->
      <span v-else-if="type === 'alerta'"
        class="inline-flex items-center gap-sm text-caption font-medium px-sm py-xs rounded-full w-fit tracking-wider mt-xs"
        :class="value ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
        {{ value ? 'Sí' : 'No' }}
      </span>

      <!-- Fecha -->
      <span v-else-if="type === 'date'" class="text-body font-medium mt-xs" style="color: var(--text-primary);">
        📅 {{ displayValue }}
      </span>

      <!-- Moneda -->
      <span v-else-if="type === 'currency'" class="text-body font-medium font-mono mt-xs" style="color: #22c55e;">
        $ {{ displayValue }}
      </span>

      <!-- Código oficial: cédula, RUC, placa. Mismo tratamiento (Courier
           Prime tabular) que la demo pública, para que el dato se lea
           igual en todo el sitio. -->
      <span v-else-if="type === 'codigo'" class="dato text-body mt-xs" style="color: var(--text-primary);">
        {{ displayValue }}
      </span>

      <!-- Contenido HTML de primer nivel -->
      <div v-else-if="isHtmlContent(value)" class="prose prose-sm prose-invert max-w-none w-full opacity-90 mt-sm p-md rounded-base bg-black/20 border border-white/10 overflow-x-auto" v-html="sanitizeHTML(String(value))">
      </div>

      <!-- Texto largo normal de primer nivel -->
      <span v-else-if="typeof value === 'string' && value.length > 80" class="text-body font-medium tracking-wide break-words leading-relaxed whitespace-pre-line mt-xs opacity-90" style="color: var(--text-primary);">
        {{ displayValue }}
      </span>

      <!-- Texto por defecto -->
      <span v-else class="text-body font-medium tracking-wide break-words leading-relaxed mt-xs" style="color: var(--text-primary);">
        {{ displayValue }}
      </span>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DOMPurify from 'dompurify';
import { mapKey, esEstadoConocido, etiquetaEstado, esEstadoAbierto } from '../utils/formatters';
import ListaConLimite from './ListaConLimite.vue';

const props = defineProps<{
  label: string;
  value?: any;
  type?: 'text' | 'badge' | 'alerta' | 'date' | 'currency' | 'codigo';
}>();

/*
 * false ya no es "sin dato": Bloque y vigente llegan como booleano real
 * desde el back, y false es tan valido como true (no bloqueado, vencida).
 * Antes se trataba como vacio, asi que un campo booleano en false
 * desaparecia de la ficha en vez de mostrarse.
 */
const isEmpty = computed(() =>
  props.value === null ||
  props.value === undefined ||
  props.value === '' ||
  (Array.isArray(props.value) && props.value.length === 0)
);

const isPlainObject = computed(() =>
  props.value !== null &&
  typeof props.value === 'object' &&
  !Array.isArray(props.value)
);

const isArrayOfObjects = computed(() =>
  Array.isArray(props.value) &&
  props.value.length > 0 &&
  typeof props.value[0] === 'object' &&
  props.value[0] !== null
);

/*
 * Reconoce el resumen por estado (un objeto por cada uno de los cinco
 * estados, con su conteo) por la forma del dato: en cada item, un campo
 * cuyo valor es un estado conocido y otro que es un numero. No depende
 * de que las claves se llamen 'Estado'/'count': si el back las renombra,
 * sigue reconociendolo igual.
 */
const resumenDeEstados = computed(() => {
  if (!isArrayOfObjects.value) return null;
  const items = props.value as Record<string, unknown>[];
  const filas = items.map((item) => {
    const estado = Object.values(item).find(esEstadoConocido) as string | undefined;
    const cantidad = Object.values(item).find((v) => typeof v === 'number') as number | undefined;
    return estado !== undefined && cantidad !== undefined ? { estado, cantidad } : null;
  });
  return filas.every((f) => f !== null) ? (filas as { estado: string; cantidad: number }[]) : null;
});

const displayValue = computed(() => {
  if (isEmpty.value) return 'NO REGISTRA';
  /*
   * El vocabulario unico de estados vale sin importar el tipo detectado: en
   * licencia llega en 'status' (ya tipado 'badge'), en citacion llega en
   * 'tipo', que no siempre es un estado (a veces es "VEH"), asi que no se
   * fuerza a badge por clave — se reconoce por el valor.
   */
  if (esEstadoConocido(props.value)) return etiquetaEstado(props.value);
  if (props.type === 'badge') {
    // Un booleano (vigente) se lee "Sí"/"No", no "TRUE".
    if (typeof props.value === 'boolean') return props.value ? 'Sí' : 'No';
    return String(props.value).toUpperCase();
  }
  if (props.type === 'currency') return Number(props.value).toLocaleString('es-EC', { minimumFractionDigits: 2 });
  return String(props.value);
});

const badgeClass = computed(() => {
  if (esEstadoConocido(props.value)) {
    return esEstadoAbierto(props.value)
      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
      : 'bg-green-500/10 text-green-400 border border-green-500/20';
  }
  const v = String(props.value).toLowerCase();
  if (['activo', 'vigente', 'true', 'si', 'sí', 'aprobado'].includes(v))
    return 'bg-green-500/10 text-green-400 border border-green-500/20';
  if (['inactivo', 'suspendido', 'false', 'no', 'cancelado'].includes(v))
    return 'bg-red-500/10 text-red-400 border border-red-500/20';
  return 'border text-current opacity-80';
});

// Helpers
const BADGE_VALUES = ['activo', 'inactivo', 'vigente', 'suspendido', 'true', 'false', 'aprobado', 'cancelado'];
const isBadgeValue = (v: string) => BADGE_VALUES.includes(v.toLowerCase());
const badgeColor = (v: string) =>
  ['activo', 'vigente', 'true', 'aprobado'].includes(v.toLowerCase()) ? '#22c55e' : '#ef4444';

// Reutiliza el formateador compartido: antes duplicaba la lógica con la regex
// antigua, así que las etiquetas de KEY_MAP no llegaban a las estructuras
// anidadas y las siglas se partían letra a letra.
const formatKey = mapKey;

// HTML Detection & Sanitization
const isHtmlContent = (val: any) => {
  if (typeof val !== 'string') return false;
  // Simple check for HTML tags
  return /<\/?[a-z][\s\S]*>/i.test(val);
};

const sanitizeHTML = (htmlRaw: string) => {
  return DOMPurify.sanitize(htmlRaw, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'],
    ALLOWED_ATTR: ['href', 'target'],
    FORBID_ATTR: ['style', 'class', 'width', 'height', 'border', 'cellpadding', 'cellspacing', 'valign', 'align']
  });
};
</script>

