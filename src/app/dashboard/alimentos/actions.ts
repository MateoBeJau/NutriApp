'use server';

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function eliminarAlimentoAction(id: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    // Verificar si el alimento está siendo usado en algún plan
    const enUso = await prisma.alimentoComida.findFirst({
      where: { alimentoId: id }
    });

    if (enUso) {
      return {
        success: false,
        error: 'No se puede eliminar. El alimento está siendo usado en planes nutricionales.'
      };
    }

    await prisma.alimento.delete({
      where: { id }
    });
    
    revalidatePath('/dashboard/alimentos');
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar alimento:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al eliminar el alimento" 
    };
  }
}

export async function actualizarAlimentoAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    const id = formData.get('id') as string;
    
    const getNumberValue = (field: string, defaultValue: number = 0): number => {
      const value = formData.get(field) as string;
      if (!value || value.trim() === '') return defaultValue;
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    };

    await prisma.alimento.update({
      where: { id },
      data: {
        nombre: formData.get('nombre') as string,
        categoria: formData.get('categoria') as string || null,
        caloriasPor100g: getNumberValue('caloriasPor100g'),
        proteinasPor100g: getNumberValue('proteinasPor100g'),
        carbohidratosPor100g: getNumberValue('carbohidratosPor100g'),
        grasasPor100g: getNumberValue('grasasPor100g'),
        fibraPor100g: formData.get('fibraPor100g') ? getNumberValue('fibraPor100g') : null,
        aptoParaDiabetes: formData.get('aptoParaDiabetes') === 'on',
        aptoParaHipertension: formData.get('aptoParaHipertension') === 'on',
      }
    });
    
    revalidatePath('/dashboard/alimentos');
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar alimento:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al actualizar el alimento" 
    };
  }
}

