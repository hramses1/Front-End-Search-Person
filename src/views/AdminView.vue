<template>
  <div class="dashboard-wrapper font-primary min-h-screen flex overflow-hidden relative">
    <!-- Fondo Atmosférico -->
    <div class="absolute inset-0 pointer-events-none noise-overlay z-0"></div>

    <!-- Botón Hamburguesa para Móvil -->
    <button 
      @click="isSidebarOpen = !isSidebarOpen"
      class="lg:hidden fixed top-4 right-4 z-50 p-3 bg-obsidian-soft border border-white/10 rounded-xl text-pale-blue shadow-lg pointer-events-auto"
      style="background-color: var(--glass-bg); border-color: var(--border-color); color: var(--accent-color);"
    >
      <svg v-if="!isSidebarOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
    
    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-40 w-72 transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col h-screen bg-obsidian-soft border-r',
        isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      ]"
      style="border-color: var(--border-color);"
    >
      <!-- Overlay para cerrar sidebar en móvil -->
      <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm -z-10"></div>

      <div class="p-8 border-b" style="border-color: var(--border-color);">
        <h2 class="text-xl tracking-[0.25em] font-light mb-1" style="color: var(--text-primary);">PORTAL<span style="color: var(--accent-color);" class="font-bold">ADMIN</span></h2>
        <p class="text-[9px] uppercase tracking-[0.3em] opacity-70" style="color: var(--text-secondary);">Gestión de Usuarios</p>
      </div>

      <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <nav class="space-y-1">
          <button 
            @click="router.push('/dashboard')"
            class="w-full text-left px-5 py-3 rounded-xl text-[11px] tracking-[0.1em] transition-all duration-300 border border-transparent hover:bg-white/5"
            style="color: var(--text-secondary);"
          >
            VOLVER AL PANEL
          </button>
        </nav>
      </div>

      <div class="p-6 border-t" style="border-color: var(--border-color);">
        <button 
          @click="handleLogout"
          class="w-full py-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl text-red-500 text-[10px] tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2"
        >
          DESCONECTAR
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen relative z-10 p-6 sm:p-10 overflow-y-auto custom-scrollbar">
      <header class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 class="text-3xl font-light tracking-[0.1em]" style="color: var(--text-primary);">PANEL DE ADMINISTRACIÓN</h1>
          <p class="text-sm mt-2 font-light tracking-wide" style="color: var(--text-secondary);">Control total de usuarios, planes y límites del sistema.</p>
        </div>
        
        <!-- User Profile -->
        <div class="flex items-center gap-4 bg-white/[0.03] backdrop-blur-md border border-white/5 py-2 px-4 rounded-2xl shadow-lg">
          <div class="flex flex-col text-right">
            <span class="text-[11px] text-silver font-medium tracking-widest uppercase" style="color: var(--text-primary);">{{ userName }}</span>
            <span class="text-[8px] text-pale-blue/40 tracking-[0.2em] uppercase" style="color: var(--text-secondary);">ADMINISTRADOR</span>
          </div>
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-pale-blue/20 to-pale-blue/5 border border-white/10 flex items-center justify-center text-pale-blue text-[11px] font-bold shadow-inner" style="background-color: var(--accent-color); color: #ffffff;">
            {{ userName.substring(0, 2).toUpperCase() }}
          </div>
        </div>
      </header>

      <!-- Users Table -->
      <div class="border rounded-2xl shadow-negative overflow-hidden" style="background-color: var(--surface-color); border-color: var(--border-color);">
        <div class="px-6 py-4 border-b flex justify-between items-center" style="border-color: var(--border-color);">
          <h3 class="text-[10px] tracking-[0.3em]" style="color: var(--accent-color);">LISTADO DE USUARIOS ACTIVOS</h3>
          <button @click="fetchUsers" class="text-[9px] tracking-[0.2em] uppercase hover:opacity-80 transition-opacity" style="color: var(--text-secondary);">Refrescar</button>
        </div>

        <div class="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar pb-6">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b" style="border-color: var(--border-color); background-color: rgba(0,0,0,0.02);">
                <th class="px-6 py-4 text-[9px] uppercase tracking-[0.2em]" style="color: var(--text-secondary);">Usuario</th>
                <th class="px-6 py-4 text-[9px] uppercase tracking-[0.2em]" style="color: var(--text-secondary);">Plan Actual</th>
                <th class="px-6 py-4 text-[9px] uppercase tracking-[0.2em]" style="color: var(--text-secondary);">Peticiones</th>
                <th class="px-6 py-4 text-[9px] uppercase tracking-[0.2em]" style="color: var(--text-secondary);">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y" style="border-color: var(--border-color);">
              <tr v-for="userItem in users" :key="userItem.userId" class="hover:bg-white/[0.01] transition-colors">
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="text-[12px] font-medium" style="color: var(--text-primary);">{{ userItem.userName }}</span>
                    <span class="text-[10px] opacity-50" style="color: var(--text-secondary);">ID: {{ userItem.userId }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-block whitespace-nowrap text-[10px] px-3 py-1 rounded-full border border-current font-mono tracking-widest" :style="{ color: userItem.planDescription.includes('ADMIN') ? 'var(--accent-color)' : 'var(--text-secondary)' }">
                    {{ userItem.planDescription }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-[11px] font-mono" style="color: var(--text-primary);">{{ userItem.token_duration }}</span>
                </td>
                <td class="px-6 py-4">
                  <button 
                    @click="openEditModal(userItem)"
                    class="px-4 py-1.5 rounded-lg text-[10px] tracking-[0.1em] border border-current hover:bg-current hover:text-white transition-all duration-300"
                    style="color: var(--accent-color);"
                  >
                    EDITAR PLAN
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Edit Modal -->
      <transition name="fade-slide">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div class="w-full max-w-md border rounded-3xl p-8 shadow-2xl relative" style="background-color: var(--bg-color); border-color: var(--border-color);">
            <h3 class="text-lg font-light tracking-[0.1em] mb-6" style="color: var(--text-primary);">EDITAR USUARIO</h3>
            
            <form @submit.prevent="saveUserChanges" class="space-y-6">
              <div class="space-y-1">
                <label class="text-[10px] uppercase tracking-[0.2em]" style="color: var(--text-secondary);">Plan ID</label>
                <input 
                  v-model="editForm.plan" 
                  type="text"
                  required
                  class="w-full bg-transparent border-b font-light outline-none pb-2 transition-all duration-300"
                  style="color: var(--text-primary); border-color: var(--input-border);"
                />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] uppercase tracking-[0.2em]" style="color: var(--text-secondary);">Número de Peticiones</label>
                <input 
                  v-model="editForm.number_requests" 
                  type="number"
                  required
                  class="w-full bg-transparent border-b font-light outline-none pb-2 transition-all duration-300"
                  style="color: var(--text-primary); border-color: var(--input-border);"
                />
              </div>

              <div class="flex gap-4 pt-4">
                <button 
                  type="button" 
                  @click="showModal = false"
                  class="flex-1 py-3 rounded-xl text-[10px] tracking-[0.2em] border"
                  style="border-color: var(--border-color); color: var(--text-secondary);"
                >
                  CANCELAR
                </button>
                <button 
                  type="submit" 
                  class="flex-1 py-3 rounded-xl text-[10px] tracking-[0.2em] text-white"
                  style="background-color: var(--accent-color);"
                  :disabled="isSaving"
                >
                  {{ isSaving ? 'GUARDANDO...' : 'GUARDAR' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { authService } from '../services/authService';

const router = useRouter();
const { logout, userName, isAdmin } = useAuth();

const isSidebarOpen = ref(false);
const users = ref<any[]>([]);
const isLoading = ref(false);
const showModal = ref(false);
const isSaving = ref(false);

const editForm = reactive({
  userId: '',
  plan: '',
  number_requests: 0
});

onMounted(() => {
  if (!isAdmin.value) {
    router.push('/dashboard');
    return;
  }
  fetchUsers();
});

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const data = await authService.getAllUsersPlans();
    users.value = data.items || [];
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleLogout = () => {
  logout();
  router.push('/auth');
};

const openEditModal = (userItem: any) => {
  editForm.userId = userItem.userId;
  editForm.plan = userItem.id; // En el response, id parece ser el plan ID
  editForm.number_requests = userItem.token_duration;
  showModal.value = true;
};

const saveUserChanges = async () => {
  isSaving.value = true;
  try {
    await authService.patchUser(editForm.userId, {
      plan: editForm.plan,
      number_requests: editForm.number_requests
    });
    showModal.value = false;
    fetchUsers();
  } catch (error) {
    alert('Error al actualizar usuario');
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.dashboard-wrapper { 
  min-height: 100vh;
  background-color: var(--bg-color); 
}

.bg-obsidian-soft { 
  background-color: var(--surface-color); 
  backdrop-filter: blur(16px); 
}

.shadow-negative { 
  box-shadow: 0 10px 30px var(--shadow-color);
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
