import { obtenerTodosLosAlimentosAction } from "../planes/actions";
import { AlimentoSeguro } from "@/types/planes";
import FormularioAgregarAlimento from "@/components/alimentos/FormularioAgregarAlimento";

export default async function AlimentosPage() {
  // Obtener todos los alimentos existentes
  const alimentosRes = await obtenerTodosLosAlimentosAction();
  const alimentos: AlimentoSeguro[] = alimentosRes && alimentosRes.success && Array.isArray(alimentosRes.data)
    ? alimentosRes.data
    : [];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gestión de Alimentos</h1>
      <FormularioAgregarAlimento />
      <h2 className="text-xl font-semibold mt-10 mb-4">Alimentos existentes</h2>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Nombre</th>
            <th className="p-2">Categoría</th>
            <th className="p-2">Calorías</th>
            <th className="p-2">Proteínas</th>
            <th className="p-2">Carbohidratos</th>
            <th className="p-2">Grasas</th>
            <th className="p-2">Apto Diabetes</th>
            <th className="p-2">Apto Hipertensión</th>
          </tr>
        </thead>
        <tbody>
          {alimentos.map((alimento) => (
            <tr key={alimento.id} className="border-t">
              <td className="p-2">{alimento.nombre}</td>
              <td className="p-2">{alimento.categoria}</td>
              <td className="p-2">{alimento.caloriasPor100g}</td>
              <td className="p-2">{alimento.proteinasPor100g}</td>
              <td className="p-2">{alimento.carbohidratosPor100g}</td>
              <td className="p-2">{alimento.grasasPor100g}</td>
              <td className="p-2 text-center">{alimento.aptoParaDiabetes ? "✅" : "❌"}</td>
              <td className="p-2 text-center">{alimento.aptoParaHipertension ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
