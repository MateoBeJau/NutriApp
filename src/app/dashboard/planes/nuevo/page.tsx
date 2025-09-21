import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { obtenerPacientesActivosAction } from "../../agenda/server-actions";
import FormularioNuevoPlan from "@/components/planes/FormularioNuevoPlan";

export default async function NuevoPlanPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  // Obtener pacientes activos para el selector
  const pacientesRes = await obtenerPacientesActivosAction();
  const pacientes = pacientesRes || [];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Plan Nutricional</h1>
        <p className="text-gray-600 mt-2">Diseña un plan personalizado para tu paciente</p>
      </div>

      <FormularioNuevoPlan pacientes={pacientes} />
    </div>
  );
}
