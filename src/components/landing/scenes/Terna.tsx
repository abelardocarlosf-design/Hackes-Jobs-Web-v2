'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import { SceneFrame, ScrubNumber, span, type SceneProps } from './shared';

const FINALISTAS = [
  { id: 'A', match: 94, perfil: 'D/C · 7 años en planta', top: true },
  { id: 'B', match: 91, perfil: 'C/S · 5 años en calidad', top: false },
  { id: 'C', match: 88, perfil: 'D/I · 6 años en producción', top: false },
];

function Finalista({ f, i, progress }: { f: (typeof FINALISTAS)[number]; i: number; progress: MotionValue<number> }) {
  const a = 0.08 + i * 0.16;
  const t = useTransform(progress, (v) => span(v, a, a + 0.22));
  const y = useTransform(t, (v) => (1 - v) * 28);
  const barra = useTransform(progress, (v) => span(v, a + 0.12, a + 0.42) * (f.match / 100));

  return (
    <motion.li
      style={{ opacity: t, y }}
      className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${
        f.top ? 'border-hj-signal/45 bg-hj-signal/[0.07]' : 'hj-hairline bg-white/[0.02]'
      }`}
    >
      <span
        className={`hj-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm ${
          f.top ? 'bg-hj-signal text-[#140800]' : 'bg-white/10 text-white'
        }`}
      >
        {f.id}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm font-semibold text-white">Candidato {f.id}</span>
          <ScrubNumber
            progress={progress}
            range={[a + 0.12, a + 0.42]}
            to={f.match}
            suffix=" %"
            className={`font-mono text-sm ${f.top ? 'text-hj-signal' : 'text-hj-mist'}`}
          />
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            style={{ scaleX: barra }}
            className={`h-full origin-left rounded-full ${f.top ? 'bg-hj-signal' : 'bg-hj-synapse'}`}
          />
        </div>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-hj-muted">{f.perfil}</p>
      </div>
    </motion.li>
  );
}

/** 04 · Suben los tres finalistas con su compatibilidad contra el perfil. */
export function Terna({ progress }: SceneProps) {
  return (
    <SceneFrame step={4} label="Terna">
      <div className="flex h-full flex-col justify-center gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-hj-muted">
          Compatibilidad técnica + conductual
        </p>
        <ul className="flex flex-col gap-3">
          {FINALISTAS.map((f, i) => (
            <Finalista key={f.id} f={f} i={i} progress={progress} />
          ))}
        </ul>
      </div>
    </SceneFrame>
  );
}
