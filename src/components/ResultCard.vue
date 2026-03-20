<template>
  <div class="flex flex-col gap-1 py-3 border-b last:border-0" style="border-color: var(--border-color);">
    <span class="text-[9px] uppercase tracking-[0.2em] font-mono opacity-60" style="color: var(--text-secondary);">
      {{ label }}
    </span>

    <!-- Slot para contenido personalizado -->
    <slot>
      <!-- Valor null / vacío -->
      <span v-if="isEmpty" class="text-[12px] opacity-30 italic" style="color: var(--text-secondary);">NO REGISTRA</span>

      <!-- Array de objetos – muestra sub-tarjetas compactas -->
      <div v-else-if="isArrayOfObjects" class="mt-2 space-y-2">
        <div
          v-for="(item, i) in (value as any[])"
          :key="i"
          class="rounded-xl border p-4 shadow-sm"
          style="background-color: var(--card-bg); border-color: var(--border-color);"
        >
          <div v-for="(v, k) in item" :key="k" class="py-2 border-b last:border-0" style="border-color: var(--border-color);">
            
            <!-- Contenido HTML o Textos muy largos (bloque completo) -->
            <template v-if="isHtmlContent(v)">
              <div class="flex flex-col gap-2">
                <span class="opacity-50 uppercase tracking-wider text-[9px]" style="color: var(--text-secondary);">{{ formatKey(String(k)) }}</span>
                <div 
                  class="prose prose-sm prose-invert max-w-none w-full opacity-90 p-4 rounded-lg bg-black/20 border border-white/10 overflow-x-auto"
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
              <div class="flex flex-col gap-1">
                <span class="opacity-50 uppercase tracking-wider text-[9px]" style="color: var(--text-secondary);">{{ formatKey(String(k)) }}</span>
                <span class="font-medium text-[11px] whitespace-pre-line leading-relaxed pb-1" :style="{ color: isBadgeValue(String(v)) ? badgeColor(String(v)) : 'var(--text-primary)' }">{{ v }}</span>
              </div>
            </template>

            <!-- Datos cortos (en línea) -->
            <template v-else>
              <div class="flex justify-between items-start gap-4 text-[11px]">
                <span class="opacity-50 uppercase tracking-wider text-[9px]" style="color: var(--text-secondary);">{{ formatKey(String(k)) }}</span>
                <span class="font-medium text-right break-words max-w-[60%]" :style="{ color: isBadgeValue(String(v)) ? badgeColor(String(v)) : 'var(--text-primary)' }">{{ v ?? '—' }}</span>
              </div>
            </template>

          </div>
        </div>
      </div>

      <!-- Array de primitivos -->
      <div v-else-if="Array.isArray(value)" class="flex flex-wrap gap-1.5 mt-1">
        <span
          v-for="(item, i) in (value as any[])" :key="i"
          class="px-2 py-0.5 rounded-full text-[10px] border font-mono"
          style="border-color: var(--border-color); color: var(--text-primary);"
        >{{ item }}</span>
      </div>

      <!-- Objeto simple – pares clave/valor -->
      <div v-else-if="isPlainObject" class="mt-2 space-y-1">
        <div v-for="(v, k) in (value as any)" :key="k" class="py-1 border-b last:border-0" style="border-color: var(--border-color);">
          <template v-if="isHtmlContent(v)">
            <div class="flex flex-col gap-2">
              <span class="opacity-50 uppercase tracking-wider text-[9px]" style="color: var(--text-secondary);">{{ formatKey(String(k)) }}</span>
              <div class="prose prose-sm prose-invert max-w-none w-full opacity-90 p-4 rounded-lg bg-black/20 border border-white/10 overflow-x-auto" v-html="sanitizeHTML(String(v))"></div>
            </div>
          </template>
          <!-- Si el sub-valor es a su vez un objeto o array, llamamos a ResultCard recursivamente -->
          <template v-else-if="v !== null && typeof v === 'object'">
            <ResultCard :label="formatKey(String(k))" :value="v" />
          </template>
          <template v-else-if="typeof v === 'string' && v.length > 50">
            <div class="flex flex-col gap-1">
              <span class="opacity-50 uppercase tracking-wider text-[9px]" style="color: var(--text-secondary);">{{ formatKey(String(k)) }}</span>
              <span class="font-medium text-[11px] whitespace-pre-line leading-relaxed" :style="{ color: isBadgeValue(String(v)) ? badgeColor(String(v)) : 'var(--text-primary)' }">{{ v }}</span>
            </div>
          </template>
          <template v-else>
            <div class="flex justify-between text-[11px]">
              <span class="opacity-50 uppercase tracking-wider text-[9px]" style="color: var(--text-secondary);">{{ formatKey(String(k)) }}</span>
              <span class="font-medium text-right break-words max-w-[60%]" :style="{ color: isBadgeValue(String(v)) ? badgeColor(String(v)) : 'var(--text-primary)' }">{{ v ?? '—' }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- Badge de estado -->
      <span v-else-if="type === 'badge'"
        class="inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-0.5 rounded-full w-fit tracking-wider mt-1"
        :class="badgeClass"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
        {{ displayValue }}
      </span>

      <!-- Fecha -->
      <span v-else-if="type === 'date'" class="text-[13px] font-medium mt-1" style="color: var(--text-primary);">
        📅 {{ displayValue }}
      </span>

      <!-- Moneda -->
      <span v-else-if="type === 'currency'" class="text-[13px] font-medium font-mono mt-1" style="color: #22c55e;">
        $ {{ displayValue }}
      </span>

      <!-- Contenido HTML de primer nivel -->
      <div v-else-if="isHtmlContent(value)" class="prose prose-sm prose-invert max-w-none w-full opacity-90 mt-2 p-4 rounded-lg bg-black/20 border border-white/10 overflow-x-auto" v-html="sanitizeHTML(String(value))">
      </div>

      <!-- Texto largo normal de primer nivel -->
      <span v-else-if="typeof value === 'string' && value.length > 80" class="text-[12px] font-medium tracking-wide break-words leading-relaxed whitespace-pre-line mt-1 opacity-90" style="color: var(--text-primary);">
        {{ displayValue }}
      </span>

      <!-- Texto por defecto -->
      <span v-else class="text-[13px] font-medium tracking-wide break-words leading-relaxed mt-1" style="color: var(--text-primary);">
        {{ displayValue }}
      </span>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DOMPurify from 'dompurify';

const props = defineProps<{
  label: string;
  value?: any;
  type?: 'text' | 'badge' | 'date' | 'currency';
}>();

const isEmpty = computed(() =>
  props.value === null ||
  props.value === undefined ||
  props.value === '' ||
  props.value === false ||
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

const displayValue = computed(() => {
  if (isEmpty.value) return 'NO REGISTRA';
  if (props.type === 'badge') return String(props.value).toUpperCase();
  if (props.type === 'currency') return Number(props.value).toLocaleString('es-EC', { minimumFractionDigits: 2 });
  return String(props.value);
});

const badgeClass = computed(() => {
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

const formatKey = (key: string) =>
  key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();

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

