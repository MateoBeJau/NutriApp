'use server';

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function obtenerPlanesPaciente(pacienteId: string) {
  try {
    // Verificar autenticación
    const user = await requireAuth();
    if (!user?.id) {
      throw new Error('No autorizado');
    }

    // Obtener planes del paciente
    const planes = await prisma.planNutricional.findMany({
      where: {
        pacienteId
      },
      include: {
        comidas: {
          include: {
            alimentos: {
              include: {
                alimento: true
              }
            }
          },
          orderBy: {
            orden: 'asc'
          }
        }
      },
      orderBy: {
        fechaInicio: 'desc'
      }
    });

    return {
      success: true,
      planes
    };

  } catch (error) {
    console.error('Error al obtener planes del paciente:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}
