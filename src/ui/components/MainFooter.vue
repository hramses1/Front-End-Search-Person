<template>
  <footer class="mt-auto pt-2 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 relative">
    <!-- Copyright & Legal -->
    <div class="flex items-center gap-4 order-2 sm:order-1">
      <div class="text-[10px] font-black opacity-60 tracking-widest uppercase">© 2026 Devzio. Todos los derechos reservados.</div>
      <div class="h-3 w-[1.5px] bg-[var(--border-color)] opacity-20"></div>
      <button @click="openModal('privacy')" class="text-[10px] font-black tracking-[0.2em] uppercase text-white bg-white/5 px-2 py-1 rounded hover:bg-[var(--accent-color)] transition-all">Privacy</button>
      <button @click="openModal('terms')" class="text-[10px] font-black tracking-[0.2em] uppercase text-white bg-white/5 px-2 py-1 rounded hover:bg-[var(--accent-color)] transition-all">Terms</button>
    </div>

    <!-- Actions (LinkedIn & Scroll) -->
    <div class="flex items-center gap-2 order-1 sm:order-2">
      <a 
        href="https://www.linkedin.com/in/hector-arismendi-469551167/" 
        target="_blank" 
        class="w-7 h-7 rounded-lg border border-[var(--border-color)] flex items-center justify-center opacity-40 hover:opacity-100 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all"
        title="LinkedIn"
      >
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
      </a>
      
      <button 
        @click="scrollToTop"
        class="w-7 h-7 rounded-lg border border-[var(--border-color)] flex items-center justify-center opacity-40 hover:opacity-100 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all group"
        title="Volver Arriba"
      >
        <svg class="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
      </button>
    </div>

    <!-- Modales Legales -->
    <Teleport to="body">
        <transition name="fade">
            <div v-if="activeModal" class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" @click="activeModal = null">
                <div class="w-full max-w-xl glass-card p-8 relative max-h-[80vh] overflow-y-auto custom-scrollbar animate-fade-in" @click.stop>
                    <button @click="activeModal = null" class="absolute top-6 right-6 opacity-30 hover:opacity-100 transition-opacity">✕</button>
                    
                    <div v-if="activeModal === 'privacy'" class="space-y-6">
                        <h2 class="text-xl font-black tracking-widest border-b border-[var(--border-color)] pb-4 uppercase">Política de Privacidad</h2>
                        <div class="text-xs leading-relaxed opacity-70 space-y-4 font-medium uppercase tracking-wider">
                            <p>En Devzio, la privacidad es fundamental. Este sistema actúa como un puente de consulta hacia fuentes de información pública.</p>
                            <ul class="list-disc pl-5 space-y-2">
                                <li>No almacenamos registros de consultas.</li>
                                <li>Datos personales protegidos bajo estándares de la industria.</li>
                                <li>Cifrado de extremo a extremo activo.</li>
                            </ul>
                        </div>
                    </div>

                    <div v-if="activeModal === 'terms'" class="space-y-6">
                        <h2 class="text-xl font-black tracking-widest border-b border-[var(--border-color)] pb-4 uppercase">Términos de Servicio</h2>
                        <div class="text-xs leading-relaxed opacity-70 space-y-4 font-medium uppercase tracking-wider">
                            <p>Al utilizar este portal, usted acepta:</p>
                            <ul class="list-disc pl-5 space-y-2">
                                <li>Uso estrictamente informativo y legal.</li>
                                <li>Prohibido el scraping automatizado masivo.</li>
                                <li>Responsabilidad de datos limitada a fuentes oficiales.</li>
                                <li>El abuso resultará en suspensión de acceso.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeModal = ref<null | 'privacy' | 'terms'>(null);
const openModal = (type: 'privacy' | 'terms') => { activeModal.value = type; };

const scrollToTop = () => {
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>
