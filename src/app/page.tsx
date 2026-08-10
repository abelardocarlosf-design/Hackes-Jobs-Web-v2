'use client';

import { useRef } from 'react';
import Link from 'next/link';
import {
  Brain,
  Workflow,
  Database,
  Cpu,
  ShieldCheck,
  Plug,
  ChevronRight,
  Search,
  UserPlus,
} from 'lucide-react';
import { ScrollSequence } from '@/components/brand/ScrollSequence';
import { ClientsMarquee } from '@/components/brand/ClientsMarquee';
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

/** Ritmo horizontal común a todo el bloque cinemático. */
const GUTTER = 'px-5 sm:px-8 md:px-12';
/** Shell de sección a viewport completo, con aire bajo el navbar fijo. */
const VIEWPORT_SECTION =
  'relative flex min-h-screen supports-[height:100svh]:min-h-[100svh] flex-col justify-between pt-24 pb-12 sm:pt-28 md:pb-16';

const SERVICIOS = [
  'Reclutamiento industrial',
  'Evaluación psicométrica',
  'Procesos automatizados',
];

const PROCESO = [
  {
    title: 'Requisición en 24 h',
    body: 'Levantamos el perfil real del puesto y confirmamos alcance dentro del mismo día hábil.',
  },
  {
    title: 'Evaluación psicométrica',
    body: 'Batería validada con scoring algorítmico y reporte ejecutivo en PDF, no un test crudo.',
  },
  {
    title: 'Terna con garantía',
    body: 'Entregamos finalistas con evidencia y respaldo de reposición durante 10 días.',
  },
];

const KPIS = [
  { value: 500, prefix: '+', suffix: '', label: 'Evaluaciones procesadas' },
  { value: 50, prefix: '+', suffix: '', label: 'Empresas atendidas' },
  { value: 10, prefix: '', suffix: ' días', label: 'Garantía de reposición' },
  { value: 24, prefix: '', suffix: ' hrs', label: 'Respuesta a requisición' },
];

const STACK = [
  {
    icon: Workflow,
    title: 'n8n — Orquestación',
    body: 'Conecta automáticamente cada etapa del reclutamiento: requisición, atracción, envío de psicometrías, seguimiento por WhatsApp y entrega de terna. Sin pasos manuales perdidos en correos.',
  },
  {
    icon: Brain,
    title: 'Modelos IA (OpenAI · Anthropic)',
    body: 'Filtran cientos de currículums contra el perfil real del puesto en minutos, no en días. Solo llegan a entrevista los candidatos con compatibilidad técnica y conductual verificada.',
  },
  {
    icon: ShieldCheck,
    title: 'Suite psicométrica',
    body: 'Aplicamos baterías validadas con scoring algorítmico (DISC, 16PF, Moss, Zavic, Lüscher) y entrega de reporte ejecutivo. Tu gerente de RH recibe un PDF claro, no un test crudo.',
  },
  {
    icon: Database,
    title: 'PostgreSQL + Pinecone',
    body: 'Memoria operativa. Cada candidato evaluado y proceso cerrado queda registrado. Cuando vuelves a contratar para el mismo perfil, partimos de la experiencia previa, no de cero.',
  },
  {
    icon: Cpu,
    title: 'Stripe + CFDI 4.0',
    body: 'Cobro y facturación transparente. Pago seguro en MXN, facturación electrónica inmediata para México. Cero fricción contable para tu equipo de administración.',
  },
  {
    icon: Plug,
    title: 'Next.js + Cifrado AES-256',
    body: 'Plataforma propia, datos protegidos. La infraestructura es nuestra. Los datos de tus candidatos viven cifrados, bajo cumplimiento LFPDPPP, sin intermediarios.',
  },
];

