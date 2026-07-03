'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion, animate } from 'framer-motion';

interface CountUpProps {
  /** Target number to count to. */
  value: number;
  /** Text before the number, e.g. "+". */
  prefix?: string;
  /** Text after the number, e.g. " días". */
  suffix?: string;
  /** Decimal places. Default 0. */
  decimals?: number;
  /** Duration of the count in seconds. Default 1.6. */
  duration?: number;
  className?: string;
  /** Group thousands with separators. Default true. */
  group?: boolean;
}

/**
 * Renders the final value in server/static HTML (SEO + no-JS fallback) and,
 * as progressive enhancement, replays a 0 → value count when it scrolls into
 * view (once). Respects prefers-reduced-motion by keeping the final value.
 */
export function CountUp({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.6,
  className,
  group = true,
}: CountUpProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  // Start at the final value so SSR/prerendered HTML never shows "0".
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: v => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduce]);

  const formatted = display.toLocaleString('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: group,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
