<template>
  <div class="auth-wrapper font-primary relative overflow-hidden flex items-center justify-center p-6">
    <!-- Fondo Atmosférico con Múltiples Capas (Soft Obsidian & Deep Petrol + Grain) -->
    <div class="absolute inset-0 pointer-events-none noise-overlay z-0"></div>
    
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0" style="will-change: transform; transform: translateZ(0);">
      <div 
        class="absolute -inset-[50%] opacity-40 blur-[130px] gradient-mesh transition-transform duration-[1000ms] ease-out delay-75"
        :style="{ transform: `translate3d(${mouseX * -0.04}px, ${mouseY * -0.04}px, 0)` }"
      ></div>
    </div>

    <!-- Contenedor Principal (Soft Neumorphism & Glassmorphism) -->
    <div 
      class="w-full max-w-[440px] p-8 sm:p-12 rounded-[2rem] bg-obsidian-soft border-[0.5px] relative z-10 shadow-negative"
      style="border-color: var(--border-color);"
    >
      <div class="text-center mb-12 mask-reveal delay-100 relative">
        <h1 class="text-[28px] tracking-[0.25em] font-light mb-2 drop-shadow-md" style="color: var(--text-primary);">PORTAL</h1>
        <p class="text-[10px] uppercase tracking-[0.4em]" style="color: var(--text-secondary);">Acesso Restringido</p>
        <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-gradient-to-r from-transparent via-pale-blue/30 to-transparent"></div>
      </div>

      <!-- Selector de Modo Login / Registro -->
      <div class="flex justify-center mb-10 gap-10 text-[11px] font-medium tracking-[0.2em] mask-reveal delay-200">
        <button 
          @click="setMode(true)" 
          :style="{ color: isLogin ? 'var(--accent-color)' : 'var(--text-secondary)' }"
          class="pb-2 transition-all duration-300 relative group"
        >
          INICIAR
          <span class="absolute bottom-0 left-0 w-full h-[1px] transform scale-x-0 transition-transform duration-300 origin-left" :class="isLogin ? 'scale-x-100' : 'group-hover:scale-x-50'" style="background-color: var(--accent-color);"></span>
        </button>
        <button 
          @click="setMode(false)" 
          :style="{ color: !isLogin ? 'var(--accent-color)' : 'var(--text-secondary)' }"
          class="pb-2 transition-all duration-300 relative group"
        >
          REGISTRO
          <span class="absolute bottom-0 left-0 w-full h-[1px] transform scale-x-0 transition-transform duration-300 origin-left" :class="!isLogin ? 'scale-x-100' : 'group-hover:scale-x-50'" style="background-color: var(--accent-color);"></span>
        </button>
      </div>

      <!-- Formulario Interactuable -->
      <form @submit.prevent="handleSubmit" class="space-y-7 relative">
        
        <!-- Vista de Login / Render Token -->
        <transition name="fade-slide" mode="out-in">
          <div v-if="successToken" key="success" class="space-y-7 text-center mask-reveal delay-300">
            <div class="p-6 border rounded-xl relative group text-left" style="background-color: var(--card-bg); border-color: var(--border-color);">
              <p class="text-[10px] tracking-[0.2em] mb-4 text-center" style="color: var(--accent-color);">TOKEN OBTENIDO CON ÉXITO</p>
              <div class="w-full rounded-lg p-4 overflow-x-auto border-[0.5px]" style="background-color: rgba(0,0,0,0.1); border-color: var(--border-color);">
                <p class="font-mono text-[11px] break-all opacity-90 select-all" style="color: var(--text-primary);">{{ successToken }}</p>
              </div>
            </div>
            <button
              type="button"
              @click="resetLogin"
              class="text-[10px] transition-colors tracking-[0.2em] relative inline-block group"
              style="color: var(--text-secondary);"
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

            <div class="relative group input-container mask-reveal delay-400 relative">
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
          </div>
          
          <!-- Vista de Registro -->
          <div v-else key="register" class="space-y-7">
            <div class="relative group input-container mask-reveal delay-300">
              <input 
                v-model="registerForm.name" 
                type="text" 
                id="name"
                required
                @input="validateField('name')"
                :class="registerErrors.name ? 'border-red-500/50 focus:border-red-500' : ''"
                class="w-full bg-transparent border-b-[0.5px] font-light outline-none pb-2 transition-all duration-300 peer custom-input"
                style="color: var(--text-primary); border-color: var(--input-border); caret-color: var(--accent-color);"
              />
              <label 
                for="name" 
                class="absolute left-0 top-0 text-xs tracking-[0.2em] transition-all duration-300 peer-focus:-translate-y-5 peer-focus:text-[10px] peer-focus:opacity-100 opacity-50 peer-valid:-translate-y-5 peer-valid:text-[10px]"
                style="color: var(--text-secondary);"
              >
                NOMBRE COMPLETO
              </label>
              <div v-if="registerErrors.name" class="text-red-400 text-[9px] mt-1 tracking-wider uppercase">{{ registerErrors.name }}</div>
              <div v-else class="absolute bottom-0 left-0 w-full h-[0.5px] scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-center" style="background-color: var(--accent-color);"></div>
            </div>

            <div class="relative group input-container mask-reveal delay-350">
              <input 
                v-model="registerForm.username" 
                type="text" 
                id="username"
                required
                @input="validateField('username')"
                :class="registerErrors.username ? 'border-red-500/50 focus:border-red-500' : ''"
                class="w-full bg-transparent border-b-[0.5px] font-light outline-none pb-2 transition-all duration-300 peer custom-input"
                style="color: var(--text-primary); border-color: var(--input-border); caret-color: var(--accent-color);"
              />
              <label 
                for="username" 
                class="absolute left-0 top-0 text-xs tracking-[0.2em] transition-all duration-300 peer-focus:-translate-y-5 peer-focus:text-[10px] peer-focus:opacity-100 opacity-50 peer-valid:-translate-y-5 peer-valid:text-[10px]"
                style="color: var(--text-secondary);"
              >
                USUARIO
              </label>
              <div v-if="registerErrors.username" class="text-red-400 text-[9px] mt-1 tracking-wider uppercase">{{ registerErrors.username }}</div>
              <div v-else class="absolute bottom-0 left-0 w-full h-[0.5px] scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-center" style="background-color: var(--accent-color);"></div>
            </div>

            <div class="relative group input-container mask-reveal delay-400">
              <input 
                v-model="registerForm.email" 
                type="email" 
                id="email"
                required
                @input="validateField('email')"
                :class="registerErrors.email ? 'border-red-500/50 focus:border-red-500' : ''"
                class="w-full bg-transparent border-b-[0.5px] font-light outline-none pb-2 transition-all duration-300 peer custom-input placeholder-transparent"
                style="color: var(--text-primary); border-color: var(--input-border); caret-color: var(--accent-color);"
                placeholder="CORREO ELECTRÓNICO"
              />
              <label 
                for="email" 
                class="absolute left-0 top-0 text-xs tracking-[0.2em] transition-all duration-300 peer-focus:-translate-y-5 peer-focus:text-[10px] peer-focus:opacity-100 opacity-50 peer-valid:-translate-y-5 peer-valid:text-[10px]"
                style="color: var(--text-secondary);"
              >
                CORREO ELECTRÓNICO
              </label>
              <div v-if="registerErrors.email" class="text-red-400 text-[9px] mt-1 tracking-wider uppercase">{{ registerErrors.email }}</div>
            </div>

            <div class="relative group input-container mask-reveal delay-500">
              <input 
                v-model="registerForm.password" 
                type="password" 
                id="password"
                required
                minlength="9"
                @input="validateField('password')"
                :class="registerErrors.password ? 'border-red-500/50 focus:border-red-500' : ''"
                class="w-full bg-transparent border-b-[0.5px] font-light outline-none pb-2 transition-all duration-300 peer custom-input placeholder-transparent"
                style="color: var(--text-primary); border-color: var(--input-border); caret-color: var(--accent-color);"
                placeholder="CONTRASEÑA"
              />
              <label 
                for="password" 
                class="absolute left-0 top-0 text-xs tracking-[0.2em] transition-all duration-300 peer-focus:-translate-y-5 peer-focus:text-[10px] peer-focus:opacity-100 opacity-50 peer-valid:-translate-y-5 peer-valid:text-[10px]"
                style="color: var(--text-secondary);"
              >
                CONTRASEÑA
              </label>
              <div v-if="registerErrors.password" class="text-red-400 text-[9px] mt-1 tracking-wider uppercase">{{ registerErrors.password }}</div>
              <div v-else class="absolute bottom-0 left-0 w-full h-[0.5px] scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-center" style="background-color: var(--accent-color);"></div>
            </div>

            <div class="relative group input-container mask-reveal delay-600">
              <input 
                v-model="registerForm.passwordConfirm" 
                type="password" 
                id="passwordConfirm"
                required
                minlength="9"
                @input="validateField('passwordConfirm')"
                :class="registerErrors.passwordConfirm ? 'border-red-500/50 focus:border-red-500' : ''"
                class="w-full bg-transparent border-b-[0.5px] font-light outline-none pb-2 transition-all duration-300 peer custom-input placeholder-transparent"
                style="color: var(--text-primary); border-color: var(--input-border); caret-color: var(--accent-color);"
                placeholder="CONFIRMAR CONTRASEÑA"
              />
              <label 
                for="passwordConfirm" 
                class="absolute left-0 top-0 text-xs tracking-[0.2em] transition-all duration-300 peer-focus:-translate-y-5 peer-focus:text-[10px] peer-focus:opacity-100 opacity-50 peer-valid:-translate-y-5 peer-valid:text-[10px]"
                style="color: var(--text-secondary);"
              >
                CONFIRMAR CONTRASEÑA
              </label>
              <div v-if="registerErrors.passwordConfirm" class="text-red-400 text-[9px] mt-1 tracking-wider uppercase">{{ registerErrors.passwordConfirm }}</div>
            </div>
          </div>
        </transition>

        <div class="min-h-[20px] flex items-center justify-center py-1">
          <transition name="slide-up">
            <p v-if="errorMsg" class="text-red-400/90 text-[11px] tracking-[0.1em] text-center font-medium leading-relaxed">{{ errorMsg }}</p>
            <p v-else-if="successMsg" class="text-[11px] tracking-[0.1em] text-center font-medium leading-relaxed" style="color: var(--accent-color);">{{ successMsg }}</p>
          </transition>
        </div>

        <!-- Botón de Cristal Ahumado (Exposición Sutil) -->
        <div v-if="!successToken" class="pt-2 mask-reveal delay-700">
          <button 
            type="submit" 
            class="w-full py-4 border rounded-xl text-[11px] tracking-[0.3em] uppercase transition-all duration-500 overflow-hidden relative group hover-smoke-glass"
            style="background-color: var(--glass-bg); border-color: var(--border-color); color: var(--text-primary);"
            :disabled="isLoading"
          >
            <!-- Efecto de Barrido Lumínico -->
            <div class="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            
            <span class="relative z-10 font-medium transition-all duration-300 flex items-center justify-center gap-3">
              <span v-if="isLoading && !isGoogleLoading" class="w-3 h-3 border border-t-transparent border-current rounded-full animate-spin"></span>
              {{ (isLoading && !isGoogleLoading) ? 'PROCESANDO...' : (isLogin ? 'ACCEDER AL SISTEMA' : 'REGISTRAR') }}
            </span>
          </button>
        </div>

        <!-- Divisor -->
        <div v-if="!successToken" class="flex items-center gap-4 mask-reveal delay-700 mt-6">
          <div class="h-[1px] flex-1" style="background-color: var(--border-color);"></div>
          <span class="text-[10px] tracking-widest text-smoke">O</span>
          <div class="h-[1px] flex-1" style="background-color: var(--border-color);"></div>
        </div>

        <!-- Botón Google Login -->
        <div v-if="!successToken" class="mask-reveal delay-700 mt-6">
          <button 
            type="button" 
            @click="initiateGoogleLogin"
            class="w-full py-4 border rounded-xl text-[11px] tracking-[0.2em] font-medium transition-all duration-400 flex items-center justify-center gap-3 relative group overflow-hidden"
            style="background-color: var(--bg-color); border-color: var(--border-color); color: var(--text-primary);"
            :disabled="isLoading"
          >
            <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" style="background-color: var(--accent-color);"></div>
            <span v-if="isGoogleLoading" class="w-3 h-3 border border-t-transparent border-current rounded-full animate-spin"></span>
            <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {{ isGoogleLoading ? 'CONECTANDO...' : 'CONTINUAR CON GOOGLE' }}
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
const isGoogleLoading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');
const successToken = ref('');

