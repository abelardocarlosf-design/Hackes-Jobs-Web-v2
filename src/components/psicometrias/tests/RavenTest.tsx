'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';

// MOCK: 60 matrices para Raven con placeholders de imágenes
const RAVEN_QUESTIONS = [
  { 
    id: 'raven_1', 
    question: 'Matriz progresiva 1: Elige la pieza que completa el patrón visual.', 
    imageUrl: 'https://via.placeholder.com/600x300/111111/f97316?text=Matriz+Progresiva+Raven+1',
    options: [
      { id: '1', text: 'Pieza 1' }, { id: '2', text: 'Pieza 2' }, { id: '3', text: 'Pieza 3' },
      { id: '4', text: 'Pieza 4' }, { id: '5', text: 'Pieza 5' }, { id: '6', text: 'Pieza 6' }
    ] 
  },
  { 
    id: 'raven_2', 
    question: 'Matriz progresiva 2: Identifica la figura faltante en la secuencia.', 
    imageUrl: 'https://via.placeholder.com/600x300/111111/10b981?text=Matriz+Progresiva+Raven+2',
    options: [
      { id: '1', text: 'Pieza 1' }, { id: '2', text: 'Pieza 2' }, { id: '3', text: 'Pieza 3' },
      { id: '4', text: 'Pieza 4' }, { id: '5', text: 'Pieza 5' }, { id: '6', text: 'Pieza 6' }
    ] 
  }
];

for (let i = 3; i <= 60; i++) {
  RAVEN_QUESTIONS.push({
    id: `raven_${i}`,
    question: `Matriz progresiva ${i}: Elige la pieza correcta para completar el diseño.`,
    imageUrl: `https://via.placeholder.com/600x300/111111/ffffff?text=Matriz+Progresiva+Raven+${i}`,
    options: [
      { id: '1', text: 'Pieza 1' },
      { id: '2', text: 'Pieza 2' },
      { id: '3', text: 'Pieza 3' },
      { id: '4', text: 'Pieza 4' },
      { id: '5', text: 'Pieza 5' },
      { id: '6', text: 'Pieza 6' }
    ]
  });
}

export default function RavenTest({ config }: { config: TestInfoProps }) {
  return (
    <GenericChoiceTest
      config={config}
      questions={RAVEN_QUESTIONS}
    />
  );
}
