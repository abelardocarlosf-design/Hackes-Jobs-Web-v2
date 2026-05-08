'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, ShieldAlert } from 'lucide-react';

interface CatItem {
  id: string;
  questionText: string;
  options: { id: string; text: string }[];
}

export default function CatAssessmentPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const [currentItem, setCurrentItem] = useState<CatItem | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState({ answered: 0, maxItems: 20 });
  const [isFinished, setIsFinished] = useState(false);

  // MOCK: Carga inicial de la primera pregunta
  useEffect(() => {
    // Aquí se llamaría a /api/cat/start o se conectaría al backend de Node.js/Python
    setCurrentItem({
      id: 'mock-1',
      questionText: 'Si un tren viaja a 60 km/h y otro a 80 km/h en direcciones opuestas, ¿qué concepto matemático describe mejor su punto de encuentro?',
      options: [
        { id: 'a', text: 'Tasa de convergencia relativa' },
        { id: 'b', text: 'Ecuaciones diferenciales lineales' },
        { id: 'c', text: 'Cinemática vectorial básica' },
        { id: 'd', text: 'Proporcionalidad inversa' }
      ]
    });
  }, [params.sessionId]);

  const handleSubmit = async () => {
    if (!selectedOption) return;
    setIsSubmitting(true);

    // MOCK: Simular envío al backend para recalcular theta y obtener la siguiente pregunta
    await new Promise(resolve => setTimeout(resolve, 800));

    if (progress.answered >= 4) {
      // MOCK: Condición de parada cumplida (SE < umbral)
      setIsFinished(true);
      return;
    }

    setProgress(p => ({ ...p, answered: p.answered + 1 }));
    setCurrentItem({
      id: `mock-${progress.answered + 2}`,
      questionText: '¿Cuál es el resultado de evaluar el límite de (sin x)/x cuando x tiende a 0?',
      options: [
        { id: 'a', text: '1' },
        { id: 'b', text: '0' },
        { id: 'c', text: 'Infinito' },
        { id: 'd', text: 'Indeterminado' }
      ]
    });
    setSelectedOption(null);
    setIsSubmitting(false);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-8 font-sans selection:bg-brand-orange/30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-12 text-center"
        >
          <div className="w-20 h-20 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-8 text-brand-orange">
            <Check size={40} />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Evaluación Completada</h2>
          <p className="text-slate-400 font-medium mb-12">
            El motor CAT ha estimado tu perfil cognitivo con alta precisión. Tus resultados han sido guardados.
          </p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full h-14 bg-brand-orange text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-brand-orange/90 transition-colors"
          >
            Volver al Hub
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black flex flex-col font-sans selection:bg-brand-orange/30">
      
      {/* ─── HEADER MODO FOCO ────────────────────────── */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 lg:px-16 shrink-0">
        <div className="flex items-center gap-4">
          <ShieldAlert className="text-brand-orange" size={24} />
          <div>
            <h1 className="text-white font-black uppercase tracking-widest text-xs">Evaluación Psicométrica</h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Motor Adaptativo (CAT)</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs bg-white/5 px-4 py-2 rounded-lg">
            <Clock size={16} />
            <span>04:59</span>
          </div>
        </div>
      </header>

      {/* ─── PROGRESS BAR ────────────────────────────── */}
      <div className="h-1 bg-white/5 w-full">
        <motion.div 
          className="h-full bg-gradient-to-r from-brand-orange to-brand-blue"
          initial={{ width: 0 }}
          animate={{ width: `${(progress.answered / progress.maxItems) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* ─── MAIN CONTENT (PREGUNTA) ─────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16">
        <AnimatePresence mode="wait">
          {currentItem && (
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-3xl"
            >
              <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-12">
                {currentItem.questionText}
              </h2>

              <div className="space-y-4">
                {currentItem.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`w-full text-left p-6 lg:p-8 rounded-2xl border-2 transition-all duration-300 group flex items-center justify-between
                      ${selectedOption === option.id 
                        ? 'border-brand-orange bg-brand-orange/10' 
                        : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'
                      }`}
                  >
                    <span className={`text-lg font-bold transition-colors ${selectedOption === option.id ? 'text-brand-orange' : 'text-slate-300 group-hover:text-white'}`}>
                      {option.text}
                    </span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                      ${selectedOption === option.id ? 'border-brand-orange bg-brand-orange' : 'border-slate-600'}`}
                    >
                      {selectedOption === option.id && <Check size={14} className="text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-12 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedOption || isSubmitting}
                  className="h-16 px-12 bg-white text-brand-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Procesando...' : 'Siguiente Pregunta'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
    </div>
  );
}
