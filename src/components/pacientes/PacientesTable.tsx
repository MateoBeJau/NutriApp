// components/pacientes/PacientesTable.tsx
import { Eye, Edit, Trash2, Phone, Mail, Calendar, Ruler, User } from "lucide-react";
import Link from "next/link";

type PacienteRow = {
  id: string;
  nombre: string;
  apellido: string;
  email?: string | null;
  telefono?: string | null;
  fechaNacimiento?: Date | string | null;
  sexo?: "F" | "M" | "O" | "" | null;
  alturaCm?: number | null;
  notas?: string | null;
  // campos de auditoría opcionales
  creadoEn?: Date | string;
  actualizadoEn?: Date | string;
};

export default function PacientesTable({ pacientes }: { pacientes: PacienteRow[]  }) {
  if (!pacientes.length) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <User className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pacientes</h3>
        <p className="text-gray-600 mb-6">Comienza agregando tu primer paciente para gestionar su información nutricional</p>
        <Link
          href="/pacientes/nuevo"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Agregar primer paciente
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Información
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pacientes.map((p) => {
              const fecha = p.fechaNacimiento ? formatDate(p.fechaNacimiento) : null;
              const edad = fecha ? calculateAge(p.fechaNacimiento!) : null; // Usar ! para asegurar que no es null
              const sexo = p.sexo ? getSexoLabel(p.sexo) : null;
              const altura = p.alturaCm ? `${p.alturaCm} cm` : null;

              return (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  {/* Información del paciente */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">
                            {p.nombre.charAt(0)}{p.apellido.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {p.nombre} {p.apellido}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {p.id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contacto */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {p.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate max-w-48">{p.email}</span>
                        </div>
                      )}
                      {p.telefono && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{p.telefono}</span>
                        </div>
                      )}
                      {!p.email && !p.telefono && (
                        <span className="text-sm text-gray-400">Sin contacto</span>
                      )}
                    </div>
                  </td>

                  {/* Información médica */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {fecha && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{fecha}</span>
                          {edad && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {edad} años
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        {sexo && (
                          <span className="text-sm text-gray-600">{sexo}</span>
                        )}
                        {altura && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Ruler className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{altura}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/pacientes/${p.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        title="Ver detalles"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      <Link
                        href={`/dashboard/pacientes/${p.id}/editar`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        title="Editar paciente"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled
                        title="Próximamente"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("es-UY", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

function calculateAge(fechaNacimiento: Date | string): number {
  const fecha = typeof fechaNacimiento === "string" ? new Date(fechaNacimiento) : fechaNacimiento;
  if (isNaN(fecha.getTime())) return 0;
  
  const hoy = new Date();
  let edad = hoy.getFullYear() - fecha.getFullYear();
  const mes = hoy.getMonth() - fecha.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
    edad--;
  }
  
  return edad;
}

function getSexoLabel(sexo: string): string {
  switch (sexo) {
    case "F": return "Femenino";
    case "M": return "Masculino";
    case "O": return "Otro";
    default: return sexo;
  }
}
