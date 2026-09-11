import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { HeroBackdrop } from '@/components/brand/HeroBackdrop';
import { Reveal, Magnetic } from '@/components/motion';
import { waUrl } from '@/lib/contact';
import { GUTTER, HERO_PRUEBAS, SERVICIOS, VIEWPORT_SECTION } from './home.data';

/**
 * Hero.
 *
 * `relative isolate` es estructural, no decorativo: crea el contexto de
 * apilamiento que mantiene el `-z-10` de `HeroBackdrop` dentro de la sección.
 * Sin él, el fondo se colaría por detrás de los overlays fijos de la página.
 *
 * Todo el texto se alinea a la izquierda y el motor ocupa la derecha. La
 * versión anterior repartía contenido a ambos lados, lo que dejaba al fondo sin
 * ningún respiro donde leerse.
 */
export function HeroSection() {
  return (
    <section
      className={`${VIEWPORT_SECTION} ${GUTTER} isolate overflow-hidden`}
      aria-labelledby="hero-title"
    >
      <HeroBackdrop />

      <ul className="flex flex-col gap-2">
        {SERVICIOS.map((s, i) => (
          <Reveal
            as="li"
            key={s}
            delay={0.15 + i * 0.12}
            distance={18}
            className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/90 drop-shadow-md sm:text-xs"
          >
            <span aria-hidden="true" className="text-brand-orange">/ </span>
            {s}
          </Reveal>
        ))}
      </ul>

      <div className="max-w-2xl">
        {/* `eager` en el bloque above-the-fold: el SSR de framer-motion
            serializa `opacity:0` y el algoritmo de LCP descarta los elementos a
            opacidad cero. Con el fondo ya sin imagen, el titular es el
            candidato a LCP y tiene que llegar pintado en el primer frame. */}
        <Reveal eager>
          <span className="badge-accent font-mono text-[10px] uppercase tracking-[0.15em] text-white sm:text-[11px]">
            Garantía de reposición · 10 días
          </span>
        </Reveal>

        <Reveal eager>
          <h1
            id="hero-title"
            className="headline-editorial mt-5 text-5xl text-white drop-shadow-lg sm:text-6xl lg:text-7xl"
          >
            Vacante cubierta.
            <br />
            Candidato evaluado.
          </h1>
        </Reveal>

        <Reveal eager>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 drop-shadow-md sm:text-xl">
            Reclutamiento especializado para empresas en Ciudad de México y las principales plazas
            del país. Entregamos una terna evaluada, no currículums sin filtrar.
          </p>
        </Reveal>

        <Reveal eager>
          <div className="mt-9 flex flex-wrap gap-3">
            <Magnetic strength={0.3}>
              <Link
                href="/empresas/requisicion"
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-6 py-3 text-xs font-semibold text-white transition-colors duration-300 hover:bg-orange-600 sm:text-sm"
              >
                Solicitar reclutamiento
                <ChevronRight size={14} aria-hidden="true" />
              </Link>
            </Magnetic>
            <a
              href={waUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-xs font-medium text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/20 sm:text-sm"
            >
              Cotizar por WhatsApp
            </a>
          </div>
        </Reveal>

        {/* Los tres datos que sostienen la promesa. Van bajo los CTAs, no en una
            tarjeta flotante: son la letra pequeña del titular. */}
        {/* `eager` también aquí: el `viewport.margin` de Reveal descuenta un 12%
            por abajo, así que esta fila —que cae justo en esa franja en un
            viewport de 900 px— se quedaba invisible hasta hacer scroll. */}
        <Reveal eager>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {HERO_PRUEBAS.map((p) => (
              <div key={p.label}>
                <dt className="sr-only">{p.label}</dt>
                <dd className="text-xl font-semibold leading-none text-white sm:text-2xl">
                  {p.dato}
                </dd>
                <p
                  aria-hidden="true"
                  className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/60 sm:text-[10px]"
                >
                  {p.label}
                </p>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
