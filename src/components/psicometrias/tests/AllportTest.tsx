'use client';

import React, { useState, useEffect } from 'react';
import { TestAplicacionBase } from '../TestAplicacionBase';
import { Button } from '@/components/Button';
import { TestInfoProps } from '../TestInstrucciones';

// MOCK de preguntas para Allport.
// En producción, estas deberían venir de una base de datos o un archivo de datos local.
const ALLPORT_PART_1 = Array.from({ length: 30 }).map((_, i) => ({
  id: `p1_${i + 1}`,
  question: `Situación o afirmación de la parte 1, pregunta ${i + 1}`,
  options: [
    { id: 'a', text: 'Opción A' },
    { id: 'b', text: 'Opción B' }
  ]
}));

const ALLPORT_PART_2 = Array.from({ length: 15 }).map((_, i) => ({
  id: `p2_${i + 1}`,
  question: `Situación para ordenar de la parte 2, pregunta ${i + 1}`,
  options: [
    { id: 'a', text: 'Preferencia A' },
    { id: 'b', text: 'Preferencia B' },
    { id: 'c', text: 'Preferencia C' },
    { id: 'd', text: 'Preferencia D' }
  ]
}));

export default function AllportTest({ config }: { config: TestInfoProps }) {
  const [answersPart1, setAnswersPart1] = useState<Record<string, string>>({});
  const [answersPart2, setAnswersPart2] = useState<Record<string, string[]>>({});
  const [currentStep, setCurrentStep] = useState(0); // 0 a 44 (30 + 15)
  const [isSaving, setIsSaving] = useState(false);

  const totalQuestions = ALLPORT_PART_1.length + ALLPORT_PART_2.length;
  const answeredCount = Object.keys(answersPart1).length + Object.keys(answersPart2).filter(k => answersPart2[k].length === 4).length;

  useEffect(() => {
    const saved = localStorage.getItem(`hj_test_${config.slug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswersPart1(parsed.answersPart1 || {});
        setAnswersPart2(parsed.answersPart2 || {});
        setCurrentStep(parsed.currentStep || 0);
      } catch (e) {}
    }
  }, [config.slug]);

  const saveState = (p1: any, p2: any, step: number) => {
    setIsSaving(true);
    localStorage.setItem(`hj_test_${config.slug}`, JSON.stringify({ answersPart1: p1, answersPart2: p2, currentStep: step }));
    setTimeout(() => setIsSaving(false), 500);
  };

  const isPart1 = currentStep < ALLPORT_PART_1.length;
  const currentQuestionPart1 = isPart1 ? ALLPORT_PART_1[currentStep] : null;
  const currentQuestionPart2 = !isPart1 ? ALLPORT_PART_2[currentStep - ALLPORT_PART_1.length] : null;

  const handleSelectPart1 = (optionId: string) => {
    if (!currentQuestionPart1) return;
    const newAnswers = { ...answersPart1, [currentQuestionPart1.id]: optionId };
    setAnswersPart1(newAnswers);
    saveState(newAnswers, answersPart2, currentStep);
    
    // Auto-advance
    setTimeout(() => {
      if (currentStep < totalQuestions - 1) {
        setCurrentStep(s => s + 1);
        saveState(newAnswers, answersPart2, currentStep + 1);
      }
    }, 400);
  };

  const handleSelectPart2 = (optionId: string) => {
    if (!currentQuestionPart2) return;
    const qId = currentQuestionPart2.id;
    const currentAns = answersPart2[qId] || [];
    
    if (currentAns.includes(optionId)) {
      // Toggle off
      const newAnsArray = currentAns.filter(id => id !== optionId);
      const newAnswers = { ...answersPart2, [qId]: newAnsArray };
      setAnswersPart2(newAnswers);
      saveState(answersPart1, newAnswers, currentStep);
    } else if (currentAns.length < 4) {
      // Toggle on
      const newAnsArray = [...currentAns, optionId];
      const newAnswers = { ...answersPart2, [qId]: newAnsArray };
      setAnswersPart2(newAnswers);
      saveState(answersPart1, newAnswers, currentStep);
    }
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(s => s + 1);
      saveState(answersPart1, answersPart2, currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
      saveState(answersPart1, answersPart2, currentStep - 1);
    }
  };

  const handleFinalSubmit = () => {
    return {
      parte1: answersPart1,
      parte2: answersPart2
    };
  };

  const renderPart1 = () => {
    if (!currentQuestionPart1) return null;
    return (
      <div className="space-y-4 animate-in fade-in">
        <h2 className="text-xl sm:text-2xl font-medium text-slate-300 leading-snug mb-8">
          {currentQuestionPart1.question}
        </h2>
        {currentQuestionPart1.options.map((opt) => {
          const isSelected = answersPart1[currentQuestionPart1.id] === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelectPart1(opt.id)}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 ${isSelected ? 'border-brand-orange bg-brand-orange/10 text-white shadow-lg' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'}`}
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
    );
  };

  const renderPart2 = () => {
    if (!currentQuestionPart2) return null;
    const qId = currentQuestionPart2.id;
    const currentAns = answersPart2[qId] || [];
    
    return (
      <div className="space-y-4 animate-in fade-in">
        <h2 className="text-xl sm:text-2xl font-medium text-slate-300 leading-snug mb-4">
          {currentQuestionPart2.question}
        </h2>
        <p className="text-brand-orange mb-8 text-sm uppercase tracking-widest font-bold">
          Selecciona las opciones en orden de preferencia (1 = Mayor, 4 = Menor)
        </p>
        <div className="space-y-3">
          {currentQuestionPart2.options.map((opt) => {
            const index = currentAns.indexOf(opt.id);
            const isSelected = index !== -1;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectPart2(opt.id)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${isSelected ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black ${isSelected ? 'bg-emerald-500 text-white' : 'bg-black/50 text-slate-500 border border-white/10'}`}>
                  {isSelected ? index + 1 : '-'}
                </div>
                <span className="text-lg flex-1">{opt.text}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

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
              Parte {isPart1 ? '1' : '2'} - Pregunta {currentStep + 1} de {totalQuestions}
            </span>
          </div>

          <div className="min-h-[300px]">
            {isPart1 ? renderPart1() : renderPart2()}
          </div>

          <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/10">
            <Button 
              variant="secondary" 
              onClick={handlePrevious} 
              disabled={currentStep === 0}
              className={`h-14 px-6 uppercase tracking-widest ${currentStep === 0 ? 'invisible' : 'bg-transparent border border-white/20'}`}
            >
              ← Anterior
            </Button>

            {!isPart1 && (
              <Button 
                variant="primary"
                onClick={handleNext} 
                disabled={currentQuestionPart2 && (answersPart2[currentQuestionPart2.id]?.length !== 4)}
                className={`h-14 px-10 rounded-xl uppercase tracking-widest ${currentStep === totalQuestions - 1 ? 'hidden' : ''}`}
              >
                Siguiente →
              </Button>
            )}
          </div>
        </div>
      </div>
    </TestAplicacionBase>
  );
}
