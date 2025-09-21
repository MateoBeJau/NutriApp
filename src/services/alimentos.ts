"use server";

import { prisma } from "@/lib/prisma";
import { AlimentoSeguro } from "@/types/planes";

export interface FiltroAlimentos {
  pacienteId?: string;
  categoria?: string;
  nombre?: string;
  activo?: boolean;
}

/**
 * Obtiene todos los alimentos activos sin filtrar por paciente
 */
export async function obtenerTodosLosAlimentos(): Promise<AlimentoSeguro[]> {
  const alimentos = await prisma.alimento.findMany({
    where: { activo: true },
    orderBy: { nombre: 'asc' }
  });

  return alimentos.map((alimento): AlimentoSeguro => ({
    id: alimento.id,
    nombre: alimento.nombre,
    marca: alimento.marca ?? undefined,
    categoria: alimento.categoria ?? undefined,
    caloriasPor100g: alimento.caloriasPor100g,
    proteinasPor100g: alimento.proteinasPor100g,
    carbohidratosPor100g: alimento.carbohidratosPor100g,
    grasasPor100g: alimento.grasasPor100g,
    fibraPor100g: alimento.fibraPor100g ?? undefined,
    alergenos: alimento.alergenos ?? undefined,
    restricciones: alimento.restricciones ?? undefined,
    caracteristicas: alimento.caracteristicas ?? undefined,
    aptoParaDiabetes: alimento.aptoParaDiabetes,
    aptoParaHipertension: alimento.aptoParaHipertension,
    indiceGlicemico: alimento.indiceGlicemico ?? undefined,
    esGenerico: alimento.esGenerico,
    activo: alimento.activo,
    creadoEn: alimento.creadoEn,
    actualizadoEn: alimento.actualizadoEn,
    esSeguroParaPaciente: true, // Todos son seguros cuando no hay filtro
    razonRestriccion: undefined,
    prioridad: undefined
  }));
}

/**
 * Obtiene alimentos seguros para un paciente específico basado en su perfil médico
 */
export async function obtenerAlimentosSegurosPaciente(pacienteId: string): Promise<AlimentoSeguro[]> {
  // Obtener el paciente con su perfil médico
  const paciente = await prisma.paciente.findUnique({
    where: { id: pacienteId },
    include: { perfilMedico: true }
  });

  if (!paciente) {
    throw new Error("Paciente no encontrado");
  }

  // Obtener todos los alimentos activos
  const alimentos = await prisma.alimento.findMany({
    where: { activo: true },
    orderBy: { nombre: 'asc' }
  });

  // Si no tiene perfil médico, devolver todos los alimentos
  if (!paciente.perfilMedico) {
    return alimentos.map((alimento): AlimentoSeguro => ({
      id: alimento.id,
      nombre: alimento.nombre,
      marca: alimento.marca ?? undefined,
      categoria: alimento.categoria ?? undefined,
      caloriasPor100g: alimento.caloriasPor100g,
      proteinasPor100g: alimento.proteinasPor100g,
      carbohidratosPor100g: alimento.carbohidratosPor100g,
      grasasPor100g: alimento.grasasPor100g,
      fibraPor100g: alimento.fibraPor100g ?? undefined,
      alergenos: alimento.alergenos ?? undefined,
      restricciones: alimento.restricciones ?? undefined,
      caracteristicas: alimento.caracteristicas ?? undefined,
      aptoParaDiabetes: alimento.aptoParaDiabetes,
      aptoParaHipertension: alimento.aptoParaHipertension,
      indiceGlicemico: alimento.indiceGlicemico ?? undefined,
      esGenerico: alimento.esGenerico,
      activo: alimento.activo,
      creadoEn: alimento.creadoEn,
      actualizadoEn: alimento.actualizadoEn,
      esSeguroParaPaciente: true,
      razonRestriccion: undefined,
      prioridad: undefined
    }));
  }

  const { alergias, restricciones, enfermedades } = paciente.perfilMedico;

  // Filtrar alimentos según el perfil médico
  return alimentos.map((alimento): AlimentoSeguro => {
    const validacion = validarAlimentoParaPaciente(alimento, {
      alergias,
      restricciones,
      enfermedades
    });

    return {
      id: alimento.id,
      nombre: alimento.nombre,
      marca: alimento.marca ?? undefined,
      categoria: alimento.categoria ?? undefined,
      caloriasPor100g: alimento.caloriasPor100g,
      proteinasPor100g: alimento.proteinasPor100g,
      carbohidratosPor100g: alimento.carbohidratosPor100g,
      grasasPor100g: alimento.grasasPor100g,
      fibraPor100g: alimento.fibraPor100g ?? undefined,
      alergenos: alimento.alergenos ?? undefined,
      restricciones: alimento.restricciones ?? undefined,
      caracteristicas: alimento.caracteristicas ?? undefined,
      aptoParaDiabetes: alimento.aptoParaDiabetes,
      aptoParaHipertension: alimento.aptoParaHipertension,
      indiceGlicemico: alimento.indiceGlicemico ?? undefined,
      esGenerico: alimento.esGenerico,
      activo: alimento.activo,
      creadoEn: alimento.creadoEn,
      actualizadoEn: alimento.actualizadoEn,
      esSeguroParaPaciente: validacion.valido,
      razonRestriccion: validacion.razon,
      prioridad: undefined
    };
  });
}

