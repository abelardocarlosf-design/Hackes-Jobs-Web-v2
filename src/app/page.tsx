'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import {
  Brain,
  Workflow,
  Factory,
  MapPin,
  Database,
  Cpu,
  ShieldCheck,
  Plug,
  ArrowRight,
} from 'lucide-react';
import { HeroToluca } from '@/components/brand/HeroToluca';
import { TechStackGrid } from '@/components/brand/TechStackGrid';
import { ClientsMarquee } from '@/components/brand/ClientsMarquee';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleGrowthPlan = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://hackesjobs-n8n.3hrktu.easypanel.host/webhook/checkout-growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'Plan Growth',
          action: 'CHECKOUT_START',
          timestamp: new Date().toISOString(),
          source: 'home_page'
        })
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => router.push('/exito'), 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-brand-orange/40 selection:text-white overflow-x-hidden">
      <div className="page-overlay"></div>
      <div className="page-dotgrid"></div>

      {/* 1. HERO — INFRAESTRUCTURA · Cinematic Toluca background */}
      <section className="relative min-h-[92vh] flex items-center pt-32 pb-20 overflow-hidden">
        <HeroToluca />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-5xl mx-auto space-y-10 text-center">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-bold tracking-[0.25em] uppercase reveal-on-load">
              <span className="flex h-2 w-2 rounded-full bg-brand-orange shadow-[0_0_12px_2px_rgba(249,115,22,0.6)]"></span>
              Infraestructura HR-Tech &amp; B2B Automation
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05] reveal-on-load reveal-delay-100">
              Infraestructura tecnológica para <span className="text-brand-orange">Recursos Humanos</span> y <span className="text-brand-blue">ventas B2B</span> en la industria mexicana.
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium reveal-on-load reveal-delay-200">
              Desplegamos sistemas automatizados de evaluación psicométrica y prospección B2B para plantas Tier&nbsp;1 y Tier&nbsp;2 del corredor Toluca–Lerma–Metepec–CDMX. No somos una agencia: somos la plataforma que opera detrás de tu operación.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 reveal-on-load reveal-delay-300">
              <Link href="/empresas" className="w-full sm:w-auto">
                <Button variant="secondary" size="xl" className="w-full sm:w-auto btn-elev">
                  Solicitar acceso a la plataforma
                </Button>
              </Link>
              <Link href="/precios" className="w-full sm:w-auto">
                <Button variant="outline" size="xl" className="w-full sm:w-auto border-white/20 text-white hover:border-brand-orange hover:text-brand-orange bg-white/5 btn-elev">
                  Ver productos y precios
                </Button>
              </Link>
            </div>

            <div className="pt-12 reveal-on-load reveal-delay-400">
              <p className="divider-dot text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">
                <span>Toluca</span><span>·</span><span>Lerma</span><span>·</span><span>Metepec</span><span>·</span><span>CDMX</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP — datos operacionales */}
      <section className="relative py-20 bg-[#0d1422] border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
            {[
              { v: '+500', l: 'Evaluaciones procesadas' },
              { v: '+50', l: 'Empresas conectadas' },
              { v: '4', l: 'Zonas industriales atendidas' },
              { v: '7 días', l: 'SLA de despliegue' },
            ].map((s, i) => (
              <div
                key={i}
                className="text-center md:text-left group relative"
                style={{ animation: `reveal-up 700ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms both` }}
              >
                <div className="kpi-num text-5xl md:text-6xl font-black text-white group-hover:text-brand-orange transition-colors duration-500">{s.v}</div>
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.25em] mt-3">{s.l}</div>
                <div className="mt-4 h-px w-12 bg-white/10 mx-auto md:mx-0 group-hover:w-16 group-hover:bg-brand-orange/40 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.5 CLIENTS · infinite marquee */}
      <ClientsMarquee />

      {/* 3. PRODUCTOS — layout asimétrico premium */}
      <section className="relative py-32 bg-brand-black overflow-hidden" aria-labelledby="productos-title">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-brand-orange/[0.04] blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full bg-brand-blue/[0.06] blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto mb-20 grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7 space-y-4">
              <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-[11px]">Nuestra plataforma</span>
              <h2 id="productos-title" className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.05]">
                Dos productos.<br/>
                <span className="text-slate-500">Una sola</span> <span className="text-brand-orange">infraestructura</span>.
              </h2>
            </div>
            <div className="md:col-span-5 md:pl-8 md:border-l md:border-white/10">
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Sistemas que se instalan, se integran y operan de forma continua dentro de tus procesos. Sin consultorías eternas ni "pruebas piloto" sin métricas.
              </p>
            </div>
          </div>

          {/* Grid asimétrico 7/5 */}
          <div className="grid lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
            {/* Producto 1 — Psicometrías (más grande) */}
            <article className="lg:col-span-7 card-premium p-10 sm:p-14 flex flex-col gap-10 min-h-[480px]" style={{ ['--accent' as any]: 'rgb(249,115,22)' }}>
              <div className="flex items-start justify-between gap-6">
                <div className="w-16 h-16 bg-brand-orange/10 text-brand-orange rounded-2xl flex items-center justify-center border border-brand-orange/20 shrink-0">
                  <Brain size={32} strokeWidth={2} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-3 py-1.5 rounded-full">Producto 01</span>
              </div>

              <div className="space-y-5 flex-1">
                <h3 className="accent-bar text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">Suite Psicométrica Integrada</h3>
                <p className="text-slate-400 font-medium leading-relaxed text-lg">
                  Catálogo de evaluaciones validadas (DISC, Moss, Zavic, Terman, Raven, MMPI-2, 16PF, Kostick, Allport, Lüscher) con cobro Stripe en MXN, scoring automático y reporte PDF.
                </p>
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                  <div>
                    <div className="kpi-num text-2xl font-black text-white">$349</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Nivel base</div>
                  </div>
                  <div>
                    <div className="kpi-num text-2xl font-black text-white">$519</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Avanzado</div>
                  </div>
                  <div>
                    <div className="kpi-num text-2xl font-black text-brand-orange">$867</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Clínico</div>
                  </div>
                </div>
              </div>

              <Link href="/psicometrias" className="link-underline inline-flex items-center text-brand-orange font-bold text-sm uppercase tracking-widest self-start">
                Ver catálogo completo <ArrowRight className="ml-2" size={16} />
              </Link>
            </article>

            {/* Producto 2 — B2B n8n (más angosto) */}
            <article className="lg:col-span-5 card-premium card-premium-blue p-10 sm:p-12 flex flex-col gap-8 min-h-[480px]" style={{ ['--accent' as any]: 'rgb(30,64,175)' }}>
              <div className="flex items-start justify-between gap-6">
                <div className="w-16 h-16 bg-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center border border-brand-blue/20 shrink-0">
                  <Workflow size={32} strokeWidth={2} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-3 py-1.5 rounded-full">Producto 02</span>
              </div>

              <div className="space-y-5 flex-1">
                <h3 className="accent-bar text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">Automatización B2B con n8n</h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  Workflows propios de prospección y nurturing sobre n8n autoalojado. Integramos LinkedIn, correo, CRM y WhatsApp en una sola orquestación medible.
                </p>
                <ul className="text-sm text-slate-300 space-y-3 pt-4 border-t border-white/5">
                  {[
                    'Workflows custom, no plantillas',
                    'Integración con tu CRM y ATS',
                    'Setup + suscripción mensual'
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-brand-blue mt-1">→</span><span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/empresas" className="link-underline inline-flex items-center text-brand-blue font-bold text-sm uppercase tracking-widest self-start">
                Solicitar demo <ArrowRight className="ml-2" size={16} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* 4. FOCO SECTORIAL — Industria + zonas */}
      <section className="relative py-28 bg-[#0d1422] border-y border-white/5" aria-labelledby="sector-title">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
            <div className="space-y-8">
              <span className="text-brand-orange font-bold tracking-[0.3em] uppercase text-[11px]">Foco sectorial</span>
              <h2 id="sector-title" className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Construido para la <span className="text-brand-orange">industria mexicana</span>.
              </h2>
              <p className="text-slate-300 text-lg font-medium leading-relaxed">
                Operamos con empresas de manufactura <strong className="text-white">Tier 1 y Tier 2</strong> en el corredor industrial más activo del país. No es lenguaje genérico: nuestros flujos están diseñados para los volúmenes, rotación y compliance del sector.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {['Toluca', 'Lerma', 'Metepec', 'CDMX'].map((zona) => (
                  <div key={zona} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-bold">
                    <MapPin size={14} className="text-brand-orange" /> {zona}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Factory, t: 'Manufactura Tier 1 / Tier 2', d: 'Plantas automotrices, autopartes, electrónica y consumo.' },
                { icon: ShieldCheck, t: 'Compliance LFPDPPP', d: 'Tratamiento de datos personales conforme a la ley mexicana.' },
                { icon: Database, t: 'Volúmenes industriales', d: 'Procesos diseñados para evaluación masiva y rotación operativa.' },
                { icon: Plug, t: 'Integración con tu stack', d: 'Conexión con tu ATS, CRM y nómina existentes.' },
              ].map((b, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-3">
                  <b.icon className="text-brand-blue" size={24} />
                  <h4 className="text-white font-bold text-sm">{b.t}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. STACK TÉCNICO */}
      <section className="relative py-28 bg-brand-black" aria-labelledby="stack-title">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
            <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-[11px]">Stack &amp; integraciones</span>
            <h2 id="stack-title" className="text-4xl md:text-5xl font-black text-white tracking-tight">Construido sobre tecnología verificable.</h2>
            <p className="text-slate-400 text-lg font-medium">No vendemos cajas negras. Estos son los componentes reales que operan tu infraestructura.</p>
          </div>

          <TechStackGrid />

          <div className="mt-12 flex flex-wrap justify-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"><Cpu size={12} className="text-brand-orange" /> API Access disponible</span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"><ShieldCheck size={12} className="text-brand-orange" /> Cifrado TLS 1.3 / AES-256</span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"><Plug size={12} className="text-brand-orange" /> SSO SAML 2.0 (Enterprise)</span>
          </div>
        </div>
      </section>

      {/* 6. PRICING — resumen, detalle en /precios */}
      <section className="relative py-28 bg-[#0d1422] border-t border-white/5" aria-labelledby="pricing-title">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
            <span className="text-brand-orange font-bold tracking-[0.3em] uppercase text-[11px]">Modelo comercial</span>
            <h2 id="pricing-title" className="text-4xl md:text-5xl font-black text-white tracking-tight">Acceso por producto o por plataforma.</h2>
            <p className="text-slate-400 text-lg font-medium">Comienza con un test individual o despliega la suite completa con suscripción mensual.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-stretch">
            <Card className="card-premium p-8 flex flex-col h-full">
              <h3 className="text-xl font-black text-white tracking-tight mb-1">Pago por test</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-6">Suite Psicométrica</p>
              <div className="text-3xl font-black text-white mb-1">desde $349<span className="text-base text-slate-400 font-medium ml-1">MXN</span></div>
              <p className="text-xs text-slate-500 mb-6">Tarifas: $349 · $519 · $867 MXN según test</p>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-brand-orange mt-0.5">•</span>
                  <span>Acceso a suite clínica y laboral (MMPI-2, Lüscher, 16PF y más).</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-brand-orange mt-0.5">•</span>
                  <span>Motor de validación estricta (garantiza pruebas 100% completadas).</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-brand-orange mt-0.5">•</span>
                  <span>Generación automatizada de reportes algorítmicos en PDF.</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-brand-orange mt-0.5">•</span>
                  <span>Uso on-demand con activación instantánea vía Stripe.</span>
                </li>
              </ul>
              <Link href="/psicometrias" className="mt-auto">
                <Button variant="outline" className="w-full border-white/20 text-white hover:border-brand-orange hover:text-brand-orange h-12 rounded-xl font-bold text-xs uppercase tracking-widest bg-white/5">Ver catálogo</Button>
              </Link>
            </Card>

            <Card className="p-8 flex flex-col bg-brand-blue/10 border-2 border-brand-blue rounded-3xl relative lg:-translate-y-2 h-full !overflow-visible shadow-[0_0_40px_-10px_rgba(30,64,175,0.3)]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-blue text-white px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg whitespace-nowrap z-10">Más popular</div>
              <h3 className="text-xl font-black text-white tracking-tight mb-1">Plan Growth</h3>
              <p className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.25em] mb-6">Pymes · Posiciones operativas y técnicas</p>
              <div className="text-3xl font-black text-white mb-1">$9,799<span className="text-base text-slate-300 font-medium ml-1">MXN</span></div>
              <p className="text-xs text-slate-400 mb-6">Proyecto completo · IVA no incluido</p>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-white">
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-brand-blue mt-0.5">•</span>
                  <span>Proceso End-to-End para 3 posiciones (Operativas, Técnicas o Administrativas).</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-brand-blue mt-0.5">•</span>
                  <span>Atracción estratégica y filtrado en bolsas de empleo.</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-brand-blue mt-0.5">•</span>
                  <span>Batería psicométrica automatizada (DISC, 16PF, Moss, Zavic) por candidato.</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-brand-blue mt-0.5">•</span>
                  <span>Terna final con reporte ejecutivo de compatibilidad.</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-brand-blue mt-0.5">•</span>
                  <span>Garantía de Continuidad Operativa (Reposición en 10 días naturales).</span>
                </li>
              </ul>
              <Button
                variant="primary"
                className={`w-full mt-auto h-12 rounded-xl font-bold text-xs uppercase tracking-widest ${isSuccess ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : ''}`}
                onClick={handleGrowthPlan}
                disabled={isLoading || isSuccess}
              >
                {isLoading ? 'Procesando...' : isSuccess ? '¡Solicitud enviada!' : 'Activar Plan Growth'}
              </Button>
            </Card>

            <Card className="card-premium p-8 flex flex-col h-full">
              <h3 className="text-xl font-black text-white tracking-tight mb-1">Enterprise</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-6">Operaciones industriales</p>
              <div className="text-3xl font-black text-white mb-1">A medida</div>
              <p className="text-xs text-slate-500 mb-6">Para plantas Tier 1 y operación masiva</p>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-white mt-0.5">•</span>
                  <span>Reclutamiento masivo para nearshoring y corredores industriales.</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-white mt-0.5">•</span>
                  <span>Orquestación de workflows ilimitados y prospección B2B automatizada.</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-white mt-0.5">•</span>
                  <span>Infraestructura dedicada con seguridad enterprise (SSO SAML 2.0).</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-white mt-0.5">•</span>
                  <span>Integración de datos vía API directo a su ERP o ATS corporativo.</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-white mt-0.5">•</span>
                  <span>Atención VIP con Key Account Manager asignado.</span>
                </li>
              </ul>
              <Link href="/contacto" className="mt-auto">
                <Button variant="outline" className="w-full border-white/20 text-white hover:border-brand-orange hover:text-brand-orange h-12 rounded-xl font-bold text-xs uppercase tracking-widest bg-white/5">Hablar con ventas</Button>
              </Link>
            </Card>
          </div>

          <div className="text-center mt-10">
            <Link href="/precios" className="text-slate-400 hover:text-brand-orange text-sm font-medium underline underline-offset-4 transition-colors">
              Ver desglose completo de precios →
            </Link>
          </div>
        </div>
      </section>

      {/* 7. CTA FINAL — sobrio */}
      <section className="relative py-28 bg-brand-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto card-premium p-12 sm:p-20 text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              ¿Listo para conectar tu operación a la plataforma?
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium">
              Agenda una sesión de 30 minutos. Revisamos tus flujos actuales y proponemos qué se automatiza primero.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <Link href="/empresas">
                <Button variant="secondary" size="xl">Solicitar demo técnica</Button>
              </Link>
              <Link href="/contacto">
                <Button variant="outline" size="xl" className="border-white/20 text-white hover:bg-white/5">
                  Hablar con un consultor
                </Button>
              </Link>
            </div>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] pt-6">
              Hacke&apos;s Jobs Technologies © {new Date().getFullYear()} · Toluca · Lerma · Metepec · CDMX
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
