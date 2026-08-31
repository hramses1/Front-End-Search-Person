<template>
  <div class="font-primary min-h-screen relative selection:bg-[var(--accent-color)]/30" style="background-color: var(--bg-color); color: var(--text-primary);">
    <div class="absolute inset-0 pointer-events-none noise-overlay z-0 opacity-20"></div>
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-color)]/5 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent-color)]/3 blur-[100px] rounded-full"></div>
    </div>

    <div class="relative z-10 max-w-5xl mx-auto px-6 sm:px-8">

      <!-- Barra superior -->
      <header class="flex items-center justify-between py-6">
        <div>
          <p class="text-[13px] leading-tight tracking-[0.15em] font-light uppercase">
            Portal de
            <span class="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFDD00] via-[#0033A0] to-[#ED1C24]">
              Consulta Ciudadana
            </span>
          </p>
          <div class="mt-2 flex gap-1">
            <div class="h-1 w-6 rounded-full bg-[#FFDD00]"></div>
            <div class="h-1 w-3 rounded-full bg-[#0033A0]"></div>
            <div class="h-1 w-2 rounded-full bg-[#ED1C24]"></div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button @click="toggleTheme" class="p-2.5 glass-panel rounded-2xl text-[var(--accent-color)] active:scale-90 transition-transform">
            <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="1.8" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="1.8" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
          </button>
          <button v-if="isAuthenticated" @click="router.push('/dashboard')" class="btn-primary">Ir al panel</button>
          <button v-else @click="router.push('/auth')" class="btn-primary">Acceder</button>
        </div>
      </header>

      <!-- Portada -->
      <section class="py-16 sm:py-24 text-center">
        <p class="text-[9px] font-black tracking-[0.35em] uppercase opacity-40 mb-6">Datos públicos del Ecuador</p>
        <h1 class="text-3xl sm:text-5xl font-light leading-[1.15] tracking-tight max-w-3xl mx-auto">
          Verifica identidad, RUC, licencias y vehículos
          <span class="font-black text-[var(--accent-color)]">en una sola consulta</span>
        </h1>
        <p class="mt-6 text-[13px] sm:text-sm leading-relaxed opacity-60 max-w-xl mx-auto">
          Registro Civil, SRI y ANT desde una misma pantalla. Escribes una cédula y recibes
          la ficha completa, sin saltar entre portales ni repetir captchas.
        </p>
        <div class="mt-10 flex flex-wrap gap-3 justify-center">
          <button @click="router.push('/auth')" class="btn-primary">Crear cuenta gratis</button>
          <a href="#consultas" class="px-8 py-3.5 rounded-2xl border border-[var(--border-color)] text-[10px] uppercase tracking-[0.1em] font-medium hover:bg-[var(--accent-color)]/5 transition-all">
            Ver consultas
          </a>
        </div>
      </section>

      <!-- Ventajas -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-20">
        <div v-for="v in ventajas" :key="v.titulo" class="glass-card p-6">
          <svg class="w-5 h-5 text-[var(--accent-color)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-for="d in v.icon" :key="d" :d="d" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" />
          </svg>
          <h3 class="text-[12px] font-bold tracking-wide mb-2">{{ v.titulo }}</h3>
          <p class="text-[11px] leading-relaxed opacity-50">{{ v.texto }}</p>
        </div>
      </section>

      <!-- Catálogo de consultas -->
      <section id="consultas" class="pb-20 scroll-mt-8">
        <p class="text-[9px] font-black tracking-[0.3em] uppercase opacity-40 mb-2">Consultas disponibles</p>
        <h2 class="text-2xl font-light tracking-tight mb-8">Qué puedes averiguar</h2>

        <div v-for="grupo in catalogo" :key="grupo.label" class="mb-8">
          <p class="text-[9px] font-black tracking-[0.25em] uppercase opacity-40 mb-3">{{ grupo.label }}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              v-for="item in grupo.items" :key="item.titulo"
              @click="pedirRegistro(item)"
              class="glass-card p-5 text-left hover:border-[var(--accent-color)]/40 hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div class="flex items-start justify-between gap-3 mb-2">
                <h3 class="text-[12px] font-bold tracking-wide">{{ item.titulo }}</h3>
                <svg class="w-3.5 h-3.5 shrink-0 opacity-20 group-hover:opacity-60 group-hover:text-[var(--accent-color)] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p class="text-[11px] leading-relaxed opacity-50">{{ item.texto }}</p>
            </button>
          </div>
        </div>
      </section>

      <!-- Guías -->
      <section id="guias" class="pb-20 scroll-mt-8">
        <p class="text-[9px] font-black tracking-[0.3em] uppercase opacity-40 mb-2">Guías</p>
        <h2 class="text-2xl font-light tracking-tight mb-8">Cómo se leen los documentos ecuatorianos</h2>

        <div class="space-y-3">
          <article v-for="(g, i) in guias" :key="g.titulo" class="glass-card overflow-hidden">
            <button @click="guiaAbierta = guiaAbierta === i ? -1 : i" class="w-full flex items-start justify-between gap-4 p-6 text-left">
              <div>
                <h3 class="text-[13px] font-bold tracking-wide mb-1">{{ g.titulo }}</h3>
                <p class="text-[11px] opacity-50">{{ g.resumen }}</p>
              </div>
              <svg class="w-4 h-4 shrink-0 mt-1 opacity-40 transition-transform duration-300" :class="guiaAbierta === i ? 'rotate-180 text-[var(--accent-color)]' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="guiaAbierta === i" class="px-6 pb-6 space-y-3 border-t border-[var(--border-color)] pt-4">
              <p v-for="(par, j) in g.cuerpo" :key="j" class="text-[12px] leading-relaxed opacity-70">{{ par }}</p>
            </div>
          </article>
        </div>
      </section>

      <!-- Preguntas frecuentes -->
      <section id="faq" class="pb-20 scroll-mt-8">
        <p class="text-[9px] font-black tracking-[0.3em] uppercase opacity-40 mb-2">Preguntas frecuentes</p>
        <h2 class="text-2xl font-light tracking-tight mb-8">Dudas habituales</h2>

        <div class="glass-card divide-y divide-[var(--border-color)]">
          <div v-for="(f, i) in faq" :key="f.p">
            <button @click="faqAbierta = faqAbierta === i ? -1 : i" class="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
              <span class="text-[12px] font-bold tracking-wide">{{ f.p }}</span>
              <span class="text-[var(--accent-color)] text-lg leading-none shrink-0 transition-transform duration-300" :class="faqAbierta === i ? 'rotate-45' : ''">+</span>
            </button>
            <p v-if="faqAbierta === i" class="px-6 pb-5 text-[12px] leading-relaxed opacity-70">{{ f.r }}</p>
          </div>
        </div>
      </section>

      <!-- Cierre -->
      <section class="pb-20">
        <div class="glass-card p-10 text-center">
          <h2 class="text-xl sm:text-2xl font-light tracking-tight mb-3">Crea tu cuenta y empieza a consultar</h2>
          <p class="text-[12px] opacity-50 max-w-md mx-auto mb-8">
            El registro es gratuito y no pide tarjeta. Cada cuenta trae su cuota diaria de
            consultas, que se renueva sola cada veinticuatro horas.
          </p>
          <button @click="router.push('/auth')" class="btn-primary">Crear cuenta gratis</button>
        </div>
      </section>

      <!-- Pie -->
      <footer class="border-t border-[var(--border-color)] py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="flex flex-wrap gap-6 justify-center">
          <component
            v-for="l in enlacesLegales" :key="l.texto"
            :is="l.ruta ? 'button' : 'a'"
            :href="l.ruta ? undefined : l.href"
            @click="l.ruta && router.push(l.ruta)"
            class="text-[10px] uppercase tracking-[0.15em] opacity-40 hover:opacity-100 hover:text-[var(--accent-color)] transition-all"
          >
            {{ l.texto }}
          </component>
        </div>
        <p class="text-[9px] uppercase tracking-[0.2em] opacity-30">Devzio · {{ anio }}</p>
      </footer>
    </div>

    <!-- Muro de registro -->
    <transition
      enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0"
    >
      <div v-if="muro" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md" @click.self="muro = null">
        <div class="w-full max-w-sm glass-card p-8 animate-fade-in shadow-2xl">
          <p class="text-[9px] font-black tracking-[0.3em] uppercase opacity-40 mb-2">Requiere cuenta</p>
          <h3 class="text-lg font-light tracking-tight mb-3">{{ muro.titulo }}</h3>
          <p class="text-[12px] leading-relaxed opacity-60 mb-6">{{ muro.texto }}</p>

          <ul class="space-y-2 mb-8">
            <li v-for="b in beneficios" :key="b" class="flex items-start gap-2.5 text-[11px] opacity-70">
              <svg class="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              {{ b }}
            </li>
          </ul>

          <div class="flex gap-3">
            <button @click="muro = null" class="flex-1 py-3.5 rounded-2xl border border-[var(--border-color)] text-[10px] uppercase tracking-[0.1em] font-medium hover:bg-white/5 transition-all">
              Ahora no
            </button>
            <button @click="router.push('/auth')" class="flex-1 btn-primary">Crear cuenta</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { isAuthenticated, isDark, toggleTheme } = useAuth();

