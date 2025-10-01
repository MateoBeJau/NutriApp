import { prisma } from "@/lib/prisma";
import { Medicion } from '@prisma/client';

export interface CreateMedicionInput {
  pacienteId: string;
  consultaId?: string;
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

export async function createMedicion(input: CreateMedicionInput): Promise<Medicion> {
  return prisma.medicion.create({
    data: input
  });
}

export async function updateMedicion(id: string, input: UpdateMedicionInput): Promise<Medicion> {
  return prisma.medicion.update({
    where: { id },
    data: input
  });
}

export async function deleteMedicion(id: string): Promise<void> {
  await prisma.medicion.delete({
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

export async function getMedicionesByPaciente(pacienteId: string): Promise<Medicion[]> {
  return prisma.medicion.findMany({
    where: { pacienteId },
    orderBy: { fecha: 'desc' }
  });
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
