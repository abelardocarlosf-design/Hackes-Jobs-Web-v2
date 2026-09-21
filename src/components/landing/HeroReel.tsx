'use client';

/**
 * Consola del hero.
 *
 * Con `video` reproduce el reel de HyperFrames (muted/loop/inline, póster como
 * LCP). Sin video —o con reduced motion— muestra el embudo en vivo hecho en
 * código: las mismas cinco etapas que cuenta el scroll, en miniatura.
 */

import { motion, useReducedMotion } from 'framer-motion';

type Video = { webm: string; mp4: string; poster: string };

const EMBUDO = [
  { etapa: 'Requisición', valor: '1 perfil', w: 1 },
  { etapa: 'CVs revisados', valor: '248', w: 0.92 },
  { etapa: 'Compatibles', valor: '11', w: 0.56 },
  { etapa: 'Evaluados', valor: '8', w: 0.4 },
  { etapa: 'Terna', valor: '3', w: 0.24 },
];

function EmbudoEnVivo({ still }: { still: boolean }) {
  return (
    <div className="flex h-full flex-col gap-3 p-5 sm:p-7">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-hj-muted">Proceso activo · Ejemplo</span>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">
          <span className="relative flex h-2 w-2">
            {!still && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          En vivo
        </span>
      </div>

      <p className="hj-display text-lg text-white sm:text-xl">Supervisor de producción</p>

      <ul className="mt-2 flex flex-1 flex-col justify-center gap-3">
        {EMBUDO.map((e, i) => (
          <li key={e.etapa} className="grid grid-cols-[7.5rem_1fr_3.5rem] items-center gap-3 sm:grid-cols-[8.5rem_1fr_4rem]">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-hj-muted">{e.etapa}</span>
            <span className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.span
                className="block h-full origin-left rounded-full"
                style={{
                  width: `${e.w * 100}%`,
                  background:
                    i === EMBUDO.length - 1
                      ? '#FF7A1A'
                      : `linear-gradient(90deg, #3B6BFF, ${i > 2 ? '#8B5CF6' : '#3B6BFF'})`,
                }}
                initial={{ scaleX: still ? 1 : 0 }}
                animate={still ? undefined : { scaleX: [0, 1, 1, 0] }}
                transition={
                  still
                    ? undefined
                    : { duration: 7, times: [0, 0.18, 0.85, 1], delay: i * 0.35, repeat: Infinity, repeatDelay: 0.6, ease: [0.16, 1, 0.3, 1] }
                }
              />
            </span>
            <span className={`text-right font-mono text-xs ${i === EMBUDO.length - 1 ? 'text-hj-signal' : 'text-hj-mist'}`}>
              {e.valor}
            </span>
          </li>
        ))}
      </ul>

      <div className="hj-hairline mt-2 flex items-center justify-between border-t pt-4 font-mono text-[10px] uppercase tracking-[0.16em]">
        <span className="text-hj-muted">Tiempo a terna</span>
        <span className="text-white">8 días</span>
      </div>
    </div>
  );
}

export function HeroReel({ video }: { video?: Video }) {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="hj-console">
      <div className="hj-console-inner relative aspect-[16/11]">
        {video && !reduce ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={video.poster}
            aria-label="Animación del proceso: currículums que pasan por un filtro de IA, evaluación psicométrica y terna final"
          >
            <source src={video.webm} type="video/webm" />
            <source src={video.mp4} type="video/mp4" />
          </video>
        ) : video && reduce ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={video.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <EmbudoEnVivo still={reduce} />
        )}
      </div>
    </div>
  );
}
