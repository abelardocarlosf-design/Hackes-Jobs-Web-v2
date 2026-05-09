'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';

import { getKostickQuestions } from '@/data/kostickQuestions';

export default function KostickTest({ config }: { config: TestInfoProps }) {
  const KOSTICK_QUESTIONS = getKostickQuestions();

  return (
    <GenericChoiceTest
      config={config}
      questions={KOSTICK_QUESTIONS}
    />
  );
}
