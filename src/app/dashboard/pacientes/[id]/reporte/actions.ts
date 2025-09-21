"use server";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { obtenerDatosReportePaciente } from "@/services/reportes";

export async function obtenerReportePacienteAction(pacienteId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  try {
    const datos = await obtenerDatosReportePaciente(pacienteId, user.id);
    
    if (!datos) {
      return { 
        success: false, 
        error: "Paciente no encontrado o no tienes permisos para verlo" 
      };
    }

    return { 
      success: true, 
      data: datos 
    };
  } catch (error) {
    console.error("Error al obtener reporte del paciente:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al obtener el reporte del paciente" 
    };
  }
}
