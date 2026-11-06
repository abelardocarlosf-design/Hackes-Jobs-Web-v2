'use client';

import Link from 'next/link';
import { ArrowDown, ArrowRight, Search, UserPlus } from 'lucide-react';
import { ClientsMarquee } from '@/components/brand/ClientsMarquee';
import { HeroReel } from '@/components/landing/HeroReel';
import { ProcessStory } from '@/components/landing/ProcessStory';
import { EngineMap } from '@/components/landing/EngineMap';
import { waUrl } from '@/lib/contact';
import {
  Reveal,
  RevealGroup,
  RevealItem,
  TiltCard,
  Magnetic,
  CountUp,
  ScrollProgress,
} from '@/components/motion';

/** Ritmo horizontal común a toda la landing. */
const WRAP = 'mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12';

// Los tres compromisos que sostienen la promesa del titular.
const COMPROMISOS = [
  { valor: '24 h', label: 'Respuesta a tu requisición' },
  { valor: '7–10 días', label: 'Terna con evidencia' },
  { valor: '10 días', label: 'Garantía de reposición' },
];

const KPIS = [
  { value: 500, prefix: '+', suffix: '', label: 'Evaluaciones procesadas' },
  { value: 50, prefix: '+', suffix: '', label: 'Empresas atendidas' },
  { value: 10, prefix: '', suffix: ' días', label: 'Garantía de reposición' },
  { value: 24, prefix: '', suffix: ' h', label: 'Respuesta a requisición' },
];

// Reel de HyperFrames (fuente en videos/hero-reel). Sin él, HeroReel cae al embudo en código.
const HERO_VIDEO = {
  webm: '/media/hero-reel.webm',
  mp4: '/media/hero-reel.mp4',
  poster: '/media/hero-reel-poster.avif',
};

