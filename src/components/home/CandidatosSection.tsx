import Link from 'next/link';
import { ChevronRight, Search, UserPlus } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem, TiltCard } from '@/components/motion';
import { GUTTER } from './home.data';

/**
 * Candidatos — la audiencia secundaria.
 *
 * Va tarde en la página a propósito: el prospecto B2B llega de campaña en frío
 * y tiene que atravesar toda la prueba antes de encontrarse con la bolsa de
 * empleo.
 */
export function CandidatosSection() {
  return (
    <section
      className="relative z-10 overflow-hidden border-t border-white/10 bg-[#07070f] py-24"
      aria-labelledby="talento-title"
    >
      <div className={`container relative z-10 mx-auto max-w-6xl ${GUTTER}`}>
        <Reveal className="mb-14 max-w-2xl">
          <span className="badge-accent font-mono text-[10px] uppercase tracking-[0.15em] text-white sm:text-[11px]">
            ¿Buscas empleo?
          </span>
          <h2 id="talento-title" className="headline-editorial mt-5 text-4xl text-white sm:text-5xl">
            Encuentra tu próximo reto profesional.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
            Conectamos talento técnico, administrativo y operativo con empresas en Ciudad de México
            y las principales plazas industriales del país.
          </p>
        </Reveal>

        <RevealGroup className="grid max-w-4xl gap-6 md:grid-cols-2" stagger={0.12}>
          <RevealItem className="[perspective:1200px]">
            <TiltCard glow="249, 115, 22" max={6} className="h-full rounded-2xl">
              <div className="glass-panel group flex h-full flex-col justify-between gap-8 rounded-2xl p-8 transition-colors duration-500 hover:border-brand-orange/30">
                <div className="relative z-20 space-y-5">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.07] text-white/70 transition-colors duration-500 group-hover:bg-brand-orange group-hover:text-white">
                    <Search size={20} aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-medium tracking-tight text-white">
                    Bolsa de empleo activa
                  </h3>
                  <p className="text-sm leading-relaxed text-white/70">
                    Vacantes reales, validadas directamente con los tomadores de decisiones.
                    Procesos transparentes y con feedback claro.
                  </p>
                </div>

                <Link
                  href="/vacantes"
                  className="relative z-20 inline-flex items-center gap-1.5 self-start rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-xs font-medium text-white transition-colors duration-300 hover:bg-white/20"
                >
                  Explorar vacantes
                  <ChevronRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </TiltCard>
          </RevealItem>

          <RevealItem className="[perspective:1200px]">
            <TiltCard glow="30, 64, 175" max={6} className="h-full rounded-2xl">
              <div className="glass-panel group flex h-full flex-col justify-between gap-8 rounded-2xl p-8 transition-colors duration-500 hover:border-brand-blue/30">
                <div className="relative z-20 space-y-5">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.07] text-white/70 transition-colors duration-500 group-hover:bg-brand-blue group-hover:text-white">
                    <UserPlus size={20} aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-medium tracking-tight text-white">
                    Vincúlate con inteligencia artificial
                  </h3>
                  <p className="text-sm leading-relaxed text-white/70">
                    Registra tu perfil y sube tu CV. Nuestros algoritmos de perfilado te vinculan
                    con vacantes afines a tu experiencia.
                  </p>
                </div>

                <Link
                  href="/register"
                  className="relative z-20 inline-flex items-center gap-1.5 self-start rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-xs font-medium text-white transition-colors duration-300 hover:bg-white/20"
                >
                  Subir mi CV
                  <ChevronRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </TiltCard>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
