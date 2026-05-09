'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';

import { getMMPIQuestions } from '@/data/mmpiQuestions';

export default function MMPITest({ config }: { config: TestInfoProps }) {
  const MMPI_QUESTIONS = getMMPIQuestions();

  return (
    <GenericChoiceTest
      config={config}
      questions={MMPI_QUESTIONS}
    />
  );
}
