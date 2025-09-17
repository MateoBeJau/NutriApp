import { prisma } from "@/lib/prisma";
import FormPaciente from "@/components/pacientes/FormPaciente";

export default async function NuevoPacientePage() {
  // por ahora: usar el primer Usuario que exista en DB
  const user = await prisma.usuario.findFirst();
  if (!user) {
    return (
      <div className="max-w-xl">
        <h1 className="text-xl font-semibold mb-2">Nuevo paciente</h1>
        <p className="text-red-600">
          No hay usuarios en la base. Creá uno desde Prisma Studio y recargá esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-4">Nuevo paciente</h1>
      <FormPaciente usuarioId={user.id} />
    </div>
  );
}
