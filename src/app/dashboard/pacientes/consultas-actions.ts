'use server'

import { getCurrentUser } from '@/lib/auth'
import { ConsultasService } from '@/services/consultas'
import { redirect } from 'next/navigation'

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
