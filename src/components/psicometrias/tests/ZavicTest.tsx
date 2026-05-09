'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';

import { getZavicQuestions } from '@/data/zavicQuestions';

export default function ZavicTest({ config }: { config: TestInfoProps }) {
  const ZAVIC_QUESTIONS = getZavicQuestions();

  return (
    <GenericChoiceTest
      config={config}
      questions={ZAVIC_QUESTIONS}
    />
  );
}
