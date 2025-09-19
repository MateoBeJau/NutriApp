"use client";

import { useState, useEffect, useCallback } from "react";
import { getPerfilMedicoAction, updatePerfilMedicoAction } from "@/app/dashboard/pacientes/actions";
import { Edit, Save, X, Heart, HeartOff, AlertTriangle, Pill, Target, FileText, Utensils } from "lucide-react";

interface PerfilMedicoSectionProps {
  pacienteId: string;
  usuarioId: string; // ✅ AGREGAR: usuarioId como prop
}

interface PerfilMedico {
  id: string;
  gustos?: string | null;
  disgustos?: string | null;
  alergias?: string | null;
  enfermedades?: string | null;
  medicamentos?: string | null;
  restricciones?: string | null;
  objetivos?: string | null;
  observaciones?: string | null;
}

export default function PerfilMedicoSection({ pacienteId, usuarioId }: PerfilMedicoSectionProps) {
  const [perfil, setPerfil] = useState<PerfilMedico | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    gustos: "",
    disgustos: "",
    alergias: "",
    enfermedades: "",
    medicamentos: "",
    restricciones: "",
    objetivos: "",
    observaciones: "",
  });

  // ✅ OPTIMIZACIÓN: useCallback para evitar re-renders innecesarios
  const loadPerfil = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const result = await getPerfilMedicoAction(pacienteId, usuarioId); // ✅ CORREGIDO: usar usuarioId real
      
      if (result.success && result.data) {
        setPerfil(result.data);
        setFormData({
          gustos: result.data.gustos || "",
          disgustos: result.data.disgustos || "",
          alergias: result.data.alergias || "",
          enfermedades: result.data.enfermedades || "",
          medicamentos: result.data.medicamentos || "",
          restricciones: result.data.restricciones || "",
          objetivos: result.data.objetivos || "",
          observaciones: result.data.observaciones || "",
        });
      } else {
        setPerfil(null);
        setFormData({
          gustos: "",
          disgustos: "",
          alergias: "",
          enfermedades: "",
          medicamentos: "",
          restricciones: "",
          objetivos: "",
          observaciones: "",
        });
      }
    } catch (error) {
      console.error("Error loading perfil:", error);
      setPerfil(null);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [pacienteId, usuarioId]); // ✅ CORREGIDO: agregar usuarioId a las dependencias

  useEffect(() => {
    loadPerfil();
  }, [loadPerfil]);

  // ✅ OPTIMIZACIÓN: useCallback para evitar re-renders
  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      const result = await updatePerfilMedicoAction(pacienteId, formData);
      
      if (result.success && result.data) {
        // ✅ CORREGIDO: Recargar datos desde el servidor después de guardar (sin mostrar loading)
        await loadPerfil(false);
        setIsEditing(false);
      } else {
        console.error("Error guardando perfil:", result.error);
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
    } finally {
      setSaving(false);
    }
  }, [pacienteId, formData, loadPerfil]);

  // ✅ OPTIMIZACIÓN: useCallback para evitar re-renders
  const handleCancel = useCallback(() => {
    if (perfil) {
      setFormData({
        gustos: perfil.gustos || "",
        disgustos: perfil.disgustos || "",
        alergias: perfil.alergias || "",
        enfermedades: perfil.enfermedades || "",
        medicamentos: perfil.medicamentos || "",
        restricciones: perfil.restricciones || "",
        objetivos: perfil.objetivos || "",
        observaciones: perfil.observaciones || "",
      });
    } else {
      setFormData({
        gustos: "",
        disgustos: "",
        alergias: "",
        enfermedades: "",
        medicamentos: "",
        restricciones: "",
        objetivos: "",
        observaciones: "",
      });
    }
    setIsEditing(false);
  }, [perfil]);

  // ✅ OPTIMIZACIÓN: Memoizar handlers de input
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Perfil Médico</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            {perfil ? "Editar" : "Crear Perfil"}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preferencias Alimentarias */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Utensils className="h-5 w-5 text-green-600" />
            Preferencias Alimentarias
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gustos
              </label>
              {isEditing ? (
                <textarea
                  value={formData.gustos}
                  onChange={(e) => handleInputChange('gustos', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Comidas que le gustan..."
                />
              ) : (
                <p className="text-gray-600 bg-gray-50 p-3 rounded-md min-h-[60px]">
                  {perfil?.gustos || "No especificado"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disgustos
              </label>
              {isEditing ? (
                <textarea
                  value={formData.disgustos}
                  onChange={(e) => handleInputChange('disgustos', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Comidas que no le gustan..."
                />
              ) : (
                <p className="text-gray-600 bg-gray-50 p-3 rounded-md min-h-[60px]">
                  {perfil?.disgustos || "No especificado"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Información Médica */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Información Médica
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alergias
              </label>
              {isEditing ? (
                <textarea
                  value={formData.alergias}
                  onChange={(e) => handleInputChange('alergias', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Alergias alimentarias o ambientales..."
                />
              ) : (
                <p className="text-gray-600 bg-gray-50 p-3 rounded-md min-h-[60px]">
                  {perfil?.alergias || "No especificado"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enfermedades
              </label>
              {isEditing ? (
                <textarea
                  value={formData.enfermedades}
                  onChange={(e) => handleInputChange('enfermedades', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Condiciones médicas existentes..."
                />
              ) : (
                <p className="text-gray-600 bg-gray-50 p-3 rounded-md min-h-[60px]">
                  {perfil?.enfermedades || "No especificado"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medicamentos
              </label>
              {isEditing ? (
                <textarea
                  value={formData.medicamentos}
                  onChange={(e) => handleInputChange('medicamentos', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Medicamentos que toma actualmente..."
                />
              ) : (
                <p className="text-gray-600 bg-gray-50 p-3 rounded-md min-h-[60px]">
                  {perfil?.medicamentos || "No especificado"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Información Adicional
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restricciones Dietéticas
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.restricciones}
                  onChange={(e) => handleInputChange('restricciones', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Vegano, sin gluten, etc..."
                />
              ) : (
                <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
                  {perfil?.restricciones || "No especificado"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objetivos
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.objetivos}
                  onChange={(e) => handleInputChange('objetivos', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bajar peso, ganar masa muscular..."
                />
              ) : (
                <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
                  {perfil?.objetivos || "No especificado"}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            {isEditing ? (
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Notas adicionales del nutricionista..."
              />
            ) : (
              <p className="text-gray-600 bg-gray-50 p-3 rounded-md min-h-[80px]">
                {perfil?.observaciones || "No especificado"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}