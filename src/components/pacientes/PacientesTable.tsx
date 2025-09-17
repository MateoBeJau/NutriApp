// components/pacientes/PacientesTable.tsx
type PacienteRow = {
  id: string;
  nombre: string;
  apellido: string;
  email?: string | null;
  telefono?: string | null;
  fechaNacimiento?: Date | string | null;
  sexo?: "F" | "M" | "O" | "" | null;
  alturaCm?: number | null;
  notas?: string | null;
  // campos de auditoría opcionales
  creadoEn?: Date | string;
  actualizadoEn?: Date | string;
};

export default function PacientesTable({ pacientes }: { pacientes: PacienteRow[]  }) {
  if (!pacientes.length) {
    return (
      <div className="rounded-lg border p-6 text-gray-600">
        No hay pacientes cargados{""}
        <span className="hidden sm:inline">. Usá “Nuevo paciente” para agregar el primero.</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-[720px] w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Contacto</th>
            <th className="px-4 py-3">F. Nacimiento</th>
            <th className="px-4 py-3">Sexo</th>
            <th className="px-4 py-3">Altura</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((p) => {
            const fecha =
              p.fechaNacimiento
                ? formatDate(p.fechaNacimiento)
                : "—";
            const sexo = p.sexo || "—";
            const altura = p.alturaCm ? `${p.alturaCm} cm` : "—";

            return (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3 font-medium">
                  {p.nombre} {p.apellido}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span>{p.email || "—"}</span>
                    <span className="text-gray-500">{p.telefono || ""}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{fecha}</td>
                <td className="px-4 py-3">{sexo}</td>
                <td className="px-4 py-3">{altura}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {/* TODO: Rutas reales */}
                    <a
                      href={`/pacientes/${p.id}`}
                      className="rounded border px-2 py-1 hover:bg-gray-50"
                    >
                      Ver
                    </a>
                    <a
                      href={`/pacientes/${p.id}/editar`}
                      className="rounded border px-2 py-1 hover:bg-gray-50"
                    >
                      Editar
                    </a>
                    
                    <button
                      className="rounded border px-2 py-1 hover:bg-gray-50"
                      disabled
                      title="Próximamente"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("es-UY", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}
