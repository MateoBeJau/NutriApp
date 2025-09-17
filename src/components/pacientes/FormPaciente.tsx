"use client";

import { createPacienteFromForm } from "@/app/pacientes/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  usuarioId: string;
};

export default function FormPaciente({ usuarioId }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  return (
    <form
      action={async (formData) => {
        setSubmitting(true);
        try {
          await createPacienteFromForm(formData);
          // Usar router de Next.js en lugar de window.location
          router.push("/pacientes");
        } finally {
          setSubmitting(false);
        }
      }}
      className="grid grid-cols-1 gap-4 max-w-xl"
    >
      {/* Usar la prop usuarioId en lugar del valor hardcodeado */}
      <input type="hidden" name="usuarioId" value={usuarioId} />


      <div className="grid gap-1">
        <label className="text-sm">Nombre *</label>
        <input name="nombre" required className="border rounded p-2" placeholder="Ana" />
      </div>

      <div className="grid gap-1">
        <label className="text-sm">Apellido *</label>
        <input name="apellido" required className="border rounded p-2" placeholder="García" />
      </div>

      <div className="grid gap-1">
        <label className="text-sm">Email</label>
        <input type="email" name="email" className="border rounded p-2" placeholder="ana@mail.com" />
      </div>

      <div className="grid gap-1">
        <label className="text-sm">Teléfono</label>
        <input name="telefono" className="border rounded p-2" placeholder="+598 9..." />
      </div>

      <div className="grid gap-1">
        <label className="text-sm">Fecha de nacimiento</label>
        <input type="date" name="fechaNacimiento" className="border rounded p-2" />
      </div>

      <div className="grid gap-1">
        <label className="text-sm">Sexo</label>
        <select name="sexo" className="border rounded p-2">
          <option value="">—</option>
          <option value="F">Femenino</option>
          <option value="M">Masculino</option>
          <option value="O">Otro</option>
        </select>
      </div>

      <div className="grid gap-1">
        <label className="text-sm">Altura (cm)</label>
        <input name="alturaCm" className="border rounded p-2" placeholder="170" />
      </div>

      <div className="grid gap-1">
        <label className="text-sm">Notas</label>
        <textarea name="notas" rows={3} className="border rounded p-2" placeholder="Observaciones..." />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-black text-white rounded px-4 py-2 disabled:opacity-60"
      >
        {submitting ? "Guardando..." : "Guardar paciente"}
      </button>
    </form>
  );
}
