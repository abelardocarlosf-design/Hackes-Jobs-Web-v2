'use client';

import React, { useState, useEffect } from 'react';
import { TestAplicacionBase } from '../TestAplicacionBase';
import { Button } from '@/components/Button';
import { discQuestions, DiscType } from '@/data/discQuestions';
import { TestInfoProps } from '../TestInstrucciones';

export default function DiscTest({ config }: { config: TestInfoProps }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { mas_parecido: DiscType | null, menos_parecido: DiscType | null }>>({});
  const [isSaving, setIsSaving] = useState(false);

  const totalQuestions = discQuestions.length;
  // Consideramos respondida si tiene tanto 'mas_parecido' como 'menos_parecido'
  const answeredCount = Object.values(answers).filter(a => a.mas_parecido && a.menos_parecido).length;

  useEffect(() => {
    // Cargar estado de localStorage
    const saved = localStorage.getItem(`hj_test_${config.slug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed.answers || {});
        setCurrentStep(parsed.currentStep || 0);
      } catch (e) {}
    }
  }, [config.slug]);

  const saveState = (newAnswers: any, step: number) => {
    setIsSaving(true);
    localStorage.setItem(`hj_test_${config.slug}`, JSON.stringify({ answers: newAnswers, currentStep: step }));
    setTimeout(() => setIsSaving(false), 500);
  };

  const currentQuestion = discQuestions[currentStep];

  const handleSelectOption = (type: 'mas_parecido' | 'menos_parecido', optionType: DiscType) => {
    const currentAnswer = answers[currentQuestion.id] || { mas_parecido: null, menos_parecido: null };
    
    // Evitar que seleccione la misma opción para mas y menos
    if (type === 'mas_parecido' && currentAnswer.menos_parecido === optionType) return;
    if (type === 'menos_parecido' && currentAnswer.mas_parecido === optionType) return;

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: {
        ...currentAnswer,
        [type]: optionType
      }
    };
    
    setAnswers(newAnswers);
    saveState(newAnswers, currentStep);
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      saveState(answers, nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      saveState(answers, prevStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = () => {
    // Retorna el payload específico para el webhook de n8n
    const respuestasArray = Object.keys(answers).map(key => ({
      grupo: key,
      mas_parecido: answers[Number(key)].mas_parecido,
      menos_parecido: answers[Number(key)].menos_parecido,
    }));

    return respuestasArray;
  };

  const isCurrentQuestionAnswered = 
    answers[currentQuestion?.id]?.mas_parecido && 
    answers[currentQuestion?.id]?.menos_parecido;

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
          <div className="mb-10 text-center">
            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-brand-orange text-sm font-bold rounded-lg mb-4 uppercase tracking-widest">
              Grupo {currentQuestion.id} de {totalQuestions}
            </span>
            <h2 className="text-xl sm:text-2xl font-medium text-slate-300 leading-snug">
              Selecciona la palabra que <strong className="text-emerald-400">MÁS (+)</strong> y <strong className="text-brand-orange">MENOS (-)</strong> te describe.
            </h2>
          </div>

          <div className="space-y-4 mb-12">
            {currentQuestion.options.map((option, index) => {
              const currentAns = answers[currentQuestion.id] || { mas_parecido: null, menos_parecido: null };
              const isMas = currentAns.mas_parecido === option.type;
              const isMenos = currentAns.menos_parecido === option.type;
              
              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="text-lg font-medium text-white flex-1 text-center md:text-left">
                    {option.text}
                  </span>
                  <div className="flex gap-4 ml-4">
                    <button
                      onClick={() => handleSelectOption('mas_parecido', option.type)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl transition-all ${isMas ? 'bg-emerald-500 text-white' : 'bg-black/50 text-slate-500 hover:text-emerald-400 border border-white/10'}`}
                      disabled={isMenos}
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleSelectOption('menos_parecido', option.type)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl transition-all ${isMenos ? 'bg-brand-orange text-white' : 'bg-black/50 text-slate-500 hover:text-brand-orange border border-white/10'}`}
                      disabled={isMas}
                    >
                      -
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <Button 
              variant="secondary" 
              onClick={handlePrevious} 
              disabled={currentStep === 0}
              className={`h-14 px-6 uppercase tracking-widest ${currentStep === 0 ? 'invisible' : 'bg-transparent border border-white/20'}`}
            >
              ← Anterior
            </Button>

            <Button 
              variant="primary"
              onClick={handleNext} 
              disabled={!isCurrentQuestionAnswered}
              className={`h-14 px-10 rounded-xl uppercase tracking-widest ${currentStep === totalQuestions - 1 ? 'hidden' : ''}`}
            >
              Siguiente →
            </Button>
          </div>
        </div>
      </div>
    </TestAplicacionBase>
  );
}
