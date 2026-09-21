'use client';

/**
 * El proceso de reclutamiento contado con el scroll.
 *
 * Escritorio: columna de texto a la izquierda con "el hilo" (path SVG cuyo
 * pathLength sigue al scroll) y un escenario sticky a la derecha donde las cinco
 * escenas se relevan. Cada escena recibe su tramo del progreso global.
 *
 * Móvil: sin sticky. Cada paso lleva su escena debajo y ésta se anima con su
 * propio progreso al entrar en pantalla.
 *
 * Reduced motion: todas las escenas reciben progress = 1 (estado final) y el
 * hilo se pinta completo.
 */

import { useEffect, useRef, useState, type ComponentType } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { Requisicion } from './scenes/Requisicion';
import { Filtrado } from './scenes/Filtrado';
import { Psicometria } from './scenes/Psicometria';
import { Terna } from './scenes/Terna';
import { Garantia } from './scenes/Garantia';
import { clamp01, type SceneProps } from './scenes/shared';

type Paso = {
  titulo: string;
  frase: string;
  cuerpo: string;
  dato: string;
  Scene: ComponentType<SceneProps>;
};

// Mismos pasos que /empresas#proceso, más la garantía como cierre.
const PASOS: Paso[] = [
  {
    titulo: 'Requisición',
    frase: 'Levantamos el perfil real del puesto.',
    cuerpo:
      'Una sola reunión de 30 minutos: responsabilidades, indicadores de éxito y cultura del equipo. Confirmamos el alcance en menos de 24 horas.',
    dato: '30 min · una reunión',
    Scene: Requisicion,
  },
  {
    titulo: 'Atracción y filtrado con IA',
    frase: 'Solo pasa quien encaja.',
    cuerpo:
      'Publicamos en los canales correctos y comparamos cada currículum contra el perfil definido. Tú nunca ves candidatos irrelevantes.',
    dato: 'De cientos de CVs a una lista corta',
    Scene: Filtrado,
  },
  {
    titulo: 'Evaluación psicométrica',
    frase: 'Evidencia, no intuición.',
    cuerpo:
      'Batería validada —DISC, 16PF, Moss, Zavic, Lüscher— con scoring algorítmico y un reporte ejecutivo en PDF que tu equipo entiende en minutos.',
    dato: '5 pruebas · reporte ejecutivo',
    Scene: Psicometria,
  },
  {
    titulo: 'Terna',
    frase: 'Tres finalistas, con su reporte.',
    cuerpo:
      'Recibes a los tres mejores candidatos con su evaluación completa y su compatibilidad contra el perfil. Tú entrevistas y eliges.',
    dato: 'Terna en 7–10 días',
    Scene: Terna,
  },
  {
    titulo: 'Contratación y garantía',
    frase: 'Si no funciona, lo reponemos.',
    cuerpo:
      'Damos seguimiento al ingreso. Si el candidato no continúa durante los primeros 10 días, iniciamos la reposición sin costo.',
    dato: 'Garantía de reposición · 10 días',
    Scene: Garantia,
  },
];

const N = PASOS.length;

// El hilo cruza x=20 justo en el centro de cada paso (10 %, 30 %, …) y se
// curva entre ellos, alternando lado. Se genera con el alto real medido: estirar
// un viewBox fijo con preserveAspectRatio="none" obliga a non-scaling-stroke, y
// Chrome calcula mal el dash de pathLength en ese caso.
function trazarHilo(h: number) {
  const paso = h / N;
  let d = `M20 0 L20 ${paso / 2}`;
  for (let i = 0; i < N - 1; i++) {
    const y0 = paso / 2 + i * paso;
    const bx = i % 2 === 0 ? 36 : 4;
    const q = paso / 4;
    d += ` C20 ${y0 + q} ${bx} ${y0 + q} ${bx} ${y0 + 2 * q} C${bx} ${y0 + 3 * q} 20 ${y0 + 3 * q} 20 ${y0 + paso}`;
  }
  return `${d} L20 ${h}`;
}

/** Tramo local del paso i: la escena se completa al 70 % de su paso para que
 *  se vea terminada un rato antes del relevo. */
const tramo = (v: number, i: number) => clamp01((v * N - i) / 0.7);

