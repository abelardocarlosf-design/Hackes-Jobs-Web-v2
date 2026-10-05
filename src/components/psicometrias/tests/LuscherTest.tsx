'use client';

import React from 'react';
import { TestAplicacionBase, irAlPanelDeEnvio } from '../TestAplicacionBase';
import { Button } from '@/components/Button';
import { TestInfoProps } from '@/lib/psicometriasConfig';
import { useAvancePrueba } from '@/lib/psicometrias/progreso';
import { RotateCcw } from 'lucide-react';

const VERSION_BANCO = 'luscher-2026-10';

// Numeración estándar de Lüscher (test corto de 8 colores).
const COLORS = [
  { id: 'grey', numero: 0, hex: '#9E9E9E', name: 'Gris' },
  { id: 'blue', numero: 1, hex: '#005BBB', name: 'Azul' },
  { id: 'green', numero: 2, hex: '#008542', name: 'Verde' },
  { id: 'red', numero: 3, hex: '#E31837', name: 'Rojo' },
  { id: 'yellow', numero: 4, hex: '#FFD100', name: 'Amarillo' },
  { id: 'violet', numero: 5, hex: '#8E24AA', name: 'Violeta' },
  { id: 'brown', numero: 6, hex: '#795548', name: 'Café' },
  { id: 'black', numero: 7, hex: '#000000', name: 'Negro' },
];

// Como en la aplicación en papel, las tarjetas se presentan en otro orden en la
// segunda vuelta para que la elección no sea un simple recuerdo de posiciones.
const ORDEN_FASE_1 = ['blue', 'green', 'red', 'yellow', 'violet', 'brown', 'black', 'grey'];
const ORDEN_FASE_2 = ['yellow', 'black', 'blue', 'brown', 'grey', 'red', 'violet', 'green'];
const colorPorId = (id: string) => COLORS.find(c => c.id === id)!;

interface Avance {
  sequence1: string[];
  sequence2: string[];
  isFirstSequence: boolean;
}

const AVANCE_INICIAL = (): Avance => ({ sequence1: [], sequence2: [], isFirstSequence: true });

