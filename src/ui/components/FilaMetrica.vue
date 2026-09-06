<template>
  <!--
    Cifra grande con su explicación. Para la página de estado del servicio y
    para los resúmenes del panel.

    La unidad va en su propio span y no dentro del número: pegada al valor
    heredaba su tamaño y un "96,37 %" quedaba con el símbolo tan grande como
    la cifra.
  -->
  <div class="glass-card p-lg">
    <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)] mb-sm">
      {{ etiqueta }}
    </p>

    <p class="flex items-baseline gap-xs">
      <span
        class="text-h3 font-light tabular-nums leading-none"
        :style="{ color: colorValor }"
      >{{ valor }}</span>
      <span v-if="unidad" class="text-lead font-light text-[var(--text-secondary)]">{{ unidad }}</span>
    </p>

    <p v-if="detalle" class="text-caption leading-relaxed text-[var(--text-muted)] mt-sm">
      {{ detalle }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  etiqueta: string;
  valor: string | number;
  unidad?: string;
  /** Línea de contexto: cómo se mide o sobre qué periodo. */
  detalle?: string;
  /**
   * El color acompaña, nunca informa por sí solo: el detalle siempre dice qué
   * significa la cifra, para quien no distinga los tonos.
   */
  estado?: 'neutro' | 'bueno' | 'aviso' | 'malo';
}>(), { estado: 'neutro' });

const colorValor = computed(() => ({
  neutro: 'var(--text-primary)',
  bueno: 'var(--estado-exito)',
  aviso: 'var(--estado-aviso)',
  malo: 'var(--estado-error)'
}[props.estado]));
</script>
