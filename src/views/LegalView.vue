<template>
  <div class="font-primary min-h-screen relative selection:bg-[var(--accent-color)]/30" style="background-color: var(--bg-color); color: var(--text-primary);">
    <div class="absolute inset-0 pointer-events-none noise-overlay z-0 opacity-20"></div>

    <div class="relative z-10 max-w-3xl mx-auto px-6 sm:px-8">

      <header class="flex items-center justify-between py-6 border-b border-[var(--border-color)]">
        <button @click="router.push('/')" class="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] opacity-50 hover:opacity-100 hover:text-[var(--accent-color)] transition-all">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a la portada
        </button>
        <button @click="toggleTheme" class="p-2.5 glass-panel rounded-2xl text-[var(--accent-color)] active:scale-90 transition-transform">
          <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="1.8" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="1.8" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
        </button>
      </header>

      <article class="py-16">
        <p class="text-[9px] font-black tracking-[0.35em] uppercase opacity-40 mb-4">{{ doc.rotulo || 'Legal' }}</p>
        <h1 class="text-3xl sm:text-4xl font-light tracking-tight mb-4">{{ doc.titulo }}</h1>
        <p class="text-[10px] uppercase tracking-[0.15em] opacity-40 mb-10">
          Última actualización: {{ doc.actualizado }}
        </p>

        <p class="text-[13px] leading-relaxed opacity-70 mb-12">{{ doc.intro }}</p>

        <section v-for="(sec, i) in doc.secciones" :key="sec.h" class="mb-10">
          <h2 class="text-[13px] font-bold tracking-wide mb-4 flex items-baseline gap-3">
            <span class="text-[var(--accent-color)] font-mono text-[11px]">{{ String(i + 1).padStart(2, '0') }}</span>
            {{ sec.h }}
          </h2>
          <div class="space-y-3 pl-8">
            <p v-for="(par, j) in sec.p" :key="j" class="text-[12px] leading-relaxed opacity-70">{{ par }}</p>
            <ul v-if="sec.lista" class="space-y-2 pt-1">
              <li v-for="item in sec.lista" :key="item" class="flex items-start gap-2.5 text-[12px] leading-relaxed opacity-70">
                <span class="text-[var(--accent-color)] mt-1.5 shrink-0">&middot;</span>
                {{ item }}
              </li>
            </ul>
          </div>
        </section>

        <div v-if="route.name !== 'contacto'" class="glass-card p-6 mt-12">
          <p class="text-[9px] font-black tracking-[0.25em] uppercase opacity-40 mb-2">Contacto</p>
          <p class="text-[12px] leading-relaxed opacity-70">
            Para cualquier consulta sobre este documento, escribe a
            <a href="mailto:arismendiramses@gmail.com" class="text-[var(--accent-color)] hover:underline">arismendiramses@gmail.com</a>.
          </p>
        </div>

        <nav class="flex flex-wrap gap-6 mt-12 pt-8 border-t border-[var(--border-color)]">
          <button
            v-for="l in otros" :key="l.ruta"
            @click="router.push(l.ruta)"
            class="text-[10px] uppercase tracking-[0.15em] opacity-40 hover:opacity-100 hover:text-[var(--accent-color)] transition-all"
          >
            {{ l.texto }}
          </button>
        </nav>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const route = useRoute();
const router = useRouter();
const { isDark, toggleTheme } = useAuth();

const ACTUALIZADO = '30 de agosto de 2026';

/**
 * Documentos legales.
 *
 * Estan redactados sobre el comportamiento real del sistema, no sobre
 * plantillas genericas: la cuota diaria, la ventana de 24 horas, el cache de
 * cinco minutos en memoria y la ausencia de cookies y analitica son hechos
 * verificados en el codigo.
 */
