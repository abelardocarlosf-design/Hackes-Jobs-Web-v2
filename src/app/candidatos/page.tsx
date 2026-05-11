'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';
import { Eye, Brain, Network, ArrowRight } from 'lucide-react';

export default function CandidatosPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-black font-sans selection:bg-brand-orange/40 selection:text-white overflow-x-hidden relative">
      <div className="page-overlay"></div>
      <div className="page-dotgrid"></div>

      {/* 1. HERO */}
      <section className="relative min-h-[80vh] flex items-center pt-32 pb-20 text-white z-10">
        <div className="container relative mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-bold tracking-[0.25em] uppercase">
              <span className="flex h-2 w-2 rounded-full bg-brand-blue"></span>
              Para profesionales en México
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05]">
              Procesos de selección <span className="text-brand-orange">transparentes y técnicos</span>.
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              Aplicas a vacantes en empresas industriales que usan nuestra plataforma. Tus evaluaciones tienen scoring objetivo y feedback estructurado, no decisiones a ciegas.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/register?role=candidate">
                <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                  Crear perfil
                </Button>
              </Link>
              <Link href="/vacantes">
                <Button variant="outline" size="xl" className="w-full sm:w-auto border-white/20 text-white hover:border-brand-orange hover:text-brand-orange bg-white/5">
                  Ver vacantes activas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROCESO */}
      <section className="relative py-24 z-10">
        <div className="container relative mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-[11px]">Cómo aplicas</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">Tres pasos. Cero opacidad.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Eye, t: 'Visibilidad total', d: 'Conoces el estado real de tus aplicaciones desde tu portal: en revisión, evaluación, entrevista o decisión.' },
              { icon: Brain, t: 'Evaluación objetiva', d: 'Las pruebas adaptativas (CAT) miden tu nivel real con scoring matemático, no impresiones subjetivas.' },
              { icon: Network, t: 'Match técnico', d: 'Te presentamos a empresas cuyo perfil técnico y cultural coincide con el tuyo, no a todas las que pagan más.' }
            ].map((step, i) => (
              <div key={i} className="card-premium p-8 space-y-5">
                <step.icon className="text-brand-orange" size={28} />
                <h3 className="text-xl font-black text-white tracking-tight">{step.t}</h3>
                <p className="text-slate-400 font-medium leading-relaxed text-sm">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CTA */}
      <section className="relative py-24 z-10">
        <div className="container relative mx-auto px-4 max-w-5xl">
          <div className="card-premium p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">Bolsa de trabajo activa.</h2>
              <p className="text-slate-300 text-lg font-medium max-w-xl">
                Vacantes en plantas industriales y equipos B2B del corredor Toluca–Lerma–Metepec–CDMX. Se actualiza diariamente.
              </p>
            </div>
            <Link href="/vacantes">
              <Button variant="secondary" size="xl">
                Ver vacantes <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>

          <p className="text-center text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-12">
            Hacke&apos;s Jobs Technologies · {new Date().getFullYear()}
          </p>
        </div>
      </section>
    </div>
  );
}
