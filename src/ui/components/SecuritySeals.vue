<template>
  <!--
    Sellos de confianza. Estaban duplicados en tres vistas, con iconos
    monocromos en dos de ellas y verdes y amarillos sueltos de Tailwind en la
    tercera. Aqui se define una sola vez y el color sale de los tokens de
    estado, que ya estan verificados contra AA.

    El color acompana, no comunica: cada sello lleva siempre su etiqueta.
  -->
  <div
    class="flex flex-wrap items-center justify-center gap-md text-overline uppercase tracking-[0.14em] font-mono leading-none"
    style="color: var(--text-muted);"
  >
    <template v-for="(s, i) in sellos" :key="s.texto">
      <!--
        Divisor de un pixel en vez del caracter ·: las metricas de una fuente
        monoespaciada lo situaban a distinta altura que los iconos, y ese era
        el desajuste visible. Una regla vertical siempre queda centrada.
      -->
      <span
        v-if="i > 0"
        aria-hidden="true"
        class="w-px h-3 shrink-0"
        :style="{ backgroundColor: 'var(--border-color)' }"
      ></span>

      <span class="inline-flex items-center gap-xs leading-none" :title="s.titulo">
        <svg
          class="w-3.5 h-3.5 shrink-0"
          :style="{ color: s.color }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="s.icono" />
        </svg>
        <!--
          El texto va en su propio span: pegado al </svg> quedaba un espacio
          literal que se sumaba al gap y hacia que cada sello separase distinto.
        -->
        <span>{{ s.texto }}</span>
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  /** compacto: barras laterales. amplio: pantalla de acceso. */
  variante?: 'compacto' | 'amplio';
}>(), { variante: 'compacto' });

const CANDADO = 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z';
const ESCUDO = 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z';
const RAYO = 'M13 10V3L4 14h7v7l9-11h-7z';
const VERIFICADO = 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';

const sellos = computed(() =>
  props.variante === 'amplio'
    ? [
        { texto: 'Conexión segura', titulo: 'Certificado SSL activo', icono: CANDADO, color: 'var(--estado-exito)' },
        { texto: 'Respuesta inmediata', titulo: 'La consulta se resuelve en el momento', icono: RAYO, color: 'var(--estado-aviso)' },
        { texto: 'Fuentes oficiales', titulo: 'Registro Civil, SRI, ANT y Función Judicial', icono: VERIFICADO, color: 'var(--accent-color)' }
      ]
    : [
        { texto: 'SSL', titulo: 'Certificado SSL activo', icono: CANDADO, color: 'var(--estado-exito)' },
        { texto: 'Cifrado TLS', titulo: 'Tráfico cifrado de extremo a extremo', icono: ESCUDO, color: 'var(--estado-exito)' },
        { texto: `Devzio © ${new Date().getFullYear()}`, titulo: 'Devzio', icono: RAYO, color: 'var(--accent-color)' }
      ]
);
</script>