const anio = new Date().getFullYear();
const guiaAbierta = ref(-1);
const faqAbierta = ref(-1);
const muro = ref<{ titulo: string; texto: string } | null>(null);

/** Cualquier consulta desde la portada exige cuenta: no hay modo demo. */
const pedirRegistro = (item: { titulo: string; texto: string }) => {
  muro.value = item;
};

const beneficios = [
  'Cuota diaria que se renueva sola cada 24 horas',
  'Acceso a las nueve consultas del catálogo',
  'Sin tarjeta de crédito ni permanencia'
];

const ventajas = [
  {
    titulo: 'Resultado inmediato',
    texto: 'La consulta se resuelve contra la fuente en el momento. Sin colas ni esperas.',
    icon: ['M13 10V3L4 14h7v7l9-11h-7z']
  },
  {
    titulo: 'Fuentes oficiales',
    texto: 'Registro Civil, SRI y ANT. No se inventa ni se completa nada por nuestra cuenta.',
    icon: ['M9 12l2 2 4-4', 'M12 3l7 4v5c0 4.418-2.985 8.167-7 9-4.015-.833-7-4.582-7-9V7l7-4z']
  },
  {
    titulo: 'Un solo lugar',
    texto: 'Identidad, tributario, tránsito y judicial sin saltar entre portales distintos.',
    icon: ['M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z']
  },
  {
    titulo: 'Cuota transparente',
    texto: 'Ves cuántas consultas llevas y cuándo se renuevan. Sin cargos sorpresa.',
    icon: ['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z']
  }
];