export default function HomePage() {
  return (
    <div className="hj-landing relative flex min-h-screen flex-col overflow-x-clip selection:bg-hj-signal/40 selection:text-white">
      <ScrollProgress />
      <div className="hj-grain" aria-hidden="true" />

      {/* ═══ HERO ═══ */}
      <section className="relative isolate overflow-hidden pb-20 pt-32 sm:pt-36 lg:pb-28" aria-labelledby="hero-title">
        <div className="hj-aurora" aria-hidden="true" />
        <div className="hj-grid" aria-hidden="true" />

        <div className={`${WRAP} relative z-10`}>
          <Reveal delay={0.05} distance={14}>
            <span className="hj-eyebrow inline-flex items-center gap-3">
              <span className="h-px w-8 bg-hj-signal" aria-hidden="true" />
              Agencia de reclutamiento operada con IA · México
            </span>
          </Reveal>

          <Reveal delay={0.15} distance={24} blur>
            <h1 id="hero-title" className="hj-display mt-7 text-[clamp(2.5rem,7.4vw,6.4rem)] text-white">
              Vacante cubierta.
              <br />
              Candidato <span className="text-hj-signal">evaluado.</span>
            </h1>
          </Reveal>

          <div className="mt-12 grid items-center gap-12 lg:mt-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <div>
              <Reveal delay={0.3} distance={16}>
                <p className="max-w-lg text-lg leading-relaxed text-hj-muted sm:text-xl">
                  Filtramos con inteligencia artificial, evaluamos con psicometría validada y te
                  entregamos una terna con evidencia. <span className="text-hj-mist">Tú solo
                  entrevistas y eliges.</span>
                </p>
              </Reveal>

              <Reveal delay={0.42} distance={16}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Magnetic strength={0.3}>
                    <Link href="/empresas/requisicion" className="hj-btn-primary">
                      Solicitar reclutamiento
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </Magnetic>
                  <Link href="/vacantes" className="hj-btn-ghost">
                    Busco empleo
                  </Link>
                </div>
              </Reveal>

              <RevealGroup className="hj-hairline mt-12 grid grid-cols-3 gap-3 border-t pt-6 sm:gap-4" delayChildren={0.55} stagger={0.08}>
                {COMPROMISOS.map((c) => (
                  <RevealItem key={c.label}>
                    <p className="hj-display whitespace-nowrap text-[0.95rem] text-white sm:text-2xl">{c.valor}</p>
                    <p className="mt-2 font-mono text-[10px] uppercase leading-snug tracking-[0.14em] text-hj-muted">
                      {c.label}
                    </p>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            <Reveal delay={0.35} distance={30} blur>
              <HeroReel video={HERO_VIDEO} />
            </Reveal>
          </div>

          <a
            href="#proceso"
            className="mt-16 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-hj-muted hover:text-white lg:mt-20"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15">
              <ArrowDown size={14} aria-hidden="true" />
            </span>
            Sigue el hilo: así cubrimos tu vacante
          </a>
        </div>
      </section>

      {/* ═══ PROCESO · el hilo ═══ */}
      <section id="proceso" className="relative scroll-mt-24 py-20 lg:py-28" aria-labelledby="proceso-title">
        <div className={WRAP}>
          <Reveal className="max-w-3xl">
            <span className="hj-eyebrow">Cómo trabajamos</span>
            <h2 id="proceso-title" className="hj-display mt-5 text-4xl text-white sm:text-5xl lg:text-6xl">
              De la vacante a la contratación, en cinco etapas.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-hj-muted">
              Tú participas donde aportas valor: definir el perfil y entrevistar a los finalistas.
              Todo lo demás lo operamos nosotros.
            </p>
          </Reveal>

          <div className="mt-8 lg:mt-4">
            <ProcessStory />
          </div>
        </div>
      </section>

      {/* ═══ PRUEBA · KPIs ═══ */}
      <section className="hj-hairline relative border-y bg-hj-ink/60 py-20 lg:py-24" aria-labelledby="kpis-title">
        <div className={WRAP}>
          <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="hj-eyebrow">Números de operación</span>
              <h2 id="kpis-title" className="hj-display mt-4 text-3xl text-white sm:text-4xl">
                Lo que ya pasó por el hilo.
              </h2>
            </div>
          </Reveal>

          <RevealGroup className="hj-hairline grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-white/[0.06] md:grid-cols-4">
            {KPIS.map((s) => (
              <RevealItem key={s.label} className="group bg-hj-void px-6 py-10 transition-colors duration-500 hover:bg-hj-ink">
                <div className="hj-display text-4xl text-white transition-colors duration-500 group-hover:text-hj-signal md:text-5xl">
                  <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-hj-muted">{s.label}</div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ═══ CLIENTES ═══ */}
      <ClientsMarquee />

      {/* ═══ EL MOTOR ═══ */}
      <section className="relative py-20 lg:py-28" aria-labelledby="motor-title">
        <div className={WRAP}>
          <Reveal className="mb-14 max-w-3xl">
            <span className="hj-eyebrow">El motor</span>
            <h2 id="motor-title" className="hj-display mt-5 text-4xl text-white sm:text-5xl">
              Tecnología propia detrás de cada etapa.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-hj-muted">
              No te vendemos software ni te pedimos aprender otro dashboard. Nosotros operamos la
              infraestructura; tú recibes candidatos.
            </p>
          </Reveal>
          <EngineMap />
        </div>
      </section>

      {/* ═══ CANDIDATOS ═══ */}
      <section className="hj-hairline relative overflow-hidden border-t py-20 lg:py-28" aria-labelledby="talento-title">
        <div className={WRAP}>
          <Reveal className="mb-12 max-w-2xl">
            <span className="hj-eyebrow">¿Buscas empleo?</span>
            <h2 id="talento-title" className="hj-display mt-5 text-4xl text-white sm:text-5xl">
              Tu próximo trabajo, sin enviar CVs al vacío.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-hj-muted">
              Vacantes reales en empresas de todo México, con un proceso claro y retroalimentación
              en cada etapa.
            </p>
          </Reveal>

          <RevealGroup className="grid max-w-4xl gap-5 md:grid-cols-2" stagger={0.12}>
            {[
              {
                icon: Search,
                glow: '255, 122, 26',
                titulo: 'Bolsa de empleo activa',
                cuerpo: 'Vacantes validadas directamente con quien contrata. Sabes en qué etapa vas.',
                href: '/vacantes',
                cta: 'Explorar vacantes',
              },
              {
                icon: UserPlus,
                glow: '59, 107, 255',
                titulo: 'Sube tu CV una vez',
                cuerpo: 'Registra tu perfil y te vinculamos con las vacantes que encajan con tu experiencia.',
                href: '/register',
                cta: 'Subir mi CV',
              },
            ].map(({ icon: Icon, glow, titulo, cuerpo, href, cta }) => (
              <RevealItem key={titulo} className="[perspective:1200px]">
                <TiltCard glow={glow} max={5} className="h-full rounded-2xl">
                  <div className="hj-panel flex h-full flex-col justify-between gap-8 rounded-2xl p-8">
                    <div className="relative z-20 space-y-4">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-hj-mist">
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <h3 className="hj-display text-xl text-white">{titulo}</h3>
                      <p className="text-sm leading-relaxed text-hj-muted">{cuerpo}</p>
                    </div>
                    <Link href={href} className="hj-btn-ghost relative z-20 self-start">
                      {cta}
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </TiltCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ═══ CIERRE · el hilo termina en el botón ═══ */}
      <section className="relative isolate overflow-hidden py-24 lg:py-32">
        <div className="hj-aurora !top-auto bottom-[-60%] !opacity-40" aria-hidden="true" />
        <div className={`${WRAP} relative z-10 flex flex-col items-center text-center`}>
          <span className="h-24 w-px bg-gradient-to-b from-transparent to-hj-signal" aria-hidden="true" />
          <span className="-mt-1 h-2.5 w-2.5 rounded-full bg-hj-signal shadow-[0_0_20px_rgba(255,122,26,0.9)]" aria-hidden="true" />

          <Reveal from="up" distance={24} className="mt-10 max-w-3xl">
            <h2 className="hj-display text-4xl text-white sm:text-5xl lg:text-6xl">
              Servicio de agencia. Precisión de empresa de tecnología.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-hj-muted">
              Una persona responsable de tu cuenta, con la velocidad y la trazabilidad de una
              plataforma. Sin licencias, sin dashboards que aprender.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Magnetic strength={0.35}>
                <Link href="/empresas/requisicion" className="hj-btn-primary">
                  Solicitar reclutamiento
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Magnetic>
              <a href={waUrl()} target="_blank" rel="noopener noreferrer" className="hj-btn-ghost">
                Cotizar por WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
