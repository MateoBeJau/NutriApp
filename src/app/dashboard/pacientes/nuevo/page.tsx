import FormPaciente from "@/components/pacientes/FormPaciente";
import { requireAuth } from "@/lib/auth";

export default async function NuevoPacientePage() {
  // Usar autenticación real en lugar de ID hardcodeado
  const user = await requireAuth();

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-4">Nuevo paciente</h1>
      <FormPaciente usuarioId={user.id} />
    </div>
  );
}
