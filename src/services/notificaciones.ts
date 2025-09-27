'use server'

import { NotificacionConsultaData } from "@/types/notificaciones";

export async function enviarNotificacionConsulta(data: NotificacionConsultaData) {
  try {
    // Log inicial
    console.log('🚀 Iniciando envío de notificación:', {
      paciente: {
        email: data.paciente.email,
        nombre: data.paciente.nombre
      },
      consulta: {
        fecha: data.consulta.fecha,
        lugar: data.consulta.lugar
      }
    });

    const webhookUrl = process.env.N8N_WEBHOOK_CONSULTA_URL;
    console.log('📍 URL del webhook:', webhookUrl);

    if (!webhookUrl) {
      console.error('❌ N8N_WEBHOOK_URL no está configurada en .env');
      throw new Error('URL del webhook no configurada');
    }

    if (!data.paciente.email) {
      console.error('❌ El paciente no tiene email configurado');
      throw new Error('Email del paciente no configurado');
    }

    // Log antes de enviar
    console.log('📤 Intentando enviar datos al webhook...');
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paciente: {
          nombre: data.paciente.nombre,
          apellido: data.paciente.apellido,
          email: data.paciente.email,
        },
        consulta: {
          fecha: data.consulta.fecha,
          hora: data.consulta.hora,
          lugar: data.consulta.lugar,
        },
        nutricionista: {
          nombre: data.nutricionista.nombre,
        }
      }),
    });

    // Log de respuesta
    console.log('📥 Respuesta del webhook:', {
      status: response.status,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error del webhook:', errorText);
      throw new Error(`Error al enviar la notificación: ${errorText}`);
    }

    console.log('✅ Notificación enviada exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error en enviarNotificacionConsulta:', error);
    return false;
  }
}