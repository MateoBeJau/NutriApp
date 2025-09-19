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
      color: "bg-blue-500",
      href: "/dashboard/pacientes"
    },
    {
      name: "Consultas Hoy",
      value: 0,
      icon: Calendar,
      color: "bg-green-500",
      href: "/dashboard/agenda"
    },
    {
      name: "Planes Activos",
      value: 0,
      icon: FileText,
      color: "bg-yellow-500",
      href: "/dashboard/planes"
    },
    {
      name: "Crecimiento",
      value: "+12%",
      icon: TrendingUp,
      color: "bg-purple-500",
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow hover:shadow-md transition-shadow"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </dd>
          </Link>
        ))}
      </div>

      {/* Recent Patients */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Pacientes Recientes
          </h3>
          {pacientes.length > 0 ? (
            <div className="space-y-3">
              {pacientes.slice(0, 5).map((paciente: any) => (
                <div
                  key={paciente.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {paciente.nombre} {paciente.apellido}
                      </p>
                      <p className="text-sm text-gray-500">{paciente.email}</p>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/pacientes/${paciente.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Ver perfil
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay pacientes registrados</p>
              <Link
                href="/dashboard/pacientes/nuevo"
                className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
