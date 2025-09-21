"use server";

import { prisma } from "@/lib/prisma";

export interface DatosReportePaciente {
  // Información básica del paciente
  paciente: {
    id: string;
    nombre: string;
    apellido: string;
    email?: string;
    telefono?: string;
    fechaNacimiento?: Date;
    sexo?: string;
    alturaCm?: number;
    notas?: string;
    creadoEn: Date;
  };

  // Perfil médico (incluido pero no usado en UI actual)
  perfilMedico?: {
    gustos?: string;
    disgustos?: string;
    alergias?: string;
    enfermedades?: string;
    medicamentos?: string;
    restricciones?: string;
    objetivos?: string;
    observaciones?: string;
  };

  // Mediciones históricas
  mediciones: Array<{
    id: string;
    fecha: Date;
    pesoKg?: number;
    alturaCm?: number;
    imc?: number;
    notas?: string;
    consultaId?: string;
  }>;

  // Consultas
  consultas: Array<{
    id: string;
    inicio: Date;
    fin: Date;
    estado: string;
    lugar?: string;
    notas?: string;
    mediciones: Array<{
      id: string;
      fecha: Date;
      pesoKg?: number;
      alturaCm?: number;
      imc?: number;
      notas?: string;
    }>;
  }>;

  // Planes nutricionales
  planes: Array<{
    id: string;
    nombre: string;
    descripcion?: string;
    tipo: string;
    estado: string;
    fechaInicio: Date;
    fechaFin?: Date;
    caloriasObjetivo?: number;
    proteinasObjetivo?: number;
    carbohidratosObjetivo?: number;
    grasasObjetivo?: number;
    notas?: string;
    _count: {
      comidas: number;
      seguimientos: number;
    };
    // Estadísticas de adherencia
    adherencia?: {
      diasConSeguimiento: number;
      totalDias: number;
      porcentajeAdherencia: number;
    };
  }>;

  // Estadísticas generales
  estadisticas: {
    totalConsultas: number;
    consultasCompletadas: number;
    consultasPendientes: number;
    totalMediciones: number;
    pesoInicial?: number;
    pesoActual?: number;
    diferenciaPeso?: number;
    imcInicial?: number;
    imcActual?: number;
    diasEnSeguimiento: number;
    totalPlanes: number;
    planesActivos: number;
    planesCompletados: number;
  };
}

/**
 * Obtener todos los datos necesarios para el reporte de un paciente
 */
export async function obtenerDatosReportePaciente(
  pacienteId: string, 
  usuarioId: string
): Promise<DatosReportePaciente | null> {
  
  // Verificar que el paciente pertenece al usuario
  const pacienteBase = await prisma.paciente.findFirst({
    where: {
      id: pacienteId,
      usuarioId: usuarioId
    }
  });

  if (!pacienteBase) {
    return null;
  }

  // Obtener todos los datos en paralelo para mejor performance
  const [
    paciente,
    mediciones,
    consultas,
    planes,
    seguimientos
  ] = await Promise.all([
    // Paciente con perfil médico
    prisma.paciente.findUnique({
      where: { id: pacienteId },
      include: {
        perfilMedico: true
      }
    }),

    // Mediciones ordenadas por fecha
    prisma.medicion.findMany({
      where: { pacienteId },
      orderBy: { fecha: 'asc' },
      select: {
        id: true,
        fecha: true,
        pesoKg: true,
        alturaCm: true,
        imc: true,
        notas: true,
        consultaId: true
      }
    }),

    // Consultas con sus mediciones
    prisma.consulta.findMany({
      where: { pacienteId },
      include: {
        mediciones: {
          select: {
            id: true,
            fecha: true,
            pesoKg: true,
            alturaCm: true,
            imc: true,
            notas: true
          }
        }
      },
      orderBy: { inicio: 'desc' }
    }),

    // Planes nutricionales con conteos
    prisma.planNutricional.findMany({
      where: { pacienteId },
      include: {
        _count: {
          select: {
            comidas: true,
            seguimientos: true
          }
        }
      },
      orderBy: { fechaInicio: 'desc' }
    }),

    // Seguimientos para calcular adherencia
    prisma.seguimientoPlan.findMany({
      where: {
        planNutricional: {
          pacienteId
        }
      },
      include: {
        seguimientoComidas: {
          select: {
            estado: true,
            porcentajeConsumido: true
          }
        }
      }
    })
  ]);

  if (!paciente) {
    return null;
  }

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
      email: paciente.email || undefined,
      telefono: paciente.telefono || undefined,
      fechaNacimiento: paciente.fechaNacimiento || undefined,
      sexo: paciente.sexo || undefined,
      alturaCm: paciente.alturaCm || undefined,
      notas: paciente.notas || undefined,
      creadoEn: paciente.creadoEn
    },
    perfilMedico: paciente.perfilMedico ? {
      gustos: paciente.perfilMedico.gustos || undefined,
      disgustos: paciente.perfilMedico.disgustos || undefined,
      alergias: paciente.perfilMedico.alergias || undefined,
      enfermedades: paciente.perfilMedico.enfermedades || undefined,
      medicamentos: paciente.perfilMedico.medicamentos || undefined,
      restricciones: paciente.perfilMedico.restricciones || undefined,
      objetivos: paciente.perfilMedico.objetivos || undefined,
      observaciones: paciente.perfilMedico.observaciones || undefined
    } : undefined,
    mediciones: mediciones.map(m => ({
      id: m.id,
      fecha: m.fecha,
      pesoKg: m.pesoKg || undefined,
      alturaCm: m.alturaCm || undefined,
      imc: m.imc || undefined,
      notas: m.notas || undefined,
      consultaId: m.consultaId || undefined
    })),
    consultas: consultas.map(c => ({
      id: c.id,
      inicio: c.inicio,
      fin: c.fin,
      estado: c.estado,
      lugar: c.lugar || undefined,
      notas: c.notas || undefined,
      mediciones: c.mediciones.map(m => ({
        id: m.id,
        fecha: m.fecha,
        pesoKg: m.pesoKg || undefined,
        alturaCm: m.alturaCm || undefined,
        imc: m.imc || undefined,
        notas: m.notas || undefined
      }))
    })),
    planes: planesConAdherencia.map(p => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion || undefined,
      tipo: p.tipo,
      estado: p.estado,
      fechaInicio: p.fechaInicio,
      fechaFin: p.fechaFin || undefined,
      caloriasObjetivo: p.caloriasObjetivo || undefined,
      proteinasObjetivo: p.proteinasObjetivo || undefined,
      carbohidratosObjetivo: p.carbohidratosObjetivo || undefined,
      grasasObjetivo: p.grasasObjetivo || undefined,
      notas: p.notas || undefined,
      _count: p._count,
      adherencia: p.adherencia
    })),
    estadisticas: {
      ...estadisticas,
      pesoInicial: estadisticas.pesoInicial || undefined,
      pesoActual: estadisticas.pesoActual || undefined,
      imcInicial: estadisticas.imcInicial || undefined,
      imcActual: estadisticas.imcActual || undefined
    }
  };
}