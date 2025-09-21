"use client";

import { useState } from 'react';
import { eliminarPlanNutricionalAction } from '@/app/dashboard/planes/actions';

interface Props {
  planId: string;
  nombrePlan: string;
  nombrePaciente: string;
  className?: string;
}

export default function BotonEliminarPlan({ planId, nombrePlan, nombrePaciente, className = "" }: Props) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEliminar = async () => {
    setEliminando(true);
    setError(null);

    try {
      const resultado = await eliminarPlanNutricionalAction(planId);
      
      if (resultado.success) {
        // El revalidatePath se encarga de actualizar la página
        setMostrarModal(false);
      } else {
        setError(resultado.error || 'Error al eliminar el plan');
      }
    } catch (error) {
      setError('Error inesperado al eliminar el plan');
      console.error('Error al eliminar plan:', error);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <>
      {/* Botón de eliminar */}
      <button
        onClick={() => setMostrarModal(true)}
        className={`text-red-600 hover:text-red-900 transition-colors ${className}`}
        title="Eliminar plan"
      >
        Eliminar
      </button>

      {/* Modal de confirmación */}
      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Eliminar Plan
                  </h3>
                  <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
                </div>
              </div>

              {/* Contenido */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  ¿Confirmas que deseas eliminar este plan?
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-sm font-medium text-gray-900 truncate" title={nombrePlan}>
                    {nombrePlan}
                  </p>
                  <p className="text-sm text-gray-600 truncate" title={nombrePaciente}>
                    {nombrePaciente}
                  </p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Botones */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModal(false);
                    setError(null);
                  }}
                  disabled={eliminando}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleEliminar}
                  disabled={eliminando}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {eliminando ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Eliminando...
                    </>
                  ) : (
                    'Eliminar Plan'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
