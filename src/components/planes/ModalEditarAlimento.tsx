"use client";

import { useState, useEffect } from "react";
import { AlimentoComidaCompleto } from "@/types/planes";
import { AlimentoSeguro } from "@/types/planes";
import { actualizarAlimentoComidaAction, obtenerAlimentosSegurosPacienteAction } from "@/app/dashboard/planes/actions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  alimentoComida: AlimentoComidaCompleto;
  pacienteId: string;
  planId: string;
  onSuccess: () => void;
}

export default function ModalEditarAlimento({ isOpen, onClose, alimentoComida, pacienteId, planId, onSuccess }: Props) {
  const [cantidad, setCantidad] = useState(alimentoComida.cantidad);
  const [unidad, setUnidad] = useState(alimentoComida.unidad);
  const [preparacion, setPreparacion] = useState(alimentoComida.preparacion || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el selector de alimentos
  const [alimentos, setAlimentos] = useState<AlimentoSeguro[]>([]);
  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState<AlimentoSeguro>(alimentoComida.alimento);
  const [cargandoAlimentos, setCargandoAlimentos] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // Cargar alimentos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      cargarAlimentos();
    }
  }, [isOpen, pacienteId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function cargarAlimentos() {
    setCargandoAlimentos(true);
    try {
      const resultado = await obtenerAlimentosSegurosPacienteAction(pacienteId);
      if (resultado.success) {
        setAlimentos(resultado.data || []);
      } else {
        setError("Error al cargar los alimentos");
      }
    } catch {
      setError("Error al cargar los alimentos");
    } finally {
      setCargandoAlimentos(false);
    }
  }

  // Calcular valores nutricionales según cantidad y alimento seleccionado
  function calcularNutricion(cant: number, alimento: AlimentoSeguro = alimentoSeleccionado) {
    const factor = cant / 100;
    return {
      calorias: Math.round(alimento.caloriasPor100g * factor),
      proteinas: Math.round(alimento.proteinasPor100g * factor * 10) / 10,
      carbohidratos: Math.round(alimento.carbohidratosPor100g * factor * 10) / 10,
      grasas: Math.round(alimento.grasasPor100g * factor * 10) / 10
    };
  }

  // Filtrar alimentos según búsqueda
  const alimentosFiltrados = alimentos.filter(alimento =>
    alimento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    alimento.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  );

  async function handleGuardar() {
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('alimentoComidaId', alimentoComida.id);
      formData.append('cantidad', cantidad.toString());
      formData.append('unidad', unidad);
      formData.append('preparacion', preparacion);
      formData.append('planId', planId);
      
      // Solo agregar nuevoAlimentoId si se cambió el alimento
      if (alimentoSeleccionado.id !== alimentoComida.alimento.id) {
        formData.append('nuevoAlimentoId', alimentoSeleccionado.id);
      }
      
      const res = await actualizarAlimentoComidaAction(formData);
      
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Error al actualizar el alimento");
      }
    } catch {
      setError("Error al actualizar el alimento");
    }
    
    setSubmitting(false);
  }

  function handleClose() {
    onClose();
    setCantidad(alimentoComida.cantidad);
    setUnidad(alimentoComida.unidad);
    setPreparacion(alimentoComida.preparacion || '');
    setAlimentoSeleccionado(alimentoComida.alimento);
    setBusqueda('');
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
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 px-6 py-4 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-2xl">
                  {alimentoSeleccionado.categoria === 'Frutas' ? '🍎' :
                   alimentoSeleccionado.categoria === 'Vegetales' ? '🥬' :
                   alimentoSeleccionado.categoria === 'Carnes' ? '🥩' :
                   alimentoSeleccionado.categoria === 'Pescados' ? '🐟' :
                   alimentoSeleccionado.categoria === 'Lácteos' ? '🥛' :
                   alimentoSeleccionado.categoria === 'Cereales' ? '🌾' :
                   alimentoSeleccionado.categoria === 'Legumbres' ? '🫘' :
                   alimentoSeleccionado.categoria === 'Huevos' ? '🥚' :
                   alimentoSeleccionado.categoria === 'Aceites' ? '🫒' : '🍽️'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Editar Alimento
                  </h3>
                  <p className="text-blue-700 font-medium">{alimentoSeleccionado.nombre}</p>
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

            {/* Selector de Alimentos */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                🍽️ Seleccionar Alimento
              </label>
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                {/* Búsqueda */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar alimento por nombre o categoría..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Lista de alimentos */}
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {cargandoAlimentos ? (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <p className="text-sm text-gray-600 mt-2">Cargando alimentos...</p>
                    </div>
                  ) : alimentosFiltrados.length > 0 ? (
                    alimentosFiltrados.map((alimento) => (
                      <div
                        key={alimento.id}
                        onClick={() => setAlimentoSeleccionado(alimento)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          alimentoSeleccionado.id === alimento.id
                            ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
                            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{alimento.nombre}</div>
                            <div className="text-sm text-gray-600">
                              {alimento.categoria && `${alimento.categoria} • `}
                              {alimento.caloriasPor100g} cal/100g
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">
                              P: {alimento.proteinasPor100g}g • C: {alimento.carbohidratosPor100g}g • G: {alimento.grasasPor100g}g
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No se encontraron alimentos</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

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
                    {cantidad} {unidad} de {alimentoSeleccionado.nombre}
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
                style={{ minHeight: '40px', minWidth: '150px' }} // ✅ Forzar tamaño mínimo
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
