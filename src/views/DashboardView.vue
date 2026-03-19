<template>
  <div class="dashboard-wrapper font-primary min-h-screen flex overflow-hidden relative">
    <!-- Fondo Atmosférico de Dashboard -->
    <div class="absolute inset-0 pointer-events-none noise-overlay z-0"></div>
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0" style="will-change: transform; transform: translateZ(0);">
      <div class="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-pale-blue/5 blur-[120px] rounded-full transform translate-z-0"></div>
      <div class="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-pale-blue/5 blur-[100px] rounded-full transform translate-z-0"></div>
    </div>

    <!-- Botón Hamburguesa para Móvil -->
    <button 
      @click="isSidebarOpen = !isSidebarOpen"
      class="lg:hidden fixed top-4 right-4 z-50 p-3 bg-obsidian-soft border border-white/10 rounded-xl text-pale-blue shadow-lg pointer-events-auto"
    >
      <svg v-if="!isSidebarOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>

    <!-- Overlay para cerrar sidebar en móvil -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"></div>

    <!-- Navegación lateral (Sidebar) -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-40 w-72 transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col h-screen bg-obsidian-soft border-r',
        isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      ]"
      style="border-color: var(--border-color);"
    >

      <!-- Header del Nav -->
      <div class="p-8 border-b" style="border-color: var(--border-color);">
        <h2 class="text-[14px] leading-tight tracking-[0.15em] font-light mb-1 mask-reveal" style="color: var(--text-primary);">PORTAL DE <br><span style="color: var(--accent-color);" class="font-bold">CONSULTA CIUDADANA</span></h2>
        <p class="text-[9px] uppercase tracking-[0.3em] opacity-70 mask-reveal delay-100" style="color: var(--text-secondary);">Panel de Consultas</p>
      </div>

      <!-- Menús de Selección -->
      <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div v-if="isAdmin" class="mb-6">
          <p class="text-[9px] tracking-[0.3em] mb-4 pl-4 mt-2" style="color: var(--accent-color);">ADMINISTRACIÓN</p>
          <button 
            @click="router.push('/admin')"
            class="w-full text-left px-5 py-3 rounded-xl text-[11px] tracking-[0.1em] transition-all duration-300 relative group overflow-hidden border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-500"
          >
            <div class="flex items-center gap-3">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              PANEL DE CONTROL
            </div>
          </button>
        </div>

        <p class="text-[9px] tracking-[0.3em] mb-4 pl-4 mt-2" style="color: var(--accent-color);">SERVICIOS DISPONIBLES</p>
        <nav class="space-y-1">
          <button 
            v-for="(service, key) in servicesList" :key="key"
            @click="selectService(key as ServiceKey)"
            :class="['w-full text-left px-5 py-3 rounded-xl text-[11px] tracking-[0.1em] transition-all duration-300 relative group overflow-hidden border', 
              currentService === key 
                ? 'text-white border-pale-blue/20 shadow-[0_0_15px_rgba(177,193,211,0.05)]' 
                : 'hover:bg-white/5 border-transparent'
            ]"
            :style="{ 
              backgroundColor: currentService === key ? 'var(--accent-color)' : 'transparent',
              color: currentService === key ? '#ffffff' : 'var(--text-secondary)'
            }"
          >
            {{ service.title }}
          </button>
        </nav>
      </div>

      <!-- Plan y Límite de Peticiones -->
      <div class="px-4 pb-4">
        <!-- Badge del Plan -->
        <div class="rounded-xl border p-4 mb-3" style="border-color: var(--border-color); background-color: var(--card-bg);">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[9px] tracking-[0.25em] font-medium uppercase" style="color: var(--text-secondary);">Plan Actual</span>
            <span class="text-[9px] font-mono px-2 py-0.5 rounded-full border tracking-widest" style="color: var(--accent-color); border-color: var(--accent-color); background-color: var(--card-bg);">{{ userPlan }}</span>
          </div>
          <!-- Barra de progreso de peticiones -->
          <div class="mb-2">
            <div class="flex justify-between text-[9px] mb-1" style="color: var(--text-secondary);">
              <span>Peticiones usadas</span>
              <span style="color: var(--accent-color);">{{ userRequests }} / {{ tokenLimit }}</span>
            </div>
            <div class="w-full h-1 bg-black/10 rounded-full overflow-hidden">
              <div 
                class="h-full rounded-full transition-all duration-700"
                :class="userRequests >= tokenLimit - 2 ? 'bg-red-500' : 'bg-blue-500'"
                :style="{ width: Math.min((userRequests / tokenLimit) * 100, 100) + '%', backgroundColor: 'var(--accent-color)' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer / Logout + Trust Signals -->
      <div class="p-6 border-t" style="border-color: var(--border-color);">
        <button 
          @click="handleLogout"
          class="w-full py-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-xl text-red-500 text-[10px] tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2"
        >
          DESCONECTAR
        </button>
        <!-- Pilar 10: Señales de Confianza -->
        <div class="mt-4 flex flex-wrap justify-center gap-2 text-[8px] uppercase tracking-widest opacity-40 font-mono" style="color: var(--text-secondary);">
          <span class="flex items-center gap-1">
            <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            SSL
          </span>
          <span>·</span>
          <span>Cifrado TLS</span>
          <span>·</span>
          <span>Devzio &copy; 2025</span>
        </div>
      </div>
    </aside>

    <!-- Panel Central (Área de Trabajo) -->
    <main class="flex-1 flex flex-col h-screen relative z-10 p-6 sm:p-10 overflow-y-auto custom-scrollbar">

      <!-- Título de Sección Actual y Perfil de Usuario -->
      <header class="mb-10 mask-reveal delay-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 class="text-3xl font-light tracking-[0.1em]" style="color: var(--text-primary);">{{ currentServiceConfig.title }}</h1>
          <p class="text-sm mt-2 font-light tracking-wide max-w-xl leading-relaxed" style="color: var(--text-secondary);">{{ currentServiceConfig.description }}</p>
        </div>

        <!-- Perfil de Usuario Simplificado y Tema -->
        <div class="flex items-center gap-4 self-end md:self-auto">
          <!-- Botón de Tema (Light/Dark) -->
          <button 
            @click="toggleTheme" 
            class="p-3 backdrop-blur-md border rounded-2xl shadow-lg transition-all duration-300 group"
            style="background-color: var(--glass-bg); border-color: var(--border-color); color: var(--accent-color);"
            title="Cambiar Tema"
          >
            <transition name="fade-slide" mode="out-in">
              <svg v-if="isDark" key="sun" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg>
              <svg v-else key="moon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            </transition>
          </button>

          <div class="relative" ref="profileBtnRef">
            <div 
              @click="isProfileMenuOpen = !isProfileMenuOpen"
              class="flex items-center gap-4 backdrop-blur-md border py-2 px-4 rounded-2xl shadow-lg cursor-pointer hover:bg-white/5 transition-all duration-300" 
              style="background-color: var(--glass-bg); border-color: var(--border-color);"
            >
              <div class="flex flex-col text-right">
                <span class="text-[11px] font-medium tracking-widest uppercase" style="color: var(--text-primary);">{{ userName }}</span>
                <span class="text-[8px] tracking-[0.2em] uppercase" style="color: var(--text-secondary);">SISTEMA ACTIVO</span>
              </div>
              <div class="w-10 h-10 rounded-full border flex items-center justify-center text-[11px] font-bold shadow-inner" style="background-color: var(--accent-color); border-color: var(--border-color); color: #ffffff;">
                {{ userName.substring(0, 2).toUpperCase() }}
              </div>
            </div>

            <!-- Dropdown: Teleport al body para evitar el clip del overflow del main -->
            <Teleport to="body">
              <transition name="slide-up">
                <div 
                  v-if="isProfileMenuOpen" 
                  class="fixed w-48 backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden z-[999] flex flex-col"
                  :style="dropdownStyle"
                  style="background-color: var(--surface-color); border-color: var(--border-color);"
                >
                  <div class="py-2 px-4 border-b border-white/5 mb-1" style="background-color: rgba(0,0,0,0.1);">
                    <span class="text-[9px] uppercase tracking-[0.2em] opacity-60" style="color: var(--text-secondary);">Opciones</span>
                  </div>
                  <button 
                    @click="() => { selectService('profile'); isProfileMenuOpen = false; }"
                    class="w-full text-left px-5 py-3 text-[11px] tracking-[0.1em] transition-all duration-300 hover:bg-white/5 flex items-center gap-3"
                    style="color: var(--text-primary);"
                  >
                    <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    EDITAR PERFIL
                  </button>
                </div>
              </transition>
            </Teleport>
          </div>
        </div>
      </header>

      <!-- Layout Búsqueda y Resultados -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <!-- Formulario (Izquierda/Arriba) -->
        <div class="lg:col-span-4 border rounded-2xl p-8 shadow-negative mask-reveal delay-300" style="background-color: var(--surface-color); border-color: var(--border-color);">
          <h3 class="text-[10px] tracking-[0.3em] mb-6 flex items-center gap-2" style="color: var(--accent-color);">
            <div class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
            PARÁMETROS DE CONSULTA
          </h3>

          <form @submit.prevent="executeSearch" class="space-y-6">
            <!-- Inputs Dinámicos -->
            <div v-for="field in currentServiceConfig.fields" :key="field.key" class="relative group input-container">
              <input 
                v-model="queryParams[field.key]" 
                :type="field.type || 'text'" 
                :id="field.key"
                class="w-full bg-transparent border-b font-light outline-none pb-2 transition-all duration-300 peer custom-input placeholder-transparent"
                style="color: var(--text-primary); border-color: var(--input-border); caret-color: var(--accent-color);"
                :placeholder="field.label"
              />
              <label 
                :for="field.key" 
                class="absolute left-0 top-0 text-xs tracking-[0.2em] transition-all duration-300 peer-focus:-translate-y-5 peer-focus:text-[10px] peer-focus:opacity-100 opacity-50 peer-valid:-translate-y-5 peer-valid:text-[10px] uppercase"
                style="color: var(--text-secondary);"
              >
                {{ field.label }}
              </label>
              <div class="absolute bottom-0 left-0 w-full h-[0.5px] scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-center" style="background-color: var(--accent-color);"></div>
            </div>

            <!-- Botón Submit Mejorado: Pilar 4 (CTA Efetivo) -->
            <div class="pt-4">
              <button 
                type="submit" 
                class="w-full py-4 border rounded-xl text-[11px] tracking-[0.3em] uppercase transition-all duration-500 relative group overflow-hidden hover-smoke-glass flex justify-center items-center gap-3"
                style="background-color: var(--glass-bg); border-color: var(--accent-color); color: var(--text-primary);"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" :style="{ borderColor: 'var(--accent-color)', borderTopColor: 'transparent' }"></span>
                <span v-else-if="currentService !== 'profile'">⚡</span>
                {{ isLoading ? 'PROCESANDO...' : (currentService === 'profile' ? 'GUARDAR CAMBIOS' : 'EJECUTAR CONSULTA') }}
              </button>
            </div>
          </form>

          <!-- Errores -->
          <transition name="slide-up">
            <div v-if="errorMsg" class="mt-6 p-4 rounded-xl border flex items-start gap-3 text-left bg-red-500/10 border-red-500/20">
              <p class="text-red-500 text-[10px] tracking-[0.1em] font-medium leading-relaxed uppercase">
                {{ errorMsg }}
              </p>
            </div>
          </transition>
        </div>

        <!-- Visor de Resultados -->
        <div class="lg:col-span-8">
          <transition name="fade-slide" mode="out-in">
            <!-- Cargando (Skeleton) -->
            <SkeletonResult v-if="isLoading" key="loading" />

            <!-- Tabla de Resultados -->
            <div v-else-if="hasResults" key="results" class="border rounded-2xl shadow-negative mask-reveal" style="background-color: var(--surface-color); border-color: var(--border-color);">
              <!-- Pilar 5: Resultados con formato estructurado + Pilar 4: Botón copiar -->
              <div class="px-6 py-4 border-b flex justify-between items-center" style="border-color: var(--border-color);">
                <h3 class="text-[9px] tracking-[0.3em] opacity-80 flex items-center gap-2" style="color: var(--accent-color);">
                  <span class="w-1 h-1 bg-green-500 rounded-full"></span> 
                  RESULTADOS ENCONTRADOS
                </h3>
                <button 
                  @click="copyResults"
                  class="flex items-center gap-1.5 text-[9px] tracking-[0.15em] uppercase opacity-50 hover:opacity-100 transition-opacity"
                  style="color: var(--text-secondary);"
                  :title="copiedMsg || 'Copiar al portapapeles'"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  {{ copiedMsg || 'COPIAR' }}
                </button>
              </div>

              <div class="p-6 overflow-y-auto max-h-[600px] custom-scrollbar">
                <!-- Resultados en lista (array) -->
                <div v-if="Array.isArray(resultsData)" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="(item, idx) in resultsData" :key="idx" class="border rounded-xl p-5 transition-all duration-300" style="background-color: var(--card-bg); border-color: var(--border-color);">
                    <ResultCard
                      v-for="(value, key) in item" :key="key"
                      :label="mapKey(String(key))"
                      :value="value"
                      :type="detectType(String(key), value)"
                    />
                  </div>
                </div>

                <!-- Resultado único (objeto) -->
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
                  <ResultCard
                    v-for="(value, key) in resultsData" :key="key"
                    :label="mapKey(String(key))"
                    :value="value"
                    :type="detectType(String(key), value)"
                  />
                </div>
              </div>
            </div>

            <!-- Estado Perfil Exitoso -->
            <div v-else-if="currentService === 'profile' && successMsg" key="profile-success" class="h-full min-h-[400px] flex flex-col items-center justify-center border rounded-2xl transition-all duration-500" style="background-color: var(--card-bg); border-color: var(--accent-color);">
               <svg class="w-16 h-16 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--accent-color);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               <h3 class="text-[14px] tracking-[0.2em] font-light mb-2" style="color: var(--text-primary);">{{ successMsg }}</h3>
               <p class="text-[10px] tracking-[0.1em] opacity-60" style="color: var(--text-secondary);">El identificador público interno ha sido modificado exitosamente.</p>
            </div>

            <!-- Estado Inicial / Vacío -->
            <div v-else key="empty" class="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed rounded-2xl" style="background-color: var(--glass-bg); border-color: var(--border-color);">
              <svg class="w-12 h-12 mb-4 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--text-primary);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              <p class="text-[11px] tracking-[0.2em] font-light opacity-40" style="color: var(--text-primary);">{{ currentService === 'profile' ? 'MODIFICADOR DE PARÁMETROS INTERNOS' : 'LISTO PARA RECIBIR RESPUESTA DEL NÚCLEO' }}</p>
            </div>
          </transition>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';
