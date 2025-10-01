"use server";

import { prisma } from "@/lib/prisma";
import { Medicion, Consulta, PlanNutricional } from "@prisma/client";

export interface DatosReportePaciente {
  paciente: {
    id: string;
    nombre: string;
    apellido: string;
    email?: string | null;
    telefono?: string | null;
    fechaNacimiento?: Date | null;
    sexo?: string | null;
    alturaCm?: number | null;
    notas?: string | null;
    creadoEn: Date;
  };
  
  // Perfil médico en el nivel superior (como espera el código)
  perfilMedico?: {
    gustos?: string | null;
    disgustos?: string | null;
    alergias?: string | null;
    enfermedades?: string | null;
    medicamentos?: string | null;
    restricciones?: string | null;
    objetivos?: string | null;
    observaciones?: string | null;
  } | null;
  
  mediciones: Medicion[];
  consultas: Array<Consulta & { mediciones: Medicion[] }>;
  planes: Array<PlanNutricional & {
    _count: { comidas: number; seguimientos: number };
    adherencia?: {
      diasConSeguimiento: number;
      totalDias: number;
      porcentajeAdherencia: number;
    };
  }>;
  
  estadisticas: {
    totalConsultas: number;
    consultasCompletadas: number;
    consultasPendientes: number;
    totalMediciones: number;
    pesoInicial?: number | null;
    pesoActual?: number | null;
    diferenciaPeso?: number;
    imcInicial?: number | null;
    imcActual?: number | null;
    diasEnSeguimiento: number;
    totalPlanes: number;
    planesActivos: number;
    planesCompletados: number;
  };
}

export async function obtenerDatosReportePaciente(
  pacienteId: string, 
  usuarioId: string
): Promise<DatosReportePaciente | null> {
  // Query simple - traer todo lo necesario sin select manual
  const [paciente, mediciones, consultas, planes, seguimientos] = await Promise.all([
    prisma.paciente.findUnique({
      where: { id: pacienteId },
      include: { perfilMedico: true }
    }),
    
    prisma.medicion.findMany({
      where: { pacienteId },
      orderBy: { fecha: 'asc' }
    }),
    
    prisma.consulta.findMany({
      where: { pacienteId },
      include: { mediciones: true },
      orderBy: { inicio: 'desc' }
    }),
    
    prisma.planNutricional.findMany({
      where: { pacienteId },
      include: { _count: { select: { comidas: true, seguimientos: true } } },
      orderBy: { fechaInicio: 'desc' }
    }),
    
    prisma.seguimientoPlan.findMany({
      where: { planNutricional: { pacienteId } },
      include: { seguimientoComidas: { select: { estado: true, porcentajeConsumido: true } } }
    })
  ]);

  if (!paciente) return null;

  // Calcular estadísticas de adherencia por plan
  const planesConAdherencia = planes.map(plan => {
    const seguimientosPlan = seguimientos.filter(s => 
      s.planNutricionalId === plan.id
    );

    let adherencia = undefined;
    if (seguimientosPlan.length > 0) {
      const diasConSeguimiento = seguimientosPlan.length;
      const fechaInicio = plan.fechaInicio;
      const fechaFin = plan.fechaFin || new Date();
      const totalDias = Math.ceil(
        (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Calcular porcentaje promedio de cumplimiento
      let cumplimientoTotal = 0;
      let totalComidas = 0;

      seguimientosPlan.forEach(seg => {
        seg.seguimientoComidas.forEach(comida => {
          cumplimientoTotal += comida.porcentajeConsumido;
          totalComidas++;
        });
      });

      const porcentajeAdherencia = totalComidas > 0 
        ? Math.round(cumplimientoTotal / totalComidas) 
        : 0;

      adherencia = {
        diasConSeguimiento,
        totalDias: Math.max(totalDias, 1),
        porcentajeAdherencia
      };
    }

    return {
      ...plan,
      adherencia
    };
  });

  // Calcular estadísticas generales
  const totalConsultas = consultas.length;
  const consultasCompletadas = consultas.filter(c => c.estado === 'COMPLETADO').length;
  const consultasPendientes = consultas.filter(c => 
    ['PROGRAMADO', 'CONFIRMADO'].includes(c.estado)
  ).length;

  // Crear copias para evitar mutar el array original
  const medicionesConPeso = mediciones.filter(m => m.pesoKg);
  const medicionesConIMC = mediciones.filter(m => m.imc);
  
  const pesoInicial = medicionesConPeso[0]?.pesoKg;
  const pesoActual = medicionesConPeso[medicionesConPeso.length - 1]?.pesoKg;
  const diferenciaPeso = pesoInicial && pesoActual 
    ? Number((pesoActual - pesoInicial).toFixed(1))
    : undefined;

  const imcInicial = medicionesConIMC[0]?.imc;
  const imcActual = medicionesConIMC[medicionesConIMC.length - 1]?.imc;

  const diasEnSeguimiento = Math.ceil(
    (new Date().getTime() - paciente.creadoEn.getTime()) / (1000 * 60 * 60 * 24)
  );

  const planesActivos = planes.filter(p => p.estado === 'ACTIVO').length;
  const planesCompletados = planes.filter(p => p.estado === 'COMPLETADO').length;

  const estadisticas = {
    totalConsultas,
    consultasCompletadas,
    consultasPendientes,
    totalMediciones: mediciones.length,
    pesoInicial,
    pesoActual,
    diferenciaPeso,
    imcInicial,
    imcActual,
    diasEnSeguimiento,
    totalPlanes: planes.length,
    planesActivos,
    planesCompletados
  };

  return {
    paciente: {
      id: paciente.id,
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      email: paciente.email,
      telefono: paciente.telefono,
      fechaNacimiento: paciente.fechaNacimiento,
      sexo: paciente.sexo,
      alturaCm: paciente.alturaCm,
      notas: paciente.notas,
      creadoEn: paciente.creadoEn
    },
    perfilMedico: paciente.perfilMedico, // En el nivel superior
    mediciones,
    consultas,
    planes: planesConAdherencia,
    estadisticas
  };
}