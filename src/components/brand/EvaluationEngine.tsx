'use client';

/**
 * Motor de evaluación — el fondo del hero.
 *
 * Es el embudo real del servicio dibujado en SVG: entran cientos de
 * postulaciones por arriba, el filtro de IA descarta la mayoría, la batería
 * psicométrica descarta otra parte, y por abajo salen tres finalistas.
 *
 * Por qué esto y no una foto o un video de stock:
 *  · Pesa ~0 bytes de red y es nítido a cualquier densidad de pantalla, así que
 *    no compite con el LCP ni obliga a servir un AVIF de 1920 px.
 *  · Es la única imagen del sitio que un competidor no puede comprar.
 *
 * El movimiento es CSS puro (keyframes en globals.css, `eng-descend`): cada
 * partícula es un <rect> con su propio delay y su propio vector de caída en
 * custom properties. Sin rAF, sin re-render de React, compuesto en GPU.
 *
 * Las posiciones salen de un PRNG con semilla fija, no de Math.random: el
 * servidor y el cliente tienen que producir exactamente el mismo SVG o React
 * rompe la hidratación.
 *
 * Todo el color sale de custom properties (`--eng-*`) declaradas en globals.css,
 * que es donde vive también su variante de modo claro. El SVG no conoce el tema.
 */

import { useReducedMotion } from 'framer-motion';

/* ─── Geometría del embudo ──────────────────────────────────────────────
   Coordenadas en el espacio del viewBox, no en px de pantalla. */
const VB_W = 560;
const VB_H = 840;
const CX = VB_W / 2;

/** Boca del embudo y cintura después de cada membrana. */
const MOUTH = { y: 60, half: 236 };
const GATE_IA = { y: 330, half: 150 };
const GATE_PSI = { y: 570, half: 72 };
const OUTPUT_Y = 726;

/** Duración del ciclo completo. Lento a propósito: esto es atmósfera. */
const CYCLE = 13;

/* ─── Partículas ────────────────────────────────────────────────────────
   Tres cohortes por destino. El adelgazamiento del flujo es la idea entera:
   se ve que la mayoría no llega. */
type Cohort = { count: number; endY: number; endHalf: number; opacity: number; w: number };

const COHORTS: Cohort[] = [
  // Descartadas por el filtro de IA. Son la mayoría y las más tenues.
  { count: 26, endY: GATE_IA.y - 16, endHalf: GATE_IA.half, opacity: 0.3, w: 15 },
  // Pasan IA, las descarta la psicometría.
  { count: 10, endY: GATE_PSI.y - 16, endHalf: GATE_PSI.half, opacity: 0.52, w: 17 },
  // Llegan a terna.
  { count: 3, endY: OUTPUT_Y - 34, endHalf: 34, opacity: 0.9, w: 19 },
];

/** mulberry32 — determinista, para que SSR y cliente coincidan exactamente. */
function makeRng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Particle = {
  x: number;
  h: number;
  w: number;
  dx: number;
  dy: number;
  opacity: number;
  delay: number;
  dur: number;
};

const PARTICLES: Particle[] = (() => {
  const rng = makeRng(20260911);
  const out: Particle[] = [];

  COHORTS.forEach((c, ci) => {
    for (let i = 0; i < c.count; i++) {
      // Reparto uniforme con jitter: una retícula perfecta se lee como tabla,
      // no como flujo.
      const t = (i + 0.5) / c.count + (rng() - 0.5) * 0.06;
      const x = CX - MOUTH.half + t * MOUTH.half * 2;

      // Al descender, el flujo converge hacia la cintura de su membrana.
      const endX = CX + (x - CX) * (c.endHalf / MOUTH.half);

      out.push({
        x,
        w: c.w,
        h: 3,
        dx: +(endX - x).toFixed(2),
        dy: +(c.endY - MOUTH.y).toFixed(2),
        opacity: c.opacity,
        // El escalonado reparte las entradas por todo el ciclo para que el
        // caudal se vea continuo y no por tandas.
        delay: +(((i * 0.618 + ci * 0.27) % 1) * CYCLE).toFixed(2),
        dur: +(CYCLE * (0.62 + rng() * 0.22)).toFixed(2),
      });
    }
  });

  return out;
})();

/** Los tres finalistas: el único sitio donde el naranja aparece con fuerza. */
const TERNA = [
  { label: 'Finalista 01', score: 94 },
  { label: 'Finalista 02', score: 91 },
  { label: 'Finalista 03', score: 88 },
];

const MONO =
  'ui-monospace, var(--font-mono), SFMono-Regular, Menlo, monospace';

