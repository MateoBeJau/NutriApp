import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { obtenerReportePacienteAction } from "./actions";
import { calcularEdad, obtenerEstadoIMC } from "@/lib/reportes-utils";
import GraficaPeso from "@/components/reportes/GraficaPeso";
import ResumenPlanes from "@/components/reportes/ResumenPlanes";
import TablaConsultas from "@/components/reportes/TablaConsultas";
import EstilosImpresion from "@/components/reportes/EstilosImpresion";
import BotonExportarPDF from "@/components/reportes/BotonExportarPDF";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReportePacientePage({ params }: Props) {
  const user = await requireAuth();
  const { id } = await params;

  const reporteResult = await obtenerReportePacienteAction(id);
  
  if (!reporteResult.success || !reporteResult.data) {
    notFound();
  }

  const datos = reporteResult.data;
  const { paciente, perfilMedico, mediciones, consultas, planes, estadisticas } = datos;
  
  const edad = calcularEdad(paciente.fechaNacimiento || null);
  const estadoIMC = estadisticas.imcActual ? obtenerEstadoIMC(estadisticas.imcActual) : null;

  return (
    <>
      <EstilosImpresion />
      <div className="container mx-auto py-6 max-w-7xl print:max-w-none print:mx-0 print:py-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reporte de {paciente.nombre} {paciente.apellido}
            </h1>
            <p className="mt-2 text-gray-600">
              Resumen completo del progreso y seguimiento nutricional
            </p>
          </div>
          <div className="flex space-x-3 print:hidden">
            <BotonExportarPDF />
            <Link
              href={`/dashboard/pacientes/${id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al Paciente
            </Link>
          </div>
        </div>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Información Básica */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Paciente</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Edad:</span>
              <p className="text-gray-900">{edad ? `${edad} años` : 'No especificada'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Sexo:</span>
              <p className="text-gray-900">{paciente.sexo || 'No especificado'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Altura:</span>
              <p className="text-gray-900">{paciente.alturaCm ? `${paciente.alturaCm} cm` : 'No registrada'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">En seguimiento:</span>
              <p className="text-gray-900">{estadisticas.diasEnSeguimiento} días</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <p className="text-gray-900">{paciente.email || 'No registrado'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Teléfono:</span>
              <p className="text-gray-900">{paciente.telefono || 'No registrado'}</p>
            </div>
          </div>
        </div>

        {/* Estadísticas de Peso */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso de Peso</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600">Peso inicial:</span>
              <p className="text-xl font-bold text-gray-900">
                {estadisticas.pesoInicial ? `${estadisticas.pesoInicial} kg` : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Peso actual:</span>
              <p className="text-xl font-bold text-gray-900">
                {estadisticas.pesoActual ? `${estadisticas.pesoActual} kg` : 'N/A'}
              </p>
            </div>
            {estadisticas.diferenciaPeso !== undefined && (
              <div>
                <span className="text-sm font-medium text-gray-600">Diferencia:</span>
                <p className={`text-xl font-bold ${
                  estadisticas.diferenciaPeso > 0 ? 'text-red-600' : 
                  estadisticas.diferenciaPeso < 0 ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {estadisticas.diferenciaPeso > 0 ? '+' : ''}{estadisticas.diferenciaPeso} kg
                </p>
              </div>
            )}
          </div>
        </div>

        {/* IMC Actual */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">IMC Actual</h3>
          {estadisticas.imcActual && estadoIMC ? (
            <div className="space-y-3">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {estadisticas.imcActual.toFixed(1)}
                </p>
              </div>
              <div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  estadoIMC.color === 'text-green-600' ? 'bg-green-100 text-green-800' :
                  estadoIMC.color === 'text-yellow-600' ? 'bg-yellow-100 text-yellow-800' :
                  estadoIMC.color === 'text-red-600' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {estadoIMC.categoria}
                </span>
              </div>
              <p className="text-sm text-gray-600">{estadoIMC.descripcion}</p>
            </div>
          ) : (
            <p className="text-gray-500">No hay datos suficientes</p>
          )}
        </div>
      </div>

      {/* Gráfica de Peso */}
      {mediciones.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Evolución del Peso</h2>
          <GraficaPeso mediciones={mediciones} />
        </div>
      )}

      {/* Resumen de Planes */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Planes Nutricionales</h2>
        <ResumenPlanes planes={planes} estadisticas={estadisticas} />
      </div>


      {/* Historial de Consultas */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial de Consultas</h2>
        <TablaConsultas consultas={consultas} estadisticas={estadisticas} />
      </div>

      {/* Notas del Paciente */}
      {paciente.notas && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notas Adicionales</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-900 leading-relaxed">{paciente.notas}</p>
          </div>
        </div>
      )}

      {/* Footer del reporte */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>Reporte generado el {new Date().toLocaleDateString('es-AR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p className="mt-1">Sistema de Gestión Nutricional</p>
      </div>
    </div>
    </>
  );
}