import SkeletonResult from '../components/SkeletonResult.vue';
import ResultCard from '../components/ResultCard.vue';

const isSidebarOpen = ref(false);
const isProfileMenuOpen = ref(false);
const profileBtnRef = ref<HTMLElement | null>(null);

// Posición del dropdown calculada dinámicamente para Teleport
const dropdownStyle = computed(() => {
  if (!profileBtnRef.value) return {};
  const rect = profileBtnRef.value.getBoundingClientRect();
  return {
    top: `${rect.bottom + 8}px`,
    right: `${window.innerWidth - rect.right}px`,
  };
});

// Cerrar el dropdown al hacer click fuera
const handleOutsideClick = (e: MouseEvent) => {
  if (profileBtnRef.value && !profileBtnRef.value.contains(e.target as Node)) {
    isProfileMenuOpen.value = false;
  }
};

const router = useRouter();
const { logout, userPlan, userRequests, tokenLimit, userId, userName, updateUserName, isDark, isAdmin, updateUserRequests, setPlanData, toggleTheme } = useAuth();

onMounted(async () => {
  document.addEventListener('click', handleOutsideClick, true);
  if (userId.value) {
    try {
      // Refrescar datos del plan (Descripción y Límite)
      const planData = await authService.getUserPlan(userId.value);
      if (planData) {
        setPlanData(planData.planDescription || 'FREE', planData.token_duration || 20, planData.id);
      }
      
      // Refrescar contador de peticiones
      const userData = await authService.getUserData(userId.value);
      if (typeof userData.number_requests === 'number') {
        updateUserRequests(userData.number_requests);
      }
    } catch (e) {
      console.error('Error refreshing dashboard data:', e);
    }
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick, true);
});

