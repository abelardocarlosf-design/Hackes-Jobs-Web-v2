'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { TestAplicacionBase, irAlPanelDeEnvio } from '../TestAplicacionBase';
import { Button } from '@/components/Button';
import { TestInfoProps } from '@/lib/psicometriasConfig';
import { useAvancePrueba } from '@/lib/psicometrias/progreso';
import { Clock, AlertTriangle, Check } from 'lucide-react';
import {
  TERMAN_SERIES,
  TERMAN_TOTAL_REACTIVOS,
  TERMAN_VERSION,
  calificarTerman,
  claveRespuesta,
  puntosDeRespuesta,
  type ReactivoTerman,
  type SerieTerman,
} from '@/data/termanQuestions';

interface Avance {
  answers: Record<string, string>;
  serieIdx: number;
  /** Momento en que arrancó la serie actual; null = viendo sus instrucciones. */
  inicioSerie: number | null;
  terminado: boolean;
}

const AVANCE_INICIAL = (): Avance => ({ answers: {}, serieIdx: 0, inicioSerie: null, terminado: false });

const respondido = (serie: SerieTerman, valor: string | undefined) =>
  serie.formato === 'dos' ? (valor || '').split(',').filter(Boolean).length === 2 : !!valor?.trim();

const domId = (serie: number, reactivo: number) => `reactivo-s${serie}-q${reactivo}`;

