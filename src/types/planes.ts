import { TipoPlan, EstadoPlan, TipoComida, EstadoSeguimiento } from "@prisma/client";

// ========== TIPOS BASE ==========

export interface PlanNutricional {
  id: string;
  pacienteId: string;
  usuarioId: string;
  nombre: string;
  descripcion?: string;
  tipo: TipoPlan;
  estado: EstadoPlan;
  fechaInicio: Date;
  fechaFin?: Date;
  caloriasObjetivo?: number;
  proteinasObjetivo?: number;
  carbohidratosObjetivo?: number;
  grasasObjetivo?: number;
  notas?: string;
  promptIA?: string;
  modeloIA?: string;
  restriccionesAplicadas?: string;
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface ComidaPlan {
  id: string;
  planNutricionalId: string;
  tipo: TipoComida;
  nombre: string;
  descripcion?: string;
  horaRecomendada?: string;
  caloriasTotal?: number;
  proteinasTotal?: number;
  carbohidratosTotal?: number;
  grasasTotal?: number;
  orden: number;
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface Alimento {
  id: string;
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
  aptoParaDiabetes: boolean;
  aptoParaHipertension: boolean;
  indiceGlicemico?: number;
  esGenerico: boolean;
  activo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface AlimentoComida {
  id: string;
  comidaPlanId: string;
  alimentoId: string;
  cantidad: number;
  unidad: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  preparacion?: string;
  notas?: string;
  creadoEn: Date;
}

export interface SeguimientoPlan {
  id: string;
  planNutricionalId: string;
  fecha: Date;
  cumplimientoGeneral?: number;
  pesoDelDia?: number;
  notasPaciente?: string;
  notasNutricionista?: string;
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface SeguimientoComida {
  id: string;
  seguimientoPlanId: string;
  comidaPlanId: string;
  estado: EstadoSeguimiento;
  porcentajeConsumido: number;
  horaConsumo?: Date;
  notas?: string;
  creadoEn: Date;
  actualizadoEn: Date;
}

// ========== TIPOS EXTENDIDOS CON RELACIONES ==========

export interface PlanNutricionalConPaciente extends PlanNutricional {
  paciente: {
    id: string;
    nombre: string;
    apellido: string;
  };
  _count?: {
    comidas: number;
  };
}

export interface PlanNutricionalCompleto extends PlanNutricional {
  paciente: {
    id: string;
    nombre: string;
    apellido: string;
    perfilMedico?: {
      alergias?: string;
      restricciones?: string;
      enfermedades?: string;
      gustos?: string;
      disgustos?: string;
    };
  };
  comidas: ComidaPlanCompleta[];
}

export interface ComidaPlanCompleta extends ComidaPlan {
  alimentos: AlimentoComidaCompleto[];
}

export interface AlimentoComidaCompleto extends AlimentoComida {
  alimento: Alimento;
}

export interface AlimentoSeguro extends Alimento {
  esSeguroParaPaciente?: boolean;
  razonRestriccion?: string;
  prioridad?: number;
}

// ========== TIPOS PARA FORMULARIOS ==========

export interface CrearPlanForm {
  pacienteId: string;
  nombre: string;
  descripcion?: string;
  tipo: TipoPlan;
  fechaInicio: string; // ISO string para formularios
  fechaFin?: string;
  caloriasObjetivo?: number;
  proteinasObjetivo?: number;
  carbohidratosObjetivo?: number;
  grasasObjetivo?: number;
  notas?: string;
}

export interface CrearComidaForm {
  planNutricionalId: string;
  tipo: TipoComida;
  nombre: string;
  descripcion?: string;
  horaRecomendada?: string;
  orden: number;
}

export interface AgregarAlimentoForm {
  comidaPlanId: string;
  alimentoId: string;
  cantidad: number;
  unidad: string;
  preparacion?: string;
  notas?: string;
}

export interface CrearAlimentoForm {
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
  aptoParaDiabetes: boolean;
  aptoParaHipertension: boolean;
  indiceGlicemico?: number;
  esGenerico: boolean;
}

// ========== TIPOS PARA FILTROS Y BÚSQUEDAS ==========

export interface FiltrosPlan {
  pacienteId?: string;
  estado?: EstadoPlan;
  tipo?: TipoPlan;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

export interface FiltrosAlimento {
  pacienteId?: string;
  categoria?: string;
  nombre?: string;
  activo?: boolean;
  apto?: {
    diabetes?: boolean;
    hipertension?: boolean;
  };
  restricciones?: string[];
  alergenos?: string[];
}

// ========== ENUMS Y CONSTANTES ==========

export const TIPOS_COMIDA_LABELS: Record<TipoComida, string> = {
  DESAYUNO: 'Desayuno',
  MEDIA_MANANA: 'Media Mañana',
  ALMUERZO: 'Almuerzo',
  MERIENDA: 'Merienda',
  CENA: 'Cena',
  COLACION_NOCTURNA: 'Colación Nocturna'
};

export const ESTADOS_PLAN_LABELS: Record<EstadoPlan, string> = {
  BORRADOR: 'Borrador',
  ACTIVO: 'Activo',
  PAUSADO: 'Pausado',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado'
};

export const TIPOS_PLAN_LABELS: Record<TipoPlan, string> = {
  MANUAL: 'Manual',
  GENERADO_IA: 'Generado con IA'
};

export const ESTADOS_SEGUIMIENTO_LABELS: Record<EstadoSeguimiento, string> = {
  NO_CONSUMIDO: 'No Consumido',
  CONSUMIDO_PARCIAL: 'Consumido Parcial',
  CONSUMIDO_TOTAL: 'Consumido Total',
  SUSTITUIDO: 'Sustituido'
};

export const UNIDADES_MEDIDA = [
  'gramos',
  'kilogramos',
  'unidades',
  'tazas',
  'cucharadas',
  'cucharaditas',
  'mililitros',
  'litros',
  'rebanadas',
  'porciones'
] as const;

export type UnidadMedida = typeof UNIDADES_MEDIDA[number];

// ========== TIPOS PARA RESPUESTAS DE API ==========

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ResumenNutricional {
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  fibra?: number;
}

export interface EstadisticasPlan {
  totalComidas: number;
  totalAlimentos: number;
  resumenNutricional: ResumenNutricional;
  cumplimientoPromedio?: number;
  diasActivo?: number;
}
