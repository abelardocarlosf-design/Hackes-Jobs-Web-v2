'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';
import { PF16_QUESTIONS, PF16_VERSION, calificarPF16 } from '@/data/pf16Questions';

export default function PF16Test({ config }: { config: TestInfoProps }) {
  return <GenericChoiceTest config={config} questions={PF16_QUESTIONS} version={PF16_VERSION} calificar={calificarPF16} />;
}
