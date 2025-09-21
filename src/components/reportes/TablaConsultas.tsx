"use client";

interface Consulta {
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
}

interface Estadisticas {
  totalConsultas: number;
  consultasCompletadas: number;
  consultasPendientes: number;
}

interface Props {
  consultas: Consulta[];
  estadisticas: Estadisticas;
}

const ESTADOS_LABELS: Record<string, string> = {
  'PROGRAMADO': 'Programado',
  'CONFIRMADO': 'Confirmado',
  'CANCELADO': 'Cancelado',
  'AUSENTE': 'Ausente',
  'COMPLETADO': 'Completado',
  'REAGENDADO': 'Reagendado'
};

export default function TablaConsultas({ consultas, estadisticas }: Props) {
  return (
    <div className="space-y-6">
      {/* Estadísticas de consultas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Consultas</p>
              <p className="text-2xl font-bold text-blue-900">{estadisticas.totalConsultas}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Completadas</p>
              <p className="text-2xl font-bold text-green-900">{estadisticas.consultasCompletadas}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-900">{estadisticas.consultasPendientes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de consultas */}
      {consultas.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No hay consultas registradas</h3>
          <p className="mt-2 text-gray-500">Este paciente aún no tiene consultas programadas.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lugar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mediciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notas
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consultas.map((consulta) => (
                <tr key={consulta.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {consulta.inicio.toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {consulta.inicio.toLocaleTimeString('es-AR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {consulta.fin.toLocaleTimeString('es-AR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      consulta.estado === 'COMPLETADO' ? 'bg-green-100 text-green-800' :
                      consulta.estado === 'CONFIRMADO' ? 'bg-blue-100 text-blue-800' :
                      consulta.estado === 'PROGRAMADO' ? 'bg-yellow-100 text-yellow-800' :
                      consulta.estado === 'CANCELADO' ? 'bg-red-100 text-red-800' :
                      consulta.estado === 'AUSENTE' ? 'bg-gray-100 text-gray-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {ESTADOS_LABELS[consulta.estado] || consulta.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consulta.lugar || 'No especificado'}
                  </td>
                  <td className="px-6 py-4">
                    {consulta.mediciones.length > 0 ? (
                      <div className="space-y-1">
                        {consulta.mediciones.map((medicion) => (
                          <div key={medicion.id} className="text-sm">
                            {medicion.pesoKg && (
                              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1">
                                Peso: {medicion.pesoKg} kg
                              </span>
                            )}
                            {medicion.imc && (
                              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-1">
                                IMC: {medicion.imc.toFixed(1)}
                              </span>
                            )}
                            {medicion.alturaCm && (
                              <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                Altura: {medicion.alturaCm} cm
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Sin mediciones</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      {consulta.notas ? (
                        <p className="text-sm text-gray-900 truncate" title={consulta.notas}>
                          {consulta.notas}
                        </p>
                      ) : (
                        <span className="text-sm text-gray-500">Sin notas</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
