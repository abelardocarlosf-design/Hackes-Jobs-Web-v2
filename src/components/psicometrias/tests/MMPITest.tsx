'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';
import { MMPI_QUESTIONS, MMPI_VERSION, calificarMMPI } from '@/data/mmpiQuestions';

export default function MMPITest({ config }: { config: TestInfoProps }) {
  return <GenericChoiceTest config={config} questions={MMPI_QUESTIONS} version={MMPI_VERSION} calificar={calificarMMPI} />;
}
