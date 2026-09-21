'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import { SceneFrame, ScrubNumber, span, type SceneProps } from './shared';

const W = 480;
const H = 300;
const PLANO = 250; // x del filtro neural
const TOTAL = 44;

// Posiciones pseudoaleatorias pero deterministas (mismo SSR y cliente).
const rand = (i: number, s: number) => {
  const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
  // Redondeo: Math.sin difiere en los últimos decimales entre Node y el
  // navegador, y eso rompe la hidratación de los atributos cx/cy.
  return Math.round((x - Math.floor(x)) * 1000) / 1000;
};

const CVS = Array.from({ length: TOTAL }, (_, i) => {
  const pasa = i % 4 === 1; // ~1 de cada 4 cruza el filtro
  return {
    i,
    pasa,
    x0: 18 + rand(i, 1) * 130,
    y0: 20 + rand(i, 2) * (H - 40),
    t0: 0.04 + (i / TOTAL) * 0.42,
  };
});
const PASAN = CVS.filter((c) => c.pasa);

function Cv({ c, progress }: { c: (typeof CVS)[number]; progress: MotionValue<number> }) {
  const lane = PASAN.indexOf(c);
  // Carril final de los que pasan: columna ordenada a la derecha.
  const yLane = 40 + lane * ((H - 80) / Math.max(PASAN.length - 1, 1));

  const t = useTransform(progress, (v) => span(v, c.t0, c.t0 + 0.34));
  const x = useTransform(t, (v) => {
    const vx = c.pasa ? c.x0 + (430 - c.x0) * v : c.x0 + (PLANO - 8 - c.x0) * Math.min(v * 1.25, 1);
    return Math.round(vx * 10) / 10;
  });
  const y = useTransform(t, (v) => Math.round((c.pasa ? c.y0 + (yLane - c.y0) * v : c.y0) * 10) / 10);
  const opacity = useTransform(t, (v) => (c.pasa ? 0.55 + v * 0.45 : 1 - span(v, 0.7, 1) * 0.8));
  const fill = useTransform(x, (vx) => (c.pasa && vx > PLANO ? '#FF7A1A' : 'rgba(230,233,242,0.55)'));
  const r = useTransform(x, (vx) => (c.pasa && vx > PLANO ? 5 : 3.5));

  return <motion.circle cx={x} cy={y} r={r} style={{ opacity }} fill={fill} />;
}

/** 02 · Cientos de CVs entran; el filtro compara contra el perfil y solo pasan los compatibles. */
export function Filtrado({ progress }: SceneProps) {
  const scanY = useTransform(progress, (v) => 10 + ((v * 3) % 1) * (H - 20));
  const glow = useTransform(progress, (v) => 0.35 + span(v, 0.1, 0.5) * 0.65);

  return (
    <SceneFrame step={2} label="Atracción y filtrado IA">
      <div className="flex h-full flex-col gap-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full flex-1" role="img" aria-label="Los currículums cruzan un filtro de IA y solo pasan los compatibles con el perfil">
          <defs>
            <linearGradient id="hj-plane" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3B6BFF" stopOpacity="0" />
              <stop offset="0.5" stopColor="#3B6BFF" stopOpacity="0.9" />
              <stop offset="1" stopColor="#3B6BFF" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="hj-scan" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#8B5CF6" stopOpacity="0.9" />
              <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Malla neural del filtro */}
          {Array.from({ length: 7 }, (_, k) => (
            <line key={k} x1={PLANO - 30} y1={20 + k * 43} x2={PLANO + 30} y2={20 + ((k + 3) % 7) * 43} stroke="#3B6BFF" strokeOpacity="0.12" />
          ))}
          <motion.rect x={PLANO - 1.5} y={0} width={3} height={H} fill="url(#hj-plane)" style={{ opacity: glow }} />
          <motion.circle cx={PLANO} cy={scanY} r={26} fill="url(#hj-scan)" style={{ opacity: glow }} />

          {/* Columna de destino */}
          <rect x={412} y={24} width={36} height={H - 48} rx={10} fill="none" stroke="#FF7A1A" strokeOpacity="0.25" strokeDasharray="3 5" />

          {CVS.map((c) => (
            <Cv key={c.i} c={c} progress={progress} />
          ))}
        </svg>

        <div className="hj-hairline grid grid-cols-3 gap-3 border-t pt-4">
          <div>
            <ScrubNumber progress={progress} range={[0.04, 0.8]} to={248} className="hj-display text-xl text-white" />
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-hj-muted">CVs revisados</p>
          </div>
          <div>
            <ScrubNumber progress={progress} range={[0.3, 0.85]} to={96} suffix=" %" className="hj-display text-xl text-hj-synapse" />
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-hj-muted">Descartados por perfil</p>
          </div>
          <div>
            <ScrubNumber progress={progress} range={[0.35, 0.9]} to={11} className="hj-display text-xl text-hj-signal" />
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-hj-muted">Compatibles</p>
          </div>
        </div>
      </div>
    </SceneFrame>
  );
}