export default function LuscherTest({ config }: { config: TestInfoProps }) {
  const { estado, setEstado, listo, reanudado, guardando, reiniciar } =
    useAvancePrueba<Avance>(config.slug, VERSION_BANCO, AVANCE_INICIAL);
  const { sequence1, sequence2, isFirstSequence } = estado;

  const currentSequence = isFirstSequence ? sequence1 : sequence2;
  const orden = isFirstSequence ? ORDEN_FASE_1 : ORDEN_FASE_2;

  const handleSelectColor = (colorId: string) => {
    setEstado(prev => {
      const clave = prev.isFirstSequence ? 'sequence1' : 'sequence2';
      const seq = prev[clave];
      if (seq.includes(colorId) || seq.length >= 8) return prev;
      return { ...prev, [clave]: [...seq, colorId] };
    });
    if (!isFirstSequence && sequence2.length === 7) setTimeout(irAlPanelDeEnvio, 300);
  };

  const handleResetCurrent = () =>
    setEstado(prev => (prev.isFirstSequence ? { ...prev, sequence1: [] } : { ...prev, sequence2: [] }));

  const handleNextSequence = () => {
    setEstado(prev => ({ ...prev, isFirstSequence: false }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToFirst = () => {
    setEstado(prev => ({ ...prev, isFirstSequence: true }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = () => {
    const numeros = (seq: string[]) => seq.map(id => colorPorId(id).numero).join(' ');
    const nombres = (seq: string[]) => seq.map(id => colorPorId(id).name).join(', ');
    const flat: Record<string, string> = {};
    sequence1.forEach((color, i) => { flat[`S1_${i + 1}`] = color; });
    sequence2.forEach((color, i) => { flat[`S2_${i + 1}`] = color; });
    return {
      formato: 'v2',
      puntajes: {
        nota: 'Numeración estándar de Lüscher: 0 gris, 1 azul, 2 verde, 3 rojo, 4 amarillo, 5 violeta, 6 café, 7 negro. Orden de preferencia de izquierda (más agradable) a derecha (menos agradable).',
        primera_seleccion: numeros(sequence1),
        segunda_seleccion: numeros(sequence2),
      },
      detalle: {
        primera_seleccion: nombres(sequence1),
        segunda_seleccion: nombres(sequence2),
      },
      // Formato anterior (S1_1: "blue") por compatibilidad.
      ...flat,
    };
  };

  if (!listo) return null;

  const answeredQuestions = sequence1.length + sequence2.length;
  const totalQuestions = 16; // 8 colores x 2 secuencias

  return (
    <TestAplicacionBase
      slug={config.slug}
      totalQuestions={totalQuestions}
      answeredQuestions={answeredQuestions}
      onFinalSubmit={handleFinalSubmit}
      isSaving={guardando}
      reanudado={reanudado}
      onReiniciar={reiniciar}
    >
      <div className="bg-[#111] rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="p-6 sm:p-12">
          <div className="mb-10 text-center">
            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-brand-orange text-sm font-bold rounded-lg mb-4 uppercase tracking-widest">
              Selección {isFirstSequence ? '1' : '2'} de 2
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-white leading-snug">
              {currentSequence.length < 8
                ? currentSequence.length === 0
                  ? 'Toca el color que te resulte más agradable en este momento.'
                  : 'De los colores que quedan, toca el que te resulte más agradable.'
                : isFirstSequence
                  ? 'Primera selección completa.'
                  : 'Segunda selección completa.'}
            </h2>
            {!isFirstSequence && sequence2.length === 0 && (
              <p className="text-slate-400 mt-3 text-sm">
                Repite el ejercicio sin tratar de recordar tu primera elección. Elige como si fuera la primera vez.
              </p>
            )}
          </div>

          <div className="mb-10">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Tu orden:</h3>
              <button
                type="button"
                onClick={handleResetCurrent}
                disabled={currentSequence.length === 0}
                className="text-xs text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-1 disabled:opacity-50 transition-colors"
              >
                <RotateCcw size={12} /> Reiniciar esta selección
              </button>
            </div>
            <div className="flex gap-2 flex-wrap min-h-[60px] p-4 bg-white/5 border border-white/10 rounded-2xl">
              {currentSequence.map((colorId, i) => (
                <div
                  key={colorId}
                  title={colorPorId(colorId).name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/20 shadow-lg flex items-center justify-center text-xs font-black text-white/70"
                  style={{ backgroundColor: colorPorId(colorId).hex }}
                >
                  {i + 1}
                </div>
              ))}
              {currentSequence.length === 0 && (
                <span className="text-sm text-slate-500 my-auto">Aún no has seleccionado colores.</span>
              )}
            </div>
          </div>

          <div key={isFirstSequence ? 'fase-1' : 'fase-2'} className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto">
            {orden.map(id => {
              const color = colorPorId(id);
              const usado = currentSequence.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  disabled={usado || currentSequence.length >= 8}
                  onClick={() => handleSelectColor(id)}
                  aria-label={color.name}
                  className={`aspect-square rounded-2xl transition-all duration-300 shadow-xl ${usado ? 'opacity-10 scale-90 pointer-events-none' : 'hover:scale-105 hover:ring-4 ring-white/20'}`}
                  style={{ backgroundColor: color.hex }}
                />
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-10 border-t border-white/10 mt-10">
            {!isFirstSequence ? (
              <Button variant="outline" onClick={handleBackToFirst}>
                ← Ver primera selección
              </Button>
            ) : <span />}

            {isFirstSequence && (
              <Button variant="primary" onClick={handleNextSequence} disabled={sequence1.length < 8}>
                Continuar a la segunda selección →
              </Button>
            )}
            {!isFirstSequence && sequence2.length === 8 && (
              <Button variant="primary" onClick={irAlPanelDeEnvio}>
                Revisar y enviar ↓
              </Button>
            )}
          </div>
        </div>
      </div>
    </TestAplicacionBase>
  );
}
