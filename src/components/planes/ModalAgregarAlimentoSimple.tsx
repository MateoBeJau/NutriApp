"use client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  comidaId: string;
  pacienteId: string;
}

export default function ModalAgregarAlimentoSimple({ isOpen, onClose, comidaId, pacienteId }: Props) {
  console.log('Modal Simple - isOpen:', isOpen);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay de fondo */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Agregar Alimento
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              <p className="text-gray-600">
                Comida ID: {comidaId}
              </p>
              <p className="text-gray-600">
                Paciente ID: {pacienteId}
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h3 className="font-medium text-yellow-800 mb-2">
                  🚧 Funcionalidad en desarrollo
                </h3>
                <p className="text-yellow-700 text-sm">
                  Para probar el sistema, primero necesitamos agregar algunos alimentos básicos.
                </p>
                <p className="text-yellow-700 text-sm mt-2">
                  Ve a <strong>/dashboard/alimentos</strong> y agrega algunos alimentos como:
                </p>
                <ul className="list-disc list-inside text-yellow-700 text-sm mt-2 ml-4">
                  <li>Manzana (Frutas)</li>
                  <li>Pollo (Carnes)</li>
                  <li>Arroz integral (Cereales)</li>
                  <li>Leche (Lácteos)</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="font-medium text-blue-800 mb-2">
                  ✨ Próximas funcionalidades
                </h3>
                <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                  <li>Búsqueda inteligente de alimentos</li>
                  <li>Filtrado por alergias y restricciones</li>
                  <li>Cálculo nutricional automático</li>
                  <li>Sugerencias basadas en gustos del paciente</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                alert('¡Funcionalidad completa próximamente!');
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
