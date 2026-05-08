'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';

// MOCK: 185 preguntas para 16PF
const PF16_QUESTIONS = Array.from({ length: 185 }).map((_, i) => ({
  id: `16pf_${i + 1}`,
  question: `Pregunta de 16PF número ${i + 1}`,
  options: [
    { id: 'a', text: 'Opción A' },
    { id: 'b', text: 'Opción B (Intermedia)' },
    { id: 'c', text: 'Opción C' }
  ]
}));

export default function PF16Test({ config }: { config: TestInfoProps }) {
  return (
    <GenericChoiceTest
      config={config}
      questions={PF16_QUESTIONS}
    />
  );
}
