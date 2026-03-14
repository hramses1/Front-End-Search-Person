<template>
  <div class="dashboard-wrapper font-primary min-h-screen bg-obsidian flex overflow-hidden relative">
    <!-- Fondo Atmosférico de Dashboard -->
    <div class="absolute inset-0 pointer-events-none noise-overlay z-0"></div>
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-pale-blue/5 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-pale-blue/5 blur-[100px] rounded-full"></div>
    </div>

    <!-- Navegación lateral (Sidebar) -->
    <aside class="w-72 bg-obsidian-soft border-r border-white/5 relative z-10 flex flex-col h-screen">
      <!-- Header del Nav -->
      <div class="p-8 border-b border-white/5">
        <h2 class="text-xl tracking-[0.25em] font-light text-silver mb-1 mask-reveal">PORTAL<span class="text-pale-blue font-bold">SRI</span></h2>
        <p class="text-[9px] uppercase tracking-[0.3em] text-smoke opacity-70 mask-reveal delay-100">Panel de Consultas</p>
      </div>

      <!-- Menús de Selección -->
      <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <p class="text-[9px] text-pale-blue/50 tracking-[0.3em] mb-4 pl-4 mt-2">SERVICIOS DISPONIBLES</p>
        <nav class="space-y-1">
          <button 
            v-for="(service, key) in servicesList" :key="key"
            @click="selectService(key)"
            :class="['w-full text-left px-5 py-3 rounded-xl text-[11px] tracking-[0.1em] transition-all duration-300 relative group overflow-hidden', 
              currentService === key 
                ? 'bg-pale-blue/10 text-white border border-pale-blue/20 shadow-[0_0_15px_rgba(177,193,211,0.05)]' 
                : 'text-smoke hover:bg-white/5 hover:text-silver border border-transparent'
            ]"
          >
            <!-- Highlight Izquierdo Activo -->
            <div 
              class="absolute left-0 top-0 h-full w-[2px] bg-pale-blue transition-all duration-300"
              :class="currentService === key ? 'opacity-100' : 'opacity-0'"
            ></div>
            {{ service.title }}
          </button>
        </nav>
      </div>

      <!-- Plan y Límite de Peticiones -->
      <div class="px-4 pb-4">
        <!-- Badge del Plan -->
        <div class="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-3">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[9px] tracking-[0.25em] text-amber-400/80 font-medium uppercase">Plan Actual</span>
            <span class="text-[9px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 tracking-widest">{{ userPlan }}</span>
          </div>
          <!-- Barra de progreso de peticiones -->
          <div class="mb-2">
            <div class="flex justify-between text-[9px] text-smoke/70 mb-1">
              <span>Peticiones usadas</span>
              <span class="text-amber-400">{{ userRequests }} / {{ tokenLimit }}</span>
            </div>
            <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                class="h-full rounded-full transition-all duration-700"
                :class="userRequests >= tokenLimit - 2 ? 'bg-red-400' : userRequests >= tokenLimit * 0.6 ? 'bg-amber-400' : 'bg-pale-blue/60'"
                :style="{ width: Math.min((userRequests / tokenLimit) * 100, 100) + '%' }"
              ></div>
            </div>
          </div>
          <!-- Alerta de pocas peticiones -->
          <p v-if="userRequests >= tokenLimit - 2" class="text-[9px] text-red-400/90 tracking-wide flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block"></span>
            Límite casi alcanzado
          </p>
          <p v-else class="text-[9px] text-amber-400/60 tracking-wide">
            {{ tokenLimit - userRequests }} peticiones restantes
          </p>
        </div>
      </div>

      <!-- Footer / Logout -->
      <div class="p-6 border-t border-white/5">
        <button 
          @click="handleLogout"
          class="w-full py-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-xl text-red-400 text-[10px] tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          DESCONECTAR
        </button>
      </div>
    </aside>

    <!-- Panel Central (Área de Trabajo) -->
    <main class="flex-1 flex flex-col h-screen relative z-10 p-10 overflow-y-auto custom-scrollbar">
      
      <!-- Título de Sección Actual -->
      <header class="mb-10 mask-reveal delay-200">
        <h1 class="text-3xl font-light text-white tracking-[0.1em]">{{ currentServiceConfig.title }}</h1>
        <p class="text-smoke text-sm mt-2 font-light tracking-wide max-w-xl leading-relaxed">{{ currentServiceConfig.description }}</p>
      </header>

      <!-- Layout Búsqueda y Resultados -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Formulario (Izquierda/Arriba) -->
        <div class="lg:col-span-4 bg-obsidian-soft border-[0.5px] border-white/5 rounded-2xl p-8 shadow-negative mask-reveal delay-300">
          <h3 class="text-[10px] tracking-[0.3em] text-pale-blue/80 mb-6 flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-pale-blue/50 animate-pulse"></div>
            PARÁMETROS DE CONSULTA
          </h3>

          <form @submit.prevent="executeSearch" class="space-y-6">
            <!-- Inputs Dinámicos basados en la configuración del servicio seleccionado -->
            <div v-for="field in currentServiceConfig.fields" :key="field.key" class="relative group input-container">
              <input 
                v-model="queryParams[field.key]" 
                :type="field.type || 'text'" 
                :id="field.key"
                :required="field.required"
                :pattern="field.pattern"
                :minlength="field.minlength"
                :maxlength="field.maxlength"
                class="w-full bg-transparent border-b-[0.5px] border-white/10 text-silver font-light focus:border-pale-blue/50 outline-none pb-2 transition-all duration-300 peer group-hover:border-white/20 custom-input placeholder-transparent"
                :placeholder="field.label"
              />
              <label 
                :for="field.key" 
                class="absolute left-0 top-0 text-smoke text-xs tracking-[0.2em] transition-all duration-300 peer-focus:-translate-y-5 peer-focus:text-[10px] peer-focus:text-pale-blue peer-focus:opacity-100 opacity-50 peer-valid:-translate-y-5 peer-valid:text-[10px] uppercase"
              >
                {{ field.label }}
              </label>
              <div class="absolute bottom-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-pale-blue/0 via-pale-blue/40 to-pale-blue/0 scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-center"></div>
            </div>

            <div class="pt-4">
              <button 
                type="submit" 
                class="w-full py-4 bg-pale-blue/5 hover:bg-pale-blue/10 backdrop-blur-md border border-pale-blue/10 rounded-xl text-silver text-[11px] tracking-[0.3em] uppercase transition-all duration-500 relative group overflow-hidden hover-smoke-glass flex justify-center items-center gap-2"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="w-3 h-3 border border-t-transparent border-silver rounded-full animate-spin"></span>
                {{ isLoading ? 'ANALIZANDO RED...' : 'EJECUTAR CONSULTA' }}
              </button>
            </div>
          </form>
          
          <!-- Errores locales -->
          <transition name="slide-up">
            <p v-if="errorMsg" class="mt-4 text-red-400/80 text-[10px] tracking-[0.1em] text-center font-medium">{{ errorMsg }}</p>
          </transition>
        </div>

        <!-- Visor de Resultados (Derecha/Abajo) -->
        <div class="lg:col-span-8">
          <transition name="fade-slide" mode="out-in">
            <!-- Estado Inicial / Vacío -->
            <div v-if="!hasResults && !isLoading" key="empty" class="h-full min-h-[400px] flex flex-col items-center justify-center border-[0.5px] border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              <svg class="w-12 h-12 text-white/5 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              <p class="text-smoke/50 text-[11px] tracking-[0.2em] font-light">LISTO PARA RECIBIR RESPUESTA DEL NÚCLEO</p>
            </div>

            <!-- Cargando -->
            <div v-else-if="isLoading" key="loading" class="h-full min-h-[400px] flex flex-col items-center justify-center bg-obsidian-soft border-[0.5px] border-white/5 rounded-2xl mask-reveal">
               <div class="relative w-20 h-20 mb-6">
                 <div class="absolute inset-0 border-t border-pale-blue/30 rounded-full animate-spin"></div>
                 <div class="absolute inset-2 border-r border-white/20 rounded-full animate-[spin_2s_linear_reverse]"></div>
                 <div class="absolute inset-4 border-b border-pale-blue/10 rounded-full animate-[spin_1s_linear_infinite]"></div>
               </div>
               <p class="text-pale-blue animate-pulse text-[10px] tracking-[0.4em]">DESCIFRANDO DATOS...</p>
            </div>

            <!-- Tabla de Resultados o JSON Tree -->
            <div v-else key="results" class="bg-obsidian-soft border-[0.5px] border-white/5 rounded-2xl shadow-negative mask-reveal">
              <div class="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                <h3 class="text-[9px] tracking-[0.3em] text-pale-blue opacity-80 flex items-center gap-2">
                  <span class="w-1 h-1 bg-green-500 rounded-full"></span> 
                  RESULTADOS ENCONTRADOS
                </h3>
                <span class="text-[9px] font-mono text-smoke">STATUS 200 OK</span>
              </div>
              
              <div class="p-6 overflow-y-auto max-h-[600px] custom-scrollbar">
                
                <!-- Si es un Array de Resultados (Ej: Nombre Completo, Citaciones simples) -->
                <div v-if="Array.isArray(resultsData)" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="(item, idx) in resultsData" :key="idx" class="bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden group">
                    <div class="absolute inset-0 bg-gradient-to-br from-pale-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="relative z-10 space-y-4">
                      <div v-for="(value, key) in item" :key="key" class="flex flex-col border-b border-white/[0.02] pb-3 last:border-0 last:pb-0">
                        <span class="text-[9px] uppercase tracking-[0.2em] text-smoke opacity-60 mb-1 flex items-center gap-1.5">
                          <span class="w-1 h-1 rounded-full bg-pale-blue/30 inline-block"></span>
                          {{ formatKey(String(key)) }}
                        </span>
                        <span class="text-silver text-[12px] font-medium break-words leading-relaxed" :class="{'text-pale-blue/40 italic': !value && value !== 0}">{{ (value !== null && value !== '') ? value : 'NO REGISTRA' }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Si es un Objeto Único Complejo (Ej: RUC, Cédula) -->
                <div v-else-if="typeof resultsData === 'object' && resultsData !== null" class="bg-white/[0.02] border border-white/5 rounded-xl p-7 relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-64 h-64 bg-pale-blue/5 blur-[80px] rounded-full pointer-events-none"></div>
                  <div class="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    <div v-for="(value, key) in resultsData" :key="key" :class="{'col-span-1 sm:col-span-2 mt-4': Array.isArray(value)}">
                      
                      <!-- Elemento anidado tipo Array (ej: 'SRI' list, 'Licencias' list) -->
                      <template v-if="Array.isArray(value) && value.length > 0">
                        <h4 class="text-[10px] uppercase tracking-[0.3em] text-pale-blue opacity-90 mb-4 border-b border-white/10 pb-2 w-full flex items-center gap-2">
                           <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                           {{ formatKey(String(key)) }}
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                          <div v-for="(subItem, sIdx) in value" :key="sIdx" class="bg-obsidian/40 rounded-xl p-5 border border-white/5 space-y-3 hover:border-white/10 transition-colors">
                            <div v-for="(subVal, subKey) in subItem" :key="subKey" class="flex justify-between items-start gap-4 text-[11px] border-b border-white/[0.02] pb-2 last:border-0 last:pb-0">
                              <span class="text-smoke opacity-70 tracking-widest uppercase text-[9px] mt-0.5 min-w-[30%]">{{ formatKey(String(subKey)) }}</span>
                              <span class="text-silver text-right font-medium break-words max-w-[65%]" :class="{'text-pale-blue/40 italic': !subVal && subVal !== 0}">{{ (subVal !== null && subVal !== '') ? subVal : 'N/D' }}</span>
                            </div>
                          </div>
                        </div>
                      </template>
                      
                      <!-- Elemento nativo (string, number) -->
                      <template v-else-if="typeof value !== 'object'">
                        <div class="flex flex-col group">
                          <span class="text-[9px] uppercase tracking-[0.2em] text-smoke opacity-60 mb-1 group-hover:text-pale-blue/80 transition-colors">{{ formatKey(String(key)) }}</span>
                          <span class="text-silver text-[13px] font-medium tracking-wide mt-0.5 break-words" :class="{'text-pale-blue/40 italic': !value && value !== 0}">{{ (value !== null && value !== '') ? value : 'NO REGISTRA' }}</span>
                        </div>
                      </template>
                      
                    </div>
                  </div>
                </div>

                <!-- Fallback a JSON en caso de primitiva u objeto no mapeable -->
                <pre v-else class="text-silver/90 font-mono text-[11.5px] leading-6 drop-shadow-sm whitespace-pre-wrap"><code v-html="syntaxHighlight(resultsData)"></code></pre>
              </div>
            </div>
          </transition>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import DOMPurify from 'dompurify';
import { useAuth } from '../composables/useAuth';
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';

const router = useRouter();
const { logout, userPlan, userRequests, tokenLimit, userId, updateUserRequests } = useAuth();

const handleLogout = () => {
  logout();
  router.push('/auth');
};

// Configuración Base de Servicios
type ServiceKey = 'fullname' | 'ruc' | 'complaint' | 'complaints_info' | 'id_card' | 'license' | 'citation' | 'vehicles_plate';

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
      { key: 'name', label: 'NOMBRE', required: false },
      { key: 'lastname', label: 'APELLIDO', required: false }
    ],
    action: (p) => apiService.getFullname(p.name, p.lastname)
  },
  ruc: {
    title: 'ESTADO RUC',
    description: 'Consulta los datos contributivos, estado legal y todos los establecimientos asociados a un RUC (Registro Único de Contribuyentes).',
    fields: [
      { key: 'ruc', label: 'NÚMERO DE RUC', required: true, pattern: '^\\d{13}$', minlength: 13, maxlength: 13 }
    ],
    action: (p) => apiService.getRuc(p.ruc)
  },
  id_card: {
    title: 'VERIFICACIÓN DE IDENTIDAD',
    description: 'Búsqueda principal por Cédula de Identidad Ecuatoriana. Retorna nombre, clases, fecha de nacimiento, estado civil y más detalles demográficos.',
    fields: [
      { key: 'ci', label: 'CÉDULA DE IDENTIDAD', required: true, pattern: '^\\d{10}$', minlength: 10, maxlength: 10 }
    ],
    action: (p) => apiService.getIdCard(p.ci)
  },
  license: {
    title: 'LICENCIAS ACTIVAS',
    description: 'Verifica los tipos de licencias de conducir activas de una persona, así como sus puntos de licencia actuales.',
    fields: [
      { key: 'ci', label: 'CÉDULA DE IDENTIDAD', required: true, pattern: '^\\d{10}$', minlength: 10, maxlength: 10 }
    ],
    action: (p) => apiService.getLicense(p.ci)
  },
  citation: {
    title: 'INFRACCIONES DE TRÁNSITO',
    description: 'Consulta el registro completo de citaciones e infracciones vehiculares registradas a la licencia de una persona, incluyendo valores a cancelar.',
    fields: [
      { key: 'ci', label: 'CÉDULA DE IDENTIDAD', required: true, pattern: '^\\d{10}$', minlength: 10, maxlength: 10 }
    ],
    action: (p) => apiService.getCitation(p.ci)
  },
  complaint: {
    title: 'REGISTRO DE DENUNCIAS',
    description: 'Accede a los historiales de juicios y denuncias ingresadas buscando específicamente por el documento de identidad asociado.',
    fields: [
      { key: 'ci', label: 'CÉDULA DE IDENTIDAD', required: true, pattern: '^\\d{10}$', minlength: 10, maxlength: 10 }
    ],
    action: (p) => apiService.getComplaint(p.ci)
  },
  complaints_info: {
    title: 'INFORMACIÓN DE JUICIOS',
    description: 'Datos detallados de expedientes de juicio o denuncias anexadas en el sistema de fiscalía y judicatura.',
    fields: [
      { key: 'ci', label: 'CÉDULA DE IDENTIDAD', required: true, pattern: '^\\d{10}$', minlength: 10, maxlength: 10 }
    ],
    action: (p) => apiService.getComplaintsInformation(p.ci)
  },
  vehicles_plate: {
    title: 'CONSULTA DE VEHÍCULOS',
    description: 'Obtén marca, modelo, año y propietario legal ingresando únicamente el número de matriculación (placa).',
    fields: [
      { key: 'plate', label: 'NÚMERO DE PLACA', required: true, pattern: '^[a-zA-Z]{3}-\\d{4}$|^[a-zA-Z]{3}\\d{4}$', maxlength: 8 }
    ],
    action: (p) => apiService.getVehiclesByPlate(p.plate)
  }
};

