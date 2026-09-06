<template>
  <div class="relative inline-block" ref="anchorRef">
    <button 
      type="button"
      :aria-expanded="isOpen"
      aria-haspopup="dialog"
      @click="toggle"
      class="control-encabezado bg-amber-500/5 border border-amber-500/20 text-amber-500 text-caption font-bold tracking-[0.14em] hover:bg-amber-500/10 transition-all active:scale-95 shadow-lg shadow-amber-500/5"
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
        enter-active-class="transition duration-base ease-out" 
        enter-from-class="transform scale-95 opacity-0 translate-y-4 sm:translate-y-0" 
        enter-to-class="transform scale-100 opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100 translate-y-0"
        leave-to-class="transform scale-95 opacity-0 translate-y-4 sm:translate-y-0"
      >
        <div 
          v-if="isOpen" 
          class="fixed z-[9999] w-[90%] max-w-[340px] sm:w-80 p-lg sm:p-7 rounded-base border shadow-2xl overflow-hidden bg-[var(--surface-color)] border-[var(--border-color)]"
          :style="isMobile ? mobileStyle : desktopStyle"
        >
          <div class="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>
          
          <div class="flex justify-between items-center mb-lg">
            <div class="flex flex-col">
                <span class="text-overline font-bold text-amber-500 tracking-[0.14em] uppercase">Apoyo</span>
                <span class="text-body font-bold uppercase">Invítame un café</span>
            </div>
            <button @click="close" class="p-sm rounded-base hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="3"></path></svg>
            </button>
          </div>
<div class="flex flex-col items-center gap-lg">
  <!-- QR con efecto de empuje (Push layout) -->
  <!--
    Es un control real, no un adorno: sin role ni tabindex solo respondia al
    raton y con el teclado no habia forma de ampliarlo.
  -->
  <div 
      role="button"
      tabindex="0"
      :aria-pressed="isQrZoomed"
      aria-label="Ampliar el código QR"
      @click="isQrZoomed = !isQrZoomed"
      @keydown.enter.prevent="isQrZoomed = !isQrZoomed"
      @keydown.space.prevent="isQrZoomed = !isQrZoomed"
      :class="['p-md bg-white rounded-base shadow-xl ring-1 ring-black/5 cursor-pointer transition-all duration-base ease-[cubic-bezier(0.34,1.56,0.64,1)]', isQrZoomed ? 'scale-110 sm:scale-125 z-50 mb-2xl sm:mb-14 shadow-2xl' : 'hover:scale-105 active:scale-95 mb-0']"
  >
      <!--
        WebP sin perdida: mismo QR pixel a pixel, 82% menos de peso. El PNG
        queda de respaldo para quien no lo soporte.

        width y height llevan las dimensiones reales (500x561). Antes decian
        160x160, una relacion que la imagen no tiene, asi que el hueco que
        reservaba el navegador no coincidia con el que acababa ocupando.
      -->
      <picture>
        <source srcset="/Cafecito-qrcode.webp" type="image/webp" />
        <img
          src="/Cafecito-qrcode.png"
          alt="Código QR para donar mediante Cafecito"
          width="500" height="561" loading="lazy" decoding="async"
          class="w-full h-auto object-contain max-w-[140px] sm:max-w-[160px]"
        />
      </picture>
      <p v-if="!isQrZoomed" class="text-caption font-black text-center mt-sm text-[var(--text-muted)] ">Clic para ampliar</p>
  </div>

  <!-- El contenido de abajo se desplazará automáticamente por el margen del QR -->
  <div class="w-full space-y-md transition-all duration-base">
      <form action="https://www.paypal.com/ncp/payment/4M6VX3YHV39U4" method="post" target="_blank">
        <button 
          type="submit" 
          class="w-full py-md bg-[#FFD140] hover:bg-[#ffc400] text-black font-extrabold text-body tracking-[0.1em] rounded-base shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-sm uppercase"
        >
          Paypal Secure
        </button>
      </form>

      <div class="flex flex-col items-center gap-sm opacity-80">
          <img src="/paypal-cards.svg" alt="Tarjetas aceptadas por PayPal" width="120" height="16" loading="lazy" decoding="async" class="h-4 w-auto" />
          <p class="text-caption text-center font-bold text-[var(--text-muted)] uppercase tracking-tighter">
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
import { ref, reactive, onMounted, onUnmounted } from 'vue';

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

/* Escape cierra el menu; si el QR esta ampliado, primero lo reduce. */
const alPulsarTecla = (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || !isOpen.value) return;
    if (isQrZoomed.value) isQrZoomed.value = false;
    else close();
};

onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('keydown', alPulsarTecla);
});
onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
    window.removeEventListener('resize', updatePosition);
    window.removeEventListener('keydown', alPulsarTecla);
});
</script>