const catalogo = [
  {
    label: 'Identidad',
    items: [
      { titulo: 'Buscar por cédula', texto: 'Nombres, apellidos, fecha de nacimiento, estado civil y lugar de nacimiento.' },
      { titulo: 'Buscar por nombre', texto: 'Localiza a una persona a partir de sus nombres y apellidos completos.' }
    ]
  },
  {
    label: 'Judicial',
    items: [
      { titulo: 'Denuncias', texto: 'Causas en las que la cédula figura como demandado, con materia y judicatura.' },
      { titulo: 'Juicios como demandante', texto: 'Procesos en los que la persona actúa como actor, no como demandado.' }
    ]
  },
  {
    label: 'Tránsito',
    items: [
      { titulo: 'Licencia', texto: 'Tipos de licencia, vigencia, puntos disponibles y bloqueos según la ANT.' },
      { titulo: 'Multas e infracciones', texto: 'Citaciones con entidad, artículo infringido, puntos y total a pagar.' },
      { titulo: 'Datos del vehículo', texto: 'Marca, modelo, año, clase y servicio a partir del número de placa.' }
    ]
  },
  {
    label: 'Tributario',
    items: [
      { titulo: 'Estado del RUC', texto: 'Razón social, estado del contribuyente, actividad económica y establecimientos.' }
    ]
  }
];

