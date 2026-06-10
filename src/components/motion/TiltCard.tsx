'use client';

import { ReactNode, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, useMotionTemplate } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. Default 7. */
  max?: number;
  /** Spotlight accent color (rgb triplet). Default brand orange. */
  glow?: string;
  /** Disable the cursor spotlight, keep only the tilt. */
  noGlow?: boolean;
}

/**
 * Card that tilts in 3D toward the cursor and casts a soft spotlight that
 * tracks the pointer. Springy, restrained (≤7°) so it reads premium, not gimmicky.
 * Falls back to a plain div under prefers-reduced-motion.
 */
export function TiltCard({ children, className, max = 7, glow = '249, 115, 22', noGlow = false }: TiltCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const on = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 220, damping: 18 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 220, damping: 18 });
  const opacity = useSpring(on, { stiffness: 200, damping: 25 });

  const gx = useTransform(px, v => `${v * 100}%`);
  const gy = useTransform(py, v => `${v * 100}%`);
  const background = useMotionTemplate`radial-gradient(440px circle at ${gx} ${gy}, rgba(${glow}, 0.18), transparent 60%)`;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => on.set(1)}
      onMouseLeave={() => {
        on.set(0);
        px.set(0.5);
        py.set(0.5);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      className={cn('relative will-change-transform', className)}
    >
      {!noGlow && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
          style={{ background, opacity }}
        />
      )}
      {children}
    </motion.div>
  );
}