// Errores en tiempo real para Registro
const registerErrors = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  passwordConfirm: ''
});

const router = useRouter();
const { setToken, setupActivityListeners, setUserRecord, setPlanData } = useAuth();

// Cinemática del fondo optimizada para evitar lagazo
const mouseX = ref(0);
const mouseY = ref(0);
let ticking = false;

const handleMouseMove = (e: MouseEvent) => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      mouseX.value = e.clientX - window.innerWidth / 2;
      mouseY.value = e.clientY - window.innerHeight / 2;
      ticking = false;
    });
    ticking = true;
  }
};

const handleOAuthCallback = async () => {
  // Maneja la redirección de Google leyendo los parámetros en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const state = urlParams.get('state');
  const code = urlParams.get('code');

  if (state && code) {
    const savedState = sessionStorage.getItem('oauth_state');
    const provider = sessionStorage.getItem('oauth_provider');
    const codeVerifier = sessionStorage.getItem('oauth_code_verifier');
    
    // Limpiar url para seguridad visual
    window.history.replaceState({}, document.title, window.location.pathname);

    if (state !== savedState) {
      errorMsg.value = 'Error de seguridad Oauth2 (State mismatch). Intente nuevamente.';
      return;
    }

    if (provider && codeVerifier) {
      isGoogleLoading.value = true;
      isLoading.value = true;
      try {
        const redirectUrl = window.location.origin + window.location.pathname; 
        const response = await authService.authWithOAuth2(provider, code, codeVerifier, redirectUrl);
        
        if (response && response.record) {
          
          let finalToken = response.token;
          
          // Generar el token oficial del sistema (requerido para todo el flujo)
          try {
             const systemLoginResponse = await authService.getSystemToken(response.record.id);
             if (systemLoginResponse && systemLoginResponse.token) {
                 finalToken = systemLoginResponse.token;
             }
          } catch(e) {
             console.error('Error generando token de sistema post-oauth2:', e);
          }

          // Guardar datos
          setUserRecord(response.record);
          setToken(finalToken);
          setupActivityListeners();

          // Obtener el plan del usuario
          try {
            const planData = await authService.getUserPlan(response.record.id);
            if (planData) {
              setPlanData(planData.planDescription || 'FREE', planData.token_duration || 20, planData.id);
            }
          } catch (e) {
            console.error('Error al recuperar descripción del plan tras oauth:', e);
          }

          // Redirección Exitosa
          router.push('/dashboard');
        } else {
          throw new Error('Fallo la autenticación con el proveedor.');
        }
      } catch (err: any) {
        errorMsg.value = err.response?.data?.message || err.message || 'Error autenticando con Google.';
      } finally {
        isGoogleLoading.value = false;
        isLoading.value = false;
        // Limpiar params temporales de oauth
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_provider');
        sessionStorage.removeItem('oauth_code_verifier');
      }
    }
  }
};

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  // Verificar si venimos desde google
  handleOAuthCallback();
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
});

