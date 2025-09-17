import { z } from "zod";

const emptyToUndef = z.literal("").transform(() => undefined);

export const createPacienteSchema = z.object({
  usuarioId: z.string().uuid(),
  nombre: z.string().min(1, "Nombre requerido"),
  apellido: z.string().min(1, "Apellido requerido"),

  email: z.string().email().optional().or(emptyToUndef),

  telefono: z
    .string()
    .min(6, "Teléfono inválido")
    .optional()
    .or(emptyToUndef),

  // Acepta "", string o Date y valida que sea un Date válido
  fechaNacimiento: z
    .preprocess((v) => {
      if (v === "" || v === null || v === undefined) return undefined;
      if (v instanceof Date) return v;
      if (typeof v === "string") {
        const d = new Date(v);
        return isNaN(d.getTime()) ? undefined : d;
      }
      return v;
    }, z.date().optional()),

  sexo: z.enum(["F", "M", "O"]).optional().or(emptyToUndef),

  alturaCm: z.preprocess((v) => {
    if (v === "" || v === null || v === undefined) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }, z.number().int().positive().max(300).optional()),

  notas: z.string().optional().or(emptyToUndef),
});

export const updatePacienteSchema = createPacienteSchema
  .omit({ usuarioId: true })
  .partial();

export type CreatePacienteInput = z.infer<typeof createPacienteSchema>;
export type UpdatePacienteInput = z.infer<typeof updatePacienteSchema>;
