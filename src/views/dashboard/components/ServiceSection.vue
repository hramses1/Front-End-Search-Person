<template>
  <div class="space-y-xl animate-fade-in">
    <!--
      Sin tope de altura: antes el grid iba limitado a 85vh y los resultados
      scrolleaban dentro de su propia caja, asi que por muchos que hubiera
      nunca empujaban la pagina y el pie se quedaba clavado bajo el bloque.
      Ahora los resultados fluyen y el formulario queda fijo en su sitio.
    -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
      
      <!-- FORMULARIO DE CONSULTA (Sidebar) -->
      <div class="lg:col-span-5 xl:col-span-4 glass-panel p-lg sm:p-xl flex flex-col overflow-hidden lg:sticky lg:top-0 lg:max-h-[85vh]">
        <div class="flex items-center gap-md mb-2xl pb-md border-b border-[var(--border-color)] flex-shrink-0">
          <div class="w-10 h-10 rounded-base bg-[var(--accent-color)] text-[var(--accent-inverse)] flex items-center justify-center shadow-lg shadow-[var(--accent-color)]/10">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <div>
            <h3 class="text-overline font-medium uppercase tracking-[0.14em] text-[var(--text-muted)] leading-none">Módulo de</h3>
            <p class="text-body font-semibold tracking-[0.14em] text-[var(--accent-color)] mt-xs uppercase">Consulta Oficial</p>
          </div>
        </div>

        <!-- Scroll interno para filtros si son muy largos -->
        <form @submit.prevent="handleSearch" class="space-y-lg flex-grow flex flex-col overflow-hidden">
          <div class="flex-grow space-y-lg overflow-y-auto custom-scrollbar pr-sm mb-lg">
            <slot name="fields"></slot>
            <slot name="filters"></slot>
          </div>

          <button 
            type="submit" 
            class="w-full btn-primary flex justify-center items-center gap-md py-md flex-shrink-0"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="w-4 h-4 border-[1.5px] border-current border-t-transparent rounded-full animate-spin"></span>
            <span v-else class="text-body">⚡</span>
            {{ isLoading ? 'Consultando…' : 'Ejecutar consulta' }}
          </button>
        </form>

        <transition name="slide-up">
          <div v-if="errorMsg" class="mt-lg p-lg rounded-base border border-red-500/20 bg-red-500/5 text-red-500 animate-fade-in flex-shrink-0">
            <h4 class="text-caption font-bold mb-sm uppercase tracking-[0.14em]">Aviso del Sistema</h4>
            <p class="text-body font-medium leading-relaxed opacity-80">{{ errorMsg }}</p>
          </div>
        </transition>
      </div>

      <!-- PANEL DE RESULTADOS -->
      <div class="lg:col-span-7 xl:col-span-8 flex flex-col">
        <transition name="fade" mode="out-in">
          <!-- LOADING STATE -->
          <SkeletonResult v-if="isLoading" class="h-full" />

          <!-- RESULTS STATE -->
          <div v-else-if="results" class="glass-card overflow-hidden flex flex-col">
            <div class="px-lg sm:px-2xl py-md sm:py-lg border-b border-[var(--border-color)] flex flex-wrap gap-sm justify-between items-center bg-[var(--surface-color)]/80 backdrop-blur-sm flex-shrink-0 sticky top-0 z-10">
              <div class="flex items-center gap-md">
                <span class="flex h-2 w-2 relative">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <div class="min-w-0">
                  <h3 class="text-overline font-medium tracking-[0.14em] uppercase text-[var(--text-secondary)] leading-none">Registros encontrados</h3>
                  <!--
                    Fuente y tiempo real. Decir de donde sale el dato y cuanto
                    tardo transmite solvencia, y ademas deja claro que la
                    consulta va contra el organismo, no contra una copia nuestra.
                  -->
                  <p v-if="fuente || duracion" class="text-caption text-[var(--text-muted)] mt-xs leading-none">
                    <span v-if="fuente">{{ fuente }}</span>
                    <span v-if="fuente && duracion" aria-hidden="true"> · </span>
                    <span v-if="duracion">Respuesta en {{ duracion }}</span>
                  </p>
                </div>
              </div>
              <button 
                @click="copyResults" 
                class="inline-flex items-center px-lg min-h-[2.75rem] rounded-base text-caption font-medium border border-[var(--border-color)] hover:bg-[var(--accent-color)] hover:text-[var(--accent-inverse)] transition-all duration-base"
              >
                {{ copied ? 'Copiado' : 'Exportar JSON' }}
              </button>
            </div>
            
            <!-- Sin scroll propio: la pagina entera es la que se desplaza -->
            <div class="p-lg sm:p-2xl">
              <slot name="results" :data="results"></slot>
            </div>
          </div>

          <!-- EMPTY STATE -->
          <div v-else class="min-h-[320px] sm:min-h-[500px] flex flex-col items-center justify-center glass-card border-dashed p-lg">
            <div class="w-24 h-24 rounded-full bg-[var(--accent-color)]/5 flex items-center justify-center mb-lg">
                <svg class="w-10 h-10 text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <p class="text-body font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] text-center">
                Sistema listo para recibir consultas oficiales
            </p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import SkeletonResult from '../../../components/SkeletonResult.vue';

const props = defineProps<{
  isLoading: boolean;
  errorMsg: string;
  results: any;
  /** Organismo del que sale el dato. Se muestra junto al resultado. */
  fuente?: string;
}>();

const emit = defineEmits(['search', 'copy']);
const copied = ref(false);

/*
 * Tiempo de respuesta. Se cronometra aqui, en el componente que ya conoce el
 * ciclo de la consulta, en vez de pedirselo a cada seccion: son ocho y todas
 * lo harian distinto.
 */
const inicio = ref(0);
const duracion = ref('');

watch(() => props.isLoading, (cargando, antes) => {
  if (cargando) {
    inicio.value = performance.now();
    duracion.value = '';
  } else if (antes && inicio.value) {
    const s = (performance.now() - inicio.value) / 1000;
    // Menos de una decima se lee raro; a partir de ahi, una decimal basta.
    duracion.value = s < 0.1 ? 'menos de 0,1 s' : `${s.toFixed(1).replace('.', ',')} s`;
  }
});

const handleSearch = () => emit('search');

const copyResults = () => {
  emit('copy');
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
