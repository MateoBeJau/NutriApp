import { obtenerPlanNutricionalAction } from "../../actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ESTADOS_PLAN_LABELS, PlanNutricionalCompleto, TIPOS_PLAN_LABELS } from "@/types/planes";
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

  const planData = planRes.data;
  
  if (!planData) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            Error: Plan nutricional no encontrado
          </div>
        </div>
      </div>
    );
  }

  // Transformar null a undefined para todo el plan (perfilMedico, comidas, alimentos)
  const plan = {
    ...planData,
    paciente: {
      ...planData.paciente,
      perfilMedico: planData.paciente.perfilMedico ? {
        alergias: planData.paciente.perfilMedico.alergias || undefined,
        restricciones: planData.paciente.perfilMedico.restricciones || undefined,
        enfermedades: planData.paciente.perfilMedico.enfermedades || undefined,
        gustos: planData.paciente.perfilMedico.gustos || undefined,
        disgustos: planData.paciente.perfilMedico.disgustos || undefined,
      } : undefined
    },
    comidas: planData.comidas.map(comida => ({
      ...comida,
      descripcion: comida.descripcion || undefined,
      horaRecomendada: comida.horaRecomendada || undefined,
      caloriasTotal: comida.caloriasTotal || undefined,
      proteinasTotal: comida.proteinasTotal || undefined,
      carbohidratosTotal: comida.carbohidratosTotal || undefined,
      grasasTotal: comida.grasasTotal || undefined,
      alimentos: comida.alimentos.map(alimentoComida => ({
        ...alimentoComida,
        preparacion: alimentoComida.preparacion || undefined,
        notas: alimentoComida.notas || undefined,
        alimento: {
          ...alimentoComida.alimento,
          marca: alimentoComida.alimento.marca || undefined,
          categoria: alimentoComida.alimento.categoria || undefined,
          fibraPor100g: alimentoComida.alimento.fibraPor100g || undefined,
          alergenos: alimentoComida.alimento.alergenos || undefined,
          restricciones: alimentoComida.alimento.restricciones || undefined,
          caracteristicas: alimentoComida.alimento.caracteristicas || undefined,
          indiceGlicemico: alimentoComida.alimento.indiceGlicemico || undefined,
        }
      }))
    })),
    descripcion: planData.descripcion || undefined,
    fechaFin: planData.fechaFin || undefined,
    caloriasObjetivo: planData.caloriasObjetivo || undefined,
    proteinasObjetivo: planData.proteinasObjetivo || undefined,
    carbohidratosObjetivo: planData.carbohidratosObjetivo || undefined,
    grasasObjetivo: planData.grasasObjetivo || undefined,
    notas: planData.notas || undefined,
    promptIA: planData.promptIA || undefined,
    modeloIA: planData.modeloIA || undefined,
    restriccionesAplicadas: planData.restriccionesAplicadas || undefined,
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar Plan Nutricional</h1>
        <p className="text-gray-600 mt-2">Modifica los datos generales del plan</p>
      </div>
      <FormularioEditarPlan plan={plan as PlanNutricionalCompleto} />
    </div>
  );
}
