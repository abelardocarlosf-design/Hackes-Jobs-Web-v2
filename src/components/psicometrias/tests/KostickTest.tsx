'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '../TestInstrucciones';

// MOCK: 90 pares para Kostick
const KOSTICK_QUESTIONS = Array.from({ length: 90 }).map((_, i) => ({
  id: `kostick_${i + 1}`,
  question: `Pregunta de Kostick ${i + 1}: Elige la afirmación que más te describa.`,
  options: [
    { id: 'a', text: 'Opción A: Soy muy organizado.' },
    { id: 'b', text: 'Opción B: Soy muy creativo.' }
  ]
}));

export default function KostickTest({ config }: { config: TestInfoProps }) {
  return (
    <GenericChoiceTest
      config={config}
      questions={KOSTICK_QUESTIONS}
    />
  );
}
