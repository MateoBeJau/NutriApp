"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlanNutricionalCompleto } from "@/types/planes";
import { actualizarPlanNutricionalAction } from "@/app/dashboard/planes/actions";

export default function FormularioEditarPlan({ plan }: { plan: PlanNutricionalCompleto }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    formData.set("planId", plan.id);
    const res = await actualizarPlanNutricionalAction(formData);
    if (res.success) {
      router.push(`/dashboard/planes/${plan.id}`);
    } else {
      setError(res.error || "Error al actualizar el plan nutricional");
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800 text-sm">{error}</div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Plan *</label>
            <input
              type="text"
              name="nombre"
              required
              defaultValue={plan.nombre}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Plan de pérdida de peso - Enero 2024"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Plan</label>
            <select
              name="tipo"
              defaultValue={plan.tipo}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="MANUAL">Manual</option>
              <option value="GENERADO_IA">Generado con IA (próximamente)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio *</label>
            <input
              type="date"
              name="fechaInicio"
              required
              defaultValue={plan.fechaInicio ? new Date(plan.fechaInicio).toISOString().split('T')[0] : ""}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin (opcional)</label>
            <input
              type="date"
              name="fechaFin"
              defaultValue={plan.fechaFin ? new Date(plan.fechaFin).toISOString().split('T')[0] : ""}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea
            name="descripcion"
            rows={3}
            defaultValue={plan.descripcion || ""}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe los objetivos y características principales del plan..."
          />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Objetivos Nutricionales (opcional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calorías diarias</label>
              <input
                type="number"
                name="caloriasObjetivo"
                min="0"
                defaultValue={plan.caloriasObjetivo || ""}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="2000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proteínas (g)</label>
              <input
                type="number"
                name="proteinasObjetivo"
                min="0"
                step="0.1"
                defaultValue={plan.proteinasObjetivo || ""}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Carbohidratos (g)</label>
              <input
                type="number"
                name="carbohidratosObjetivo"
                min="0"
                step="0.1"
                defaultValue={plan.carbohidratosObjetivo || ""}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="250"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grasas (g)</label>
              <input
                type="number"
                name="grasasObjetivo"
                min="0"
                step="0.1"
                defaultValue={plan.grasasObjetivo || ""}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="65"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notas del Nutricionista</label>
          <textarea
            name="notas"
            rows={3}
            defaultValue={plan.notas || ""}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Consideraciones especiales, instrucciones adicionales..."
          />
        </div>
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
