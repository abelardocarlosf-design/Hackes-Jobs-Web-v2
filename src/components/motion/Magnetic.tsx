'use client';

import { ReactNode, useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** How far the element pulls toward the cursor (0–1). Default 0.35. */
  strength?: number;
  /** Radius (px) beyond the element where the pull starts. Default 0. */
  padding?: number;
}

/**
 * Wraps any element and pulls it gently toward the cursor while hovered,
 * snapping back with a spring on exit. Great for primary CTAs and icon chips.
 */
export function Magnetic({ children, className, strength = 0.35, padding = 0 }: MagneticProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 15, mass: 0.4 });

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: sx, y: sy, padding }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
