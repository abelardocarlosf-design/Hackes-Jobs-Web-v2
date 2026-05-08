'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '../TestInstrucciones';

// MOCK: 567 preguntas para MMPI
const MMPI_QUESTIONS = Array.from({ length: 567 }).map((_, i) => ({
  id: `mmpi_${i + 1}`,
  question: `Afirmación de MMPI ${i + 1}: Me gustan las revistas de mecánica.`,
  options: [
    { id: 'true', text: 'Verdadero' },
    { id: 'false', text: 'Falso' }
  ]
}));

export default function MMPITest({ config }: { config: TestInfoProps }) {
  return (
    <GenericChoiceTest
      config={config}
      questions={MMPI_QUESTIONS}
    />
  );
}
