"use client";

import { useState } from "react";
import { PlanNutricionalCompleto, TIPOS_COMIDA_LABELS } from "@/types/planes";
import { TipoComida } from "@prisma/client";
import { crearComidaPlanAction, eliminarAlimentoComidaAction, eliminarComidaPlanAction } from "@/app/dashboard/planes/actions";
import ModalAgregarAlimento from "./ModalAgregarAlimento";
import ModalEditarAlimento from "./ModalEditarAlimento";

// Iconos para cada tipo de comida
const ICONOS_COMIDA = {
  DESAYUNO: "🍳",
  MEDIA_MANANA: "🥪", 
  ALMUERZO: "🍲",
  MERIENDA: "☕",
  CENA: "🍽️",
  COLACION_NOCTURNA: "🌙"
};

// Colores para cada tipo de comida
const COLORES_COMIDA = {
  DESAYUNO: "from-yellow-400 to-orange-500",
  MEDIA_MANANA: "from-green-400 to-teal-500", 
  ALMUERZO: "from-blue-400 to-indigo-500",
  MERIENDA: "from-purple-400 to-pink-500",
  CENA: "from-indigo-400 to-purple-600",
  COLACION_NOCTURNA: "from-gray-400 to-gray-600"
};

interface Props {
  plan: PlanNutricionalCompleto;
}

