import { obtenerTodosLosAlimentosAction } from "../planes/actions";
import { AlimentoSeguro } from "@/types/planes";
import FormularioAgregarAlimento from "@/components/alimentos/FormularioAgregarAlimento";
import Link from "next/link";

interface Props {
  searchParams?: { page?: string };
}

export default async function AlimentosPage({ searchParams }: Props) {
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 16;
  
  // Obtener todos los alimentos existentes
  const alimentosRes = await obtenerTodosLosAlimentosAction();
  const todosLosAlimentos: AlimentoSeguro[] = alimentosRes && alimentosRes.success && Array.isArray(alimentosRes.data)
    ? alimentosRes.data
    : [];

  // Calcular paginación
  const totalAlimentos = todosLosAlimentos.length;
  const totalPages = Math.ceil(totalAlimentos / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const alimentos = todosLosAlimentos.slice(startIndex, endIndex);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Alimentos</h1>
      <FormularioAgregarAlimento />
      
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Alimentos existentes</h2>
          <p className="text-sm text-gray-600">
            Mostrando {startIndex + 1}-{Math.min(endIndex, totalAlimentos)} de {totalAlimentos} alimentos
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Categoría</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Calorías</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Proteínas</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Carbohidratos</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Grasas</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Diabetes</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Hipertensión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {alimentos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No hay alimentos registrados
                  </td>
                </tr>
              ) : (
                alimentos.map((alimento) => (
                  <tr key={alimento.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{alimento.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{alimento.categoria}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">{alimento.caloriasPor100g}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">{alimento.proteinasPor100g}g</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">{alimento.carbohidratosPor100g}g</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">{alimento.grasasPor100g}g</td>
                    <td className="px-4 py-3 text-center text-lg">{alimento.aptoParaDiabetes ? "✅" : "❌"}</td>
                    <td className="px-4 py-3 text-center text-lg">{alimento.aptoParaHipertension ? "✅" : "❌"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            {/* Botón Anterior */}
            <Link
              href={`/dashboard/alimentos?page=${currentPage - 1}`}
              className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
            >
              ← Anterior
            </Link>

            {/* Números de página */}
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/dashboard/alimentos?page=${page}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </Link>
              ))}
            </div>

            {/* Botón Siguiente */}
            <Link
              href={`/dashboard/alimentos?page=${currentPage + 1}`}
              className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
            >
              Siguiente →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}