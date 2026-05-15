'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Clock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { submitPsychometry, registerOnlineFlush, TEST_REGISTRY, type TestId } from '@/lib/psychometryDispatcher';

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
    // Engancha el flush de la cola offline para reintentar envíos pendientes
    // de sesiones previas cuando el navegador recupere conectividad.
    const unregister = registerOnlineFlush();
    return unregister;
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
      const respuestas = onFinalSubmit();
      const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);
      const fechaAplicacion = new Date().toISOString(); // ISO 8601 UTC completo

      // Sanitización de datos del lead (defaults seguros para que n8n no rompa)
      const safeEmail = leadData.email ? leadData.email.trim() : '';
      const safeName  = leadData.nombre_completo ? leadData.nombre_completo.trim() : 'Candidato Anónimo';
      const safePhone = leadData.telefono ? leadData.telefono.trim() : '';
      const safeEmpresa = (leadData.empresa || '').trim();
      const safeCargo   = (leadData.cargo_postulado || '').trim();

      // Estado de finalización (alimenta `datos_prueba.estado_finalizacion` del contrato v1)
      const estado: 'completa' | 'parcial' | 'abandonada' =
        answeredQuestions === 0
          ? 'abandonada'
          : answeredQuestions >= totalQuestions
            ? 'completa'
            : 'parcial';

      // Guard: slugs registrados en el dispatcher.
      // Si llegamos aquí con un slug fuera del registro, falla duro (ver caso límite 12 del prompt).
      if (!(slug in TEST_REGISTRY)) {
        throw new Error(`Psicometría no registrada en el dispatcher: ${slug}`);
      }

      const result = await submitPsychometry(slug as TestId, {
        candidate: {
          nombre_completo: safeName,
          email: safeEmail,
          telefono: safePhone,
          empresa: safeEmpresa || undefined,
          cargo_postulado: safeCargo || undefined,
        },
        metrics: {
          total_preguntas: totalQuestions,
          preguntas_contestadas: answeredQuestions,
          fecha_aplicacion: fechaAplicacion,
          duracion_segundos: timeSpentSeconds,
          estado_finalizacion: estado,
          time_out_agotado: timeOut,
        },
        respuestas,
      });

      if (!result.ok) {
        if (result.queued) {
          // Sin red: el dispatcher encoló para reintentar al recuperar conectividad.
          setProcessStatus('Sin conexión. Tus respuestas se enviarán automáticamente al recuperar internet.');
        } else {
          throw new Error(result.error || 'Error al enviar los datos del test.');
        }
      } else {
        setProcessStatus('¡Test Completado!');
      }

      // Limpiar localStorage (respuestas) y sessionStorage (lead) — el backup server-side ya está hecho.
      localStorage.removeItem(`hj_test_${slug}`);
      sessionStorage.removeItem(`hj_lead_${slug}`);

      // Redirigir a la pantalla de éxito / resultado
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
    <div className="flex flex-col min-h-screen bg-brand-black pt-64 pb-32">
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
