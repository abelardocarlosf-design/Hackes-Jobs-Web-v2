'use client';

/**
 * Mapa de cobertura.
 *
 * Contorno de México a línea de un pixel, trama de puntos recortada contra él,
 * y arcos que salen de CDMX hacia cada plaza. Sin librería de mapas y sin una
 * sola petición de red: la geometría viene horneada en `mexico-geometry.ts`.
 *
 * La silueta va como hairline y no como mancha rellena a propósito — rellena
 * parece atlas escolar; a línea, con la trama detrás, parece instrumento.
 *
 * Las etiquetas son HTML posicionado sobre el SVG, no <text>: así heredan el
 * stack tipográfico y el override `:root.light .text-white` sin necesitar su
 * propia pareja de reglas de modo claro.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { MAP_VB, MEXICO_OUTLINE_D, PLAZAS, HUB, project, type Plaza } from './mexico-geometry';

const R = { hub: 5, directa: 3.6, coordinada: 3 } as const;

/** Arco suave desde el hub. El alzado crece con la distancia. */
function arcTo(p: Plaza) {
  const a = project(HUB.lon, HUB.lat);
  const b = project(p.lon, p.lat);
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - dist * 0.22;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

export function CoverageMap() {
  const reduce = useReducedMotion();
  const spokes = PLAZAS.filter((p) => p.tier !== 'hub');

  return (
    <div className="coverage-map relative w-full">
      <svg
        viewBox={`0 0 ${MAP_VB.w} ${MAP_VB.h}`}
        className="h-auto w-full"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Cientos de puntos por ~200 bytes de markup. */}
          <pattern id="cov-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="var(--map-dot)" />
          </pattern>
          <clipPath id="cov-clip">
            <path d={MEXICO_OUTLINE_D} />
          </clipPath>
        </defs>

        <g clipPath="url(#cov-clip)">
          <rect x="0" y="0" width={MAP_VB.w} height={MAP_VB.h} fill="url(#cov-dots)" />
        </g>

        <path d={MEXICO_OUTLINE_D} fill="none" stroke="var(--map-line)" strokeWidth="1" />

        {/* Arcos. `pathLength={1}` normaliza el trazo con independencia de la
            longitud real, que es lo que hace que un escalonado de arcos de
            distinto largo aterrice a la vez. */}
        <g fill="none" stroke="var(--map-arc)" strokeWidth="1.1" strokeLinecap="round">
          {spokes.map((p, i) => (
            <motion.path
              key={p.nombre}
              d={arcTo(p)}
              pathLength={1}
              strokeDasharray="1"
              initial={reduce ? false : { strokeDashoffset: 1, opacity: 0 }}
              whileInView={{ strokeDashoffset: 0, opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 1.1, delay: 0.25 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </g>

        {/* Nodos */}
        <g>
          {PLAZAS.map((p, i) => {
            const { x, y } = project(p.lon, p.lat);
            const isHub = p.tier === 'hub';
            return (
              <g key={p.nombre}>
                {isHub && !reduce && (
                  <circle className="cov-ping" cx={x} cy={y} r={R.hub} fill="var(--map-accent)" />
                )}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={R[p.tier]}
                  fill={isHub ? 'var(--map-accent)' : 'var(--map-node)'}
                  initial={reduce ? false : { opacity: 0, scale: 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                  transition={{ duration: 0.5, delay: isHub ? 0.1 : 0.5 + i * 0.08 }}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Etiquetas en HTML sobre el SVG. */}
      <div className="pointer-events-none absolute inset-0">
        {PLAZAS.map((p) => {
          const { x, y } = project(p.lon, p.lat);
          const right = p.anchor === 'right';
          return (
            <span
              key={p.nombre}
              className={[
                'absolute whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.14em] sm:text-[10px]',
                p.tier === 'hub' ? 'font-semibold text-white' : 'text-white/60',
              ].join(' ')}
              style={{
                left: `${(x / MAP_VB.w) * 100}%`,
                top: `${((y + (p.labelDy ?? 0)) / MAP_VB.h) * 100}%`,
                transform: right
                  ? 'translate(10px, -50%)'
                  : 'translate(calc(-100% - 10px), -50%)',
              }}
            >
              {p.nombre}
            </span>
          );
        })}
      </div>
    </div>
  );
}
