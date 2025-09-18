import { prisma } from "@/lib/prisma";

export interface CreateMedicionInput {
  pacienteId: string;
  fecha: Date;
  pesoKg?: number;
  alturaCm?: number;
  imc?: number;
  notas?: string;
}

export interface UpdateMedicionInput {
  fecha?: Date;
  pesoKg?: number;
  alturaCm?: number;
  imc?: number;
  notas?: string;
}

export async function createMedicion(data: CreateMedicionInput) {
  return await prisma.medicion.create({
    data,
    include: {
      paciente: true
    }
  });
}

export async function updateMedicion(id: string, data: UpdateMedicionInput) {
  return await prisma.medicion.update({
    where: { id },
    data,
    include: {
      paciente: true
    }
  });
}

export async function deleteMedicion(id: string) {
  return await prisma.medicion.delete({
    where: { id }
  });
}

export async function getMedicionById(id: string) {
  return await prisma.medicion.findUnique({
    where: { id },
    include: {
      paciente: true
    }
  });
}

export async function getMedicionesByPaciente(pacienteId: string, limit: number = 50) {
  console.log("🔍 getMedicionesByPaciente called with:", { pacienteId, limit });
  
  try {
    const result = await prisma.medicion.findMany({
      where: { pacienteId },
      orderBy: { fecha: 'desc' },
      take: limit,
      include: {
        paciente: true
      }
    });
    
    console.log("🔍 Prisma result:", result);
    return result;
  } catch (error) {
    console.error("❌ Error in getMedicionesByPaciente:", error);
    throw error;
  }
}

export async function getUltimaMedicion(pacienteId: string) {
  return await prisma.medicion.findFirst({
    where: { pacienteId },
    orderBy: { fecha: 'desc' },
    include: {
      paciente: true
    }
  });
}
