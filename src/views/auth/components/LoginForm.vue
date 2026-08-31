<template>
  <form @submit.prevent="handleSubmit" class="space-y-7">
    <div class="relative group input-container mask-reveal delay-300">
      <input 
        v-model="loginForm.identity" 
        type="text" 
        id="identity"
        required
        class="w-full bg-transparent border-b-[0.5px] font-light outline-none pb-sm transition-all duration-base peer custom-input placeholder-transparent"
        style="color: var(--text-primary); border-color: var(--input-border); caret-color: var(--accent-color);"
        placeholder="USUARIO O EMAIL"
      />
      <label 
        for="identity" 
        class="absolute left-0 top-0 text-caption tracking-[0.14em] transition-all duration-base peer-focus:-translate-y-5 peer-focus:text-caption peer-focus:opacity-100 text-[var(--text-secondary)] peer-valid:-translate-y-5 peer-valid:text-caption"
        style="color: var(--text-secondary);"
      >
        USUARIO O EMAIL
      </label>
      <div class="absolute bottom-0 left-0 w-full h-[0.5px] scale-x-0 peer-focus:scale-x-100 transition-transform duration-base origin-center" style="background-color: var(--accent-color);"></div>
    </div>

    <div class="relative group input-container mask-reveal delay-400">
      <input 
        v-model="loginForm.password" 
        type="password" 
        id="login_password"
        required
        class="w-full bg-transparent border-b-[0.5px] font-light outline-none pb-sm transition-all duration-base peer custom-input placeholder-transparent"
        style="color: var(--text-primary); border-color: var(--input-border); caret-color: var(--accent-color);"
        placeholder="CONTRASEÑA"
      />
      <label 
        for="login_password" 
        class="absolute left-0 top-0 text-caption tracking-[0.14em] transition-all duration-base peer-focus:-translate-y-5 peer-focus:text-caption peer-focus:opacity-100 text-[var(--text-secondary)] peer-valid:-translate-y-5 peer-valid:text-caption"
        style="color: var(--text-secondary);"
      >
        CONTRASEÑA
      </label>
      <div class="absolute bottom-0 left-0 w-full h-[0.5px] scale-x-0 peer-focus:scale-x-100 transition-transform duration-base origin-center" style="background-color: var(--accent-color);"></div>
    </div>

    <div class="pt-sm mask-reveal delay-700">
      <button 
        type="submit" 
        class="w-full py-md border rounded-base text-body tracking-[0.14em] uppercase transition-all duration-base overflow-hidden relative group hover-smoke-glass"
        style="background-color: var(--glass-bg); border-color: var(--border-color); color: var(--text-primary);"
        :disabled="isLoading"
      >
        <div class="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <span class="relative z-10 font-medium flex items-center justify-center gap-md">
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