const initiateGoogleLogin = async () => {
  isGoogleLoading.value = true;
  isLoading.value = true;
  errorMsg.value = '';

  try {
    const methods = await authService.getAuthMethods();
    if (methods && methods.authProviders && methods.authProviders.length > 0) {
      // Normalmente Google es el primer proveedor si está bien configurado
      const googleProvider = methods.authProviders.find((p: any) => p.name === 'google') || methods.authProviders[0];
      
      if (googleProvider) {
        // Guardar valores en sessionStorage para el callback
        sessionStorage.setItem('oauth_provider', googleProvider.name);
        sessionStorage.setItem('oauth_state', googleProvider.state);
        sessionStorage.setItem('oauth_code_verifier', googleProvider.codeVerifier);
        
        // Redirigir a la URL de Google rellenando nuestra redirect_uri base
        // NOTA: Para este flujo en Frontend (SPA), el redirect_uri debe ser SIEMPRE la URL de la aplicación Vue (ej: http://localhost:5174/auth)
        // Y ESE MISMO enlace exacto debe agregarse obligatoriamente en la Consola de Google Cloud en "URIs de redireccionamiento autorizados".
        const redirectUrl = window.location.origin + window.location.pathname; 
        const finalUrl = googleProvider.authUrl + encodeURIComponent(redirectUrl);
        
        window.location.href = finalUrl;
      } else {
        errorMsg.value = 'Proveedor de Google no encontrado en la configuración.';
        isGoogleLoading.value = false;
        isLoading.value = false;
      }
    } else {
      errorMsg.value = 'La autenticación por métodos externos no está disponible en este momento.';
      isGoogleLoading.value = false;
      isLoading.value = false;
    }
  } catch (error) {
    errorMsg.value = 'No se pudo contactar con el servicio de autenticación.';
    isGoogleLoading.value = false;
    isLoading.value = false;
  }
};

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

