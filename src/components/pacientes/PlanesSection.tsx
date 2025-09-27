'use client';

import { useState, useEffect } from 'react';
import { GenerarPlanButton } from '@/components/planes/GenerarPlanButton';
import { obtenerPlanesPaciente } from '@/app/dashboard/planes/obtener-planes-actions';
import Link from 'next/link';

interface PlanesSectionProps {
  pacienteId: string;
}

interface PlanNutricional {
  id: string;
  nombre: string;
  descripcion: string | null;
  tipo: string;
  estado: string;
  fechaInicio: Date;
  caloriasObjetivo: number | null;
  proteinasObjetivo: number | null;
  carbohidratosObjetivo: number | null;
  grasasObjetivo: number | null;
  comidas: Array<{
    id: string;
    tipo: string;
    nombre: string;
    orden: number;
  }>;
}

export default function PlanesSection({ pacienteId }: PlanesSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [planes, setPlanes] = useState<PlanNutricional[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarPlanes = async () => {
      try {
        setIsLoading(true);
        const resultado = await obtenerPlanesPaciente(pacienteId);
        
        if (resultado.success) {
          setPlanes(resultado.planes);
        } else {
          console.error('Error al cargar planes:', resultado.error);
        }
      } catch (error) {
        console.error('Error al cargar planes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarPlanes();
  }, [pacienteId]);

  const handlePlanGenerado = () => {
    // Recargar los planes después de generar uno nuevo
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando planes nutricionales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Planes Nutricionales</h2>
        <div className="flex gap-2">
          <GenerarPlanButton 
            pacienteId={pacienteId}
            onGenerating={setIsGenerating}
            onPlanGenerado={handlePlanGenerado}
          />
          <Link
            href={`/dashboard/planes/nuevo?pacienteId=${pacienteId}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear Plan Manual
          </Link>
        </div>
      </div>

      {isGenerating ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generando nuevo plan nutricional...</p>
        </div>
      ) : planes.length > 0 ? (
        <div className="space-y-4">
          {planes.map((plan) => (
            <Link
              key={plan.id}
              href={`/dashboard/planes/${plan.id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {plan.nombre}
                  </h3>
                  {plan.descripcion && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {plan.descripcion}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      {plan.caloriasObjetivo ? `${plan.caloriasObjetivo} cal` : 'Sin calorías'}
                    </span>
                    <span>
                      {plan.comidas.length} comidas
                    </span>
                    <span>
                      {new Date(plan.fechaInicio).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      plan.tipo === 'GENERADO_IA' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {plan.tipo === 'GENERADO_IA' ? 'IA' : 'Manual'}
                    </span>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      plan.estado === 'ACTIVO' 
                        ? 'bg-green-100 text-green-800'
                        : plan.estado === 'BORRADOR'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {plan.estado}
                    </span>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <svg className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium text-gray-900 mb-2">No hay planes nutricionales</p>
          <p className="text-sm text-gray-500">Genera un plan con IA o crea uno manual para comenzar</p>
        </div>
      )}
    </div>
  );
}