const handleLogout = () => {
  logout();
  router.push('/auth');
};

// Configuración Base de Servicios
type ServiceKey = 'fullname' | 'ruc' | 'complaint' | 'complaints_info' | 'id_card' | 'license' | 'citation' | 'vehicles_plate' | 'profile';

interface ServiceConfig {
  title: string;
  description: string;
  fields: { 
    key: string; 
    label: string; 
    required: boolean; 
    type?: string;
    pattern?: string;
    minlength?: number;
    maxlength?: number;
  }[];
  action: (params: any) => Promise<any>;
}

const servicesList: Record<ServiceKey, ServiceConfig> = {
  fullname: {
    title: 'BÚSQUEDA POR NOMBRE',
    description: 'Localiza a un usuario dentro del padrón consultando por sus nombres y/o apellidos completos.',
    fields: [
      { key: 'name', label: 'NOMBRE (EJ: JUAN)', required: false },
      { key: 'lastname', label: 'APELLIDO (EJ: PÉREZ)', required: false }
    ],
    action: (p) => apiService.getFullname(p.name, p.lastname)
  },
  ruc: {
    title: 'ESTADO RUC',
    description: 'Consulta los datos contributivos, estado legal y todos los establecimientos asociados a un RUC (Registro Único de Contribuyentes).',
    fields: [
      { key: 'ruc', label: 'NÚMERO DE RUC (EJ: 1790000000001)', required: true, pattern: '^\\d{13}$', minlength: 13, maxlength: 13 }
    ],
    action: (p) => apiService.getRuc(p.ruc)
  },
  id_card: {
    title: 'VERIFICACIÓN DE IDENTIDAD',
    description: 'Búsqueda principal por Cédula de Identidad Ecuatoriana. Retorna nombre, clases, fecha de nacimiento, estado civil y más detalles demográficos.',
    fields: [
      { key: 'ci', label: 'CÉDULA (EJ: 1700234567)', required: true, pattern: '^\\d{10}$', minlength: 10, maxlength: 10 }
    ],
    action: (p) => apiService.getIdCard(p.ci)
  },
  license: {
    title: 'LICENCIAS ACTIVAS',
    description: 'Verifica los tipos de licencias de conducir activas de una persona, así como sus puntos de licencia actuales.',
    fields: [
      { key: 'ci', label: 'CÉDULA (EJ: 1700234567)', required: true, pattern: '^\\d{10}$', minlength: 10, maxlength: 10 }
    ],
    action: (p) => apiService.getLicense(p.ci)
  },
  citation: {
    title: 'INFRACCIONES DE TRÁNSITO',
    description: 'Consulta el registro completo de citaciones e infracciones vehiculares registradas a la licencia de una persona, incluyendo valores a cancelar.',
    fields: [
      { key: 'ci', label: 'CÉDULA (EJ: 1700234567)', required: true, pattern: '^\\d{10}$', minlength: 10, maxlength: 10 }
    ],
    action: (p) => apiService.getCitation(p.ci)
  },
  complaint: {
    title: 'REGISTRO DE DENUNCIAS',
    description: 'Accede a los historiales de juicios y denuncias ingresadas buscando específicamente por el documento de identidad asociado.',
    fields: [
      { key: 'ci', label: 'CÉDULA (EJ: 1700234567)', required: true, pattern: '^\\d{10}$', minlength: 10, maxlength: 10 }
    ],
    action: (p) => apiService.getComplaint(p.ci)
  },
  complaints_info: {
    title: 'INFORMACIÓN DE JUICIOS',
    description: 'Datos detallados de expedientes de juicio o denuncias anexadas en el sistema de fiscalía y judicatura.',
    fields: [
      { key: 'ci', label: 'CÉDULA (EJ: 1700234567)', required: true, pattern: '^\\d{10}$', minlength: 10, maxlength: 10 }
    ],
    action: (p) => apiService.getComplaintsInformation(p.ci)
  },
  vehicles_plate: {
    title: 'CONSULTA DE VEHÍCULOS',
    description: 'Obtén marca, modelo, año y propietario legal ingresando únicamente el número de matriculación (placa).',
    fields: [
      { key: 'plate', label: 'NÚMERO DE PLACA (EJ: ABC-1234)', required: true, pattern: '^[a-zA-Z]{3}-\\d{4}$|^[a-zA-Z]{3}\\d{4}$', maxlength: 8 }
    ],
    action: (p) => apiService.getVehiclesByPlate(p.plate)
  },
  profile: {
    title: 'ACTUALIZAR PERFIL',
    description: 'Modifica tu identificador público en el sistema (Ejemplo: usuario_123). Asegúrate de elegir un nombre que te identifique correctamente.',
    fields: [
      { key: 'newUserName', label: 'NUEVO USUARIO (EJ: usuario_123)', required: true, maxlength: 50 }
    ],
    action: async (_p) => {
      // Devolvemos el control manual a executeSearch para que handlee el update
      return '__UPDATE_PROFILE__';
    }
  }
};

