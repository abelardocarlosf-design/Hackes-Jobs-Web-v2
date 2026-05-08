'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';

// MOCK: 30 situaciones para Moss
const MOSS_QUESTIONS = Array.from({ length: 30 }).map((_, i) => ({
  id: `moss_${i + 1}`,
  question: `Situación de Moss número ${i + 1}: ¿Qué haría usted?`,
  options: [
    { id: 'a', text: 'Opción de respuesta A' },
    { id: 'b', text: 'Opción de respuesta B' },
    { id: 'c', text: 'Opción de respuesta C' },
    { id: 'd', text: 'Opción de respuesta D' }
  ]
}));

export default function MossTest({ config }: { config: TestInfoProps }) {
  return (
    <GenericChoiceTest
      config={config}
      questions={MOSS_QUESTIONS}
    />
  );
}
