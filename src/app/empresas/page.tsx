'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import {
  ArrowRight,
  Workflow,
  Brain,
  Database,
  Plug,
  ShieldCheck,
  Factory,
  Clock,
  LineChart,
} from 'lucide-react';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export default function EmpresasPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-black font-sans selection:bg-brand-orange/40 selection:text-white overflow-x-hidden relative">
      <div className="page-overlay"></div>
      <div className="page-dotgrid"></div>

      <main className="flex-grow relative z-10">
        {/* 1. HERO */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-bold tracking-[0.25em] uppercase">
                <span className="flex h-2 w-2 rounded-full bg-brand-blue"></span>
                Para empresas industriales
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
                Conecta tu operación de RRHH y ventas a una <span className="text-brand-orange">plataforma única</span>.
              </h1>

              <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
                Hacke's Jobs Technologies es la infraestructura que centraliza evaluación de candidatos, prospección B2B y reporting en un solo sistema. Desplegamos workflows n8n personalizados sobre tus procesos actuales en menos de 7 días.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/empresas/requisicion">
                  <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                    Solicitar demo técnica
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </Link>
                <WhatsAppButton className="w-full sm:w-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. PROBLEMA */}
        <section className="relative py-24 text-white">
          <div className="container relative mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
              <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-[11px]">El problema operativo</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Tu operación está fragmentada entre 6 herramientas.</h2>
              <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
                LinkedIn, hojas de cálculo, formularios, correo, WhatsApp, CRM. Los datos viven en silos y nadie ve el panorama completo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: "Sin trazabilidad",
                  desc: "No sabes qué candidato pasó por qué evaluación, ni qué cuenta B2B fue contactada y cuándo.",
                  icon: Database
                },
                {
                  title: "Sin escala",
                  desc: "Cada proceso manual te cuesta horas de un analista que podría estar tomando decisiones.",
                  icon: Clock
                },
                {
                  title: "Sin medición",
                  desc: "El ROI de cada vacante o flujo de prospección se calcula a posteriori, no en tiempo real.",
                  icon: LineChart
                }
              ].map((item, i) => (
                <div key={i} className="card-premium p-8 space-y-4">
                  <item.icon className="text-brand-orange" size={28} />
                  <h3 className="text-xl font-black text-white tracking-tight">{item.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. SOLUCIÓN - PROCESO */}
        <section className="relative py-24">
          <div className="container relative mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
              <span className="text-brand-orange font-bold tracking-[0.3em] uppercase text-[11px]">Cómo funciona</span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Despliegue en 4 fases. <span className="text-brand-blue">Sin reinstalar tu stack.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { step: "01", title: "Diagnóstico", desc: "Revisamos tus flujos actuales de RRHH y ventas. Identificamos qué se automatiza primero." },
                { step: "02", title: "Diseño", desc: "Especificamos los workflows n8n y las evaluaciones psicométricas relevantes para tus puestos." },
                { step: "03", title: "Conexión", desc: "Integramos con tu CRM, ATS, LinkedIn, correo y WhatsApp mediante credenciales seguras." },
                { step: "04", title: "Operación", desc: "La plataforma queda activa con monitoreo continuo, alertas y reporting ejecutivo." }
              ].map((p, i) => (
                <div key={i} className="card-premium p-6 space-y-3">
                  <div className="text-3xl font-black text-brand-blue tracking-tight">{p.step}</div>
                  <h4 className="text-lg font-black text-white tracking-tight">{p.title}</h4>
                  <p className="text-slate-400 font-medium text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. PRODUCTOS */}
        <section className="relative py-24">
          <div className="container relative mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-[11px]">Qué desplegamos</span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">Dos módulos. Una sola plataforma.</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card className="card-premium p-10">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-xl bg-brand-orange/10 border border-brand-orange/20 text-brand-orange flex items-center justify-center">
                    <Brain size={26} />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Suite Psicométrica Integrada</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    Catálogo de pruebas validadas con scoring automático, motor CAT (Pruebas Adaptativas) basado en IRT, y entrega de reportes PDF firmados digitalmente. Cobro en MXN vía Stripe.
                  </p>
                  <Link href="/psicometrias" className="inline-flex items-center text-brand-orange font-bold text-sm hover:translate-x-1 transition-transform">
                    Ver catálogo <ArrowRight className="ml-2" size={16} />
                  </Link>
                </div>
              </Card>

              <Card className="card-premium card-premium-blue p-10">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-xl bg-brand-blue/10 border border-brand-blue/20 text-brand-blue flex items-center justify-center">
                    <Workflow size={26} />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Workflows B2B con n8n</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    Flujos de prospección, calificación de leads, nurturing por correo y secuencias de WhatsApp, todos orquestados sobre n8n autoalojado. Métricas en tiempo real desde tu dashboard.
                  </p>
                  <Link href="/precios" className="inline-flex items-center text-brand-blue font-bold text-sm hover:translate-x-1 transition-transform">
                    Ver planes <ArrowRight className="ml-2" size={16} />
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* 5. FOCO INDUSTRIAL */}
        <section className="relative py-24">
          <div className="container relative mx-auto px-4 max-w-6xl">
            <div className="card-premium p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Factory className="text-brand-orange" size={36} />
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                  Diseñado para plantas <span className="text-brand-orange">Tier 1 y Tier 2</span>.
                </h2>
                <p className="text-slate-300 text-lg font-medium leading-relaxed">
                  Nuestros flujos se ajustan a la realidad operativa del corredor industrial Toluca–Lerma–Metepec–CDMX: volúmenes altos, rotación operativa, evaluaciones en piso y compliance LFPDPPP.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Toluca', 'Lerma', 'Metepec', 'CDMX'].map((z) => (
                    <span key={z} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold">{z}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: ShieldCheck, t: 'Compliance', d: 'LFPDPPP · AES-256' },
                  { icon: Plug, t: 'Integración', d: 'CRM · ATS · Nómina' },
                  { icon: Database, t: 'Multi-tenant', d: 'Aislamiento por cliente' },
                  { icon: Clock, t: 'SLA', d: '7 días de despliegue' },
                ].map((b, i) => (
                  <div key={i} className="card-premium p-5 space-y-2">
                    <b.icon className="text-brand-blue" size={20} />
                    <div className="text-white font-bold text-sm">{b.t}</div>
                    <div className="text-slate-500 text-xs font-medium">{b.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. CASOS REALES */}
        <section className="relative py-24">
          <div className="container relative mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 space-y-4">
                <span className="text-brand-orange font-bold tracking-[0.3em] uppercase text-[11px]">Casos de uso</span>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Resultados medibles, no aspiracionales.</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { q: "Reducimos el ciclo de evaluación de candidatos operativos de 5 días a 24 horas con la Suite Psicométrica automatizada.", n: "Operación industrial · Toluca", p: "Manufactura Tier 2" },
                  { q: "El flujo n8n de prospección B2B nos generó pipeline calificado sin sumar headcount al equipo comercial.", n: "Equipo de ventas · CDMX", p: "Servicios industriales" }
                ].map((t, i) => (
                  <div key={i} className="card-premium p-8 space-y-6">
                    <p className="text-lg text-slate-200 font-medium leading-relaxed">"{t.q}"</p>
                    <div>
                      <div className="font-bold text-white text-sm">{t.n}</div>
                      <div className="text-brand-blue text-[10px] font-bold uppercase tracking-[0.25em] mt-1">{t.p}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. CTA */}
        <section className="relative py-28">
          <div className="container relative mx-auto px-4 max-w-4xl text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white">
              30 minutos para mapear tu operación.
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium">
              Te decimos qué se puede automatizar, en qué orden y con qué retorno esperado. Sin compromiso.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/empresas/requisicion">
                <Button variant="secondary" size="xl" className="px-10">
                  Agendar diagnóstico
                </Button>
              </Link>
              <Link href="/contacto">
                <Button variant="outline" size="xl" className="border-white/20 text-white hover:bg-white/5">
                  Hablar con un consultor
                </Button>
              </Link>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
              Cumplimiento LFPDPPP · Datos cifrados · Multi-tenant
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
