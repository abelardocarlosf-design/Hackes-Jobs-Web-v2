'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';

// MOCK: 567 preguntas para MMPI
const MMPI_QUESTIONS = Array.from({ length: 567 }).map((_, i) => ({
  id: `mmpi_${i + 1}`,
  question: `Afirmación de MMPI-2 número ${i + 1}`,
  options: [
    { id: 'v', text: 'Verdadero' },
    { id: 'f', text: 'Falso' }
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
