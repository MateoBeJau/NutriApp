// src/app/pacientes/page.tsx
import Link from "next/link";
import PacientesTable from "@/components/pacientes/PacientesTable";
import { listPacientesAction } from "./actions";
import { requireAuth } from "@/lib/auth";
import { logoutAction } from "@/app/auth/logout/actions"; // ✅ Import correcto

export default async function PacientesPage({ 
  searchParams 
}: { 
  searchParams?: { q?: string; cursor?: string } 
}) {
  const user = await requireAuth();

  // ✅ AWAIT searchParams en Next.js 15
  const resolvedSearchParams = await searchParams;
  const q = (resolvedSearchParams?.q ?? "").trim() || undefined;

  const { items, nextCursor } = await listPacientesAction(user.id, q);

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        <div className="flex gap-2">
          <Link
            href="/pacientes/nuevo"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Nuevo Paciente
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cerrar Sesión
            </button>
          </form>
        </div>
      </div>

      {/* buscador */}
      <form className="flex gap-2" method="GET">
        <input 
          name="q" 
          defaultValue={q} 
          placeholder="Buscar…" 
          className="w-full max-w-xl rounded border px-3 py-2" 
        />
        <button className="rounded bg-black px-4 py-2 text-white">Buscar</button>
      </form>

      <PacientesTable
        pacientes={
          (items ?? []).map((p) => ({
            ...p,
            sexo:
              p.sexo === "F" || p.sexo === "M" || p.sexo === "O" || p.sexo === ""
                ? p.sexo
                : p.sexo === null || p.sexo === undefined
                ? null
                : ""
          }))
        }
      />

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