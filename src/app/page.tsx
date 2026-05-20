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
  Search,
  UserPlus,
} from 'lucide-react';
import { HeroToluca } from '@/components/brand/HeroToluca';
import { TechStackGrid } from '@/components/brand/TechStackGrid';
import { ClientsMarquee } from '@/components/brand/ClientsMarquee';
import { GuaranteeBadge } from '@/components/brand/GuaranteeBadge';

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
              Agencia de reclutamiento · Corredor Toluca–Lerma–Metepec
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05] reveal-on-load reveal-delay-100">
              Reclutamiento industrial, <span className="text-brand-orange">operado con tecnología.</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium reveal-on-load reveal-delay-200">
              Somos una agencia de reclutamiento especializada en plantas Tier 1 y Tier 2 del corredor Toluca–Lerma–Metepec. Entregamos candidatos evaluados con baterías psicométricas automatizadas, procesos digitales de punta a punta, y la responsabilidad de un equipo que firma cada contratación — no de un software que tienes que aprender a usar.
            </p>

            {/* GUARANTEE SEAL + CTA BUTTONS — Desktop: side by side / Mobile: stacked */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 pt-2 reveal-on-load reveal-delay-300">
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 order-2 lg:order-1">
                <Link href="/empresas" className="w-full sm:w-auto">
                  <Button variant="primary" size="xl" className="w-full sm:w-auto btn-elev font-bold uppercase tracking-widest text-xs h-14 rounded-xl px-8">
                    Solicitar reclutamiento
                  </Button>
                </Link>
                <Link href="/empresas#proceso" className="w-full sm:w-auto">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto border-white/20 text-white hover:border-brand-orange hover:text-brand-orange bg-white/5 btn-elev font-bold uppercase tracking-widest text-xs h-14 rounded-xl px-8">
                    Ver cómo trabajamos
                  </Button>
                </Link>
              </div>

              {/* Guarantee Medallion */}
              <div className="order-1 lg:order-2">
                <GuaranteeBadge />
              </div>
            </div>
            
            <p className="text-slate-400 text-xs font-medium pt-2 reveal-on-load reveal-delay-400">
              Diagnóstico inicial sin costo · Respuesta en menos de 24 horas hábiles.
            </p>

            <div className="pt-8 reveal-on-load reveal-delay-400">
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
              { v: '+50', l: 'Empresas atendidas' },
              { v: '10 días', l: 'Garantía de reposición' },
              { v: '24 hrs', l: 'Respuesta a requisición' },
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

      {/* 2.8 SECCIÓN CANDIDATOS (BOLSA DE TRABAJO Y PORTAL DE TALENTO) */}
      <section className="relative py-24 bg-[#07070f] overflow-hidden border-t border-white/5" aria-labelledby="talento-title">
        {/* Glow decorative element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[140px] pointer-events-none"></div>
        
        <div className="container relative mx-auto px-4 max-w-6xl z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
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
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card 1: Bolsa de Trabajo */}
            <Card className="group relative overflow-hidden bg-[#0a0a14]/60 backdrop-blur-2xl border border-white/5 hover:border-brand-orange/30 p-8 sm:p-10 rounded-[2rem] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(249,115,22,0.1)] flex flex-col justify-between h-[360px]">
              {/* Card Glow */}
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-brand-orange/5 rounded-full blur-3xl group-hover:bg-brand-orange/10 transition-colors duration-500"></div>
              
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-brand-orange flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-all duration-500">
                  <Search size={26} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-brand-orange transition-colors">Bolsa de Empleo Activa</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    Explora vacantes reales y validadas directamente con los tomadores de decisiones. Procesos transparentes, ágiles y con feedback claro.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/vacantes">
                  <Button variant="secondary" className="w-full h-13 rounded-xl font-bold text-xs uppercase tracking-widest bg-white/5 border border-white/10 hover:border-brand-orange text-white hover:text-brand-orange hover:bg-brand-orange/5 transition-all flex items-center justify-center gap-2 group/btn">
                    Explorar Vacantes
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Card 2: Vinculación con IA */}
            <Card className="group relative overflow-hidden bg-[#0a0a14]/60 backdrop-blur-2xl border border-white/5 hover:border-brand-blue/30 p-8 sm:p-10 rounded-[2rem] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)] flex flex-col justify-between h-[360px]">
              {/* Card Glow */}
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-brand-blue/5 rounded-full blur-3xl group-hover:bg-brand-blue/10 transition-colors duration-500"></div>

              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-brand-blue flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                  <UserPlus size={26} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-brand-blue transition-colors">Vincúlate con Inteligencia Artificial</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    Registra tu perfil y sube tu CV. Nuestros algoritmos de perfilado avanzado te vincularán automáticamente con vacantes afines a tu experiencia.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/register">
                  <Button variant="secondary" className="w-full h-13 rounded-xl font-bold text-xs uppercase tracking-widest bg-white/5 border border-white/10 hover:border-brand-blue text-white hover:text-brand-blue hover:bg-brand-blue/5 transition-all flex items-center justify-center gap-2 group/btn">
                    Subir mi CV / Perfil
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. STACK TÉCNICO (NUEVO MODELO DE TARJETAS) */}
      <section className="relative py-28 bg-brand-black" aria-labelledby="stack-title">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
            <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-[11px]">Infraestructura</span>
            <h2 id="stack-title" className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Tecnología que opera detrás de cada proceso.
            </h2>
            <p className="text-slate-400 text-lg font-medium">
              No vendemos software. Lo usamos. Cada herramienta de nuestro stack existe para que tu vacante se cierre más rápido, con candidatos mejor evaluados y con trazabilidad total. Tú recibes el resultado; nosotros operamos la infraestructura.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="card-premium p-8 space-y-4 border border-white/5">
              <div className="flex items-center gap-3">
                <Workflow className="text-brand-blue" size={28} />
                <h3 className="text-xl font-black text-white tracking-tight">n8n — Orquestación</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Conecta automáticamente cada etapa del reclutamiento: requisición, atracción, envío de psicometrías, seguimiento por WhatsApp y entrega de terna. Sin pasos manuales perdidos en correos.
              </p>
            </Card>

            <Card className="card-premium p-8 space-y-4 border border-white/5">
              <div className="flex items-center gap-3">
                <Brain className="text-brand-orange" size={28} />
                <h3 className="text-xl font-black text-white tracking-tight">Modelos IA (OpenAI · Anthropic)</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Filtran cientos de currículums contra el perfil real del puesto en minutos, no en días. Solo llegan a entrevista los candidatos con compatibilidad técnica y conductual verificada.
              </p>
            </Card>

            <Card className="card-premium p-8 space-y-4 border border-white/5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-brand-blue" size={28} />
                <h3 className="text-xl font-black text-white tracking-tight">Suite Psicométrica</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Aplicamos baterías validadas con scoring algorítmico (DISC, 16PF, Moss, Zavic, Lüscher) y entrega de reporte ejecutivo. Tu gerente de RH recibe un PDF claro, no un test crudo.
              </p>
            </Card>

            <Card className="card-premium p-8 space-y-4 border border-white/5">
              <div className="flex items-center gap-3">
                <Database className="text-brand-orange" size={28} />
                <h3 className="text-xl font-black text-white tracking-tight">PostgreSQL + Pinecone</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Memoria operativa. Cada candidato evaluado y proceso cerrado queda registrado. Cuando vuelves a contratar para el mismo perfil, partimos de la experiencia previa, no de cero.
              </p>
            </Card>

            <Card className="card-premium p-8 space-y-4 border border-white/5">
              <div className="flex items-center gap-3">
                <Cpu className="text-brand-blue" size={28} />
                <h3 className="text-xl font-black text-white tracking-tight">Stripe + CFDI 4.0</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Cobro y facturación transparente. Pago seguro en MXN, facturación electrónica inmediata para México. Cero fricción contable para tu equipo de administración.
              </p>
            </Card>

            <Card className="card-premium p-8 space-y-4 border border-white/5">
              <div className="flex items-center gap-3">
                <Plug className="text-brand-orange" size={28} />
                <h3 className="text-xl font-black text-white tracking-tight">Next.js + Cifrado AES-256</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Plataforma propia, datos protegidos. La infraestructura es nuestra. Los datos de tus candidatos viven cifrados, bajo cumplimiento LFPDPPP, sin intermediarios.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. CTA FINAL — BANDA DE CIERRE */}
      <section className="relative py-28 bg-[#0d1422] border-t border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none -mr-64 -mt-64"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto card-premium p-12 sm:p-20 text-center space-y-8 border-brand-orange/20">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              ¿Qué significa esto para ti?
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
              Que recibes un servicio de agencia — con un humano responsable de tu cuenta — entregado con la precisión, velocidad y trazabilidad de una empresa de tecnología. <strong className="text-white">Sin licencias que pagar, sin dashboards que aprender, sin onboarding de software.</strong>
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <Link href="/empresas">
                <Button variant="primary" size="xl" className="w-full sm:w-auto h-14 rounded-xl px-8 font-bold uppercase tracking-widest text-xs btn-elev shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                  Conoce nuestro proceso paso a paso
                </Button>
              </Link>
            </div>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] pt-8">
              Hacke&apos;s Jobs Technologies © {new Date().getFullYear()} · LFPDPPP
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
