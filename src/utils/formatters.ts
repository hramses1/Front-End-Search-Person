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
  };
  const k = key.toLowerCase();
  if (KEY_MAP[k]) return KEY_MAP[k];
  // Separa camelCase sin partir siglas: 'IEDocumentoAdjunto' queda como
  // 'IE Documento Adjunto', no como 'I E Documento Adjunto'.
  return key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/_/g, ' ').trim();
};

export const detectType = (key: string, _value: any): 'badge' | 'date' | 'currency' | 'text' => {
  const k = key.toLowerCase();
  if (['estado', 'estado_ruc', 'vigente', 'activo', 'status'].some(s => k.includes(s))) return 'badge';
  // Cubre fecha_nacimiento, fecha_expedicion, fecha_caducidad,
  // fecha_inicio_actividades, fecha_infraccion y el 'Fecha' escueto que
  // devuelven juicios y denuncias.
  if (k.includes('fecha')) return 'date';
  if (['valor', 'valor_a_pagar', 'monto', 'saldo'].some(c => k.includes(c))) return 'currency';
  return 'text';
};
