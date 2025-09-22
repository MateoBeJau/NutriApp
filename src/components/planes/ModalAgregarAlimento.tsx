"use client";

import { useState, useEffect, useCallback } from "react";
import { obtenerAlimentosSegurosPacienteAction, agregarAlimentoComidaAction } from "@/app/dashboard/planes/actions";
import { AlimentoSeguro } from "@/types/planes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  comidaId: string;
  pacienteId: string;
  planId: string;
  onSuccess: () => void;
}

export default function ModalAgregarAlimento({ isOpen, onClose, comidaId, pacienteId, planId, onSuccess }: Props) {
  const [alimentos, setAlimentos] = useState<AlimentoSeguro[]>([]);
  const [alimentosFiltrados, setAlimentosFiltrados] = useState<AlimentoSeguro[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado del alimento seleccionado
  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState<AlimentoSeguro | null>(null);
  const [cantidad, setCantidad] = useState<number>(100);
  const [unidad, setUnidad] = useState("g");
  const [preparacion, setPreparacion] = useState("");

  const cargarAlimentos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await obtenerAlimentosSegurosPacienteAction(pacienteId);
      if (res.success && Array.isArray(res.data)) {
        setAlimentos(res.data);
      } else {
        setAlimentos([]);
        setError(res.error || "Error al cargar alimentos");
      }
    } catch {
      setError("Error al cargar alimentos");
    }
    
    setLoading(false);
  }, [pacienteId]);

  // Filtrar alimentos según búsqueda
  useEffect(() => {
    if (!busqueda.trim()) {
      setAlimentosFiltrados(alimentos);
    } else {
      const filtrados = alimentos.filter(alimento =>
        alimento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (alimento.categoria && alimento.categoria.toLowerCase().includes(busqueda.toLowerCase()))
      );
      setAlimentosFiltrados(filtrados);
    }
  }, [busqueda, alimentos]);

  useEffect(() => {
    if (isOpen && pacienteId) {
      cargarAlimentos();
    }
  }, [isOpen, pacienteId, cargarAlimentos]);

  async function handleAgregar() {
    if (!alimentoSeleccionado) return;
    
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.set('comidaPlanId', comidaId);
    formData.set('alimentoId', alimentoSeleccionado.id);
    formData.set('cantidad', cantidad.toString());
    formData.set('unidad', unidad);
    formData.set('preparacion', preparacion);
    formData.set('planId', planId);

    try {
      const res = await agregarAlimentoComidaAction(formData);
      if (res.success) {
        onSuccess();
        handleClose();
      } else {
        setError(res.error || "Error al agregar alimento");
      }
    } catch {
      setError("Error al agregar alimento");
    }
    
    setSubmitting(false);
  }

  function handleClose() {
    onClose();
    setBusqueda("");
    setAlimentoSeleccionado(null);
    setCantidad(100);
    setUnidad("g");
    setPreparacion("");
    setError(null);
  }

  // Calcular valores nutricionales según cantidad
  function calcularNutricion(alimento: AlimentoSeguro, cant: number) {
    const factor = cant / 100;
    return {
      calorias: Math.round(alimento.caloriasPor100g * factor),
      proteinas: Math.round(alimento.proteinasPor100g * factor * 10) / 10,
      carbohidratos: Math.round(alimento.carbohidratosPor100g * factor * 10) / 10,
      grasas: Math.round(alimento.grasasPor100g * factor * 10) / 10
    };
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay de fondo */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Agregar Alimento a la Comida
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white overflow-y-auto max-h-[calc(90vh-120px)]">
            {error && (
              <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                <div className="text-red-800 text-sm">{error}</div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full">
              {/* Panel de búsqueda y filtros */}
              <div className="lg:col-span-2 border-r border-gray-200 flex flex-col">
                {/* Búsqueda mejorada */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      placeholder="🔍 Buscar alimentos (ej: pollo, manzana, arroz...)"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      autoFocus
                    />
                    {busqueda && (
                      <button
                        onClick={() => setBusqueda('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Estadísticas rápidas */}
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span className="text-blue-700">
                      {alimentosFiltrados.length} alimentos encontrados
                    </span>
                    {loading && (
                      <span className="text-blue-600 flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Cargando...
                      </span>
                    )}
                  </div>
                </div>

                {/* Lista de alimentos mejorada */}
                <div className="flex-1 overflow-y-auto">

                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-3 text-sm text-gray-500">Cargando alimentos seguros...</p>
                      </div>
                    </div>
                  ) : alimentosFiltrados.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {busqueda ? "No se encontraron alimentos" : "No hay alimentos disponibles"}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {busqueda ? `Intenta buscar "${busqueda.split(' ')[0]}" o algo más general` : "Agrega algunos alimentos desde el panel de administración"}
                        </p>
                        {busqueda && (
                          <button
                            onClick={() => setBusqueda('')}
                            className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Limpiar búsqueda
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2">
                      {alimentosFiltrados.map((alimento, index) => (
                        <div
                          key={alimento.id}
                          onClick={() => setAlimentoSeleccionado(alimento)}
                          className={`relative p-4 mb-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                            alimentoSeleccionado?.id === alimento.id 
                              ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 shadow-lg transform scale-[1.02]' 
                              : 'bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {/* Número del alimento */}
                          <div className="absolute top-2 right-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              alimentoSeleccionado?.id === alimento.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {index + 1}
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            {/* Icono de categoría */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                              alimentoSeleccionado?.id === alimento.id ? 'bg-blue-200' : 'bg-gray-100'
                            }`}>
                              {alimento.categoria === 'Frutas' ? '🍎' :
                               alimento.categoria === 'Vegetales' ? '🥬' :
                               alimento.categoria === 'Carnes' ? '🥩' :
                               alimento.categoria === 'Pescados' ? '🐟' :
                               alimento.categoria === 'Lácteos' ? '🥛' :
                               alimento.categoria === 'Cereales' ? '🌾' :
                               alimento.categoria === 'Legumbres' ? '🫘' :
                               alimento.categoria === 'Huevos' ? '🥚' :
                               alimento.categoria === 'Aceites' ? '🫒' : '🍽️'}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 text-base leading-tight">
                                    {alimento.nombre}
                                  </h4>
                                  {alimento.categoria && (
                                    <p className="text-sm text-gray-600 mt-0.5">{alimento.categoria}</p>
                                  )}
                                  {alimento.marca && (
                                    <p className="text-xs text-gray-500 mt-0.5">Marca: {alimento.marca}</p>
                                  )}
                                </div>
                                
                                {/* Info nutricional compacta */}
                                <div className="text-right ml-4">
                                  <div className="font-bold text-lg text-blue-600">{alimento.caloriasPor100g}</div>
                                  <div className="text-xs text-gray-500">cal/100g</div>
                                </div>
                              </div>

                              {/* Macros rápidos */}
                              <div className="flex items-center space-x-4 mt-2 text-xs">
                                <span className="text-green-600">
                                  <strong>{alimento.proteinasPor100g}g</strong> prot
                                </span>
                                <span className="text-amber-600">
                                  <strong>{alimento.carbohidratosPor100g}g</strong> carb
                                </span>
                                <span className="text-purple-600">
                                  <strong>{alimento.grasasPor100g}g</strong> gras
                                </span>
                              </div>
                              
                              {/* Indicadores de seguridad mejorados */}
                              <div className="flex flex-wrap gap-1 mt-3">
                                {alimento.esSeguroParaPaciente && (
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                    ✅ Seguro
                                  </span>
                                )}
                                {alimento.prioridad === 1 && (
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                    ⚠️ Alta prioridad
                                  </span>
                                )}
                                {alimento.razonRestriccion && (
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                    ⚠️ Precaución
                                  </span>
                                )}
                                {alimento.aptoParaDiabetes && (
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full">
                                    💚 Diabetes
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Panel de configuración mejorado */}
              <div className="bg-gray-50 border-l border-gray-200 flex flex-col">
                {alimentoSeleccionado ? (
                  <div className="flex flex-col h-full">
                    {/* Header del alimento seleccionado */}
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-b border-blue-200">
                      <div className="flex items-center space-x-3 mb-3">
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
                          <h4 className="font-bold text-gray-900 text-lg leading-tight">
                            {alimentoSeleccionado.nombre}
                          </h4>
                          {alimentoSeleccionado.categoria && (
                            <p className="text-blue-700 text-sm font-medium">{alimentoSeleccionado.categoria}</p>
                          )}
                          {alimentoSeleccionado.marca && (
                            <p className="text-blue-600 text-xs">Marca: {alimentoSeleccionado.marca}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Advertencias si las hay */}
                      {alimentoSeleccionado.razonRestriccion && (
                        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <span className="text-yellow-600 mr-2">⚠️</span>
                            <span className="text-xs font-bold text-yellow-800">ADVERTENCIAS</span>
                          </div>
                          <div className="text-xs text-yellow-800">
                            {alimentoSeleccionado.razonRestriccion}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Configuración de cantidad */}
                    <div className="flex-1 p-6 space-y-6">

                      {/* Controles de cantidad mejorados */}
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-3">
                          ⚖️ Cantidad y Unidad
                        </label>
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
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
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
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

                      {/* Vista previa nutricional mejorada */}
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-3">
                          📊 Información Nutricional
                        </label>
                        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200 p-4">
                          <div className="text-center mb-4">
                            <div className="text-lg font-bold text-gray-900">
                              {cantidad} {unidad} de {alimentoSeleccionado.nombre}
                            </div>
                          </div>
                          
                          {(() => {
                            const nutricion = calcularNutricion(alimentoSeleccionado, cantidad);
                            return (
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
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">👈</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Selecciona un alimento
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Busca y elige un alimento de la lista para configurar la cantidad
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer mejorado */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {alimentoSeleccionado ? (
                  <span className="flex items-center">
                    ✅ <strong className="ml-1">{alimentoSeleccionado.nombre}</strong> seleccionado
                  </span>
                ) : (
                  <span className="text-gray-400">Ningún alimento seleccionado</span>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200 font-medium"
                >
                  ❌ Cancelar
                </button>
                <button
                  onClick={handleAgregar}
                  disabled={!alimentoSeleccionado || submitting}
                  className="px-8 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {submitting ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Agregando...
                    </>
                  ) : (
                    <>🍽️ Agregar Alimento</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
