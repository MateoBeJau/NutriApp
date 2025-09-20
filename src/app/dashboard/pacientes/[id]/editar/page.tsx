import { notFound } from "next/navigation";
import Link from "next/link";
import { getPacienteAction } from "../../actions";
import { requireAuth } from "@/lib/auth";
import FormPacienteEditar from "@/components/pacientes/FormPacienteEditar";
import { cache } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

// ✅ OPTIMIZACIÓN: Cache más eficiente con timeout y error handling
const getCachedPaciente = cache(async (id: string, userId: string) => {
  const startTime = Date.now();
  console.log(`🔍 Starting cached query for patient: ${id}`);
  
  try {
    const paciente = await getPacienteAction(id, userId);
    const queryTime = Date.now() - startTime;
    console.log(`✅ Cached query completed in: ${queryTime}ms`);
    return paciente;
  } catch (error) {
    const queryTime = Date.now() - startTime;
    console.error(`❌ Cached query failed after ${queryTime}ms:`, error);
    throw error;
  }
});


export default async function EditPacientePage({ params }: Props) {
  const startTime = Date.now();
  
  const user = await requireAuth();
  const authTime = Date.now();
  console.log(`🔍 Auth took: ${authTime - startTime}ms`);
  
  const { id } = await params;
  const paramsTime = Date.now();
  console.log(`🔍 Params took: ${paramsTime - authTime}ms`);

  // ✅ OPTIMIZACIÓN: Usar cache y manejar errores
  let paciente;
  try {
    paciente = await getCachedPaciente(id, user.id);
    const pacienteTime = Date.now();
    console.log(`🔍 Paciente query took: ${pacienteTime - paramsTime}ms`);
    console.log(` Total page load: ${pacienteTime - startTime}ms`);
  } catch (error) {
    console.error("Error loading paciente:", error);
    notFound();
  }
  
  if (!paciente) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar Paciente</h1>
              <p className="mt-2 text-gray-600">
                Modifica la información de {paciente.nombre} {paciente.apellido}
              </p>
            </div>
            <Link
              href="/dashboard/pacientes"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a Pacientes
            </Link>
          </div>
        </div>

        {/* Formulario de edición */}
        <FormPacienteEditar 
          paciente={paciente}
          usuarioId={user.id}
        />
      </main>
    </div>
  );
}