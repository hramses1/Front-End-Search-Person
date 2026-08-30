<template>
  <div class="group flex flex-col gap-2 py-4 border-b last:border-0 border-[var(--border-color)] transition-all hover:translate-x-1">
    
    <div class="flex items-center gap-3">
        <span class="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--accent-color)]">
            {{ label }}
        </span>
        <div class="h-[1.5px] flex-1 bg-[var(--border-color)] opacity-20"></div>
    </div>

    <!-- Contenido -->
    <div class="pl-0 sm:pl-2">
      <slot>
        <!-- Valor null / vacío -->
        <span v-if="isEmpty" class="text-sm font-black text-red-500 italic tracking-widest uppercase opacity-50">No registra información</span>

        <!-- Objeto / Array Complejo -->
        <div v-else-if="typeof value === 'object'" class="mt-2 pl-4 border-l-2 border-[var(--accent-color)]/30 space-y-3">
            <div v-if="Array.isArray(value)" class="space-y-4">
                <div v-for="(item, i) in value" :key="i" class="p-5 rounded-2xl bg-[var(--input-bg)] border-2 border-[var(--border-color)]">
                    <div v-for="(v, k) in item" :key="k" class="flex justify-between py-2 border-b last:border-0 border-[var(--border-color)]/40">
                        <span class="text-[10px] font-black uppercase opacity-50">{{ k }}</span>
                        <span class="text-sm font-black text-right">{{ v }}</span>
                    </div>
                </div>
            </div>
            <div v-else class="space-y-2">
                <div v-for="(v, k) in value" :key="k" class="flex justify-between py-2 border-b last:border-0 border-[var(--border-color)]/40">
                    <span class="text-[10px] font-black uppercase opacity-50">{{ k }}</span>
                    <span class="text-sm font-black text-right">{{ v }}</span>
                </div>
            </div>
        </div>

        <!-- Badges para estados -->
        <span v-else-if="type === 'badge'"
          class="inline-flex items-center gap-2 text-xs font-black px-5 py-1.5 rounded-full border-2 shadow-sm transition-all uppercase tracking-widest"
          :class="badgeClass"
        >
          {{ value }}
        </span>

        <!-- Moneda / Dinero -->
        <span v-else-if="type === 'currency'" class="text-2xl font-black tabular-nums tracking-tighter text-green-600 dark:text-green-400">
          $ {{ Number(value).toLocaleString('es-EC', { minimumFractionDigits: 2 }) }}
        </span>

        <!-- Texto Estándar (Grande y Visible) -->
        <span v-else class="text-lg font-black leading-tight tracking-tight text-[var(--text-primary)] break-words uppercase">
          {{ value }}
        </span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  value?: any;
  type?: 'text' | 'badge' | 'date' | 'currency';
}>();

const isEmpty = computed(() =>
  props.value === null || props.value === undefined || props.value === ''
);

const badgeClass = computed(() => {
  const v = String(props.value).toLowerCase();
  if (['activo', 'vigente', 'true', 'si', 'sí', 'aprobado'].includes(v))
    return 'bg-green-500/10 text-green-600 border-green-500/30';
  if (['inactivo', 'suspendido', 'false', 'no', 'cancelado'].includes(v))
    return 'bg-red-500/10 text-red-600 border-red-500/30';
  return 'bg-[var(--accent-color)]/5 text-[var(--accent-color)] border-[var(--accent-color)]/20';
});
</script>
