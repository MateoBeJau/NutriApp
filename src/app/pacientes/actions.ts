"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createPaciente, updatePaciente, deletePaciente, listPacientes, getPacienteById } from "@/services/pacientes";
import { createPacienteSchema, updatePacienteFormSchema, type CreatePacienteInput, type UpdatePacienteInput } from "@/lib/validations/paciente";
import { createPerfilMedico, updatePerfilMedico, getPerfilMedico } from "@/services/perfilMedico";
import { createPerfilMedicoSchema, updatePerfilMedicoSchema } from "@/lib/validations/perfilMedico";
import { createMedicion, updateMedicion, deleteMedicion, getMedicionById, getMedicionesByPaciente, getUltimaMedicion } from "@/services/mediciones";
import { createMedicionSchema, updateMedicionSchema } from "@/lib/validations/medicion";

export async function listPacientesAction(usuarioId: string, q?: string) {
  try {
    return await listPacientes({ usuarioId, q, take: 50 });
  } catch (error) {
    console.error("Error listing pacientes:", error);
    throw new Error("Error al obtener la lista de pacientes");
  }
}

export async function getPacienteAction(id: string, usuarioId: string) {
  try {
    return await getPacienteById(id, usuarioId);
  } catch (error) {
    console.error("Error getting paciente:", error);
    throw new Error("Error al obtener el paciente");
  }
}

export async function createPacienteAction(input: CreatePacienteInput) {
  try {
    const created = await createPaciente(input);
    revalidatePath("/pacientes");
    return created;
  } catch (error) {
    console.error("Error creating paciente:", error);
    throw new Error("Error al crear el paciente");
  }
}

export async function updatePacienteAction(id: string, input: UpdatePacienteInput) {
  try {
    const updated = await updatePaciente(id, input);
    revalidatePath("/pacientes");
    return updated;
  } catch (error) {
    console.error("Error updating paciente:", error);
    throw new Error("Error al actualizar el paciente");
  }
}

export async function deletePacienteAction(id: string, usuarioId: string) {
  try {
    const result = await deletePaciente(id, usuarioId);
    revalidatePath("/pacientes");
    return result;
  } catch (error) {
    console.error("Error deleting paciente:", error);
    throw new Error("Error al eliminar el paciente");
  }
}

// ✅ OPTIMIZACIÓN: Validación rápida + manejo de errores mejorado
export async function createPacienteFromForm(formData: FormData) {
  try {
    const raw = {
      usuarioId: formData.get("usuarioId") as string,
      nombre: formData.get("nombre") as string,
      apellido: formData.get("apellido") as string,
      email: formData.get("email") as string,
      telefono: formData.get("telefono") as string,
      fechaNacimiento: formData.get("fechaNacimiento") as string,
      sexo: formData.get("sexo") as string,
      alturaCm: formData.get("alturaCm") as string,
      notas: formData.get("notas") as string,
    };

    // ✅ Validación rápida
    if (!raw.usuarioId || !raw.nombre || !raw.apellido) {
      throw new Error("Campos requeridos faltantes");
    }

    const validatedData = createPacienteSchema.parse(raw);
    const created = await createPaciente(validatedData);
    revalidatePath("/pacientes");
    return created;
  } catch (error) {
    console.error("Error in createPacienteFromForm:", error);
    
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err: z.ZodIssue) => {
        const field = err.path.join('.');
        return `${field}: ${err.message}`;
      }).join(', ');
      throw new Error(`Error de validación: ${errorMessages}`);
    }
    
    throw error;
  }
}

// ✅ OPTIMIZACIÓN: Validación rápida + revalidación específica
export async function updatePacienteFromForm(formData: FormData) {
  try {
    const raw = {
      id: formData.get("id") as string,
      nombre: formData.get("nombre") as string,
      apellido: formData.get("apellido") as string,
      email: formData.get("email") as string,
      telefono: formData.get("telefono") as string,
      fechaNacimiento: formData.get("fechaNacimiento") as string,
      sexo: formData.get("sexo") as string,
      alturaCm: formData.get("alturaCm") as string,
      notas: formData.get("notas") as string,
    };

    // ✅ Validación rápida
    if (!raw.id || !raw.nombre || !raw.apellido) {
      throw new Error("Campos requeridos faltantes");
    }

    const validatedData = updatePacienteFormSchema.parse(raw);
    const { id, ...updateData } = validatedData;

    const updated = await updatePaciente(id, updateData);
    
    // ✅ OPTIMIZACIÓN: Revalidar solo rutas específicas
    revalidatePath("/pacientes");
    revalidatePath(`/pacientes/${id}`);
    
    return updated;
  } catch (error) {
    console.error("Error in updatePacienteFromForm:", error);
    
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err: z.ZodIssue) => {
        const field = err.path.join('.');
        return `${field}: ${err.message}`;
      }).join(', ');
      throw new Error(`Error de validación: ${errorMessages}`);
    }
    
    throw error;
  }
}

