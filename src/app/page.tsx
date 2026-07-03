'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import {
  Brain,
  Workflow,
  Database,
  Cpu,
  ShieldCheck,
  Plug,
  ArrowRight,
  Search,
  UserPlus,
  ChevronDown,
} from 'lucide-react';
import { HeroToluca } from '@/components/brand/HeroToluca';
import { waUrl } from '@/lib/contact';
import { ClientsMarquee } from '@/components/brand/ClientsMarquee';
import { GuaranteeBadge } from '@/components/brand/GuaranteeBadge';
import {
  Reveal,
  RevealGroup,
  RevealItem,
  TiltCard,
  Magnetic,
  CountUp,
  ScrollProgress,
} from '@/components/motion';

const KPIS = [
  { value: 500, prefix: '+', suffix: '', label: 'Evaluaciones procesadas' },
  { value: 50, prefix: '+', suffix: '', label: 'Empresas atendidas' },
  { value: 10, prefix: '', suffix: ' días', label: 'Garantía de reposición' },
  { value: 24, prefix: '', suffix: ' hrs', label: 'Respuesta a requisición' },
];

const STACK = [
  {
    icon: Workflow,
    color: 'text-brand-blue',
    glow: '30, 64, 175',
    title: 'n8n — Orquestación',
    body: 'Conecta automáticamente cada etapa del reclutamiento: requisición, atracción, envío de psicometrías, seguimiento por WhatsApp y entrega de terna. Sin pasos manuales perdidos en correos.',
    feature: true,
  },
  {
    icon: Brain,
    color: 'text-brand-orange',
    glow: '249, 115, 22',
    title: 'Modelos IA (OpenAI · Anthropic)',
    body: 'Filtran cientos de currículums contra el perfil real del puesto en minutos, no en días. Solo llegan a entrevista los candidatos con compatibilidad técnica y conductual verificada.',
  },
  {
    icon: ShieldCheck,
    color: 'text-brand-blue',
    glow: '30, 64, 175',
    title: 'Suite Psicométrica',
    body: 'Aplicamos baterías validadas con scoring algorítmico (DISC, 16PF, Moss, Zavic, Lüscher) y entrega de reporte ejecutivo. Tu gerente de RH recibe un PDF claro, no un test crudo.',
  },
  {
    icon: Database,
    color: 'text-brand-orange',
    glow: '249, 115, 22',
    title: 'PostgreSQL + Pinecone',
    body: 'Memoria operativa. Cada candidato evaluado y proceso cerrado queda registrado. Cuando vuelves a contratar para el mismo perfil, partimos de la experiencia previa, no de cero.',
  },
  {
    icon: Cpu,
    color: 'text-brand-blue',
    glow: '30, 64, 175',
    title: 'Stripe + CFDI 4.0',
    body: 'Cobro y facturación transparente. Pago seguro en MXN, facturación electrónica inmediata para México. Cero fricción contable para tu equipo de administración.',
  },
  {
    icon: Plug,
    color: 'text-brand-orange',
    glow: '249, 115, 22',
    title: 'Next.js + Cifrado AES-256',
    body: 'Plataforma propia, datos protegidos. La infraestructura es nuestra. Los datos de tus candidatos viven cifrados, bajo cumplimiento LFPDPPP, sin intermediarios.',
  },
];

