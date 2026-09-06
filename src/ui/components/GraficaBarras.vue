<template>
  <!--
    Consumo por día. Sin librería: son treinta barras y una escala, y cargar
    un paquete de gráficas para esto costaría más que el resto de la vista.

    Accesibilidad: el gráfico es decorativo para un lector de pantalla, así que
    va aria-hidden y debajo se ofrece la misma información como tabla. Un
    lienzo de barras sin alternativa textual es información que se pierde.
  -->
  <div>
    <div class="flex items-baseline justify-between gap-md mb-md">
      <p class="text-caption text-[var(--text-muted)]">{{ etiqueta }}</p>
      <p v-if="total" class="text-caption tabular-nums text-[var(--text-secondary)]">
        {{ total }} en total
      </p>
    </div>

    <div
      class="flex items-end gap-[2px] h-32 sm:h-40"
      role="img"
      :aria-label="`Consumo por día. ${total} consultas en el periodo.`"
    >
      <div
        v-for="d in datos" :key="d.fecha"
        class="flex-1 min-w-0 rounded-t-sm transition-all duration-base"
        :style="{
          height: alturaDe(d.valor),
          backgroundColor: d.valor > 0 ? 'var(--accent-color)' : 'var(--border-color)',
          opacity: d.valor > 0 ? 0.25 + 0.75 * (d.valor / maximo) : 1
        }"
        :title="`${formatoFecha(d.fecha)}: ${d.valor}`"
      ></div>
    </div>

    <!-- Extremos del eje: sin ellos las barras no dicen de cuándo son -->
    <div v-if="datos.length" class="flex justify-between mt-sm text-overline text-[var(--text-muted)]">
      <span>{{ formatoFecha(datos[0].fecha) }}</span>
      <span>{{ formatoFecha(datos[datos.length - 1].fecha) }}</span>
    </div>

    <details v-if="datos.length" class="mt-md">
      <summary class="text-caption text-[var(--text-secondary)] cursor-pointer inline-flex items-center min-h-[2.75rem]">
        Ver los datos en una tabla
      </summary>
      <div class="tabla-desplazable mt-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th scope="col" class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)] py-xs pr-md font-medium">Día</th>
              <th scope="col" class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)] py-xs font-medium">Consultas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in datos" :key="d.fecha" class="border-t border-[var(--border-color)]">
              <td class="text-caption py-xs pr-md text-[var(--text-secondary)]">{{ formatoFecha(d.fecha) }}</td>
              <td class="text-caption py-xs tabular-nums text-[var(--text-primary)]">{{ d.valor }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface PuntoDia {
  /** Fecha en formato ISO, solo la parte del día. */
  fecha: string;
  valor: number;
}

const props = withDefaults(defineProps<{
  datos: PuntoDia[];
  etiqueta?: string;
}>(), { etiqueta: 'Consultas por día' });

const maximo = computed(() => Math.max(1, ...props.datos.map(d => d.valor)));
const total = computed(() => props.datos.reduce((s, d) => s + d.valor, 0));

/*
 * Un día con una sola consulta tiene que verse: por eso el mínimo del 6 % en
 * vez de escalar desde cero. Con cero consultas la barra es la línea base.
 */
const alturaDe = (valor: number) =>
  valor === 0 ? '2px' : `${Math.max(6, (valor / maximo.value) * 100)}%`;

const formatoFecha = (iso: string) => {
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('es-EC', { day: 'numeric', month: 'short' });
};
</script>
