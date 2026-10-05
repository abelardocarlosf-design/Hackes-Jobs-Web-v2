'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { TestAplicacionBase, irAlPanelDeEnvio } from '../TestAplicacionBase';
import { Button } from '@/components/Button';
import { TestInfoProps } from '@/lib/psicometriasConfig';
import { useAvancePrueba } from '@/lib/psicometrias/progreso';
import {
  detalleRespuestas,
  type ChoiceQuestion,
  type Puntajes,
  type RespuestasCalificadas,
} from '@/lib/psicometrias/banco';

export type { ChoiceOption, ChoiceQuestion } from '@/lib/psicometrias/banco';

export interface GenericChoiceTestProps {
  config: TestInfoProps;
  questions: ChoiceQuestion[];
  /** Versión del banco: si cambia, se descarta el avance guardado con la anterior. */
  version: string;
  /** Calcula los puntajes que viajan a n8n junto con el detalle de respuestas. */
  calificar?: (answers: Record<string, string>) => Puntajes;
  timeLimitMinutes?: number;
}

interface Avance {
  answers: Record<string, string>;
  currentStep: number;
}

const AVANCE_INICIAL = (): Avance => ({ answers: {}, currentStep: 0 });
const MAX_PUNTOS_NAVEGACION = 60;
const RETARDO_AVANCE_MS = 350;

export default function GenericChoiceTest({ config, questions, version, calificar, timeLimitMinutes }: GenericChoiceTestProps) {
  const { estado, setEstado, listo, reanudado, guardando, reiniciar } =
    useAvancePrueba<Avance>(config.slug, version, AVANCE_INICIAL);
  const autoAvance = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalQuestions = questions.length;
  const idsValidos = useMemo(() => new Set(questions.map(q => q.id)), [questions]);
  // Solo cuentan respuestas a preguntas que existen en este banco.
  const answers = estado.answers;
  const answeredCount = Object.keys(answers).filter(id => idsValidos.has(id)).length;
  const currentStep = Math.min(Math.max(0, estado.currentStep), totalQuestions - 1);
  const currentQuestion = questions[currentStep];
  const esUltima = currentStep === totalQuestions - 1;

  useEffect(() => () => {
    if (autoAvance.current) clearTimeout(autoAvance.current);
  }, []);

  const irA = (paso: number) => {
    if (autoAvance.current) clearTimeout(autoAvance.current);
    setEstado(prev => ({ ...prev, currentStep: Math.min(Math.max(0, paso), totalQuestions - 1) }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    const pasoDeLaPregunta = currentStep;
    setEstado(prev => ({ ...prev, answers: { ...prev.answers, [currentQuestion.id]: optionId } }));

    // Avance automático. Se cancela si el candidato vuelve a tocar antes de que
    // ocurra (antes, dos clics rápidos brincaban una pregunta).
    if (autoAvance.current) clearTimeout(autoAvance.current);
    autoAvance.current = setTimeout(() => {
      setEstado(prev =>
        prev.currentStep === pasoDeLaPregunta && pasoDeLaPregunta < totalQuestions - 1
          ? { ...prev, currentStep: pasoDeLaPregunta + 1 }
          : prev
      );
      if (pasoDeLaPregunta === totalQuestions - 1) irAlPanelDeEnvio();
    }, RETARDO_AVANCE_MS);
  };

  const siguienteSinResponder = () => {
    for (let k = 1; k <= totalQuestions; k++) {
      const i = (currentStep + k) % totalQuestions;
      if (!answers[questions[i].id]) return i;
    }
    return -1;
  };

  const pendientes = useMemo(
    () =>
      questions
        .map((q, i) => ({ q, i }))
        .filter(({ q }) => !answers[q.id])
        .map(({ i }) => ({ clave: String(i), etiqueta: String(i + 1), onIr: () => irA(i) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions, answers]
  );

  const handleFinalSubmit = (): RespuestasCalificadas => ({
    formato: 'v2',
    puntajes: calificar ? calificar(answers) : {},
    detalle: detalleRespuestas(questions, answers),
  });

  if (!listo || !currentQuestion) return null;

  const respuestaActual = answers[currentQuestion.id];
  const proximaPendiente = siguienteSinResponder();

  return (
    <TestAplicacionBase
      slug={config.slug}
      totalQuestions={totalQuestions}
      answeredQuestions={answeredCount}
      timeLimitMinutes={timeLimitMinutes}
      onFinalSubmit={handleFinalSubmit}
      isSaving={guardando}
      reanudado={reanudado}
      onReiniciar={reiniciar}
      pendientes={pendientes}
    >
      {/* Navegación por puntos (solo en pruebas cortas; en las largas sería ruido) */}
      {totalQuestions <= MAX_PUNTOS_NAVEGACION && (
        <div className="flex justify-center gap-1.5 mb-4 px-4 flex-wrap">
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              onClick={() => irA(i)}
              aria-label={`Ir a pregunta ${i + 1}${answers[q.id] ? ' (respondida)' : ''}`}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'bg-brand-orange scale-150 shadow-[0_0_6px_2px_rgba(255,107,0,0.6)]'
                  : answers[q.id]
                  ? 'bg-brand-orange/50'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* Tarjeta de la pregunta */}
      <div className="relative bg-[#0e0e0e] rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full bg-brand-orange/10 blur-3xl" />

        <div className="relative p-6 sm:p-12">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-6 bg-white/5 border border-white/10 rounded-full">
              <span className="text-brand-orange text-xs font-black tabular-nums">{currentStep + 1}</span>
              <span className="text-slate-400 text-xs font-semibold tracking-widest uppercase">
                de {totalQuestions}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold text-white leading-snug max-w-2xl mx-auto">
              {currentQuestion.question}
            </h2>

            {currentQuestion.imageUrl && (
              <div className="mt-6 flex justify-center">
                <img
                  src={currentQuestion.imageUrl}
                  alt="Imagen de apoyo"
                  className="max-w-full max-h-[300px] object-contain rounded-xl border border-white/10 shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Opciones. El `key` por pregunta evita que un estado visual (foco, hover)
              pase de una pregunta a la siguiente y la haga parecer ya contestada. */}
          <div key={currentQuestion.id} role="radiogroup" aria-label={currentQuestion.question} className="space-y-3 mb-10">
            {currentQuestion.options.map((opt) => {
              const isSelected = respuestaActual === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`group w-full text-left p-5 rounded-2xl border-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${
                    isSelected
                      ? 'border-brand-orange bg-brand-orange/10 text-white shadow-md shadow-brand-orange/20'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:border-brand-orange/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-brand-orange bg-brand-orange/20' : 'border-slate-600'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />}
                    </div>
                    <span className="text-base leading-snug">{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navegación */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-white/10">
            <Button
              variant="outline"
              onClick={() => irA(currentStep - 1)}
              disabled={currentStep === 0}
              className={currentStep === 0 ? 'invisible' : ''}
            >
              ← Anterior
            </Button>

            {totalQuestions > MAX_PUNTOS_NAVEGACION && proximaPendiente !== -1 && proximaPendiente !== currentStep && (
              <button
                type="button"
                onClick={() => irA(proximaPendiente)}
                className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white"
              >
                Ir a la siguiente sin responder
              </button>
            )}

            {esUltima ? (
              <Button variant="primary" onClick={irAlPanelDeEnvio}>
                Revisar y enviar ↓
              </Button>
            ) : (
              <Button variant="primary" onClick={() => irA(currentStep + 1)} disabled={!respuestaActual}>
                Siguiente →
              </Button>
            )}
          </div>
        </div>
      </div>
    </TestAplicacionBase>
  );
}