/**
 * Valida si un alimento es seguro para un paciente
 */
function validarAlimentoParaPaciente(
  alimento: {
    alergenos?: string | null;
    restricciones?: string | null;
    aptoParaDiabetes: boolean;
    aptoParaHipertension: boolean;
  },
  perfilMedico: { alergias?: string | null; restricciones?: string | null; enfermedades?: string | null }
): { valido: boolean; razon?: string } {
  
  // Verificar alergias
  if (perfilMedico.alergias && alimento.alergenos) {
    const alergiasArray = perfilMedico.alergias.toLowerCase().split(',').map((a: string) => a.trim());
    const alergenosArray = alimento.alergenos.toLowerCase().split(',').map((a: string) => a.trim());
    
    const tieneAlergeno = alergiasArray.some((alergia: string) => 
      alergenosArray.some((alergeno: string) => alergeno.includes(alergia))
    );
    
    if (tieneAlergeno) {
      return { valido: false, razon: 'Contiene alergenos' };
    }
  }
  
  // Verificar restricciones dietéticas
  if (perfilMedico.restricciones) {
    const restriccionesArray = perfilMedico.restricciones.toLowerCase().split(',').map((r: string) => r.trim());
    
    // Si es vegano, el alimento debe ser vegano
    if (restriccionesArray.includes('vegano')) {
      if (!alimento.restricciones?.toLowerCase().includes('vegano')) {
        return { valido: false, razon: 'No es vegano' };
      }
    }
    
    // Si es sin gluten, el alimento debe ser sin gluten
    if (restriccionesArray.includes('sin gluten') || restriccionesArray.includes('celiaco')) {
      if (!alimento.restricciones?.toLowerCase().includes('sin_gluten')) {
        return { valido: false, razon: 'Contiene gluten' };
      }
    }
    
    // Si es sin lactosa, el alimento debe ser sin lactosa
    if (restriccionesArray.includes('sin lactosa')) {
      if (!alimento.restricciones?.toLowerCase().includes('sin_lactosa')) {
        return { valido: false, razon: 'Contiene lactosa' };
      }
    }
  }
  
  // Verificar enfermedades específicas
  if (perfilMedico.enfermedades) {
    const enfermedadesArray = perfilMedico.enfermedades.toLowerCase().split(',').map((e: string) => e.trim());
    
    // Diabetes
    if (enfermedadesArray.some((e: string) => e.includes('diabetes'))) {
      if (!alimento.aptoParaDiabetes) {
        return { valido: false, razon: 'No apto para diabéticos' };
      }
    }
    
    // Hipertensión
    if (enfermedadesArray.some((e: string) => e.includes('hipertension') || e.includes('hipertensión'))) {
      if (!alimento.aptoParaHipertension) {
        return { valido: false, razon: 'No apto para hipertensos' };
      }
    }
  }
  
  return { valido: true };
}

