'use server'

import { ConsultasService } from '@/services/consultas'
import { CrearConsulta, ActualizarConsulta, EstadoConsulta } from '@/types/consulta'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function crearConsulta(usuarioId: string, formData: FormData) {
  try {
    const datos: CrearConsulta = {
      pacienteId: formData.get('pacienteId') as string,
      inicio: new Date(formData.get('inicio') as string),
      fin: new Date(formData.get('fin') as string),
      lugar: formData.get('lugar') as string || undefined,
      notas: formData.get('notas') as string || undefined,
    }

    // Validar que los datos requeridos estén presentes
    if (!datos.pacienteId || !datos.inicio || !datos.fin) {
      throw new Error('Faltan datos requeridos')
    }

    // Verificar disponibilidad
    const disponible = await ConsultasService.verificarDisponibilidad(
      usuarioId,
      datos.inicio,
      datos.fin
    )

    if (!disponible) {
      throw new Error('El horario seleccionado no está disponible')
    }

    await ConsultasService.crearConsulta(usuarioId, datos)
    
    revalidatePath('/dashboard/agenda')
    return { success: true, message: 'Consulta creada exitosamente' }
  } catch (error) {
    console.error('Error al crear consulta:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al crear la consulta' 
    }
  }
}

export async function actualizarConsulta(
  consultaId: string, 
  usuarioId: string, 
  formData: FormData
) {
  try {
    const datos: ActualizarConsulta = {
      inicio: formData.get('inicio') ? new Date(formData.get('inicio') as string) : undefined,
      fin: formData.get('fin') ? new Date(formData.get('fin') as string) : undefined,
      estado: formData.get('estado') as EstadoConsulta || undefined,
      lugar: formData.get('lugar') as string || undefined,
      notas: formData.get('notas') as string || undefined,
    }

    // Si se están actualizando las fechas, verificar disponibilidad
    if (datos.inicio && datos.fin) {
      const disponible = await ConsultasService.verificarDisponibilidad(
        usuarioId,
        datos.inicio,
        datos.fin,
        consultaId
      )

      if (!disponible) {
        throw new Error('El horario seleccionado no está disponible')
      }
    }

    await ConsultasService.actualizarConsulta(consultaId, usuarioId, datos)
    
    revalidatePath('/dashboard/agenda')
    return { success: true, message: 'Consulta actualizada exitosamente' }
  } catch (error) {
    console.error('Error al actualizar consulta:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al actualizar la consulta' 
    }
  }
}

export async function eliminarConsulta(consultaId: string, usuarioId: string) {
  try {
    await ConsultasService.eliminarConsulta(consultaId, usuarioId)
    
    revalidatePath('/dashboard/agenda')
    return { success: true, message: 'Consulta eliminada exitosamente' }
  } catch (error) {
    console.error('Error al eliminar consulta:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al eliminar la consulta' 
    }
  }
}

export async function cambiarEstadoConsulta(
  consultaId: string, 
  usuarioId: string, 
  nuevoEstado: EstadoConsulta
) {
  try {
    await ConsultasService.actualizarConsulta(consultaId, usuarioId, { estado: nuevoEstado })
    
    revalidatePath('/dashboard/agenda')
    return { success: true, message: 'Estado de consulta actualizado' }
  } catch (error) {
    console.error('Error al cambiar estado:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al cambiar el estado' 
    }
  }
}
