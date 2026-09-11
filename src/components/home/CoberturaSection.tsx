import { CoverageMap } from '@/components/brand/CoverageMap';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { PLAZAS } from '@/components/brand/mexico-geometry';
import { GUTTER } from './home.data';

/**
 * Cobertura nacional.
 *
 * Aquí aterriza el reposicionamiento geográfico: Ciudad de México al frente y
 * las plazas principales del país alrededor.
 *
 * El copy distingue operación directa de búsqueda coordinada a propósito. Todo
 * el sitio se vende sobre evidencia; un mapa que insinuara oficinas en ocho
 * ciudades contradiría exactamente eso.
 */

const DIRECTAS = PLAZAS.filter((p) => p.tier === 'hub' || p.tier === 'directa');
const COORDINADAS = PLAZAS.filter((p) => p.tier === 'coordinada');

export function CoberturaSection() {
  return (
    <section
      className={`relative z-10 overflow-hidden border-y border-white/10 bg-[#07070f] py-24 ${GUTTER}`}
      aria-labelledby="cobertura-title"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
                Cobertura
              </span>
              <h2
                id="cobertura-title"
                className="headline-editorial mt-4 text-4xl text-white sm:text-5xl"
              >
                Ciudad de México y las plazas que importan.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
                Operamos en el Valle de México y coordinamos búsquedas en los corredores donde se
                concentra la manufactura y el corporativo mexicano. Donde está tu planta y donde
                está tu dirección.
              </p>
            </Reveal>

            <RevealGroup className="mt-10 space-y-8" stagger={0.1}>
              <RevealItem>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-brand-orange">
                  Operación directa
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {DIRECTAS.map((p) => (
                    <li
                      key={p.nombre}
                      className="rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-xs font-medium text-white"
                    >
                      {p.nombre}
                    </li>
                  ))}
                </ul>
              </RevealItem>

              <RevealItem>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/45">
                  Búsquedas coordinadas
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {COORDINADAS.map((p) => (
                    <li
                      key={p.nombre}
                      className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-medium text-white/70"
                    >
                      {p.nombre}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            </RevealGroup>
          </div>

          <Reveal delay={0.15} distance={24}>
            <CoverageMap />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