export function EvaluationEngine() {
  const reduce = useReducedMotion();

  // Sin movimiento: se dibuja el estado de reposo del embudo (las membranas,
  // las cifras y la terna ya formada). Nunca un cuadro vacío.
  const animated = !reduce;

  return (
    <svg
      className="hero-engine"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Desvanece el flujo por arriba y por abajo para que no choque con el
            borde del viewport. */}
        <linearGradient id="eng-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.1" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.86" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="eng-mask">
          <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#eng-fade)" />
        </mask>
      </defs>

      {/* ─── Paredes del embudo ─────────────────────────────────────── */}
      <g
        stroke="var(--eng-line)"
        strokeWidth="1"
        fill="none"
        mask="url(#eng-mask)"
      >
        <path
          d={`M${CX - MOUTH.half} ${MOUTH.y}
              L${CX - GATE_IA.half} ${GATE_IA.y}
              L${CX - GATE_PSI.half} ${GATE_PSI.y}
              L${CX - 46} ${OUTPUT_Y}`}
        />
        <path
          d={`M${CX + MOUTH.half} ${MOUTH.y}
              L${CX + GATE_IA.half} ${GATE_IA.y}
              L${CX + GATE_PSI.half} ${GATE_PSI.y}
              L${CX + 46} ${OUTPUT_Y}`}
        />
      </g>

      {/* ─── Flujo de postulaciones ─────────────────────────────────── */}
      <g mask="url(#eng-mask)">
        {PARTICLES.map((p, i) => (
          <rect
            key={i}
            x={p.x - p.w / 2}
            y={MOUTH.y}
            width={p.w}
            height={p.h}
            rx={1.5}
            fill="var(--eng-node)"
            className={animated ? 'eng-particle' : undefined}
            opacity={animated ? undefined : p.opacity * 0.55}
            style={
              animated
                ? ({
                    '--p-dx': `${p.dx}px`,
                    '--p-dy': `${p.dy}px`,
                    '--p-op': p.opacity,
                    animationDelay: `${-p.delay}s`,
                    animationDuration: `${p.dur}s`,
                  } as React.CSSProperties)
                : // En reposo las partículas se congelan a media caída, para que
                  // el embudo no se vea vacío por dentro.
                  ({
                    transform: `translate(${p.dx * 0.45}px, ${p.dy * 0.45}px)`,
                  } as React.CSSProperties)
            }
          />
        ))}
      </g>

      {/* ─── Membrana 1 · Filtro de IA ──────────────────────────────── */}
      <g>
        <line
          x1={CX - GATE_IA.half}
          y1={GATE_IA.y}
          x2={CX + GATE_IA.half}
          y2={GATE_IA.y}
          stroke="var(--eng-edge)"
          strokeWidth="1.25"
        />
        {animated && (
          <line
            className="eng-scan"
            x1={CX - GATE_IA.half}
            y1={GATE_IA.y}
            x2={CX + GATE_IA.half}
            y2={GATE_IA.y}
            stroke="var(--eng-accent)"
            strokeWidth="1.25"
          />
        )}
        <text
          x={CX + GATE_IA.half + 14}
          y={GATE_IA.y + 4}
          fill="var(--eng-label)"
          fontFamily={MONO}
          fontSize="11"
          letterSpacing="1.6"
        >
          FILTRO IA
        </text>
      </g>

      {/* ─── Membrana 2 · Psicometría ───────────────────────────────── */}
      <g>
        <line
          x1={CX - GATE_PSI.half}
          y1={GATE_PSI.y}
          x2={CX + GATE_PSI.half}
          y2={GATE_PSI.y}
          stroke="var(--eng-edge)"
          strokeWidth="1.25"
        />
        <text
          x={CX + GATE_PSI.half + 14}
          y={GATE_PSI.y + 4}
          fill="var(--eng-label)"
          fontFamily={MONO}
          fontSize="11"
          letterSpacing="1.6"
        >
          PSICOMETRÍA
        </text>
        <text
          x={CX + GATE_PSI.half + 14}
          y={GATE_PSI.y + 20}
          fill="var(--eng-label-dim)"
          fontFamily={MONO}
          fontSize="9.5"
          letterSpacing="1.2"
        >
          DISC · 16PF · MOSS
        </text>
      </g>

      {/* ─── Salida · la terna ──────────────────────────────────────── */}
      <g>
        {TERNA.map((t, i) => {
          const y = OUTPUT_Y + i * 34;
          return (
            <g
              key={t.label}
              className={animated ? 'eng-finalist' : undefined}
              style={
                animated
                  ? ({
                      // Entran escalonados, ya avanzado el ciclo: para entonces
                      // el flujo de arriba ya se estrechó y la terna se lee como
                      // su consecuencia, no como un elemento suelto.
                      animationDelay: `${1.4 + i * 0.45}s`,
                      animationDuration: `${CYCLE}s`,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              <rect
                x={CX - 108}
                y={y}
                width={216}
                height={24}
                rx={4}
                fill="var(--eng-card)"
                stroke="var(--eng-edge)"
                strokeWidth="1"
              />
              <rect x={CX - 108} y={y} width={2.5} height={24} fill="var(--eng-accent)" />
              <text
                x={CX - 92}
                y={y + 16}
                fill="var(--eng-label)"
                fontFamily={MONO}
                fontSize="10"
                letterSpacing="1.3"
              >
                {t.label.toUpperCase()}
              </text>
              <text
                x={CX + 92}
                y={y + 16}
                textAnchor="end"
                fill="var(--eng-accent)"
                fontFamily={MONO}
                fontSize="11"
                letterSpacing="0.6"
              >
                {t.score}%
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
