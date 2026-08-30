<template>
  <div class="relative inline-block" ref="anchorRef">
    <button 
      @click="toggle"
      class="flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-amber-500 text-[10px] sm:text-[11px] font-bold tracking-widest hover:bg-amber-500/10 transition-all active:scale-95 shadow-lg shadow-amber-500/5"
    >
      <span class="animate-bounce">☕</span>
      <span class="hidden xs:inline">DONACIÓN</span>
      <span class="xs:hidden">DONAR</span>
    </button>

    <Teleport to="body">
      <!-- Overlay para móvil -->
      <transition name="fade">
        <div v-if="isOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" @click="close"></div>
      </transition>

      <transition 
        enter-active-class="transition duration-300 ease-out" 
        enter-from-class="transform scale-95 opacity-0 translate-y-4 sm:translate-y-0" 
        enter-to-class="transform scale-100 opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100 translate-y-0"
        leave-to-class="transform scale-95 opacity-0 translate-y-4 sm:translate-y-0"
      >
        <div 
          v-if="isOpen" 
          class="fixed z-[9999] w-[90%] max-w-[340px] sm:w-80 p-6 sm:p-7 rounded-3xl border shadow-2xl overflow-hidden bg-[var(--surface-color)] border-[var(--border-color)]"
          :style="isMobile ? mobileStyle : desktopStyle"
        >
          <div class="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>
          
          <div class="flex justify-between items-center mb-6">
            <div class="flex flex-col">
                <span class="text-[9px] font-black text-amber-500 tracking-[0.2em] uppercase">Apoyo Voluntario</span>
                <span class="text-[11px] font-bold uppercase">Invítame un café</span>
            </div>
            <button @click="close" class="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="3"></path></svg>
            </button>
          </div>
<div class="flex flex-col items-center gap-6">
  <!-- QR con efecto de empuje (Push layout) -->
  <div 
      @click="isQrZoomed = !isQrZoomed"
      :class="['p-4 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]', 
      isQrZoomed ? 'scale-110 sm:scale-125 z-50 mb-10 sm:mb-14 shadow-2xl' : 'hover:scale-105 active:scale-95 mb-0']"
  >
      <img src="/Cafecito-qrcode.png" alt="QR" class="w-full h-auto object-contain max-w-[140px] sm:max-w-[160px]" />
      <p v-if="!isQrZoomed" class="text-[8px] font-black text-center mt-2 opacity-20 uppercase tracking-tighter">Clic para ampliar</p>
  </div>

  <!-- El contenido de abajo se desplazará automáticamente por el margen del QR -->
  <div class="w-full space-y-4 transition-all duration-500">
      <form action="https://www.paypal.com/ncp/payment/4M6VX3YHV39U4" method="post" target="_blank">
        <button 
          type="submit" 
          class="w-full py-4 bg-[#FFD140] hover:bg-[#ffc400] text-black font-extrabold text-[11px] tracking-[0.1em] rounded-xl shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 uppercase"
        >
          Paypal Secure
        </button>
      </form>

      <div class="flex flex-col items-center gap-2 opacity-80">
          <img src="/paypal-cards.svg" alt="cards" class="h-4" />
          <p class="text-[9px] text-center font-bold opacity-40 uppercase tracking-tighter">
            100% Protegido
          </p>
      </div>
  </div>
</div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';

const isOpen = ref(false);
const isQrZoomed = ref(false);
const isMobile = ref(false);
const anchorRef = ref<HTMLElement | null>(null);
const desktopStyle = reactive({ top: '0px', left: '0px' });
const mobileStyle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

const checkMobile = () => {
    isMobile.value = window.innerWidth < 640;
};

const toggle = () => {
  checkMobile();
  if (!isOpen.value) updatePosition();
  isOpen.value = !isOpen.value;
  isQrZoomed.value = false;
};

const close = () => {
    isOpen.value = false;
    isQrZoomed.value = false;
};

const updatePosition = () => {
  if (anchorRef.value && !isMobile.value) {
    const rect = anchorRef.value.getBoundingClientRect();
    desktopStyle.top = `${rect.bottom + 12}px`;
    desktopStyle.left = `${rect.right - 320}px`;
  }
};

onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('resize', updatePosition);
});
onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
    window.removeEventListener('resize', updatePosition);
});
</script>
