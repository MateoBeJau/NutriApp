import { requireAuth } from "@/lib/auth";
import { listPacientesAction } from "./pacientes/actions";
import { Users, Calendar, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireAuth();
  const { items: pacientes } = await listPacientesAction(user.id);

  const stats = [
    {
      name: "Total Pacientes",
      value: pacientes.length,
      icon: Users,
      href: "/dashboard/pacientes"
    },
    {
      name: "Consultas Hoy",
      value: 0,
      icon: Calendar,
      href: "/dashboard/agenda"
    },
    {
      name: "Planes Activos",
      value: 0,
      icon: FileText,
      href: "/dashboard/planes"
    },
    {
      name: "Crecimiento",
      value: "+12%",
      icon: TrendingUp,
      href: "/dashboard/reportes"
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Bienvenido de vuelta, {user.nombre || user.email}
        </p>
      </div>

      {/* Stats Grid - Diseño Minimalista */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                <stat.icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-b-xl group-hover:from-gray-200 group-hover:to-gray-300 transition-colors"></div>
          </Link>
        ))}
      </div>

      {/* Recent Patients - Diseño Minimalista */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-5 h-5">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900">Pacientes recientes</h3>
            </div>
            <Link
              href="/dashboard/pacientes"
              className="text-xs text-gray-500 hover:text-gray-700 font-medium"
            >
              Ver todos →
            </Link>
          </div>

          {pacientes.length > 0 ? (
            <div className="space-y-3">
              {pacientes.slice(0, 5).map((paciente) => (
                <div
                  key={paciente.id}
                  className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {paciente.nombre.charAt(0)}{paciente.apellido.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {paciente.nombre} {paciente.apellido}
                      </p>
                      {paciente.email && (
                        <p className="text-xs text-gray-500 truncate">{paciente.email}</p>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/pacientes/${paciente.id}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 hover:text-gray-600 font-medium"
                  >
                    Ver →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mb-4">Sin pacientes registrados</p>
              <Link
                href="/dashboard/pacientes/nuevo"
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
              >
                Agregar primer paciente
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
