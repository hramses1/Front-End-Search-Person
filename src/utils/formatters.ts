export const mapKey = (key: string): string => {
  const KEY_MAP: Record<string, string> = {
    cedula: 'Cédula', cedula_identidad: 'Cédula', ci: 'Cédula',
    primer_nombre: 'Primer Nombre', segundo_nombre: 'Segundo Nombre',
    primer_apellido: 'Primer Apellido', segundo_apellido: 'Segundo Apellido',
    nombre_completo: 'Nombre Completo', nombres: 'Nombres', apellidos: 'Apellidos',
    fecha_nacimiento: 'Fecha de Nacimiento', lugar_nacimiento: 'Lugar de Nacimiento',
    estado_civil: 'Estado Civil', genero: 'Género', sexo: 'Sexo',
    nacionalidad: 'Nacionalidad', pais: 'País',
    // Campos de UserDenunciasModel: juicios (actor) y denuncias (demandado)
    juicio: 'N.º de Juicio', delito: 'Delito', fecha: 'Fecha',
    nombremateria: 'Materia', nombretipoaccion: 'Tipo de Acción',
    iedocumentoadjunto: 'Documento Adjunto', informacion: 'Información',
    // Arbol judicial anidado dentro de Informacion:
    // JudicaturaModel -> IncidenteJudicaturaModel -> LitiganteModel
    nombrejudicatura: 'Judicatura', idjudicatura: 'ID Judicatura',
    ciudad: 'Ciudad', lstincidentejudicatura: 'Incidentes',
    idincidentejudicatura: 'ID Incidente', idjudicaturadestino: 'Judicatura Destino',
    idmovimientojuicioincidente: 'ID Movimiento', fechacrea: 'Fecha de Creación',
    incidente: 'Incidente',
    lstlitiganteactor: 'Demandantes', lstlitigantedemandado: 'Demandados',
    litiganteactor: 'Demandante', litigantedemandado: 'Demandado',
    tipolitigante: 'Tipo de Litigante', nombreslitigante: 'Nombre',
    representadopor: 'Representado por', idlitigante: 'ID Litigante',
    // Licencia y citaciones (ANT): desde que el back dejo de mandar
    // 'validez' como texto y 'Pendiente'/'pendientes' sueltos.
    desde: 'Desde', hasta: 'Hasta', vigente: 'Vigente',
    tipo: 'Tipo', tipo_licencia: 'Tipo de Licencia', status: 'Estado',
    bloque: 'Bloqueado', posicion: 'Posición', puntos: 'Puntos',
    sancion: 'Sanción', multa: 'Multa', remision: 'Remisión',
    total_a_pagar: 'Total a Pagar', fecha_emision: 'Fecha de Emisión',
  };
  const k = key.toLowerCase();
  if (KEY_MAP[k]) return KEY_MAP[k];
  // Separa camelCase sin partir siglas: 'IEDocumentoAdjunto' queda como
  // 'IE Documento Adjunto', no como 'I E Documento Adjunto'.
  return key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/_/g, ' ').trim();
};

/*
 * Vocabulario unico de estados. El mismo concepto se llamaba distinto segun
 * el endpoint: "Pendiente" en citaciones, "pendientes" en licencias, y
 * "en_impugnación" metia un acento dentro de la propia clave. Ahora
 * status (licencia) y tipo (citacion) devuelven los mismos cinco valores,
 * asi que un solo mapa alcanza para los dos.
 */
const ETIQUETAS_ESTADO: Record<string, string> = {
  pendientes: 'Pendiente',
  en_impugnacion: 'En impugnación',
  anuladas: 'Anulada',
  pagadas: 'Pagada',
  en_convenio: 'En convenio',
};

/** Pendientes, en impugnacion y en convenio siguen abiertos: van en aviso, no en verde. */
const ESTADOS_ABIERTOS = new Set(['pendientes', 'en_impugnacion', 'en_convenio']);

export const esEstadoConocido = (valor: unknown): valor is keyof typeof ETIQUETAS_ESTADO =>
  typeof valor === 'string' && valor in ETIQUETAS_ESTADO;

export const etiquetaEstado = (valor: string): string => ETIQUETAS_ESTADO[valor] ?? valor;

export const esEstadoAbierto = (valor: string): boolean => ESTADOS_ABIERTOS.has(valor);

export const detectType = (key: string, _value: any): 'badge' | 'alerta' | 'date' | 'currency' | 'codigo' | 'text' => {
  const k = key.toLowerCase();
  /*
   * Bloque llega como booleano real (antes "N"/"S"), pero al reves de un
   * badge comun: true es la alerta (bloqueado), no el estado bueno. No
   * puede pasar por la logica generica true->verde de mas abajo.
   */
  if (k.includes('bloque')) return 'alerta';
  if (['estado', 'estado_ruc', 'vigente', 'activo', 'status'].some(s => k.includes(s))) return 'badge';
  // Cubre fecha_nacimiento, fecha_expedicion, fecha_caducidad,
  // fecha_inicio_actividades, fecha_infraccion, fecha_emision, el 'Fecha'
  // escueto que devuelven juicios y denuncias, y desde/hasta de licencia.
  if (k.includes('fecha') || k === 'desde' || k === 'hasta') return 'date';
  if (['valor', 'valor_a_pagar', 'monto', 'saldo', 'multa', 'remision', 'sancion', 'total_a_pagar'].some(c => k.includes(c))) return 'currency';
  /*
   * Codigo: cedula, RUC, placa y demas identificadores que la persona
   * verifica caracter a caracter. Van en Courier Prime tabular (.dato),
   * igual que en la demo publica: el dato oficial siempre se lee igual,
   * sea en la portada o en el panel.
   */
  if (['cedula', 'ci', 'ruc', 'placa', 'plate', 'matricula', 'chasis', 'motor', 'numero_licencia', 'licencia'].some(c => k.includes(c))) return 'codigo';
  return 'text';
};
