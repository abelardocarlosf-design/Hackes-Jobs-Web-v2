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
      {/* Step-progress dots */}
      <div className="flex justify-center gap-1.5 mt-6 mb-4 px-4 flex-wrap">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrentStep(i); saveState(answers, i); }}
            aria-label={`Ir a pregunta ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentStep
                ? 'bg-brand-orange scale-150 shadow-[0_0_6px_2px_rgba(255,107,0,0.6)]'
                : answers[questions[i].id]
                ? 'bg-brand-orange/50'
                : 'bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Question card */}
      <div className="relative bg-[#0e0e0e] rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Ambient glow top-left */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full bg-brand-orange/10 blur-3xl" />

        <div className="relative p-8 sm:p-12">
          {/* Question header — clean, no jargon */}
          <div className="mb-10 text-center">
            {/* Stitch-inspired pill: soft frosted glass */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-6
              bg-white/5 backdrop-blur-sm border border-white/10
              rounded-full shadow-inner shadow-white/5">
              <span className="w-5 h-5 rounded-full bg-brand-orange/20 border border-brand-orange/40
                text-brand-orange text-[10px] font-black flex items-center justify-center">
                {currentStep + 1}
              </span>
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
                  alt={`Imagen de apoyo`}
                  className="max-w-full max-h-[300px] object-contain rounded-xl border border-white/10 shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 mb-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {currentQuestion.options.map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`group w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-brand-orange bg-brand-orange/10 text-white shadow-md shadow-brand-orange/20'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:border-brand-orange/40 hover:bg-white/8'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isSelected ? 'border-brand-orange bg-brand-orange/20' : 'border-slate-600 group-hover:border-brand-orange/50'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />}
                    </div>
                    <span className="text-base leading-snug">{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`h-12 px-6 uppercase tracking-widest text-xs ${
                currentStep === 0 ? 'invisible' : 'bg-transparent border border-white/20'
              }`}
            >
              ← Anterior
            </Button>

            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              className={`h-12 px-8 rounded-xl uppercase tracking-widest text-xs ${
                currentStep === totalQuestions - 1 ? 'hidden' : ''
              }`}
            >
              Siguiente →
            </Button>
          </div>
        </div>
      </div>
    </TestAplicacionBase>
  );
}
