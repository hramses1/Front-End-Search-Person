<template>
  <!-- Tarjeta de un campo de resultado con formato automático -->
  <div class="flex flex-col gap-1 py-3 border-b last:border-0" style="border-color: var(--border-color);">
    <span class="text-[9px] uppercase tracking-[0.2em] font-mono opacity-60" style="color: var(--text-secondary);">
      {{ label }}
    </span>

    <!-- Slot para contenido personalizado -->
    <slot>
      <!-- Tipo badge (estado activo/inactivo) -->
      <span v-if="type === 'badge'"
        class="inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-0.5 rounded-full w-fit tracking-wider"
        :class="badgeClass"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
        {{ displayValue }}
      </span>

      <!-- Tipo fecha -->
      <span v-else-if="type === 'date'" class="text-[13px] font-medium tracking-wide" style="color: var(--text-primary);">
        📅 {{ displayValue }}
      </span>

      <!-- Tipo moneda -->
      <span v-else-if="type === 'currency'" class="text-[13px] font-medium font-mono" style="color: #22c55e;">
        $ {{ displayValue }}
      </span>

      <!-- Tipo texto por defecto -->
      <span v-else class="text-[13px] font-medium tracking-wide break-words leading-relaxed"
        :style="{ color: isEmpty ? 'var(--text-secondary)' : 'var(--text-primary)', opacity: isEmpty ? '0.4' : '1' }"
      >
        {{ displayValue }}
      </span>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  value?: any;
  type?: 'text' | 'badge' | 'date' | 'currency';
}>();

const isEmpty = computed(() => props.value === null || props.value === undefined || props.value === '' || props.value === false);

const displayValue = computed(() => {
  if (isEmpty.value) return 'NO REGISTRA';
  if (props.type === 'badge') return String(props.value).toUpperCase();
  if (props.type === 'currency') return Number(props.value).toLocaleString('es-EC', { minimumFractionDigits: 2 });
  return String(props.value);
});

const badgeClass = computed(() => {
  const v = String(props.value).toLowerCase();
  if (['activo', 'vigente', 'true', 'si', 'sí', 'aprobado'].includes(v)) {
    return 'bg-green-500/10 text-green-400 border border-green-500/20';
  }
  if (['inactivo', 'suspendido', 'false', 'no', 'cancelado'].includes(v)) {
    return 'bg-red-500/10 text-red-400 border border-red-500/20';
  }
  return 'border text-current opacity-80';
});
</script>
