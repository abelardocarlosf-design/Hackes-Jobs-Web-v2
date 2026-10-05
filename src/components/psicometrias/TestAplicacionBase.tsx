'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Clock, CheckCircle2, AlertTriangle, Loader2, RotateCcw, Send } from 'lucide-react';
import { submitPsychometry, registerOnlineFlush, TEST_REGISTRY, type TestId } from '@/lib/psychometryDispatcher';
import { borrarAvance } from '@/lib/psicometrias/progreso';

export interface PendienteNavegable {
  clave: string;
  etiqueta: string;
  onIr: () => void;
}

interface TestAplicacionBaseProps {
  slug: string;
  totalQuestions: number;
  answeredQuestions: number;
  timeLimitMinutes?: number;
  onFinalSubmit: () => any;
  isSaving?: boolean;
  /** El avance se recuperó de una sesión anterior del mismo candidato. */
  reanudado?: boolean;
  onReiniciar?: () => void;
  /** Preguntas sin responder, para saltar a ellas desde el panel de envío. */
  pendientes?: PendienteNavegable[];
  /** Permite enviar aunque falten respuestas (p. ej. se agotó el tiempo de la última serie). */
  permitirEnvioIncompleto?: boolean;
  /** Sustituye el aviso de "te faltan N preguntas" (p. ej. en pruebas por series cronometradas). */
  avisoPendiente?: string;
  /** Sustituye el aviso de "se terminó el tiempo" cuando se permite enviar incompleto. */
  avisoCierre?: string;
  children: React.ReactNode;
}

export const ID_PANEL_ENVIO = 'revision-envio';
const MAX_PENDIENTES_VISIBLES = 40;

