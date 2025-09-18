import { prisma } from "@/lib/prisma";

export interface CreatePerfilMedicoInput {
  pacienteId: string;
  gustos?: string;
  disgustos?: string;
  alergias?: string;
  enfermedades?: string;
  medicamentos?: string;
  restricciones?: string;
  objetivos?: string;
  observaciones?: string;
}

export interface UpdatePerfilMedicoInput {
  gustos?: string;
  disgustos?: string;
  alergias?: string;
  enfermedades?: string;
  medicamentos?: string;
  restricciones?: string;
  objetivos?: string;
  observaciones?: string;
}

export async function createPerfilMedico(data: CreatePerfilMedicoInput) {
  return await prisma.perfilMedico.create({
    data,
    include: {
      paciente: true
    }
  });
}

export async function updatePerfilMedico(pacienteId: string, data: UpdatePerfilMedicoInput) {
  try {
    const result = await prisma.perfilMedico.upsert({
      where: { pacienteId },
      update: data,
      create: {
        pacienteId,
        ...data
      },
      include: {
        paciente: true
      }
    });
    
    return result;
  } catch (error) {
    console.error("Error in updatePerfilMedico service:", error);
    throw error;
  }
}

export async function getPerfilMedico(pacienteId: string) {
  return await prisma.perfilMedico.findUnique({
    where: { pacienteId },
    include: {
      paciente: true
    }
  });
}

export async function deletePerfilMedico(pacienteId: string) {
  return await prisma.perfilMedico.delete({
    where: { pacienteId }
  });
}