// Estado del Dashboard
const currentService = ref<ServiceKey>('id_card');

const queryParams = reactive<Record<string, string>>({});
const isLoading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');
const resultsData = ref<any>(null);

const currentServiceConfig = computed(() => servicesList[currentService.value]);
const hasResults = computed(() => resultsData.value !== null);

const selectService = (key: ServiceKey) => {
  currentService.value = key;
  // Limpiar estado
  Object.keys(queryParams).forEach(k => delete queryParams[k]);
  resultsData.value = null;
  errorMsg.value = '';
  successMsg.value = '';

  // Prellenar nombre actual si abre perfil
  if (key === 'profile') {
    queryParams.newUserName = userName.value;
  }
  // Cerrar menus
  isSidebarOpen.value = false;
  isProfileMenuOpen.value = false;
};

const executeSearch = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  successMsg.value = '';
  resultsData.value = null;

  try {
    const data = await currentServiceConfig.value.action(queryParams);
    
    // Verificamos si es un request de update perfil manual
    if (data === '__UPDATE_PROFILE__') {
      const newName = queryParams.newUserName?.trim();
      if (!newName || newName.length < 3) {
        throw new Error("El nombre de usuario debe tener al menos 3 caracteres.");
      }
      
      const payload = { username: newName };
      await authService.updateUser(userId.value, payload);
      
      // Actualizar DOM reactivo
      updateUserName(newName);
      successMsg.value = "Nombre de usuario actualizado";
      return;
    }

    if (Object.keys(data).length === 0 && data.constructor === Object) {
        throw new Error('La consulta no arrojó resultados válidos encontrados.');
    }
    resultsData.value = data;

    // Actualizar el número de peticiones en tiempo real usando el endpoint real
    if (userId.value) {
      try {
        const userData = await authService.getUserData(userId.value);
        if (typeof userData.number_requests === 'number') {
          updateUserRequests(userData.number_requests);
        }
      } catch { /* Si falla el refresco, lo ignoramos silenciosamente */ }
    }
  } catch (error: any) {
    const detail = error.response?.data?.detail;

    if (detail === 'Has superado el límite de peticiones') {
      errorMsg.value = 'HAS AGOTADO TU LÍMITE DE CONSULTAS DISPONIBLES. POR FAVOR, RENUEVA TU PLAN.';
    } else if (error.response?.status === 404) {
      errorMsg.value = 'El registro solicitado no fue encontrado en la base de datos.';
    } else if (error.response?.status === 422) {
      errorMsg.value = 'Parámetros de consulta estructurados de forma incorrecta (Validación).';
    } else {
      errorMsg.value = error.message || error.response?.data?.message || detail || 'Fallo de conexión crítico al intentar consultar la red.';
    }
  } finally {
    isLoading.value = false;
  }
};

