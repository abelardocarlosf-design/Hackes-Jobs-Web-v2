'use client';

import React from 'react';
import GenericChoiceTest from './GenericChoiceTest';
import { TestInfoProps } from '@/lib/psicometriasConfig';
import { ZAVIC_QUESTIONS, ZAVIC_VERSION, calificarZavic } from '@/data/zavicQuestions';

export default function ZavicTest({ config }: { config: TestInfoProps }) {
  return <GenericChoiceTest config={config} questions={ZAVIC_QUESTIONS} version={ZAVIC_VERSION} calificar={calificarZavic} />;
}
