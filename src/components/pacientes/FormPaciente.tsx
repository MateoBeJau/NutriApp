"use client";

import { createPacienteFromForm } from "@/app/pacientes/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Phone, Calendar, Ruler, FileText, X, Save } from "lucide-react";

type Props = {
  usuarioId: string;
};

export default function FormPaciente({ usuarioId }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <UserPlus className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Paciente</h1>
        </div>
        <p className="text-gray-600">Completa la información del paciente para agregarlo a tu lista</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form
          action={async (formData) => {
            setSubmitting(true);
            try {
              await createPacienteFromForm(formData);
              router.push("/pacientes");
            } finally {
              setSubmitting(false);
            }
          }}
          className="space-y-8"
        >
          <input type="hidden" name="usuarioId" value={usuarioId} />

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
                <div className="relative">
                  <input
                    name="nombre"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Ana"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="apellido"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="García"
                  />
                </div>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Sexo</label>
                <select
                  name="sexo"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                placeholder="Alergias, condiciones médicas, objetivos nutricionales, etc..."
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push("/pacientes")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {submitting ? "Guardando..." : "Guardar Paciente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
