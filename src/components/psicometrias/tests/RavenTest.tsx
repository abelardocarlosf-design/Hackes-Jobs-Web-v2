'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';

import { getRavenQuestions } from '@/data/ravenQuestions';

export default function RavenTest({ config }: { config: TestInfoProps }) {
  const RAVEN_QUESTIONS = getRavenQuestions();

  return (
    <GenericChoiceTest
      config={config}
      questions={RAVEN_QUESTIONS}
    />
  );
}
