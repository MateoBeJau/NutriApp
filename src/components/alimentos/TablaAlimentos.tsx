"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlimentoSeguro } from "@/types/planes";
import { Search, Pencil, Trash2, X } from "lucide-react";
import { eliminarAlimentoAction, actualizarAlimentoAction } from "@/app/dashboard/alimentos/actions";

interface Props {
  alimentos: AlimentoSeguro[];
  totalAlimentos: number;
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  searchQuery: string;
}

export default function TablaAlimentos({
  alimentos,
  totalAlimentos,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  searchQuery,
}: Props) {
  const router = useRouter();
  const [eliminando, setEliminando] = useState<string | null>(null);
  const [editando, setEditando] = useState<string | null>(null);
  const [alimentoEditando, setAlimentoEditando] = useState<AlimentoSeguro | null>(null);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('q') as string;
    
    if (q) {
      router.push(`/dashboard/alimentos?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/dashboard/alimentos');
    }
  };

  const handleEliminar = async (id: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    setEliminando(id);
    try {
      const res = await eliminarAlimentoAction(id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || 'Error al eliminar');
      }
    } catch (error) {
      alert('Error al eliminar alimento');
    } finally {
      setEliminando(null);
    }
  };

  const handleEditar = (alimento: AlimentoSeguro) => {
    setEditando(alimento.id);
    setAlimentoEditando(alimento);
  };

  const handleCancelarEdicion = () => {
    setEditando(null);
    setAlimentoEditando(null);
  };

  const handleGuardarEdicion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!alimentoEditando) return;

    const formData = new FormData(e.currentTarget);
    formData.append('id', alimentoEditando.id);

    try {
      const res = await actualizarAlimentoAction(formData);
      if (res.success) {
        setEditando(null);
        setAlimentoEditando(null);
        router.refresh();
      } else {
        alert(res.error || 'Error al actualizar');
      }
    } catch (error) {
      alert('Error al actualizar alimento');
    }
  };

  return (
    <div className="mt-10">
      {/* Buscador */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Buscar por nombre o categoría..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            Buscar
          </button>
          {searchQuery && (
            <Link
              href="/dashboard/alimentos"
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Limpiar
            </Link>
          )}
        </form>
      </div>

      {/* Contador */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          {searchQuery ? `Resultados: "${searchQuery}"` : 'Alimentos existentes'}
        </h2>
        <p className="text-sm text-gray-600">
          Mostrando {startIndex + 1}-{Math.min(endIndex, totalAlimentos)} de {totalAlimentos}
        </p>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Categoría</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Cal</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Prot</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Carb</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Gras</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Diab</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Hiper</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {alimentos.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <div className="text-gray-400 text-4xl mb-2">🔍</div>
                    <p className="text-gray-500">
                      {searchQuery ? `No se encontraron alimentos con "${searchQuery}"` : 'No hay alimentos registrados'}
                    </p>
                  </td>
                </tr>
              ) : (
                alimentos.map((alimento) => (
                  <tr key={alimento.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{alimento.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{alimento.categoria || '-'}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">{alimento.caloriasPor100g}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">{alimento.proteinasPor100g}g</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">{alimento.carbohidratosPor100g}g</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">{alimento.grasasPor100g}g</td>
                    <td className="px-4 py-3 text-center text-lg">{alimento.aptoParaDiabetes ? "✅" : "❌"}</td>
                    <td className="px-4 py-3 text-center text-lg">{alimento.aptoParaHipertension ? "✅" : "❌"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEditar(alimento)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar alimento"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEliminar(alimento.id, alimento.nombre)}
                          disabled={eliminando === alimento.id}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar alimento"
                        >
                          {eliminando === alimento.id ? (
                            <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <Link
            href={`/dashboard/alimentos?page=${currentPage - 1}${searchQuery ? `&q=${searchQuery}` : ''}`}
            className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            }`}
          >
            ← Anterior
          </Link>

          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (currentPage <= 4) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }
              
              return (
                <Link
                  key={pageNum}
                  href={`/dashboard/alimentos?page=${pageNum}${searchQuery ? `&q=${searchQuery}` : ''}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
          </div>

          <Link
            href={`/dashboard/alimentos?page=${currentPage + 1}${searchQuery ? `&q=${searchQuery}` : ''}`}
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

      {/* Modal de edición */}
      {editando && alimentoEditando && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Editar Alimento</h3>
              <button
                type="button"
                onClick={handleCancelarEdicion}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleGuardarEdicion} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    name="nombre"
                    defaultValue={alimentoEditando.nombre}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <input
                    name="categoria"
                    defaultValue={alimentoEditando.categoria || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calorías (por 100g) *</label>
                  <input
                    name="caloriasPor100g"
                    type="number"
                    step="0.01"
                    defaultValue={alimentoEditando.caloriasPor100g}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proteínas (g) *</label>
                  <input
                    name="proteinasPor100g"
                    type="number"
                    step="0.01"
                    defaultValue={alimentoEditando.proteinasPor100g}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carbohidratos (g) *</label>
                  <input
                    name="carbohidratosPor100g"
                    type="number"
                    step="0.01"
                    defaultValue={alimentoEditando.carbohidratosPor100g}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grasas (g) *</label>
                  <input
                    name="grasasPor100g"
                    type="number"
                    step="0.01"
                    defaultValue={alimentoEditando.grasasPor100g}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fibra (g)</label>
                  <input
                    name="fibraPor100g"
                    type="number"
                    step="0.01"
                    defaultValue={alimentoEditando.fibraPor100g || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      name="aptoParaDiabetes"
                      type="checkbox"
                      defaultChecked={alimentoEditando.aptoParaDiabetes}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Apto para diabetes</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      name="aptoParaHipertension"
                      type="checkbox"
                      defaultChecked={alimentoEditando.aptoParaHipertension}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Apto para hipertensión</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCancelarEdicion}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

