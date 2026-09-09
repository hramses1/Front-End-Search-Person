/**
 * Novedades del portal, en lenguaje de usuario.
 *
 * Se redactan a mano a partir de los commits reales: un mensaje de commit
 * habla en términos de código («fix(admin): anclar los modales a la
 * ventana»), y quien lee esta página no necesita saber qué es un modal
 * anclado, sino que «los formularios ya no se abren fuera de la pantalla».
 *
 * Solo para el usuario final: nada del panel de administración (listados
 * de usuarios, gestión de planes, etc.). Si un cambio real solo afecta a
 * esa parte, no entra aquí, aunque haya sido un cambio grande.
 */

export interface Novedad {
  fecha: string; // ISO, solo la parte del día
  titulo: string;
  descripcion: string;
}

export const NOVEDADES: Novedad[] = [
  {
    fecha: '2026-09-07',
    titulo: 'Multas por placa y consulta de citas médicas',
    descripcion:
      'Desde la ficha de un vehículo ya se pueden pedir sus multas con un botón aparte, sin gastar una consulta extra si no la necesitas. Se suma además una consulta nueva: citas médicas registradas en el sistema público de salud, a partir de la cédula.'
  },
  {
    fecha: '2026-09-07',
    titulo: 'Formulario de contacto y solicitud de bloqueo de datos',
    descripcion:
      'La página de contacto tiene ya un formulario real, además de los enlaces a WhatsApp y correo. Y si tu cédula, tu placa o tu RUC aparecen en nuestras consultas y quieres que dejen de mostrarse, puedes pedirlo desde una página dedicada, con verificación de que eres el titular.'
  },
  {
    fecha: '2026-09-06',
    titulo: 'Historial de tus consultas y descarga de tus datos',
    descripcion:
      'Desde el panel puedes ver qué has consultado y cuándo, con un gráfico del consumo diario. También puedes descargar todos tus datos en un archivo, o eliminar tu cuenta por completo si lo decides.'
  },
  {
    fecha: '2026-09-06',
    titulo: 'Página de estado del servicio',
    descripcion:
      'Publicamos disponibilidad, tiempo de respuesta y consultas atendidas de los últimos siete días, separando lo que depende de nosotros de lo que depende de las fuentes oficiales.'
  },
  {
    fecha: '2026-09-06',
    titulo: 'Cada consulta y cada guía, con su propia página',
    descripcion:
      'Antes había que entrar a la cuenta para ver de qué trataba cada consulta. Ahora cada una tiene su propia página pública, con un ejemplo del resultado y respuestas a las dudas más comunes. Lo mismo con las guías, que pasan de tres a once.'
  },
  {
    fecha: '2026-09-02',
    titulo: 'Navegación por teclado en todo el sitio',
    descripcion:
      'Los menús de perfil y donación, y todos los cuadros de diálogo, ya se manejan enteros con teclado: se abren, se cierran con Escape y anuncian su función a un lector de pantalla.'
  },
  {
    fecha: '2026-08-30',
    titulo: 'Diseño responsivo en todo el portal',
    descripcion:
      'Revisión completa de tipografía, espaciados y objetivos táctiles en cinco anchos de pantalla distintos, del teléfono al escritorio, incluida la orientación horizontal en tablet y móvil.'
  }
];
