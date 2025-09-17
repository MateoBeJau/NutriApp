"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createPaciente, updatePaciente, deletePaciente, listPacientes, getPacienteById } from "@/services/pacientes";
import { createPacienteSchema, type CreatePacienteInput, type UpdatePacienteInput } from "@/lib/validations/paciente";

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

// Server Action para formularios con manejo de errores mejorado
export async function createPacienteFromForm(formData: FormData) {
  try {
    // Convertir FormData a objeto
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

    // Validar y transformar con Zod
    const validatedData = createPacienteSchema.parse(raw);

    // Guardar en DB
    const created = await createPaciente(validatedData);
    revalidatePath("/pacientes");
    return created;
  } catch (error) {
    console.error("Error in createPacienteFromForm:", error);
    
    if (error instanceof z.ZodError) {
      // ✅ CORREGIDO - Usar 'issues' en lugar de 'errors'
      const errorMessages = error.issues.map((err: z.ZodIssue) => {
        const field = err.path.join('.');
        return `${field}: ${err.message}`;
      }).join(', ');
      
      throw new Error(`Error de validación: ${errorMessages}`);
    }
    
    // Re-lanzar otros errores
    throw error;
  }
}

