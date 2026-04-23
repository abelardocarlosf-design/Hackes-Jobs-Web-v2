"use client";

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface IllustrationProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export function Illustration({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: IllustrationProps) {
  const [error, setError] = useState(false);

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue/5 to-brand-orange/5 border border-slate-100 flex items-center justify-center group",
        className
      )}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {!error ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4 text-brand-blue group-hover:text-brand-orange transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">
            [ {alt} ]
          </span>
        </div>
      )}
    </div>
  );
}
