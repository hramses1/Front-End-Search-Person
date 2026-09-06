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
          Si la medicion no llega, la pagina lo dice en vez de inventarse un
          numero. Publicar una cifra falsa en una pagina cuyo proposito es la
          transparencia seria lo peor que podriamos hacer aqui.
        -->
        <section v-if="cargando" class="pb-2xl">
          <EstadoVacio class="glass-card border-dashed" titulo="Consultando la medición…" />
        </section>

        <section v-else-if="!metricas" class="pb-2xl">
          <EstadoVacio
            class="glass-card border-dashed"
            titulo="No pudimos leer la medición"
            detalle="Vuelve a intentarlo en unos minutos. Si el problema sigue, escríbenos."
            accion="Reintentar"
            @accion="cargar"
          />
        </section>

        <template v-else>
          <!--
            Dos disponibilidades separadas, no una media. Una caida del Registro
            Civil no es una caida nuestra, y juntarlas daria una cifra que no
            significa nada para quien la lee.
          -->
          <section class="pb-lg grid gap-md sm:grid-cols-2">
            <FilaMetrica
              etiqueta="Nuestro servicio"
              :valor="formatoPorcentaje(metricas.availability)"
              unidad="%"
              :estado="nivel(metricas.availability)"
              :detalle="`${metricas.our_failures} ${metricas.our_failures === 1 ? 'fallo' : 'fallos'} propios en ${metricas.window_days} días.`"
            />
            <FilaMetrica
              etiqueta="Fuentes oficiales"
              :valor="formatoPorcentaje(metricas.source_availability)"
              unidad="%"
              :estado="nivel(metricas.source_availability)"
              :detalle="`${metricas.source_failures} ${metricas.source_failures === 1 ? 'vez' : 'veces'} que la fuente no respondió.`"
            />
          </section>

          <section class="pb-2xl grid gap-md sm:grid-cols-3">
            <FilaMetrica
              etiqueta="Respuesta típica"
              :valor="metricas.latency_p50_ms"
              unidad="ms"
              detalle="Mediana: el tiempo de la consulta corriente."
            />
            <FilaMetrica
              etiqueta="Las más lentas"
              :valor="formatoLatencia(metricas.latency_p95_ms)"
              :unidad="metricas.latency_p95_ms >= 1000 ? 's' : 'ms'"
              detalle="Percentil 95. Una de cada veinte tarda esto o más."
            />
            <FilaMetrica
              etiqueta="Consultas servidas"
              :valor="metricas.total_queries.toLocaleString('es-EC')"
              :detalle="`Últimos ${metricas.window_days} días.`"
            />
          </section>
        </template>

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
import { authService, type EstadoServicio } from '../api/authService';
import { useDatosEstructurados, migas } from '../composables/useDatosEstructurados';
import MigasDePan from '../ui/components/MigasDePan.vue';
import FilaMetrica from '../ui/components/FilaMetrica.vue';
import EstadoVacio from '../ui/components/EstadoVacio.vue';

const router = useRouter();
const { isDark, toggleTheme } = useAuth();
const anio = new Date().getFullYear();

const metricas = ref<EstadoServicio | null>(null);
const cargando = ref(true);

/** Un entero se enseña sin decimales: "100 %" se lee mejor que "100,0 %". */
const formatoPorcentaje = (v: number) =>
  Number.isInteger(v) ? String(v) : v.toFixed(2).replace('.', ',');

/** Por encima del segundo, los milisegundos dejan de decir nada. */
const formatoLatencia = (ms: number) =>
  ms >= 1000 ? (ms / 1000).toFixed(1).replace('.', ',') : String(ms);

const nivel = (pct: number): 'bueno' | 'aviso' | 'malo' =>
  pct >= 99 ? 'bueno' : pct >= 95 ? 'aviso' : 'malo';

const metodologia = [
  {
    q: 'Por qué hay dos disponibilidades',
    r: 'Una mide nuestro servicio y la otra las fuentes oficiales. Son cosas distintas: si el Registro Civil no responde, la consulta falla aunque nuestra infraestructura esté en pie. Juntarlas en una sola cifra la volvería inútil.'
  },
  {
    q: 'Respuesta típica',
    r: 'La mediana, no el promedio. El promedio se dispara con unas pocas consultas lentas y deja de describir lo que le pasa a la mayoría.'
  },
  {
    q: 'Las más lentas',
    r: 'El percentil 95: una de cada veinte consultas tarda eso o más. Es la cifra que enseña el peor caso realista, no el caso bonito.'
  },
  {
    q: 'Consultas servidas',
    r: 'Todas las que se atendieron en la ventana, con éxito o sin él. Los fallos se detallan aparte, en cada disponibilidad.'
  }
];

const cargar = async () => {
  cargando.value = true;
  try {
    const datos = await authService.getEstadoServicio();
    // Se comprueba un campo concreto: una respuesta vacia o con otra forma no
    // debe pintarse como si fueran metricas.
    metricas.value = datos && typeof datos.availability === 'number' ? datos : null;
  } catch {
    metricas.value = null;
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);

useDatosEstructurados(() => migas('/estado', 'Estado del servicio'));
</script>