// Pilar 5: Mapa de claves de la API al español legible
const KEY_MAP: Record<string, string> = {
  // Identidad
  cedula: 'Cédula', cedula_identidad: 'Cédula', ci: 'Cédula',
  primer_nombre: 'Primer Nombre', segundo_nombre: 'Segundo Nombre',
  primer_apellido: 'Primer Apellido', segundo_apellido: 'Segundo Apellido',
  nombre_completo: 'Nombre Completo', nombres: 'Nombres', apellidos: 'Apellidos',
  fecha_nacimiento: 'Fecha de Nacimiento', lugar_nacimiento: 'Lugar de Nacimiento',
  estado_civil: 'Estado Civil', genero: 'Género', sexo: 'Sexo',
  nacionalidad: 'Nacionalidad', pais: 'País',
  // Contacto
  email: 'Correo Electrónico', telefono: 'Teléfono', celular: 'Celular',
  direccion: 'Dirección', provincia: 'Provincia', canton: 'Cantón', ciudad: 'Ciudad',
  // RUC / Tributario
  ruc: 'RUC', razon_social: 'Razón Social', nombre_comercial: 'Nombre Comercial',
  estado_ruc: 'Estado RUC', tipo_contribuyente: 'Tipo Contribuyente',
  actividad_economica: 'Actividad Económica', fecha_inicio_actividades: 'Inicio Actividades',
  // Licencias
  tipo_licencia: 'Tipo Licencia', clase: 'Clase', puntaje: 'Puntos',
  fecha_expedicion: 'Fecha Expedición', fecha_caducidad: 'Fecha Caducidad',
  estado: 'Estado', vigente: 'Vigente', activo: 'Activo',
  // Vehículo
  placa: 'Placa', marca: 'Marca', modelo: 'Modelo', anio: 'Año', color: 'Color',
  cilindraje: 'Cilindraje', tonelaje: 'Tonelaje', propietario: 'Propietario',
  // Infracciones
  numero_infraccion: 'N° Infracción', fecha_infraccion: 'Fecha Infracción',
  valor: 'Valor', valor_a_pagar: 'Valor a Pagar', descripcion: 'Descripción',
  ubicacion: 'Ubicación', agente: 'Agente',
};

