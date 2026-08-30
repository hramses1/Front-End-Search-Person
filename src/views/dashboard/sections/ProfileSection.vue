<template>
  <div class="space-y-10 animate-fade-in">
    <!-- GESTIÓN DE PERFIL -->
    <div class="glass-card p-8 bg-[var(--surface-color)]">
      <div class="flex items-center gap-3 mb-8 pb-4 border-b border-[var(--border-color)]">
        <div class="w-10 h-10 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>
        <div>
          <h3 class="text-[10px] font-bold uppercase tracking-[0.25em] opacity-40 leading-none">Mi Cuenta</h3>
          <p class="text-[11px] font-semibold text-[var(--accent-color)] mt-1 uppercase tracking-widest">Ajustes de Perfil</p>
        </div>
      </div>
      
      <div class="max-w-md">
          <form @submit.prevent="updateProfile" class="space-y-8">
              <div class="relative group input-container">
                  <input 
                    v-model="newUserName" 
                    type="text" 
                    id="new_user" 
                    placeholder=" " 
                    class="custom-input peer" 
                  />
                  <label for="new_user">Nombre de Usuario Público</label>
                  <div class="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--accent-color)] transition-all duration-500 group-focus-within:w-full"></div>
              </div>
              
              <button 
                type="submit" 
                :disabled="isLoading" 
                class="btn-primary w-full py-4 text-[10px] tracking-[0.2em]"
              >
                  {{ isLoading ? 'PROCESANDO...' : 'ACTUALIZAR INFORMACIÓN' }}
              </button>
              
              <transition name="slide-up">
                <p v-if="msg" :class="isError ? 'text-red-500' : 'text-[var(--accent-color)]'" class="text-[9px] font-bold tracking-[0.2em] text-center uppercase">
                  {{ isError ? '⚠' : '✓' }} {{ msg }}
                </p>
              </transition>
          </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../../../composables/useAuth';
import { authService } from '../../../api/authService';

const { userId, userName, updateUserName } = useAuth();
const newUserName = ref(userName.value);
const isLoading = ref(false);
const msg = ref('');
const isError = ref(false);

const updateProfile = async () => {
    const cleanName = newUserName.value.trim();
    if (!cleanName || cleanName.length < 3) {
        msg.value = 'Nombre demasiado corto';
        isError.value = true;
        return;
    }
    isLoading.value = true;
    msg.value = '';
    try {
        await authService.updateUser(userId.value, { username: cleanName });
        updateUserName(cleanName);
        msg.value = 'Perfil actualizado con éxito';
        isError.value = false;
    } catch (e: any) {
        msg.value = 'Error al actualizar';
        isError.value = true;
    } finally {
        isLoading.value = false;
    }
};
</script>
