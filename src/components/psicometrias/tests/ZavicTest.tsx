'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';

// MOCK: 60 preguntas para Zavic
const ZAVIC_QUESTIONS = [
  { id: 'z_1', question: 'Situación 1: Encuentra dinero en el pasillo de la oficina. Usted:', options: [{ id: 'a', text: 'Lo reporta a Recursos Humanos o seguridad.' }, { id: 'b', text: 'Lo guarda hasta que alguien pregunte por él.' }, { id: 'c', text: 'Lo dona a una causa benéfica de la empresa.' }, { id: 'd', text: 'Se lo queda pensando que es su día de suerte.' }] },
  { id: 'z_2', question: 'Situación 2: Descubre que un compañero está llevándose material de oficina a su casa. Usted:', options: [{ id: 'a', text: 'Lo confronta directamente.' }, { id: 'b', text: 'Lo reporta anónimamente a su supervisor.' }, { id: 'c', text: 'No hace nada, no es su problema.' }, { id: 'd', text: 'Le comenta a otros compañeros para ver qué piensan.' }] },
  { id: 'z_3', question: 'Situación 3: Su jefe directo le pide modificar un reporte de ventas para que se vea mejor. Usted:', options: [{ id: 'a', text: 'Se niega rotundamente por ética.' }, { id: 'b', text: 'Lo hace, pero guarda una copia del original.' }, { id: 'c', text: 'Lo reporta al área de cumplimiento (compliance).' }, { id: 'd', text: 'Accede sin cuestionar porque es su superior.' }] }
];

for (let i = 4; i <= 60; i++) {
  ZAVIC_QUESTIONS.push({
    id: `z_${i}`,
    question: `Situación Zavic ${i}: Se le presenta un dilema ético o moral en el trabajo. ¿Cómo reacciona?`,
    options: [
      { id: 'a', text: 'Priorizo la legalidad y las reglas de la empresa.' },
      { id: 'b', text: 'Busco un punto medio que no afecte a nadie.' },
      { id: 'c', text: 'Protejo a mis compañeros de equipo por encima de todo.' },
      { id: 'd', text: 'Busco el beneficio económico personal o del departamento.' }
    ]
  });
}

export default function ZavicTest({ config }: { config: TestInfoProps }) {
  return (
    <GenericChoiceTest
      config={config}
      questions={ZAVIC_QUESTIONS}
    />
  );
}
