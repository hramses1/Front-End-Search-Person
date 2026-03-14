<template>
  <div class="auth-wrapper font-primary relative overflow-hidden flex items-center justify-center p-6">
    <!-- Fondo Atmosférico con Múltiples Capas (Soft Obsidian & Deep Petrol + Grain) -->
    <div class="absolute inset-0 pointer-events-none noise-overlay z-0"></div>
    
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div 
        class="absolute -inset-[50%] opacity-40 blur-[130px] gradient-mesh transition-transform duration-[1000ms] ease-out delay-75"
        :style="{ transform: `translate(${mouseX * -0.04}px, ${mouseY * -0.04}px)` }"
      ></div>
    </div>

    <!-- Contenedor Principal (Soft Neumorphism & Glassmorphism) -->
    <div 
      class="w-full max-w-[440px] p-8 sm:p-12 rounded-[2rem] bg-obsidian-soft border-[0.5px] border-white/5 shadow-negative relative z-10"
    >
      <div class="text-center mb-12 mask-reveal delay-100 relative">
        <h1 class="text-[28px] tracking-[0.25em] font-light text-silver mb-2 drop-shadow-md">PORTAL</h1>
        <p class="text-[10px] uppercase tracking-[0.4em] text-smoke opacity-70">Acesso Restringido</p>
        <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-gradient-to-r from-transparent via-pale-blue/30 to-transparent"></div>
      </div>

      <!-- Selector de Modo Login / Registro -->
      <div class="flex justify-center mb-10 gap-10 text-[11px] font-medium tracking-[0.2em] mask-reveal delay-200">
        <button 
          @click="setMode(true)" 
          :class="isLogin ? 'text-pale-blue' : 'text-smoke hover:text-white/80'"
          class="pb-2 transition-all duration-300 relative group"
        >
          INICIAR
          <span class="absolute bottom-0 left-0 w-full h-[1px] bg-pale-blue/60 transform scale-x-0 transition-transform duration-300 origin-left" :class="isLogin ? 'scale-x-100' : 'group-hover:scale-x-50'"></span>
        </button>
        <button 
          @click="setMode(false)" 
          :class="!isLogin ? 'text-pale-blue' : 'text-smoke hover:text-white/80'"
          class="pb-2 transition-all duration-300 relative group"
        >
          REGISTRO
          <span class="absolute bottom-0 left-0 w-full h-[1px] bg-pale-blue/60 transform scale-x-0 transition-transform duration-300 origin-left" :class="!isLogin ? 'scale-x-100' : 'group-hover:scale-x-50'"></span>
        </button>
      </div>

      <!-- Formulario Interactuable -->
      <form @submit.prevent="handleSubmit" class="space-y-7 relative">
        
        <!-- Vista de Login / Render Token -->
        <transition name="fade-slide" mode="out-in">
          <div v-if="successToken" key="success" class="space-y-7 text-center mask-reveal delay-300">
            <div class="p-6 bg-white/[0.02] border border-pale-blue/20 rounded-xl relative group text-left">
              <p class="text-[10px] text-pale-blue tracking-[0.2em] mb-4 text-center">TOKEN OBTENIDO CON ÉXITO</p>
              <div class="w-full bg-obsidian/80 rounded-lg p-4 overflow-x-auto border-[0.5px] border-white/5">
                <p class="font-mono text-[11px] text-silver break-all opacity-90 select-all">{{ successToken }}</p>
              </div>
            </div>
            <button
              type="button"
              @click="resetLogin"
              class="text-[10px] text-smoke hover:text-white transition-colors tracking-[0.2em] relative inline-block group"
            >
              VOLVER
              <span class="absolute -bottom-1 left-0 w-full h-[1px] bg-white/40 transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
            </button>
          </div>

          <div v-else-if="isLogin" key="login" class="space-y-7">
            <div class="relative group input-container mask-reveal delay-300 relative">
              <input 
                v-model="loginForm.identity" 
                type="text" 
                id="identity"
                required
                class="w-full bg-transparent border-b-[0.5px] border-white/10 text-silver font-light focus:border-pale-blue/50 outline-none pb-2 transition-all duration-300 peer group-hover:border-white/20 custom-input placeholder-transparent"
                placeholder="USUARIO O EMAIL"
              />
              <label 
                for="identity" 
                class="absolute left-0 top-0 text-smoke text-xs tracking-[0.2em] transition-all duration-300 peer-focus:-translate-y-5 peer-focus:text-[10px] peer-focus:text-pale-blue peer-focus:opacity-100 opacity-50 peer-valid:-translate-y-5 peer-valid:text-[10px]"
              >
                USUARIO O EMAIL
              </label>
              <div class="absolute bottom-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-pale-blue/0 via-pale-blue/40 to-pale-blue/0 scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-center"></div>
            </div>

            <div class="relative group input-container mask-reveal delay-400 relative">
              <input 
                v-model="loginForm.password" 
                type="password" 
                id="login_password"
                required
                class="w-full bg-transparent border-b-[0.5px] border-white/10 text-silver font-light focus:border-pale-blue/50 outline-none pb-2 transition-all duration-300 peer group-hover:border-white/20 custom-input placeholder-transparent"
                placeholder="CONTRASEÑA"
              />
              <label 
                for="login_password" 
                class="absolute left-0 top-0 text-smoke text-xs tracking-[0.2em] transition-all duration-300 peer-focus:-translate-y-5 peer-focus:text-[10px] peer-focus:text-pale-blue peer-focus:opacity-100 opacity-50 peer-valid:-translate-y-5 peer-valid:text-[10px]"
              >
                CONTRASEÑA
              </label>
              <div class="absolute bottom-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-pale-blue/0 via-pale-blue/40 to-pale-blue/0 scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-center"></div>
            </div>
          </div>
          
          <!-- Vista de Registro -->
          <div v-else key="register" class="space-y-7">
            <div class="relative group input-container mask-reveal delay-300">
              <input 
                v-model="registerForm.name" 
                type="text" 
                id="name"
                required
                class="w-full bg-transparent border-b-[0.5px] border-white/10 text-silver font-light focus:border-pale-blue/50 outline-none pb-2 transition-all duration-300 peer group-hover:border-white/20 custom-input"
              />
              <label 
                for="name" 
                class="absolute left-0 top-0 text-smoke text-xs tracking-[0.2em] transition-all duration-300 peer-focus:-translate-y-5 peer-focus:text-[10px] peer-focus:text-pale-blue peer-focus:opacity-100 opacity-50 peer-valid:-translate-y-5 peer-valid:text-[10px]"
              >
                NOMBRE COMPLETO
              </label>
              <div class="absolute bottom-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-pale-blue/0 via-pale-blue/40 to-pale-blue/0 scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-center"></div>
            </div>

            <div class="relative group input-container mask-reveal delay-350">
              <input 
                v-model="registerForm.username" 
                type="text" 
                id="username"
                required
                class="w-full bg-transparent border-b-[0.5px] border-white/10 text-silver font-light focus:border-pale-blue/50 outline-none pb-2 transition-all duration-300 peer group-hover:border-white/20 custom-input"
              />
              <label 
                for="username" 
                class="absolute left-0 top-0 text-smoke text-xs tracking-[0.2em] transition-all duration-300 peer-focus:-translate-y-5 peer-focus:text-[10px] peer-focus:text-pale-blue peer-focus:opacity-100 opacity-50 peer-valid:-translate-y-5 peer-valid:text-[10px]"
              >
                USUARIO
              </label>
              <div class="absolute bottom-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-pale-blue/0 via-pale-blue/40 to-pale-blue/0 scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-center"></div>
            </div>

            <div class="relative group input-container mask-reveal delay-400">
              <input 
                v-model="registerForm.email" 
                type="email" 
                id="email"
                required
                class="w-full bg-transparent border-b-[0.5px] border-white/10 text-silver font-light focus:border-pale-blue/50 outline-none pb-2 transition-all duration-300 peer group-hover:border-white/20 custom-input"
              />
              <label 
                for="email" 
                class="absolute left-0 top-0 text-smoke text-xs tracking-[0.2em] transition-all duration-300 peer-focus:-translate-y-5 peer-focus:text-[10px] peer-focus:text-pale-blue peer-focus:opacity-100 opacity-50 peer-valid:-translate-y-5 peer-valid:text-[10px]"
              >
                CORREO ELECTRÓNICO
              </label>
            </div>

            <div class="relative group input-container mask-reveal delay-500">
              <input 
                v-model="registerForm.password" 
                type="password" 
                id="password"
                required
                class="w-full bg-transparent border-b-[0.5px] border-white/10 text-silver font-light focus:border-pale-blue/50 outline-none pb-2 transition-all duration-300 peer group-hover:border-white/20 custom-input"
              />
              <label 
                for="password" 
                class="absolute left-0 top-0 text-smoke text-xs tracking-[0.2em] transition-all duration-300 peer-focus:-translate-y-5 peer-focus:text-[10px] peer-focus:text-pale-blue peer-focus:opacity-100 opacity-50 peer-valid:-translate-y-5 peer-valid:text-[10px]"
              >
                CONTRASEÑA
              </label>
              <div class="absolute bottom-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-pale-blue/0 via-pale-blue/40 to-pale-blue/0 scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-center"></div>
            </div>

            <div class="relative group input-container mask-reveal delay-600">
              <input 
                v-model="registerForm.passwordConfirm" 
                type="password" 
                id="passwordConfirm"
                required
                class="w-full bg-transparent border-b-[0.5px] border-white/10 text-silver font-light focus:border-pale-blue/50 outline-none pb-2 transition-all duration-300 peer group-hover:border-white/20 custom-input"
              />
              <label 
                for="passwordConfirm" 
                class="absolute left-0 top-0 text-smoke text-xs tracking-[0.2em] transition-all duration-300 peer-focus:-translate-y-5 peer-focus:text-[10px] peer-focus:text-pale-blue peer-focus:opacity-100 opacity-50 peer-valid:-translate-y-5 peer-valid:text-[10px]"
              >
                CONFIRMAR CONTRASEÑA
              </label>
            </div>
          </div>
        </transition>

        <div class="min-h-[20px] flex items-center justify-center py-1">
          <transition name="slide-up">
            <p v-if="errorMsg" class="text-red-400/90 text-[11px] tracking-[0.1em] text-center font-medium leading-relaxed">{{ errorMsg }}</p>
            <p v-else-if="successMsg" class="text-pale-blue/90 text-[11px] tracking-[0.1em] text-center font-medium leading-relaxed">{{ successMsg }}</p>
          </transition>
        </div>

        <!-- Botón de Cristal Ahumado (Exposición Sutil) -->
        <div v-if="!successToken" class="pt-2 mask-reveal delay-700">
          <button 
            type="submit" 
            class="w-full py-4 bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-xl text-silver text-[11px] tracking-[0.3em] uppercase transition-all duration-500 overflow-hidden relative group hover-smoke-glass"
            :disabled="isLoading"
          >
            <!-- Efecto de Barrido Lumínico -->
            <div class="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            
            <span class="relative z-10 font-medium transition-all duration-300 flex items-center justify-center gap-3">
              <span v-if="isLoading" class="w-3 h-3 border border-t-transparent border-silver rounded-full animate-spin"></span>
              {{ isLoading ? 'PROCESANDO...' : (isLogin ? 'ACCEDER AL SISTEMA' : 'REGISTRAR') }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';
import { useAuth } from '../composables/useAuth';

const isLogin = ref(true);
const isLoading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');
const successToken = ref('');

const router = useRouter();
const { setToken, setupActivityListeners, setUserRecord, setPlanData } = useAuth();

// Cinemática del fondo
const mouseX = ref(0);
const mouseY = ref(0);

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX - window.innerWidth / 2;
  mouseY.value = e.clientY - window.innerHeight / 2;
};

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
});

