'use client';

import React, { useState, useEffect } from 'react';
import { TestAplicacionBase } from '../TestAplicacionBase';
import { Button } from '@/components/Button';
import { TestInfoProps } from '@/lib/psicometriasConfig';

export interface ChoiceOption {
  id: string;
  text: string;
}

export interface ChoiceQuestion {
  id: string;
  question: string;
  imageUrl?: string;
  options: ChoiceOption[];
}

export interface GenericChoiceTestProps {
  config: TestInfoProps;
  questions: ChoiceQuestion[];
  timeLimitMinutes?: number;
}

export default function GenericChoiceTest({ config, questions, timeLimitMinutes }: GenericChoiceTestProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
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

  const currentQuestion = questions[currentStep];

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    const newAnswers = { ...answers, [currentQuestion.id]: optionId };
    setAnswers(newAnswers);
    saveState(newAnswers, currentStep);
    
    // Auto-advance after short delay
    setTimeout(() => {
      if (currentStep < totalQuestions - 1) {
        setCurrentStep(s => s + 1);
        saveState(newAnswers, currentStep + 1);
      }
    }, 300);
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(s => s + 1);
      saveState(answers, currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
      saveState(answers, currentStep - 1);
    }
  };

  const handleFinalSubmit = () => {
    // Retornamos directamente el objeto plano { "Q1": "A", ... }
    return answers;
  };

  if (!currentQuestion) return null;

  return (
    <TestAplicacionBase
      slug={config.slug}
      totalQuestions={totalQuestions}
      answeredQuestions={answeredCount}
      timeLimitMinutes={timeLimitMinutes}
      onFinalSubmit={handleFinalSubmit}
      isSaving={isSaving}
    >
      <div className="bg-[#111] rounded-3xl shadow-2xl border border-white/10 overflow-hidden mt-6">
        <div className="p-8 sm:p-12">
          <div className="mb-10 text-center">
            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-brand-orange text-sm font-bold rounded-lg mb-4 uppercase tracking-widest">
              Pregunta {currentStep + 1} de {totalQuestions}
            </span>
            <h2 className="text-xl sm:text-2xl font-medium text-slate-300 leading-snug">
              {currentQuestion.question}
            </h2>
            {currentQuestion.imageUrl && (
              <div className="mt-6 flex justify-center">
                <img 
                  src={currentQuestion.imageUrl} 
                  alt={`Imagen para pregunta ${currentStep + 1}`} 
                  className="max-w-full max-h-[300px] object-contain rounded-xl border border-white/10 shadow-lg"
                />
              </div>
            )}
          </div>

          <div className="space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-2">
            {currentQuestion.options.map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 ${isSelected ? 'border-brand-orange bg-brand-orange/10 text-white shadow-lg shadow-brand-orange/20' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-brand-orange' : 'border-slate-500'}`}>
                      {isSelected && <div className="w-3 h-3 rounded-full bg-brand-orange" />}
                    </div>
                    <span className="text-lg">{opt.text}</span>
                  </div>
                </button>
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
              disabled={!answers[currentQuestion.id]}
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
