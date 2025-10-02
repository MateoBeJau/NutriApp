'use server'

import { getCurrentUser } from '@/lib/auth'
import { ConsultasService } from '@/services/consultas'
import { EstadoPago } from '@prisma/client'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function obtenerConsultasDePacienteAction(pacienteId: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  try {
    return await ConsultasService.obtenerConsultasDePaciente(pacienteId, user.id)
  } catch (error) {
    console.error('Error al obtener consultas del paciente:', error)
    throw new Error('Error al cargar las consultas del paciente')
  }
}

export async function eliminarConsultaAction(consultaId: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  try {
    await ConsultasService.eliminarConsulta(consultaId, user.id)
    return { success: true }
  } catch (error) {
    console.error('Error al eliminar la consulta:', error)
    throw new Error('Error al eliminar la consulta')
  }
}

export async function cambiarEstadoPagoAction(consultaId: string, nuevoEstadoPago: EstadoPago) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  try {
    await ConsultasService.actualizarConsulta(consultaId, user.id, { estadoPago: nuevoEstadoPago })
    
    revalidatePath('/dashboard/pacientes')
    revalidatePath('/dashboard/agenda')
    
    return { 
      success: true, 
      message: `Estado de pago cambiado a ${nuevoEstadoPago}` 
    }
  } catch (error) {
    console.error('Error al cambiar estado de pago:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al cambiar el estado de pago' 
    }
  }
}