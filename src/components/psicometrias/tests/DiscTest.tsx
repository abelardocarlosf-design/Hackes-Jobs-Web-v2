'use client';

import React, { useMemo } from 'react';
import { TestAplicacionBase, irAlPanelDeEnvio } from '../TestAplicacionBase';
import { Button } from '@/components/Button';
import { discQuestions, DiscType } from '@/data/discQuestions';
import { TestInfoProps } from '@/lib/psicometriasConfig';
import { useAvancePrueba } from '@/lib/psicometrias/progreso';
import { barajar } from '@/lib/psicometrias/banco';

const VERSION_BANCO = 'disc-2026-10';
const TIPOS: DiscType[] = ['D', 'I', 'S', 'C'];

type Eleccion = { mas_parecido: DiscType | null; menos_parecido: DiscType | null };

interface Avance {
  answers: Record<number, Eleccion>;
  currentStep: number;
}

const AVANCE_INICIAL = (): Avance => ({ answers: {}, currentStep: 0 });

// Las frases se muestran en orden distinto en cada grupo: si siempre iban
// D-I-S-C, el candidato aprendía el patrón y podía "elegir el perfil".
const GRUPOS = discQuestions.map(g => ({ ...g, options: barajar(g.options, g.id * 7919) }));

export default function DiscTest({ config }: { config: TestInfoProps }) {
  const { estado, setEstado, listo, reanudado, guardando, reiniciar } =
    useAvancePrueba<Avance>(config.slug, VERSION_BANCO, AVANCE_INICIAL);

  const totalQuestions = GRUPOS.length;
  const { answers } = estado;
  const currentStep = Math.min(Math.max(0, estado.currentStep), totalQuestions - 1);
  const currentQuestion = GRUPOS[currentStep];
  const completo = (id: number) => !!(answers[id]?.mas_parecido && answers[id]?.menos_parecido);
  const answeredCount = GRUPOS.filter(g => completo(g.id)).length;

  const irA = (paso: number) => {
    setEstado(prev => ({ ...prev, currentStep: Math.min(Math.max(0, paso), totalQuestions - 1) }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (tipo: keyof Eleccion, opcion: DiscType) => {
    const id = currentQuestion.id;
    setEstado(prev => {
      const actual: Eleccion = prev.answers[id] || { mas_parecido: null, menos_parecido: null };
      const otro: keyof Eleccion = tipo === 'mas_parecido' ? 'menos_parecido' : 'mas_parecido';
      // La misma frase no puede ser a la vez la que más y la que menos te describe:
      // si la marcan en la otra columna, se cambia de columna.
      const nuevo: Eleccion = {
        ...actual,
        [tipo]: actual[tipo] === opcion ? null : opcion,
        [otro]: actual[otro] === opcion ? null : actual[otro],
      };
      return { ...prev, answers: { ...prev.answers, [id]: nuevo } };
    });
  };

  const pendientes = useMemo(
    () =>
      GRUPOS.map((g, i) => ({ g, i }))
        .filter(({ g }) => !completo(g.id))
        .map(({ i }) => ({ clave: String(i), etiqueta: String(i + 1), onIr: () => irA(i) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [answers]
  );

  const handleFinalSubmit = () => {
    const mas = Object.fromEntries(TIPOS.map(t => [t, 0])) as Record<DiscType, number>;
    const menos = { ...mas };
    const detalle: Record<string, string> = {};
    for (const g of discQuestions) {
      const a = answers[g.id];
      if (!a) continue;
      const texto = (t: DiscType | null) => g.options.find(o => o.type === t)?.text ?? '-';
      if (a.mas_parecido) mas[a.mas_parecido]++;
      if (a.menos_parecido) menos[a.menos_parecido]++;
      detalle[`G${g.id}`] = `${g.question} MÁS (${a.mas_parecido ?? '-'}): ${texto(a.mas_parecido)} | MENOS (${a.menos_parecido ?? '-'}): ${texto(a.menos_parecido)}`;
    }
    const diferencia = Object.fromEntries(TIPOS.map(t => [t, mas[t] - menos[t]]));
    return {
      formato: 'v2',
      puntajes: {
        nota: 'Conteos sobre 30 grupos. MÁS = elecciones "me describe más"; MENOS = "me describe menos"; DIFERENCIA = MÁS − MENOS (rango −30 a +30).',
        mas,
        menos,
        diferencia,
      },
      detalle,
      // Formato anterior (G1_mas: "D"), por compatibilidad con reportes ya armados.
      ...Object.fromEntries(
        discQuestions.flatMap(g => [
          [`G${g.id}_mas`, answers[g.id]?.mas_parecido || ''],
          [`G${g.id}_menos`, answers[g.id]?.menos_parecido || ''],
        ])
      ),
    };
  };

  if (!listo || !currentQuestion) return null;

  const actual = answers[currentQuestion.id] || { mas_parecido: null, menos_parecido: null };
  const esUltima = currentStep === totalQuestions - 1;

  return (
    <TestAplicacionBase
      slug={config.slug}
      totalQuestions={totalQuestions}
      answeredQuestions={answeredCount}
      onFinalSubmit={handleFinalSubmit}
      isSaving={guardando}
      reanudado={reanudado}
      onReiniciar={reiniciar}
      pendientes={pendientes}
    >
      <div className="flex justify-center gap-1.5 mb-4 px-4 flex-wrap">
        {GRUPOS.map((g, i) => (
          <button
            key={g.id}
            type="button"
            onClick={() => irA(i)}
            aria-label={`Ir al grupo ${i + 1}${completo(g.id) ? ' (respondido)' : ''}`}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === currentStep
                ? 'bg-brand-orange scale-150'
                : completo(g.id)
                ? 'bg-brand-orange/50'
                : 'bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      <div className="bg-[#111] rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="p-6 sm:p-12">
          <div className="mb-8 text-center">
            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-brand-orange text-sm font-bold rounded-lg mb-4 uppercase tracking-widest">
              Grupo {currentStep + 1} de {totalQuestions}
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-white leading-snug mb-3">
              {currentQuestion.question}
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Marca con <strong className="text-emerald-400">+</strong> la frase que <strong className="text-emerald-400">MÁS</strong> te describe y con <strong className="text-brand-orange">−</strong> la que <strong className="text-brand-orange">MENOS</strong> te describe.
            </p>
          </div>

          <div key={currentQuestion.id} className="space-y-3 mb-10">
            {currentQuestion.options.map(option => {
              const isMas = actual.mas_parecido === option.type;
              const isMenos = actual.menos_parecido === option.type;
              return (
                <div
                  key={option.type}
                  className={`flex items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl border transition-colors ${
                    isMas ? 'border-emerald-500/60 bg-emerald-500/10' : isMenos ? 'border-brand-orange/60 bg-brand-orange/10' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <span className="text-base sm:text-lg text-white flex-1">{option.text}</span>
                  <div className="flex gap-2 sm:gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSelectOption('mas_parecido', option.type)}
                      aria-pressed={isMas}
                      aria-label={`Me describe más: ${option.text}`}
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-xl transition-colors ${isMas ? 'bg-emerald-500 text-white' : 'bg-black/50 text-slate-500 hover:text-emerald-400 border border-white/10'}`}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectOption('menos_parecido', option.type)}
                      aria-pressed={isMenos}
                      aria-label={`Me describe menos: ${option.text}`}
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-xl transition-colors ${isMenos ? 'bg-brand-orange text-white' : 'bg-black/50 text-slate-500 hover:text-brand-orange border border-white/10'}`}
                    >
                      −
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3 pt-6 border-t border-white/10">
            <Button
              variant="outline"
              onClick={() => irA(currentStep - 1)}
              disabled={currentStep === 0}
              className={currentStep === 0 ? 'invisible' : ''}
            >
              ← Anterior
            </Button>

            {esUltima ? (
              <Button variant="primary" onClick={irAlPanelDeEnvio}>
                Revisar y enviar ↓
              </Button>
            ) : (
              <Button variant="primary" onClick={() => irA(currentStep + 1)} disabled={!completo(currentQuestion.id)}>
                Siguiente →
              </Button>
            )}
          </div>
        </div>
      </div>
    </TestAplicacionBase>
  );
}
