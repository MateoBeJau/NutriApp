// ✅ BUENO: Importar enums de Prisma, no duplicarlos
import { EstadoConsulta, EstadoPago, Medicion } from '@prisma/client';

export interface Consulta {
  id: string
  usuarioId: string
  pacienteId: string
  inicio: Date
  fin: Date
  estado: EstadoConsulta  // ✅ Usar el de Prisma
  estadoPago: EstadoPago  // ✅ Usar el de Prisma
  lugar?: string | null
  notas?: string | null
  creadoEn: Date
  actualizadoEn: Date
  
  // Relaciones
  paciente?: {
    id: string
    nombre: string
    apellido: string
    email?: string | null
    telefono?: string | null
  }
  mediciones?: Array<{
    id: string
    fecha: Date
    pesoKg?: number | null
    alturaCm?: number | null
    imc?: number | null
    notas?: string | null
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
  estado?: EstadoConsulta  // ✅ Usar el de Prisma
  estadoPago?: EstadoPago  // ✅ Usar el de Prisma
  lugar?: string
  notas?: string
}

export interface ConsultaConPaciente extends Consulta {
  paciente: {
    id: string
    nombre: string
    apellido: string
    email?: string | null
    telefono?: string | null
  }
  mediciones?: Medicion[] // ✅ Agregar mediciones con tipo de Prisma
}
