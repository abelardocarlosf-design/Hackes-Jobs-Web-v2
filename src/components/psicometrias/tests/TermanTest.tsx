'use client';

import React, { useState, useEffect } from 'react';
import { TestAplicacionBase } from '../TestAplicacionBase';
import { Button } from '@/components/Button';
import { TestInfoProps } from '@/lib/psicometriasConfig';
import { Clock, AlertTriangle } from 'lucide-react';

import { TERMAN_SERIES, TERMAN_QUESTIONS } from '@/data/termanQuestions';

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
    // Ya es un objeto plano { "s1_q1": "respuesta" }
    return answers;
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
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-brand-orange text-sm font-bold rounded-lg mb-2 uppercase tracking-widest">
                Serie {currentSeries.id} de {TERMAN_SERIES.length}
              </span>
              <h2 className="text-xl sm:text-2xl font-medium text-slate-300 leading-snug">
                {currentSeries.title}
              </h2>
            </div>
            
            <div className={`px-6 py-3 rounded-xl flex items-center gap-3 font-black text-xl transition-colors duration-500 ${seriesTimeLeft < 30 ? 'bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse' : 'bg-white/5 text-slate-300 border border-white/10'}`}>
              <Clock size={24} />
              {Math.floor(seriesTimeLeft / 60).toString().padStart(2, '0')}:{(seriesTimeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-brand-orange/10 border border-brand-orange/30 p-4 rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-brand-orange shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-brand-orange mb-1">Instrucciones de la Serie:</h4>
                <p className="text-brand-orange/80 text-sm">
                  {currentSeries.desc}. Responda las {currentSeries.questions} preguntas lo más rápido posible. 
                  <strong> ¡El tiempo es estricto y la serie avanzará automáticamente al llegar a 00:00!</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-8">
              {TERMAN_QUESTIONS[`s${currentSeries.id}` as keyof typeof TERMAN_QUESTIONS]?.map((question: any, i: number) => {
                const qId = question.id;
                const key = `s${currentSeries.id}_q${qId}`;
                const val = answers[key] || '';
                return (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="text-brand-orange font-black w-8 shrink-0">{qId}.</span>
                    <span className="text-slate-300 flex-1">
                      {question.text}
                    </span>
                    <input 
                      type="text" 
                      value={val}
                      onChange={(e) => handleAnswer(qId, e.target.value)}
                      placeholder="Respuesta..."
                      className="w-full sm:w-48 bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
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