// Estado del Dashboard
const currentService = ref<ServiceKey>('id_card');

const queryParams = reactive<Record<string, string>>({});
const isLoading = ref(false);
const errorMsg = ref('');
const resultsData = ref<any>(null);

const currentServiceConfig = computed(() => servicesList[currentService.value]);
const hasResults = computed(() => resultsData.value !== null);

const selectService = (key: ServiceKey) => {
  currentService.value = key;
  // Limpiar estado
  Object.keys(queryParams).forEach(k => delete queryParams[k]);
  resultsData.value = null;
  errorMsg.value = '';
};

const executeSearch = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  resultsData.value = null;

  try {
    const data = await currentServiceConfig.value.action(queryParams);
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
    if (error.response?.status === 404) {
      errorMsg.value = 'El registro solicitado no fue encontrado en la base de datos.';
    } else if (error.response?.status === 422) {
      errorMsg.value = 'Parámetros de consulta estructurados de forma incorrecta (Validación).';
    } else {
      errorMsg.value = error.message || error.response?.data?.message || 'Fallo de conexión crítico al intentar consultar la red.';
    }
  } finally {
    isLoading.value = false;
  }
};

// Formatea los keys de la API para que sean legibles (ej: 'FechaNacimiento' -> 'Fecha Nacimiento').
const formatKey = (key: string) => {
  if (!key) return '';
  return key
    .replace(/([A-Z])/g, ' $1') // Espacios antes de mayúsculas
    .replace(/_/g, ' ') // Guiones bajos a espacios
    .trim();
};