function Nodo({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const on = useTransform(progress, (v) => (v * N >= i + 0.35 ? 1 : 0));
  const bg = useTransform(on, (v) => (v ? '#FF7A1A' : '#0B0E1A'));
  const border = useTransform(on, (v) => (v ? '#FF7A1A' : 'rgba(230,233,242,0.25)'));
  return (
    <span className="absolute left-[20px] top-[3.1rem] -translate-x-1/2 -translate-y-1/2 lg:top-1/2" aria-hidden="true">
      <motion.span style={{ opacity: on }} className="hj-node-pulse absolute inset-0 rounded-full bg-hj-signal/60" />
      <motion.span
        style={{ backgroundColor: bg, borderColor: border }}
        className="relative block h-3.5 w-3.5 rounded-full border-2"
      />
    </span>
  );
}

function EscenaEscritorio({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const { Scene } = PASOS[i];
  const local = useTransform(progress, (v) => tramo(v, i));
  const opacity = useTransform(progress, (v) => {
    const p = v * N;
    const fin = i === N - 1 ? Infinity : i + 1;
    const entra = i === 0 ? 1 : clamp01((p - i + 0.12) / 0.18);
    const sale = 1 - clamp01((p - fin + 0.06) / 0.18);
    return Math.min(entra, sale);
  });
  const scale = useTransform(opacity, (o) => 0.96 + o * 0.04);
  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0">
      <Scene progress={local} />
    </motion.div>
  );
}

function EscenaMovil({ i, reduce }: { i: number; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { Scene } = PASOS[i];
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.95', 'center 0.5'] });
  const quieto = useMotionValue(1);
  return (
    <div ref={ref} className="-ml-14 mt-8 aspect-[4/4] w-[calc(100%+3.5rem)] sm:aspect-[4/3.2] lg:hidden">
      <Scene progress={reduce ? quieto : scrollYProgress} />
    </div>
  );
}

export function ProcessStory() {
  const reduce = useReducedMotion() ?? false;
  const pasosRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pasosRef, offset: ['start center', 'end center'] });
  const completo = useMotionValue(1);
  const progress = reduce ? completo : scrollYProgress;

  const columnaRef = useRef<HTMLDivElement>(null);
  const [alto, setAlto] = useState(0);
  useEffect(() => {
    const el = columnaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setAlto(Math.round(e.contentRect.height)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const hilo = alto ? trazarHilo(alto) : '';

  return (
    <div ref={pasosRef} className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
      {/* Columna de texto con el hilo */}
      <div ref={columnaRef} className="relative">
        {hilo && (
          <svg
            className="pointer-events-none absolute left-0 top-0 hidden w-10 overflow-visible lg:block"
            width={40}
            height={alto}
            viewBox={`0 0 40 ${alto}`}
            aria-hidden="true"
          >
            <path d={hilo} fill="none" stroke="rgba(230,233,242,0.1)" strokeWidth={1.5} />
            <motion.path
              d={hilo}
              fill="none"
              stroke="#FF7A1A"
              strokeWidth={2}
              strokeLinecap="round"
              style={{ pathLength: progress }}
              className="hj-thread-glow"
            />
          </svg>
        )}

        {/* En móvil las alturas varían: línea recta en vez del hilo curvo. */}
        <div className="absolute bottom-0 left-[19px] top-0 w-px bg-gradient-to-b from-hj-signal/60 via-white/10 to-transparent lg:hidden" aria-hidden="true" />

        <ol>
          {PASOS.map((p, i) => (
            <li key={p.titulo} className="relative flex min-h-0 flex-col justify-center py-10 pl-14 lg:h-[78vh] lg:py-0">
              <Nodo i={i} progress={progress} />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-hj-signal">
                {String(i + 1).padStart(2, '0')} · {p.titulo}
              </span>
              <h3 className="hj-display mt-4 text-3xl text-white sm:text-4xl">{p.frase}</h3>
              <p className="mt-5 max-w-md text-base leading-relaxed text-hj-muted sm:text-lg">{p.cuerpo}</p>
              <span className="mt-6 inline-flex self-start rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-hj-mist/80">
                {p.dato}
              </span>
              <EscenaMovil i={i} reduce={reduce} />
            </li>
          ))}
        </ol>
      </div>

      {/* Escenario sticky (solo escritorio) */}
      <div className="hidden lg:block">
        <div className="sticky top-[15vh] h-[70vh]">
          <div className="relative h-full">
            {PASOS.map((p, i) => (
              <EscenaEscritorio key={p.titulo} i={i} progress={progress} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
