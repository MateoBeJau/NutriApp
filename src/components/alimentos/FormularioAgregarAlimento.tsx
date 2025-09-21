"use client";

import { useState } from "react";
import { crearAlimentoAction } from "@/app/dashboard/planes/actions";

export default function FormularioAgregarAlimento() {
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensaje(null);
    setError(null);
    setSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    const res = await crearAlimentoAction(formData);
    
    setSubmitting(false);
    if (res.success) {
      setMensaje("Alimento agregado correctamente");
      // Resetear el formulario de forma segura
      const form = event.currentTarget;
      if (form) {
        form.reset();
      }
      // Recargar la página para mostrar el nuevo alimento
      window.location.reload();
    } else {
      setError(res.error || "Error al agregar alimento");
    }
  }

  return (
    <form className="bg-white p-4 rounded shadow mb-8" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-4">Agregar nuevo alimento</h2>
      
      {/* Campos básicos requeridos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre *</label>
          <input 
            name="nombre" 
            required 
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Ej: Manzana, Pollo, Arroz integral"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría *</label>
          <select name="categoria" required className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Seleccionar categoría</option>
            <option value="Frutas">Frutas</option>
            <option value="Vegetales">Vegetales</option>
            <option value="Carnes">Carnes</option>
            <option value="Pescados">Pescados</option>
            <option value="Lácteos">Lácteos</option>
            <option value="Cereales">Cereales</option>
            <option value="Legumbres">Legumbres</option>
            <option value="Huevos">Huevos</option>
            <option value="Aceites">Aceites</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
      </div>

      {/* Campos opcionales en sección colapsable */}
      <details className="mb-4">
        <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800 mb-4">
          ⚙️ Información nutricional y restricciones (opcional)
        </summary>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded">
          <div>
            <label className="block text-sm font-medium text-gray-700">Calorías por 100g</label>
            <input name="caloriasPor100g" type="number" step="0.1" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Proteínas por 100g</label>
            <input name="proteinasPor100g" type="number" step="0.1" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Carbohidratos por 100g</label>
            <input name="carbohidratosPor100g" type="number" step="0.1" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Grasas por 100g</label>
            <input name="grasasPor100g" type="number" step="0.1" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fibra por 100g</label>
            <input name="fibraPor100g" type="number" step="0.1" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Alergenos</label>
            <input name="alergenos" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="gluten,lactosa,nueces" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Restricciones</label>
            <input name="restricciones" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="vegano,sin_gluten,sin_lactosa" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Características</label>
            <input name="caracteristicas" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="bajo_sodio,alto_proteina" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Apto para Diabetes</label>
            <select name="aptoParaDiabetes" className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Apto para Hipertensión</label>
            <select name="aptoParaHipertension" className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
      </details>
      <div className="mt-4 flex gap-4 items-center">
        <button 
          type="submit" 
          disabled={submitting} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Agregando..." : "Agregar alimento"}
        </button>
        {mensaje && <span className="text-green-600">{mensaje}</span>}
        {error && <span className="text-red-600">{error}</span>}
      </div>
    </form>
  );
}
