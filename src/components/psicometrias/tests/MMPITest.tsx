'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';

// MOCK: 567 preguntas para MMPI
const MMPI_QUESTIONS = [
  { id: 'mmpi_1', question: 'Me gustan las revistas de mecánica.', options: [{ id: 'v', text: 'Verdadero' }, { id: 'f', text: 'Falso' }] },
  { id: 'mmpi_2', question: 'Tengo buen apetito.', options: [{ id: 'v', text: 'Verdadero' }, { id: 'f', text: 'Falso' }] },
  { id: 'mmpi_3', question: 'Casi siempre me levanto por las mañanas descansado y sin cansancio.', options: [{ id: 'v', text: 'Verdadero' }, { id: 'f', text: 'Falso' }] },
  { id: 'mmpi_4', question: 'Creo que me gustaría el trabajo de bibliotecario.', options: [{ id: 'v', text: 'Verdadero' }, { id: 'f', text: 'Falso' }] },
  { id: 'mmpi_5', question: 'El ruido me despierta fácilmente.', options: [{ id: 'v', text: 'Verdadero' }, { id: 'f', text: 'Falso' }] }
];

for (let i = 6; i <= 567; i++) {
  MMPI_QUESTIONS.push({
    id: `mmpi_${i}`,
    question: `Afirmación MMPI-2 número ${i}. Lea atentamente y responda si es Verdadero o Falso para usted.`,
    options: [
      { id: 'v', text: 'Verdadero' },
      { id: 'f', text: 'Falso' }
    ]
  });
}

export default function MMPITest({ config }: { config: TestInfoProps }) {
  return (
    <GenericChoiceTest
      config={config}
      questions={MMPI_QUESTIONS}
    />
  );
}