export default function TermanTest({ config }: { config: TestInfoProps }) {
  const { estado, setEstado, listo, reanudado, guardando, reiniciar } =
    useAvancePrueba<Avance>(config.slug, TERMAN_VERSION, AVANCE_INICIAL);
  const [ahora, setAhora] = useState(() => Date.now());
  const [confirmarCierre, setConfirmarCierre] = useState(false);

  const { answers, terminado, inicioSerie } = estado;
  const serieIdx = Math.min(Math.max(0, estado.serieIdx), TERMAN_SERIES.length - 1);
  const serie = TERMAN_SERIES[serieIdx];
  const esUltimaSerie = serieIdx === TERMAN_SERIES.length - 1;

  // El tiempo se calcula desde el inicio guardado: recargar la página no lo reinicia.
  const restante = inicioSerie === null ? serie.timeMinutes * 60 : Math.max(0, Math.ceil(serie.timeMinutes * 60 - (ahora - inicioSerie) / 1000));

  const cerrarSerie = () => {
    setConfirmarCierre(false);
    setEstado(prev => {
      if (prev.terminado) return prev;
      return prev.serieIdx >= TERMAN_SERIES.length - 1
        ? { ...prev, terminado: true, inicioSerie: null }
        : { ...prev, serieIdx: prev.serieIdx + 1, inicioSerie: null };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (esUltimaSerie) setTimeout(irAlPanelDeEnvio, 400);
  };

  useEffect(() => {
    if (!listo || terminado || inicioSerie === null) return;
    const t = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(t);
  }, [listo, terminado, inicioSerie]);

  useEffect(() => {
    if (listo && !terminado && inicioSerie !== null && restante <= 0) cerrarSerie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restante, listo, terminado, inicioSerie]);

  const comenzarSerie = () => {
    setAhora(Date.now());
    setEstado(prev => ({ ...prev, inicioSerie: Date.now() }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const responder = (r: ReactivoTerman, valor: string) => {
    const key = claveRespuesta(serie.id, r.id);
    setEstado(prev => ({ ...prev, answers: { ...prev.answers, [key]: valor } }));
  };

  const alternarDos = (r: ReactivoTerman, opcion: string) => {
    const actuales = (answers[claveRespuesta(serie.id, r.id)] || '').split(',').filter(Boolean);
    const siguiente = actuales.includes(opcion)
      ? actuales.filter(x => x !== opcion)
      : actuales.length < 2 ? [...actuales, opcion] : actuales;
    responder(r, siguiente.sort().join(','));
  };

  const answeredCount = TERMAN_SERIES.reduce(
    (n, s) => n + s.questions.filter(r => respondido(s, answers[claveRespuesta(s.id, r.id)])).length,
    0
  );
  const sinResponderEnSerie = serie.questions.filter(r => !respondido(serie, answers[claveRespuesta(serie.id, r.id)]));

  const pendientes = useMemo(
    () =>
      terminado || inicioSerie === null
        ? []
        : sinResponderEnSerie.map(r => ({
            clave: String(r.id),
            etiqueta: String(r.id),
            onIr: () => document.getElementById(domId(serie.id, r.id))?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
          })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [answers, serieIdx, terminado, inicioSerie]
  );

  const handleFinalSubmit = () => {
    const detalle: Record<string, string> = {};
    for (const s of TERMAN_SERIES) {
      for (const r of s.questions) {
        const key = claveRespuesta(s.id, r.id);
        const v = answers[key];
        if (!v) continue;
        const texto = s.formato === 'numero'
          ? v
          : v.split(',').map(id => r.opciones?.find(o => o.id === id)?.text ?? id).join(' + ');
        const ok = puntosDeRespuesta(s, r, v) > 0;
        detalle[key] = `Serie ${s.id} · ${r.text} → ${texto} (${ok ? 'correcta' : 'incorrecta'})`;
      }
    }
    return { formato: 'v2', puntajes: calificarTerman(answers), detalle, ...answers };
  };

  if (!listo) return null;

  const faltantesTotales = TERMAN_TOTAL_REACTIVOS - answeredCount;
  const mm = Math.floor(restante / 60).toString().padStart(2, '0');
  const ss = (restante % 60).toString().padStart(2, '0');

  return (
    <TestAplicacionBase
      slug={config.slug}
      totalQuestions={TERMAN_TOTAL_REACTIVOS}
      answeredQuestions={answeredCount}
      onFinalSubmit={handleFinalSubmit}
      isSaving={guardando}
      reanudado={reanudado}
      onReiniciar={reiniciar}
      pendientes={pendientes}
      permitirEnvioIncompleto={terminado}
      avisoPendiente={`Contesta cada serie dentro de su tiempo. El envío se habilita al terminar la Serie ${TERMAN_SERIES.length}.`}
      avisoCierre={`Terminaste las ${TERMAN_SERIES.length} series${faltantesTotales > 0 ? ` (quedaron ${faltantesTotales} reactivos sin responder, lo cual es normal en una prueba con tiempo)` : ''}. Ya puedes enviar tu evaluación.`}
    >
      <div className="bg-[#111] rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="p-6 sm:p-12">
          {terminado ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto mb-6">
                <Check size={32} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-3">Prueba terminada</h2>
              <p className="text-slate-400">Respondiste {answeredCount} de {TERMAN_TOTAL_REACTIVOS} reactivos. Envía tu evaluación en el panel de abajo.</p>
            </div>
          ) : inicioSerie === null ? (
            /* Instrucciones de la serie: el cronómetro arranca hasta que el candidato las lee */
            <div className="max-w-2xl mx-auto text-center py-4">
              <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-brand-orange text-sm font-bold rounded-lg mb-4 uppercase tracking-widest">
                Serie {serie.id} de {TERMAN_SERIES.length}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">{serie.title}</h2>
              <p className="text-lg text-slate-300 mb-6">{serie.desc}</p>
              <div className="text-left bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Ejemplo</p>
                <p className="text-slate-200">{serie.ejemplo}</p>
              </div>
              <p className="text-sm text-slate-400 mb-8">
                {serie.questions.length} reactivos · <strong className="text-white">{serie.timeMinutes} minutos</strong>. Al terminar el tiempo pasarás a la siguiente serie y no podrás regresar.
              </p>
              <Button variant="primary" size="lg" onClick={comenzarSerie}>
                Comenzar serie {serie.id}
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-brand-orange text-sm font-bold rounded-lg mb-2 uppercase tracking-widest">
                    Serie {serie.id} de {TERMAN_SERIES.length}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-semibold text-white leading-snug">{serie.title}</h2>
                </div>
                <div
                  role="timer"
                  aria-label="Tiempo restante de la serie"
                  className={`px-6 py-3 rounded-xl flex items-center gap-3 font-black text-xl tabular-nums ${restante < 30 ? 'bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse' : 'bg-white/5 text-slate-300 border border-white/10'}`}
                >
                  <Clock size={22} /> {mm}:{ss}
                </div>
              </div>

              <div className="bg-brand-orange/10 border border-brand-orange/30 p-4 rounded-xl flex items-start gap-3 mb-8">
                <AlertTriangle className="text-brand-orange shrink-0 mt-0.5" size={20} />
                <p className="text-brand-orange/90 text-sm">
                  {serie.desc} Al llegar a 00:00 la serie se cierra sola.
                </p>
              </div>

              <ol className="space-y-4">
                {serie.questions.map(r => {
                  const valor = answers[claveRespuesta(serie.id, r.id)] || '';
                  const marcadas = valor.split(',').filter(Boolean);
                  return (
                    <li key={r.id} id={domId(serie.id, r.id)} className="p-5 bg-white/5 border border-white/10 rounded-2xl scroll-mt-40">
                      <div className="flex gap-3 mb-4">
                        <span className="text-brand-orange font-black w-7 shrink-0 tabular-nums">{r.id}.</span>
                        <span className="text-slate-100 flex-1">{r.text}</span>
                      </div>

                      {serie.formato === 'numero' ? (
                        <input
                          type="text"
                          inputMode="decimal"
                          autoComplete="off"
                          value={valor}
                          onChange={e => responder(r, e.target.value)}
                          placeholder="Escribe el número"
                          aria-label={`Respuesta al reactivo ${r.id}`}
                          className="w-full sm:w-56 bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2" role={serie.formato === 'dos' ? 'group' : 'radiogroup'}>
                          {r.opciones!.map(o => {
                            const activa = serie.formato === 'dos' ? marcadas.includes(o.id) : valor === o.id;
                            return (
                              <button
                                key={o.id}
                                type="button"
                                role={serie.formato === 'dos' ? 'checkbox' : 'radio'}
                                aria-checked={activa}
                                onClick={() => (serie.formato === 'dos' ? alternarDos(r, o.id) : responder(r, o.id))}
                                className={`px-4 py-2 rounded-xl border-2 text-sm text-left transition-colors ${activa ? 'border-brand-orange bg-brand-orange/15 text-white' : 'border-white/10 bg-black/30 text-slate-300 hover:border-white/30'}`}
                              >
                                {o.text}
                              </button>
                            );
                          })}
                          {serie.formato === 'dos' && (
                            <span className="self-center text-xs text-slate-500 ml-1">{marcadas.length}/2 marcadas</span>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-8 mt-8 border-t border-white/10">
                {confirmarCierre ? (
                  <>
                    <p className="text-sm text-slate-300 sm:mr-auto">
                      {sinResponderEnSerie.length > 0
                        ? `Te ${sinResponderEnSerie.length === 1 ? 'falta 1 reactivo' : `faltan ${sinResponderEnSerie.length} reactivos`} en esta serie y no podrás regresar. ¿Continuar?`
                        : 'No podrás regresar a esta serie. ¿Continuar?'}
                    </p>
                    <Button variant="outline" onClick={() => setConfirmarCierre(false)}>Seguir en la serie</Button>
                    <Button variant="primary" onClick={cerrarSerie}>{esUltimaSerie ? 'Sí, terminar la prueba' : 'Sí, continuar'}</Button>
                  </>
                ) : (
                  <Button variant="primary" onClick={() => setConfirmarCierre(true)}>
                    {esUltimaSerie ? 'Terminar la prueba' : 'Terminar esta serie y continuar →'}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </TestAplicacionBase>
  );
}
