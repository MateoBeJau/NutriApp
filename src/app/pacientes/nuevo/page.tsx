import FormPaciente from "@/components/pacientes/FormPaciente";

export default async function NuevoPacientePage() {
  const usuarioId = "03c0ece4-106d-4a39-8536-3ec2a8cf7102";

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-4">Nuevo paciente</h1>
      <FormPaciente usuarioId={usuarioId} />
    </div>
  );
}
