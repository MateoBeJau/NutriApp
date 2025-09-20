import { PrismaClient, EstadoConsulta } from '@/generated/prisma'
import { Consulta, CrearConsulta, ActualizarConsulta, ConsultaConPaciente } from '@/types/consulta'

const prisma = new PrismaClient()

export class ConsultasService {
  // Crear una nueva consulta
  static async crearConsulta(usuarioId: string, datos: CrearConsulta): Promise<Consulta> {
    const consulta = await prisma.consulta.create({
      data: {
        usuarioId,
        pacienteId: datos.pacienteId,
        inicio: datos.inicio,
        fin: datos.fin,
        lugar: datos.lugar,
        notas: datos.notas,
      },
      include: {
        paciente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          }
        }
      }
    })

    return consulta as ConsultaConPaciente
  }

  // Obtener consultas de un usuario en un rango de fechas
  static async obtenerConsultasPorRango(
    usuarioId: string, 
    fechaInicio: Date, 
    fechaFin: Date
  ): Promise<ConsultaConPaciente[]> {
    const consultas = await prisma.consulta.findMany({
      where: {
        usuarioId,
        inicio: {
          gte: fechaInicio,
          lte: fechaFin,
        }
      },
      include: {
        paciente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          }
        },
        mediciones: {
          orderBy: {
            fecha: 'desc'
          }
        }
      },
      orderBy: {
        inicio: 'asc'
      }
    })

    return consultas as ConsultaConPaciente[]
  }

  // Obtener consultas de un día específico
  static async obtenerConsultasDelDia(usuarioId: string, fecha: Date): Promise<ConsultaConPaciente[]> {
    const inicioDia = new Date(fecha)
    inicioDia.setHours(0, 0, 0, 0)
    
    const finDia = new Date(fecha)
    finDia.setHours(23, 59, 59, 999)

    return this.obtenerConsultasPorRango(usuarioId, inicioDia, finDia)
  }

  // Obtener una consulta por ID
  static async obtenerConsultaPorId(consultaId: string, usuarioId: string): Promise<ConsultaConPaciente | null> {
    const consulta = await prisma.consulta.findFirst({
      where: {
        id: consultaId,
        usuarioId
      },
      include: {
        paciente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          }
        },
        mediciones: {
          orderBy: {
            fecha: 'desc'
          }
        }
      }
    })

    return consulta as ConsultaConPaciente | null
  }

  // Actualizar una consulta
  static async actualizarConsulta(
    consultaId: string, 
    usuarioId: string, 
    datos: ActualizarConsulta
  ): Promise<ConsultaConPaciente> {
    const consulta = await prisma.consulta.update({
      where: {
        id: consultaId,
        usuarioId
      },
      data: {
        inicio: datos.inicio,
        fin: datos.fin,
        estado: datos.estado,
        lugar: datos.lugar,
        notas: datos.notas,
      },
      include: {
        paciente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          }
        },
        mediciones: {
          orderBy: {
            fecha: 'desc'
          }
        }
      }
    })

    return consulta as ConsultaConPaciente
  }

  // Eliminar una consulta
  static async eliminarConsulta(consultaId: string, usuarioId: string): Promise<void> {
    await prisma.consulta.delete({
      where: {
        id: consultaId,
        usuarioId
      }
    })
  }

  // Obtener consultas de un paciente específico
  static async obtenerConsultasDePaciente(
    pacienteId: string, 
    usuarioId: string
  ): Promise<ConsultaConPaciente[]> {
    const consultas = await prisma.consulta.findMany({
      where: {
        pacienteId,
        usuarioId
      },
      include: {
        paciente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          }
        },
        mediciones: {
          orderBy: {
            fecha: 'desc'
          }
        }
      },
      orderBy: {
        inicio: 'desc'
      }
    })

    return consultas as ConsultaConPaciente[]
  }

  // Verificar disponibilidad en un horario
  static async verificarDisponibilidad(
    usuarioId: string,
    inicio: Date,
    fin: Date,
    consultaIdExcluir?: string
  ): Promise<boolean> {
    const consultasExistentes = await prisma.consulta.findMany({
      where: {
        usuarioId,
        estado: {
          not: 'CANCELADO'
        },
        OR: [
          {
            AND: [
              { inicio: { lte: inicio } },
              { fin: { gt: inicio } }
            ]
          },
          {
            AND: [
              { inicio: { lt: fin } },
              { fin: { gte: fin } }
            ]
          },
          {
            AND: [
              { inicio: { gte: inicio } },
              { fin: { lte: fin } }
            ]
          }
        ],
        ...(consultaIdExcluir && {
          id: {
            not: consultaIdExcluir
          }
        })
      }
    })

    return consultasExistentes.length === 0
  }
}
