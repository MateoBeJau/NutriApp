"use client";

import { useState } from "react";
import { AlimentoComida } from "@/types/planes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  alimentoComida: AlimentoComida;
  onSuccess: () => void;
}

export default function ModalEditarAlimento({ isOpen, onClose, alimentoComida, onSuccess }: Props) {
  const [cantidad, setCantidad] = useState(alimentoComida.cantidad);
  const [unidad, setUnidad] = useState(alimentoComida.unidad);
  const [preparacion, setPreparacion] = useState(alimentoComida.preparacion || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcular valores nutricionales según cantidad
  function calcularNutricion(cant: number) {
    const factor = cant / 100;
    return {
      calorias: Math.round(alimentoComida.alimento.caloriasPor100g * factor),
      proteinas: Math.round(alimentoComida.alimento.proteinasPor100g * factor * 10) / 10,
      carbohidratos: Math.round(alimentoComida.alimento.carbohidratosPor100g * factor * 10) / 10,
      grasas: Math.round(alimentoComida.alimento.grasasPor100g * factor * 10) / 10
    };
  }

  async function handleGuardar() {
    setSubmitting(true);
    setError(null);

    try {
      // TODO: Implementar server action para actualizar alimento
      // const res = await actualizarAlimentoComidaAction(alimentoComida.id, {
      //   cantidad,
      //   unidad,
      //   preparacion
      // });
      
      // Simulación por ahora
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess();
      onClose();
    } catch (err) {
      setError("Error al actualizar el alimento");
    }
    
    setSubmitting(false);
  }

  function handleClose() {
    onClose();
    setCantidad(alimentoComida.cantidad);
    setUnidad(alimentoComida.unidad);
    setPreparacion(alimentoComida.preparacion || '');
    setError(null);
  }

  if (!isOpen) return null;

  const nutricion = calcularNutricion(cantidad);

  return (
    <>
      {/* Overlay de fondo */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 px-6 py-4 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-2xl">
                  {alimentoComida.alimento.categoria === 'Frutas' ? '🍎' :
                   alimentoComida.alimento.categoria === 'Vegetales' ? '🥬' :
                   alimentoComida.alimento.categoria === 'Carnes' ? '🥩' :
                   alimentoComida.alimento.categoria === 'Pescados' ? '🐟' :
                   alimentoComida.alimento.categoria === 'Lácteos' ? '🥛' :
                   alimentoComida.alimento.categoria === 'Cereales' ? '🌾' :
                   alimentoComida.alimento.categoria === 'Legumbres' ? '🫘' :
                   alimentoComida.alimento.categoria === 'Huevos' ? '🥚' :
                   alimentoComida.alimento.categoria === 'Aceites' ? '🫒' : '🍽️'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Editar Alimento
                  </h3>
                  <p className="text-blue-700 font-medium">{alimentoComida.alimento.nombre}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="text-red-800 text-sm">{error}</div>
              </div>
            )}

            {/* Controles de cantidad */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                ⚖️ Cantidad y Unidad
              </label>
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">CANTIDAD</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={cantidad}
                        onChange={(e) => setCantidad(Number(e.target.value))}
                        min="1"
                        max="9999"
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 text-lg font-semibold text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="flex justify-between mt-2">
                        <button 
                          type="button"
                          onClick={() => setCantidad(Math.max(1, cantidad - 10))}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                          -10
                        </button>
                        <button 
                          type="button"
                          onClick={() => setCantidad(cantidad + 10)}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                          +10
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">UNIDAD</label>
                    <select
                      value={unidad}
                      onChange={(e) => setUnidad(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="g">gramos (g)</option>
                      <option value="ml">mililitros (ml)</option>
                      <option value="unidad">unidad</option>
                      <option value="taza">taza</option>
                      <option value="cucharada">cucharada</option>
                      <option value="cucharadita">cucharadita</option>
                    </select>
                  </div>
                </div>

                {/* Cantidades rápidas */}
                <div className="border-t border-gray-200 pt-3">
                  <div className="text-xs font-medium text-gray-600 mb-2">CANTIDADES COMUNES</div>
                  <div className="flex flex-wrap gap-2">
                    {[50, 100, 150, 200, 250].map(cant => (
                      <button
                        key={cant}
                        type="button"
                        onClick={() => setCantidad(cant)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          cantidad === cant 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cant}{unidad}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Preparación */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                👨‍🍳 Preparación (opcional)
              </label>
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <input
                  type="text"
                  value={preparacion}
                  onChange={(e) => setPreparacion(e.target.value)}
                  placeholder="Ej: hervido, a la plancha, crudo, al vapor..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex flex-wrap gap-1 mt-3">
                  {['hervido', 'a la plancha', 'al vapor', 'crudo', 'asado'].map(prep => (
                    <button
                      key={prep}
                      type="button"
                      onClick={() => setPreparacion(prep)}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full"
                    >
                      {prep}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vista previa nutricional */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                📊 Nueva Información Nutricional
              </label>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200 p-4">
                <div className="text-center mb-4">
                  <div className="text-lg font-bold text-gray-900">
                    {cantidad} {unidad} de {alimentoComida.alimento.nombre}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">{nutricion.calorias}</div>
                    <div className="text-xs font-medium text-gray-600">CALORÍAS</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-2xl font-bold text-green-600">{nutricion.proteinas}g</div>
                    <div className="text-xs font-medium text-gray-600">PROTEÍNAS</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-2xl font-bold text-amber-600">{nutricion.carbohidratos}g</div>
                    <div className="text-xs font-medium text-gray-600">CARBOHIDRATOS</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">{nutricion.grasas}g</div>
                    <div className="text-xs font-medium text-gray-600">GRASAS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200 font-medium"
              >
                ❌ Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={submitting}
                className="px-8 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {submitting ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>💾 Guardar Cambios</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
