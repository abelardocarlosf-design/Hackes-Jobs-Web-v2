'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';
import { KOSTICK_QUESTIONS, KOSTICK_VERSION, calificarKostick } from '@/data/kostickQuestions';

export default function KostickTest({ config }: { config: TestInfoProps }) {
  return <GenericChoiceTest config={config} questions={KOSTICK_QUESTIONS} version={KOSTICK_VERSION} calificar={calificarKostick} />;
}
