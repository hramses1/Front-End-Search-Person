/**
 * Catálogo de consultas: una sola fuente de verdad.
 *
 * Lo consumen cuatro sitios, y por eso vive aquí y no dentro de una vista:
 *
 *   - PublicLandingView, para pintar el catálogo de la portada
 *   - el router, que genera una ruta pública por consulta
 *   - ConsultaView, que se dibuja a partir del slug
 *   - scripts/generar-sitemap.mjs, en tiempo de compilación
 *
 * Antes el catálogo era un array dentro de la portada y cada consulta abría un
 * modal. Eso significaba una sola URL para ocho consultas distintas: nada de lo
 * que ofrecemos podía posicionar por separado.
 */

export interface EjemploFila {
  0: string;
  1: string;
}

export interface Consulta {
  /** Segmento de URL. Se publica, así que no se cambia a la ligera. */
  slug: string;
  /** Clave de la sección del panel a la que lleva tras iniciar sesión. */
  seccion: string;
  /** Grupo del catálogo, para agrupar en la portada. */
  grupo: 'Identidad' | 'Judicial' | 'Tránsito' | 'Tributario';
  /** Nombre corto, el de la tarjeta. */
  titulo: string;
  /** Título de la pestaña y del buscador. Incluye la marca al renderizar. */
  tituloSeo: string;
  /** Meta descripción. Entre 120 y 160 caracteres. */
  descripcion: string;
  /** Encabezado h1 de la página de la consulta. */
  encabezado: string;
  /** Frase de apoyo bajo el h1. */
  entradilla: string;
  /** Texto corto de la tarjeta del catálogo. */
  texto: string;
  /** Qué se necesita para consultar, en lenguaje de usuario. */
  requisito: string;
  /** Respuesta de ejemplo, tal como la devuelve la fuente. */
  ejemplo: string[][];
  /** Fuente oficial del dato. */
  fuente: string;
  /** Preguntas propias de esta consulta. Alimentan el JSON-LD FAQPage. */
  faq: { p: string; r: string }[];
}

