'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '../TestInstrucciones';

// MOCK: 60 matrices para Raven
// Nota: en producción, esto debe renderizar imágenes de matrices.
const RAVEN_QUESTIONS = Array.from({ length: 60 }).map((_, i) => ({
  id: `raven_${i + 1}`,
  question: `Matriz ${i + 1}: (Imagina una imagen de patrón aquí). ¿Qué figura completa el patrón?`,
  options: [
    { id: '1', text: 'Figura 1' },
    { id: '2', text: 'Figura 2' },
    { id: '3', text: 'Figura 3' },
    { id: '4', text: 'Figura 4' },
    { id: '5', text: 'Figura 5' },
    { id: '6', text: 'Figura 6' }
  ]
}));

export default function RavenTest({ config }: { config: TestInfoProps }) {
  return (
    <GenericChoiceTest
      config={config}
      questions={RAVEN_QUESTIONS}
      timeLimitMinutes={45}
    />
  );
}
