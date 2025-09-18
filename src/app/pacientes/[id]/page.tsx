import { notFound } from "next/navigation";
import Link from "next/link";
import { getPacienteAction } from "../actions";
import { requireAuth } from "@/lib/auth";
import PerfilMedicoSection from "@/components/pacientes/PerfilMedicoSection";
import MedicionesSection from "@/components/pacientes/MedicionesSection";
import { Calendar, Mail, Phone, Ruler, User, Edit, ArrowLeft, Clock, MapPin, Calendar as CalendarIcon } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PacientePage({ params }: Props) {
  const user = await requireAuth();
  const { id } = await params;

  // Obtener el paciente
  const paciente = await getPacienteAction(id, user.id);
  
  if (!paciente) {
    notFound();
  }

  const calcularEdad = (fechaNacimiento: Date | null) => {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      return edad - 1;
    }
    return edad;
  };

  const edad = calcularEdad(paciente.fechaNacimiento);

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/pacientes"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Pacientes
            </Link>
          </div>
          
          <div className="flex gap-2">
            <Link
              href={`/pacientes/${id}/editar`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Editar Paciente
            </Link>
          </div>
        </div>
      </div>

      {/* Información del Paciente - Header Profesional */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {paciente.nombre} {paciente.apellido}
              </h1>
              <div className="flex items-center gap-6 text-gray-600">
                {paciente.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{paciente.email}</span>
                  </div>
                )}
                {paciente.telefono && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{paciente.telefono}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Paciente desde</p>
              <p className="text-lg font-semibold text-blue-900">
                {new Date(paciente.creadoEn).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por Anclas */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 mb-6">
        <nav className="flex space-x-1">
          <a
            href="#datos-basicos"
            className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 transition-colors"
          >
            Datos Básicos
          </a>
          <a
            href="#perfil-medico"
            className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 transition-colors"
          >
            Perfil Médico
          </a>
          <a
            href="#mediciones"
            className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 transition-colors"
          >
            Mediciones
          </a>
          <a
            href="#consultas"
            className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 transition-colors"
          >
            Consultas
          </a>
        </nav>
      </div>

      {/* Sección: Datos Básicos - Solo información no visible en header */}
      <section id="datos-basicos" className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Personal</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Información Demográfica */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                Información Demográfica
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Nacimiento
                  </label>
                  <div className="flex items-center gap-2 text-gray-900 bg-gray-50 p-3 rounded-md">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span>
                      {paciente.fechaNacimiento 
                        ? new Date(paciente.fechaNacimiento).toLocaleDateString()
                        : "No especificado"
                      }
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Edad
                  </label>
                  <div className="flex items-center gap-2 text-gray-900 bg-gray-50 p-3 rounded-md">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {edad ? `${edad} años` : "No especificado"}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexo
                  </label>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                    {paciente.sexo || "No especificado"}
                  </div>
                </div>
              </div>
            </div>

            {/* Información Física */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                Información Física
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Altura
                  </label>
                  <div className="flex items-center gap-2 text-gray-900 bg-gray-50 p-3 rounded-md">
                    <Ruler className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {paciente.alturaCm ? `${paciente.alturaCm} cm` : "No especificado"}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso Actual
                  </label>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                    <span className="text-sm text-gray-500">Ver en sección Mediciones</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IMC
                  </label>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                    <span className="text-sm text-gray-500">Ver en sección Mediciones</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Información Adicional */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                Información Adicional
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas del Paciente
                  </label>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-md min-h-[100px]">
                    {paciente.notas ? (
                      <p className="text-sm leading-relaxed">{paciente.notas}</p>
                    ) : (
                      <span className="text-sm text-gray-500 italic">Sin notas adicionales</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección: Perfil Médico */}
      <section id="perfil-medico" className="mb-8">
        <PerfilMedicoSection pacienteId={id} />
      </section>

      {/* Sección: Mediciones */}
      <section id="mediciones" className="mb-8">
        <MedicionesSection pacienteId={id} />
      </section>

      {/* Sección: Consultas */}
      <section id="consultas" className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Consultas</h2>
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Funcionalidad de consultas en desarrollo</p>
          </div>
        </div>
      </section>
    </div>
  );
}