export const CONSULTAS: Consulta[] = [
  {
    slug: 'consultar-cedula',
    seccion: 'identity',
    grupo: 'Identidad',
    titulo: 'Buscar por cédula',
    tituloSeo: 'Consultar cédula del Ecuador',
    descripcion:
      'Consulta los datos de una cédula ecuatoriana: nombres, apellidos, fecha y lugar de nacimiento, estado civil y nacionalidad, desde el Registro Civil.',
    encabezado: 'Consultar una cédula ecuatoriana',
    entradilla:
      'Escribe los diez dígitos y obtén los nombres, la fecha y el lugar de nacimiento tal como constan en el Registro Civil.',
    texto: 'Nombres, apellidos, fecha de nacimiento, estado civil y lugar de nacimiento.',
    requisito: 'El número de cédula, diez dígitos, sin guiones ni espacios.',
    fuente: 'Registro Civil',
    ejemplo: [
      ['Cédula', '0912345678'],
      ['Nombres', 'MARIA FERNANDA'],
      ['Apellidos', 'LOPEZ TORRES'],
      ['Fecha de nacimiento', '14/03/1991'],
      ['Edad', '35'],
      ['Género', 'FEMENINO'],
      ['Estado civil', 'CASADA'],
      ['Nacionalidad', 'ECUATORIANA'],
      ['Lugar de nacimiento', 'GUAYAS / GUAYAQUIL']
    ],
    faq: [
      {
        p: '¿Qué datos devuelve la consulta de cédula?',
        r: 'Nombres y apellidos completos, fecha de nacimiento y edad, género, estado civil, nacionalidad y el lugar de nacimiento con provincia y cantón. Son los campos que expone el Registro Civil; si alguno no consta en el registro, llega vacío.'
      },
      {
        p: '¿Cuánto tarda la consulta?',
        r: 'Se resuelve contra la fuente en el momento, así que suele responder en segundos. No hay colas ni descargas de PDF.'
      },
      {
        p: '¿Necesito una cuenta?',
        r: 'Sí. El registro es gratuito, no pide tarjeta y trae una cuota diaria de consultas que vuelve a cero cada medianoche.'
      },
      {
        p: '¿Los datos son oficiales?',
        r: 'Vienen del Registro Civil. No completamos ni corregimos nada por nuestra cuenta: si la fuente devuelve un dato incompleto, se muestra tal cual.'
      }
    ]
  },
  {
    slug: 'buscar-por-nombre',
    seccion: 'fullname',
    grupo: 'Identidad',
    titulo: 'Buscar por nombre',
    tituloSeo: 'Buscar cédula por nombres y apellidos',
    descripcion:
      'Encuentra el número de cédula a partir de los nombres y apellidos completos de una persona en Ecuador. Resultados del Registro Civil.',
    encabezado: 'Buscar una cédula por nombres y apellidos',
    entradilla:
      'Cuando no tienes el número a la mano. Escribe los nombres y apellidos completos y obtén las coincidencias registradas.',
    texto: 'Localiza a una persona a partir de sus nombres y apellidos completos.',
    requisito: 'Nombres y apellidos completos, tal como constan en la cédula.',
    fuente: 'Registro Civil',
    ejemplo: [
      ['Coincidencias', '3'],
      ['Cédula', '0912345678'],
      ['Nombres', 'MARIA FERNANDA'],
      ['Apellidos', 'LOPEZ TORRES'],
      ['Ciudad', 'GUAYAQUIL'],
      ['Tipo de identificación', 'CEDULA']
    ],
    faq: [
      {
        p: '¿Puedo buscar solo con el primer nombre?',
        r: 'No. La búsqueda necesita nombres y apellidos completos para acotar el resultado; con datos parciales la fuente no devuelve coincidencias fiables.'
      },
      {
        p: '¿Qué pasa si hay varias personas con el mismo nombre?',
        r: 'Se muestran todas las coincidencias con su cédula y su ciudad, para que puedas distinguir cuál buscas.'
      },
      {
        p: '¿Devuelve la misma información que la consulta por cédula?',
        r: 'No. Esta búsqueda sirve para encontrar el número; una vez lo tengas, la consulta por cédula devuelve el detalle completo.'
      }
    ]
  },
  {
    slug: 'consultar-denuncias',
    seccion: 'complaint',
    grupo: 'Judicial',
    titulo: 'Denuncias',
    tituloSeo: 'Consultar denuncias por cédula',
    descripcion:
      'Consulta las causas judiciales en las que una cédula figura como demandado, con número de juicio, materia, fecha y judicatura.',
    encabezado: 'Consultar denuncias por cédula',
    entradilla:
      'Causas en las que la persona figura como demandado, con el número de juicio, la materia y la judicatura que lleva el caso.',
    texto: 'Causas en las que la cédula figura como demandado, con materia y judicatura.',
    requisito: 'El número de cédula de la persona demandada.',
    fuente: 'Función Judicial',
    ejemplo: [
      ['N.º de juicio', '09332-2024-01875'],
      ['Delito', 'INCUMPLIMIENTO DE CONTRATO'],
      ['Fecha', '22/07/2024'],
      ['Materia', 'CIVIL'],
      ['Tipo de acción', 'PROCEDIMIENTO ORDINARIO'],
      ['Judicatura', 'UNIDAD JUDICIAL CIVIL DE GUAYAQUIL'],
      ['Ciudad', 'GUAYAQUIL']
    ],
    faq: [
      {
        p: '¿Qué diferencia hay con los juicios como demandante?',
        r: 'Aquí aparecen las causas en las que la persona es demandada. La otra consulta muestra aquellas en las que actúa como demandante.'
      },
      {
        p: '¿Aparecen todos los procesos judiciales?',
        r: 'Aparecen los que la Función Judicial publica en su consulta de causas. Los procesos reservados por ley no se exponen en ninguna fuente pública.'
      },
      {
        p: '¿Con qué frecuencia se actualizan?',
        r: 'La consulta va contra la fuente en el momento, así que refleja lo que la Función Judicial tenga publicado en ese instante.'
      }
    ]
  },
  {
    slug: 'consultar-juicios',
    seccion: 'judgement',
    grupo: 'Judicial',
    titulo: 'Juicios como demandante',
    tituloSeo: 'Consultar juicios como demandante',
    descripcion:
      'Consulta los procesos judiciales en los que una persona actúa como demandante en Ecuador, con número de juicio, materia y judicatura.',
    encabezado: 'Consultar juicios como demandante',
    entradilla:
      'Procesos en los que la persona actúa como actor, no como demandado, con la judicatura y la materia de cada causa.',
    texto: 'Procesos en los que la persona actúa como actor, no como demandado.',
    requisito: 'El número de cédula de la persona demandante.',
    fuente: 'Función Judicial',
    ejemplo: [
      ['N.º de juicio', '17203-2023-00941'],
      ['Delito', 'COBRO DE DINERO'],
      ['Fecha', '09/11/2023'],
      ['Materia', 'CIVIL'],
      ['Tipo de acción', 'PROCEDIMIENTO MONITORIO'],
      ['Demandante', 'LOPEZ TORRES MARIA FERNANDA'],
      ['Judicatura', 'UNIDAD JUDICIAL CIVIL DE QUITO']
    ],
    faq: [
      {
        p: '¿Para qué sirve esta consulta?',
        r: 'Para ver los procesos que una persona ha iniciado. Es la contraparte de la consulta de denuncias, donde figura como demandada.'
      },
      {
        p: '¿Incluye el estado del proceso?',
        r: 'Incluye lo que publica la Función Judicial: número de juicio, materia, tipo de acción, fecha y judicatura. El detalle del trámite se consulta en la propia judicatura.'
      }
    ]
  },
  {
    slug: 'consultar-licencia',
    seccion: 'license',
    grupo: 'Tránsito',
    titulo: 'Licencia',
    tituloSeo: 'Consultar licencia de conducir por cédula',
    descripcion:
      'Consulta el tipo de licencia de conducir, su vigencia, los puntos disponibles y los bloqueos registrados en la ANT a partir de la cédula.',
    encabezado: 'Consultar la licencia de conducir',
    entradilla:
      'Tipo de licencia, hasta cuándo es válida, cuántos puntos quedan de los treinta y si hay bloqueos registrados.',
    texto: 'Tipos de licencia, vigencia, puntos disponibles y bloqueos según la ANT.',
    requisito: 'El número de cédula del titular de la licencia.',
    fuente: 'ANT',
    ejemplo: [
      ['Cédula', '0912345678'],
      ['Nombre', 'LOPEZ TORRES MARIA FERNANDA'],
      ['Puntos', '30 de 30'],
      ['Tipo de licencia', 'B'],
      ['Validez', 'VIGENTE HASTA 2029'],
      ['Citaciones pendientes', '0']
    ],
    faq: [
      {
        p: '¿Cómo funcionan los puntos de la licencia?',
        r: 'Una licencia parte de 30 puntos. Cada infracción descuenta según su gravedad, y al llegar a cero la licencia queda suspendida. La consulta muestra cuántos quedan.'
      },
      {
        p: '¿Qué significa que la licencia esté bloqueada?',
        r: 'Que existe una restricción registrada en la ANT, normalmente por multas impagas o por una sanción. Hay que resolverla ante la propia entidad.'
      },
      {
        p: '¿Sirve para cualquier tipo de licencia?',
        r: 'Sí. Devuelve el tipo registrado, sea particular o profesional, con su fecha de vigencia.'
      }
    ]
  },
  {
    slug: 'consultar-multas',
    seccion: 'citation',
    grupo: 'Tránsito',
    titulo: 'Multas e infracciones',
    tituloSeo: 'Consultar multas de tránsito por cédula',
    descripcion:
      'Consulta citaciones y multas de tránsito en Ecuador con la entidad emisora, el artículo infringido, los puntos descontados y el total a pagar.',
    encabezado: 'Consultar multas e infracciones de tránsito',
    entradilla:
      'Citaciones con la entidad que las emitió, el artículo infringido, los puntos que descuentan y el total a pagar.',
    texto: 'Citaciones con entidad, artículo infringido, puntos y total a pagar.',
    requisito: 'El número de cédula del conductor.',
    fuente: 'ANT y entidades municipales de tránsito',
    ejemplo: [
      ['Citación', 'GYE-0091823'],
      ['Entidad', 'ATM GUAYAQUIL'],
      ['Placa', 'GSN1234'],
      ['Fecha de emisión', '03/05/2026'],
      ['Artículo', 'ART. 386 COIP'],
      ['Puntos', '-6'],
      ['Multa', '235,00'],
      ['Total a pagar', '247,50']
    ],
    faq: [
      {
        p: '¿El total a pagar incluye los recargos?',
        r: 'Sí. La fuente devuelve el valor de la multa y el total con recargos aplicados a la fecha de la consulta.'
      },
      {
        p: '¿Aparecen las multas de todos los municipios?',
        r: 'Aparecen las que la ANT y las entidades municipales de tránsito exponen en sus consultas públicas. Cada entidad publica las suyas.'
      },
      {
        p: '¿Puedo pagar la multa desde aquí?',
        r: 'No. Esta es una consulta informativa: el pago se hace en los canales oficiales de la entidad que emitió la citación.'
      }
    ]
  },
  {
    slug: 'consultar-vehiculo',
    seccion: 'vehicles',
    grupo: 'Tránsito',
    titulo: 'Datos del vehículo',
    tituloSeo: 'Consultar datos de un vehículo por placa',
    descripcion:
      'Consulta la marca, el modelo, el año, la clase y el servicio de un vehículo en Ecuador a partir del número de placa.',
    encabezado: 'Consultar un vehículo por placa',
    entradilla:
      'Marca, modelo, año, clase y tipo de servicio del vehículo a partir del número de placa.',
    texto: 'Marca, modelo, año, clase y servicio a partir del número de placa.',
    requisito: 'La placa del vehículo, sin guiones ni espacios.',
    fuente: 'ANT',
    ejemplo: [
      ['Placa', 'GSN1234'],
      ['Marca', 'CHEVROLET'],
      ['Modelo', 'SAIL 1.5'],
      ['Año', '2019'],
      ['Clase', 'AUTOMOVIL'],
      ['Servicio', 'PARTICULAR'],
      ['País de fabricación', 'ECUADOR'],
      ['Propietario', 'LOPEZ TORRES MARIA FERNANDA']
    ],
    faq: [
      {
        p: '¿Cómo escribo la placa?',
        r: 'Sin guiones ni espacios, tal como aparece en el documento. Da igual mayúsculas o minúsculas.'
      },
      {
        p: '¿Sirve para vehículos de cualquier provincia?',
        r: 'Sí. La consulta va contra el registro nacional de la ANT, así que cubre placas de todo el país.'
      },
      {
        p: '¿Muestra si el vehículo tiene multas?',
        r: 'No. Para eso está la consulta de multas e infracciones, que devuelve las citaciones asociadas.'
      }
    ]
  },
  {
    slug: 'consultar-ruc',
    seccion: 'ruc',
    grupo: 'Tributario',
    titulo: 'Estado del RUC',
    tituloSeo: 'Consultar RUC en Ecuador',
    descripcion:
      'Consulta el estado de un RUC en Ecuador: razón social, tipo de contribuyente, actividad económica, establecimientos y fecha de inicio de actividades.',
    encabezado: 'Consultar el estado de un RUC',
    entradilla:
      'Razón social, estado del contribuyente, actividad económica y número de establecimientos abiertos, según el SRI.',
    texto: 'Razón social, estado del contribuyente, actividad económica y establecimientos.',
    requisito: 'El número de RUC, trece dígitos.',
    fuente: 'SRI',
    ejemplo: [
      ['RUC', '0912345678001'],
      ['Razón social', 'LOPEZ TORRES MARIA FERNANDA'],
      ['Estado', 'ACTIVO'],
      ['Tipo de contribuyente', 'PERSONA NATURAL'],
      ['Obligado a contabilidad', 'NO'],
      ['Actividad principal', 'VENTA AL POR MENOR DE PRENDAS DE VESTIR'],
      ['Inicio de actividades', '18/02/2016'],
      ['Establecimientos', '1 ABIERTO']
    ],
    faq: [
      {
        p: '¿Qué diferencia hay entre cédula y RUC?',
        r: 'La cédula identifica a una persona; el RUC identifica a quien realiza actividad económica. Para una persona natural, el RUC es su cédula más tres dígitos, normalmente 001.'
      },
      {
        p: '¿Qué significa que un RUC esté suspendido?',
        r: 'Que el contribuyente no está habilitado para emitir comprobantes. Suele deberse a incumplimientos ante el SRI y se resuelve ante la propia entidad.'
      },
      {
        p: '¿Sirve para empresas y para personas naturales?',
        r: 'Sí, para ambas. El campo de tipo de contribuyente indica de cuál se trata.'
      }
    ]
  }
];

/** Índice por slug, para resolver la ruta sin recorrer el array. */
export const POR_SLUG = Object.fromEntries(CONSULTAS.map(c => [c.slug, c])) as Record<string, Consulta>;

/** Grupos en el orden en que se pintan en la portada. */
export const GRUPOS = ['Identidad', 'Judicial', 'Tránsito', 'Tributario'] as const;

/** Las consultas de un grupo, conservando el orden del catálogo. */
export const porGrupo = (grupo: string) => CONSULTAS.filter(c => c.grupo === grupo);
