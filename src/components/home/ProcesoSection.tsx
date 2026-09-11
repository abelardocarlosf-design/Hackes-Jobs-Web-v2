import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Reveal, Magnetic } from '@/components/motion';
import { GUTTER, PROCESO } from './home.data';

/**
 * Proceso.
 *
 * Antes compartía el fondo fotográfico del hero y por eso no declaraba color
 * propio. Ahora que el fondo del hero es local a su sección, esta necesita el
 * suyo: `#0b0b14`, un escalón por encima del negro del body, para que el panel
 * de vidrio siga teniendo algo contra lo que separarse.
 */
export function ProcesoSection() {
  return (
    <section
      className={`relative z-10 overflow-hidden bg-[#0b0b14] py-24 sm:py-28 ${GUTTER}`}
      aria-labelledby="proceso-title"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <Reveal delay={0.12} distance={18}>
            <span className="badge-accent font-mono text-[10px] uppercase tracking-[0.15em] text-white sm:text-[11px]">
              Operación verificable
            </span>
          </Reveal>

          <Reveal delay={0.22} distance={18} className="max-w-sm sm:text-right">
            <p className="text-lg leading-relaxed text-white/80 sm:text-xl">
              Nuestro proceso no solo responde: filtra, evalúa y entrega la terna con la evidencia
              que tu gerente de RH necesita para decidir.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col gap-12 md:flex-row md:items-end md:justify-between md:gap-16">
          <div className="max-w-xl">
            <Reveal delay={0.18} distance={22}>
              <h2
                id="proceso-title"
                className="headline-editorial text-5xl text-white sm:text-6xl lg:text-7xl"
              >
                Contrata con
                <br />
                evidencia.
              </h2>
            </Reveal>

            <Reveal delay={0.32} distance={18}>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
                Desde la requisición hasta la terna final, convertimos el perfil que necesitas en
                decisiones que tu equipo puede tomar hoy — con trazabilidad y sin pasos manuales
                perdidos en correos.
              </p>
            </Reveal>

            <Reveal delay={0.42} distance={18}>
              <div className="mt-8">
                <Magnetic strength={0.3}>
                  <Link
                    href="/empresas#proceso"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-xs font-medium text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/20 sm:text-sm"
                  >
                    Ver el proceso completo
                    <ChevronRight size={14} aria-hidden="true" />
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>

          <div className="glass-panel w-full max-w-md rounded-2xl px-5 sm:px-6">
            {PROCESO.map((p, i) => (
              <Reveal key={p.title} delay={0.3 + i * 0.11} distance={18} className="panel-row">
                <div className="flex gap-5 py-5">
                  <span className="pt-1 font-mono text-[11px] tracking-[0.15em] text-white/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-base font-medium text-white sm:text-lg">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/70">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
