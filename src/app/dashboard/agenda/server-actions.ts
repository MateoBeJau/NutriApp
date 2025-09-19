'use server'

import { getCurrentUser } from '@/lib/auth'
import { ConsultasService } from '@/services/consultas'
import { obtenerPacientesActivos } from '@/services/pacientes'
import { redirect } from 'next/navigation'

export async function obtenerConsultasDelDia(fecha: Date) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  try {
    return await ConsultasService.obtenerConsultasDelDia(user.id, fecha)
  } catch (error) {
    console.error('Error al obtener consultas:', error)
    throw new Error('Error al cargar consultas')
  }
}

export async function obtenerPacientesActivosAction() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  try {
    return await obtenerPacientesActivos(user.id)
  } catch (error) {
    console.error('Error al obtener pacientes:', error)
    throw new Error('Error al cargar pacientes')
  }
}

export async function crearConsultaAction(datos: {
  pacienteId: string
  inicio: string
  fin: string
  lugar?: string
  notas?: string
}) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  try {
    const consulta = await ConsultasService.crearConsulta(user.id, {
      pacienteId: datos.pacienteId,
      inicio: new Date(datos.inicio),
      fin: new Date(datos.fin),
      lugar: datos.lugar,
      notas: datos.notas
    })
    
    return { success: true, consulta }
  } catch (error) {
    console.error('Error al crear consulta:', error)
    return { success: false, error: 'Error al crear la consulta' }
  }
}

export async function actualizarConsultaAction(consultaId: string, datos: {
  pacienteId: string
  inicio: string
  fin: string
  lugar?: string
  notas?: string
}) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  try {
    const consulta = await ConsultasService.actualizarConsulta(consultaId, user.id, {
      inicio: new Date(datos.inicio),
      fin: new Date(datos.fin),
      lugar: datos.lugar,
      notas: datos.notas
    })
    
    return { success: true, consulta }
  } catch (error) {
    console.error('Error al actualizar consulta:', error)
    return { success: false, error: 'Error al actualizar la consulta' }
  }
}

export async function cambiarEstadoConsultaAction(consultaId: string, nuevoEstado: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  try {
    const consulta = await ConsultasService.actualizarConsulta(consultaId, user.id, {
      estado: nuevoEstado as any
    })
    
    return { success: true, consulta }
  } catch (error) {
    console.error('Error al cambiar estado:', error)
    return { success: false, error: 'Error al cambiar el estado' }
  }
}