export default function ComponentePlanDetalle({ plan }: Props) {
  const [showAgregarComida, setShowAgregarComida] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para modal de agregar alimentos
  const [modalAlimentoOpen, setModalAlimentoOpen] = useState(false);
  const [comidaSeleccionada, setComidaSeleccionada] = useState<string | null>(null);
  
  // Estado para eliminar alimentos
  const [eliminandoAlimento, setEliminandoAlimento] = useState<string | null>(null);
  
  // Estado para editar alimentos
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [alimentoParaEditar, setAlimentoParaEditar] = useState<any>(null);
  
  // Estado para eliminar comidas
  const [eliminandoComida, setEliminandoComida] = useState<string | null>(null);

  async function handleAgregarComida(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.set('planNutricionalId', plan.id);
    
    const res = await crearComidaPlanAction(formData);

    if (res.success) {
      setShowAgregarComida(false);
      window.location.reload(); // Recargar para mostrar la nueva comida
    } else {
      setError(res.error || "Error al agregar comida");
    }
    setSubmitting(false);
  }

  // Obtener el siguiente número de orden
  const siguienteOrden = plan.comidas.length > 0 
    ? Math.max(...plan.comidas.map(c => c.orden)) + 1 
    : 1;

  function handleAbrirModalAlimento(comidaId: string) {
    setComidaSeleccionada(comidaId);
    setModalAlimentoOpen(true);
  }

  function handleCerrarModalAlimento() {
    setModalAlimentoOpen(false);
    setComidaSeleccionada(null);
  }

  function handleAlimentoAgregado() {
    // Recargar la página para mostrar el nuevo alimento
    window.location.reload();
  }

  async function handleEliminarAlimento(alimentoComidaId: string) {
    if (!confirm('¿Estás seguro de que quieres eliminar este alimento de la comida?')) {
      return;
    }

    setEliminandoAlimento(alimentoComidaId);
    
    try {
      const res = await eliminarAlimentoComidaAction(alimentoComidaId, plan.id);
      if (res.success) {
        // Recargar la página para mostrar los cambios
        window.location.reload();
      } else {
        alert('Error al eliminar el alimento: ' + (res.error || 'Error desconocido'));
      }
    } catch (error) {
      alert('Error al eliminar el alimento');
      console.error('Error:', error);
    } finally {
      setEliminandoAlimento(null);
    }
  }

  function handleEditarAlimento(alimentoComida: any) {
    setAlimentoParaEditar(alimentoComida);
    setModalEditarOpen(true);
  }

  function handleCerrarModalEditar() {
    setModalEditarOpen(false);
    setAlimentoParaEditar(null);
  }

  function handleAlimentoEditado() {
    // Recargar la página para mostrar los cambios
    window.location.reload();
  }

  async function handleEliminarComida(comidaId: string, nombreComida: string) {
    if (!confirm(`¿Estás seguro de que quieres eliminar la comida "${nombreComida}"?\n\nEsto eliminará también todos los alimentos de esta comida.`)) {
      return;
    }

    setEliminandoComida(comidaId);
    
    try {
      const res = await eliminarComidaPlanAction(comidaId, plan.id);
      if (res.success) {
        // Recargar la página para mostrar los cambios
        window.location.reload();
      } else {
        alert('Error al eliminar la comida: ' + (res.error || 'Error desconocido'));
      }
    } catch (error) {
      alert('Error al eliminar la comida');
      console.error('Error:', error);
    } finally {
      setEliminandoComida(null);
    }
  }

  // Calcular totales nutricionales del plan
  function calcularTotalesPlan() {
    return plan.comidas.reduce((totales, comida) => {
      return {
        calorias: totales.calorias + (comida.caloriasTotal || 0),
        proteinas: totales.proteinas + (comida.proteinasTotal || 0),
        carbohidratos: totales.carbohidratos + (comida.carbohidratosTotal || 0),
        grasas: totales.grasas + (comida.grasasTotal || 0)
      };
    }, { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });
  }

  const totalesPlan = calcularTotalesPlan();

  return (
    <div className="space-y-8">
      {/* Resumen Nutricional del Día */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100">
        <div className="px-6 py-4 border-b border-blue-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            📊 Resumen Nutricional del Día
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Calorías */}
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle 
                      cx="40" cy="40" r="36" 
                      stroke="#3b82f6" 
                      strokeWidth="8" 
                      fill="none"
                      strokeDasharray={`${Math.min((totalesPlan.calorias / (plan.caloriasObjetivo || 2000)) * 226, 226)} 226`}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">
                      {Math.round(totalesPlan.calorias)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="font-medium text-gray-900">Calorías</div>
              <div className="text-sm text-gray-500">
                {plan.caloriasObjetivo ? `/ ${plan.caloriasObjetivo}` : ''}
              </div>
            </div>

            {/* Proteínas */}
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle 
                      cx="40" cy="40" r="36" 
                      stroke="#10b981" 
                      strokeWidth="8" 
                      fill="none"
                      strokeDasharray={`${Math.min((totalesPlan.proteinas / (plan.proteinasObjetivo || 120)) * 226, 226)} 226`}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">
                      {Math.round(totalesPlan.proteinas)}g
                    </span>
                  </div>
                </div>
              </div>
              <div className="font-medium text-gray-900">Proteínas</div>
              <div className="text-sm text-gray-500">
                {plan.proteinasObjetivo ? `/ ${plan.proteinasObjetivo}g` : ''}
              </div>
            </div>

            {/* Carbohidratos */}
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle 
                      cx="40" cy="40" r="36" 
                      stroke="#f59e0b" 
                      strokeWidth="8" 
                      fill="none"
                      strokeDasharray={`${Math.min((totalesPlan.carbohidratos / (plan.carbohidratosObjetivo || 250)) * 226, 226)} 226`}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-amber-600">
                      {Math.round(totalesPlan.carbohidratos)}g
                    </span>
                  </div>
                </div>
              </div>
              <div className="font-medium text-gray-900">Carbohidratos</div>
              <div className="text-sm text-gray-500">
                {plan.carbohidratosObjetivo ? `/ ${plan.carbohidratosObjetivo}g` : ''}
              </div>
            </div>

            {/* Grasas */}
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle 
                      cx="40" cy="40" r="36" 
                      stroke="#8b5cf6" 
                      strokeWidth="8" 
                      fill="none"
                      strokeDasharray={`${Math.min((totalesPlan.grasas / (plan.grasasObjetivo || 65)) * 226, 226)} 226`}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">
                      {Math.round(totalesPlan.grasas)}g
                    </span>
                  </div>
                </div>
              </div>
              <div className="font-medium text-gray-900">Grasas</div>
              <div className="text-sm text-gray-500">
                {plan.grasasObjetivo ? `/ ${plan.grasasObjetivo}g` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comidas del Plan */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Comidas del Plan</h2>
          <button
            onClick={() => setShowAgregarComida(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            + Agregar Comida
          </button>
        </div>

        {/* Formulario para agregar comida */}
        {showAgregarComida && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <form onSubmit={handleAgregarComida} className="space-y-4">
              <h3 className="font-medium text-gray-900">Nueva Comida</h3>
              
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Comida
                  </label>
                  <select
                    name="tipo"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {Object.entries(TIPOS_COMIDA_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Ej: Desayuno día 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora Recomendada
                  </label>
                  <input
                    type="time"
                    name="horaRecomendada"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Instrucciones especiales..."
                />
              </div>

              <input type="hidden" name="orden" value={siguienteOrden} />

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-50"
                >
                  {submitting ? "Agregando..." : "Agregar Comida"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAgregarComida(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de comidas */}
        <div className="divide-y divide-gray-200">
          {plan.comidas.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No hay comidas en este plan</h3>
              <p className="mt-2 text-gray-500">Comienza agregando la primera comida del día.</p>
            </div>
          ) : (
            plan.comidas.map((comida) => (
              <div key={comida.id} className="border-l-4 border-transparent hover:border-blue-400 transition-all duration-200">
                <div className="p-6">
                  {/* Header de la comida */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-4">
                      {/* Icono y gradiente */}
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${COLORES_COMIDA[comida.tipo as keyof typeof COLORES_COMIDA]} flex items-center justify-center text-2xl shadow-lg`}>
                        {ICONOS_COMIDA[comida.tipo as keyof typeof ICONOS_COMIDA]}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{comida.nombre}</h3>
                          {comida.horaRecomendada && (
                            <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                              🕐 {comida.horaRecomendada}
                            </span>
                          )}
                          {/* Botón para eliminar comida */}
                          <button
                            onClick={() => handleEliminarComida(comida.id, comida.nombre)}
                            disabled={eliminandoComida === comida.id}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                            title="Eliminar comida completa"
                          >
                            {eliminandoComida === comida.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                            ) : (
                              '🗑️'
                            )}
                          </button>
                        </div>
                        <span className="inline-flex px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full">
                          {TIPOS_COMIDA_LABELS[comida.tipo]}
                        </span>
                        {comida.descripcion && (
                          <p className="text-sm text-gray-600 mt-2 max-w-md">{comida.descripcion}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Información nutricional de la comida */}
                    {(comida.caloriasTotal || comida.proteinasTotal || comida.carbohidratosTotal || comida.grasasTotal) && (
                      <div className="bg-gray-50 rounded-lg p-4 min-w-[200px]">
                        <div className="text-xs font-medium text-gray-500 mb-2 text-center">TOTALES</div>
                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div>
                            <div className="font-bold text-blue-600">{Math.round(comida.caloriasTotal || 0)}</div>
                            <div className="text-xs text-gray-500">cal</div>
                          </div>
                          <div>
                            <div className="font-bold text-green-600">{Math.round(comida.proteinasTotal || 0)}g</div>
                            <div className="text-xs text-gray-500">prot</div>
                          </div>
                          <div>
                            <div className="font-bold text-amber-600">{Math.round(comida.carbohidratosTotal || 0)}g</div>
                            <div className="text-xs text-gray-500">carb</div>
                          </div>
                          <div>
                            <div className="font-bold text-purple-600">{Math.round(comida.grasasTotal || 0)}g</div>
                            <div className="text-xs text-gray-500">gras</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Alimentos de la comida */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        🥗 Alimentos ({comida.alimentos.length})
                      </h4>
                      <button 
                        onClick={() => handleAbrirModalAlimento(comida.id)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        ➕ Agregar
                      </button>
                    </div>

                    {comida.alimentos.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-3">🍽️</div>
                        <p className="text-gray-500 text-sm">Esta comida está vacía</p>
                        <p className="text-gray-400 text-xs mt-1">Haz clic en &quot;Agregar&quot; para añadir alimentos</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {comida.alimentos.map((alimentoComida, index) => (
                          <div key={alimentoComida.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 flex items-center">
                                    {alimentoComida.alimento.nombre}
                                    {alimentoComida.alimento.categoria && (
                                      <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                                        {alimentoComida.alimento.categoria}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-600 flex items-center space-x-2">
                                    <span className="font-medium">{alimentoComida.cantidad} {alimentoComida.unidad}</span>
                                    {alimentoComida.preparacion && (
                                      <>
                                        <span className="text-gray-400">•</span>
                                        <span className="italic">{alimentoComida.preparacion}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-4">
                                {/* Info nutricional */}
                                <div className="grid grid-cols-4 gap-3 text-center text-xs">
                                  <div>
                                    <div className="font-bold text-blue-600">{Math.round(alimentoComida.calorias ?? 0)}</div>
                                    <div className="text-gray-500">cal</div>
                                  </div>
                                  <div>
                                    <div className="font-bold text-green-600">{Math.round(alimentoComida.proteinas ?? 0)}g</div>
                                    <div className="text-gray-500">prot</div>
                                  </div>
                                  <div>
                                    <div className="font-bold text-amber-600">{Math.round(alimentoComida.carbohidratos ?? 0)}g</div>
                                    <div className="text-gray-500">carb</div>
                                  </div>
                                  <div>
                                    <div className="font-bold text-purple-600">{Math.round(alimentoComida.grasas ?? 0)}g</div>
                                    <div className="text-gray-500">gras</div>
                                  </div>
                                </div>
                                
                                {/* Botones de acción */}
                                <div className="flex space-x-1">
                                  <button 
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                                    title="Editar"
                                    onClick={() => handleEditarAlimento(alimentoComida)}
                                  >
                                    ✏️
                                  </button>
                                  <button 
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50" 
                                    title="Eliminar"
                                    disabled={eliminandoAlimento === alimentoComida.id}
                                    onClick={() => handleEliminarAlimento(alimentoComida.id)}
                                  >
                                    {eliminandoAlimento === alimentoComida.id ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                    ) : (
                                      '🗑️'
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal para agregar alimentos */}
      {modalAlimentoOpen && comidaSeleccionada && (
        <ModalAgregarAlimento
          isOpen={modalAlimentoOpen}
          onClose={handleCerrarModalAlimento}
          comidaId={comidaSeleccionada}
          pacienteId={plan.pacienteId}
          planId={plan.id}
          onSuccess={handleAlimentoAgregado}
        />
      )}

      {/* Modal para editar alimentos */}
      {modalEditarOpen && alimentoParaEditar && (
        <ModalEditarAlimento
          isOpen={modalEditarOpen}
          onClose={handleCerrarModalEditar}
          alimentoComida={alimentoParaEditar}
          pacienteId={plan.pacienteId}
          planId={plan.id}
          onSuccess={handleAlimentoEditado}
        />
      )}
    </div>
  );
}
