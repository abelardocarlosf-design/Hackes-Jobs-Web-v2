'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';

import { getMossQuestions } from '@/data/mossQuestions';

export default function MossTest({ config }: { config: TestInfoProps }) {
  const MOSS_QUESTIONS = getMossQuestions();

  return (
    <GenericChoiceTest
      config={config}
      questions={MOSS_QUESTIONS}
    />
  );
}
