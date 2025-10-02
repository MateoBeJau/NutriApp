"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearPlanNutricionalAction } from "@/app/dashboard/planes/actions";
import Link from 'next/link';

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  email?: string | null;
  telefono?: string | null;
}

interface Props {
  pacientes: Paciente[];
}

export default function FormularioNuevoPlan({ pacientes }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaciente, setSelectedPaciente] = useState<string>("");
  const [tipoPlan, setTipoPlan] = useState<string>("MANUAL");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const res = await crearPlanNutricionalAction(formData);

    if (res.success && res.data) { // ✅ Verificar que data existe
      // Redirigir al plan creado
      router.push(`/dashboard/planes/${res.data.id}`);
    } else {
      setError(res.error || "Error al crear el plan nutricional");
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

        {/* Selección de Paciente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paciente *
          </label>
          <select
            name="pacienteId"
            value={selectedPaciente}
            onChange={(e) => setSelectedPaciente(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar paciente</option>
            {pacientes.map((paciente) => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nombre} {paciente.apellido}
              </option>
            ))}
          </select>
          {pacientes.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              No hay pacientes activos.{' '}
              <Link href="/dashboard/pacientes/nuevo" className="text-blue-600 hover:text-blue-800">
                Crear paciente
              </Link>
            </p>
          )}
        </div>

        {/* Información básica del plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Plan *
            </label>
            <input
              type="text"
              name="nombre"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Plan de pérdida de peso - Enero 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Plan
            </label>
            <select
              name="tipo"
              value={tipoPlan}
              onChange={(e) => setTipoPlan(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="MANUAL">Manual</option>
              <option value="GENERADO_IA">Generado con IA (próximamente)</option>
            </select>
          </div>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Inicio *
            </label>
            <input
              type="date"
              name="fechaInicio"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Fin (opcional)
            </label>
            <input
              type="date"
              name="fechaFin"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            name="descripcion"
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe los objetivos y características principales del plan..."
          />
        </div>

        {/* Objetivos nutricionales */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Objetivos Nutricionales (opcional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calorías diarias
              </label>
              <input
                type="number"
                name="caloriasObjetivo"
                min="0"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="2000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proteínas (g)
              </label>
              <input
                type="number"
                name="proteinasObjetivo"
                min="0"
                step="0.1"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carbohidratos (g)
              </label>
              <input
                type="number"
                name="carbohidratosObjetivo"
                min="0"
                step="0.1"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="250"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grasas (g)
              </label>
              <input
                type="number"
                name="grasasObjetivo"
                min="0"
                step="0.1"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="65"
              />
            </div>
          </div>
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas del Nutricionista
          </label>
          <textarea
            name="notas"
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Consideraciones especiales, instrucciones adicionales..."
          />
        </div>

        {/* Generación con IA (deshabilitado por ahora) */}
        {tipoPlan === "GENERADO_IA" && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Generación con IA (Próximamente)
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Esta funcionalidad estará disponible próximamente. Por ahora, puedes crear planes manualmente.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
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
            disabled={submitting || tipoPlan === "GENERADO_IA"}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Creando..." : "Crear Plan"}
          </button>
        </div>
      </form>
    </div>
  );
}
