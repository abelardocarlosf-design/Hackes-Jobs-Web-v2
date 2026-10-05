'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';
import { getRavenQuestions } from '@/data/ravenQuestions';

// Raven sigue como "Próximamente": faltan las 60 imágenes de las matrices
// (public/assets/raven/q01.png … q60.png) y su clave de respuestas.
export default function RavenTest({ config }: { config: TestInfoProps }) {
  return <GenericChoiceTest config={config} questions={getRavenQuestions()} version="raven-pendiente" />;
}