const setMode = (mode: boolean) => {
  isLogin.value = mode;
  errorMsg.value = '';
  successToken.value = '';
  if (mode === false) {
    successMsg.value = '';
  }
};

const resetLogin = () => {
  successToken.value = '';
  loginForm.identity = '';
  loginForm.password = '';
};

const loginForm = reactive({
  identity: '',
  password: ''
});

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
  name: '',
  plan: 'free',
  number_requests: 0,
  token: ''
});

const handleSubmit = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  successToken.value = '';
  
  try {
    if (isLogin.value) {
      const response = await authService.login({
        identity: loginForm.identity,
        password: loginForm.password
      });

      // Validamos que exista el record y el ID
      if (response && response.record && response.record.id) {
        // Guardamos el plan y peticiones básicas del usuario
        setUserRecord(response.record);

        // Obtenemos los datos del plan real (planDescription y token_duration)
        try {
          const planData = await authService.getUserPlan(response.record.id);
          if (planData) {
            setPlanData(planData.planDescription || 'FREE', planData.token_duration || 20);
          }
        } catch { /* Si falla, usamos el plan del record */ }
        
        // Obtenemos el token real usando este ID del usuario
        const tokenResponse = await authService.getApiToken(response.record.id);

        if (tokenResponse && tokenResponse.access_token) {
          setToken(tokenResponse.access_token);
          setupActivityListeners();
          router.push('/dashboard');
        } else if (tokenResponse && tokenResponse.token) {
          setToken(tokenResponse.token);
          setupActivityListeners();
          router.push('/dashboard');
        } else {
          throw new Error('No se recibió un token válido en el segundo paso de autenticación.');
        }

      } else {
        throw new Error('Credenciales inválidas o datos de usuario no encontrados.');
      }
    } else {
      // Registro PocketBase
      if (registerForm.password !== registerForm.passwordConfirm) {
        throw new Error('Las contraseñas no concuerdan');
      }
      await authService.register(registerForm);
      
      // Tras registro exitoso, volver a login y mostrar mensaje
      setMode(true);
      successMsg.value = 'USUARIO CREADO, AHORA TE PUEDES LOGEAR CON TU USUARIO Y CONTRASEÑA';
    }
  } catch (error: any) {
    if (isLogin.value && error.response?.status === 401) {
      errorMsg.value = error.response?.data?.detail || 'Credenciales de autenticación inválidas';
    } else {
      errorMsg.value = error.response?.data?.message || error.response?.data?.detail || 'Identificación denegada o error de red.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style>
/* Estilos Globales Atmosféricos que se inyectan en componentes sin scope */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500&display=swap');

.font-primary { 
  font-family: 'Space Grotesk', system-ui, sans-serif; 
}

.auth-wrapper { 
  min-height: 100vh;
  background-color: #121214; 
}

/* Base Obsidian & Grain */
.noise-overlay {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}

.bg-obsidian-soft { 
  background-color: rgba(22, 22, 26, 0.4); 
  backdrop-filter: blur(16px); 
}

.gradient-mesh {
  background: radial-gradient(circle at center, rgba(30, 45, 60, 0.6) 0%, rgba(18, 18, 20, 0) 60%),
              radial-gradient(circle at top right, rgba(40, 50, 70, 0.4) 0%, rgba(18, 18, 20, 0) 50%);
}

.text-silver { color: #e4e4e9; }
.text-smoke { color: #8a8a95; }
.text-pale-blue { color: #b1c1d3; }

/* Negative Shadow para Neumorfismo Oscuro */
.shadow-negative { 
  box-shadow: -15px -15px 30px rgba(255, 255, 255, 0.015), 
               15px 15px 30px rgba(0, 0, 0, 0.6),
               inset 1px 1px 2px rgba(255, 255, 255, 0.03); 
}

/* Smoked Glass Action Button */
.hover-smoke-glass { 
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); 
}
.hover-smoke-glass:hover { 
  backdrop-filter: brightness(1.3) blur(10px); 
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 30px rgba(177, 193, 211, 0.05); /* Glow sutil */
}

/* Animación Cinemática Reveal */
@keyframes maskReveal {
  0% { clip-path: inset(100% 0 0 0); opacity: 0; transform: translateY(15px); }
  100% { clip-path: inset(-10% -10% -10% -10%); opacity: 1; transform: translateY(0); }
}

.mask-reveal {
  opacity: 0;
  animation: maskReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-350 { animation-delay: 350ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }
.delay-600 { animation-delay: 600ms; }
.delay-700 { animation-delay: 700ms; }

@keyframes shimmer {
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Transiciones de Modo */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-15px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(15px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Fix Autocomplete para Chrome respetando diseño dark */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px #16161a inset !important;
  -webkit-text-fill-color: #e4e4e9 !important;
  transition: background-color 5000s ease-in-out 0s;
  border-bottom: 0.5px solid rgba(255,255,255,0.1);
}
</style>
