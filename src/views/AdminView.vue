<template>
  <div class="dashboard-wrapper font-primary min-h-screen flex overflow-hidden relative selection:bg-[var(--accent-color)]/30">
    <!-- Capas Atmosféricas -->
    <div class="absolute inset-0 pointer-events-none noise-overlay z-0 opacity-20"></div>
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-color)]/5 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent-color)]/3 blur-[100px] rounded-full"></div>
    </div>

    <!-- Botón Hamburguesa Móvil -->
    <button 
      @click="isSidebarOpen = !isSidebarOpen"
      class="lg:hidden fixed top-4 right-4 z-50 p-3 glass-panel rounded-2xl text-[var(--accent-color)] shadow-xl active:scale-90 transition-transform"
    >
      <svg v-if="!isSidebarOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
    
    <!-- Overlay Móvil -->
    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"></div>
    </transition>
    
    <!-- Sidebar -->
    <aside 
      :class="['fixed inset-y-0 left-0 z-40 w-72 transition-all duration-500 lg:relative lg:translate-x-0 flex flex-col h-screen glass-panel', 
      isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0']"
    >
      <div class="p-6 border-b border-[var(--border-color)]">
        <h2 class="text-[13px] leading-tight tracking-[0.25em] font-light mb-1 uppercase" style="color: var(--text-primary);">
          Portal <br />
          <span class="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFDD00] via-[#0033A0] to-[#ED1C24]">
            ADMINISTRACIÓN
          </span>
        </h2>
        <div class="mt-2 flex gap-1">
            <div class="h-1 w-6 rounded-full bg-[#FFDD00]"></div>
            <div class="h-1 w-3 rounded-full bg-[#0033A0]"></div>
            <div class="h-1 w-2 rounded-full bg-[#ED1C24]"></div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <p class="text-[8px] font-bold tracking-[0.3em] mb-4 opacity-40 uppercase px-2">Navegación</p>
        <button 
          @click="router.push('/dashboard')"
          class="w-full flex items-center justify-between px-5 py-3 rounded-2xl text-[11px] font-bold tracking-widest text-[var(--text-secondary)] hover:bg-white/5 hover:translate-x-1 transition-all"
        >
          <span>← VOLVER AL PANEL</span>
        </button>
      </div>

      <div class="p-4 border-t border-[var(--border-color)] bg-black/10">
        <button @click="handleLogout" class="w-full py-2.5 text-red-400 hover:bg-red-500/5 text-[9px] font-bold tracking-[0.2em] rounded-xl border border-red-500/10 hover:border-red-500/20 transition-all uppercase mb-4">
          Cerrar Sesión Admin
        </button>

        <!-- Sellos de Seguridad -->
        <div class="mt-4 flex flex-wrap justify-center gap-3 text-[8px] uppercase tracking-widest opacity-40 font-mono text-[var(--text-secondary)]">
            <span class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-width="2.5"></path></svg>
                SSL
            </span>
            <span>·</span>
            <span class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-width="2.5"></path></svg>
                CIFRADO TLS
            </span>
            <span>·</span>
            <span class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke-width="2.5"></path></svg>
                DEVZIO © 2026
            </span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen relative z-10 p-6 sm:p-8 overflow-y-auto custom-scrollbar animate-fade-in">
      <header class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p class="text-[9px] font-black tracking-[0.3em] text-[var(--accent-color)] uppercase mb-1">Panel de Control</p>
          <h1 class="text-3xl font-light tracking-tight text-[var(--text-primary)] uppercase">Gestión de Usuarios</h1>
        </div>
        
        <div class="flex items-center gap-3">
            <div class="flex flex-col items-end">
                <span class="text-[11px] font-bold tracking-widest text-[var(--text-primary)]">{{ userName }}</span>
                <span class="text-[8px] font-black tracking-widest text-[var(--accent-color)] opacity-80">ADMINISTRADOR</span>
            </div>
            <div class="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-[11px] font-black text-white shadow-lg shadow-amber-500/20">
                {{ userName.substring(0, 2).toUpperCase() }}
            </div>
        </div>
      </header>

      <!-- Users Table -->
      <div class="flex-1">
          <div class="glass-card overflow-hidden">
            <div class="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--surface-color)]/50">
              <h3 class="text-[10px] font-black tracking-[0.2em] uppercase opacity-60">Usuarios del Sistema</h3>
              <button @click="fetchUsers" :disabled="isLoading" class="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase hover:text-[var(--accent-color)] transition-all disabled:opacity-40">
                <span v-if="isLoading" class="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin border-[var(--accent-color)]"></span>
                <span v-else>↻</span>
                Refrescar
              </button>
            </div>

            <p
              v-if="loadError"
              class="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-[10px] leading-relaxed tracking-wide text-amber-500"
            >
              {{ loadError }}
            </p>

            <div class="overflow-x-auto custom-scrollbar">
              <table class="w-full text-left border-collapse border-b border-[var(--border-color)]">
                <thead>
                  <tr class="border-b border-[var(--border-color)] bg-black/5">
                    <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest opacity-40">Usuario</th>
                    <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest opacity-40">Plan</th>
                    <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest opacity-40">Peticiones</th>
                    <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest opacity-40 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[var(--border-color)]">
                  <tr v-for="userItem in users" :key="userItem.userId" class="hover:bg-white/[0.02] transition-colors group">
                    <td class="px-6 py-4">
                      <div class="flex flex-col">
                        <span class="text-[12px] font-bold text-[var(--text-primary)]">{{ userItem.userName }}</span>
                        <span class="text-[9px] font-mono opacity-30 tracking-tighter">{{ userItem.userId }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-block text-[9px] font-black px-3 py-1 rounded-lg border border-[var(--border-color)] tracking-widest uppercase" :style="{ color: userItem.planDescription?.includes('ADMIN') ? 'var(--accent-color)' : 'var(--text-secondary)' }">
                        {{ userItem.planDescription || 'SIN PLAN' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="flex flex-col min-w-[60px]">
                            <span
                              class="text-[12px] font-black tabular-nums"
                              :style="{ color: userItem.consumoDesconocido ? 'var(--text-secondary)' : (!sinTope(userItem.limite) && (userItem.number_requests ?? 0) >= userItem.limite ? '#ef4444' : 'var(--text-primary)') }"
                              :title="userItem.consumoDesconocido ? 'No se pudo leer el consumo de este usuario' : ''"
                            >
                            {{ userItem.consumoDesconocido ? '—' : (userItem.number_requests ?? 0) }}
                            </span>
                            <span class="text-[8px] font-bold opacity-30 tracking-widest">{{ userItem.consumoDesconocido ? 'SIN DATO' : (sinTope(userItem.limite) ? 'SIN LÍMITE' : `/ ${userItem.limite}`) }}</span>
                        </div>
                        <div v-if="!sinTope(userItem.limite) && !userItem.consumoDesconocido" class="hidden sm:block flex-1 h-1 bg-black/20 rounded-full overflow-hidden max-w-[80px]">
                            <div class="h-full bg-[var(--accent-color)] opacity-50" :style="{ width: Math.min(((userItem.number_requests ?? 0) / userItem.limite * 100), 100) + '%' }"></div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex justify-end gap-2">
                        <button 
                          @click="openEditModal(userItem)"
                          class="px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all uppercase"
                        >
                          Editar
                        </button>
                        <button 
                          @click="resetRequests(userItem)"
                          :disabled="userItem.number_requests === 0 || isResetting === userItem.userId"
                          class="px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest border border-red-500/20 text-red-500/60 hover:text-red-500 hover:border-red-500/50 transition-all uppercase disabled:opacity-20"
                        >
                          <span v-if="isResetting === userItem.userId">...</span>
                          <span v-else>Reset</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      </div>

      <!-- Footer en Admin -->
      <MainFooter />

      <!-- Edit Modal -->
      <transition 
        enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0"
      >
        <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <div class="w-full max-w-md glass-card p-8 relative animate-fade-in shadow-2xl">
            <h3 class="text-xl font-bold tracking-tight mb-8 flex items-center gap-3">
                <span class="w-2 h-8 bg-[var(--accent-color)] rounded-full"></span>
                EDITAR USUARIO
            </h3>
            
            <form @submit.prevent="saveUserChanges" class="space-y-8">
              <div class="relative group input-container">
                <input v-model="editForm.userName" type="text" id="edit_username" placeholder=" " class="custom-input peer" required />
                <label for="edit_username">Nombre de Usuario (Ej: Juan_12)</label>
              </div>

              <div class="relative group input-container">
                <select v-model="editForm.plan" id="edit_plan" class="custom-input peer" required>
                  <option value="" disabled>Selecciona un plan</option>
                  <option v-for="pl in planes" :key="pl.id" :value="pl.id">
                    {{ pl.description }}{{ pl.daily_limit ? ` — ${pl.daily_limit}/día` : '' }}
                  </option>
                </select>
                <label for="edit_plan">Plan</label>
              </div>

              <div class="relative group input-container">
                <input v-model="editForm.number_requests" type="number" id="edit_requests" placeholder=" " class="custom-input peer" required min="0" />
                <label for="edit_requests">Peticiones Consumidas</label>
              </div>

              <p
                v-if="modalError"
                class="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-[10px] leading-relaxed tracking-wide text-red-400"
              >
                {{ modalError }}
              </p>

              <div class="flex gap-4 pt-4">
                <button 
                  type="button" 
                  @click="showModal = false"
                  class="flex-1 py-4 rounded-2xl text-[10px] font-black tracking-widest border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-white/5 transition-all uppercase"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  class="flex-1 py-4 btn-primary text-[10px] font-black tracking-widest uppercase"
                  :disabled="isSaving"
                >
                  {{ isSaving ? 'Guardando...' : 'Confirmar Cambios' }}
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
import { authService } from '../api/authService';
import MainFooter from '../ui/components/MainFooter.vue';

const router = useRouter();
const { logout, userName, isAdmin } = useAuth();

const isSidebarOpen = ref(false);
const users = ref<any[]>([]);
const isLoading = ref(false);
const showModal = ref(false);
const modalError = ref('');
const planes = ref<any[]>([]);
const isSaving = ref(false);
const isResetting = ref<string | null>(null);
const loadError = ref('');

// Los planes sin tope usan un limite centinela enorme; pintarlo literal daba
// "9 / 9999999999" con la barra al 0,00000009 %.
const LIMITE_SIN_TOPE = 1_000_000;
const sinTope = (limite?: number) => (limite ?? 0) >= LIMITE_SIN_TOPE;


const editForm = reactive({
  userId: '',
  userName: '',
  plan: '',
  number_requests: 0
});

onMounted(() => {
  if (!isAdmin.value) {
    router.push('/dashboard');
    return;
  }
  fetchUsers();
  fetchPlanes();
});

/**
 * Catalogo de planes para el desplegable de edicion.
 *
 * El listado de usuarios solo trae `planDescription`, no el id del plan, asi
 * que hace falta el catalogo para saber que valor enviar en el PATCH.
 */
const fetchPlanes = async () => {
  try {
    const data = await authService.getPlans();
    planes.value = data.items || [];
  } catch (error) {
    console.error('[admin] no se pudo cargar el catalogo de planes:', error);
  }
};

const fetchUsers = async () => {
  isLoading.value = true;
  loadError.value = '';
  try {
    const data = await authService.getAllUsersPlans();

    // El listado ya trae la cuota de cada usuario, asi que basta una peticion.
    // Antes habia que pedir el consumo uno a uno contra users/get/: 36 llamadas
    // para 35 usuarios, con fallos por limite por IP y por permisos.
    users.value = (data.items || []).map((u: any) => ({
      ...u,
      number_requests: u.quota?.used ?? 0,
      limite: u.quota?.limit ?? u.token_duration,
      // quota es nullable: si no viene, no inventamos un cero.
      consumoDesconocido: !u.quota
    }));

    // El panel no pagina: si el backend reporta mas de una pagina, se avisa
    // en vez de dejar creer que estan todos los usuarios.
    if ((data.totalPages ?? 1) > 1) {
      loadError.value = `Mostrando ${users.value.length} de ${data.totalItems} usuarios: hay ${data.totalPages} páginas y este panel solo carga la primera.`;
    }
  } catch (error: any) {
    // Se avisa de forma explícita en vez de mostrar una tabla vacía, que
    // se leería como "no hay usuarios".
    users.value = [];
    loadError.value = error?.message || 'No se pudo cargar el listado de usuarios.';
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
  editForm.userName = userItem.userName;
  // OJO: userItem.id es el id de la fila de plan_users, NO el del plan. Enviarlo
  // como `plan` hacia que el backend rechazara el PATCH con invalid_input. Se
  // resuelve el plan real casando la descripcion contra el catalogo.
  editForm.plan = planes.value.find(
    (pl: any) => pl.description === userItem.planDescription
  )?.id || '';
  // El consumo viene en el listado; ya no hace falta una peticion por usuario.
  editForm.number_requests = userItem.number_requests ?? 0;
  modalError.value = '';
  showModal.value = true;
};

const resetRequests = async (userItem: any) => {
  if (!confirm(`¿Reiniciar peticiones para ${userItem.userName}?`)) return;
  isResetting.value = userItem.userId;
  try {
    await authService.patchUser(userItem.userId, { number_requests: 0 });
    const idx = users.value.findIndex(u => u.userId === userItem.userId);
    if (idx !== -1) {
      // Tras reiniciar, el consumo pasa a ser conocido: cero de verdad.
      users.value[idx] = { ...users.value[idx], number_requests: 0, consumoDesconocido: false };
    }
  } catch (error) {
    console.error('Error al resetear peticiones:', error);
  } finally {
    isResetting.value = null;
  }
};

const saveUserChanges = async () => {
  isSaving.value = true;
  modalError.value = '';
  try {
    // Un unico PATCH con todos los campos. Antes eran dos llamadas seguidas al
    // mismo endpoint, asi que si la segunda fallaba el usuario quedaba a medio
    // actualizar sin que nadie se enterase.
    await authService.updateUser(editForm.userId, {
      username: editForm.userName,
      number_requests: Number(editForm.number_requests),
      plan: editForm.plan
    });

    showModal.value = false;

    // Se espera de verdad al refresco: antes se lanzaba sin await, asi que el
    // modal se cerraba y no habia forma de saber si el listado llegaba a
    // actualizarse ni si fallaba.
    await fetchUsers();

    // El listado y el registro de usuario son colecciones distintas. Si tras
    // recargar sigue apareciendo el valor anterior, el dato se guardo pero el
    // listado no lo refleja: se avisa en vez de dejar una pantalla que
    // contradice a la base.
    const fila = users.value.find((u: any) => u.userId === editForm.userId);
    if (fila && fila.userName !== editForm.userName) {
      console.warn('[admin] el listado no refleja el cambio recien guardado', {
        userId: editForm.userId,
        enviado: editForm.userName,
        devuelto: fila.userName
      });
      loadError.value = 'El cambio se guardó correctamente, pero el listado sigue devolviendo los datos anteriores. Vuelve a cargar en unos segundos.';
    }
  } catch (error: any) {
    // El interceptor ya deja en `message` un texto presentable y, cuando el
    // backend rechaza campos concretos, la lista en `invalidFields`.
    const campos = error?.invalidFields?.length
      ? ` Campos rechazados: ${error.invalidFields.join(', ')}.`
      : '';
    modalError.value = `${error?.message || 'No se pudo actualizar el usuario.'}${campos}`;
    console.error('[admin] fallo al actualizar usuario:', {
      userId: editForm.userId,
      status: error?.response?.status,
      body: error?.response?.data
    });
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.noise-overlay {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
}
</style>