const documentos: Record<string, any> = {
  terminos: {
    titulo: 'Términos de servicio',
    actualizado: ACTUALIZADO,
    intro: 'Estas condiciones regulan el uso del Portal de Consulta Ciudadana. Al crear una cuenta aceptas lo que se describe a continuación. Si no estás de acuerdo con alguna parte, no uses el servicio.',
    secciones: [
      {
        h: 'Qué es este servicio',
        p: [
          'El portal agrupa consultas a registros públicos del Estado ecuatoriano y las presenta en un único lugar. Las fuentes son el Registro Civil, el Servicio de Rentas Internas, la Agencia Nacional de Tránsito y la Función Judicial.',
          'No somos una entidad pública ni actuamos en su nombre. No emitimos certificados ni documentos con validez legal: para eso debes acudir a la institución correspondiente.'
        ]
      },
      {
        h: 'Cuenta de usuario',
        p: [
          'Para consultar necesitas una cuenta. Puedes crearla con correo y contraseña o acceder con Google. Eres responsable de mantener tus credenciales en secreto y de toda la actividad que se realice desde tu cuenta.',
          'Los datos que registres deben ser veraces. Una cuenta es personal: no la compartas ni cedas su acceso a terceros.'
        ]
      },
      {
        h: 'Cuota de consultas',
        p: [
          'Cada cuenta tiene una cuota diaria de consultas determinada por su plan. La ventana es de veinticuatro horas y empieza a contar con tu primera consulta, no a medianoche.',
          'Al agotarla, el servicio deja de responder hasta que se renueve, y verás en pantalla cuánto falta. Si una consulta falla por un problema de la fuente oficial, no se te descuenta.',
          'Existe además un límite por dirección IP, independiente de la cuota de tu cuenta, para proteger el servicio de un uso automatizado excesivo.'
        ]
      },
      {
        h: 'Uso aceptable',
        p: ['Al usar el portal te comprometes a no emplearlo para:'],
        lista: [
          'Suplantar la identidad de otra persona o hacerte pasar por ella.',
          'Acosar, perseguir, intimidar o perjudicar a alguien con la información obtenida.',
          'Discriminar a personas en procesos de contratación, arrendamiento o crédito de un modo contrario a la ley.',
          'Extraer datos de forma masiva o automatizada al margen de la cuota asignada.',
          'Revender, redistribuir o publicar los resultados como si fueran una base de datos propia.'
        ]
      },
      {
        h: 'Exactitud de la información',
        p: [
          'Los datos se muestran tal como los devuelve la fuente oficial en el momento de la consulta. No los corregimos, completamos ni interpretamos.',
          'Si un dato es incorrecto o está desactualizado en el registro de origen, aparecerá igual aquí. La corrección debe solicitarse a la institución que lo mantiene.'
        ]
      },
      {
        h: 'Disponibilidad',
        p: [
          'El servicio depende de sistemas públicos que no controlamos. Cuando una fuente oficial no responde, la consulta correspondiente deja de estar disponible hasta que se restablezca, y así se te indica en pantalla.',
          'No garantizamos disponibilidad ininterrumpida ni un tiempo de respuesta determinado. Podemos realizar tareas de mantenimiento que interrumpan el servicio temporalmente.'
        ]
      },
      {
        h: 'Suspensión de cuentas',
        p: [
          'Podemos suspender o cerrar una cuenta que incumpla estas condiciones, en particular ante indicios de uso automatizado abusivo, intento de eludir la cuota o uso de la información para los fines prohibidos más arriba.'
        ]
      },
      {
        h: 'Cambios en el servicio y en estas condiciones',
        p: [
          'El catálogo de consultas, los planes y las cuotas pueden cambiar. Cuando modifiquemos estas condiciones actualizaremos la fecha que encabeza el documento.',
          'Si un cambio afecta de forma sustancial a tus derechos, procuraremos avisarte por el correo asociado a tu cuenta.'
        ]
      }
    ]
  },

  contacto: {
    rotulo: 'Ayuda',
    titulo: 'Contacto',
    actualizado: ACTUALIZADO,
    intro: 'Escríbenos y te respondemos. Para que la respuesta sea útil a la primera, conviene que incluyas algunos datos según el motivo.',
    secciones: [
      {
        h: 'Soporte de uso',
        p: ['Si una consulta falla o devuelve algo que no esperabas, indícanos:'],
        lista: [
          'Qué consulta hiciste, sin incluir el número consultado en el cuerpo del correo si prefieres no compartirlo.',
          'Qué esperabas ver y qué viste en su lugar.',
          'El mensaje de error exacto, si apareció alguno en pantalla.',
          'La hora aproximada, que nos ayuda a localizarlo.'
        ]
      },
      {
        h: 'Problemas con tu cuota',
        p: [
          'La cuota se renueva veinticuatro horas después de tu primera consulta, no a medianoche. En la cabecera del panel ves cuánto falta.',
          'Si el contador no cuadra con lo que recuerdas haber consultado, escríbenos con tu nombre de usuario y lo revisamos.'
        ]
      },
      {
        h: 'Datos personales',
        p: [
          'Para acceder a tus datos, rectificarlos o eliminar tu cuenta, escríbenos desde el correo con el que te registraste. Necesitamos esa coincidencia para confirmar que la solicitud es tuya.',
          'El nombre de usuario puedes cambiarlo tú mismo desde la sección de perfil, sin escribirnos.'
        ]
      },
      {
        h: 'Vulnerabilidades de seguridad',
        p: [
          'Si encuentras un fallo de seguridad, te agradecemos que nos lo comuniques en privado antes de hacerlo público, y que nos des un margen razonable para corregirlo.',
          'Incluye los pasos para reproducirlo. No hace falta que demuestres el impacto accediendo a datos de terceros: con la descripción del fallo es suficiente.'
        ]
      },
      {
        h: 'Qué no podemos hacer',
        p: [
          'No podemos corregir un dato incorrecto en un registro oficial. Los datos se muestran tal como los devuelve la fuente, y la corrección debe solicitarse a la institución que la mantiene: Registro Civil, SRI, ANT o Función Judicial según el caso.',
          'Tampoco emitimos certificados ni documentos con validez legal.'
        ]
      }
    ]
  },

  privacidad: {
    titulo: 'Política de privacidad',
    actualizado: ACTUALIZADO,
    intro: 'Este documento explica qué datos tratamos, con qué finalidad y durante cuánto tiempo. Está escrito sobre lo que el sistema hace realmente, no sobre una plantilla.',
    secciones: [
      {
        h: 'Datos de tu cuenta',
        p: ['Al registrarte guardamos únicamente lo necesario para que la cuenta funcione:'],
        lista: [
          'Tu nombre y tu nombre de usuario, que se muestran en el panel.',
          'Tu correo electrónico, usado para identificarte y para contactarte si hiciera falta.',
          'Tu contraseña, almacenada cifrada. Nunca se guarda ni se muestra en texto claro, y no podemos leerla.',
          'Tu plan y el número de consultas que llevas en la ventana actual, necesarios para aplicar la cuota.'
        ]
      },
      {
        h: 'Acceso con Google',
        p: [
          'Si eliges entrar con Google, recibimos de su parte los datos básicos de tu perfil para crear la cuenta. No obtenemos acceso a tu correo, tus contactos ni ningún otro contenido de tu cuenta de Google.'
        ]
      },
      {
        h: 'Qué guardamos en tu navegador',
        p: [
          'No usamos cookies. No hay analítica, ni píxeles de seguimiento, ni herramientas de terceros que registren tu comportamiento. No compartimos datos con redes publicitarias porque no las usamos.',
          'Lo único que se almacena es la sesión en la memoria del navegador (sessionStorage): tu identificador, tu nombre, tu plan, el contador de cuota y tu preferencia de tema claro u oscuro. Todo eso desaparece al cerrar sesión o al cerrar la pestaña.'
        ]
      },
      {
        h: 'Los datos que consultas',
        p: [
          'La información que devuelven las consultas procede de registros públicos y se refiere a terceros, no a ti. Se te muestra en pantalla en el momento.',
          'Para que la interfaz no repita la misma petición dos veces seguidas, el resultado se conserva cinco minutos en la memoria del navegador. Ese almacenamiento temporal se borra por completo al cerrar sesión, de modo que nadie que use después el mismo equipo pueda verlo.',
          'Eres responsable del uso que des a la información obtenida y de tratarla conforme a la normativa de protección de datos que te aplique.'
        ]
      },
      {
        h: 'Para qué usamos tus datos',
        p: ['Tratamos tus datos con tres finalidades, y ninguna más:'],
        lista: [
          'Autenticarte y mantener tu sesión abierta mientras usas el portal.',
          'Aplicar tu cuota diaria de consultas y mostrarte cuánto te queda.',
          'Atender tus solicitudes de soporte cuando nos escribes.'
        ]
      },
      {
        h: 'Conservación',
        p: [
          'Mantenemos los datos de tu cuenta mientras la cuenta exista. Si solicitas su eliminación, se borran junto con el contador de consultas asociado.',
          'La sesión de tu navegador caduca por sí sola: el token tiene una vida de sesenta minutos y la sesión se cierra automáticamente tras diez minutos de inactividad.'
        ]
      },
      {
        h: 'Con quién compartimos',
        p: [
          'No vendemos ni cedemos tus datos personales a terceros.',
          'Los proveedores que intervienen técnicamente son los estrictamente necesarios para que el servicio funcione: el alojamiento de la aplicación y las propias instituciones públicas a las que se dirige cada consulta.',
          'Cuando consultas un dato, la petición viaja a la institución correspondiente. Esa consulta se rige además por las condiciones de la fuente.'
        ]
      },
      {
        h: 'Tus derechos',
        p: [
          'Puedes acceder a tus datos, rectificarlos o solicitar que se eliminen. El nombre de usuario puedes cambiarlo tú mismo desde la sección de perfil del panel.',
          'Para cualquier otra solicitud, incluida la eliminación de la cuenta, escríbenos al correo indicado abajo. Responderemos en un plazo razonable.'
        ]
      },
      {
        h: 'Seguridad',
        p: [
          'La comunicación con el servidor viaja siempre cifrada mediante TLS. El acceso a las consultas requiere un token firmado y de vida corta, y las rutas de administración exigen un rol verificado en el servidor.',
          'Ningún sistema es infalible. Si detectaras una vulnerabilidad, te agradecemos que nos escribas antes de divulgarla.'
        ]
      }
    ]
  }
};

const doc = computed(() => documentos[String(route.name)] ?? documentos.terminos);

const otros = computed(() =>
  [
    { texto: 'Términos de servicio', ruta: '/terminos' },
    { texto: 'Política de privacidad', ruta: '/privacidad' },
    { texto: 'Contacto', ruta: '/contacto' },
    { texto: 'Guías', ruta: '/#guias' }
  ].filter(l => l.ruta !== route.path)
);
</script>