export default function HomePage() {
  // El scrub de la secuencia se mide contra este bloque (hero + spacer + proceso).
  const cinematicRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden font-sans selection:bg-brand-orange/40 selection:text-white">
      <ScrollProgress />

      {/* Estos dos viven antes de la secuencia: al compartir z-0, el orden del
          DOM decide, así que las fotos pintan encima y el overlay sigue
          domando el mesh en las secciones transparentes de abajo. */}
      <div className="page-overlay" />
      <div className="page-dotgrid" />

      {/* ═══ BLOQUE CINEMÁTICO · el scroll barre la secuencia de Toluca ═══ */}
      <div ref={cinematicRef} className="relative">
        <ScrollSequence targetRef={cinematicRef} />

        <div className="relative z-10">
          {/* ─── 1. HERO ─── */}
          <section className={`${VIEWPORT_SECTION} ${GUTTER}`} aria-labelledby="hero-title">
            {/* Fila superior: servicios · intro */}
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
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

              <Reveal delay={0.3} distance={18} className="max-w-xs sm:text-right">
                <p className="text-lg leading-relaxed text-white drop-shadow-md sm:text-xl">
                  Cubrimos vacantes de manufactura en el corredor Toluca–Lerma–Metepec con candidatos
                  evaluados, no con currículums sin filtrar.
                </p>
              </Reveal>
            </div>

            {/* Fila inferior: badge + titular · tarjeta de contacto */}
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <Reveal delay={0.15} distance={18}>
                  <span className="badge-accent font-mono text-[10px] uppercase tracking-[0.15em] text-white sm:text-[11px]">
                    Garantía de reposición · 10 días
                  </span>
                </Reveal>

                <Reveal delay={0.28} distance={22}>
                  <h1
                    id="hero-title"
                    className="headline-editorial mt-5 text-5xl text-white drop-shadow-lg sm:text-6xl lg:text-7xl"
                  >
                    Vacante cubierta.
                    <br />
                    Candidato evaluado.
                  </h1>
                </Reveal>
              </div>

              <Reveal delay={0.42} distance={22}>
                <div className="glass-chip flex items-center gap-4 rounded-xl p-3">
                  {/* En el slot de retrato va el dato que sostiene la promesa,
                      no una foto de archivo. */}
                  <div className="flex h-24 w-20 flex-col items-center justify-center rounded-lg border border-white/15 bg-white/10">
                    <span className="text-2xl font-semibold leading-none text-white">24 h</span>
                    <span className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-white/75">
                      Respuesta
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 pr-2">
                    <span className="text-sm font-medium text-white">Habla con un reclutador</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/75">
                      Diagnóstico sin costo
                    </span>
                    <Magnetic strength={0.3}>
                      <Link
                        href="/empresas/requisicion"
                        className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-4 py-2 text-xs font-semibold text-white transition-colors duration-300 hover:bg-orange-600"
                      >
                        Solicitar reclutamiento
                        <ChevronRight size={14} aria-hidden="true" />
                      </Link>
                    </Magnetic>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Aire para que el scrub tenga recorrido entre las dos secciones. */}
          <div className="h-[80vh]" aria-hidden="true" />

          {/* ─── 2. PROCESO / CAPACIDAD ─── */}
          <section className={`${VIEWPORT_SECTION} ${GUTTER}`} aria-labelledby="proceso-title">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <Reveal delay={0.12} distance={18}>
                <span className="badge-accent font-mono text-[10px] uppercase tracking-[0.15em] text-white sm:text-[11px]">
                  Operación verificable
                </span>
              </Reveal>

              <Reveal delay={0.22} distance={18} className="max-w-sm sm:text-right">
                <p className="text-lg leading-relaxed text-white drop-shadow-md sm:text-xl">
                  Nuestro proceso no solo responde: filtra, evalúa y entrega la terna con la
                  evidencia que tu gerente de RH necesita para decidir.
                </p>
              </Reveal>
            </div>

            <div className="flex flex-1 flex-col justify-end gap-12 md:flex-row md:items-end md:justify-between md:gap-16">
              <div className="max-w-xl">
                <Reveal delay={0.18} distance={22}>
                  <h2
                    id="proceso-title"
                    className="headline-editorial text-5xl text-white drop-shadow-lg sm:text-6xl lg:text-7xl"
                  >
                    Contrata con
                    <br />
                    evidencia.
                  </h2>
                </Reveal>

                <Reveal delay={0.32} distance={18}>
                  <p className="mt-6 max-w-md text-sm leading-relaxed text-white/80 drop-shadow-md sm:text-base">
                    Desde la requisición hasta la terna final, convertimos el perfil que necesitas en
                    decisiones que tu equipo puede tomar hoy — con trazabilidad y sin pasos manuales
                    perdidos en correos.
                  </p>
                </Reveal>

                <Reveal delay={0.42} distance={18}>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Magnetic strength={0.3}>
                      <Link
                        href="/empresas#proceso"
                        className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-5 py-2.5 text-xs font-semibold text-white transition-colors duration-300 hover:bg-orange-600 sm:text-sm"
                      >
                        Ver el proceso
                        <ChevronRight size={14} aria-hidden="true" />
                      </Link>
                    </Magnetic>
                    <a
                      href={waUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-xs font-medium text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/20 sm:text-sm"
                    >
                      Cotizar por WhatsApp
                    </a>
                  </div>
                </Reveal>
              </div>

              {/* Panel frosted — la secuencia real del servicio, no tres cards decorativas */}
              <div className="glass-panel w-full max-w-md rounded-2xl px-5 sm:px-6">
                {PROCESO.map((p, i) => (
                  <Reveal key={p.title} delay={0.3 + i * 0.11} distance={18} className="panel-row">
                    <div className="flex gap-5 py-5">
                      <span className="pt-1 font-mono text-[11px] tracking-[0.15em] text-white/70">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="group flex items-center gap-1.5 text-base font-medium text-white sm:text-lg">
                          {p.title}
                          <ChevronRight
                            size={16}
                            aria-hidden="true"
                            className="text-white/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-white"
                          />
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-white/70">{p.body}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ═══ PRUEBA · KPIs reales ═══ */}
      <section className="relative z-10 border-y border-white/10 bg-[#0d1422] py-24" aria-labelledby="kpis-title">
        <div className={`container mx-auto ${GUTTER}`}>
          <Reveal className="mb-12 max-w-2xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-brand-orange">
              Números de operación
            </span>
            <h2 id="kpis-title" className="headline-editorial mt-4 text-4xl text-white sm:text-5xl">
              Lo que ya pasó por aquí.
            </h2>
          </Reveal>

          <RevealGroup className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
            {KPIS.map((s) => (
              <RevealItem
                key={s.label}
                className="group bg-[#0d1422] px-6 py-10 transition-colors duration-500 hover:bg-white/[0.03]"
              >
                <div className="kpi-num text-4xl font-semibold text-white transition-colors duration-500 group-hover:text-brand-orange md:text-5xl">
                  <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/55">
                  {s.label}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ═══ CLIENTES ═══ */}
      <ClientsMarquee />

      {/* ═══ CANDIDATOS ═══ */}
      <section className="relative z-10 overflow-hidden border-t border-white/10 bg-[#07070f] py-24" aria-labelledby="talento-title">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange/5 blur-[140px]" />

        <div className={`container relative z-10 mx-auto max-w-6xl ${GUTTER}`}>
          <Reveal className="mb-14 max-w-2xl">
            <span className="badge-accent font-mono text-[10px] uppercase tracking-[0.15em] text-white sm:text-[11px]">
              ¿Buscas empleo?
            </span>
            <h2 id="talento-title" className="headline-editorial mt-5 text-4xl text-white sm:text-5xl">
              Encuentra tu próximo reto profesional.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
              Conectamos talento técnico, administrativo y operativo con las plantas de manufactura y
              empresas del corredor industrial Toluca–Lerma.
            </p>
          </Reveal>

          <RevealGroup className="grid max-w-4xl gap-6 md:grid-cols-2" stagger={0.12}>
            <RevealItem className="[perspective:1200px]">
              <TiltCard glow="249, 115, 22" max={6} className="h-full rounded-2xl">
                <div className="glass-panel group flex h-full flex-col justify-between gap-8 rounded-2xl p-8 transition-colors duration-500 hover:border-brand-orange/30">
                  <div className="relative z-20 space-y-5">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange transition-colors duration-500 group-hover:bg-brand-orange group-hover:text-white">
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
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue transition-colors duration-500 group-hover:bg-brand-blue group-hover:text-white">
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

      {/* ═══ STACK · filas editoriales, no un muro de cards ═══ */}
      <section className="relative z-10 bg-brand-black py-24" aria-labelledby="stack-title">
        <div className={`container mx-auto max-w-6xl ${GUTTER}`}>
          <Reveal className="mb-14 max-w-2xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-brand-blue">
              Infraestructura
            </span>
            <h2 id="stack-title" className="headline-editorial mt-4 text-4xl text-white sm:text-5xl">
              Tecnología que opera detrás de cada proceso.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/70">
              No vendemos software. Lo usamos. Tú recibes el resultado; nosotros operamos la
              infraestructura.
            </p>
          </Reveal>

          {/* Dos paneles en vez de un grid: así el divisor `.panel-row + .panel-row`
              sigue el orden visual y no le pinta borde superior al primero de la
              segunda columna. */}
          <div className="grid gap-6 md:grid-cols-2">
            {[STACK.slice(0, 3), STACK.slice(3)].map((group, gi) => (
              <RevealGroup key={gi} className="glass-panel rounded-2xl px-5 sm:px-6" stagger={0.07}>
                {group.map(({ icon: Icon, title, body }, i) => (
                  <RevealItem key={title} className="panel-row">
                    <div className="flex gap-5 py-6">
                      <span className="pt-1 font-mono text-[11px] tracking-[0.15em] text-white/55">
                        {String(gi * 3 + i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="flex items-center gap-2.5 text-base font-medium text-white sm:text-lg">
                          <Icon size={18} aria-hidden="true" className="text-white/45" />
                          {title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-white/70">{body}</p>
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CIERRE ═══ */}
      <section className="relative z-10 overflow-hidden border-t border-white/10 bg-[#0d1422] py-28">
        <div className="pointer-events-none absolute right-0 top-0 -mr-64 -mt-64 h-[500px] w-[500px] rounded-full bg-brand-orange/10 blur-[120px]" />

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
              <Link
                href="/empresas#proceso"
                className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-xs font-medium text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/20 sm:text-sm"
              >
                Ver cómo trabajamos
              </Link>
            </div>

            <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">
              Hacke&apos;s Jobs Technologies © {new Date().getFullYear()} · LFPDPPP
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