const validateEmail = (email: string) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

const validateUsername = (username: string) => {
  if (username.length < 4) return 'Mínimo 4 caracteres.';
  if (username.length > 20) return 'Máximo 20 caracteres.';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Sólo letras, números y guiones bajos.';
  if (!/[a-zA-Z]/.test(username)) return 'Debe contener al menos una letra.';
  
  // Blacklist de patrones basura
  const junkPatterns = [
    /^(.)\1{2,}$/, // aaa, bbb, 111...
    /^(abc|abcd|abcde|123|1234|12345|qwer|asdf|zxcv|admin|root|null|undefined|usuario|user|password|qwerty|asdfgh|asdfghjkl)$/i,
  ];

  if (junkPatterns.some(pattern => pattern.test(username.toLowerCase()))) {
    return 'Nombre de usuario no permitido o demasiado simple.';
  }
  
  // Detectar secuencias repetitivas como 'xyxyxy'
  if (username.length >= 6) {
    const part1 = username.substring(0, username.length / 2);
    const part2 = username.substring(username.length / 2);
    if (part1 === part2) return 'Evita patrones repetitivos.';
  }
  
  return '';
};

const validatePassword = (password: string) => {
  const hasMinLength = password.length >= 9;
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasMinLength) return 'Mínimo 9 caracteres.';
  if (!hasLetters || !hasNumbers) return 'Debe contener letras y números.';
  if (!hasSpecial) return 'Debe incluir un carácter especial.';
  
  return '';
};

