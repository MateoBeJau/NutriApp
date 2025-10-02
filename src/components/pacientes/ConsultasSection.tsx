'use client'

import { useState, useEffect } from 'react'
import { ConsultaConPaciente } from '@/types/consulta'
import { EstadoConsulta, EstadoPago } from '@prisma/client' // ✅ Importar de Prisma
import Button from '@/components/ui/Button'
import { obtenerConsultasDePacienteAction, cambiarEstadoPagoAction } from '@/app/dashboard/pacientes/consultas-actions'
import { useRouter } from 'next/navigation'

interface ConsultasSectionProps {
  pacienteId: string
  pacienteNombre: string
  pacienteApellido: string
}

export default function ConsultasSection({ pacienteId, pacienteNombre, pacienteApellido }: ConsultasSectionProps) {
  const [consultas, setConsultas] = useState<ConsultaConPaciente[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrarTodas, setMostrarTodas] = useState(false)
  const [cambiandoEstado, setCambiandoEstado] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    cargarConsultas()
  }, [pacienteId])

  const cargarConsultas = async () => {
    try {
      setCargando(true)
      const consultasData = await obtenerConsultasDePacienteAction(pacienteId)
      setConsultas(consultasData)
    } catch (error) {
      console.error('Error al cargar consultas:', error)
    } finally {
      setCargando(false)
    }
  }

  const formatearHora = (fecha: Date) => {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const obtenerColorEstado = (estado: EstadoConsulta) => {
    const colores = {
      PROGRAMADO: 'bg-blue-100 text-blue-800 border-blue-200',
      CONFIRMADO: 'bg-green-100 text-green-800 border-green-200',
      CANCELADO: 'bg-red-100 text-red-800 border-red-200',
      AUSENTE: 'bg-orange-100 text-orange-800 border-orange-200',
      COMPLETADO: 'bg-purple-100 text-purple-800 border-purple-200',
      REAGENDADO: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    }
    return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const obtenerIconoEstado = (estado: EstadoConsulta) => {
    const iconos = {
      PROGRAMADO: '📅',
      CONFIRMADO: '✅',
      CANCELADO: '❌',
      AUSENTE: '👻',
      COMPLETADO: '✨',
      REAGENDADO: '🔄',
    }
    return iconos[estado] || '📋'
  }

  const navegarADetalleConsulta = (consulta: ConsultaConPaciente) => {
    // Formatear la fecha de la consulta para la URL de la agenda
    const fechaConsulta = new Date(consulta.inicio)
    const fechaParam = fechaConsulta.toISOString().split('T')[0] // YYYY-MM-DD
    
    console.log('🔄 Navegando a consulta:', {
      consultaId: consulta.id,
      fecha: fechaParam,
      paciente: `${consulta.paciente?.nombre} ${consulta.paciente?.apellido}`
    })
    
    // Navegar a la agenda con la fecha de la consulta y abrir el detalle
    router.push(`/dashboard/agenda?fecha=${fechaParam}&consulta=${consulta.id}`)
  }

  const handleCambiarEstadoPago = async (consultaId: string, nuevoEstado: EstadoPago) => {
    try {
      setCambiandoEstado(consultaId)
      
      const resultado = await cambiarEstadoPagoAction(consultaId, nuevoEstado)
      
      if (resultado.success) {
        // Recargar las consultas para mostrar el cambio
        await cargarConsultas()
      } else {
        alert('Error al cambiar el estado de pago: ' + resultado.message)
      }
    } catch (error) {
      console.error('Error al cambiar estado de pago:', error)
      alert('Error al cambiar el estado de pago')
    } finally {
      setCambiandoEstado(null)
    }
  }

  const obtenerColorEstadoPago = (estado: EstadoPago) => {
    const colores = {
      PAGADO: 'bg-green-100 text-green-800 border-green-200',
      PENDIENTE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    }
    return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const obtenerIconoEstadoPago = (estado: EstadoPago) => {
    const iconos = {
      PAGADO: '💚',
      PENDIENTE: '💛',
    }
    return iconos[estado] || '❓'
  }

  const consultasAMostrar = mostrarTodas ? consultas : consultas.slice(0, 5)
  // Calcular estadísticas
  const stats = {
    total: consultas.length,
    completadas: consultas.filter(c => c.estado === EstadoConsulta.COMPLETADO).length,
    programadas: consultas.filter(c => c.estado === EstadoConsulta.PROGRAMADO || c.estado === EstadoConsulta.CONFIRMADO).length,
    canceladas: consultas.filter(c => c.estado === EstadoConsulta.CANCELADO).length,
    pagadas: consultas.filter(c => c.estadoPago === EstadoPago.PAGADO).length, // ✅ Usar enum
    pendientes: consultas.filter(c => c.estadoPago === EstadoPago.PENDIENTE).length, // ✅ Usar enum
  }

  if (cargando) {
    return (
      <section id="consultas" className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📅 Historial de Consultas</h2>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="consultas" className="mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Header con estadísticas */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              📅 Historial de Consultas
            </h2>
            <p className="text-sm text-gray-600">
              Consultas de {pacienteNombre} {pacienteApellido}
            </p>
            {consultas.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                💡 Haz clic en cualquier consulta para ver detalles y agregar mediciones
              </p>
            )}
          </div>
          
          {consultas.length > 0 && (
            <div className="flex space-x-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-lg text-gray-900">{stats.total}</div>
                <div className="text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-green-600">{stats.pagadas}</div>
                <div className="text-gray-500">Pagadas</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-yellow-600">{stats.pendientes}</div>
                <div className="text-gray-500">Pendientes</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-purple-600">{stats.completadas}</div>
                <div className="text-gray-500">Completadas</div>
              </div>
            </div>
          )}
        </div>

        {consultas.length === 0 ? (
          // Estado vacío
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🩺</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sin consultas registradas
            </h3>
            <p className="text-gray-500 mb-6">
              Este paciente aún no tiene consultas en su historial.
            </p>
            <Button
              onClick={() => router.push('/dashboard/agenda')}
              className="bg-gray-900 hover:bg-gray-800"
            >
              📅 Programar Primera Consulta
            </Button>
          </div>
        ) : (
          // Lista de consultas
          <div>
            <div className="space-y-4">
              {consultasAMostrar.map((consulta) => (
                <div
                  key={consulta.id}
                  onClick={() => navegarADetalleConsulta(consulta)}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    {/* Información principal */}
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Fecha y hora */}
                      <div className="text-center min-w-[100px]">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatearFecha(consulta.inicio)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {formatearHora(consulta.inicio)} - {formatearHora(consulta.fin)}
                        </div>
                      </div>

                      {/* Estados */}
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${obtenerColorEstado(consulta.estado)}`}>
                          {obtenerIconoEstado(consulta.estado)} {consulta.estado}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${obtenerColorEstadoPago(consulta.estadoPago)}`}>
                          {obtenerIconoEstadoPago(consulta.estadoPago)} {consulta.estadoPago}
                        </span>
                      </div>

                      {/* Detalles adicionales */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {consulta.lugar && (
                            <span className="flex items-center space-x-1">
                              <span>📍</span>
                              <span className="truncate">{consulta.lugar}</span>
                            </span>
                          )}
                          
                          {consulta.notas && (
                            <span className="flex items-center space-x-1">
                              <span>📝</span>
                              <span className="truncate max-w-[200px]">{consulta.notas}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones y mediciones */}
                    <div className="flex items-center space-x-3">
                      {/* Botones de estado de pago */}
                      <div className="flex items-center space-x-1">
                        {consulta.estadoPago === EstadoPago.PENDIENTE ? ( // ✅ Usar enum
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCambiarEstadoPago(consulta.id, EstadoPago.PAGADO) // ✅ Usar enum
                            }}
                            disabled={cambiandoEstado === consulta.id}
                            className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded-md border border-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            💰 Marcar Pagado
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCambiarEstadoPago(consulta.id, EstadoPago.PENDIENTE) // ✅ Usar enum
                            }}
                            disabled={cambiandoEstado === consulta.id}
                            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            ⏳ Marcar Pendiente
                          </button>
                        )}
                      </div>

                      {consulta.mediciones && consulta.mediciones.length > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                          📊 {consulta.mediciones.length} medición{consulta.mediciones.length !== 1 ? 'es' : ''}
                        </span>
                      )}
                      
                      {/* Indicador de que es clickeable */}
                      <div className="flex items-center text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                        <span className="mr-1">Ver detalles</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Mostrar mediciones si existen */}
                  {consulta.mediciones && consulta.mediciones.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {consulta.mediciones.map((medicion) => (
                          <div key={medicion.id} className="text-center">
                            {medicion.pesoKg && (
                              <div>
                                <span className="font-semibold text-blue-600">{medicion.pesoKg} kg</span>
                                <div className="text-xs text-gray-500">Peso</div>
                              </div>
                            )}
                            {medicion.imc && (
                              <div>
                                <span className="font-semibold text-green-600">{medicion.imc}</span>
                                <div className="text-xs text-gray-500">IMC</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Botón para mostrar más */}
            {consultas.length > 5 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setMostrarTodas(!mostrarTodas)}
                >
                  {mostrarTodas ? 
                    `📁 Mostrar menos (${consultas.length - 5} consultas ocultas)` : 
                    `📂 Mostrar todas las consultas (${consultas.length - 5} más)`
                  }
                </Button>
              </div>
            )}

            {/* Acciones */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Última consulta: {formatearFecha(consultas[0]?.inicio)}
              </div>
              <Button
                onClick={() => window.location.href = '/dashboard/agenda'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                📅 Nueva Consulta
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
