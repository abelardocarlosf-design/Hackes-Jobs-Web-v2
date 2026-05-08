'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';

// MOCK: 60 preguntas para Zavic
const ZAVIC_QUESTIONS = Array.from({ length: 60 }).map((_, i) => ({
  id: `zavic_${i + 1}`,
  question: `Situación de Zavic número ${i + 1}`,
  options: [
    { id: 'a', text: 'Opción A' },
    { id: 'b', text: 'Opción B' },
    { id: 'c', text: 'Opción C' },
    { id: 'd', text: 'Opción D' }
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
