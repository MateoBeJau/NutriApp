export interface Medicion {
  id: string;
  pacienteId: string;
  consultaId?: string | null;
  fecha: Date;
  pesoKg?: number | null;
  alturaCm?: number | null;
  imc?: number | null;
  notas?: string | null;
  creadoEn: Date;
}

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
