'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { agregarMedicionConsultaAction } from '@/app/dashboard/agenda/server-actions'

interface MedicionesConsultaProps {
  consultaId: string
  pacienteId: string
  medicionesExistentes: Array<{
    id: string
    fecha: Date
    pesoKg?: number
    alturaCm?: number
    imc?: number
    notas?: string
  }>
  onMedicionAgregada: () => void
}

export default function MedicionesConsulta({ 
  consultaId, 
  pacienteId, 
  medicionesExistentes, 
  onMedicionAgregada 
}: MedicionesConsultaProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [formData, setFormData] = useState({
    pesoKg: '',
    alturaCm: '',
    notas: ''
  })

  const calcularIMC = (peso: number, altura: number) => {
    if (peso > 0 && altura > 0) {
      const alturaEnMetros = altura / 100
      return (peso / (alturaEnMetros * alturaEnMetros)).toFixed(1)
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const peso = parseFloat(formData.pesoKg)
    const altura = parseFloat(formData.alturaCm)
    
    if (!peso && !altura) {
      alert('Debes ingresar al menos el peso o la altura')
      return
    }

    setGuardando(true)
    
    try {
      const imc = peso && altura ? parseFloat(calcularIMC(peso, altura) || '0') : undefined
      
      const resultado = await agregarMedicionConsultaAction({
        consultaId,
        pacienteId,
        pesoKg: peso || undefined,
        alturaCm: altura || undefined,
        imc,
        notas: formData.notas || undefined
      })

      if (resultado.success) {
        setFormData({ pesoKg: '', alturaCm: '', notas: '' })
        setMostrarFormulario(false)
        onMedicionAgregada()
      } else {
        alert('Error al agregar medición: ' + resultado.error)
      }
    } catch (error) {
      console.error('Error al agregar medición:', error)
      alert('Error inesperado al agregar la medición')
    } finally {
      setGuardando(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const pesoActual = parseFloat(formData.pesoKg)
  const alturaActual = parseFloat(formData.alturaCm)
  const imcCalculado = pesoActual && alturaActual ? calcularIMC(pesoActual, alturaActual) : null

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      {/* Header minimalista */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-5 h-5">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 00-2-2m0 0V9a2 2 0 012-2h2a2 2 0 00-2-2" />
            </svg>
          </div>
          <h4 className="text-sm font-medium text-gray-900">Mediciones registradas</h4>
        </div>
        
        {!mostrarFormulario && (
          <Button
            onClick={() => setMostrarFormulario(true)}
            size="sm"
            variant="outline"
            className="text-xs hover:bg-gray-50"
          >
            + Agregar
          </Button>
        )}
      </div>

      {/* Mediciones existentes - Layout horizontal minimalista */}
      {medicionesExistentes.length > 0 ? (
        <div className="space-y-3 mb-6">
          {medicionesExistentes.map((medicion) => (
            <div key={medicion.id} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-6">
                {medicion.pesoKg && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 w-8">Peso</span>
                    <span className="font-semibold text-gray-900">{medicion.pesoKg} kg</span>
                  </div>
                )}
                
                {medicion.alturaCm && (
                  <>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 w-8">Altura</span>
                      <span className="font-semibold text-gray-900">{medicion.alturaCm} cm</span>
                    </div>
                  </>
                )}
                
                {medicion.imc && (
                  <>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 w-8">IMC</span>
                      <span className="font-semibold text-gray-900">{medicion.imc}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-white text-gray-600 border">
                        {parseFloat(medicion.imc.toString()) < 18.5 && "Bajo"}
                        {parseFloat(medicion.imc.toString()) >= 18.5 && parseFloat(medicion.imc.toString()) < 25 && "Normal"}
                        {parseFloat(medicion.imc.toString()) >= 25 && parseFloat(medicion.imc.toString()) < 30 && "Sobre"}
                        {parseFloat(medicion.imc.toString()) >= 30 && "Obesidad"}
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              {medicion.notas && (
                <div className="text-xs text-gray-500 max-w-xs truncate">
                  {medicion.notas}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <div className="w-8 h-8 mx-auto mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 00-2-2m0 0V9a2 2 0 012-2h2a2 2 0 00-2-2" />
            </svg>
          </div>
          <p className="text-sm">Sin mediciones registradas</p>
        </div>
      )}

      {/* Formulario minimalista */}
      {mostrarFormulario && (
        <div className="border-t border-gray-100 pt-6 mt-6">
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-900 mb-1">Nueva medición</h5>
            <p className="text-xs text-gray-500">Registra los datos antropométricos del paciente</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Peso (kg)
                </label>
                <Input
                  type="number"
                  name="pesoKg"
                  value={formData.pesoKg}
                  onChange={handleChange}
                  placeholder="70.5"
                  step="0.1"
                  min="0"
                  max="300"
                  className="text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Altura (cm)
                </label>
                <Input
                  type="number"
                  name="alturaCm"
                  value={formData.alturaCm}
                  onChange={handleChange}
                  placeholder="175"
                  step="0.1"
                  min="0"
                  max="250"
                  className="text-sm"
                />
              </div>
            </div>

            {/* IMC calculado - Estilo minimalista */}
            {imcCalculado && (
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">IMC calculado:</span>
                  <span className="font-semibold text-gray-900">{imcCalculado}</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-white text-gray-600 border">
                  {parseFloat(imcCalculado) < 18.5 && "Bajo peso"}
                  {parseFloat(imcCalculado) >= 18.5 && parseFloat(imcCalculado) < 25 && "Normal"}
                  {parseFloat(imcCalculado) >= 25 && parseFloat(imcCalculado) < 30 && "Sobrepeso"}
                  {parseFloat(imcCalculado) >= 30 && "Obesidad"}
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                placeholder="Notas sobre las mediciones..."
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setMostrarFormulario(false)
                  setFormData({ pesoKg: '', alturaCm: '', notas: '' })
                }}
                disabled={guardando}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-gray-900 hover:bg-gray-800 text-xs"
                disabled={guardando}
              >
                {guardando ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
