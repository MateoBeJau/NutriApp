"use client";

import Link from 'next/link';

interface Plan {
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
  adherencia?: {
    diasConSeguimiento: number;
    totalDias: number;
    porcentajeAdherencia: number;
  };
}

interface Estadisticas {
  totalPlanes: number;
  planesActivos: number;
  planesCompletados: number;
}

interface Props {
  planes: Plan[];
  estadisticas: Estadisticas;
}

const ESTADOS_LABELS: Record<string, string> = {
  'BORRADOR': 'Borrador',
  'ACTIVO': 'Activo',
  'PAUSADO': 'Pausado',
  'COMPLETADO': 'Completado',
  'CANCELADO': 'Cancelado'
};

const TIPOS_LABELS: Record<string, string> = {
  'MANUAL': 'Manual',
  'GENERADO_IA': 'Generado con IA'
};

export default function ResumenPlanes({ planes, estadisticas }: Props) {
  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total de Planes</p>
              <p className="text-2xl font-bold text-blue-900">{estadisticas.totalPlanes}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Planes Activos</p>
              <p className="text-2xl font-bold text-green-900">{estadisticas.planesActivos}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Completados</p>
              <p className="text-2xl font-bold text-purple-900">{estadisticas.planesCompletados}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de planes */}
      {planes.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No hay planes nutricionales</h3>
          <p className="mt-2 text-gray-500">Este paciente aún no tiene planes asignados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {planes.map((plan) => (
            <div key={plan.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{plan.nombre}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      plan.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' :
                      plan.estado === 'COMPLETADO' ? 'bg-blue-100 text-blue-800' :
                      plan.estado === 'BORRADOR' ? 'bg-yellow-100 text-yellow-800' :
                      plan.estado === 'PAUSADO' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {ESTADOS_LABELS[plan.estado] || plan.estado}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {TIPOS_LABELS[plan.tipo] || plan.tipo}
                    </span>
                  </div>
                  
                  {plan.descripcion && (
                    <p className="text-gray-600 mb-2">{plan.descripcion}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Inicio:</span>
                      <p className="text-gray-900">
                        {plan.fechaInicio.toLocaleDateString('es-AR')}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Fin:</span>
                      <p className="text-gray-900">
                        {plan.fechaFin ? plan.fechaFin.toLocaleDateString('es-AR') : 'Sin fecha'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Comidas:</span>
                      <p className="text-gray-900">{plan._count.comidas}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Seguimientos:</span>
                      <p className="text-gray-900">{plan._count.seguimientos}</p>
                    </div>
                  </div>

                  {/* Objetivos nutricionales */}
                  {(plan.caloriasObjetivo || plan.proteinasObjetivo || plan.carbohidratosObjetivo || plan.grasasObjetivo) && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Objetivos Nutricionales:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        {plan.caloriasObjetivo && (
                          <div>
                            <span className="text-gray-600">Calorías:</span>
                            <span className="ml-1 font-medium">{plan.caloriasObjetivo} kcal</span>
                          </div>
                        )}
                        {plan.proteinasObjetivo && (
                          <div>
                            <span className="text-gray-600">Proteínas:</span>
                            <span className="ml-1 font-medium">{plan.proteinasObjetivo}g</span>
                          </div>
                        )}
                        {plan.carbohidratosObjetivo && (
                          <div>
                            <span className="text-gray-600">Carbohidratos:</span>
                            <span className="ml-1 font-medium">{plan.carbohidratosObjetivo}g</span>
                          </div>
                        )}
                        {plan.grasasObjetivo && (
                          <div>
                            <span className="text-gray-600">Grasas:</span>
                            <span className="ml-1 font-medium">{plan.grasasObjetivo}g</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Adherencia */}
                  {plan.adherencia && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                      <h4 className="text-sm font-medium text-blue-700 mb-2">Adherencia al Plan:</h4>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-blue-600">Cumplimiento</span>
                            <span className="font-medium text-blue-900">{plan.adherencia.porcentajeAdherencia}%</span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${plan.adherencia.porcentajeAdherencia}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm text-blue-600">
                          {plan.adherencia.diasConSeguimiento}/{plan.adherencia.totalDias} días
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  <Link
                    href={`/dashboard/planes/${plan.id}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Ver Plan
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
