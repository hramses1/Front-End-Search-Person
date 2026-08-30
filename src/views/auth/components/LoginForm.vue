<template>
  <form @submit.prevent="handleSubmit" class="space-y-7">
    <div class="relative group input-container mask-reveal delay-300">
      <input 
        v-model="loginForm.identity" 
        type="text" 
        id="identity"
        required
        class="w-full bg-transparent border-b-[0.5px] font-light outline-none pb-2 transition-all duration-300 peer custom-input placeholder-transparent"
        style="color: var(--text-primary); border-color: var(--input-border); caret-color: var(--accent-color);"
        placeholder="USUARIO O EMAIL"
      />
      <label 
        for="identity" 
        class="absolute left-0 top-0 text-xs tracking-[0.2em] transition-all duration-300 peer-focus:-translate-y-5 peer-focus:text-[10px] peer-focus:opacity-100 opacity-50 peer-valid:-translate-y-5 peer-valid:text-[10px]"
        style="color: var(--text-secondary);"
      >
        USUARIO O EMAIL
      </label>
      <div class="absolute bottom-0 left-0 w-full h-[0.5px] scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-center" style="background-color: var(--accent-color);"></div>
    </div>

    <div class="relative group input-container mask-reveal delay-400">
      <input 
        v-model="loginForm.password" 
        type="password" 
        id="login_password"
        required
        class="w-full bg-transparent border-b-[0.5px] font-light outline-none pb-2 transition-all duration-300 peer custom-input placeholder-transparent"
        style="color: var(--text-primary); border-color: var(--input-border); caret-color: var(--accent-color);"
        placeholder="CONTRASEÑA"
      />
      <label 
        for="login_password" 
        class="absolute left-0 top-0 text-xs tracking-[0.2em] transition-all duration-300 peer-focus:-translate-y-5 peer-focus:text-[10px] peer-focus:opacity-100 opacity-50 peer-valid:-translate-y-5 peer-valid:text-[10px]"
        style="color: var(--text-secondary);"
      >
        CONTRASEÑA
      </label>
      <div class="absolute bottom-0 left-0 w-full h-[0.5px] scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-center" style="background-color: var(--accent-color);"></div>
    </div>

    <div class="pt-2 mask-reveal delay-700">
      <button 
        type="submit" 
        class="w-full py-4 border rounded-xl text-[11px] tracking-[0.3em] uppercase transition-all duration-500 overflow-hidden relative group hover-smoke-glass"
        style="background-color: var(--glass-bg); border-color: var(--border-color); color: var(--text-primary);"
        :disabled="isLoading"
      >
        <div class="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <span class="relative z-10 font-medium flex items-center justify-center gap-3">
          <span v-if="isLoading" class="w-3 h-3 border border-t-transparent border-current rounded-full animate-spin"></span>
          {{ isLoading ? 'PROCESANDO...' : 'ACCEDER AL SISTEMA SEGURO' }}
        </span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

defineProps<{ isLoading: boolean }>();
const emit = defineEmits(['login']);

const loginForm = reactive({
  identity: '',
  password: ''
});

const handleSubmit = () => {
  emit('login', { ...loginForm });
};
</script>