const KEY_STATUS = ['estado', 'estado_ruc', 'vigente', 'activo', 'status'];
const KEY_DATE = ['fecha_nacimiento', 'fecha_expedicion', 'fecha_caducidad', 'fecha_inicio_actividades', 'fecha_infraccion'];
const KEY_CURRENCY = ['valor', 'valor_a_pagar', 'monto', 'saldo'];

// Detecta tipo de dato para el ResultCard
const detectType = (key: string, value: any): 'badge' | 'date' | 'currency' | 'text' => {
  const k = key.toLowerCase();
  if (KEY_STATUS.some(s => k.includes(s))) return 'badge';
  if (KEY_DATE.some(d => k.includes(d))) return 'date';
  if (KEY_CURRENCY.some(c => k.includes(c))) return 'currency';
  return 'text';
};

// Mapea clave de API a español usando diccionario; si no existe, aplica formateo genérico
const mapKey = (key: string): string => {
  const k = key.toLowerCase();
  if (KEY_MAP[k]) return KEY_MAP[k];
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim();
};


// Pilar 4: Copiar resultados al portapapeles
const copiedMsg = ref('');
const copyResults = async () => {
  try {
    const text = JSON.stringify(resultsData.value, null, 2);
    await navigator.clipboard.writeText(text);
    copiedMsg.value = '✓ COPIADO';
    setTimeout(() => copiedMsg.value = '', 2000);
  } catch {
    copiedMsg.value = 'ERROR';
    setTimeout(() => copiedMsg.value = '', 2000);
  }
};

</script>

<style scoped>
/* Scoped solo para el dashboard. Base styling (fonts, obsidian bg, overlay) are reused from globals */

.dashboard-wrapper { 
  min-height: 100vh;
  background-color: var(--bg-color); 
}

.bg-obsidian-soft { 
  background-color: var(--surface-color); 
  backdrop-filter: blur(16px); 
}

.text-silver { color: var(--text-primary); }
.text-smoke { color: var(--text-secondary); }
.text-pale-blue { color: var(--accent-color); }

pre {
  margin: 0;
  tab-size: 2;
}

/* Transiciones de Modo - Optimizadas para Velocidad */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translate3d(-10px, 0, 0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translate3d(10px, 0, 0);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translate3d(0, 10px, 0);
}

/* Animación Cinemática Reveal - Optimizada */
@keyframes maskReveal {
  0% { opacity: 0; transform: translate3d(0, 10px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}

.mask-reveal {
  will-change: transform, opacity;
  animation: maskReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
