import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Reveal, Magnetic } from '@/components/motion';
import { waUrl } from '@/lib/contact';
import { GUTTER } from './home.data';

export function CierreSection() {
  return (
    <section className="relative z-10 overflow-hidden border-t border-white/10 bg-[#0d1422] py-28">
      <div className={`container relative z-10 mx-auto max-w-3xl ${GUTTER}`}>
        <Reveal from="up" distance={30}>
          <span className="badge-accent font-mono text-[10px] uppercase tracking-[0.15em] text-white sm:text-[11px]">
            Qué significa para ti
          </span>

          <h2 className="headline-editorial mt-6 text-4xl text-white sm:text-5xl">
            Servicio de agencia, precisión de empresa de tecnología.
          </h2>

          <p className="mt-6 text-base leading-relaxed text-white/75 sm:text-lg">
            Recibes un humano responsable de tu cuenta, entregando con la velocidad y trazabilidad
            de una plataforma.{' '}
            <strong className="font-medium text-white">
              Sin licencias que pagar, sin dashboards que aprender, sin onboarding de software.
            </strong>
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Magnetic strength={0.35}>
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

          <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">
            Hacke&apos;s Jobs Technologies © {new Date().getFullYear()} · LFPDPPP
          </p>
        </Reveal>
      </div>
    </section>
  );
}
