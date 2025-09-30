'use server'

import { prisma } from '@/lib/prisma'
import { ConsultasService } from '@/services/consultas'
import { enviarNotificacionConsulta } from '@/services/notificaciones'
import { CrearConsulta, ActualizarConsulta, EstadoConsulta, EstadoPago } from '@/types/consulta'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function crearConsulta(usuarioId: string, formData: FormData) {
  console.log('🚩 Entrando a crearConsulta');
  try {
    const datos = {
      pacienteId: formData.get('pacienteId') as string,
      inicio: new Date(formData.get('inicio') as string),
      fin: new Date(formData.get('fin') as string),
      lugar: formData.get('lugar') as string || 'Consultorio principal',
      notas: formData.get('notas') as string || undefined,
    }
    console.log('✅ Datos recibidos:', datos);

    // Validar datos requeridos
    if (!datos.pacienteId || !datos.inicio || !datos.fin) {
      console.log('❌ Faltan datos requeridos');
      throw new Error('Faltan datos requeridos')
    }
    console.log('✅ Datos requeridos OK');

    // Verificar disponibilidad
    const disponible = await ConsultasService.verificarDisponibilidad(
      usuarioId,
      datos.inicio,
      datos.fin
    )
    console.log('✅ Disponibilidad:', disponible);

    if (!disponible) {
      console.log('❌ El horario seleccionado no está disponible');
      throw new Error('El horario seleccionado no está disponible')
    }
    console.log('✅ Horario disponible');

    // Crear la consulta incluyendo los datos del paciente y usuario
    const consulta = await prisma.consulta.create({
      data: {
        ...datos,
        usuarioId,
      },
      include: {
        paciente: true,
        usuario: true,
      }
    })
    console.log('🟢 Consulta creada:', consulta);

    // Preparar datos para la notificación
    const notificacionData = {
      paciente: {
        nombre: consulta.paciente.nombre,
        apellido: consulta.paciente.apellido,
        email: consulta.paciente.email,
      },
      consulta: {
        fecha: consulta.inicio,
        hora: consulta.inicio.toLocaleTimeString(),
        lugar: consulta.lugar || 'Consultorio principal',
      },
      nutricionista: {
        nombre: consulta.usuario.nombre,
      }
    }

    console.log('🟢 Llamando a enviarNotificacionConsulta', notificacionData);
    // Enviar notificación
    await enviarNotificacionConsulta(notificacionData)
    console.log('✅ Notificación enviada (o intentada)');
    
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
      estadoPago: formData.get('estadoPago') as EstadoPago || undefined,
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

export async function cambiarEstadoPago(
  consultaId: string, 
  usuarioId: string, 
  nuevoEstadoPago: EstadoPago
) {
  try {
    await ConsultasService.actualizarConsulta(consultaId, usuarioId, { estadoPago: nuevoEstadoPago })
    
    revalidatePath('/dashboard/agenda')
    revalidatePath('/dashboard/pacientes')
    return { success: true, message: 'Estado de pago actualizado' }
  } catch (error) {
    console.error('Error al cambiar estado de pago:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al cambiar el estado de pago' 
    }
  }
}
