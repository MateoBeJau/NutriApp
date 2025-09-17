import { z } from "zod";

const emptyToUndef = z.literal("").transform(() => undefined);

export const createPacienteSchema = z.object({
  usuarioId: z.string().uuid("ID de usuario inválido"),
  nombre: z.string().min(1, "Nombre requerido").max(100, "Nombre muy largo"),
  apellido: z.string().min(1, "Apellido requerido").max(100, "Apellido muy largo"),
  
  // ✅ CORREGIDO - Orden correcto de validaciones
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email muy largo")
    .optional()
    .or(emptyToUndef),
  
  telefono: z
    .string()
    .min(6, "Teléfono debe tener al menos 6 caracteres")
    .max(20, "Teléfono muy largo")
    .optional()
    .or(emptyToUndef),

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

  // ✅ CORREGIDO - Sintaxis correcta de errorMap
  sexo: z
  .enum(["F", "M", "O"], {
    message: "Sexo debe ser F, M u O"
  })
  .optional()
  .or(emptyToUndef),

  alturaCm: z
    .preprocess((v) => {
      if (v === "" || v === null || v === undefined) return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    }, z
      .number()
      .int("Altura debe ser un número entero")
      .positive("Altura debe ser positiva")
      .max(300, "Altura debe ser menor a 300cm")
      .optional()
    ),

  notas: z
    .string()
    .max(1000, "Notas muy largas")
    .optional()
    .or(emptyToUndef),
});

export const updatePacienteSchema = createPacienteSchema
  .omit({ usuarioId: true })
  .partial();

export type CreatePacienteInput = z.infer<typeof createPacienteSchema>;
export type UpdatePacienteInput = z.infer<typeof updatePacienteSchema>;
