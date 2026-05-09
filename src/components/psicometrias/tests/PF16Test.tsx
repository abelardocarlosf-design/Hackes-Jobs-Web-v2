'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';

import { getPF16Questions } from '@/data/pf16Questions';

export default function PF16Test({ config }: { config: TestInfoProps }) {
  const PF16_QUESTIONS = getPF16Questions();

  return (
    <GenericChoiceTest
      config={config}
      questions={PF16_QUESTIONS}
    />
  );
}
