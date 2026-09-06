<template>
  <div class="font-primary min-h-screen relative selection:bg-[var(--accent-color)]/30"
       style="background-color: var(--bg-color); color: var(--text-primary);">
    <a href="#contenido" class="salto-contenido">Saltar al contenido</a>

    <div class="relative z-10 max-w-4xl mx-auto contenedor">

      <header class="flex items-center justify-between gap-md py-lg border-b border-[var(--border-color)]">
        <button
          @click="router.push('/')"
          class="inline-flex items-center min-h-[2.75rem] gap-sm text-caption text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-all"
        >
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a la portada
        </button>
        <button
          @click="toggleTheme"
          aria-label="Cambiar tema"
          class="inline-flex items-center justify-center min-h-[2.75rem] min-w-[2.75rem] glass-panel rounded-base text-[var(--accent-color)] transition-transform"
        >
          <svg v-if="isDark" class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
          </svg>
          <svg v-else class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
        </button>
      </header>

      <MigasDePan class="pt-lg" :pasos="[{ texto: 'Estado del servicio' }]" />

      <main id="contenido">
        <section class="py-xl sm:py-2xl">
          <p class="text-overline font-bold tracking-[0.14em] uppercase text-[var(--accent-color)] mb-sm">Estado</p>
          <h1 class="text-h2 font-light tracking-tight text-balance mb-md">Estado del servicio</h1>
          <p class="text-lead leading-relaxed text-[var(--text-secondary)] prose-limit">
            Cómo se ha comportado el servicio en los últimos siete días, calculado desde nuestros
            propios registros de peticiones.
          </p>
        </section>

        <!--
          Mientras el backend no exponga las metricas, la pagina dice que no
          las tiene en vez de inventarse un numero. Publicar una cifra falsa en
          una pagina cuyo proposito es la transparencia seria lo peor que
          podriamos hacer aqui.
        -->
        <section v-if="!metricas" class="pb-2xl">
          <EstadoVacio
            class="glass-card border-dashed"
            titulo="Todavía no publicamos métricas"
            detalle="Estamos preparando la medición. En cuanto esté, aquí aparecerán la disponibilidad, la latencia y el total de consultas servidas de los últimos siete días."
          />
        </section>

        <section v-else class="pb-2xl grid gap-md sm:grid-cols-3">
          <FilaMetrica
            etiqueta="Disponibilidad"
            :valor="metricas.disponibilidad"
            unidad="%"
            :estado="metricas.disponibilidad >= 99 ? 'bueno' : metricas.disponibilidad >= 95 ? 'aviso' : 'malo'"
            detalle="Peticiones sin error de servidor, últimos 7 días."
          />
          <FilaMetrica
            etiqueta="Latencia típica"
            :valor="metricas.latencia"
            unidad="ms"
            detalle="Mediana del tiempo de respuesta."
          />
          <FilaMetrica
            etiqueta="Consultas servidas"
            :valor="metricas.servidas.toLocaleString('es-EC')"
            detalle="Respuestas correctas, últimos 7 días."
          />
        </section>

        <section class="pb-2xl">
          <h2 class="text-h4 font-light tracking-tight mb-lg">Cómo lo medimos</h2>
          <ul class="space-y-md prose-limit">
            <li v-for="m in metodologia" :key="m.q" class="text-body leading-relaxed text-[var(--text-secondary)]">
              <strong class="text-[var(--text-primary)] font-medium">{{ m.q }}:</strong> {{ m.r }}
            </li>
          </ul>
          <p class="text-body leading-relaxed text-[var(--text-secondary)] mt-lg prose-limit">
            Conviene decirlo claro: parte de los fallos no vienen de nuestra infraestructura, sino de
            las fuentes oficiales cuando se saturan. Cuando el Registro Civil, el SRI, la ANT o la
            Función Judicial no responden, la consulta falla aunque nuestro servicio esté en pie.
          </p>
        </section>
      </main>

      <footer class="border-t border-[var(--border-color)] py-2xl flex flex-col sm:flex-row items-center justify-between gap-lg">
        <div class="flex flex-wrap gap-x-lg gap-y-0 justify-center">
          <RouterLink to="/guias" class="enlace-menor">Guías</RouterLink>
          <RouterLink to="/contacto" class="enlace-menor">Contacto</RouterLink>
          <RouterLink to="/terminos" class="enlace-menor">Términos</RouterLink>
          <RouterLink to="/privacidad" class="enlace-menor">Privacidad</RouterLink>
        </div>
        <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)]">Devzio · {{ anio }}</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { authService } from '../api/authService';
import { useDatosEstructurados, migas } from '../composables/useDatosEstructurados';
import MigasDePan from '../ui/components/MigasDePan.vue';
import FilaMetrica from '../ui/components/FilaMetrica.vue';
import EstadoVacio from '../ui/components/EstadoVacio.vue';

const router = useRouter();
const { isDark, toggleTheme } = useAuth();
const anio = new Date().getFullYear();

interface Metricas {
  disponibilidad: number;
  latencia: number;
  servidas: number;
}

const metricas = ref<Metricas | null>(null);

const metodologia = [
  {
    q: 'Disponibilidad',
    r: 'Porcentaje de peticiones que no terminaron en un error de servidor, sobre una ventana de siete días. Un fallo de la fuente oficial cuenta aparte.'
  },
  {
    q: 'Latencia típica',
    r: 'La mediana, no el promedio. El promedio se dispara con unas pocas consultas lentas y deja de describir lo que le pasa a la mayoría.'
  },
  {
    q: 'Consultas servidas',
    r: 'Solo las que devolvieron respuesta correcta. Las que fallaron no se cuentan aquí.'
  }
];

/*
 * El endpoint todavia no existe: es B-03 del plan. Si falla o no responde, la
 * pagina se queda en su estado vacio, que es lo honesto.
 */
onMounted(async () => {
  try {
    const datos = await authService.getEstadoServicio();
    if (datos && typeof datos.disponibilidad === 'number') metricas.value = datos;
  } catch {
    metricas.value = null;
  }
});

useDatosEstructurados(() => migas('/estado', 'Estado del servicio'));
</script>
