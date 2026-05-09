'use client';

import React, { useState, useEffect } from 'react';
import { TestAplicacionBase } from '../TestAplicacionBase';
import { Button } from '@/components/Button';
import { TestInfoProps } from '@/lib/psicometriasConfig';
import { RotateCcw } from 'lucide-react';

const COLORS = [
  { id: 'blue', hex: '#005BBB', name: 'Azul' },
  { id: 'green', hex: '#008542', name: 'Verde' },
  { id: 'red', hex: '#E31837', name: 'Rojo' },
  { id: 'yellow', hex: '#FFD100', name: 'Amarillo' },
  { id: 'violet', hex: '#8E24AA', name: 'Violeta' },
  { id: 'brown', hex: '#795548', name: 'Café' },
  { id: 'black', hex: '#000000', name: 'Negro' },
  { id: 'grey', hex: '#9E9E9E', name: 'Gris' },
];

export default function LuscherTest({ config }: { config: TestInfoProps }) {
  const [sequence1, setSequence1] = useState<string[]>([]);
  const [sequence2, setSequence2] = useState<string[]>([]);
  const [isFirstSequence, setIsFirstSequence] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`hj_test_${config.slug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSequence1(parsed.sequence1 || []);
        setSequence2(parsed.sequence2 || []);
        // Strict boolean check
        if (typeof parsed.isFirstSequence === 'boolean') {
          setIsFirstSequence(parsed.isFirstSequence);
        } else if (parsed.sequence1?.length === 8) {
          setIsFirstSequence(false);
        }
      } catch (e) {}
    }
  }, [config.slug]);

  const saveState = (s1: string[], s2: string[], isFirst: boolean) => {
    setIsSaving(true);
    localStorage.setItem(`hj_test_${config.slug}`, JSON.stringify({ sequence1: s1, sequence2: s2, isFirstSequence: isFirst }));
    setTimeout(() => setIsSaving(false), 500);
  };

  const currentSequence = isFirstSequence ? sequence1 : sequence2;

  const handleSelectColor = (colorId: string) => {
    if (isFirstSequence) {
      const newSeq = [...sequence1, colorId];
      setSequence1(newSeq);
      // Auto advance to second sequence if sequence 1 is full
      if (newSeq.length === 8) {
         // Optionally we can auto-advance or let them click the button. 
         // The user complained the button was broken, so maybe they prefer a clear button.
         saveState(newSeq, sequence2, true);
      } else {
         saveState(newSeq, sequence2, true);
      }
    } else {
      const newSeq = [...sequence2, colorId];
      setSequence2(newSeq);
      saveState(sequence1, newSeq, false);
    }
  };

  const handleResetCurrent = () => {
    if (isFirstSequence) {
      setSequence1([]);
      saveState([], sequence2, true);
    } else {
      setSequence2([]);
      saveState(sequence1, [], false);
    }
  };

  const handleNextSequence = () => {
    setIsFirstSequence(false);
    saveState(sequence1, sequence2, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = () => {
    // Return a flat dictionary: { "S1_1": "blue", "S1_2": "red", ... "S2_1": "green" }
    const flatAnswers: Record<string, string> = {};
    sequence1.forEach((color, index) => {
      flatAnswers[`S1_${index + 1}`] = color;
    });
    sequence2.forEach((color, index) => {
      flatAnswers[`S2_${index + 1}`] = color;
    });
    return flatAnswers;
  };

  // El progreso es el total de selecciones hechas
  const answeredQuestions = sequence1.length + sequence2.length;
  const totalQuestions = 16; // 8 colores x 2 secuencias

  return (
    <TestAplicacionBase
      slug={config.slug}
      totalQuestions={totalQuestions}
      answeredQuestions={answeredQuestions}
      onFinalSubmit={handleFinalSubmit}
      isSaving={isSaving}
    >
      <div className="bg-[#111] rounded-3xl shadow-2xl border border-white/10 overflow-hidden mt-6">
        <div className="p-8 sm:p-12">
          <div className="mb-10 text-center">
            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-brand-orange text-sm font-bold rounded-lg mb-4 uppercase tracking-widest">
              Secuencia {isFirstSequence ? '1' : '2'} de 2
            </span>
            <h2 className="text-xl sm:text-2xl font-medium text-slate-300 leading-snug">
              Selecciona el color que te resulte más agradable en este momento.
            </h2>
            {isFirstSequence && sequence1.length === 8 && (
              <p className="text-emerald-400 mt-4 font-bold animate-pulse">
                ¡Secuencia completada! Por favor, presiona el botón "Continuar a Segunda Fase" abajo.
              </p>
            )}
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Tus selecciones:</h3>
              <button 
                onClick={handleResetCurrent}
                disabled={currentSequence.length === 0}
                className="text-xs text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-1 disabled:opacity-50 transition-colors"
              >
                <RotateCcw size={12} /> Reiniciar selección
              </button>
            </div>
            <div className="flex gap-2 flex-wrap min-h-[60px] p-4 bg-white/5 border border-white/10 rounded-2xl">
              {currentSequence.map((colorId, i) => {
                const color = COLORS.find(c => c.id === colorId);
                return (
                  <div 
                    key={i}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/20 shadow-lg flex items-center justify-center text-xs font-black text-white/50"
                    style={{ backgroundColor: color?.hex }}
                  >
                    {i + 1}
                  </div>
                );
              })}
              {currentSequence.length === 0 && (
                <span className="text-sm text-slate-500 my-auto">Aún no has seleccionado colores.</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 text-center">Colores Disponibles:</h3>
            <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
              {COLORS.map(color => {
                const isSelected = currentSequence.includes(color.id);
                return (
                  <button
                    key={color.id}
                    disabled={isSelected || (isFirstSequence && sequence1.length >= 8)}
                    onClick={() => handleSelectColor(color.id)}
                    className={`aspect-square rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl ${isSelected ? 'opacity-10 scale-90 pointer-events-none' : 'hover:ring-4 ring-white/20'}`}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-end pt-12 border-t border-white/10 mt-12 min-h-[100px]">
            {isFirstSequence && sequence1.length === 8 && (
              <Button 
                variant="primary"
                onClick={handleNextSequence} 
                className="h-14 px-10 rounded-xl uppercase tracking-widest w-full sm:w-auto animate-in fade-in slide-in-from-bottom-4"
              >
                Continuar a Segunda Fase →
              </Button>
            )}
          </div>
        </div>
      </div>
    </TestAplicacionBase>
  );
}
