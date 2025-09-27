'use server';

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { TipoComida } from '@/generated/prisma';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_PLANES_URL;
const N8N_AUTH_TOKEN = process.env.N8N_AUTH_TOKEN;

export async function generarPlanPreview(pacienteId: string) {
  try {
    console.log('=== GENERANDO VISTA PREVIA DEL PLAN ===');
    console.log('Paciente ID:', pacienteId);
    
    // Debug: verificar variables de entorno
    console.log('N8N_WEBHOOK_PLANES_URL:', process.env.N8N_WEBHOOK_PLANES_URL);
    console.log('N8N_AUTH_TOKEN:', process.env.N8N_AUTH_TOKEN ? 'SET' : 'NOT SET');
    
    // Verificar autenticación
    const user = await requireAuth();
    if (!user?.id) {
      throw new Error('No autorizado');
    }

    // Validar datos requeridos
    if (!pacienteId) {
      throw new Error('ID de paciente requerido');
    }

    if (!N8N_WEBHOOK_URL || !N8N_AUTH_TOKEN) {
      throw new Error('Configuración de n8n incompleta');
    }

    // Obtener datos del paciente
    console.log('Obteniendo datos del paciente...');
    const paciente = await prisma.paciente.findUnique({
      where: { id: pacienteId },
      include: {
        perfilMedico: true,
        mediciones: {
          orderBy: { fecha: 'desc' },
          take: 10
        }
      }
    });

    if (!paciente) {
      throw new Error('Paciente no encontrado');
    }

    // Obtener la medición más reciente
    const medicionReciente = paciente.mediciones[0];
    if (!medicionReciente) {
      throw new Error('No se encontraron mediciones para el paciente');
    }

    // Construir payload para n8n
    const payload = {
      paciente: {
        datosBasicos: {
          nombre: paciente.nombre,
          apellido: paciente.apellido,
          edad: paciente.fechaNacimiento ? 
            new Date().getFullYear() - new Date(paciente.fechaNacimiento).getFullYear() : null,
          sexo: paciente.sexo,
          alturaCm: paciente.alturaCm
        },
        perfilMedico: paciente.perfilMedico ? {
          gustos: paciente.perfilMedico.gustos,
          disgustos: paciente.perfilMedico.disgustos,
          alergias: paciente.perfilMedico.alergias,
          enfermedades: paciente.perfilMedico.enfermedades,
          medicamentos: paciente.perfilMedico.medicamentos,
          restricciones: paciente.perfilMedico.restricciones,
          objetivos: paciente.perfilMedico.objetivos
        } : null,
        mediciones: {
          pesoActual: medicionReciente.pesoKg,
          imc: medicionReciente.imc,
          historialPeso: paciente.mediciones.map(m => ({
            fecha: m.fecha.toISOString(),
            peso: m.pesoKg,
            imc: m.imc
          }))
        }
      }
    };

    console.log('Enviando datos a n8n:', JSON.stringify(payload, null, 2));
    console.log('URL del webhook:', N8N_WEBHOOK_URL);
    console.log('Token de auth:', N8N_AUTH_TOKEN);

    // Llamar a n8n
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': N8N_AUTH_TOKEN || '',
      },
      body: JSON.stringify(payload)
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

    return {
      success: true,
      plan: planGenerado
    };

  } catch (error) {
    console.error('Error al generar vista previa del plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

interface PlanData {
  nombre?: string;
  descripcion?: string;
  caloriasObjetivo?: number;
  proteinasObjetivo?: number;
  carbohidratosObjetivo?: number;
  grasasObjetivo?: number;
  observaciones?: string;
  promptIA?: string;
  modeloIA?: string;
  restriccionesAplicadas?: string;
  comidas?: Array<{
    tipo: TipoComida;
    nombre: string;
    descripcion?: string;
    horaRecomendada?: string;
    caloriasTotal?: number;
    proteinasTotal?: number;
    carbohidratosTotal?: number;
    grasasTotal?: number;
    alimentos: Array<{
      cantidad: number;
      unidad: string;
      preparacion?: string;
      alimento: {
        nombre: string;
        categoria?: string;
        caloriasPor100g: number;
        proteinasPor100g: number;
        carbohidratosPor100g: number;
        grasasPor100g: number;
        caracteristicas?: string;
        alergenos?: string;
        restricciones?: string;
      };
    }>;
  }>;
}

export async function guardarPlanConfirmado(pacienteId: string, planData: PlanData) {
  try {
    console.log('=== GUARDANDO PLAN CONFIRMADO ===');
    
    // Verificar autenticación
    const user = await requireAuth();
    if (!user?.id) {
      throw new Error('No autorizado');
    }

    const usuarioId = user.id;

    // Crear el plan nutricional en la base de datos
    console.log('=== INICIANDO CREACIÓN EN BD ===');
    const nuevoPlan = await prisma.planNutricional.create({
      data: {
        pacienteId,
        usuarioId,
        nombre: planData.nombre || `Plan nutricional generado por IA`,
        descripcion: planData.descripcion,
        tipo: 'GENERADO_IA',
        estado: 'BORRADOR',
        fechaInicio: new Date(),
        caloriasObjetivo: planData.caloriasObjetivo,
        proteinasObjetivo: planData.proteinasObjetivo,
        carbohidratosObjetivo: planData.carbohidratosObjetivo,
        grasasObjetivo: planData.grasasObjetivo,
        notas: planData.observaciones,
        promptIA: planData.promptIA || "Prompt generado por n8n",
        modeloIA: planData.modeloIA || "gpt-3.5-turbo",
        restriccionesAplicadas: planData.restriccionesAplicadas,
        comidas: {
          create: (planData.comidas || []).map((comida, index: number) => ({
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
              create: comida.alimentos.map((alimento) => ({
                cantidad: alimento.cantidad,
                unidad: alimento.unidad,
                calorias: (alimento.alimento.caloriasPor100g * alimento.cantidad) / 100,
                proteinas: (alimento.alimento.proteinasPor100g * alimento.cantidad) / 100,
                carbohidratos: (alimento.alimento.carbohidratosPor100g * alimento.cantidad) / 100,
                grasas: (alimento.alimento.grasasPor100g * alimento.cantidad) / 100,
                preparacion: alimento.preparacion,
                alimento: {
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
                alimento: true
              }
            }
          }
        }
      }
    });

    console.log('=== PLAN GUARDADO ===');
    console.log('ID del plan:', nuevoPlan.id);
    console.log('Plan guardado exitosamente');

    return {
      success: true,
      planId: nuevoPlan.id
    };

  } catch (error) {
    console.error('Error al guardar plan confirmado:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}
