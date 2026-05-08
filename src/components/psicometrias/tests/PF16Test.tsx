'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '../TestInstrucciones';

// MOCK: 185 preguntas para 16PF
const PF16_QUESTIONS = Array.from({ length: 185 }).map((_, i) => ({
  id: `16pf_${i + 1}`,
  question: `Pregunta de 16PF ${i + 1}: Cuando estoy en un grupo de personas...`,
  options: [
    { id: 'a', text: 'Opción A' },
    { id: 'b', text: 'Opción B (Término medio)' },
    { id: 'c', text: 'Opción C' }
  ]
}));

export default function PF16Test({ config }: { config: TestInfoProps }) {
  return (
    <GenericChoiceTest
      config={config}
      questions={PF16_QUESTIONS}
      timeLimitMinutes={60}
    />
  );
}
