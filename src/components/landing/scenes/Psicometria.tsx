'use client';

import { motion, useTransform } from 'framer-motion';
import { Check, FileText } from 'lucide-react';
import { Appear, SceneFrame, ScrubNumber, span, type SceneProps } from './shared';

const C = 110; // centro del radar
const R = 88;

// Ejes DISC en rombo: D arriba, I derecha, S abajo, C izquierda.
const EJES = [
  { k: 'D', dx: 0, dy: -1, v: 0.82 },
  { k: 'I', dx: 1, dy: 0, v: 0.64 },
  { k: 'S', dx: 0, dy: 1, v: 0.46 },
  { k: 'C', dx: -1, dy: 0, v: 0.78 },
];

const PRUEBAS = ['DISC', '16PF', 'Moss', 'Zavic', 'Lüscher'];

const rombo = (f: number) => EJES.map((e) => `${C + e.dx * R * f},${C + e.dy * R * f}`).join(' ');

/** 03 · Se aplican las pruebas y el perfil conductual se dibuja sobre el radar. */
export function Psicometria({ progress }: SceneProps) {
  const puntos = useTransform(progress, (p) => {
    const t = span(p, 0.12, 0.6);
    const e = 1 - Math.pow(1 - t, 3);
    return EJES.map((a) => `${C + a.dx * R * a.v * e},${C + a.dy * R * a.v * e}`).join(' ');
  });
  const relleno = useTransform(progress, (p) => span(p, 0.12, 0.6) * 0.28);

  return (
    <SceneFrame step={3} label="Evaluación psicométrica">
      <div className="grid h-full grid-cols-[1fr_auto] content-center items-center gap-4 sm:gap-6">
        <svg viewBox="0 0 220 220" className="w-full max-w-[260px]" role="img" aria-label="Perfil DISC del candidato dibujado sobre un radar">
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <polygon key={f} points={rombo(f)} fill="none" stroke="rgba(230,233,242,0.1)" />
          ))}
          <line x1={C} y1={C - R} x2={C} y2={C + R} stroke="rgba(230,233,242,0.1)" />
          <line x1={C - R} y1={C} x2={C + R} y2={C} stroke="rgba(230,233,242,0.1)" />
          <motion.polygon points={puntos} fill="#3B6BFF" style={{ fillOpacity: relleno }} stroke="#3B6BFF" strokeWidth={2} strokeLinejoin="round" />
          {EJES.map((e) => (
            <text
              key={e.k}
              x={C + e.dx * (R + 14)}
              y={C + e.dy * (R + 14) + 4}
              textAnchor="middle"
              className="fill-[#E6E9F2] font-mono text-[11px]"
            >
              {e.k}
            </text>
          ))}
        </svg>

        <div className="flex flex-col gap-2.5">
          {PRUEBAS.map((t, i) => (
            <Appear key={t} progress={progress} range={[0.1 + i * 0.09, 0.18 + i * 0.09]} x={-8} y={0}>
              <span className="flex items-center gap-2 text-sm text-hj-mist">
                <Check size={14} className="text-hj-synapse" aria-hidden="true" />
                {t}
              </span>
            </Appear>
          ))}
        </div>

        <div className="hj-hairline col-span-2 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
          <div className="flex gap-5">
            {EJES.map((e) => (
              <div key={e.k}>
                <ScrubNumber progress={progress} range={[0.12, 0.6]} to={Math.round(e.v * 100)} className="hj-display text-lg text-white" />
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-hj-muted">{e.k}</p>
              </div>
            ))}
          </div>
          <Appear progress={progress} range={[0.72, 0.86]} y={6}>
            <span className="inline-flex items-center gap-2 rounded-lg border border-hj-signal/40 bg-hj-signal/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-orange-200">
              <FileText size={14} aria-hidden="true" />
              Reporte ejecutivo
            </span>
          </Appear>
        </div>
      </div>
    </SceneFrame>
  );
}
