"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Medicion {
  id: string;
  fecha: Date;
  pesoKg?: number;
  alturaCm?: number;
  imc?: number;
  notas?: string;
}

interface Props {
  mediciones: Medicion[];
}

export default function GraficaPeso({ mediciones }: Props) {
  // Filtrar solo mediciones con peso y preparar datos para la gráfica
  const datosGrafica = mediciones
    .filter(m => m.pesoKg)
    .map(medicion => ({
      fecha: medicion.fecha.toLocaleDateString('es-AR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: '2-digit' 
      }),
      peso: medicion.pesoKg,
      imc: medicion.imc,
      fechaCompleta: medicion.fecha.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }));

  if (datosGrafica.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="mt-2">No hay mediciones de peso registradas</p>
        </div>
      </div>
    );
  }

  // Calcular rango de peso para mejor visualización
  const pesos = datosGrafica.map(d => d.peso!);
  const pesoMin = Math.min(...pesos);
  const pesoMax = Math.max(...pesos);
  const margen = (pesoMax - pesoMin) * 0.1 || 5; // 10% de margen o 5kg mínimo

  return (
    <div className="w-full">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={datosGrafica}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="fecha" 
              stroke="#6b7280"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              domain={[pesoMin - margen, pesoMax + margen]}
              label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: any, name: string) => {
                if (name === 'peso') {
                  return [`${value} kg`, 'Peso'];
                }
                if (name === 'imc') {
                  return [`${value?.toFixed(1)}`, 'IMC'];
                }
                return [value, name];
              }}
              labelFormatter={(label: string, payload: any) => {
                if (payload && payload[0]) {
                  return `Fecha: ${payload[0].payload.fechaCompleta}`;
                }
                return `Fecha: ${label}`;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="peso" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2 }}
            />
            {/* Línea de IMC si hay datos */}
            {datosGrafica.some(d => d.imc) && (
              <Line 
                type="monotone" 
                dataKey="imc" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                yAxisId="right"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Leyenda */}
      <div className="flex justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-blue-500 mr-2"></div>
          <span className="text-sm text-gray-600">Peso (kg)</span>
        </div>
        {datosGrafica.some(d => d.imc) && (
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-green-500 border-dashed border-t-2 border-green-500 mr-2"></div>
            <span className="text-sm text-gray-600">IMC</span>
          </div>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-3 gap-4 mt-6 text-center">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Peso mínimo</p>
          <p className="text-lg font-bold text-gray-900">{pesoMin.toFixed(1)} kg</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Peso máximo</p>
          <p className="text-lg font-bold text-gray-900">{pesoMax.toFixed(1)} kg</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Variación</p>
          <p className="text-lg font-bold text-gray-900">{(pesoMax - pesoMin).toFixed(1)} kg</p>
        </div>
      </div>
    </div>
  );
}
