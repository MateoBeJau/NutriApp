import { obtenerPlanNutricionalAction } from "../../actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ESTADOS_PLAN_LABELS, TIPOS_PLAN_LABELS } from "@/types/planes";
import FormularioEditarPlan from "@/components/planes/FormularioEditarPlan";

export default async function EditarPlanPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const planRes = await obtenerPlanNutricionalAction(params.id);
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

  const plan = planRes.data;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar Plan Nutricional</h1>
        <p className="text-gray-600 mt-2">Modifica los datos generales del plan</p>
      </div>
      <FormularioEditarPlan plan={plan} />
    </div>
  );
}
