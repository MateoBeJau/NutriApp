"use server";

import { prisma } from "@/lib/prisma";
import { TipoPlan, EstadoPlan, TipoComida } from "@prisma/client";

export interface CrearPlanNutricional {
  pacienteId: string;
  usuarioId: string;
  nombre: string;
  descripcion?: string;
  tipo?: TipoPlan;
  fechaInicio: Date;
  fechaFin?: Date;
  caloriasObjetivo?: number;
  proteinasObjetivo?: number;
  carbohidratosObjetivo?: number;
  grasasObjetivo?: number;
  notas?: string;
  promptIA?: string;
  modeloIA?: string;
}

export interface CrearComidaPlan {
  planNutricionalId: string;
  tipo: TipoComida;
  nombre: string;
  descripcion?: string;
  horaRecomendada?: string;
  orden: number;
}

export interface AgregarAlimentoComida {
  comidaPlanId: string;
  alimentoId: string;
  cantidad: number;
  unidad: string;
  preparacion?: string;
  notas?: string;
}

/**
 * Crear un nuevo plan nutricional
 */
export async function crearPlanNutricional(data: CrearPlanNutricional) {
  // Verificar que el paciente pertenece al usuario
  const paciente = await prisma.paciente.findFirst({
    where: {
      id: data.pacienteId,
      usuarioId: data.usuarioId
    }
  });

  if (!paciente) {
    throw new Error("Paciente no encontrado o no autorizado");
  }

  // Obtener el perfil médico para guardar las restricciones aplicadas
  const perfilMedico = await prisma.perfilMedico.findUnique({
    where: { pacienteId: data.pacienteId }
  });

  const restriccionesAplicadas = perfilMedico ? JSON.stringify({
    alergias: perfilMedico.alergias,
    restricciones: perfilMedico.restricciones,
    enfermedades: perfilMedico.enfermedades,
    gustos: perfilMedico.gustos,
    disgustos: perfilMedico.disgustos
  }) : null;

  return await prisma.planNutricional.create({
    data: {
      ...data,
      tipo: data.tipo || TipoPlan.MANUAL,
      restriccionesAplicadas
    },
    include: {
      paciente: {
        select: {
          nombre: true,
          apellido: true
        }
      }
    }
  });
}

/**
 * Obtener planes nutricionales de un usuario
 */
export async function obtenerPlanesNutricionales(usuarioId: string, filtros?: {
  pacienteId?: string;
  estado?: EstadoPlan;
  limite?: number;
}) {
  return await prisma.planNutricional.findMany({
    where: {
      usuarioId,
      ...(filtros?.pacienteId && { pacienteId: filtros.pacienteId }),
      ...(filtros?.estado && { estado: filtros.estado })
    },
    include: {
      paciente: {
        select: {
          id: true,
          nombre: true,
          apellido: true
        }
      },
      _count: {
        select: {
          comidas: true
        }
      }
    },
    orderBy: {
      creadoEn: 'desc'
    },
    take: filtros?.limite || 50
  });
}

/**
 * Obtener un plan nutricional por ID
 */
export async function obtenerPlanNutricional(id: string, usuarioId: string) {
  const plan = await prisma.planNutricional.findFirst({
    where: {
      id,
      usuarioId
    },
    include: {
      paciente: {
        include: {
          perfilMedico: true
        }
      },
      comidas: {
        include: {
          alimentos: {
            include: {
              alimento: true
            }
          }
        },
        orderBy: [
          { orden: 'asc' }
        ]
      }
    }
  });

  if (!plan) {
    throw new Error("Plan nutricional no encontrado");
  }

  return plan;
}

/**
 * Crear una comida en un plan
 */
export async function crearComidaPlan(data: CrearComidaPlan) {
  // Verificar que el plan pertenece al usuario (a través de la relación)
  const plan = await prisma.planNutricional.findUnique({
    where: { id: data.planNutricionalId }
  });

  if (!plan) {
    throw new Error("Plan nutricional no encontrado");
  }

  return await prisma.comidaPlan.create({
    data
  });
}

/**
 * Agregar alimento a una comida
 */
export async function agregarAlimentoComida(data: AgregarAlimentoComida) {
  // Obtener información del alimento para calcular valores nutricionales
  const alimento = await prisma.alimento.findUnique({
    where: { id: data.alimentoId }
  });

  if (!alimento) {
    throw new Error("Alimento no encontrado");
  }

  // Calcular valores nutricionales para la cantidad específica
  const factor = data.cantidad / 100; // Los valores están por 100g
  const calorias = alimento.caloriasPor100g * factor;
  const proteinas = alimento.proteinasPor100g * factor;
  const carbohidratos = alimento.carbohidratosPor100g * factor;
  const grasas = alimento.grasasPor100g * factor;

  // Crear la relación alimento-comida
  const alimentoComida = await prisma.alimentoComida.create({
    data: {
      ...data,
      calorias,
      proteinas,
      carbohidratos,
      grasas
    }
  });

  // Recalcular totales de la comida
  await recalcularTotalesComida(data.comidaPlanId);

  return alimentoComida;
}

/**
 * Recalcular totales nutricionales de una comida
 */
