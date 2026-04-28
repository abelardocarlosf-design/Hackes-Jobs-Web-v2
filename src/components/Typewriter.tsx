'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string | string[];
  speed?: number;
  delay?: number;
  className?: string;
  loop?: boolean;
}

export function Typewriter({ text, speed = 100, delay = 0, className, loop = false }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textArrayIndex, setTextArrayIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    const currentString = Array.isArray(text) ? text[textArrayIndex] : text;

    if (!isDeleting && currentIndex < currentString.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + currentString[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && currentIndex > 0) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev.slice(0, -1));
        setCurrentIndex(prev => prev - 1);
      }, speed / 2);
      return () => clearTimeout(timeout);
    }

    if (loop && Array.isArray(text)) {
      if (!isDeleting && currentIndex === currentString.length) {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
        return () => clearTimeout(timeout);
      }
      
      if (isDeleting && currentIndex === 0) {
        setIsDeleting(false);
        setTextArrayIndex((prev) => (prev + 1) % text.length);
      }
    }

  }, [currentIndex, isDeleting, started, text, speed, textArrayIndex, loop]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse border-r-4 border-brand-orange ml-1 h-full"></span>
    </span>
  );
}
