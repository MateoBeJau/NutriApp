"use server";

import { revalidatePath } from "next/cache";
import {
  createPaciente,
  updatePaciente,
  deletePaciente,
  listPacientes,
  getPacienteById,
} from "@/services/pacientes";
import { createPacienteSchema, type CreatePacienteInput, type UpdatePacienteInput } from "@/lib/validations/paciente";




// 🔐 Por ahora pasamos usuarioId por parámetro.
// Cuando tengas auth, lo sacarás de la sesión en el server.
export async function listPacientesAction(usuarioId: string, q?: string) {
  return listPacientes({ usuarioId, q, take: 50 });
}

export async function getPacienteAction(id: string, usuarioId: string) {
  return getPacienteById(id, usuarioId);
}

export async function createPacienteAction(input: CreatePacienteInput) {
  const created = await createPaciente(input);
  revalidatePath("/pacientes");
  return created;
}

export async function updatePacienteAction(id: string, input: UpdatePacienteInput) {
  const updated = await updatePaciente(id, input);
  revalidatePath("/pacientes");
  return updated;
}

export async function deletePacienteAction(id: string, usuarioId: string) {
  const result = await deletePaciente(id, usuarioId);
  revalidatePath("/pacientes");
  return result;
}


// 
export async function createPacienteFromForm(formData: FormData) {
  // Convertir valores crudos del form
  const raw = {
    usuarioId: String(formData.get("usuarioId") || ""),
    nombre: String(formData.get("nombre") || ""),
    apellido: String(formData.get("apellido") || ""),
    email: String(formData.get("email") || ""),
    telefono: String(formData.get("telefono") || ""),
    fechaNacimiento: String(formData.get("fechaNacimiento") || ""),
    sexo: String(formData.get("sexo") || ""),
    alturaCm: String(formData.get("alturaCm") || ""),
    notas: String(formData.get("notas") || ""),
  };

  // Validar y transformar con Zod
  const parsed = createPacienteSchema.parse({
    ...raw,

    email: raw.email === "" ? undefined : raw.email,
    fechaNacimiento: raw.fechaNacimiento || undefined,
    alturaCm: raw.alturaCm || undefined,
  });

  // Guardar en DB
  const created = await createPacienteAction(parsed);
  return created;
}

