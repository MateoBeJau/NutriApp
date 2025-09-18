import { z } from "zod";

// ✅ OPTIMIZACIÓN: Validación simple y rápida
export const createPacienteSchema = z.object({
  usuarioId: z.string().uuid("ID de usuario inválido"),
  nombre: z.string().min(1, "Nombre requerido").max(100, "Nombre muy largo"),
  apellido: z.string().min(1, "Apellido requerido").max(100, "Apellido muy largo"),
  email: z.string().email("Email inválido").max(255, "Email muy largo").optional().or(z.literal("").transform(() => undefined)),
  telefono: z.string().min(6, "Teléfono debe tener al menos 6 caracteres").max(20, "Teléfono muy largo").optional().or(z.literal("").transform(() => undefined)),
  fechaNacimiento: z.string().optional().transform((v) => v ? new Date(v) : undefined),
  sexo: z.enum(["F", "M", "O"]).optional().or(z.literal("").transform(() => undefined)),
  alturaCm: z.string().optional().transform((v) => v ? parseInt(v) : undefined),
  notas: z.string().max(1000, "Notas muy largas").optional().or(z.literal("").transform(() => undefined)),
});

export const updatePacienteSchema = createPacienteSchema.omit({ usuarioId: true }).partial();

export const updatePacienteFormSchema = createPacienteSchema
  .omit({ usuarioId: true })
  .extend({ id: z.string().uuid("ID de paciente inválido") })
  .partial()
  .required({ id: true });

export type CreatePacienteInput = z.infer<typeof createPacienteSchema>;
export type UpdatePacienteInput = z.infer<typeof updatePacienteSchema>;
export type UpdatePacienteFormInput = z.infer<typeof updatePacienteFormSchema>;
