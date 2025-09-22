import { redirect } from "next/navigation";

export default function ReportesRedirectPage() {
  // Redirige a la lista de pacientes para elegir un reporte
  redirect("/dashboard/pacientes");
  return null;
}
