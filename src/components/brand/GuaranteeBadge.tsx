'use client';

import { useState } from 'react';

/**
 * Premium medallion-style guarantee seal.
 * Inspired by classic quality guarantee badges — adapted for "10 días · Garantía de Reposición".
 * 
 * Uses pure SVG for crisp rendering at any scale.
 * Includes an interactive tooltip on hover/tap with guarantee details.
 */
export function GuaranteeBadge({ className = '' }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`relative inline-flex flex-col items-center z-50 ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(prev => !prev)}
    >
      {/* The Seal */}
      <button
        type="button"
        className="group relative block focus:outline-none"
        aria-expanded={isOpen}
        aria-label="Garantía de reposición en 10 días naturales. Si el candidato no funciona, lo reemplazamos sin cargos adicionales."
      >
        <svg
          viewBox="0 0 240 240"
          className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] lg:w-[180px] lg:h-[180px] drop-shadow-[0_8px_24px_rgba(212,175,55,0.35)] group-hover:drop-shadow-[0_12px_32px_rgba(212,175,55,0.5)] transition-all duration-500 group-hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gold Gradient — Main Fill */}
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF0A0" />
              <stop offset="25%" stopColor="#E8C84A" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="75%" stopColor="#C5993B" />
              <stop offset="100%" stopColor="#AA6C39" />
            </linearGradient>
            {/* Gold Gradient — Dark ribbon */}
            <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3D2A12" />
              <stop offset="100%" stopColor="#1A120B" />
            </linearGradient>
            {/* Sheen overlay */}
            <radialGradient id="sheen" cx="35%" cy="30%" r="55%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            {/* Circular text path */}
            <path id="topCurve" d="M 120,120 m -78,0 a 78,78 0 1,1 156,0" fill="none" />
          </defs>

          {/* Starburst / Serrated Edge */}
          <g transform="translate(120,120)">
            {Array.from({ length: 24 }).map((_, i) => (
              <polygon
                key={i}
                points="0,-118 10,-98 -10,-98"
                fill="url(#goldGrad)"
                transform={`rotate(${i * 15})`}
              />
            ))}
          </g>

          {/* Outer gold circle */}
          <circle cx="120" cy="120" r="100" fill="url(#goldGrad)" stroke="#AA6C39" strokeWidth="2" />

          {/* Inner dark circle */}
          <circle cx="120" cy="120" r="88" fill="#1A120B" stroke="#D4AF37" strokeWidth="2.5" />

          {/* Decorative inner ring */}
          <circle cx="120" cy="120" r="82" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.5" />

          {/* Curved top text: COMPROMISO DE CALIDAD */}
          <text fill="#D4AF37" fontSize="11.5" fontWeight="900" letterSpacing="3.5" textAnchor="middle">
            <textPath href="#topCurve" startOffset="50%">
              COMPROMISO DE CALIDAD
            </textPath>
          </text>

          {/* Center content */}
          <text x="120" y="115" textAnchor="middle" fill="#FFF0A0" fontSize="52" fontWeight="900" fontFamily="sans-serif" letterSpacing="-2">
            10
          </text>
          <text x="120" y="140" textAnchor="middle" fill="#D4AF37" fontSize="14" fontWeight="800" fontFamily="sans-serif" letterSpacing="4">
            DÍAS
          </text>

          {/* Bottom ribbon */}
          <rect x="40" y="168" width="160" height="28" rx="3" fill="url(#ribbonGrad)" stroke="#D4AF37" strokeWidth="1.5" />

          {/* Ribbon text */}
          <text x="120" y="188" textAnchor="middle" fill="#FFF0A0" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="4">
            GARANTÍA
          </text>

          {/* Small subtitle under ribbon */}
          <text x="120" y="210" textAnchor="middle" fill="#D4AF37" fontSize="7.5" fontWeight="700" fontFamily="sans-serif" letterSpacing="2" opacity="0.85">
            DE REPOSICIÓN
          </text>

          {/* Sheen overlay for metallic gloss */}
          <circle cx="120" cy="120" r="100" fill="url(#sheen)" />
        </svg>

        {/* Subtle golden pulse ring behind the seal */}
        <div className="absolute inset-0 rounded-full animate-[seal-pulse_3s_ease-in-out_infinite] opacity-0 group-hover:opacity-100 pointer-events-none" />
      </button>

      {/* Tooltip / Popover */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[280px] sm:w-[300px] transition-all duration-300 ease-out origin-top ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
        role="tooltip"
      >
        {/* Arrow */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1A120B] border-t border-l border-[#D4AF37]/50 rotate-45 z-0" />

        {/* Content */}
        <div className="relative bg-[#1A120B]/95 backdrop-blur-2xl border border-[#D4AF37]/40 rounded-2xl p-5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] z-10">
          <p className="text-[#E8C84A]/90 text-sm leading-relaxed text-center font-medium">
            Si el candidato no funciona, lo reemplazamos.
            <strong className="text-[#FFF0A0] font-black block mt-1.5 text-[15px]">
              Sin cargos adicionales, sin discusión.
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