const guias = [
  {
    titulo: 'Qué información contiene la cédula',
    resumen: 'Los diez dígitos no son un número correlativo: codifican datos.',
    cuerpo: [
      'Los dos primeros dígitos corresponden a la provincia de emisión, del 01 al 24 siguiendo el orden alfabético oficial. Pichincha es 17, Guayas 09 y Azuay 01. Un número fuera de ese rango no pertenece a una cédula válida.',
      'El tercer dígito distingue el tipo de identificación. Para personas naturales siempre es menor que seis; los valores seis y nueve quedan reservados para entidades del sector público y sociedades privadas, que aparecen en el RUC pero nunca en una cédula.',
      'El último dígito es un verificador que se calcula con el algoritmo de módulo diez sobre los nueve anteriores. Por eso un error de tecleo casi siempre produce un número inválido, en lugar de la cédula de otra persona.'
    ]
  },
  {
    titulo: 'Cédula y RUC: en qué se diferencian',
    resumen: 'Uno identifica a la persona; el otro, a su actividad económica.',
    cuerpo: [
      'La cédula identifica a la persona ante el Registro Civil. El RUC la identifica ante el SRI como contribuyente, y por eso solo lo tiene quien ejerce una actividad económica registrada.',
      'En una persona natural el RUC se construye sobre su cédula: los mismos diez dígitos más el sufijo 001, que numera el establecimiento. De ahí que trece dígitos terminados en 001 correspondan casi siempre a un profesional o comerciante individual.',
      'Las sociedades no parten de ninguna cédula. Su RUC lleva un nueve en la tercera posición y se asigna al constituirse. Buscar esa persona jurídica por cédula no devuelve nada, porque no existe como persona natural.'
    ]
  },
  {
    titulo: 'Para qué sirve verificar una identidad',
    resumen: 'Casos habituales y qué conviene comprobar en cada uno.',
    cuerpo: [
      'Antes de firmar un contrato o arrendar un inmueble, contrastar que el nombre coincide con la cédula presentada evita el caso más común de suplantación: un documento ajeno con la foto cambiada.',
      'En procesos de contratación, la consulta de licencia y multas es relevante cuando el puesto implica conducir. Los puntos disponibles y los bloqueos activos dicen bastante más que la simple existencia de la licencia.',
      'Para operaciones comerciales conviene revisar el estado del RUC. Un contribuyente suspendido o con la actividad cesada no debería emitir facturas válidas, y eso se ve en la consulta antes de cerrar el trato.'
    ]
  }
];

const faq = [
  {
    p: '¿Cómo consulto una cédula?',
    r: 'Creas una cuenta, entras al panel y escribes los diez dígitos en la sección de identidad. La respuesta llega en segundos, con los datos tal como los devuelve la fuente oficial.'
  },
  {
    p: '¿Puedo buscar por nombres y apellidos?',
    r: 'Sí. La sección de búsqueda por nombre acepta nombres y apellidos y devuelve las coincidencias. Cuantos más datos aportes, menos resultados ambiguos obtendrás.'
  },
  {
    p: '¿Qué datos devuelve la consulta de cédula?',
    r: 'Nombres y apellidos completos, fecha de nacimiento, edad, género, nacionalidad, estado civil y lugar de nacimiento, cuando la fuente los publica.'
  },
  {
    p: '¿Hace falta registrarse?',
    r: 'Sí. Todas las consultas requieren una cuenta, porque cada una se descuenta de una cuota diaria asociada a tu usuario. El registro es gratuito y no pide tarjeta.'
  },
  {
    p: '¿Cuántas consultas incluye la cuenta gratuita?',
    r: 'La cuota depende de tu plan y se ve siempre en la cabecera del panel, junto al tiempo que falta para que se renueve. La ventana es de veinticuatro horas y arranca con tu primera consulta.'
  },
  {
    p: '¿De dónde salen los datos y es legal consultarlos?',
    r: 'De registros públicos del Estado ecuatoriano: Registro Civil, SRI, ANT y Función Judicial. Son consultas que cualquier persona puede hacer en los portales oficiales; aquí se agrupan en un solo sitio. No almacenamos ni revendemos los resultados.'
  }
];

const enlacesLegales: { texto: string; href?: string; ruta?: string }[] = [
  { texto: 'Guías', href: '#guias' },
  { texto: 'Preguntas frecuentes', href: '#faq' },
  { texto: 'Contacto', href: 'mailto:arismendiramses@gmail.com' },
  { texto: 'Términos', ruta: '/terminos' },
  { texto: 'Privacidad', ruta: '/privacidad' }
];
</script>
