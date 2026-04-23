"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './Button';
import { discQuestions, DiscType } from '@/data/discQuestions';

export function DiscTest() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, DiscType>>({});

  const totalQuestions = discQuestions.length;
  const progressPercentage = ((currentStep) / totalQuestions) * 100;

  const currentQuestion = discQuestions[currentStep];

  const handleSelectOption = (type: DiscType) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: type
    });
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    // Calculate final score
    const scores = { D: 0, I: 0, S: 0, C: 0 };
    Object.values(answers).forEach(val => {
      scores[val]++;
    });

    // Create query parameters with scores
    const params = new URLSearchParams({
      D: scores.D.toString(),
      I: scores.I.toString(),
      S: scores.S.toString(),
      C: scores.C.toString(),
    });

    // Redirect to results page
    router.push(`/psicometrias/disc/resultado?${params.toString()}`);
  };

  const isCurrentQuestionAnswered = !!answers[currentQuestion?.id];

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-slate-50 border-b border-slate-100 px-8 py-6">
        <div className="flex justify-between items-center mb-3 text-sm font-bold text-slate-500 uppercase tracking-wider">
          <span>Progreso</span>
          <span>{currentStep + 1} de {totalQuestions}</span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Question Area */}
      <div className="p-8 sm:p-12">
        <div className="mb-10">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg mb-4">Pregunta {currentQuestion.id}</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
            {currentQuestion.question}
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Selecciona la opción que mejor te describe en el trabajo.</p>
        </div>

        <div className="space-y-4 mb-12">
          {currentQuestion.options.map((option, index) => {
            const isSelected = answers[currentQuestion.id] === option.type;
            
            return (
              <label 
                key={index} 
                className={`
                  flex items-center p-5 sm:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 group
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100' 
                    : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50'}
                `}
                onClick={() => handleSelectOption(option.type)}
              >
                <div className={`
                  flex-shrink-0 w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors
                  ${isSelected ? 'border-blue-500' : 'border-slate-300 group-hover:border-blue-400'}
                `}>
                  {isSelected && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                </div>
                <span className={`text-lg font-medium ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                  {option.text}
                </span>
              </label>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <Button 
            variant="ghost" 
            onClick={handlePrevious} 
            disabled={currentStep === 0}
            className={`text-slate-500 font-bold h-14 px-6 ${currentStep === 0 ? 'invisible' : ''}`}
          >
            ← Anterior
          </Button>

          {currentStep < totalQuestions - 1 ? (
            <Button 
              onClick={handleNext} 
              disabled={!isCurrentQuestionAnswered}
              className="bg-slate-900 hover:bg-blue-600 text-white font-bold h-14 px-10 rounded-xl transition-all shadow-md hover:shadow-blue-600/30 disabled:opacity-50 disabled:hover:bg-slate-900 disabled:hover:shadow-none"
            >
              Siguiente pregunta →
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={!isCurrentQuestionAnswered}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black h-14 px-10 rounded-xl transition-all shadow-xl shadow-blue-600/30 disabled:opacity-50 disabled:hover:shadow-none"
            >
              Finalizar evaluación
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
