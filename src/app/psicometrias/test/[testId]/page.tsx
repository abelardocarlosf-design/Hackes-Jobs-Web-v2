'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, ShieldAlert, Brain } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface CatItem {
  id: string;
  questionText: string;
  options: string; // JSON string
}

export default function CatTestLauncher({ params }: { params: { testId: string } }) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<CatItem | null>(null);
  const [parsedOptions, setParsedOptions] = useState<{id: string, text: string}[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [progress, setProgress] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState(0);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Iniciar la sesión CAT al montar el componente
  useEffect(() => {
    const initCatSession = async () => {
      if (isAuthLoading) return;
      if (!user) {
        router.push('/login?redirect=/psicometrias/test/' + params.testId);
        return;
      }

      try {
        const res = await fetch('/api/psicometrias/cat/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.userId, testId: params.testId })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Error al iniciar la prueba');
        }

        setSessionId(data.sessionId);
        setCurrentItem(data.nextItem);
        setIsPremium(data.isPremium || false);
        setPrice(data.price || 0);
        setParsedOptions(JSON.parse(data.nextItem.options));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsInitializing(false);
      }
    };

    initCatSession();
  }, [user, isAuthLoading, params.testId, router]);
  
  const handleUnlock = async () => {
    setIsUnlocking(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId: params.testId })
      });
      const data = await res.json();
      
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        if (res.status === 401 || res.status === 403) {
          router.push('/login?redirect=/psicometrias/test/' + params.testId);
        } else {
          alert(data.message || 'Error al iniciar el pago');
        }
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption || !sessionId || !currentItem) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/psicometrias/cat/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId, 
          itemId: currentItem.id, 
          selectedOptionId: selectedOption 
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al enviar respuesta');
      }

      setProgress(p => p + 1);

      if (data.isCompleted) {
        setIsFinished(true);
      } else {
        setCurrentItem(data.nextItem);
        setParsedOptions(JSON.parse(data.nextItem.options));
        setSelectedOption(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isInitializing || isAuthLoading) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center p-8 font-sans">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-brand-orange mb-6"
        >
          <Brain size={48} />
        </motion.div>
        <h2 className="text-xl font-black text-white uppercase tracking-widest animate-pulse">
          Calibrando Motor Adaptativo...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-8 font-sans">
        <div className="bg-white/5 border border-red-500/30 p-8 rounded-3xl max-w-md text-center">
          <ShieldAlert size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">Error</h2>
          <p className="text-slate-400 font-medium mb-6">{error}</p>
          <button onClick={() => router.push('/psicometrias')} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">
            Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

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
            {isPremium 
              ? `Has finalizado el test. Para desbloquear y visualizar tu reporte psicométrico avanzado, por favor realiza el pago de $${price} USD.`
              : `El motor CAT ha estimado tu perfil con alta precisión. Tus resultados han sido guardados y asegurados.`}
          </p>
          {isPremium ? (
            <button 
              onClick={handleUnlock}
              disabled={isUnlocking}
              className="w-full h-14 bg-brand-orange text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-brand-orange/90 transition-colors flex items-center justify-center gap-2"
            >
              {isUnlocking ? 'Cargando Pasarela...' : `Desbloquear Reporte ($${price} USD)`}
            </button>
          ) : (
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full h-14 bg-brand-orange text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-brand-orange/90 transition-colors"
            >
              Volver al Hub
            </button>
          )}
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
            <span className="animate-pulse">En Progreso</span>
          </div>
        </div>
      </header>

      {/* ─── PROGRESS BAR (Simulada por iteraciones) ─── */}
      <div className="h-1 bg-white/5 w-full">
        <motion.div 
          className="h-full bg-gradient-to-r from-brand-orange to-brand-blue"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((progress / 10) * 100, 95)}%` }}
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
                {parsedOptions.map((option) => (
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
