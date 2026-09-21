'use client';

import { motion, useTransform } from 'framer-motion';
import { Check } from 'lucide-react';
import { Appear, SceneFrame, span, type SceneProps } from './shared';

const PUESTO = 'Supervisor de producción';

const CAMPOS = [
  ['Área', 'Manufactura'],
  ['Turno', 'Rotativo · 3 turnos'],
  ['Reporta a', 'Gerente de planta'],
  ['Indicador de éxito', 'OEE ≥ 85 % a 90 días'],
];

const COMPETENCIAS = ['Lean Manufacturing', 'Liderazgo de equipo', 'Excel avanzado', 'Seguridad industrial'];

/** 01 · La ficha del puesto se arma sola: título, campos, competencias, sello. */
export function Requisicion({ progress }: SceneProps) {
  const titulo = useTransform(progress, (v) => PUESTO.slice(0, Math.round(span(v, 0.04, 0.32) * PUESTO.length)));
  const caret = useTransform(progress, (v) => (v > 0.02 && v < 0.36 ? 1 : 0));
  const sello = useTransform(progress, (v) => span(v, 0.82, 0.94));
  const selloScale = useTransform(sello, (v) => 1.35 - v * 0.35);

  return (
    <SceneFrame step={1} label="Requisición">
      <div className="flex h-full flex-col justify-center gap-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-hj-synapse">Perfil del puesto</span>
          <p className="hj-display mt-2 min-h-[1.3em] text-xl text-white sm:text-2xl">
            <motion.span>{titulo}</motion.span>
            <motion.span style={{ opacity: caret }} className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[3px] bg-hj-signal" />
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          {CAMPOS.map(([k, v], i) => (
            <Appear key={k} progress={progress} range={[0.3 + i * 0.06, 0.42 + i * 0.06]} className="hj-hairline border-t pt-2">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-hj-muted">{k}</dt>
              <dd className="mt-1 text-sm text-hj-mist">{v}</dd>
            </Appear>
          ))}
        </dl>

        <div className="flex flex-wrap gap-2">
          {COMPETENCIAS.map((c, i) => (
            <Appear key={c} progress={progress} range={[0.55 + i * 0.05, 0.64 + i * 0.05]} y={6}>
              <span className="inline-flex rounded-full border border-hj-synapse/30 bg-hj-synapse/10 px-3 py-1 text-xs text-blue-200">
                {c}
              </span>
            </Appear>
          ))}
        </div>

        <motion.div
          style={{ opacity: sello, scale: selloScale }}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-hj-signal/40 bg-hj-signal/10 px-3 py-2"
        >
          <Check size={16} className="text-hj-signal" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-orange-200">
            Perfil validado · alcance en 24 h
          </span>
        </motion.div>
      </div>
    </SceneFrame>
  );
}
