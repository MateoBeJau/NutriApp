"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  crearPlanNutricional,
  obtenerPlanesNutricionales,
  obtenerPlanNutricional,
  crearComidaPlan,
  agregarAlimentoComida,
  eliminarAlimentoComida,
  eliminarComidaPlan,
  actualizarEstadoPlan,
  duplicarPlan,
  eliminarPlanNutricional,
  type CrearPlanNutricional,
  type CrearComidaPlan,
  type AgregarAlimentoComida
} from "@/services/planes";
import { 
  obtenerAlimentosSegurosPaciente,
  obtenerAlimentosSugeridos,
  buscarAlimentos,
  crearAlimento,
  obtenerTodosLosAlimentos
} from "@/services/alimentos";
import { TipoPlan, EstadoPlan, TipoComida } from "@prisma/client";

// ========== ACCIONES DE PLANES ==========

export async function crearPlanNutricionalAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    const data: CrearPlanNutricional = {
      pacienteId: formData.get('pacienteId') as string,
      usuarioId: user.id,
      nombre: formData.get('nombre') as string,
      descripcion: formData.get('descripcion') as string || undefined,
      tipo: (formData.get('tipo') as TipoPlan) || TipoPlan.MANUAL,
      fechaInicio: new Date(formData.get('fechaInicio') as string),
      fechaFin: formData.get('fechaFin') ? new Date(formData.get('fechaFin') as string) : undefined,
      caloriasObjetivo: formData.get('caloriasObjetivo') ? parseInt(formData.get('caloriasObjetivo') as string) : undefined,
      proteinasObjetivo: formData.get('proteinasObjetivo') ? parseFloat(formData.get('proteinasObjetivo') as string) : undefined,
      carbohidratosObjetivo: formData.get('carbohidratosObjetivo') ? parseFloat(formData.get('carbohidratosObjetivo') as string) : undefined,
      grasasObjetivo: formData.get('grasasObjetivo') ? parseFloat(formData.get('grasasObjetivo') as string) : undefined,
      notas: formData.get('notas') as string || undefined,
      promptIA: formData.get('promptIA') as string || undefined,
      modeloIA: formData.get('modeloIA') as string || undefined
    };

    const plan = await crearPlanNutricional(data);
    
    revalidatePath('/dashboard/planes');
    return { success: true, data: plan };
  } catch (error) {
    console.error("Error al crear plan nutricional:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al crear el plan nutricional" 
    };
  }
}

export async function obtenerPlanesNutricionalesAction(filtros?: {
  pacienteId?: string;
  estado?: EstadoPlan;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    const planes = await obtenerPlanesNutricionales(user.id, filtros);
    return { success: true, data: planes };
  } catch (error) {
    console.error("Error al obtener planes nutricionales:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al obtener los planes nutricionales" 
    };
  }
}

export async function obtenerPlanNutricionalAction(planId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    const plan = await obtenerPlanNutricional(planId, user.id);
    console.log('Plan obtenido:', {
      id: plan.id,
      nombre: plan.nombre,
      comidasCount: plan.comidas.length,
      comidas: plan.comidas.map(c => ({
        id: c.id,
        nombre: c.nombre,
        alimentosCount: c.alimentos.length
      }))
    });
    return { success: true, data: plan };
  } catch (error) {
    console.error("Error al obtener plan nutricional:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al obtener el plan nutricional" 
    };
  }
}

export async function actualizarEstadoPlanAction(planId: string, estado: EstadoPlan) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    await actualizarEstadoPlan(planId, user.id, estado);
    
    revalidatePath('/dashboard/planes');
    revalidatePath(`/dashboard/planes/${planId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar estado del plan:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al actualizar el estado del plan" 
    };
  }
}

export async function duplicarPlanAction(planId: string, nuevoNombre: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    const nuevoPlan = await duplicarPlan(planId, user.id, nuevoNombre);
    
    revalidatePath('/dashboard/planes');
    return { success: true, data: nuevoPlan };
  } catch (error) {
    console.error("Error al duplicar plan:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al duplicar el plan" 
    };
  }
}

// ========== ACCIONES DE COMIDAS ==========

export async function crearComidaPlanAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    const data: CrearComidaPlan = {
      planNutricionalId: formData.get('planNutricionalId') as string,
      tipo: formData.get('tipo') as TipoComida,
      nombre: formData.get('nombre') as string,
      descripcion: formData.get('descripcion') as string || undefined,
      horaRecomendada: formData.get('horaRecomendada') as string || undefined,
      orden: parseInt(formData.get('orden') as string)
    };

    const comida = await crearComidaPlan(data);
    
    // Revalidar múltiples rutas
    revalidatePath(`/dashboard/planes/${data.planNutricionalId}`);
    revalidatePath('/dashboard/planes');
    revalidatePath(`/dashboard/planes/${data.planNutricionalId}`, 'page');
    
    console.log('Comida creada exitosamente:', comida.id);
    
    return { success: true, data: comida };
  } catch (error) {
    console.error("Error al crear comida:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al crear la comida" 
    };
  }
}

export async function agregarAlimentoComidaAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    const data: AgregarAlimentoComida = {
      comidaPlanId: formData.get('comidaPlanId') as string,
      alimentoId: formData.get('alimentoId') as string,
      cantidad: parseFloat(formData.get('cantidad') as string),
      unidad: formData.get('unidad') as string,
      preparacion: formData.get('preparacion') as string || undefined,
      notas: formData.get('notas') as string || undefined
    };

    const alimentoComida = await agregarAlimentoComida(data);
    
    // Revalidar múltiples rutas para asegurar que se actualice
    const planId = formData.get('planId') as string;
    revalidatePath(`/dashboard/planes/${planId}`);
    revalidatePath('/dashboard/planes');
    revalidatePath(`/dashboard/planes/${planId}`, 'page');
    
    console.log('Alimento agregado exitosamente:', alimentoComida.id);
    
    return { success: true, data: alimentoComida };
  } catch (error) {
    console.error("Error al agregar alimento a comida:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al agregar el alimento a la comida" 
    };
  }
}

export async function eliminarAlimentoComidaAction(alimentoComidaId: string, planId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    await eliminarAlimentoComida(alimentoComidaId);
    
    revalidatePath(`/dashboard/planes/${planId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar alimento de comida:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al eliminar el alimento de la comida" 
    };
  }
}

