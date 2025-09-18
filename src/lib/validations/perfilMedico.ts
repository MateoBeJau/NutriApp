import { z } from "zod";

const emptyToUndef = z.literal("").transform(() => undefined);

export const createPerfilMedicoSchema = z.object({
  pacienteId: z.string().cuid("ID de paciente inválido"),
  gustos: z.string().max(500, "Muy largo").optional().or(emptyToUndef),
  disgustos: z.string().max(500, "Muy largo").optional().or(emptyToUndef),
  alergias: z.string().max(500, "Muy largo").optional().or(emptyToUndef),
  enfermedades: z.string().max(500, "Muy largo").optional().or(emptyToUndef),
  medicamentos: z.string().max(500, "Muy largo").optional().or(emptyToUndef),
  restricciones: z.string().max(500, "Muy largo").optional().or(emptyToUndef),
  objetivos: z.string().max(500, "Muy largo").optional().or(emptyToUndef),
  observaciones: z.string().max(1000, "Muy largo").optional().or(emptyToUndef),
});

export const updatePerfilMedicoSchema = createPerfilMedicoSchema.omit({ pacienteId: true });

export type CreatePerfilMedicoInput = z.infer<typeof createPerfilMedicoSchema>;
export type UpdatePerfilMedicoInput = z.infer<typeof updatePerfilMedicoSchema>;
