import { prisma } from "@/lib/prisma";
import { CreatePacienteInput, UpdatePacienteInput } from "@/lib/validations/paciente";

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

  const pacientes = await prisma.paciente.findMany({
    where,
    orderBy: [{ apellido: "asc" }, { nombre: "asc" }],
    take: take + 1,
    ...(cursorId ? { cursor: { id: cursorId }, skip: 1 } : {}),
  });

  const hasMore = pacientes.length > take;
  const items = hasMore ? pacientes.slice(0, -1) : pacientes;
  const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

  return { items, nextCursor };
}

export async function getPacienteById(id: string, usuarioId: string) {
  return prisma.paciente.findFirst({
    where: { id, usuarioId },
  });
}

export async function createPaciente(input: CreatePacienteInput) {
  // NO validar aquí - ya viene validado del action
  return prisma.paciente.create({ data: input });
}

export async function updatePaciente(id: string, input: UpdatePacienteInput) {
  // NO validar aquí - ya viene validado del action
  return prisma.paciente.update({
    where: { id },
    data: input,
  });
}

export async function deletePaciente(id: string, usuarioId?: string) {
  if (usuarioId) {
    await prisma.paciente.findFirstOrThrow({ where: { id, usuarioId } });
  }
  await prisma.paciente.delete({ where: { id } });
  return { ok: true };
}