export async function eliminarComidaPlanAction(comidaId: string, planId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    await eliminarComidaPlan(comidaId, user.id);
    
    // Revalidar múltiples rutas para asegurar que se actualice
    revalidatePath(`/dashboard/planes/${planId}`);
    revalidatePath('/dashboard/planes');
    revalidatePath(`/dashboard/planes/${planId}`, 'page');
    
    console.log('Comida eliminada exitosamente:', comidaId);
    
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar comida:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al eliminar la comida" 
    };
  }
}

// ========== ACCIONES DE ALIMENTOS ==========

export async function obtenerTodosLosAlimentosAction() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    const alimentos = await obtenerTodosLosAlimentos();
    return { success: true, data: alimentos };
  } catch (error) {
    console.error("Error al obtener todos los alimentos:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al obtener los alimentos" 
    };
  }
}

export async function obtenerAlimentosSegurosPacienteAction(pacienteId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    const alimentos = await obtenerAlimentosSegurosPaciente(pacienteId);
    return { success: true, data: alimentos };
  } catch (error) {
    console.error("Error al obtener alimentos seguros para paciente:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al obtener los alimentos seguros" 
    };
  }
}

export async function obtenerAlimentosSugeridosAction(pacienteId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    const alimentos = await obtenerAlimentosSugeridos(pacienteId);
    return { success: true, data: alimentos };
  } catch (error) {
    console.error("Error al obtener alimentos sugeridos:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al obtener los alimentos sugeridos" 
    };
  }
}

export async function buscarAlimentosAction(query: string, pacienteId?: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    const alimentos = await buscarAlimentos(query, pacienteId);
    return { success: true, data: alimentos };
  } catch (error) {
    console.error("Error al buscar alimentos:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al buscar alimentos" 
    };
  }
}

export async function crearAlimentoAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    // Función helper para obtener valores numéricos seguros
    const getNumberValue = (field: string, defaultValue: number = 0): number => {
      const value = formData.get(field) as string;
      if (!value || value.trim() === '') return defaultValue;
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    };

    const data = {
      nombre: formData.get('nombre') as string,
      marca: formData.get('marca') as string || undefined,
      categoria: formData.get('categoria') as string || undefined,
      caloriasPor100g: getNumberValue('caloriasPor100g'),
      proteinasPor100g: getNumberValue('proteinasPor100g'),
      carbohidratosPor100g: getNumberValue('carbohidratosPor100g'),
      grasasPor100g: getNumberValue('grasasPor100g'),
      fibraPor100g: formData.get('fibraPor100g') ? getNumberValue('fibraPor100g') : undefined,
      alergenos: formData.get('alergenos') as string || undefined,
      restricciones: formData.get('restricciones') as string || undefined,
      caracteristicas: formData.get('caracteristicas') as string || undefined,
      aptoParaDiabetes: formData.get('aptoParaDiabetes') === 'false' ? false : true, // Por defecto true
      aptoParaHipertension: formData.get('aptoParaHipertension') === 'false' ? false : true, // Por defecto true
      indiceGlicemico: formData.get('indiceGlicemico') ? parseInt(formData.get('indiceGlicemico') as string) : undefined,
      esGenerico: formData.get('esGenerico') === 'false' ? false : true // Por defecto true
    };

    const alimento = await crearAlimento(data);
    
    revalidatePath('/dashboard/planes');
    return { success: true, data: alimento };
  } catch (error) {
    console.error("Error al crear alimento:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al crear el alimento" 
    };
  }
}

// ========== ACCIÓN PARA ELIMINAR PLAN ==========

export async function eliminarPlanNutricionalAction(planId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    const resultado = await eliminarPlanNutricional(planId, user.id);
    
    revalidatePath('/dashboard/planes');
    return { 
      success: true, 
      message: resultado.message 
    };
  } catch (error) {
    console.error("Error al eliminar plan nutricional:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al eliminar el plan nutricional" 
    };
  }
}
