"use client";

import { useState, useEffect } from "react";
import { createMedicionAction, updateMedicionAction, deleteMedicionAction, getMedicionesAction } from "@/app/dashboard/pacientes/actions";
import { Edit, Save, X, Plus, Trash2, Scale, Ruler, Activity, Calendar } from "lucide-react";

interface MedicionesSectionProps {
  pacienteId: string;
  initialMediciones?: Medicion[]; // ✅ CORREGIDO: Usar tipo específico en lugar de any[]
}

interface Medicion {
  id: string;
  fecha: Date;
  pesoKg?: number | null;
  alturaCm?: number | null;
  imc?: number | null;
  notas?: string | null;
  creadoEn: Date;
}

export default function MedicionesSection({ pacienteId, initialMediciones = [] }: MedicionesSectionProps) {
  const [mediciones, setMediciones] = useState<Medicion[]>(initialMediciones);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    pesoKg: "",
    alturaCm: "",
    imc: "",
    notas: "",
  });

  // ✅ CORREGIDO: Usar server action en lugar de fetch
  const loadMediciones = async () => {
    try {
      const result = await getMedicionesAction(pacienteId, "current-user-id");
      if (result.success && result.data) {
        setMediciones(result.data);
      }
    } catch (error) {
      console.error("Error loading mediciones:", error);
    }
  };

  const handleCreate = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      pesoKg: "",
      alturaCm: "",
      imc: "",
      notas: "",
    });
    setIsCreating(true);
    setIsEditing(true);
  };

  const handleEdit = (medicion: Medicion) => {
    setFormData({
      fecha: new Date(medicion.fecha).toISOString().split('T')[0],
      pesoKg: medicion.pesoKg?.toString() || "",
      alturaCm: medicion.alturaCm?.toString() || "",
      imc: medicion.imc?.toString() || "",
      notas: medicion.notas || "",
    });
    setEditingId(medicion.id);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (isCreating) {
        const result = await createMedicionAction(pacienteId, formData);
        if (result.success) {
          await loadMediciones(); // Recargar después de crear
          setIsCreating(false);
          setIsEditing(false);
        }
      } else if (editingId) {
        const result = await updateMedicionAction(editingId, formData);
        if (result.success) {
          await loadMediciones(); // Recargar después de editar
          setEditingId(null);
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error("Error saving medicion:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setIsEditing(false);
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      pesoKg: "",
      alturaCm: "",
      imc: "",
      notas: "",
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta medición?")) {
      try {
        const result = await deleteMedicionAction(id, pacienteId);
        if (result.success) {
          await loadMediciones(); // Recargar después de eliminar
        }
      } catch (error) {
        console.error("Error deleting medicion:", error);
      }
    }
  };

  const calculateIMC = (peso: number, altura: number) => {
    const alturaEnMetros = altura / 100;
    return (peso / (alturaEnMetros * alturaEnMetros)).toFixed(1);
  };

  const handlePesoChange = (value: string) => {
    const peso = parseFloat(value);
    const altura = parseFloat(formData.alturaCm);
    
    setFormData(prev => ({
      ...prev,
      pesoKg: value,
      imc: (peso && altura) ? calculateIMC(peso, altura) : ""
    }));
  };

  const handleAlturaChange = (value: string) => {
    const altura = parseFloat(value);
    const peso = parseFloat(formData.pesoKg);
    
    setFormData(prev => ({
      ...prev,
      alturaCm: value,
      imc: (peso && altura) ? calculateIMC(peso, altura) : ""
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mediciones</h2>
        {!isEditing && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nueva Medición
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {isCreating ? "Nueva Medición" : "Editar Medición"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.pesoKg}
                onChange={(e) => handlePesoChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="70.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Altura (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.alturaCm}
                onChange={(e) => handleAlturaChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="175.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IMC
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.imc}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                placeholder="22.5"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Notas adicionales sobre la medición..."
            />
          </div>

          <div className="flex gap-2 mt-4">
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
        </div>
      )}

      <div className="space-y-4">
        {mediciones.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Scale className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay mediciones registradas</p>
          </div>
        ) : (
          mediciones.map((medicion) => (
            <div key={medicion.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(medicion.fecha).toLocaleDateString()}</span>
                  </div>
                  
                  {medicion.pesoKg && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Scale className="h-4 w-4" />
                      <span>{medicion.pesoKg} kg</span>
                    </div>
                  )}
                  
                  {medicion.alturaCm && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Ruler className="h-4 w-4" />
                      <span>{medicion.alturaCm} cm</span>
                    </div>
                  )}
                  
                  {medicion.imc && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Activity className="h-4 w-4" />
                      <span>IMC: {medicion.imc}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(medicion)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(medicion.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {medicion.notas && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>{medicion.notas}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
