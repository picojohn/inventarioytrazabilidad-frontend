export const TIPOS_ROLES = [
  {id: 'IN', nombre: 'Interno', estado: 1},
  {id: 'EX', nombre: 'Externo', estado: 1},
  {id: 'AC', nombre: 'Administrador Cliente', estado: 1},
];

export const DATO_BOOLEAN = [
  {id: 'S', nombre: 'Sí', estado: 1},
  {id: 'N', nombre: 'No', estado: 1},
];

export const DATO_BOOLEAN_RADIO = [
  {value: 'S', label: 'Sí', estado: 1},
  {value: 'N', label: 'No', estado: 1},
];

export const ESTADO_RADIO = [
  {value: '1', label: 'Activo', estado: 1},
  {value: '0', label: 'Inactivo', estado: 1},
]

export const ESTADO = [
  {id: '1', nombre: 'Activo', estado: 1},
  {id: '0', nombre: 'Inactivo', estado: 1},
];

export const TIPO_LUGAR = [
  {id: 'SD', nombre: 'Sede/Oficina', estado: 1},
  {id: 'PA', nombre: 'Patio', estado: 1},
  {id: 'FI', nombre: 'Finca', estado: 1},
  {id: 'PU', nombre: 'Puerto', estado: 1},
];

export const ESTADOS_SELLOS = [
  {id: 'GEN', nombre: 'Generado', estado: 1},
  {id: 'STO', nombre: 'En Stock', estado: 1},
  {id: 'TTO', nombre: 'En tránsito', estado: 1},
  {id: 'INS', nombre: 'Instalado', estado: 1},
  {id: 'INA', nombre: 'Inactivo', estado: 1},
  {id: 'DEV', nombre: 'Devuelto', estado: 1},
  {id: 'DES', nombre: 'Destruido', estado: 1},
  {id: 'PER', nombre: 'Pérdida', estado: 1},
];

export const ESTADOS_PEDIDOS = [
  {id: 'GRA', nombre: 'En grabación', estado: 1},
  {id: 'REG', nombre: 'Registrado', estado: 1},
  {id: 'CON', nombre: 'Confirmado', estado: 1},
  {id: 'EJE', nombre: 'En Ejecución', estado: 1},
  {id: 'ANU', nombre: 'Anulado', estado: 1},
  {id: 'DES', nombre: 'Despachado', estado: 1},
];

export const OPERADORES = [
  {id: '+', nombre: '+', estado: 1},
  {id: '-', nombre: '-', estado: 1},
  {id: '*', nombre: '*', estado: 1},
];

export const ESTADOS_REMISIONES = [
  {id: 'GEN', nombre: 'Generada', estado: 1},
  {id: 'ACP', nombre: 'Aceptada', estado: 1},
  {id: 'RCH', nombre: 'Rechazada', estado: 1},
  {id: 'ANU', nombre: 'Anulada', estado: 1},
];

export const TIPOS_EMPAQUES = [
  {id: 'I', nombre: 'Individual', estado: 1},
  {id: 'K', nombre: 'Kit', estado: 1},
];

export const CLASES_EVENTOS = [
  {id: 'C', nombre: 'Cliente', estado: 1},
  {id: 'I', nombre: 'Interno', estado: 1},
];

export const UNIDADES_CARGA_TRANSPORTE = [
  {id: 'C', nombre: 'Carga', estado: 1},
  {id: 'T', nombre: 'Transporte', estado: 1},
];

export const UNIDADES_CARGA_TRANSPORTE_RADIO = [
  {value: 'C', label: 'Carga', estado: 1},
  {value: 'T', label: 'Transporte', estado: 1},
];

export const ESTADOS_OPERACION_EMBARQUE = [
  {id: 'VIG', nombre: 'Vigente', estado: 1},
  {id: 'ARC', nombre: 'Archivada', estado: 1},
];

export const ESTADOS_CONTENEDORES_OPERACION_EMBARQUE = [
  {id: 'ACT', nombre: 'Activo', estado: 1},
  {id: 'ASG', nombre: 'Asignado', estado: 1},
  {id: 'INA', nombre: 'Inactivo', estado: 1},
  {id: 'REC', nombre: 'Rechazado', estado: 1},
];

export const TIPOS_DATOS_ADICIONALES = [
  {value: 'T', label: 'Texto', estado: 1},
  {value: 'N', label: 'Numérico', estado: 1},
  {value: 'F', label: 'Fecha', estado: 1},
];

export const NIVELES_DATOS_ADICIONALES = [
  {value: 'INS', label: 'Inspección', estado: 1},
  {value: 'TPT', label: 'Unidad Transporte', estado: 1},
  {value: 'CAR', label: 'Unidad Carga', estado: 1},
  {value: 'CON', label: 'Contenedor', estado: 1},
];

export const ESTADOS_SOLICITUD_ACCESO = [
  {id: 'PDTE', nombre: 'Pendiente', estado: 1},
  {id: 'APRB', nombre: 'Aprobada', estado: 1},
  {id: 'RECH', nombre: 'Rechazada', estado: 1},
  {id: 'VENC', nombre: 'Vencida', estado: 1},
];

