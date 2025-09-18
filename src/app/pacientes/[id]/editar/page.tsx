import { notFound } from "next/navigation";
import Link from "next/link";
import { getPacienteAction } from "../../actions";
import { requireAuth } from "@/lib/auth";
import FormPacienteEditar from "@/components/pacientes/FormPacienteEditar";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPacientePage({ params }: Props) {
  const user = await requireAuth();
  const { id } = await params;

  // Obtener el paciente existente
  const paciente = await getPacienteAction(id, user.id);
  
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
              href="/pacientes"
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