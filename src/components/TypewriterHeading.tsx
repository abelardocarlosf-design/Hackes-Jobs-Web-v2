'use client';

import React from 'react';
import { Typewriter } from '@/components/Typewriter';

interface TypewriterHeadingProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  headingClassName?: string;
  afterContent?: React.ReactNode;
  as?: 'h1' | 'h2';
}

export function TypewriterHeading({ 
  text, 
  speed = 70, 
  delay = 400, 
  className = 'text-brand-orange',
  headingClassName = '',
  afterContent,
  as: Tag = 'h1'
}: TypewriterHeadingProps) {
  return (
    <Tag className={headingClassName}>
      <Typewriter text={text} speed={speed} delay={delay} className={className} />
      {afterContent && <> {afterContent}</>}
    </Tag>
  );
}
