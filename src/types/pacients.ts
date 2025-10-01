export interface Paciente {
  id: string
  usuarioId: string
  nombre: string
  apellido: string
  email?: string | null
  telefono?: string | null
  fechaNacimiento?: Date | null
  sexo?: string | null
  alturaCm?: number | null
  notas?: string | null
  activo: boolean
  creadoEn: Date
  actualizadoEn: Date
}

export interface CreatePacienteInput {
  usuarioId: string
  nombre: string
  apellido: string
  email?: string
  telefono?: string
  fechaNacimiento?: Date
  sexo?: string
  alturaCm?: number
  notas?: string
}

export interface UpdatePacienteInput {
  nombre?: string
  apellido?: string
  email?: string
  telefono?: string
  fechaNacimiento?: Date
  sexo?: string
  alturaCm?: number
  notas?: string
  activo?: boolean
}
