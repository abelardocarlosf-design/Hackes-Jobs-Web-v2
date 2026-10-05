'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';
import { MOSS_QUESTIONS, MOSS_VERSION, calificarMoss } from '@/data/mossQuestions';

export default function MossTest({ config }: { config: TestInfoProps }) {
  return <GenericChoiceTest config={config} questions={MOSS_QUESTIONS} version={MOSS_VERSION} calificar={calificarMoss} />;
}
