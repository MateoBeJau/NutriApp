'use client';

import { useState } from 'react';
import { generarPlanPreview, guardarPlanConfirmado } from '@/app/dashboard/planes/generar-plan-preview-actions';
import PlanPreviewModal from './PlanPreviewModal';

interface GenerarPlanButtonProps {
  pacienteId: string;
  onGenerating?: (isGenerating: boolean) => void;
  onPlanGenerado?: () => void;
}

export function GenerarPlanButton({ pacienteId, onGenerating, onPlanGenerado }: GenerarPlanButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [planData, setPlanData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerarPlan = async () => {
    try {
      setIsGenerating(true);
      onGenerating?.(true);
      
      const result = await generarPlanPreview(pacienteId);
      
      if (result.success) {
        setPlanData(result.plan);
        setShowPreview(true);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Error al generar el plan nutricional');
      console.error(error);
    } finally {
      setIsGenerating(false);
      onGenerating?.(false);
    }
  };

  const handleConfirmSave = async (editedPlanData: any) => {
    if (!editedPlanData) return;

    setIsSaving(true);

    try {
      const result = await guardarPlanConfirmado(pacienteId, editedPlanData);
      
      if (result.success) {
        alert('Plan nutricional guardado exitosamente');
        setShowPreview(false);
        setPlanData(null);
        // Notificar que se generó un nuevo plan
        onPlanGenerado?.();
      } else {
        alert(`Error al guardar: ${result.error}`);
      }
    } catch (error) {
      console.error('Error al guardar plan:', error);
      alert('Error al guardar el plan nutricional');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setPlanData(null);
  };

  return (
    <>
      <button
        onClick={handleGenerarPlan}
        disabled={isGenerating}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generando plan...
          </>
        ) : (
          'Generar plan con IA'
        )}
      </button>

      <PlanPreviewModal
        isOpen={showPreview}
        onClose={handleClosePreview}
        onConfirm={handleConfirmSave}
        planData={planData}
        isLoading={isSaving}
      />
    </>
  );
}