export default function HomePage() {
  const reduce = useReducedMotion();
  // Drive hero parallax off the window scroll (no target measurement → no
  // layout warnings). Range is the first ~700px of scroll, i.e. the hero.
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 700], [0, reduce ? 0 : -120]);
  const contentOpacity = useTransform(scrollY, [0, 520], [1, reduce ? 1 : 0]);
  const badgeY = useTransform(scrollY, [0, 700], [0, reduce ? 0 : 70]);

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-brand-orange/40 selection:text-white overflow-x-hidden">
      <ScrollProgress />
      <div className="page-overlay"></div>
      <div className="page-dotgrid"></div>

      {/* 1. HERO — INFRAESTRUCTURA · Cinematic Toluca background */}
      <section className="relative min-h-[92vh] flex items-center pt-32 pb-24 overflow-hidden">
        <HeroToluca />

        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10"
        >
          <div className="max-w-5xl mx-auto space-y-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white text-[11px] font-bold tracking-[0.25em] uppercase"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75 animate-ping"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange shadow-[0_0_12px_2px_rgba(249,115,22,0.6)]"></span>
              </span>
              Agencia de reclutamiento · Corredor Toluca–Lerma–Metepec
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05]"
            >
              Reclutamiento industrial,{' '}
              <span className="text-sheen">operado con tecnología.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              Somos una agencia de reclutamiento especializada en plantas Tier 1 y Tier 2 del corredor Toluca–Lerma–Metepec. Entregamos candidatos evaluados con baterías psicométricas automatizadas, procesos digitales de punta a punta, y la responsabilidad de un equipo que firma cada contratación — no de un software que tienes que aprender a usar.
            </motion.p>

            {/* GUARANTEE SEAL + CTA BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 pt-2"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 order-2 lg:order-1">
                <Magnetic strength={0.4} className="w-full sm:w-auto">
                  <Link href="/empresas" className="block w-full sm:w-auto">
                    <Button variant="primary" size="xl" className="w-full sm:w-auto btn-elev font-bold uppercase tracking-widest text-xs h-14 rounded-xl px-8">
                      Solicitar reclutamiento
                    </Button>
                  </Link>
                </Magnetic>
                <Magnetic strength={0.3} className="w-full sm:w-auto">
                  <Link href="/empresas#proceso" className="block w-full sm:w-auto">
                    <Button variant="outline" size="xl" className="w-full sm:w-auto border-white/20 text-white hover:border-brand-orange hover:text-brand-orange bg-white/5 backdrop-blur-md btn-elev font-bold uppercase tracking-widest text-xs h-14 rounded-xl px-8">
                      Ver cómo trabajamos
                    </Button>
                  </Link>
                </Magnetic>
                <Magnetic strength={0.3} className="w-full sm:w-auto">
                  <a href={waUrl()} target="_blank" rel="noopener noreferrer" className="block w-full sm:w-auto">
                    <Button variant="outline" size="xl" className="w-full sm:w-auto border-[#25D366]/40 text-white hover:border-[#25D366] hover:text-[#25D366] bg-white/5 backdrop-blur-md btn-elev font-bold uppercase tracking-widest text-xs h-14 rounded-xl px-8">
                      Cotizar por WhatsApp
                    </Button>
                  </a>
                </Magnetic>
              </div>

              <motion.div style={{ y: badgeY }} className="order-1 lg:order-2">
                <GuaranteeBadge />
              </motion.div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-slate-400 text-xs font-medium pt-2"
            >
              Diagnóstico inicial sin costo · Respuesta en menos de 24 horas hábiles.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pt-8"
            >
              <p className="divider-dot text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">
                <span>Toluca</span><span>·</span><span>Lerma</span><span>·</span><span>Metepec</span><span>·</span><span>CDMX</span>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          style={{ opacity: contentOpacity }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 pt-1.5">
            <span className="scroll-cue-dot h-1.5 w-1.5 rounded-full bg-white/70"></span>
          </span>
          <ChevronDown size={14} className="text-white/40" />
        </motion.div>
      </section>

      {/* 2. TRUST STRIP — KPIs con conteo animado */}
      <section className="relative py-20 bg-[#0d1422] border-y border-white/5">
        <div className="container mx-auto px-4">
          <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-px max-w-5xl mx-auto rounded-3xl overflow-hidden bg-white/5 border border-white/5">
            {KPIS.map((s, i) => (
              <RevealItem
                key={i}
                className="group relative bg-[#0d1422] px-6 py-10 text-center transition-colors duration-500 hover:bg-white/[0.03]"
              >
                <div className="kpi-num text-5xl md:text-6xl font-black text-white group-hover:text-brand-orange transition-colors duration-500">
                  <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.25em] mt-3">{s.label}</div>
                <div className="mt-4 h-px w-12 bg-white/10 mx-auto group-hover:w-20 group-hover:bg-brand-orange/50 transition-all duration-500"></div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 2.5 CLIENTS · infinite marquee */}
      <ClientsMarquee />

      {/* 2.8 SECCIÓN CANDIDATOS (BOLSA DE TRABAJO Y PORTAL DE TALENTO) */}
      <section className="relative py-24 bg-[#07070f] overflow-hidden border-t border-white/5" aria-labelledby="talento-title">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="container relative mx-auto px-4 max-w-6xl z-10">
          <Reveal className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/5 border border-brand-orange/15 text-brand-orange text-[10px] font-black tracking-[0.2em] uppercase">
              <span className="flex h-1.5 w-1.5 rounded-full bg-brand-orange animate-pulse"></span>
              ¿Buscas empleo? Ecosistema de Talento
            </div>
            <h2 id="talento-title" className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Encuentra tu próximo <span className="text-brand-orange">reto profesional</span>.
            </h2>
            <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
              Conectamos el mejor talento técnico, administrativo y operativo con las plantas de manufactura y empresas más importantes del corredor industrial Toluca-Lerma.
            </p>
          </Reveal>

          <RevealGroup className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto" stagger={0.12}>
            {/* Card 1: Bolsa de Trabajo */}
            <RevealItem className="group/tilt [perspective:1200px]">
              <TiltCard glow="249, 115, 22" className="h-full rounded-[2rem]">
                <Card className="group relative overflow-hidden bg-[#0a0a14]/60 backdrop-blur-2xl border border-white/5 hover:border-brand-orange/30 p-8 sm:p-10 rounded-[2rem] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(249,115,22,0.1)] flex flex-col justify-between h-[360px]">
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-brand-orange/5 rounded-full blur-3xl group-hover:bg-brand-orange/10 transition-colors duration-500"></div>

                  <div className="space-y-6 relative z-20">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-brand-orange flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6">
                      <Search size={26} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-brand-orange transition-colors">Bolsa de Empleo Activa</h3>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed">
                        Explora vacantes reales y validadas directamente con los tomadores de decisiones. Procesos transparentes, ágiles y con feedback claro.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 relative z-20">
                    <Link href="/vacantes">
                      <Button variant="secondary" className="w-full h-13 rounded-xl font-bold text-xs uppercase tracking-widest bg-white/5 border border-white/10 hover:border-brand-orange text-white hover:text-brand-orange hover:bg-brand-orange/5 transition-all flex items-center justify-center gap-2 group/btn">
                        Explorar Vacantes
                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </TiltCard>
            </RevealItem>

            {/* Card 2: Vinculación con IA */}
            <RevealItem className="group/tilt [perspective:1200px]">
              <TiltCard glow="30, 64, 175" className="h-full rounded-[2rem]">
                <Card className="group relative overflow-hidden bg-[#0a0a14]/60 backdrop-blur-2xl border border-white/5 hover:border-brand-blue/30 p-8 sm:p-10 rounded-[2rem] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)] flex flex-col justify-between h-[360px]">
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-brand-blue/5 rounded-full blur-3xl group-hover:bg-brand-blue/10 transition-colors duration-500"></div>

                  <div className="space-y-6 relative z-20">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-brand-blue flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6">
                      <UserPlus size={26} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-brand-blue transition-colors">Vincúlate con Inteligencia Artificial</h3>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed">
                        Registra tu perfil y sube tu CV. Nuestros algoritmos de perfilado avanzado te vincularán automáticamente con vacantes afines a tu experiencia.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 relative z-20">
                    <Link href="/register">
                      <Button variant="secondary" className="w-full h-13 rounded-xl font-bold text-xs uppercase tracking-widest bg-white/5 border border-white/10 hover:border-brand-blue text-white hover:text-brand-blue hover:bg-brand-blue/5 transition-all flex items-center justify-center gap-2 group/btn">
                        Subir mi CV / Perfil
                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </TiltCard>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* 3. STACK TÉCNICO — bento interactivo */}
      <section className="relative py-28 bg-brand-black" aria-labelledby="stack-title">
        <div className="container mx-auto px-4 max-w-7xl">
          <Reveal className="text-center max-w-3xl mx-auto mb-16 space-y-5">
            <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-[11px]">Infraestructura</span>
            <h2 id="stack-title" className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Tecnología que opera detrás de cada proceso.
            </h2>
            <p className="text-slate-400 text-lg font-medium">
              No vendemos software. Lo usamos. Cada herramienta de nuestro stack existe para que tu vacante se cierre más rápido, con candidatos mejor evaluados y con trazabilidad total. Tú recibes el resultado; nosotros operamos la infraestructura.
            </p>
          </Reveal>

          <RevealGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.07}>
            {STACK.map(({ icon: Icon, color, glow, title, body, feature }, i) => (
              <RevealItem key={i} className={`group/tilt [perspective:1200px] ${feature ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                <TiltCard glow={glow} max={6} className="h-full rounded-[1.5rem]">
                  <div className="card-premium h-full p-8 space-y-4 border border-white/5 rounded-[1.5rem]">
                    <div className="flex items-center gap-3 relative z-20">
                      <span className={`${color} transition-transform duration-500 group-hover:scale-110`}>
                        <Icon size={28} />
                      </span>
                      <h3 className="text-xl font-black text-white tracking-tight">{title}</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium relative z-20">{body}</p>
                  </div>
                </TiltCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 4. CTA FINAL — BANDA DE CIERRE */}
      <section className="relative py-28 bg-[#0d1422] border-t border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none -mr-64 -mt-64"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Reveal from="up" distance={36}>
            <div className="conic-border max-w-4xl mx-auto card-premium p-12 sm:p-20 text-center space-y-8 border-brand-orange/20 rounded-[2rem]">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                ¿Qué significa esto para ti?
              </h2>
              <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
                Que recibes un servicio de agencia — con un humano responsable de tu cuenta — entregado con la precisión, velocidad y trazabilidad de una empresa de tecnología. <strong className="text-white">Sin licencias que pagar, sin dashboards que aprender, sin onboarding de software.</strong>
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                <Magnetic strength={0.4}>
                  <Link href="/empresas">
                    <Button variant="primary" size="xl" className="w-full sm:w-auto h-14 rounded-xl px-8 font-bold uppercase tracking-widest text-xs btn-elev shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                      Conoce nuestro proceso paso a paso
                    </Button>
                  </Link>
                </Magnetic>
              </div>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] pt-8">
                Hacke&apos;s Jobs Technologies © {new Date().getFullYear()} · LFPDPPP
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