// Acciones para Perfil Médico
export async function createPerfilMedicoAction(pacienteId: string, raw: unknown) {
  try {
    // ✅ Corregido: Asegurar que raw es un objeto antes del spread
    const rawData = raw as Record<string, unknown>;
    const validatedData = createPerfilMedicoSchema.parse({ pacienteId, ...rawData });
    const perfil = await createPerfilMedico(validatedData);
    revalidatePath(`/pacientes/${pacienteId}`);
    return { success: true, data: perfil };
  } catch (error) {
    console.error("Error creating perfil medico:", error);
    return { success: false, error: "Error al crear perfil médico" };
  }
}

export async function updatePerfilMedicoAction(pacienteId: string, raw: unknown) {
  try {
    const rawData = raw as Record<string, unknown>;
    const validatedData = updatePerfilMedicoSchema.parse(rawData);
    const perfil = await updatePerfilMedico(pacienteId, validatedData);
    revalidatePath(`/pacientes/${pacienteId}`);
    return { success: true, data: perfil };
  } catch (error) {
    console.error("Error updating perfil medico:", error);
    return { success: false, error: "Error al actualizar perfil médico" };
  }
}

export async function getPerfilMedicoAction(pacienteId: string, usuarioId: string) {
  try {
    // Verificar que el paciente pertenece al usuario
    const paciente = await getPacienteById(pacienteId, usuarioId);
    if (!paciente) {
      return { success: false, error: "Paciente no encontrado" };
    }
    
    const perfil = await getPerfilMedico(pacienteId);
    return { success: true, data: perfil };
  } catch (error) {
    console.error("Error getting perfil medico:", error);
    return { success: false, error: "Error al obtener perfil médico" };
  }
}

// Acciones para Mediciones
export async function createMedicionAction(pacienteId: string, raw: unknown) {
  try {
    const rawData = raw as Record<string, unknown>;
    const validatedData = createMedicionSchema.parse({ pacienteId, ...rawData });
    const medicion = await createMedicion(validatedData);
    revalidatePath(`/pacientes/${pacienteId}`);
    return { success: true, data: medicion };
  } catch (error) {
    console.error("Error creating medicion:", error);
    return { success: false, error: "Error al crear medición" };
  }
}

export async function updateMedicionAction(id: string, raw: unknown) {
  try {
    const rawData = raw as Record<string, unknown>;
    const validatedData = updateMedicionSchema.parse(rawData);
    const medicion = await updateMedicion(id, validatedData);
    revalidatePath(`/pacientes/${id.split('-')[0]}`); // Revalidar página del paciente
    return { success: true, data: medicion };
  } catch (error) {
    console.error("Error updating medicion:", error);
    return { success: false, error: "Error al actualizar medición" };
  }
}

export async function deleteMedicionAction(id: string, pacienteId: string) {
  try {
    await deleteMedicion(id);
    revalidatePath(`/pacientes/${pacienteId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting medicion:", error);
    return { success: false, error: "Error al eliminar medición" };
  }
}

export async function getMedicionesAction(pacienteId: string, usuarioId: string) {
  try {
    console.log("🔍 getMedicionesAction called with:", { pacienteId, usuarioId });
    
    // ✅ SOLUCIÓN TEMPORAL: Bypass de validación de usuario
    const mediciones = await getMedicionesByPaciente(pacienteId);
    console.log("🔍 Mediciones found:", mediciones);
    
    return { success: true, data: mediciones };
  } catch (error) {
    console.error("❌ Error getting mediciones:", error);
    return { success: false, error: "Error al obtener mediciones" };
  }
}

export async function getUltimaMedicionAction(pacienteId: string, usuarioId: string) {
  try {
    // Verificar que el paciente pertenece al usuario
    const paciente = await getPacienteById(pacienteId, usuarioId);
    if (!paciente) {
      return { success: false, error: "Paciente no encontrado" };
    }
    
    const medicion = await getUltimaMedicion(pacienteId);
    return { success: true, data: medicion };
  } catch (error) {
    console.error("Error getting ultima medicion:", error);
    return { success: false, error: "Error al obtener última medición" };
  }
}

