'use server'

import { getCurrentUser } from '@/lib/auth'
import { ConsultasService } from '@/services/consultas'
import { redirect } from 'next/navigation'

export async function buscarConsultaPorIdAction(consultaId: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  try {
    const consulta = await ConsultasService.obtenerConsultaPorId(consultaId, user.id)
    return consulta
  } catch (error) {
    console.error('Error al buscar consulta por ID:', error)
    return null
  }
}

