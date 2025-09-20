import { prisma } from "@/lib/prisma";
import { CreatePacienteInput, UpdatePacienteInput } from "@/lib/validations/paciente";
import { measurePerformance } from "@/lib/performance";

export async function listPacientes(opts: {
  usuarioId: string;
  q?: string;
  take?: number;
  cursorId?: string;
}) {
  const { usuarioId, q, take = 20, cursorId } = opts;

  const where = {
    usuarioId,
    ...(q
      ? {
          OR: [
            { nombre: { contains: q, mode: "insensitive" as const } },
            { apellido: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  // ✅ OPTIMIZACIÓN: Usar select específico en lugar de traer todos los campos
  const pacientes = await prisma.paciente.findMany({
    where,
    select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,
      telefono: true,
      fechaNacimiento: true,
      sexo: true,
      alturaCm: true,
      notas: true,
      creadoEn: true,
      actualizadoEn: true,
      usuarioId: true,
      activo: true,
    },
    orderBy: [{ apellido: "asc" }, { nombre: "asc" }],
    take: take + 1,
    ...(cursorId ? { cursor: { id: cursorId }, skip: 1 } : {}),
  });

  const hasMore = pacientes.length > take;
  const items = hasMore ? pacientes.slice(0, -1) : pacientes;
  const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

  return { items, nextCursor };
}

// ✅ OPTIMIZACIÓN: Consulta más eficiente para getPacienteById con timeout y medición
export async function getPacienteById(id: string, usuarioId: string) {
  return measurePerformance(async () => {
    // ✅ Usar findUnique es más eficiente que findFirst para búsquedas por ID
    const queryPromise = prisma.paciente.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        fechaNacimiento: true,
        sexo: true,
        alturaCm: true,
        notas: true,
        creadoEn: true,
        actualizadoEn: true,
        usuarioId: true,
        activo: true,
      },
    });

    // ✅ Timeout de 5 segundos para evitar queries que cuelguen
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timeout after 5 seconds')), 5000)
    );

    const result = await Promise.race([queryPromise, timeoutPromise]);
    
    // ✅ Verificar que el paciente pertenece al usuario y está activo
    if (!result || (result as any).usuarioId !== usuarioId || !(result as any).activo) {
      console.log(`⚠️ No valid patient found with id: ${id} for user: ${usuarioId}`);
      return null;
    }
    
    return result;
  }, `getPacienteById(${id})`);
}

export async function createPaciente(input: CreatePacienteInput) {
  return prisma.paciente.create({ data: input });
}

export async function updatePaciente(id: string, input: UpdatePacienteInput) {
  return prisma.paciente.update({
    where: { id },
    data: input,
  });
}

export async function deletePaciente(id: string, usuarioId?: string) {
  if (usuarioId) {
    const result = await prisma.paciente.deleteMany({
      where: { id, usuarioId }
    });
    
    if (result.count === 0) {
      throw new Error("Paciente no encontrado o no autorizado");
    }
  } else {
    await prisma.paciente.delete({ where: { id } });
  }
  
  return { ok: true };
}

// ✅ NUEVA FUNCIÓN: Para obtener todos los pacientes activos (para el formulario de consultas)
export async function obtenerPacientesActivos(usuarioId: string) {
  const pacientes = await prisma.paciente.findMany({
    where: {
      usuarioId,
      activo: true
    },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,
      telefono: true,
    },
    orderBy: [
      { apellido: 'asc' },
      { nombre: 'asc' }
    ]
  });

  return pacientes;
}
