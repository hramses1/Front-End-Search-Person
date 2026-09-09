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
  };
  const k = key.toLowerCase();
  if (KEY_MAP[k]) return KEY_MAP[k];
  // Separa camelCase sin partir siglas: 'IEDocumentoAdjunto' queda como
  // 'IE Documento Adjunto', no como 'I E Documento Adjunto'.
  return key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/_/g, ' ').trim();
};

/*
 * Algunas fuentes oficiales, cuando no tienen un dato, no mandan null ni
 * cadena vacia: mandan un relleno suelto (una comilla sola, un guion, dos
 * guiones seguidos de dos puntos). Se ve como un campo roto en vez de un
 * campo sin informacion. Si despues de quitar espacios y signos de
 * puntuacion no queda ninguna letra ni numero, se trata como vacio.
 */
export const esRellenoVacio = (valor: unknown): boolean => {
  if (typeof valor !== 'string') return false;
  return valor.trim() !== '' && !/[a-zA-Z0-9À-ɏ]/.test(valor);
};

export const detectType = (key: string, _value: any): 'badge' | 'date' | 'currency' | 'codigo' | 'text' => {
  const k = key.toLowerCase();
  if (['estado', 'estado_ruc', 'vigente', 'activo', 'status'].some(s => k.includes(s))) return 'badge';
  // Cubre fecha_nacimiento, fecha_expedicion, fecha_caducidad,
  // fecha_inicio_actividades, fecha_infraccion y el 'Fecha' escueto que
  // devuelven juicios y denuncias.
  if (k.includes('fecha')) return 'date';
  if (['valor', 'valor_a_pagar', 'monto', 'saldo'].some(c => k.includes(c))) return 'currency';
  /*
   * Codigo: cedula, RUC, placa y demas identificadores que la persona
   * verifica caracter a caracter. Van en Courier Prime tabular (.dato),
   * igual que en la demo publica: el dato oficial siempre se lee igual,
   * sea en la portada o en el panel.
   */
  if (['cedula', 'ci', 'ruc', 'placa', 'plate', 'matricula', 'chasis', 'motor', 'numero_licencia', 'licencia'].some(c => k.includes(c))) return 'codigo';
  return 'text';
};
