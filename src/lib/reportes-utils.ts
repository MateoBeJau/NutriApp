/**
 * Calcular la edad a partir de la fecha de nacimiento
 */
export function calcularEdad(fechaNacimiento: Date | null): number | null {
  if (!fechaNacimiento) return null;
  
  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    return edad - 1;
  }
  
  return edad;
}

/**
 * Formatear fecha para mostrar en reportes
 */
export function formatearFecha(fecha: Date): string {
  return fecha.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Obtener el estado de salud basado en IMC
 */
export function obtenerEstadoIMC(imc: number): {
  categoria: string;
  color: string;
  descripcion: string;
} {
  if (imc < 18.5) {
    return {
      categoria: 'Bajo peso',
      color: 'text-blue-600',
      descripcion: 'Por debajo del peso normal'
    };
  } else if (imc < 25) {
    return {
      categoria: 'Peso normal',
      color: 'text-green-600',
      descripcion: 'Peso saludable'
    };
  } else if (imc < 30) {
    return {
      categoria: 'Sobrepeso',
      color: 'text-yellow-600',
      descripcion: 'Por encima del peso normal'
    };
  } else {
    return {
      categoria: 'Obesidad',
      color: 'text-red-600',
      descripcion: 'Peso significativamente elevado'
    };
  }
}