export function irAlPanelDeEnvio() {
  document.getElementById(ID_PANEL_ENVIO)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function TestAplicacionBase({
  slug,
  totalQuestions,
  answeredQuestions,
  timeLimitMinutes,
  onFinalSubmit,
  isSaving = false,
  reanudado = false,
  onReiniciar,
  pendientes = [],
  permitirEnvioIncompleto = false,
  avisoPendiente,
  avisoCierre,
  children
}: TestAplicacionBaseProps) {
  const router = useRouter();
  const [startTime] = useState<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState<number | null>(
    timeLimitMinutes ? timeLimitMinutes * 60 : null
  );

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
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

  const contestadas = Math.min(answeredQuestions, totalQuestions);
  const progressPercentage = Math.round((contestadas / totalQuestions) * 100) || 0;
  const isComplete = contestadas >= totalQuestions;
  const faltantes = totalQuestions - contestadas;
  const tiempoAgotado = timeLeft !== null && timeLeft <= 0;
  const cierrePorTiempo = tiempoAgotado || permitirEnvioIncompleto;
  const puedeEnviar = isComplete || cierrePorTiempo;

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
    if (!leadData || isProcessing) return;

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
        contestadas === 0 ? 'abandonada' : isComplete ? 'completa' : 'parcial';

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
          preguntas_contestadas: contestadas,
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

      // Limpiar el avance (localStorage) y el lead (sessionStorage): la prueba ya salió.
      borrarAvance(slug);
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

  const pendientesVisibles = pendientes.slice(0, MAX_PENDIENTES_VISIBLES);

  return (
    <div className="flex flex-col min-h-screen bg-brand-black pt-48 pb-32">
      {/* Barra de estado fija (debajo de la navegación global) */}
      <div className="fixed top-20 left-0 right-0 h-14 bg-brand-black/85 backdrop-blur-md border-y border-white/10 z-40 flex items-center px-4 md:px-8 justify-between mt-2">
        <div className="flex items-center flex-1 min-w-0">
          {isSaving ? (
            <span className="text-xs text-brand-orange font-bold uppercase tracking-widest animate-pulse flex items-center gap-2 whitespace-nowrap">
              <Loader2 size={12} className="animate-spin" /> Guardando...
            </span>
          ) : (
            <span className="text-xs text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1 whitespace-nowrap">
              <CheckCircle2 size={12} /> <span className="hidden sm:inline">Avance guardado</span><span className="sm:hidden">Guardado</span>
            </span>
          )}
        </div>

        <div className="flex justify-center flex-1">
          {timeLeft !== null && (
            <div className={`flex items-center gap-2 font-black tracking-widest px-4 py-1.5 rounded-full border ${timeLeft < 300 ? 'text-red-500 border-red-500/20 bg-red-500/10 animate-pulse' : 'text-slate-300 border-white/10 bg-white/5'}`}>
              <Clock size={16} /> {formatTime(Math.max(0, timeLeft))}
            </div>
          )}
        </div>

        <div className="flex justify-end flex-1">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest tabular-nums">
            {contestadas} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="fixed top-[6.5rem] left-0 right-0 h-1 bg-white/5 z-40 mt-2">
        <div
          className="h-full bg-brand-orange transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Contenido */}
      <div className="flex-1 container mx-auto px-4 max-w-4xl">
        {reanudado && onReiniciar && (
          <div className="mb-6 p-4 bg-brand-blue/10 border border-brand-blue/30 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <p className="text-sm text-slate-200">
              Recuperamos las respuestas que dejaste guardadas en este dispositivo. Puedes seguir donde te quedaste.
            </p>
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white"
            >
              <RotateCcw size={14} /> Empezar de cero
            </button>
          </div>
        )}

        <div className="mb-6 flex justify-between items-end gap-4">
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
            Aplicación de Test
          </h1>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest text-right">
            {contestadas} / {totalQuestions} respondidas
          </span>
        </div>

        {children}

        {/* Revisión y envío: va debajo de las preguntas para que el candidato revise antes de mandar */}
        <section
          id={ID_PANEL_ENVIO}
          aria-labelledby="titulo-envio"
          className={`mt-8 rounded-3xl border p-6 sm:p-8 transition-colors ${puedeEnviar ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/10 bg-white/[0.03]'}`}
        >
          <h2 id="titulo-envio" className="text-lg font-black text-white uppercase tracking-wider mb-2">
            Revisión y envío
          </h2>

          {isComplete ? (
            <p className="text-sm text-slate-300 mb-6">
              Respondiste las {totalQuestions} preguntas. Puedes volver a cualquiera para revisarla; cuando estés listo, envía tu evaluación.
            </p>
          ) : cierrePorTiempo ? (
            <p className="text-sm text-slate-300 mb-6">
              {avisoCierre ?? `Se terminó el tiempo. ${faltantes === 1 ? 'Quedó 1 pregunta' : `Quedaron ${faltantes} preguntas`} sin responder; ya puedes enviar tu evaluación.`}
            </p>
          ) : (
            <div className="mb-6 space-y-4">
              <p className="text-sm text-slate-300">
                {avisoPendiente ?? `${faltantes === 1 ? 'Te falta 1 pregunta' : `Te faltan ${faltantes} preguntas`} por responder. El botón de envío se activa cuando termines.`}
              </p>
              {pendientesVisibles.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Ir a una pregunta sin responder</p>
                  <div className="flex flex-wrap gap-2">
                    {pendientesVisibles.map(p => (
                      <button
                        key={p.clave}
                        type="button"
                        onClick={p.onIr}
                        className="min-w-[2.5rem] h-9 px-3 rounded-lg border border-brand-orange/40 bg-brand-orange/10 text-brand-orange text-xs font-bold hover:bg-brand-orange/20 transition-colors"
                      >
                        {p.etiqueta}
                      </button>
                    ))}
                    {pendientes.length > pendientesVisibles.length && (
                      <span className="h-9 px-2 inline-flex items-center text-xs text-slate-500">
                        y {pendientes.length - pendientesVisibles.length} más
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
              <AlertTriangle size={20} className="shrink-0" />
              <span className="text-sm font-medium">{errorMsg}</span>
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            disabled={!puedeEnviar}
            onClick={() => setShowConfirmModal(true)}
            className="w-full sm:w-auto gap-2"
          >
            <Send size={16} /> Enviar evaluación
          </Button>
        </section>
      </div>

      {/* Confirmar envío */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-md w-full">
            <div className="w-16 h-16 rounded-2xl bg-brand-orange/20 flex items-center justify-center text-brand-orange mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-black text-white text-center uppercase tracking-tight mb-4">
              ¿Enviar tu evaluación?
            </h3>
            <p className="text-slate-400 text-center mb-8">
              Una vez enviada no podrás modificar tus respuestas.
              {!isComplete && ` ${faltantes === 1 ? 'Queda 1 pregunta' : `Quedan ${faltantes} preguntas`} sin responder.`}
            </p>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirmModal(false)}>
                Seguir revisando
              </Button>
              <Button variant="primary" className="flex-1" onClick={() => handleConfirmSubmit(tiempoAgotado)}>
                Sí, enviar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmar reinicio */}
      {showResetModal && onReiniciar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-black text-white text-center uppercase tracking-tight mb-4">
              ¿Empezar de cero?
            </h3>
            <p className="text-slate-400 text-center mb-8">
              Se borrarán las respuestas guardadas en este dispositivo y la prueba volverá al inicio.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowResetModal(false)}>
                Cancelar
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => { onReiniciar(); setShowResetModal(false); window.scrollTo({ top: 0 }); }}
              >
                Borrar y empezar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
