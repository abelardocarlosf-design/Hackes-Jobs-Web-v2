'use client';

/**
 * Piezas comunes a las cinco escenas del proceso.
 *
 * Cada escena recibe un `progress` (MotionValue 0→1) y deriva todo de él: no
 * hay timers ni estado. Así la misma escena sirve atada al scroll (escritorio),
 * al entrar en viewport (móvil) o congelada en 1 (reduced motion).
 */

import type { ReactNode } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';

export interface SceneProps {
  progress: MotionValue<number>;
}

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Progreso local de un tramo [a, b] del progreso global. */
export const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

/** Aparece (fade + desplazamiento) mientras el progreso cruza [a, b]. */
export function Appear({
  progress,
  range,
  y = 10,
  x = 0,
  className,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  y?: number;
  x?: number;
  className?: string;
  children: ReactNode;
}) {
  const t = useTransform(progress, (v) => span(v, range[0], range[1]));
  const opacity = t;
  const ty = useTransform(t, (v) => (1 - v) * y);
  const tx = useTransform(t, (v) => (1 - v) * x);
  return (
    <motion.div style={{ opacity, y: ty, x: tx }} className={className}>
      {children}
    </motion.div>
  );
}

/** Número que cuenta con el progreso; se renderiza como texto del MotionValue. */
export function ScrubNumber({
  progress,
  range,
  to,
  suffix = '',
  className,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  to: number;
  suffix?: string;
  className?: string;
}) {
  const text = useTransform(progress, (v) => `${Math.round(span(v, range[0], range[1]) * to)}${suffix}`);
  return <motion.span className={className}>{text}</motion.span>;
}

/** Marco de consola que comparten las escenas: barra superior + cuerpo. */
export function SceneFrame({
  step,
  label,
  children,
}: {
  step: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="hj-panel flex h-full w-full flex-col overflow-hidden rounded-2xl">
      <div className="hj-hairline flex items-center justify-between border-b px-4 py-3">
        <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-hj-muted">
          Etapa {String(step).padStart(2, '0')} · {label}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-hj-muted/60">Ejemplo</span>
      </div>
      <div className="relative flex-1 p-5 sm:p-6">{children}</div>
    </div>
  );
}