/**
 * Obtiene alimentos sugeridos basados en los gustos del paciente
 */
export async function obtenerAlimentosSugeridos(pacienteId: string): Promise<AlimentoSeguro[]> {
  const alimentosSegurosPaciente = await obtenerAlimentosSegurosPaciente(pacienteId);
  
  const paciente = await prisma.paciente.findUnique({
    where: { id: pacienteId },
    include: { perfilMedico: true }
  });

  if (!paciente?.perfilMedico?.gustos) {
    return alimentosSegurosPaciente.filter((a) => a.esSeguroParaPaciente);
  }

  const gustosArray = paciente.perfilMedico.gustos.toLowerCase().split(',').map((g: string) => g.trim());
  
  // Priorizar alimentos que coincidan con los gustos
  const alimentosPriorizados = alimentosSegurosPaciente
    .filter((a) => a.esSeguroParaPaciente)
    .map((alimento) => {
      const coincideGustos = gustosArray.some((gusto: string) => 
        alimento.nombre.toLowerCase().includes(gusto) ||
        alimento.categoria?.toLowerCase().includes(gusto)
      );
      
      return {
        ...alimento,
        prioridad: coincideGustos ? 1 : 2
      };
    })
    .sort((a, b) => (a.prioridad ?? 2) - (b.prioridad ?? 2));

  return alimentosPriorizados;
}

/**
 * Buscar alimentos por nombre o categoría
 */
export async function buscarAlimentos(query: string, pacienteId?: string): Promise<AlimentoSeguro[]> {
  if (pacienteId) {
    const alimentosSegurosPaciente = await obtenerAlimentosSegurosPaciente(pacienteId);
    return alimentosSegurosPaciente.filter((alimento) =>
      alimento.nombre.toLowerCase().includes(query.toLowerCase()) ||
      alimento.categoria?.toLowerCase().includes(query.toLowerCase())
    );
  }

  const alimentos = await prisma.alimento.findMany({
    where: {
      activo: true,
      OR: [
        { nombre: { contains: query, mode: 'insensitive' } },
        { categoria: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { nombre: 'asc' }
  });

  return alimentos.map((alimento): AlimentoSeguro => ({
    ...alimento,
    marca: alimento.marca ?? undefined,
    categoria: alimento.categoria ?? undefined,
    fibraPor100g: alimento.fibraPor100g ?? undefined,
    alergenos: alimento.alergenos ?? undefined,
    restricciones: alimento.restricciones ?? undefined,
    caracteristicas: alimento.caracteristicas ?? undefined,
    indiceGlicemico: alimento.indiceGlicemico ?? undefined,
    esSeguroParaPaciente: true,
    esGenerico: alimento.esGenerico,
    activo: alimento.activo,
    creadoEn: alimento.creadoEn,
    actualizadoEn: alimento.actualizadoEn
  }));
}

/**
 * Crear un nuevo alimento
 */
export async function crearAlimento(data: {
  nombre: string;
  marca?: string;
  categoria?: string;
  caloriasPor100g: number;
  proteinasPor100g: number;
  carbohidratosPor100g: number;
  grasasPor100g: number;
  fibraPor100g?: number;
  alergenos?: string;
  restricciones?: string;
  caracteristicas?: string;
  aptoParaDiabetes?: boolean;
  aptoParaHipertension?: boolean;
  indiceGlicemico?: number;
  esGenerico?: boolean;
}) {
  return await prisma.alimento.create({
    data: {
      ...data,
      aptoParaDiabetes: data.aptoParaDiabetes ?? true,
      aptoParaHipertension: data.aptoParaHipertension ?? true,
      esGenerico: data.esGenerico ?? true
    }
  });
}
