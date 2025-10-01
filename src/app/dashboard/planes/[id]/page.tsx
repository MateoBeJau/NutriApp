import { obtenerPlanNutricionalAction } from "../actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { ESTADOS_PLAN_LABELS, TIPOS_PLAN_LABELS } from "@/types/planes";
import ComponentePlanDetalle from "@/components/planes/ComponentePlanDetalle";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PlanDetallePage({ params }: Props) {
  noStore(); // Desactivar cache para siempre obtener datos frescos
  
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const { id } = await params;
  const planRes = await obtenerPlanNutricionalAction(id);
  
  if (!planRes.success) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            Error: {planRes.error || "Plan nutricional no encontrado"}
          </div>
        </div>
      </div>
    );
  }

  const planData = planRes.data;
  
  if (!planData) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            Error: Plan nutricional no encontrado
          </div>
        </div>
      </div>
    );
  }

  // Transformar null a valores por defecto solo donde sea necesario
  const plan = planData; // Sin transformaciones

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header mejorado */}
      <div className="mb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
            🏠 Dashboard
          </Link>
          <span className="text-gray-300">/</span>
          <Link href="/dashboard/planes" className="hover:text-blue-600 transition-colors">
            📋 Planes
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium">Plan Detallado</span>
        </nav>

        {/* Header principal */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {/* Icono del plan */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                📋
              </div>
              
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{plan.nombre}</h1>
                  <span className={`inline-flex px-3 py-1.5 text-sm font-semibold rounded-full shadow-sm ${
                    plan.estado === 'ACTIVO' ? 'bg-green-100 text-green-800 border border-green-200' :
                    plan.estado === 'BORRADOR' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    plan.estado === 'PAUSADO' ? 'bg-gray-100 text-gray-800 border border-gray-200' :
                    plan.estado === 'COMPLETADO' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {ESTADOS_PLAN_LABELS[plan.estado]}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-1">👤</span>
                    <span className="font-medium">
                      {plan.paciente.nombre} {plan.paciente.apellido}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-1">📅</span>
                    <span>Inicio: {new Date(plan.fechaInicio).toLocaleDateString('es-AR')}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-1">🏷️</span>
                    <span>{TIPOS_PLAN_LABELS[plan.tipo]}</span>
                  </div>
                </div>

                {plan.descripcion && (
                  <p className="text-gray-700 mt-3 max-w-2xl">{plan.descripcion}</p>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard/planes"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200 font-medium"
              >
                ← Volver
              </Link>
              <Link
                href={`/dashboard/planes/${plan.id}/editar`}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ✏️ Editar Plan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg">🏷️</span>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipo</div>
              <div className="text-sm font-semibold text-gray-900">
                {TIPOS_PLAN_LABELS[plan.tipo]}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-lg">🍽️</span>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Comidas</div>
              <div className="text-sm font-semibold text-gray-900">
                {plan.comidas.length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-lg">🔥</span>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cal. Objetivo</div>
              <div className="text-sm font-semibold text-gray-900">
                {plan.caloriasObjetivo ?? 'No definido'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-amber-600 text-lg">📅</span>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Duración</div>
              <div className="text-sm font-semibold text-gray-900">
                {plan.fechaFin 
                  ? `${Math.ceil((new Date(plan.fechaFin).getTime() - new Date(plan.fechaInicio).getTime()) / (1000 * 60 * 60 * 24))} días`
                  : 'Indefinido'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Objetivos nutricionales */}
      {(plan.caloriasObjetivo || plan.proteinasObjetivo || plan.carbohidratosObjetivo || plan.grasasObjetivo) && (
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Objetivos Nutricionales</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {plan.caloriasObjetivo && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{plan.caloriasObjetivo}</div>
                  <div className="text-sm text-gray-500">Calorías</div>
                </div>
              )}
              {plan.proteinasObjetivo && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{plan.proteinasObjetivo}g</div>
                  <div className="text-sm text-gray-500">Proteínas</div>
                </div>
              )}
              {plan.carbohidratosObjetivo && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{plan.carbohidratosObjetivo}g</div>
                  <div className="text-sm text-gray-500">Carbohidratos</div>
                </div>
              )}
              {plan.grasasObjetivo && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{plan.grasasObjetivo}g</div>
                  <div className="text-sm text-gray-500">Grasas</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Perfil del Paciente */}
      {plan.paciente.perfilMedico && (
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Perfil Médico del Paciente</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plan.paciente.perfilMedico.alergias && (
                <div>
                  <div className="text-sm font-medium text-red-700">Alergias</div>
                  <div className="text-sm text-gray-900">{plan.paciente.perfilMedico.alergias}</div>
                </div>
              )}
              {plan.paciente.perfilMedico.restricciones && (
                <div>
                  <div className="text-sm font-medium text-orange-700">Restricciones</div>
                  <div className="text-sm text-gray-900">{plan.paciente.perfilMedico.restricciones}</div>
                </div>
              )}
              {plan.paciente.perfilMedico.enfermedades && (
                <div>
                  <div className="text-sm font-medium text-purple-700">Enfermedades</div>
                  <div className="text-sm text-gray-900">{plan.paciente.perfilMedico.enfermedades}</div>
                </div>
              )}
              {plan.paciente.perfilMedico.objetivos && (
                <div>
                  <div className="text-sm font-medium text-blue-700">Objetivos</div>
                  <div className="text-sm text-gray-900">{plan.paciente.perfilMedico.objetivos}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Componente principal del plan */}
      <ComponentePlanDetalle plan={plan} />
    </div>
  );
}
