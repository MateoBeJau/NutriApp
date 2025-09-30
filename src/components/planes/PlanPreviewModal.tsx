'use client';

import { useState, useEffect } from 'react';

interface PlanPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (editedPlanData: any) => void;
  planData: any;
  isLoading?: boolean;
}

export default function PlanPreviewModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  planData, 
  isLoading = false 
}: PlanPreviewModalProps) {
  const [editedPlan, setEditedPlan] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (planData) {
      setEditedPlan(JSON.parse(JSON.stringify(planData))); // Deep copy
    }
  }, [planData]);

  if (!isOpen) return null;

  const handleSave = () => {
    onConfirm(editedPlan);
  };

  const updatePlanField = (field: string, value: any) => {
    setEditedPlan((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const updateComidaField = (comidaIndex: number, field: string, value: any) => {
    setEditedPlan((prev: any) => ({
      ...prev,
      comidas: prev.comidas.map((comida: any, index: number) => 
        index === comidaIndex ? { ...comida, [field]: value } : comida
      )
    }));
  };

  const updateAlimentoField = (comidaIndex: number, alimentoIndex: number, field: string, value: any) => {
    setEditedPlan((prev: any) => ({
      ...prev,
      comidas: prev.comidas.map((comida: any, cIndex: number) => 
        cIndex === comidaIndex ? {
          ...comida,
          alimentos: comida.alimentos.map((alimento: any, aIndex: number) => 
            aIndex === alimentoIndex ? { ...alimento, [field]: value } : alimento
          )
        } : comida
      )
    }));
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Vista Previa del Plan Nutricional</h2>
            <p className="text-sm text-gray-600 mt-1">
              Revisa y edita el plan generado por IA antes de guardarlo
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isEditing 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              {isEditing ? (
                <>
                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Vista
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Generando plan con IA...</p>
          </div>
        ) : (
          <div className="px-8 py-6 space-y-6">
            {/* Información básica del plan */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Información del Plan
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Nombre:</strong>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedPlan?.nombre || ''}
                      onChange={(e) => updatePlanField('nombre', e.target.value)}
                      className="ml-2 px-2 py-1 border rounded w-full"
                    />
                  ) : (
                    <span className="ml-2">{editedPlan?.nombre || 'N/A'}</span>
                  )}
                </div>
                <div>
                  <strong>Descripción:</strong>
                  {isEditing ? (
                    <textarea
                      value={editedPlan?.descripcion || ''}
                      onChange={(e) => updatePlanField('descripcion', e.target.value)}
                      className="ml-2 px-2 py-1 border rounded w-full h-20"
                    />
                  ) : (
                    <span className="ml-2">{editedPlan?.descripcion || 'N/A'}</span>
                  )}
                </div>
                <div>
                  <strong>Calorías Objetivo:</strong>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedPlan?.caloriasObjetivo || ''}
                      onChange={(e) => updatePlanField('caloriasObjetivo', Number(e.target.value))}
                      className="ml-2 px-2 py-1 border rounded w-full"
                    />
                  ) : (
                    <span className="ml-2">{editedPlan?.caloriasObjetivo || 'N/A'}</span>
                  )}
                </div>
                <div>
                  <strong>Proteínas Objetivo:</strong>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedPlan?.proteinasObjetivo || ''}
                      onChange={(e) => updatePlanField('proteinasObjetivo', Number(e.target.value))}
                      className="ml-2 px-2 py-1 border rounded w-full"
                    />
                  ) : (
                    <span className="ml-2">{editedPlan?.proteinasObjetivo || 'N/A'}g</span>
                  )}
                </div>
                <div>
                  <strong>Carbohidratos Objetivo:</strong>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedPlan?.carbohidratosObjetivo || ''}
                      onChange={(e) => updatePlanField('carbohidratosObjetivo', Number(e.target.value))}
                      className="ml-2 px-2 py-1 border rounded w-full"
                    />
                  ) : (
                    <span className="ml-2">{editedPlan?.carbohidratosObjetivo || 'N/A'}g</span>
                  )}
                </div>
                <div>
                  <strong>Grasas Objetivo:</strong>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedPlan?.grasasObjetivo || ''}
                      onChange={(e) => updatePlanField('grasasObjetivo', Number(e.target.value))}
                      className="ml-2 px-2 py-1 border rounded w-full"
                    />
                  ) : (
                    <span className="ml-2">{editedPlan?.grasasObjetivo || 'N/A'}g</span>
                  )}
                </div>
              </div>
            </div>

            {/* Comidas */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                Comidas del Plan
              </h3>
              <div className="space-y-4">
                {editedPlan?.comidas?.map((comida: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={comida.nombre}
                              onChange={(e) => updateComidaField(index, 'nombre', e.target.value)}
                              className="font-semibold text-lg px-2 py-1 border rounded w-full"
                            />
                            <div className="flex gap-2">
                              <select
                                value={comida.tipo}
                                onChange={(e) => updateComidaField(index, 'tipo', e.target.value)}
                                className="text-sm px-2 py-1 border rounded"
                              >
                                <option value="DESAYUNO">Desayuno</option>
                                <option value="MEDIA_MANANA">Media Mañana</option>
                                <option value="ALMUERZO">Almuerzo</option>
                                <option value="MERIENDA">Merienda</option>
                                <option value="CENA">Cena</option>
                                <option value="COLACION_NOCTURNA">Colación Nocturna</option>
                              </select>
                              <input
                                type="time"
                                value={comida.horaRecomendada || ''}
                                onChange={(e) => updateComidaField(index, 'horaRecomendada', e.target.value)}
                                className="text-sm px-2 py-1 border rounded"
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-semibold text-lg">{comida.nombre}</h4>
                            <p className="text-sm text-gray-600">
                              {comida.tipo} - {comida.horaRecomendada}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <div>Calorías: {comida.caloriasTotal?.toFixed(1) || 'N/A'}</div>
                        <div>Proteínas: {comida.proteinasTotal?.toFixed(1) || 'N/A'}g</div>
                        <div>Carbohidratos: {comida.carbohidratosTotal?.toFixed(1) || 'N/A'}g</div>
                        <div>Grasas: {comida.grasasTotal?.toFixed(1) || 'N/A'}g</div>
                      </div>
                    </div>
                    
                    {isEditing ? (
                      <textarea
                        value={comida.descripcion || ''}
                        onChange={(e) => updateComidaField(index, 'descripcion', e.target.value)}
                        placeholder="Descripción de la comida..."
                        className="w-full px-2 py-1 border rounded text-sm text-gray-600 mb-2"
                      />
                    ) : (
                      comida.descripcion && (
                        <p className="text-sm text-gray-600 mb-2">{comida.descripcion}</p>
                      )
                    )}

                    <div>
                      <h5 className="font-medium mb-2">Alimentos:</h5>
                      <div className="space-y-2">
                        {comida.alimentos?.map((alimento: any, alimentoIndex: number) => (
                          <div key={alimentoIndex} className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg text-sm border border-gray-200">
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                {isEditing ? (
                                  <div className="space-y-1">
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        value={alimento.alimento?.nombre}
                                        onChange={(e) => updateAlimentoField(index, alimentoIndex, 'alimento', {
                                          ...alimento.alimento,
                                          nombre: e.target.value
                                        })}
                                        className="font-semibold px-2 py-1 border rounded flex-1"
                                      />
                                      <input
                                        type="number"
                                        value={alimento.cantidad}
                                        onChange={(e) => updateAlimentoField(index, alimentoIndex, 'cantidad', Number(e.target.value))}
                                        className="px-2 py-1 border rounded w-20"
                                        step="0.1"
                                      />
                                      <input
                                        type="text"
                                        value={alimento.unidad}
                                        onChange={(e) => updateAlimentoField(index, alimentoIndex, 'unidad', e.target.value)}
                                        className="px-2 py-1 border rounded w-24"
                                      />
                                    </div>
                                    <input
                                      type="text"
                                      value={alimento.preparacion || ''}
                                      onChange={(e) => updateAlimentoField(index, alimentoIndex, 'preparacion', e.target.value)}
                                      placeholder="Preparación..."
                                      className="w-full px-2 py-1 border rounded text-xs"
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <strong>{alimento.alimento?.nombre}</strong>
                                    <span className="ml-2 text-gray-600">
                                      {alimento.cantidad} {alimento.unidad}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {!isEditing && (
                                <div className="text-right text-xs text-gray-500">
                                  <div>Cal: {alimento.alimento?.caloriasPor100g || 'N/A'}/100g</div>
                                  <div>Prot: {alimento.alimento?.proteinasPor100g || 'N/A'}g/100g</div>
                                </div>
                              )}
                            </div>
                            {!isEditing && alimento.preparacion && (
                              <div className="text-xs text-gray-500 mt-1">
                                Preparación: {alimento.preparacion}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadatos */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Metadatos del Plan
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Modelo IA:</strong> {planData?.modeloIA || 'N/A'}
                </div>
                <div>
                  <strong>Restricciones:</strong> {planData?.restriccionesAplicadas || 'N/A'}
                </div>
                <div className="col-span-2">
                  <strong>Observaciones:</strong> {planData?.observaciones || 'N/A'}
                </div>
              </div>
            </div>

            {/* Datos raw para debugging */}
            <details className="bg-gray-100 p-4 rounded-lg">
              <summary className="cursor-pointer font-medium">Ver datos raw (debug)</summary>
              <pre className="mt-2 text-xs overflow-auto max-h-40 bg-white p-2 rounded border">
                {JSON.stringify(planData, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Botones de acción */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-6 rounded-b-2xl">
          <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !editedPlan}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirmar y Guardar
              </>
            )}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