async function recalcularTotalesComida(comidaPlanId: string) {
  const alimentos = await prisma.alimentoComida.findMany({
    where: { comidaPlanId }
  });

  const totales = alimentos.reduce(
    (acc, alimento) => ({
      calorias: acc.calorias + (alimento.calorias ?? 0),
      proteinas: acc.proteinas + (alimento.proteinas ?? 0),
      carbohidratos: acc.carbohidratos + (alimento.carbohidratos ?? 0),
      grasas: acc.grasas + (alimento.grasas ?? 0)
    }),
    { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
  );

  await prisma.comidaPlan.update({
    where: { id: comidaPlanId },
    data: {
      caloriasTotal: totales.calorias,
      proteinasTotal: totales.proteinas,
      carbohidratosTotal: totales.carbohidratos,
      grasasTotal: totales.grasas
    }
  });
}

/**
 * Eliminar alimento de una comida
 */
export async function eliminarAlimentoComida(alimentoComidaId: string) {
  const alimentoComida = await prisma.alimentoComida.findUnique({
    where: { id: alimentoComidaId }
  });

  if (!alimentoComida) {
    throw new Error("Alimento no encontrado en la comida");
  }

  await prisma.alimentoComida.delete({
    where: { id: alimentoComidaId }
  });

  // Recalcular totales de la comida
  await recalcularTotalesComida(alimentoComida.comidaPlanId);
}

/**
 * Actualizar estado de un plan
 */
export async function actualizarEstadoPlan(id: string, usuarioId: string, estado: EstadoPlan) {
  return await prisma.planNutricional.updateMany({
    where: {
      id,
      usuarioId
    },
    data: {
      estado
    }
  });
}

/**
 * Duplicar un plan nutricional
 */
export async function duplicarPlan(planId: string, usuarioId: string, nuevoNombre: string) {
  const planOriginal = await obtenerPlanNutricional(planId, usuarioId);
  
  // Crear el nuevo plan
  const nuevoPlan = await prisma.planNutricional.create({
    data: {
      pacienteId: planOriginal.pacienteId,
      usuarioId: planOriginal.usuarioId,
      nombre: nuevoNombre,
      descripcion: planOriginal.descripcion,
      tipo: planOriginal.tipo,
      estado: EstadoPlan.BORRADOR,
      fechaInicio: new Date(),
      caloriasObjetivo: planOriginal.caloriasObjetivo,
      proteinasObjetivo: planOriginal.proteinasObjetivo,
      carbohidratosObjetivo: planOriginal.carbohidratosObjetivo,
      grasasObjetivo: planOriginal.grasasObjetivo,
      notas: planOriginal.notas,
      restriccionesAplicadas: planOriginal.restriccionesAplicadas
    }
  });

  // Duplicar las comidas y alimentos
  for (const comida of planOriginal.comidas) {
    const nuevaComida = await prisma.comidaPlan.create({
      data: {
        planNutricionalId: nuevoPlan.id,
        tipo: comida.tipo,
        nombre: comida.nombre,
        descripcion: comida.descripcion,
        horaRecomendada: comida.horaRecomendada,
        orden: comida.orden
      }
    });

    // Duplicar alimentos de la comida
    for (const alimentoComida of comida.alimentos) {
      await prisma.alimentoComida.create({
        data: {
          comidaPlanId: nuevaComida.id,
          alimentoId: alimentoComida.alimentoId,
          cantidad: alimentoComida.cantidad,
          unidad: alimentoComida.unidad,
          calorias: alimentoComida.calorias,
          proteinas: alimentoComida.proteinas,
          carbohidratos: alimentoComida.carbohidratos,
          grasas: alimentoComida.grasas,
          preparacion: alimentoComida.preparacion,
          notas: alimentoComida.notas
        }
      });
    }

    // Recalcular totales de la nueva comida
    await recalcularTotalesComida(nuevaComida.id);
  }

  return nuevoPlan;
}

/**
 * Eliminar una comida de un plan
 */
export async function eliminarComidaPlan(comidaId: string, usuarioId: string) {
  // Verificar que la comida pertenece al usuario
  const comida = await prisma.comidaPlan.findFirst({
    where: {
      id: comidaId,
      planNutricional: {
        usuarioId
      }
    },
    include: {
      alimentos: true
    }
  });

  if (!comida) {
    throw new Error("Comida no encontrada o no tienes permisos para eliminarla");
  }

  // Eliminar todos los alimentos de la comida primero
  await prisma.alimentoComida.deleteMany({
    where: {
      comidaPlanId: comidaId
    }
  });

  // Eliminar la comida
  await prisma.comidaPlan.delete({
    where: {
      id: comidaId
    }
  });

  return { success: true };
}

/**
 * Eliminar un plan nutricional completo
 */
export async function eliminarPlanNutricional(planId: string, usuarioId: string) {
  // Verificar que el plan pertenece al usuario
  const plan = await prisma.planNutricional.findFirst({
    where: {
      id: planId,
      usuarioId
    },
    include: {
      comidas: {
        include: {
          alimentos: true
        }
      },
      seguimientos: {
        include: {
          seguimientoComidas: true
        }
      }
    }
  });

  if (!plan) {
    throw new Error("Plan nutricional no encontrado o no tienes permisos para eliminarlo");
  }

  // Usar una transacción para asegurar consistencia
  return await prisma.$transaction(async (tx) => {
    // 1. Eliminar todos los seguimientos de comidas
    for (const seguimiento of plan.seguimientos) {
      await tx.seguimientoComida.deleteMany({
        where: {
          seguimientoPlanId: seguimiento.id
        }
      });
    }

    // 2. Eliminar todos los seguimientos del plan
    await tx.seguimientoPlan.deleteMany({
      where: {
        planNutricionalId: planId
      }
    });

    // 3. Eliminar todos los alimentos de todas las comidas
    for (const comida of plan.comidas) {
      await tx.alimentoComida.deleteMany({
        where: {
          comidaPlanId: comida.id
        }
      });
    }

    // 4. Eliminar todas las comidas del plan
    await tx.comidaPlan.deleteMany({
      where: {
        planNutricionalId: planId
      }
    });

    // 5. Finalmente, eliminar el plan nutricional
    await tx.planNutricional.delete({
      where: {
        id: planId
      }
    });

    return { success: true, message: "Plan nutricional eliminado exitosamente" };
  });
}
