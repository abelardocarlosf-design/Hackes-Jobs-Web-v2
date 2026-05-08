'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '../TestInstrucciones';

// MOCK: 30 situaciones para Moss
const MOSS_QUESTIONS = Array.from({ length: 30 }).map((_, i) => ({
  id: `moss_${i + 1}`,
  question: `Situación de Moss ${i + 1}: Un empleado de tu equipo llega tarde frecuentemente. ¿Qué haces?`,
  options: [
    { id: 'a', text: 'Opción A: Lo despides.' },
    { id: 'b', text: 'Opción B: Hablas con él para entender el problema.' },
    { id: 'c', text: 'Opción C: Lo ignoras.' },
    { id: 'd', text: 'Opción D: Le descuentas el sueldo directamente.' }
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
