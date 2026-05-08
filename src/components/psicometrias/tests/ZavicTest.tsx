'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '../TestInstrucciones';

// MOCK: 60 preguntas para Zavic
const ZAVIC_QUESTIONS = Array.from({ length: 60 }).map((_, i) => ({
  id: `zavic_${i + 1}`,
  question: `Pregunta de Zavic ${i + 1}: Selecciona la opción que mejor represente tus valores.`,
  options: [
    { id: 'a', text: 'Valor A' },
    { id: 'b', text: 'Valor B' },
    { id: 'c', text: 'Valor C' },
    { id: 'd', text: 'Valor D' }
  ]
}));

export default function ZavicTest({ config }: { config: TestInfoProps }) {
  return (
    <GenericChoiceTest
      config={config}
      questions={ZAVIC_QUESTIONS}
    />
  );
}
