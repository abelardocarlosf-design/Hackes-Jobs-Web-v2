'use client';

import React, { useState, useEffect } from 'react';
import { TestAplicacionBase } from '../TestAplicacionBase';
import { Button } from '@/components/Button';
import { TestInfoProps } from '../TestInstrucciones';
import { Clock } from 'lucide-react';

// MOCK: Configuración de las 10 series de Terman
const TERMAN_SERIES = [
  { id: 1, title: 'Serie 1 - Información', timeMinutes: 2, questions: 16 },
  { id: 2, title: 'Serie 2 - Juicio Práctico', timeMinutes: 2, questions: 11 },
  { id: 3, title: 'Serie 3 - Vocabulario', timeMinutes: 2, questions: 30 },
  { id: 4, title: 'Serie 4 - Lógica', timeMinutes: 3, questions: 18 },
  { id: 5, title: 'Serie 5 - Aritmética', timeMinutes: 5, questions: 12 },
  { id: 6, title: 'Serie 6 - Juicio Práctico 2', timeMinutes: 2, questions: 20 },
  { id: 7, title: 'Serie 7 - Analogías', timeMinutes: 2, questions: 20 },
  { id: 8, title: 'Serie 8 - Ordenamiento de Oraciones', timeMinutes: 3, questions: 17 },
  { id: 9, title: 'Serie 9 - Clasificación', timeMinutes: 2, questions: 18 },
  { id: 10, title: 'Serie 10 - Razonamiento', timeMinutes: 4, questions: 11 }
];

export default function TermanTest({ config }: { config: TestInfoProps }) {
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [seriesTimeLeft, setSeriesTimeLeft] = useState<number>(TERMAN_SERIES[0].timeMinutes * 60);

  const totalQuestions = TERMAN_SERIES.reduce((acc, s) => acc + s.questions, 0);
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    const saved = localStorage.getItem(`hj_test_${config.slug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed.answers || {});
        // Restoring time precisely requires timestamp tracking, for simplicity we just restart the series time if reloaded
        const savedSeries = parsed.currentSeriesIndex || 0;
        setCurrentSeriesIndex(savedSeries);
        setSeriesTimeLeft(TERMAN_SERIES[savedSeries].timeMinutes * 60);
      } catch (e) {}
    }
  }, [config.slug]);

  const saveState = (newAnswers: any, seriesIdx: number) => {
    setIsSaving(true);
    localStorage.setItem(`hj_test_${config.slug}`, JSON.stringify({ answers: newAnswers, currentSeriesIndex: seriesIdx }));
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleNextSeries = () => {
    if (currentSeriesIndex < TERMAN_SERIES.length - 1) {
      const nextIdx = currentSeriesIndex + 1;
      setCurrentSeriesIndex(nextIdx);
      setSeriesTimeLeft(TERMAN_SERIES[nextIdx].timeMinutes * 60);
      saveState(answers, nextIdx);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Cronómetro de sub-serie
  useEffect(() => {
    if (seriesTimeLeft <= 0) {
      if (currentSeriesIndex < TERMAN_SERIES.length - 1) {
        handleNextSeries();
      }
      return;
    }
    const timer = setInterval(() => setSeriesTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [seriesTimeLeft, currentSeriesIndex]);

  const handleAnswer = (qId: number, val: string) => {
    const key = `s${currentSeriesIndex + 1}_q${qId}`;
    const newAnswers = { ...answers, [key]: val };
    setAnswers(newAnswers);
    saveState(newAnswers, currentSeriesIndex);
  };

  const handleFinalSubmit = () => {
    return {
      respuestas: answers
    };
  };

  const currentSeries = TERMAN_SERIES[currentSeriesIndex];

  return (
    <TestAplicacionBase
      slug={config.slug}
      totalQuestions={totalQuestions}
      answeredQuestions={answeredCount}
      onFinalSubmit={handleFinalSubmit}
      isSaving={isSaving}
    >
      <div className="bg-[#111] rounded-3xl shadow-2xl border border-white/10 overflow-hidden mt-6">
        <div className="p-8 sm:p-12">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-brand-orange text-sm font-bold rounded-lg mb-2 uppercase tracking-widest">
                Serie {currentSeries.id} de {TERMAN_SERIES.length}
              </span>
              <h2 className="text-xl sm:text-2xl font-medium text-slate-300 leading-snug">
                {currentSeries.title}
              </h2>
            </div>
            
            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-black ${seriesTimeLeft < 30 ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse' : 'bg-white/5 text-slate-300 border border-white/10'}`}>
              <Clock size={18} />
              {Math.floor(seriesTimeLeft / 60).toString().padStart(2, '0')}:{(seriesTimeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-slate-400">
              Responde las {currentSeries.questions} preguntas de esta serie antes de que el tiempo se agote. El sistema avanzará automáticamente a la siguiente serie.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: currentSeries.questions }).map((_, i) => {
                const qId = i + 1;
                const key = `s${currentSeries.id}_q${qId}`;
                const val = answers[key] || '';
                return (
                  <div key={qId} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="text-brand-orange font-black w-6">{qId}.</span>
                    <input 
                      type="text" 
                      value={val}
                      onChange={(e) => handleAnswer(qId, e.target.value)}
                      placeholder="Tu respuesta..."
                      className="flex-1 bg-transparent border-b border-white/20 px-2 py-1 text-white focus:outline-none focus:border-brand-orange transition-colors"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end pt-8 mt-8 border-t border-white/10">
            {currentSeriesIndex < TERMAN_SERIES.length - 1 && (
              <Button 
                variant="primary"
                onClick={handleNextSeries} 
                className="h-14 px-10 rounded-xl uppercase tracking-widest"
              >
                Siguiente Serie (Omitir tiempo) →
              </Button>
            )}
          </div>
        </div>
      </div>
    </TestAplicacionBase>
  );
}
