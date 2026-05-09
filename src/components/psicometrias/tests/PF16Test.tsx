'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';

// MOCK: 185 preguntas para 16PF
const PF16_QUESTIONS = [
  { id: 'pf_1', question: 'En una fiesta con mucha gente que no conozco:', options: [{ id: 'a', text: 'Me siento cómodo y empiezo a conversar.' }, { id: 'b', text: 'No estoy seguro (Intermedio).' }, { id: 'c', text: 'Prefiero mantenerme al margen u observar.' }] },
  { id: 'pf_2', question: 'Cuando alguien no está de acuerdo conmigo en una discusión:', options: [{ id: 'a', text: 'Me altero un poco e intento convencerle.' }, { id: 'b', text: 'Depende de la situación.' }, { id: 'c', text: 'Escucho sus argumentos calmadamente.' }] },
  { id: 'pf_3', question: 'Prefiero leer libros o ver documentales sobre:', options: [{ id: 'a', text: 'Historia o hechos reales.' }, { id: 'b', text: 'Ambos por igual.' }, { id: 'c', text: 'Ciencia ficción o temas abstractos.' }] }
];

for (let i = 4; i <= 185; i++) {
  PF16_QUESTIONS.push({
    id: `pf_${i}`,
    question: `Pregunta de 16PF número ${i}: Indica qué comportamiento describe mejor tu forma habitual de actuar.`,
    options: [
      { id: 'a', text: 'Totalmente de acuerdo.' },
      { id: 'b', text: 'No estoy seguro / Intermedio.' },
      { id: 'c', text: 'Totalmente en desacuerdo.' }
    ]
  });
}

export default function PF16Test({ config }: { config: TestInfoProps }) {
  return (
    <GenericChoiceTest
      config={config}
      questions={PF16_QUESTIONS}
    />
  );
}
