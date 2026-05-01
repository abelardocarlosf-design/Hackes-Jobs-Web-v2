'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { Illustration } from '@/components/Illustration';
import { Typewriter } from '@/components/Typewriter';
import { TypewriterHeading } from '@/components/TypewriterHeading';

// metadata moved to layout or generateMetadata

export default function CandidatosPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-black font-sans selection:bg-brand-orange/40 selection:text-white overflow-x-hidden relative">
      {/* Full page dynamic background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/images/candidatos-bg.gif"
          alt=""
          className="w-full h-full object-cover opacity-[0.2]"
        />
        <div className="absolute inset-0 bg-brand-black/20"></div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center pt-32 pb-24 overflow-hidden text-white z-10">

        <div className="container relative mx-auto px-4 z-10 text-center">
          <div className="max-w-5xl mx-auto flex flex-col items-center justify-center space-y-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-brand-black/80 backdrop-blur-md text-white text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl animate-in fade-in slide-in-from-top-4 duration-1000">
              <span className="flex h-2 w-2 rounded-full bg-brand-blue animate-pulse" aria-hidden="true"></span>
              Talento Extraordinario en México
            </div>

            <h1 className="text-6xl sm:text-7xl md:text-[6.5rem] font-black tracking-tighter text-white leading-[1.1] drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex flex-col items-center gap-2">
              <span className="leading-none"><Typewriter text="Tu Próximo Gran" speed={70} delay={400} /></span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-blue leading-[1.2] py-2">
                Reto Profesional.
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-300 max-w-2xl leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              No eres un currículum más. En Hacke's Jobs, conectamos tu potencial real y tus habilidades únicas con las empresas que están transformando el mercado.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
              <Link href="/register?role=candidate">
                <Button variant="secondary" size="xl" className="w-full sm:w-auto shadow-orange/60">
                  Crear mi Perfil Profesional
                </Button>
              </Link>
              <Link href="/vacantes">
                <Button variant="outline" size="xl" className="w-full sm:w-auto border-white/40 text-white hover:border-brand-orange hover:text-brand-orange bg-white/10 backdrop-blur-md">
                  Ver Vacantes Disponibles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROCESS SECTION - STITCH STEPS */}
      <section className="relative py-32 z-20 overflow-hidden">
        <div className="container relative mx-auto px-4 max-w-6xl z-10">
          <div className="text-center mb-24 space-y-6">
            <span className="text-brand-blue font-black tracking-[0.4em] uppercase text-xs">Tu Camino al Éxito</span>
            <h2 className="text-5xl md:text-[5rem] font-black tracking-tighter leading-none text-white uppercase">¿Cómo aplicar con nosotros?</h2>
            <div className="w-24 h-2 bg-brand-orange mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-white/10 -z-10"></div>
            {[
              { n: '01', t: 'Procesos Transparentes', d: 'Conoce el estado real de tus aplicaciones en todo momento a través de tu portal personalizado.' },
              { n: '02', t: 'Evaluaciones Inteligentes', d: 'Demuestra tu verdadero nivel con nuestras pruebas adaptativas, diseñadas para ser justas, rápidas y libres de sesgos.' },
              { n: '03', t: 'Match de ADN Corporativo', d: 'Te conectamos exclusivamente con culturas organizacionales donde realmente puedas brillar y escalar profesionalmente.' }
            ].map((step, i) => (
              <div key={i} className="glass-card p-10 space-y-6 text-center group hover:bg-white/10 transition-all duration-500">
                <div className="w-24 h-24 bg-white/10 border border-white/10 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black mx-auto transition-all duration-500 group-hover:bg-brand-blue group-hover:text-white group-hover:scale-110 shadow-2xl">
                  {step.n}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">{step.t}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed mx-auto">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CTA & SOCIAL PROOF */}
      <section className="relative py-32 overflow-hidden pb-60">
        <div className="container relative mx-auto px-4 z-10">
          <div className="max-w-6xl mx-auto overflow-hidden rounded-[4rem] bg-brand-orange shadow-2xl shadow-orange-500/40 border border-white/10 transition-transform hover:scale-[1.01] duration-700">
            <div className="p-12 sm:p-24 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="relative z-10 space-y-8 text-center md:text-left">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.3)]">¿Listo para tu <br /> próximo gran reto?</h2>
                <p className="text-xl md:text-2xl font-medium text-white max-w-xl">
                  Nuestra bolsa de trabajo se actualiza diariamente con oportunidades en las mejores empresas de México.
                </p>
              </div>
              <Link href="/vacantes" className="relative z-10">
                <Button variant="dark" size="xl" className="h-24 px-16 text-2xl shadow-premium hover:scale-110 bg-brand-black text-white hover:bg-zinc-800 border-0 rounded-3xl">
                  Explorar Vacantes
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-20 text-center space-y-4">
            <p className="text-slate-500 font-black uppercase tracking-[0.5em] text-[10px]">Actualizado hoy por el equipo de Hacke&apos;s Jobs Platform © {new Date().getFullYear()}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
