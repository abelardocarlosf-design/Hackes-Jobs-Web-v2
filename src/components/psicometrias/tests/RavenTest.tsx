'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';

// MOCK: 60 matrices para Raven
// Nota: en producción, esto debe renderizar imágenes de matrices.
const RAVEN_QUESTIONS = Array.from({ length: 60 }).map((_, i) => ({
  id: `raven_${i + 1}`,
  question: `Matriz progresiva ${i + 1}: Elige la pieza que completa el patrón.`,
  options: [
    { id: '1', text: 'Opción 1' },
    { id: '2', text: 'Opción 2' },
    { id: '3', text: 'Opción 3' },
    { id: '4', text: 'Opción 4' },
    { id: '5', text: 'Opción 5' },
    { id: '6', text: 'Opción 6' }
  ]
}));

export default function RavenTest({ config }: { config: TestInfoProps }) {
  return (
    <GenericChoiceTest
      config={config}
      questions={RAVEN_QUESTIONS}
    />
  );
}
