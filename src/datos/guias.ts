/**
 * Guías: contenido editorial con URL propia.
 *
 * Las tres primeras vivían dentro de un acordeón de la portada. Sin URL no
 * podían posicionar por separado, así que competían todas por la misma página.
 * Ahora cada una es una ruta, con su título, su descripción y su Article.
 *
 * Los titulares están escritos en el lenguaje con el que la gente busca, no en
 * el nuestro: «Compré un carro y solo tengo el RAMV» encuentra tráfico que
 * «Estado de matriculación» no encuentra.
 */

export interface Guia {
  slug: string;
  /** Categoría, para el rótulo y el agrupado del índice. */
  categoria: 'Cédula' | 'RUC' | 'Tránsito' | 'Vehículos' | 'Uso del portal';
  /** Titular de la tarjeta y h1 de la guía. */
  titulo: string;
  /** Título de la pestaña, si conviene que difiera del titular. */
  tituloSeo: string;
  /** Meta descripción. */
  descripcion: string;
  /** Una línea bajo el titular, en el índice y en la guía. */
  resumen: string;
  /** Párrafos del cuerpo. */
  cuerpo: string[];
  /** Consultas relacionadas, por slug. Enlaza guía y producto. */
  relacionadas: string[];
}

export const GUIAS: Guia[] = [
  {
    slug: 'que-contiene-la-cedula',
    categoria: 'Cédula',
    titulo: 'Qué información contiene la cédula ecuatoriana',
    tituloSeo: 'Qué significa cada dígito de la cédula ecuatoriana',
    descripcion:
      'Los diez dígitos de la cédula ecuatoriana no son correlativos: codifican la provincia, el tipo de identificación y un dígito verificador. Te explicamos cada uno.',
    resumen: 'Los diez dígitos no son un número correlativo: codifican datos.',
    cuerpo: [
      'Los dos primeros dígitos corresponden a la provincia de emisión, del 01 al 24 siguiendo el orden alfabético oficial. Pichincha es 17, Guayas 09 y Azuay 01. Un número fuera de ese rango no pertenece a una cédula válida.',
      'El tercer dígito distingue el tipo de identificación. Para personas naturales siempre es menor que seis; los valores seis y nueve quedan reservados para entidades del sector público y sociedades privadas, que aparecen en el RUC pero nunca en una cédula.',
      'El último dígito es un verificador que se calcula con el algoritmo de módulo diez sobre los nueve anteriores. Por eso un error de tecleo casi siempre produce un número inválido, en lugar de la cédula de otra persona.',
      'Esto tiene una consecuencia práctica: si al consultar una cédula el sistema responde que no existe, lo más probable es que haya un dígito mal escrito, no que la persona no esté registrada. Conviene revisar el número antes de dar por buena la ausencia.'
    ],
    relacionadas: ['consultar-cedula', 'buscar-por-nombre']
  },
  {
    slug: 'cedula-y-ruc-diferencias',
    categoria: 'RUC',
    titulo: 'Cédula y RUC: en qué se diferencian y cómo se relacionan',
    tituloSeo: 'Diferencia entre cédula y RUC en Ecuador',
    descripcion:
      'La cédula identifica a la persona y el RUC a su actividad económica. Cómo se construye uno a partir del otro y cuándo usar cada uno en Ecuador.',
    resumen: 'Uno identifica a la persona; el otro, a su actividad económica.',
    cuerpo: [
      'La cédula identifica a la persona ante el Registro Civil. El RUC la identifica ante el SRI como contribuyente, y por eso solo lo tiene quien ejerce una actividad económica registrada.',
      'En una persona natural el RUC se construye sobre su cédula: los mismos diez dígitos más el sufijo 001, que numera el establecimiento. De ahí que trece dígitos terminados en 001 correspondan casi siempre a un profesional o comerciante individual.',
      'Las sociedades no parten de ninguna cédula. Su RUC lleva un nueve en la tercera posición y se asigna al constituirse. Buscar esa persona jurídica por cédula no devuelve nada, porque no existe como persona natural.',
      'A efectos prácticos: si tienes la cédula de un profesional y quieres saber si factura, prueba a añadirle 001 y consulta ese RUC. Si te dan trece dígitos que empiezan distinto de la cédula, estás ante una empresa.'
    ],
    relacionadas: ['consultar-ruc', 'consultar-cedula']
  },
  {
    slug: 'para-que-verificar-identidad',
    categoria: 'Uso del portal',
    titulo: 'Para qué sirve verificar una identidad antes de cerrar un trato',
    tituloSeo: 'Cuándo conviene verificar una identidad en Ecuador',
    descripcion:
      'Casos habituales en los que conviene comprobar una identidad antes de firmar: contratos, arriendos, contratación de personal y operaciones comerciales.',
    resumen: 'Casos habituales y qué conviene comprobar en cada uno.',
    cuerpo: [
      'Antes de firmar un contrato o arrendar un inmueble, contrastar que el nombre coincide con la cédula presentada evita el caso más común de suplantación: un documento ajeno con la foto cambiada.',
      'En procesos de contratación, la consulta de licencia y multas es relevante cuando el puesto implica conducir. Los puntos disponibles y los bloqueos activos dicen bastante más que la simple existencia de la licencia.',
      'Para operaciones comerciales conviene revisar el estado del RUC. Un contribuyente suspendido o con la actividad cesada no debería emitir facturas válidas, y eso se ve en la consulta antes de cerrar el trato.',
      'Una advertencia: verificar no es investigar. Estas consultas confirman que los datos declarados coinciden con los registros públicos, nada más. Cualquier uso que vaya más allá de esa comprobación es responsabilidad de quien lo hace.'
    ],
    relacionadas: ['consultar-cedula', 'consultar-ruc', 'consultar-licencia']
  },
  {
    slug: 'consultar-multas-de-transito',
    categoria: 'Tránsito',
    titulo: 'Cómo consultar multas de tránsito en Ecuador y qué significa cada dato',
    tituloSeo: 'Cómo consultar multas de tránsito en Ecuador',
    descripcion:
      'Qué entidad emite cada multa de tránsito en Ecuador, qué significan el artículo infringido y los puntos, y por qué el total a pagar cambia con el tiempo.',
    resumen: 'Qué entidad la emitió, qué artículo se infringió y por qué el total sube.',
    cuerpo: [
      'En Ecuador las multas de tránsito no las emite una sola entidad. La ANT cubre buena parte del país, pero en Quito emite la AMT y en Guayaquil la ATM, cada una con su propio registro. Por eso una consulta puede devolver citaciones de varias entidades a la vez.',
      'El artículo que aparece en la citación remite al COIP o a la Ley de Tránsito, y es lo que determina tanto la cuantía como los puntos que se descuentan. Una misma infracción cometida en distintas circunstancias puede encuadrarse en artículos diferentes.',
      'El total a pagar no es fijo: incluye recargos que crecen con el tiempo. Por eso el valor que devuelve la consulta es el vigente en ese momento, y consultar dos meses después da una cifra mayor sobre la misma multa.',
      'La consulta es informativa. El pago se hace siempre en los canales oficiales de la entidad que emitió la citación, y es allí donde se resuelve cualquier impugnación.'
    ],
    relacionadas: ['consultar-multas', 'consultar-licencia', 'consultar-vehiculo']
  },
  {
    slug: 'puntos-de-la-licencia',
    categoria: 'Tránsito',
    titulo: 'Puntos de la licencia de conducir: cómo funcionan y cómo se recuperan',
    tituloSeo: 'Puntos de la licencia de conducir en Ecuador',
    descripcion:
      'Una licencia ecuatoriana parte de 30 puntos. Qué los descuenta, qué pasa al llegar a cero y cómo se recuperan tras la sanción.',
    resumen: 'Se parte de 30. Qué los descuenta y qué pasa cuando se agotan.',
    cuerpo: [
      'Toda licencia ecuatoriana empieza con 30 puntos. Cada infracción sancionada descuenta una cantidad fija según su gravedad, desde 1,5 puntos en las leves hasta 10 en las más graves. El descuento se aplica cuando la sanción queda en firme, no al recibir la citación.',
      'Al llegar a cero puntos la licencia queda suspendida, y la reincidencia puede acabar en revocatoria. Consultar el saldo con regularidad evita la sorpresa de descubrirlo en un control.',
      'Los puntos no se recuperan solos con el paso del tiempo. Se recuperan al cumplir el periodo de suspensión y, según el caso, tras aprobar el curso de conducción que exige la ANT.',
      'Conviene distinguir dos cosas que se confunden: tener multas pendientes no es lo mismo que tener puntos descontados. Se puede deber dinero sin haber perdido puntos, y al revés.'
    ],
    relacionadas: ['consultar-licencia', 'consultar-multas']
  },
  {
    slug: 'comprar-un-carro-usado',
    categoria: 'Vehículos',
    titulo: 'Compré un carro usado: qué comprobar antes de pagar',
    tituloSeo: 'Qué revisar antes de comprar un carro usado en Ecuador',
    descripcion:
      'Antes de pagar un vehículo usado en Ecuador conviene comprobar la ficha de la placa, las multas pendientes y que el propietario coincide con quien vende.',
    resumen: 'La ficha, las deudas y que quien vende sea quien figura.',
    cuerpo: [
      'La comprobación más básica es que los datos de la placa coincidan con el vehículo que tienes delante: marca, modelo, año y clase. Una discrepancia en el año o en la clase es motivo suficiente para no seguir adelante sin una explicación.',
      'Las multas pendientes acompañan al vehículo, no al conductor que las cometió. Consultar las citaciones asociadas a la placa antes de pagar evita heredar una deuda que no es tuya y que bloqueará la matriculación.',
      'Que el nombre del propietario registrado coincida con quien vende es la comprobación que más disgustos ahorra. Si no coincide, quien vende debería poder explicar por qué y acreditarlo documentalmente.',
      'Ninguna de estas consultas sustituye a la revisión mecánica ni al trámite notarial de transferencia. Sirven para descartar problemas antes de invertir tiempo y dinero en el resto.'
    ],
    relacionadas: ['consultar-vehiculo', 'consultar-multas']
  },
  {
    slug: 'estado-del-ruc',
    categoria: 'RUC',
    titulo: 'Qué significa cada estado del RUC y por qué importa al facturar',
    tituloSeo: 'Estados del RUC en Ecuador: activo, suspendido y cesado',
    descripcion:
      'Activo, suspendido o con actividad cesada: qué implica cada estado del RUC en Ecuador y por qué conviene comprobarlo antes de aceptar una factura.',
    resumen: 'Activo, suspendido o cesado: qué implica cada uno.',
    cuerpo: [
      'Un RUC activo indica que el contribuyente está habilitado y al día en sus obligaciones formales. Es el estado que debería tener cualquiera que te emita una factura válida.',
      'La suspensión suele responder a incumplimientos ante el SRI. Un contribuyente suspendido no está habilitado para emitir comprobantes, así que una factura suya puede darte problemas al declarar.',
      'La actividad cesada significa que el contribuyente cerró formalmente su actividad. Aquí no hay ambigüedad: no debería emitir nada, y si lo hace, conviene preguntar.',
      'La consulta devuelve también la actividad económica principal y el número de establecimientos abiertos. Que la actividad declarada no tenga relación con lo que te están vendiendo no es ilegal por sí mismo, pero es una señal que merece una pregunta.'
    ],
    relacionadas: ['consultar-ruc']
  },
  {
    slug: 'buscar-a-alguien-sin-la-cedula',
    categoria: 'Cédula',
    titulo: 'Cómo encontrar a alguien cuando no tienes su número de cédula',
    tituloSeo: 'Buscar una cédula por nombres y apellidos',
    descripcion:
      'Cuando solo tienes el nombre: cómo funciona la búsqueda por nombres y apellidos, por qué necesita datos completos y cómo distinguir entre homónimos.',
    resumen: 'Cuando solo tienes el nombre, y hay más de un homónimo.',
    cuerpo: [
      'La búsqueda por nombre necesita nombres y apellidos completos. Con datos parciales la fuente no acota lo suficiente y devuelve o nada o un ruido inservible, así que merece la pena confirmar la grafía exacta antes de consultar.',
      'Los homónimos son más frecuentes de lo que parece. Cuando la consulta devuelve varias coincidencias, la ciudad es el primer criterio para descartar, y la fecha de nacimiento —vía consulta por cédula— el segundo.',
      'Una vez tienes el número, la consulta por cédula devuelve el detalle completo. La búsqueda por nombre es un paso intermedio, no un sustituto.',
      'Si el nombre lleva tildes o apellidos compuestos, escríbelos tal como constan en el documento. La coincidencia se hace contra el registro, no contra una versión aproximada.'
    ],
    relacionadas: ['buscar-por-nombre', 'consultar-cedula']
  },
  {
    slug: 'de-donde-salen-los-datos',
    categoria: 'Uso del portal',
    titulo: 'De dónde salen los datos y qué significa que sean públicos',
    tituloSeo: 'De dónde vienen los datos de las consultas',
    descripcion:
      'Registro Civil, SRI, ANT y Función Judicial: qué publica cada fuente, por qué a veces un dato llega vacío y qué responsabilidad tiene quien consulta.',
    resumen: 'Qué publica cada fuente y por qué a veces un dato llega vacío.',
    cuerpo: [
      'Cada consulta va contra la entidad que custodia el dato: el Registro Civil para identidad, el SRI para RUC, la ANT para tránsito y vehículos, y la Función Judicial para causas. No hay una base intermedia nuestra que pueda quedarse desfasada.',
      'Que un dato llegue vacío casi nunca significa que no exista: significa que la fuente no lo publica en esa consulta, o que no responde en ese momento. No completamos ni deducimos nada por nuestra cuenta, precisamente para que un hueco se distinga de una invención.',
      'Las fuentes oficiales se saturan, sobre todo en horas punta y a fin de mes. Cuando una no responde, la consulta falla de forma explícita en vez de devolver datos a medias.',
      'Que la información sea de acceso público no convierte cualquier uso en legítimo. Consultar para verificar una identidad en una operación en la que participas es una cosa; recopilar perfiles ajenos es otra, y la responsabilidad de esa diferencia es de quien consulta.'
    ],
    relacionadas: ['consultar-cedula', 'consultar-ruc', 'consultar-vehiculo']
  },
  {
    slug: 'como-funciona-la-cuota',
    categoria: 'Uso del portal',
    titulo: 'Cómo funciona la cuota diaria de consultas',
    tituloSeo: 'Cuota diaria de consultas: cómo funciona',
    descripcion:
      'Cada cuenta trae una cuota diaria de consultas que vuelve a cero cada medianoche, hora de Ecuador. Qué la descuenta y qué no.',
    resumen: 'Vuelve a cero cada medianoche. Qué descuenta y qué no.',
    cuerpo: [
      'Cada cuenta tiene una cuota diaria de consultas asociada a su plan. El contador se ve siempre en la cabecera del panel, junto al tiempo que falta para la renovación.',
      'La cuota vuelve a cero a medianoche, hora de Ecuador. Ecuador continental no aplica horario de verano, así que esa medianoche es siempre la misma: las 05:00 UTC.',
      'Una consulta que falla porque la fuente oficial no responde no debería descontarse. Si detectas que sí lo hizo, escríbenos: es un fallo, no el comportamiento previsto.',
      'El registro es gratuito y no pide tarjeta. No hay saldo que recargar ni permanencia: el día que no consultas, no pierdes nada.'
    ],
    relacionadas: ['consultar-cedula']
  },
  {
    slug: 'denuncias-y-juicios',
    categoria: 'Uso del portal',
    titulo: 'Denuncias y juicios: qué diferencia hay entre las dos consultas',
    tituloSeo: 'Diferencia entre denuncias y juicios como demandante',
    descripcion:
      'Una consulta muestra las causas en las que la persona figura como demandada; la otra, aquellas en las que es demandante. Qué publica la Función Judicial.',
    resumen: 'Una mira el lado demandado; la otra, el demandante.',
    cuerpo: [
      'La consulta de denuncias devuelve las causas en las que la cédula figura como parte demandada. La de juicios como demandante devuelve aquellas en las que la persona es quien inicia el proceso. Son el mismo registro visto desde los dos lados.',
      'Ambas devuelven el número de juicio, la materia, el tipo de acción, la fecha y la judicatura que lleva el caso. El detalle del trámite y su estado actual se consultan en la propia judicatura, que es donde vive el expediente.',
      'No aparece todo. La Función Judicial publica lo que su consulta de causas expone; los procesos reservados por ley no figuran en ninguna fuente pública, ni aquí ni en el portal oficial.',
      'Aparecer en una causa no dice nada por sí mismo sobre la culpabilidad de nadie: un proceso puede estar en trámite, archivado o resuelto a favor de la persona que figura como demandada.'
    ],
    relacionadas: ['consultar-denuncias', 'consultar-juicios']
  }
];

export const GUIA_POR_SLUG = Object.fromEntries(GUIAS.map(g => [g.slug, g])) as Record<string, Guia>;
