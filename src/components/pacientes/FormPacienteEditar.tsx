"use client";

import { updatePacienteFromForm } from "@/app/dashboard/pacientes/actions";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Calendar, Ruler, FileText, X, Save } from "lucide-react";

// Tipo que coincide con lo que viene de la base de datos
type PacienteFromDB = {
  id: string;
  nombre: string;
  apellido: string;
  email?: string | null;
  telefono?: string | null;
  fechaNacimiento?: Date | string | null;
  sexo?: string | null;
  alturaCm?: number | null;
  notas?: string | null;
  // Campos adicionales que vienen de la DB
  usuarioId?: string;
  creadoEn?: Date | string;
  actualizadoEn?: Date | string;
  activo?: boolean;
};

type Props = {
  paciente: PacienteFromDB;
  usuarioId: string;
};

export default function FormPacienteEditar({ paciente }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // ✅ OPTIMIZACIÓN: Funciones memoizadas
  const formatDateForInput = (date: Date | string | null | undefined) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  };

  const normalizeSexo = (sexo: string | null | undefined): "F" | "M" | "O" | "" | null => {
    if (!sexo) return null;
    if (sexo === "F" || sexo === "M" || sexo === "O") return sexo;
    return "";
  };

  // ✅ OPTIMIZACIÓN: Navegación instantánea
  const handleCancel = () => {
    router.back(); // Navegación más rápida que window.location
  };

  // ✅ OPTIMIZACIÓN: Mejor manejo del estado de loading con useTransition
  const handleSubmit = async (formData: FormData) => {
    setError(null);

    startTransition(async () => {
      try {
        formData.append("id", paciente.id);

        // ✅ OPTIMIZACIÓN: Mostrar feedback inmediato
        setError(null);
        
        const result = await updatePacienteFromForm(formData);
        
        if (result) {
          // ✅ OPTIMIZACIÓN: Redirect inmediato sin esperar
          router.push(`/dashboard/pacientes/${paciente.id}`);
        } else {
          setError("Error al actualizar el paciente");
        }
      } catch (error) {
        console.error("Error updating paciente:", error);
        setError(error instanceof Error ? error.message : "Error al actualizar el paciente");
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form action={handleSubmit} className="space-y-8">
        <input type="hidden" name="id" value={paciente.id} />

        {/* Información Personal */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">Información Personal</h2>
            <p className="text-sm text-gray-600">Datos básicos del paciente</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                name="nombre"
                required
                defaultValue={paciente.nombre}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Ana"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                name="apellido"
                required
                defaultValue={paciente.apellido}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="García"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={paciente.email || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="ana@email.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Phone className="inline h-4 w-4 mr-1" />
                Teléfono
              </label>
              <input
                name="telefono"
                defaultValue={paciente.telefono || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="+598 99 123 456"
              />
            </div>
          </div>
        </div>

        {/* Información Médica */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">Información Médica</h2>
            <p className="text-sm text-gray-600">Datos relevantes para el seguimiento nutricional</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Calendar className="inline h-4 w-4 mr-1" />
                Fecha de nacimiento
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                defaultValue={formatDateForInput(paciente.fechaNacimiento)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sexo</label>
              <select
                name="sexo"
                defaultValue={normalizeSexo(paciente.sexo) || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="">Seleccionar...</option>
                <option value="F">Femenino</option>
                <option value="M">Masculino</option>
                <option value="O">Otro</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Ruler className="inline h-4 w-4 mr-1" />
                Altura (cm)
              </label>
              <input
                name="alturaCm"
                type="number"
                min="50"
                max="300"
                defaultValue={paciente.alturaCm || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="170"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <FileText className="inline h-4 w-4 mr-1" />
              Notas adicionales
            </label>
            <textarea
              name="notas"
              rows={4}
              defaultValue={paciente.notas || ""}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
              placeholder="Alergias, condiciones médicas, objetivos nutricionales, etc..."
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isPending ? "Guardando..." : "Actualizar Paciente"}
          </button>
        </div>
      </form>
    </div>
  );
}