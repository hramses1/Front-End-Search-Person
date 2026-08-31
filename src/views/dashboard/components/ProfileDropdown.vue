<template>
  <div class="relative inline-block" ref="anchorRef">
    <!-- Trigger -->
    <div 
        @click="toggle" 
        class="flex items-center gap-sm sm:gap-md cursor-pointer glass-panel py-sm sm:py-sm px-md sm:px-md rounded-base hover:bg-white/5 transition-all group active:scale-95"
    >
        <div class="flex flex-col items-end hidden xs:flex">
            <span class="text-caption sm:text-body font-bold tracking-widest text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors uppercase truncate max-w-[100px]">{{ userName }}</span>
            <span class="text-caption sm:text-caption font-black tracking-widest text-[var(--text-muted)]">SYSTEM</span>
        </div>
        <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-base bg-gradient-to-br from-[var(--accent-color)] to-violet-400 flex items-center justify-center text-caption sm:text-body font-black text-white shadow-lg shadow-[var(--accent-color)]/20 rotate-3 group-hover:rotate-0 transition-transform">
            {{ userName.substring(0, 2).toUpperCase() }}
        </div>
    </div>

    <!-- Panel Dropdown Adaptativo -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="isOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" @click="close"></div>
      </transition>

      <transition 
        enter-active-class="transition duration-200 ease-out" 
        enter-from-class="transform scale-95 opacity-0 translate-y-2 sm:translate-y-0" 
        enter-to-class="transform scale-100 opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100 translate-y-0"
        leave-to-class="transform scale-95 opacity-0 translate-y-2 sm:translate-y-0"
      >
        <div 
          v-if="isOpen" 
          class="fixed z-[9999] w-[85%] max-w-[280px] sm:w-64 p-sm rounded-base border shadow-2xl overflow-hidden bg-[var(--surface-color)] border-[var(--border-color)]"
          :style="isMobile ? mobileStyle : desktopStyle"
        >
          <div class="p-md border-b border-[var(--border-color)]/50 mb-xs">
              <p class="text-caption font-black text-[var(--text-muted)] uppercase tracking-widest">Cuenta Activa</p>
              <p class="text-caption font-bold truncate">{{ userName }}</p>
          </div>

          <button @click="goToProfile" class="w-full flex items-center gap-md px-md py-md rounded-base hover:bg-[var(--accent-color)]/10 hover:text-[var(--accent-color)] transition-all text-left">
            <svg class="w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <span class="text-caption font-bold uppercase tracking-wider">Ajustes</span>
          </button>

          <button @click="logoutAction" class="w-full flex items-center gap-md px-md py-md rounded-base hover:bg-red-500/10 hover:text-red-500 transition-all text-left">
            <svg class="w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span class="text-caption font-bold uppercase tracking-wider">Salir</span>
          </button>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useAuth } from '../../../composables/useAuth';

const { userName } = useAuth();
const isOpen = ref(false);
const isMobile = ref(false);
const anchorRef = ref<HTMLElement | null>(null);
const desktopStyle = reactive({ top: '0px', left: '0px' });
const mobileStyle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

const checkMobile = () => isMobile.value = window.innerWidth < 640;

const toggle = () => {
  checkMobile();
  if (!isOpen.value) updatePosition();
  isOpen.value = !isOpen.value;
};

const close = () => isOpen.value = false;

const updatePosition = () => {
  if (anchorRef.value && !isMobile.value) {
    const rect = anchorRef.value.getBoundingClientRect();
    desktopStyle.top = `${rect.bottom + 8}px`;
    desktopStyle.left = `${rect.right - 256}px`;
  }
};

const emit = defineEmits(['update:section', 'logout']);
const goToProfile = () => { emit('update:section', 'profile'); close(); };
const logoutAction = () => { emit('logout'); close(); };

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
