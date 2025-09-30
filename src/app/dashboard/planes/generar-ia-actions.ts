'use server';

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_PLANES_URL;
const N8N_AUTH_TOKEN = process.env.N8N_AUTH_TOKEN;

export async function generarPlanNutricionalIA(pacienteId: string) {
  try {
    console.log('=== INICIANDO GENERACIÓN DE PLAN IA ===');
    console.log('Paciente ID:', pacienteId);
    
    // Debug: verificar variables de entorno
    console.log('N8N_WEBHOOK_PLANES_URL:', process.env.N8N_WEBHOOK_PLANES_URL);
    console.log('N8N_AUTH_TOKEN:', process.env.N8N_AUTH_TOKEN ? 'SET' : 'NOT SET');
    
    // Verificar autenticación usando nuestro sistema JWT
    const user = await requireAuth();
    if (!user?.id) {
      throw new Error('No autorizado');
    }

    const usuarioId = user.id;

    // Validar datos requeridos
    if (!pacienteId) {
      throw new Error('ID de paciente requerido');
    }

    // Obtener datos completos del paciente
    const paciente = await prisma.paciente.findUnique({
      where: { id: pacienteId },
      include: {
        perfilMedico: true,
        mediciones: {
          orderBy: { fecha: 'desc' },
          take: 5, // Últimas 5 mediciones
        },
      },
    });

    if (!paciente) {
      throw new Error('Paciente no encontrado');
    }

    // Preparar datos para n8n
    const datosParaIA = {
      paciente: {
        datosBasicos: {
          nombre: paciente.nombre,
          apellido: paciente.apellido,
          edad: paciente.fechaNacimiento 
            ? Math.floor((new Date().getTime() - new Date(paciente.fechaNacimiento).getTime()) / 31557600000)
            : null,
          sexo: paciente.sexo,
          alturaCm: paciente.alturaCm,
        },
        perfilMedico: paciente.perfilMedico ? {
          gustos: paciente.perfilMedico.gustos,
          disgustos: paciente.perfilMedico.disgustos,
          alergias: paciente.perfilMedico.alergias,
          enfermedades: paciente.perfilMedico.enfermedades,
          medicamentos: paciente.perfilMedico.medicamentos,
          restricciones: paciente.perfilMedico.restricciones,
          objetivos: paciente.perfilMedico.objetivos,
        } : null,
        mediciones: {
          pesoActual: paciente.mediciones[0]?.pesoKg,
          imc: paciente.mediciones[0]?.imc,
          historialPeso: paciente.mediciones.map(m => ({
            fecha: m.fecha,
            peso: m.pesoKg,
            imc: m.imc,
          })),
        },
      },
    };

    if (!N8N_WEBHOOK_URL) {
      throw new Error('URL de n8n no configurada');
    }

    // Debug: ver qué datos enviamos
    console.log('Enviando datos a n8n:', JSON.stringify(datosParaIA, null, 2));
    console.log('URL del webhook:', N8N_WEBHOOK_URL);
    console.log('Token de auth:', N8N_AUTH_TOKEN);

    // Enviar datos a n8n
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': N8N_AUTH_TOKEN || '',
      },
      body: JSON.stringify(datosParaIA),
    });

    console.log('Status de respuesta:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de n8n:', errorText);
      throw new Error(`Error al comunicarse con n8n: ${response.status} - ${errorText}`);
    }

    const respuestaN8n = await response.json();
    
    // Debug: ver qué devuelve n8n
    console.log('Respuesta de n8n:', JSON.stringify(respuestaN8n, null, 2));
    console.log('Tipo de respuesta:', typeof respuestaN8n);
    console.log('Es array?', Array.isArray(respuestaN8n));
    
    // Extraer el plan del array si viene en array
    const planGenerado = Array.isArray(respuestaN8n) ? respuestaN8n[0] : respuestaN8n;
    
    console.log('Plan extraído:', JSON.stringify(planGenerado, null, 2));
    console.log('Tiene comidas?', planGenerado.comidas);
    console.log('Es array?', Array.isArray(planGenerado.comidas));

    // Debug: verificar estructura antes de guardar
    console.log('=== DEBUG ANTES DE GUARDAR ===');
    console.log('planGenerado.comidas:', planGenerado.comidas);
    console.log('Cantidad de comidas:', planGenerado.comidas?.length);
    if (planGenerado.comidas && planGenerado.comidas[0]) {
      console.log('Primera comida:', planGenerado.comidas[0]);
      console.log('Alimentos de la primera comida:', planGenerado.comidas[0].alimentos);
    }

    // Crear el plan nutricional en la base de datos
    console.log('=== INICIANDO CREACIÓN EN BD ===');
    const nuevoPlan = await prisma.planNutricional.create({
      data: {
        pacienteId,
        usuarioId,
        nombre: planGenerado.nombre || `Plan nutricional para ${paciente.nombre}`,
        descripcion: planGenerado.descripcion,
        tipo: 'GENERADO_IA',
        estado: 'BORRADOR',
        fechaInicio: new Date(),
        caloriasObjetivo: planGenerado.caloriasObjetivo,
        proteinasObjetivo: planGenerado.macronutrientes?.proteinas,
        carbohidratosObjetivo: planGenerado.macronutrientes?.carbohidratos,
        grasasObjetivo: planGenerado.macronutrientes?.grasas,
        notas: planGenerado.observaciones,
        promptIA: planGenerado.prompt,
        modeloIA: planGenerado.modelo,
        restriccionesAplicadas: JSON.stringify(planGenerado.restriccionesAplicadas),
        comidas: {
          create: (planGenerado.comidas || []).map((comida: any, index: number) => ({
            tipo: comida.tipo,
            nombre: comida.nombre,
            descripcion: comida.descripcion,
            horaRecomendada: comida.horaRecomendada,
            caloriasTotal: comida.caloriasTotal,
            proteinasTotal: comida.proteinasTotal,
            carbohidratosTotal: comida.carbohidratosTotal,
            grasasTotal: comida.grasasTotal,
            orden: index,
            alimentos: {
              create: comida.alimentos.map((alimento: any) => ({
                cantidad: alimento.cantidad,
                unidad: alimento.unidad,
                calorias: (alimento.alimento.caloriasPor100g * alimento.cantidad) / 100,
                proteinas: (alimento.alimento.proteinasPor100g * alimento.cantidad) / 100,
                carbohidratos: (alimento.alimento.carbohidratosPor100g * alimento.cantidad) / 100,
                grasas: (alimento.alimento.grasasPor100g * alimento.cantidad) / 100,
                preparacion: alimento.preparacion,
                alimento: {
                  connectOrCreate: {
                    where: { 
                      nombre: alimento.alimento.nombre 
                    },
                    create: {
                      nombre: alimento.alimento.nombre,
                      categoria: alimento.alimento.categoria || 'General',
                      caloriasPor100g: alimento.alimento.caloriasPor100g,
                      proteinasPor100g: alimento.alimento.proteinasPor100g,
                      carbohidratosPor100g: alimento.alimento.carbohidratosPor100g,
                      grasasPor100g: alimento.alimento.grasasPor100g,
                      caracteristicas: alimento.alimento.caracteristicas,
                      alergenos: alimento.alimento.alergenos,
                      restricciones: alimento.alimento.restricciones,
                      esGenerico: true,
                      activo: true
                    }
                  }
                },
              })),
            },
          })),
        },
      },
      include: {
        comidas: {
          include: {
            alimentos: {
              include: {
                alimento: true,
              },
            },
          },
        },
      },
    });

    // Debug: verificar qué se guardó
    console.log('=== PLAN GUARDADO ===');
    console.log('ID del plan:', nuevoPlan.id);
    console.log('Comidas guardadas:', nuevoPlan.comidas?.length);
    if (nuevoPlan.comidas && nuevoPlan.comidas[0]) {
      console.log('Primera comida guardada:', nuevoPlan.comidas[0]);
      console.log('Alimentos de la primera comida:', nuevoPlan.comidas[0].alimentos?.length);
    }

    // Revalidar la página de planes del paciente
    revalidatePath(`/pacientes/${pacienteId}/planes`);

    return { success: true, plan: nuevoPlan };
  } catch (error) {
    console.error('Error al generar plan nutricional:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error al generar plan nutricional' 
    };
  }
}