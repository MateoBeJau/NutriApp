'use server'

import { getCurrentUser } from '@/lib/auth'
import { ConsultasService } from '@/services/consultas'
import { enviarNotificacionConsulta } from '@/services/notificaciones'
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
  console.log('🚩 Entrando a crearConsultaAction');
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  try {
    console.log('✅ Datos recibidos:', datos);

    // Crear la consulta
    const consulta = await ConsultasService.crearConsulta(user.id, {
      pacienteId: datos.pacienteId,
      inicio: new Date(datos.inicio),
      fin: new Date(datos.fin),
      lugar: datos.lugar,
      notas: datos.notas
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
        fecha: consulta.inicio.toISOString(),
        hora: consulta.inicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        lugar: consulta.lugar || 'Consultorio principal',
      },
      nutricionista: {
        nombre: user.nombre,
      }
    }

    console.log('🟢 Llamando a enviarNotificacionConsulta', notificacionData);
    // Enviar notificación
    await enviarNotificacionConsulta(notificacionData)
    console.log('✅ Notificación enviada (o intentada)');
    
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

export async function agregarMedicionConsultaAction(datos: {
  consultaId: string
  pacienteId: string
  pesoKg?: number
  alturaCm?: number
  imc?: number
  notas?: string
}) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  try {
    // Importar el servicio de mediciones
    const { createMedicionAction } = await import('@/app/dashboard/pacientes/actions')
    
    const resultado = await createMedicionAction(datos.pacienteId, {
      consultaId: datos.consultaId, // ✅ Asociar a la consulta
      fecha: new Date(),
      pesoKg: datos.pesoKg,
      alturaCm: datos.alturaCm,
      imc: datos.imc,
      notas: datos.notas
    })
    
    return { success: true, medicion: resultado }
  } catch (error) {
    console.error('Error al agregar medición a consulta:', error)
    return { success: false, error: 'Error al agregar la medición' }
  }
}
