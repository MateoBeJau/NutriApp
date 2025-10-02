import { obtenerTodosLosAlimentosAction } from "../planes/actions";
import { AlimentoSeguro } from "@/types/planes";
import FormularioAgregarAlimento from "@/components/alimentos/FormularioAgregarAlimento";
import TablaAlimentos from "@/components/alimentos/TablaAlimentos";

interface Props {
  searchParams?: { page?: string; q?: string };
}

export default async function AlimentosPage({ searchParams }: Props) {
  const currentPage = Number(searchParams?.page) || 1;
  const searchQuery = searchParams?.q || '';
  const itemsPerPage = 16;
  
  // Obtener todos los alimentos existentes
  const alimentosRes = await obtenerTodosLosAlimentosAction();
  const todosLosAlimentos: AlimentoSeguro[] = alimentosRes && alimentosRes.success && Array.isArray(alimentosRes.data)
    ? alimentosRes.data
    : [];

  // Filtrar por búsqueda
  const alimentosFiltrados = searchQuery
    ? todosLosAlimentos.filter((alimento) =>
        alimento.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alimento.categoria?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : todosLosAlimentos;

  // Calcular paginación
  const totalAlimentos = alimentosFiltrados.length;
  const totalPages = Math.ceil(totalAlimentos / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const alimentos = alimentosFiltrados.slice(startIndex, endIndex);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Alimentos</h1>
      
      {/* Formulario para agregar */}
      <FormularioAgregarAlimento />
      
      {/* Tabla con todas las funcionalidades */}
      <TablaAlimentos 
        alimentos={alimentos}
        totalAlimentos={totalAlimentos}
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        searchQuery={searchQuery}
      />
    </div>
  );
}