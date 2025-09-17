import Link from "next/link";
import { listPacientesAction } from "./actions";
import PacientesTable from "@/components/pacientes/PacientesTable";

const DEV_USER_ID = "03c0ece4-106d-4a39-8536-3ec2a8cf7102";

type SP = { q?: string; cursor?: string };

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  // ✅ esperar searchParams
  const sp = await searchParams;
  const q = (sp.q ?? "").trim() || undefined;
  const cursor = (sp.cursor ?? undefined) as string | undefined;

  const { items, nextCursor } = await listPacientesAction(DEV_USER_ID, q);

  // Adaptador a tus tipos de tabla (si lo estás usando)
  const rows = (items ?? []).map((p) => ({
    id: p.id,
    nombre: p.nombre,
    apellido: p.apellido,
    email: p.email ?? null,
    telefono: p.telefono ?? null,
    fechaNacimiento: p.fechaNacimiento ?? null,
    sexo: p.sexo === "F" || p.sexo === "M" || p.sexo === "O" || p.sexo === "" ? (p.sexo as "" | "F" | "M" | "O") : null,
    alturaCm: p.alturaCm ?? null,
    notas: p.notas ?? null,
    creadoEn: p.creadoEn,
    actualizadoEn: p.actualizadoEn,
  }));

  return (
    <main className="p-6 space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Pacientes</h1>
        <Link
          href="/pacientes/nuevo"
          className="inline-flex items-center rounded-lg border px-3 py-2 hover:bg-gray-50"
        >
          + Nuevo paciente
        </Link>
      </header>

      <form className="flex gap-2" method="GET">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre, apellido, teléfono, email…"
          className="w-full max-w-xl rounded border px-3 py-2"
        />
        <button className="rounded bg-black px-4 py-2 text-white">Buscar</button>
      </form>

      <section>
        <PacientesTable pacientes={rows} />
      </section>

      {nextCursor && (
        <div>
          <Link
            href={`/pacientes?${new URLSearchParams({ ...(q ? { q } : {}), cursor: nextCursor }).toString()}`}
            className="mt-4 inline-flex rounded border px-3 py-2 hover:bg-gray-50"
          >
            Cargar más
          </Link>
        </div>
      )}
    </main>
  );
}
