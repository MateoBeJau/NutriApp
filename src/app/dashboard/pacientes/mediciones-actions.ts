'use server';

import { getMedicionesByPaciente } from "@/services/mediciones";

export async function obtenerMedicionesPaciente(pacienteId: string) {
  try {
    const mediciones = await getMedicionesByPaciente(pacienteId);
    return { success: true, mediciones };
  } catch (error) {
    console.error("Error al obtener mediciones:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al obtener mediciones" 
    };
  }
}
