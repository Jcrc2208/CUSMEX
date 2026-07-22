import React from 'react';
import { Sparkles } from 'lucide-react';

export default function FloatingAIButton({ onNavigate }) {
  const handleClick = () => {
    // Si usas React Router o navegación por estado/hash:
    if (onNavigate) {
      onNavigate('Assistant.jsx'); // O el id/ruta correspondiente a Assistant.jsx
    } else {
      window.location.hash = '#asistente-ia';
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Abrir Asistente IA"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
    >
      <Sparkles className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform" />
      <span className="hidden sm:inline font-medium text-sm">
        Asistente IA
      </span>
    </button>
  );
}