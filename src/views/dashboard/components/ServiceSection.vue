<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Ajustado: altura máxima en pantallas grandes para scroll interno -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch lg:max-h-[85vh]">
      
      <!-- FORMULARIO DE CONSULTA (Sidebar) -->
      <div class="lg:col-span-5 xl:col-span-4 glass-panel p-8 flex flex-col overflow-hidden">
        <div class="flex items-center gap-4 mb-10 pb-4 border-b border-[var(--border-color)] flex-shrink-0">
          <div class="w-10 h-10 rounded-2xl bg-[var(--accent-color)] text-[var(--accent-inverse)] flex items-center justify-center shadow-lg shadow-[var(--accent-color)]/10">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <div>
            <h3 class="text-[10px] font-medium uppercase tracking-[0.25em] opacity-40 leading-none">Módulo de</h3>
            <p class="text-[11px] font-semibold tracking-widest text-[var(--accent-color)] mt-1 uppercase">Consulta Oficial</p>
          </div>
        </div>

        <!-- Scroll interno para filtros si son muy largos -->
        <form @submit.prevent="handleSearch" class="space-y-6 flex-grow flex flex-col overflow-hidden">
          <div class="flex-grow space-y-6 overflow-y-auto custom-scrollbar pr-2 mb-6">
            <slot name="fields"></slot>
            <slot name="filters"></slot>
          </div>

          <button 
            type="submit" 
            class="w-full btn-primary flex justify-center items-center gap-4 py-4 flex-shrink-0"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="w-4 h-4 border-[1.5px] border-current border-t-transparent rounded-full animate-spin"></span>
            <span v-else class="text-sm">⚡</span>
            {{ isLoading ? 'PROCESANDO...' : 'EJECUTAR CONSULTA' }}
          </button>
        </form>

        <transition name="slide-up">
          <div v-if="errorMsg" class="mt-6 p-6 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 animate-fade-in flex-shrink-0">
            <h4 class="text-[9px] font-bold mb-2 uppercase tracking-widest">Aviso del Sistema</h4>
            <p class="text-[11px] font-medium leading-relaxed opacity-80">{{ errorMsg }}</p>
          </div>
        </transition>
      </div>

      <!-- PANEL DE RESULTADOS -->
      <div class="lg:col-span-7 xl:col-span-8 flex flex-col overflow-hidden">
        <transition name="fade" mode="out-in">
          <!-- LOADING STATE -->
          <SkeletonResult v-if="isLoading" class="h-full" />

          <!-- RESULTS STATE -->
          <div v-else-if="results" class="glass-card overflow-hidden h-full flex flex-col">
            <div class="px-10 py-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--surface-color)]/30 backdrop-blur-sm flex-shrink-0">
              <div class="flex items-center gap-4">
                <span class="flex h-2 w-2 relative">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <h3 class="text-[10px] font-medium tracking-[0.3em] uppercase opacity-50">Registros Encontrados</h3>
              </div>
              <button 
                @click="copyResults" 
                class="px-5 py-2.5 rounded-xl text-[9px] font-medium tracking-[0.15em] border border-[var(--border-color)] hover:bg-[var(--accent-color)] hover:text-[var(--accent-inverse)] transition-all duration-500 uppercase"
              >
                {{ copied ? 'COPIADO' : 'Exportar JSON' }}
              </button>
            </div>
            
            <!-- Contenedor scrollable que ocupa el alto restante -->
            <div class="p-10 flex-grow overflow-y-auto custom-scrollbar">
              <slot name="results" :data="results"></slot>
            </div>
          </div>

          <!-- EMPTY STATE -->
          <div v-else class="h-full min-h-[500px] flex flex-col items-center justify-center glass-card border-dashed">
            <div class="w-24 h-24 rounded-full bg-[var(--accent-color)]/5 flex items-center justify-center mb-6">
                <svg class="w-10 h-10 text-[var(--accent-color)] opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <p class="text-[11px] font-bold tracking-[0.3em] uppercase opacity-30 text-center px-10">
                Sistema listo para recibir consultas oficiales
            </p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SkeletonResult from '../../../components/SkeletonResult.vue';

defineProps<{
  isLoading: boolean;
  errorMsg: string;
  results: any;
}>();

const emit = defineEmits(['search', 'copy']);
const copied = ref(false);

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