// Helper: Ilumina la salida JSON inyectando spans HTML (Como Fallback)
const syntaxHighlight = (json: any) => {
  if (!json) return '';
  let str = JSON.stringify(json, null, 4);
  
  // Reemplazar keys y primitivos de forma segura
  str = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const htmlOut = str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'text-pale-blue font-bold'; // strings / keys
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'text-smoke/80'; // keys
          } else {
              cls = 'text-[#b8d3b1]'; // string values (soft green)
          }
      } else if (/true|false/.test(match)) {
          cls = 'text-[#d3b1b1]'; // boolean (soft red/orange)
      } else if (/null/.test(match)) {
          cls = 'text-white/30 italic'; // null
      } else {
          cls = 'text-[#b1b8d3]'; // number (pale blue variant)
      }
      return '<span class="' + cls + '">' + match + '</span>';
  });

  // SECURITY: DOMPurify para limpiar el HTML inyectado por terceros (evita XSS injection por APIs hackeadas)
  return DOMPurify.sanitize(htmlOut);
};
</script>

<style scoped>
/* Scoped solo para el dashboard. Base styling (fonts, obsidian bg, overlay) are reused from globals */

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(177, 193, 211, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(177, 193, 211, 0.4);
}

pre {
  margin: 0;
  tab-size: 2;
}
</style>
