export enum EstadoConsulta {
  PROGRAMADO = 'PROGRAMADO',
  CONFIRMADO = 'CONFIRMADO',
  CANCELADO = 'CANCELADO',
  AUSENTE = 'AUSENTE',
  COMPLETADO = 'COMPLETADO',
  REAGENDADO = 'REAGENDADO'
}

export enum EstadoPago {
  PAGADO = 'PAGADO',
  PENDIENTE = 'PENDIENTE'
}

export interface Consulta {
  id: string
  usuarioId: string
  pacienteId: string
  inicio: Date
  fin: Date
  estado: EstadoConsulta
  estadoPago: EstadoPago
  lugar?: string
  notas?: string
  creadoEn: Date
  actualizadoEn: Date
  
  // Relaciones
  paciente?: {
    id: string
    nombre: string
    apellido: string
    email?: string
    telefono?: string
  }
  mediciones?: Array<{
    id: string
    fecha: Date
    pesoKg?: number
    alturaCm?: number
    imc?: number
    notas?: string
  }>
}

export interface CrearConsulta {
  pacienteId: string
  inicio: Date
  fin: Date
  lugar?: string
  notas?: string
}

export interface ActualizarConsulta {
  inicio?: Date
  fin?: Date
  estado?: EstadoConsulta
  estadoPago?: EstadoPago
  lugar?: string
  notas?: string
}

export interface ConsultaConPaciente extends Consulta {
  paciente: {
    id: string
    nombre: string
    apellido: string
    email?: string
    telefono?: string
  }
}
