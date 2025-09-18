import { z } from "zod";

const emptyToUndef = z.literal("").transform(() => undefined);

export const createMedicionSchema = z.object({
  pacienteId: z.string().uuid("ID de paciente inválido"), // Cambiado de cuid() a uuid()
  fecha: z.coerce.date("Fecha inválida"),
  pesoKg: z.coerce.number().positive("Peso debe ser positivo").optional().or(emptyToUndef),
  alturaCm: z.coerce.number().positive("Altura debe ser positiva").optional().or(emptyToUndef),
  imc: z.coerce.number().positive("IMC debe ser positivo").optional().or(emptyToUndef),
  notas: z.string().max(500, "Muy largo").optional().or(emptyToUndef),
});

export const updateMedicionSchema = createMedicionSchema.omit({ pacienteId: true });

export type CreateMedicionInput = z.infer<typeof createMedicionSchema>;
export type UpdateMedicionInput = z.infer<typeof updateMedicionSchema>;
