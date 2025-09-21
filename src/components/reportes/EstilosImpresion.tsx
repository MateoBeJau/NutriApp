"use client";

import { useEffect } from 'react';

export default function EstilosImpresion() {
  useEffect(() => {
    // Crear estilos para impresión
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body { margin: 0 !important; }
        .print\\:hidden { display: none !important; }
        .print\\:max-w-none { max-width: none !important; }
        .print\\:mx-0 { margin-left: 0 !important; margin-right: 0 !important; }
        .print\\:py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
        .shadow, .shadow-sm, .shadow-lg, .shadow-xl, .shadow-2xl { 
          box-shadow: none !important; 
        }
        .bg-gray-50 { 
          background-color: white !important; 
        }
        .border { 
          border: 1px solid #e5e7eb !important; 
        }
        .rounded-lg, .rounded-xl { 
          border-radius: 0.5rem !important; 
        }
        .print\\:break-before { 
          page-break-before: always !important; 
        }
      }
    `;
    document.head.appendChild(style);

    // Limpiar al desmontar
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}