const validateField = (field: 'name' | 'username' | 'email' | 'password' | 'passwordConfirm') => {
  if (isLogin.value) return;

  switch (field) {
    case 'name':
      registerErrors.name = registerForm.name.trim().length >= 3 ? '' : 'Nombre demasiado corto.';
      break;
    case 'username':
      registerErrors.username = validateUsername(registerForm.username);
      break;
    case 'email':
      registerErrors.email = validateEmail(registerForm.email) ? '' : 'Correo electrónico inválido.';
      break;
    case 'password':
      registerErrors.password = validatePassword(registerForm.password);
      if (registerForm.passwordConfirm) validateField('passwordConfirm');
      break;
    case 'passwordConfirm':
      registerErrors.passwordConfirm = registerForm.password === registerForm.passwordConfirm ? '' : 'Las contraseñas no coinciden.';
      break;
  }
};

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
        // Guardamos los datos básicos iniciales
        setUserRecord(response.record);

        // OBLIGATORIO: Obtener descripción real del plan antes de entrar
        try {
          const planData = await authService.getUserPlan(response.record.id);
          if (planData) {
            // Esto actualiza el 'userPlan' global con la descripción (ej: ADMIN)
            setPlanData(planData.planDescription || 'FREE', planData.token_duration || 20, planData.id);
          }
        } catch (e) {
          console.error('Error al recuperar descripción del plan:', e);
        }
        
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
      // Validaciones finales antes de enviar
      validateField('name');
      validateField('username');
      validateField('email');
      validateField('password');
      validateField('passwordConfirm');

      const hasErrors = Object.values(registerErrors).some(err => err !== '');
      if (hasErrors) {
        errorMsg.value = 'Por favor, corrige los errores en el formulario.';
        isLoading.value = false;
        return;
      }
      
      // Registro PocketBase
      await authService.register(registerForm);
      
      // Tras registro exitoso, volver a login y mostrar mensaje
      setMode(true);
      successMsg.value = 'USUARIO CREADO, AHORA TE PUEDES LOGEAR CON TU USUARIO Y CONTRASEÑA';
    }
  } catch (error: any) {
    const detail = error.response?.data?.detail;
    
    if (detail === 'Has superado el límite de peticiones') {
      errorMsg.value = 'ACCESO DENEGADO: Has agotado tu límite de peticiones. Por favor, contacta con soporte para renovar tu plan.';
    } else if (isLogin.value && error.response?.status === 401) {
      errorMsg.value = detail || 'Credenciales de autenticación inválidas';
    } else {
      errorMsg.value = error.response?.data?.message || detail || 'Identificación denegada o error de red.';
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
  background-color: var(--bg-color); 
}

/* Base Obsidian & Grain */
.noise-overlay {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}

.bg-obsidian-soft { 
  background-color: var(--surface-color); 
  backdrop-filter: blur(16px); 
}

.gradient-mesh {
  background: radial-gradient(circle at center, rgba(30, 45, 60, 0.6) 0%, rgba(18, 18, 20, 0) 60%),
              radial-gradient(circle at top right, rgba(40, 50, 70, 0.4) 0%, rgba(18, 18, 20, 0) 50%);
}

.text-silver { color: var(--text-primary); }
.text-smoke { color: var(--text-secondary); }
.text-pale-blue { color: var(--accent-color); }

/* Negative Shadow para Neumorfismo Oscuro / Suave */
.shadow-negative { 
  box-shadow: -10px -10px 20px var(--shadow-color), 
               10px 10px 20px var(--shadow-color),
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

/* Animación Cinemática Reveal - Optimizada */
@keyframes maskReveal {
  0% { opacity: 0; transform: translate3d(0, 10px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}

.mask-reveal {
  opacity: 0;
  will-change: transform, opacity;
  animation: maskReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.delay-100 { animation-delay: 50ms; }
.delay-200 { animation-delay: 100ms; }
.delay-300 { animation-delay: 150ms; }
.delay-350 { animation-delay: 175ms; }
.delay-400 { animation-delay: 200ms; }
.delay-500 { animation-delay: 250ms; }
.delay-600 { animation-delay: 300ms; }
.delay-700 { animation-delay: 350ms; }

@keyframes shimmer {
  100% { transform: translate3d(100%, 0, 0); }
}
.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Transiciones de Modo - Optimizadas */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translate3d(0, 10px, 0);
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
