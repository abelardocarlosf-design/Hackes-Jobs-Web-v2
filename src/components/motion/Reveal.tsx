'use client';

import { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Direction the element travels in from. Default 'up'. */
  from?: Direction;
  /** Seconds to wait before animating. */
  delay?: number;
  /** Travel distance in px. Default 28. */
  distance?: number;
  /** Duration in seconds. Default 0.7. */
  duration?: number;
  /** Add a subtle blur-in. Default true. */
  blur?: boolean;
  /** Re-trigger every time it enters the viewport. Default false (once). */
  repeat?: boolean;
  /** Render as a different tag (e.g. 'li', 'span'). */
  as?: 'div' | 'section' | 'span' | 'li' | 'article';
}

const offset = (dir: Direction, d: number) => {
  switch (dir) {
    case 'up': return { y: d };
    case 'down': return { y: -d };
    case 'left': return { x: d };
    case 'right': return { x: -d };
    default: return {};
  }
};

/**
 * Scroll-triggered reveal. Wraps content and animates it in when it enters
 * the viewport — direction, blur, delay and distance are all tunable.
 * Honors prefers-reduced-motion by rendering content statically.
 */
export function Reveal({
  children,
  className,
  from = 'up',
  delay = 0,
  distance = 28,
  duration = 0.7,
  blur = true,
  repeat = false,
  as = 'div',
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduce) {
    const Tag = as as any;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset(from, distance), filter: blur ? 'blur(8px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: !repeat, margin: '0px 0px -12% 0px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Container that staggers the reveal of its direct <RevealItem> children.
 * Use together with RevealItem for lists/grids.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  delayChildren = 0.05,
  repeat = false,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  repeat?: boolean;
  as?: 'div' | 'section' | 'ul';
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduce) {
    const Tag = as as any;
    return <Tag className={className}>{children}</Tag>;
  }

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  };

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: !repeat, margin: '0px 0px -10% 0px' }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  distance = 26,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  as?: 'div' | 'li' | 'span' | 'article';
}) {
  const MotionTag = motion[as] as typeof motion.div;
  const item: Variants = {
    hidden: { opacity: 0, y: distance, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
  };
  return (
    <MotionTag className={className} variants={item}>
      {children}
    </MotionTag>
  );
}
