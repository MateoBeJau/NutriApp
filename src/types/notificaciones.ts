export interface NotificacionConsultaData {
    paciente: {
      nombre: string;
      apellido: string;
      email: string | null;
    };
    consulta: {
      fecha: Date;
      hora: string;
      lugar: string;
    };
    nutricionista: {
      nombre: string;
    };
  }