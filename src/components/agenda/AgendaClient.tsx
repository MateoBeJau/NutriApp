'use client'

import { useState, useEffect } from 'react'
import { ConsultaConPaciente, EstadoConsulta } from '@/types/consulta'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import { FormularioConsulta } from '@/components/consultas/FormularioConsulta'
import { obtenerConsultasDelDia, crearConsultaAction, actualizarConsultaAction, cambiarEstadoConsultaAction } from '@/app/dashboard/agenda/server-actions'

interface AgendaClientProps {
  usuarioId: string
}

export function AgendaClient({ usuarioId }: AgendaClientProps) {
  const [consultas, setConsultas] = useState<ConsultaConPaciente[]>([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date())
  const [cargando, setCargando] = useState(true)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [consultaSeleccionada, setConsultaSeleccionada] = useState<ConsultaConPaciente | null>(null)
  const [modoEdicion, setModoEdicion] = useState(false)

  // Obtener consultas del día seleccionado
  const cargarConsultas = async (fecha: Date) => {
    try {
      setCargando(true)
      const consultasDelDia = await obtenerConsultasDelDia(fecha)
      setConsultas(consultasDelDia)
    } catch (error) {
      console.error('Error al cargar consultas:', error)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarConsultas(fechaSeleccionada)
  }, [fechaSeleccionada, usuarioId])

  const formatearHora = (fecha: Date) => {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const obtenerColorEstado = (estado: EstadoConsulta) => {
    const colores = {
      PROGRAMADO: 'bg-blue-100 text-blue-800',
      CONFIRMADO: 'bg-green-100 text-green-800',
      CANCELADO: 'bg-red-100 text-red-800',
      AUSENTE: 'bg-orange-100 text-orange-800',
      COMPLETADO: 'bg-purple-100 text-purple-800',
      REAGENDADO: 'bg-yellow-100 text-yellow-800',
    }
    return colores[estado] || 'bg-gray-100 text-gray-800'
  }

  const navegarDia = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaSeleccionada)
    nuevaFecha.setDate(nuevaFecha.getDate() + (direccion === 'siguiente' ? 1 : -1))
    setFechaSeleccionada(nuevaFecha)
  }

  const irAHoy = () => {
    setFechaSeleccionada(new Date())
  }

  const handleCrearConsulta = async (datos: {
    pacienteId: string;
    inicio: string;
    fin: string;
    lugar?: string;
    notas?: string;
  }) => {
    try {
      const resultado = await crearConsultaAction(datos)
      
      if (resultado.success) {
        setMostrarFormulario(false)
        // Recargar consultas
        await cargarConsultas(fechaSeleccionada)
      } else {
        console.error('Error al crear consulta:', resultado.error)
        alert('Error al crear la consulta: ' + resultado.error)
      }
    } catch (error) {
      console.error('Error al crear consulta:', error)
      alert('Error inesperado al crear la consulta')
    }
  }

  const handleEditarConsulta = async (datos: {
    pacienteId: string;
    inicio: string;
    fin: string;
    lugar?: string;
    notas?: string;
  }) => {
    if (!consultaSeleccionada) return
    
    try {
      const resultado = await actualizarConsultaAction(consultaSeleccionada.id, datos)
      
      if (resultado.success) {
        setModoEdicion(false)
        setConsultaSeleccionada(null)
        // Recargar consultas
        await cargarConsultas(fechaSeleccionada)
      } else {
        console.error('Error al editar consulta:', resultado.error)
        alert('Error al editar la consulta: ' + resultado.error)
      }
    } catch (error) {
      console.error('Error al editar consulta:', error)
      alert('Error inesperado al editar la consulta')
    }
  }

  const handleCambiarEstado = async (nuevoEstado: EstadoConsulta) => {
    if (!consultaSeleccionada) return
    
    try {
      const resultado = await cambiarEstadoConsultaAction(consultaSeleccionada.id, nuevoEstado)
      
      if (resultado.success) {
        // Actualizar la consulta seleccionada
        setConsultaSeleccionada(prev => prev ? { ...prev, estado: nuevoEstado } : null)
        // Recargar consultas
        await cargarConsultas(fechaSeleccionada)
      } else {
        console.error('Error al cambiar estado:', resultado.error)
        alert('Error al cambiar el estado: ' + resultado.error)
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      alert('Error inesperado al cambiar el estado')
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agenda de Consultas</h1>
        <p className="text-gray-600">Gestiona tus consultas y horarios</p>
      </div>

      {/* Navegación de fechas */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navegarDia('anterior')}
              variant="outline"
              size="sm"
            >
              ← Anterior
            </Button>
            <Button
              onClick={irAHoy}
              variant="outline"
              size="sm"
            >
              Hoy
            </Button>
            <Button
              onClick={() => navegarDia('siguiente')}
              variant="outline"
              size="sm"
            >
              Siguiente →
            </Button>
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {formatearFecha(fechaSeleccionada)}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setMostrarFormulario(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              + Nueva Consulta
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de consultas */}
      <div className="bg-white rounded-lg shadow-sm border">
        {cargando ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : consultas.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay consultas programadas
            </h3>
            <p className="text-gray-500 mb-4">
              No tienes consultas programadas para este día.
            </p>
            <Button
              onClick={() => setMostrarFormulario(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Programar Consulta
            </Button>
          </div>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="grid gap-3 p-4">
              {consultas.map((consulta) => (
                <div
                  key={consulta.id}
                  className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-blue-300 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => setConsultaSeleccionada(consulta)}
                >
                  <div className="flex items-center justify-between">
                    {/* Información principal */}
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Horario destacado */}
                      <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-semibold min-w-[120px] text-center">
                        <div className="text-sm font-bold">
                          {formatearHora(consulta.inicio)}
                        </div>
                        <div className="text-xs opacity-75">
                          {formatearHora(consulta.fin)}
                        </div>
                      </div>

                      {/* Datos del paciente */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            👤 {consulta.paciente.nombre} {consulta.paciente.apellido}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${obtenerColorEstado(consulta.estado)}`}>
                            {consulta.estado === 'PROGRAMADO' && '📅'}
                            {consulta.estado === 'CONFIRMADO' && '✅'}
                            {consulta.estado === 'CANCELADO' && '❌'}
                            {consulta.estado === 'AUSENTE' && '👻'}
                            {consulta.estado === 'COMPLETADO' && '✨'}
                            {consulta.estado === 'REAGENDADO' && '🔄'}
                            {' '}
                            {consulta.estado}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {consulta.lugar && (
                            <span className="flex items-center space-x-1">
                              <span>📍</span>
                              <span className="truncate max-w-[150px]">{consulta.lugar}</span>
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
                    
                    {/* Botón de acción */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setConsultaSeleccionada(consulta)
                        }}
                        className="hover:bg-blue-50 hover:border-blue-300"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen al final */}
            <div className="bg-gray-50 border-t px-4 py-3 text-center">
              <p className="text-sm text-gray-600">
                📊 Total de consultas: <span className="font-semibold">{consultas.length}</span>
                {consultas.filter(c => c.estado === 'CONFIRMADO').length > 0 && (
                  <span className="ml-4">
                    ✅ Confirmadas: <span className="font-semibold text-green-600">
                      {consultas.filter(c => c.estado === 'CONFIRMADO').length}
                    </span>
                  </span>
                )}
                {consultas.filter(c => c.estado === 'COMPLETADO').length > 0 && (
                  <span className="ml-4">
                    ✨ Completadas: <span className="font-semibold text-purple-600">
                      {consultas.filter(c => c.estado === 'COMPLETADO').length}
                    </span>
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal de formulario de consulta */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    📅 Nueva Consulta
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Programa una nueva consulta médica
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setMostrarFormulario(false)}
                  className="h-10 w-10 rounded-full p-0 hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="px-8 py-6">
              <FormularioConsulta
                usuarioId={usuarioId}
                fechaBase={fechaSeleccionada}
                onSubmit={handleCrearConsulta}
                onCancel={() => setMostrarFormulario(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal profesional de detalles/edición de consulta */}
      {consultaSeleccionada && (
        <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      👨‍⚕️ {consultaSeleccionada.paciente.nombre} {consultaSeleccionada.paciente.apellido}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${obtenerColorEstado(consultaSeleccionada.estado)}`}>
                      {consultaSeleccionada.estado}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    📅 {formatearFecha(new Date(consultaSeleccionada.inicio))} • ⏰ {formatearHora(consultaSeleccionada.inicio)} - {formatearHora(consultaSeleccionada.fin)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setConsultaSeleccionada(null)
                    setModoEdicion(false)
                  }}
                  className="h-10 w-10 rounded-full p-0 hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>

            <div className="px-8 py-6">
              {modoEdicion ? (
                // Modo edición
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">✏️ Editar Consulta</h3>
                    <p className="text-sm text-gray-500">Modifica los detalles de la consulta</p>
                  </div>
                  
                  <FormularioConsulta
                    usuarioId={usuarioId}
                    consultaInicial={{
                      pacienteId: consultaSeleccionada.pacienteId,
                      inicio: new Date(consultaSeleccionada.inicio).toISOString().slice(0, 16),
                      fin: new Date(consultaSeleccionada.fin).toISOString().slice(0, 16),
                      lugar: consultaSeleccionada.lugar || '',
                      notas: consultaSeleccionada.notas || ''
                    }}
                    onSubmit={handleEditarConsulta}
                    onCancel={() => setModoEdicion(false)}
                  />
                </div>
              ) : (
                // Modo visualización
                <div>
                  {/* Acciones rápidas de estado */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🚦 Cambiar Estado</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(EstadoConsulta).map((estado) => (
                        <Button
                          key={estado}
                          variant={consultaSeleccionada.estado === estado ? "primary" : "outline"}
                          size="sm"
                          onClick={() => handleCambiarEstado(estado)}
                          disabled={consultaSeleccionada.estado === estado}
                          className={`${consultaSeleccionada.estado === estado ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                          {estado === 'PROGRAMADO' && '📅'}
                          {estado === 'CONFIRMADO' && '✅'}
                          {estado === 'CANCELADO' && '❌'}
                          {estado === 'AUSENTE' && '👻'}
                          {estado === 'COMPLETADO' && '✨'}
                          {estado === 'REAGENDADO' && '🔄'}
                          {' '}
                          {estado}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Detalles de la consulta */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Información del paciente */}
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">👤 Información del Paciente</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">Nombre Completo</label>
                          <p className="text-blue-900 font-medium">
                            {consultaSeleccionada.paciente.nombre} {consultaSeleccionada.paciente.apellido}
                          </p>
                        </div>
                        {consultaSeleccionada.paciente.email && (
                          <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Email</label>
                            <p className="text-blue-800">{consultaSeleccionada.paciente.email}</p>
                          </div>
                        )}
                        {consultaSeleccionada.paciente.telefono && (
                          <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Teléfono</label>
                            <p className="text-blue-800">{consultaSeleccionada.paciente.telefono}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Detalles de la consulta */}
                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-green-900 mb-4">📋 Detalles de la Consulta</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-green-700 mb-1">Horario</label>
                          <p className="text-green-900 font-medium">
                            {formatearHora(consultaSeleccionada.inicio)} - {formatearHora(consultaSeleccionada.fin)}
                          </p>
                        </div>
                        
                        {consultaSeleccionada.lugar && (
                          <div>
                            <label className="block text-sm font-medium text-green-700 mb-1">Lugar</label>
                            <p className="text-green-800">📍 {consultaSeleccionada.lugar}</p>
                          </div>
                        )}
                        
                        <div>
                          <label className="block text-sm font-medium text-green-700 mb-1">Estado Actual</label>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${obtenerColorEstado(consultaSeleccionada.estado)}`}>
                            {consultaSeleccionada.estado}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notas */}
                  {consultaSeleccionada.notas && (
                    <div className="mt-8 bg-yellow-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-yellow-900 mb-4">📝 Notas</h3>
                      <p className="text-yellow-800 leading-relaxed">{consultaSeleccionada.notas}</p>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Creado el {new Date(consultaSeleccionada.creadoEn).toLocaleDateString('es-ES')}
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setConsultaSeleccionada(null)
                          setModoEdicion(false)
                        }}
                      >
                        Cerrar
                      </Button>
                      <Button 
                        onClick={() => setModoEdicion(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        ✏️ Editar Consulta
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
