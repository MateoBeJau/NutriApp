'use client'

import { useState, useEffect, useCallback } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { obtenerPacientesActivosAction } from '@/app/dashboard/agenda/server-actions'

interface Paciente {
  id: string
  nombre: string
  apellido: string
  email?: string | null
  telefono?: string | null
}

interface FormularioConsultaProps {
  onSubmit: (datos: FormularioConsultaData) => void
  onCancel: () => void
  consultaInicial?: FormularioConsultaData
  fechaBase?: Date
  usuarioId: string
}

interface FormularioConsultaData {
  pacienteId: string
  inicio: string
  fin: string
  lugar?: string
  notas?: string
}

export function FormularioConsulta({ onSubmit, onCancel, consultaInicial, fechaBase, usuarioId }: FormularioConsultaProps) {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [cargando, setCargando] = useState(true)
  const [formData, setFormData] = useState<FormularioConsultaData>({
    pacienteId: consultaInicial?.pacienteId || '',
    inicio: consultaInicial?.inicio
      ? new Date(consultaInicial.inicio).toISOString().slice(0, 16)
      : fechaBase
        ? new Date(fechaBase).toISOString().slice(0, 16)
        : '',
    fin: consultaInicial?.fin
      ? new Date(consultaInicial.fin).toISOString().slice(0, 16)
      : fechaBase
        ? (() => {
            const base = new Date(fechaBase)
            base.setMinutes(base.getMinutes() + 30)
            return base.toISOString().slice(0, 16)
          })()
        : '',
    lugar: consultaInicial?.lugar || '',
    notas: consultaInicial?.notas || '',
  })

  const cargarPacientes = useCallback(async () => {
    try {
      setCargando(true)
      if (!usuarioId) return
      const pacientesData = await obtenerPacientesActivosAction()
      setPacientes(pacientesData)
    } catch (error) {
      console.error('Error al cargar pacientes:', error)
    } finally {
      setCargando(false)
    }
  }, [usuarioId])

  useEffect(() => {
    cargarPacientes()
  }, [cargarPacientes])

  // Generar horarios escalonados cada 30 minutos
  const generarHorariosEscalonados = () => {
    const horarios = []
    for (let hora = 7; hora <= 20; hora++) {
      // Hora en punto (ej: 9:00)
      horarios.push(`${hora.toString().padStart(2, '0')}:00`)
      // Media hora (ej: 9:30)
      horarios.push(`${hora.toString().padStart(2, '0')}:30`)
    }
    return horarios
  }

  // Formatear hora para mostrar en el select (ej: "09:00" -> "9:00 AM")
  const formatearHoraSelect = (hora: string) => {
    const [horas, minutos] = hora.split(':')
    const horaNum = parseInt(horas)
    const ampm = horaNum >= 12 ? 'PM' : 'AM'
    const hora12 = horaNum > 12 ? horaNum - 12 : horaNum === 0 ? 12 : horaNum
    return `${hora12}:${minutos} ${ampm}`
  }

  // Obtener la hora siguiente (30 minutos después)
  const obtenerHoraSiguiente = (hora: string) => {
    const [horas, minutos] = hora.split(':')
    let horaNum = parseInt(horas)
    let minutoNum = parseInt(minutos)
    
    if (minutoNum === 0) {
      minutoNum = 30
    } else {
      minutoNum = 0
      horaNum += 1
    }
    
    return `${horaNum.toString().padStart(2, '0')}:${minutoNum.toString().padStart(2, '0')}`
  }

  // Manejar cambio de fecha de inicio
  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFecha = e.target.value
    const horaActual = formData.inicio ? formData.inicio.split('T')[1] : ''
    
    setFormData(prev => ({
      ...prev,
      inicio: nuevaFecha && horaActual ? `${nuevaFecha}T${horaActual}` : '',
      fin: nuevaFecha && horaActual ? `${nuevaFecha}T${obtenerHoraSiguiente(horaActual)}` : ''
    }))
  }

  // Manejar cambio de hora de inicio
  const handleHoraInicioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevaHora = e.target.value
    const fechaActual = formData.inicio ? formData.inicio.split('T')[0] : 
                      fechaBase ? fechaBase.toISOString().split('T')[0] : ''
    
    if (fechaActual && nuevaHora) {
      const horaSiguiente = obtenerHoraSiguiente(nuevaHora)
      setFormData(prev => ({
        ...prev,
        inicio: `${fechaActual}T${nuevaHora}`,
        fin: `${fechaActual}T${horaSiguiente}`
      }))
    }
  }

  // Manejar cambio de fecha de fin
  const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFecha = e.target.value
    const horaActual = formData.fin ? formData.fin.split('T')[1] : ''
    
    setFormData(prev => ({
      ...prev,
      fin: nuevaFecha && horaActual ? `${nuevaFecha}T${horaActual}` : ''
    }))
  }

  // Manejar cambio de hora de fin
  const handleHoraFinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevaHora = e.target.value
    const fechaActual = formData.fin ? formData.fin.split('T')[0] : 
                      fechaBase ? fechaBase.toISOString().split('T')[0] : ''
    
    if (fechaActual && nuevaHora) {
      setFormData(prev => ({
        ...prev,
        fin: `${fechaActual}T${nuevaHora}`
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!formData.pacienteId || !formData.inicio || !formData.fin) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    onSubmit(formData)
  }

  // Manejar cambios de campos de texto (lugar, notas, paciente)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Paciente *
        </label>
        <Select
          name="pacienteId"
          value={formData.pacienteId}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar paciente</option>
          {pacientes.map((paciente) => (
            <option key={paciente.id} value={paciente.id}>
              {paciente.nombre} {paciente.apellido}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha y Hora de Inicio *
          </label>
          <div className="space-y-2">
            <Input
              type="date"
              name="fechaInicio"
              value={formData.inicio ? formData.inicio.split('T')[0] : ''}
              onChange={handleFechaChange}
              required
            />
            <select
              name="horaInicio"
              value={formData.inicio ? formData.inicio.split('T')[1] : ''}
              onChange={handleHoraInicioChange}
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none transition-colors"
            >
              <option value="">Seleccionar hora</option>
              {generarHorariosEscalonados().map((hora) => (
                <option key={hora} value={hora}>
                  {formatearHoraSelect(hora)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha y Hora de Fin *
          </label>
          <div className="space-y-2">
            <Input
              type="date"
              name="fechaFin"
              value={formData.fin ? formData.fin.split('T')[0] : ''}
              onChange={handleFechaFinChange}
              required
            />
            <select
              name="horaFin"
              value={formData.fin ? formData.fin.split('T')[1] : ''}
              onChange={handleHoraFinChange}
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none transition-colors"
            >
              <option value="">Seleccionar hora</option>
              {generarHorariosEscalonados().map((hora) => (
                <option key={hora} value={hora}>
                  {formatearHoraSelect(hora)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lugar
        </label>
        <Input
          type="text"
          name="lugar"
          value={formData.lugar}
          onChange={handleChange}
          placeholder="Ej: Consultorio 1, Online, etc."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas
        </label>
        <textarea
          name="notas"
          value={formData.notas}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Notas adicionales sobre la consulta..."
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700"
          disabled={!formData.pacienteId}
        >
          {consultaInicial ? 'Actualizar Consulta' : 'Crear Consulta'}
        </Button>
      </div>
    </form>
  )
}
