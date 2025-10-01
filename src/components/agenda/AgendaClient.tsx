'use client'

import { useState, useEffect } from 'react'
import { ConsultaConPaciente, EstadoConsulta } from '@/types/consulta'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import { FormularioConsulta } from '@/components/consultas/FormularioConsulta'
import MedicionesConsulta from '@/components/consultas/MedicionesConsulta'
import { obtenerConsultasDelDia, crearConsultaAction, actualizarConsultaAction, cambiarEstadoConsultaAction } from '@/app/dashboard/agenda/server-actions'
import { eliminarConsultaAction } from '@/app/dashboard/pacientes/consultas-actions'
import { buscarConsultaPorIdAction } from '@/app/dashboard/agenda/buscar-consulta-actions'
import { useSearchParams } from 'next/navigation'

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
  const searchParams = useSearchParams()

  // Obtener consultas del día seleccionado
  const cargarConsultas = async (fecha: Date) => {
    try {
      setCargando(true)
      console.log('📊 Cargando consultas para:', fecha.toDateString())
      const consultasDelDia = await obtenerConsultasDelDia(fecha)
      console.log('📊 Consultas cargadas:', consultasDelDia.length, consultasDelDia.map(c => c.id))
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

  // ✅ Manejar parámetros de URL para establecer fecha inicial
  useEffect(() => {
    const fechaParam = searchParams.get('fecha')
    const consultaParam = searchParams.get('consulta')

    console.log('🔍 Parámetros de URL detectados:', { fecha: fechaParam, consulta: consultaParam })

    // Si hay una fecha en la URL, establecerla solo una vez al cargar
    if (fechaParam) {
      const fechaDesdeUrl = new Date(fechaParam)
      if (!isNaN(fechaDesdeUrl.getTime())) {
        console.log('📅 Estableciendo fecha desde URL:', fechaDesdeUrl)
        setFechaSeleccionada(fechaDesdeUrl)
      }
    }
  }, [searchParams]) // Solo depende de searchParams, no de consultas

  // ✅ Manejar apertura de consulta específica cuando se cargan las consultas
  useEffect(() => {
    const consultaParam = searchParams.get('consulta')

    // Si hay una consulta específica y las consultas ya se cargaron, abrirla
    if (consultaParam && !cargando && !consultaSeleccionada) {
      // Primero buscar en las consultas actuales
      const consultaEncontrada = consultas.find(c => c.id === consultaParam)
      
      if (consultaEncontrada) {
        console.log('🎯 Consulta encontrada en día actual, abriendo modal:', consultaEncontrada.id)
        setConsultaSeleccionada(consultaEncontrada)
        setModoEdicion(false)
        
        // Limpiar los parámetros de URL para evitar loops
        const url = new URL(window.location.href)
        url.searchParams.delete('consulta')
        window.history.replaceState({}, '', url.toString())
      } else {
        // Si no se encuentra en el día actual, buscar por ID directamente
        console.log('🔍 Consulta no encontrada en día actual, buscando por ID:', consultaParam)
        buscarConsultaPorIdAction(consultaParam).then((consultaEncontrada) => {
          if (consultaEncontrada) {
            console.log('🎯 Consulta encontrada por ID, abriendo modal:', consultaEncontrada.id)
            setConsultaSeleccionada(consultaEncontrada)
            setModoEdicion(false)
            
            // Limpiar los parámetros de URL para evitar loops
            const url = new URL(window.location.href)
            url.searchParams.delete('consulta')
            window.history.replaceState({}, '', url.toString())
          } else {
            console.error('❌ Consulta no encontrada:', consultaParam)
          }
        }).catch(error => {
          console.error('❌ Error al buscar consulta:', error)
        })
      }
    }
  }, [consultas, cargando, consultaSeleccionada, searchParams])

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

  const handleEliminarConsulta = async (consultaId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta consulta? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      await eliminarConsultaAction(consultaId)
      // Cerrar el modal si la consulta eliminada es la seleccionada
      if (consultaSeleccionada?.id === consultaId) {
        setConsultaSeleccionada(null)
        setModoEdicion(false)
      }
      // Recargar consultas
      await cargarConsultas(fechaSeleccionada)
    } catch (error) {
      console.error('Error al eliminar consulta:', error)
      alert('Error al eliminar la consulta')
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
                            �� {consulta.paciente!.nombre} {consulta.paciente!.apellido}
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
                    
                    {/* Botones de acción */}
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEliminarConsulta(consulta.id)
                        }}
                        className="hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
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
                  <div className="mb-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Cambiar estado de la consulta</h3>
                      <span className="text-xs text-gray-500">Estado actual: {consultaSeleccionada.estado}</span>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {Object.values(EstadoConsulta).map((estado) => (
                        <Button
                          key={estado}
                          variant={consultaSeleccionada.estado === estado ? "primary" : "outline"}
                          size="sm"
                          onClick={() => handleCambiarEstado(estado)}
                          disabled={consultaSeleccionada.estado === estado}
                          className={`text-xs ${consultaSeleccionada.estado === estado ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'}`}
                        >
                          {estado === 'PROGRAMADO' && '📅'}
                          {estado === 'CONFIRMADO' && '✅'}
                          {estado === 'CANCELADO' && '❌'}
                          {estado === 'AUSENTE' && '👻'}
                          {estado === 'COMPLETADO' && '✨'}
                          {estado === 'REAGENDADO' && '🔄'}
                          <span className="ml-1 hidden sm:inline">{estado}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Información de la consulta - Diseño minimalista */}
                  <div className="space-y-6">
                    {/* Info principal en una línea limpia */}
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatearHora(consultaSeleccionada.inicio)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatearHora(consultaSeleccionada.fin)}
                          </div>
                        </div>
                        
                        <div className="h-8 w-px bg-gray-200"></div>
                        
                        <div>
                          <div className="text-sm text-gray-500">Paciente</div>
                          <div className="font-semibold text-gray-900">
                            {consultaSeleccionada.paciente.nombre} {consultaSeleccionada.paciente.apellido}
                          </div>
                        </div>
                        
                        {consultaSeleccionada.lugar && (
                          <>
                            <div className="h-8 w-px bg-gray-200"></div>
                            <div>
                              <div className="text-sm text-gray-500">Lugar</div>
                              <div className="font-medium text-gray-900">{consultaSeleccionada.lugar}</div>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Estado</div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${obtenerColorEstado(consultaSeleccionada.estado)}`}>
                          {consultaSeleccionada.estado}
                        </span>
                      </div>
                    </div>

                    {/* Contacto del paciente - Solo si existe */}
                    {(consultaSeleccionada.paciente.email || consultaSeleccionada.paciente.telefono) && (
                      <div className="flex items-center space-x-8 py-3 bg-gray-50 rounded-lg px-4">
                        {consultaSeleccionada.paciente.email && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>{consultaSeleccionada.paciente.email}</span>
                          </div>
                        )}
                        
                        {consultaSeleccionada.paciente.telefono && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{consultaSeleccionada.paciente.telefono}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Notas */}
                  {consultaSeleccionada.notas && (
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Notas de la consulta</h4>
                          <p className="text-gray-700 leading-relaxed">{consultaSeleccionada.notas}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mediciones de la consulta */}
                  <div className="mt-8">
                    <MedicionesConsulta
                      consultaId={consultaSeleccionada.id}
                      pacienteId={consultaSeleccionada.pacienteId}
                      medicionesExistentes={consultaSeleccionada.mediciones || []}
                      onMedicionAgregada={() => cargarConsultas(fechaSeleccionada)}
                    />
                  </div>

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
                        variant="outline"
                        onClick={() => handleEliminarConsulta(consultaSeleccionada.id)}
                        className="text-red-600 hover:bg-red-50 hover:border-red-300"
                      >
                        🗑️ Eliminar Consulta
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
