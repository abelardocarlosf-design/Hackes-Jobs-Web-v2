'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Clock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface TestAplicacionBaseProps {
  slug: string;
  totalQuestions: number;
  answeredQuestions: number;
  timeLimitMinutes?: number;
  onFinalSubmit: () => any;
  isSaving?: boolean;
  children: React.ReactNode;
}

export function TestAplicacionBase({
  slug,
  totalQuestions,
  answeredQuestions,
  timeLimitMinutes,
  onFinalSubmit,
  isSaving = false,
  children
}: TestAplicacionBaseProps) {
  const router = useRouter();
  const [startTime] = useState<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState<number | null>(
    timeLimitMinutes ? timeLimitMinutes * 60 : null
  );
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [leadData, setLeadData] = useState<any>(null);

  useEffect(() => {
    // Verificar que el usuario llenó el formulario
    const lead = sessionStorage.getItem(`hj_lead_${slug}`);
    if (!lead) {
      router.push(`/psicometrias/${slug}`);
    } else {
      setLeadData(JSON.parse(lead));
    }
  }, [slug, router]);

  const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100) || 0;
  const isComplete = answeredQuestions >= totalQuestions;

  // Manejo del cronómetro
  useEffect(() => {
    if (timeLeft === null || isProcessing) return;

    if (timeLeft <= 0) {
      handleConfirmSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isProcessing]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleConfirmSubmit = async (timeOut = false) => {
    if (!leadData) return;
    
    setShowConfirmModal(false);
    setIsProcessing(true);
    setErrorMsg(null);
    setProcessStatus('Enviando respuestas...');

    try {
      const testPayload = onFinalSubmit();
      const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);
      const timeSpentMinutes = timeSpentSeconds / 60;
      const fechaAplicacion = new Date().toISOString().split('T')[0];

      // Payload JSON estricto requerido por n8n
      const payload = {
        body: {
          datos_paciente: {
            nombre_completo: leadData.nombre_completo,
            email: leadData.email,
            telefono: leadData.telefono
          },
          datos_prueba: {
            fecha_aplicacion: fechaAplicacion,
            tiempo_completado_minutos: timeSpentMinutes,
            time_out_agotado: timeOut
          },
          respuestas: testPayload
        }
      };

      // 1. Enviar POST a nuestra nueva API route
      const res = await fetch(`/api/psicometrias/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, ...payload })
      });

      if (!res.ok) {
        throw new Error('Error al enviar los datos del test.');
      }

      setProcessStatus('¡Test Completado!');

      // Limpiar localStorage (respuestas) y sessionStorage (lead)
      localStorage.removeItem(`hj_test_${slug}`);
      sessionStorage.removeItem(`hj_lead_${slug}`);
      
      // Redirigir directamente a la pantalla de éxito genérica o al resultado
      // Usaremos un resultId ficticio o lo pasamos si la API lo devuelve, 
      // pero como no hay polling de BD, solo redirigimos a una vista de éxito estática.
      router.push(`/psicometrias/${slug}/resultado?success=true`);

    } catch (err: any) {
      setErrorMsg(err.message || 'Error desconocido.');
      setIsProcessing(false);
    }
  };

  if (!leadData) return null; // Avoid flicker before redirect

  if (isProcessing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <Loader2 className="w-16 h-16 text-brand-orange animate-spin mb-6" />
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">
          {processStatus}
        </h2>
        <p className="text-slate-400">Tus datos están siendo respaldados de forma segura.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-black pt-24 pb-32">
      {/* Top Bar Fixed (Adjusted top to not overlap with global navbar) */}
      <div className="fixed top-20 left-0 right-0 h-16 bg-brand-black/80 backdrop-blur-md border-y border-white/10 z-40 flex items-center px-4 md:px-8 justify-between mt-2">
        <div className="flex items-center gap-4 w-1/3">
          {isSaving ? (
            <span className="text-xs text-brand-orange font-bold uppercase tracking-widest animate-pulse flex items-center gap-2">
              <Loader2 size={12} className="animate-spin" /> Guardando...
            </span>
          ) : (
            <span className="text-xs text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <CheckCircle2 size={12} /> Guardado localmente
            </span>
          )}
        </div>

        <div className="w-1/3 flex justify-center">
          {timeLeft !== null && (
            <div className={`flex items-center gap-2 font-black tracking-widest px-4 py-1.5 rounded-full border ${timeLeft < 300 ? 'text-red-500 border-red-500/20 bg-red-500/10 animate-pulse' : 'text-slate-300 border-white/10 bg-white/5'}`}>
              <Clock size={16} /> {formatTime(timeLeft)}
            </div>
          )}
        </div>

        <div className="w-1/3 flex justify-end">
          <Button 
            variant="primary" 
            size="sm"
            disabled={!isComplete && timeLeft !== null && timeLeft > 0} 
            onClick={() => setShowConfirmModal(true)}
            className="uppercase tracking-widest text-[10px]"
          >
            Finalizar
          </Button>
        </div>
      </div>

      {/* Progress Bar Fixed */}
      <div className="fixed top-[6.5rem] left-0 right-0 h-1 bg-white/5 z-40 mt-2">
        <div 
          className="h-full bg-brand-orange transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 mt-8 max-w-4xl">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
            <AlertTriangle size={20} />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
        )}

        <div className="mb-8 flex justify-between items-end">
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
            Aplicación de Test
          </h1>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            {answeredQuestions} / {totalQuestions} completado
          </span>
        </div>

        {children}
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-brand-orange/20 flex items-center justify-center text-brand-orange mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-black text-white text-center uppercase tracking-tight mb-4">
              ¿Estás seguro?
            </h3>
            <p className="text-slate-400 text-center mb-8">
              Una vez enviado el test, no podrás modificar tus respuestas. Asegúrate de haber revisado bien antes de confirmar.
            </p>
            <div className="flex gap-4">
              <Button variant="secondary" className="flex-1 uppercase" onClick={() => setShowConfirmModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" className="flex-1 uppercase" onClick={() => handleConfirmSubmit(false)}>
                Sí, Enviar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
