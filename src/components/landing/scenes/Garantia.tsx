'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { Appear, SceneFrame, span, type SceneProps } from './shared';

const DIAS = 10;
const C = 120;
const R = 92;

function Dia({ d, progress }: { d: number; progress: MotionValue<number> }) {
  const a = 0.1 + d * 0.06;
  const on = useTransform(progress, (v) => span(v, a, a + 0.05));
  const fill = useTransform(on, (v) => (v > 0.5 ? '#FF7A1A' : 'rgba(230,233,242,0.14)'));
  const ang = (d / DIAS) * Math.PI * 2 - Math.PI / 2;
  const x = C + Math.cos(ang) * R;
  const y = C + Math.sin(ang) * R;
  return <motion.circle cx={x} cy={y} r={7} fill={fill} />;
}

/** 05 · El anillo de 10 días se cierra: seguimiento del ingreso con garantía de reposición. */
export function Garantia({ progress }: SceneProps) {
  const arco = useTransform(progress, (v) => span(v, 0.1, 0.72));

  return (
    <SceneFrame step={5} label="Contratación y garantía">
      <div className="flex h-full flex-col items-center justify-center gap-5">
        <svg viewBox="0 0 240 240" className="w-full max-w-[240px]" role="img" aria-label="Anillo de diez días de garantía de reposición">
          <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(230,233,242,0.08)" strokeWidth={2} />
          <motion.circle
            cx={C}
            cy={C}
            r={R}
            fill="none"
            stroke="#FF7A1A"
            strokeWidth={2}
            strokeLinecap="round"
            transform={`rotate(-90 ${C} ${C})`}
            style={{ pathLength: arco }}
            className="hj-thread-glow"
          />
          {Array.from({ length: DIAS }, (_, d) => (
            <Dia key={d} d={d} progress={progress} />
          ))}
          <text x={C} y={C + 8} textAnchor="middle" className="fill-white text-[52px]" style={{ fontFamily: 'var(--font-display)' }}>
            10
          </text>
          <text x={C} y={C + 32} textAnchor="middle" className="fill-[#8A90A6] font-mono text-[10px] uppercase tracking-[0.18em]">
            días de garantía
          </text>
        </svg>

        <Appear progress={progress} range={[0.76, 0.9]} y={8}>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
            <BadgeCheck size={16} aria-hidden="true" />
            Contratación confirmada · seguimiento activo
          </span>
        </Appear>
      </div>
    </SceneFrame>
  );
}
