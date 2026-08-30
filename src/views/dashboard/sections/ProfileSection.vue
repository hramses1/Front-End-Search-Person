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

    <!-- CERTIFICACIONES Y APTITUDES IA -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Bloque Certificación PMI -->
      <div class="glass-panel p-8 space-y-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-500">
        <div>
          <div class="flex items-center gap-3 mb-6 opacity-60">
            <svg class="w-4 h-4 text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
            <span class="text-[9px] font-bold tracking-[0.2em] uppercase">Certificación Oficial</span>
          </div>
          <h4 class="text-lg font-light leading-tight text-[var(--text-primary)] mb-2">Fundamentos de la Inteligencia Artificial Generativa</h4>
          <p class="text-[11px] text-[var(--text-secondary)] font-medium mb-6">Project Management Institute (PMI)</p>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between text-[10px] tracking-wide">
              <span class="opacity-40 uppercase">Expedición</span>
              <span class="font-bold text-[var(--accent-color)]">ABR. 2026</span>
            </div>
            <div class="flex flex-col gap-1 text-[10px]">
              <span class="text-[8px] opacity-40 uppercase tracking-tighter">ID de Credencial</span>
              <span class="font-mono break-all opacity-70 leading-relaxed text-[var(--accent-color)]">ff2db8e9bcd014b4fcb38572f5c1134e870162acb05da0c1bcc61a6a77f9b743</span>
            </div>
          </div>
        </div>
        
        <div class="pt-6 border-t border-[var(--border-color)]">
          <p class="text-[9px] leading-relaxed opacity-50 italic">
            LinkedIn Learning is a PMI Authorized Training Partner. Qualifies for Professional Development Units (PDUs).
          </p>
        </div>
      </div>

      <!-- Bloque IA y Prompt Engineering -->
      <div class="glass-panel p-8 space-y-8 shadow-sm hover:shadow-md transition-shadow duration-500">
        <div>
          <div class="flex items-center gap-3 mb-6 opacity-60">
            <svg class="w-4 h-4 text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            <span class="text-[9px] font-bold tracking-[0.2em] uppercase">Especialización IA</span>
          </div>
          
          <div class="space-y-6">
            <div>
              <p class="text-[10px] font-bold tracking-widest opacity-40 uppercase mb-3">Herramientas & Asistencia</p>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-[var(--accent-color)]/5 text-[var(--accent-color)] rounded-lg text-[10px] font-bold border border-[var(--accent-color)]/10 uppercase tracking-wider shadow-sm">Gemini CLI</span>
                <span class="px-3 py-1 bg-[var(--accent-color)]/5 text-[var(--accent-color)] rounded-lg text-[10px] font-bold border border-[var(--accent-color)]/10 uppercase tracking-wider shadow-sm">Claude Code</span>
              </div>
            </div>

            <div>
              <p class="text-[10px] font-bold tracking-widest opacity-40 uppercase mb-3">Prompt Engineering</p>
              <p class="text-[11px] leading-relaxed text-[var(--text-secondary)] font-medium">
                Integración de IA para optimización de flujos de trabajo. Creación de prompts detallados para automatización de tareas QA, generación de scripts, mock data y debugging avanzado en terminal.
              </p>
            </div>
            
            <div class="grid grid-cols-2 gap-4 pt-2">
              <div class="p-4 bg-[var(--bg-color)]/50 rounded-2xl border border-[var(--border-color)]">
                <p class="text-[8px] opacity-40 uppercase mb-1 font-bold">Enfoque</p>
                <p class="text-[10px] font-medium text-[var(--accent-color)]">Precisión QA</p>
              </div>
              <div class="p-4 bg-[var(--bg-color)]/50 rounded-2xl border border-[var(--border-color)]">
                <p class="text-[8px] opacity-40 uppercase mb-1 font-bold">Estrategia</p>
                <p class="text-[10px] font-medium text-[var(--accent-color)]">Automatización</p>
              </div>
            </div>
          </div>
        </div>
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
