'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { Illustration } from '@/components/Illustration';
import { Typewriter } from '@/components/Typewriter';
import { TypewriterHeading } from '@/components/TypewriterHeading';

// metadata moved to layout or generateMetadata

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
    <div className="flex flex-col min-h-screen bg-brand-black font-sans selection:bg-brand-orange/40 selection:text-white overflow-x-hidden">
      
      {/* 1. PREMIUM HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-brand-black">
        {/* Background GIF */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src="/images/hero-bg.gif" 
            alt="" 
            className="w-full h-full object-cover opacity-60 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-brand-black/40"></div>
        </div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10 py-20">
          <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto space-y-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-brand-black/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase shadow-2xl animate-in fade-in slide-in-from-top-4 duration-1000">
              <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-pulse" aria-hidden="true"></span>
              Reclutamiento Inteligente 4.0
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-[5.5rem] font-black tracking-tighter text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex flex-col items-center gap-2">
              <span className="leading-none"><Typewriter text="El Futuro del" speed={70} delay={400} /></span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-blue leading-[1.2] py-2">
                Reclutamiento Inteligente.
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-white/90 max-w-4xl leading-tight font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              Encuentra, evalúa y contrata al Top 1% del talento en tiempo récord. Nuestro ATS impulsado por <span className="text-brand-orange font-black italic">Inteligencia Artificial y pruebas adaptativas</span> transforma la atracción de talento en un proceso exacto.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
              <Link href="/empresas" className="w-full sm:w-auto">
                <Button variant="secondary" size="xl" className="w-full sm:w-auto shadow-orange/40">
                  Solicitar Demo
                </Button>
              </Link>
              <Link href="/empresas" className="w-full sm:w-auto">
                <Button variant="outline" size="xl" className="w-full sm:w-auto border-white/30 text-white hover:border-brand-orange hover:text-brand-orange bg-white/5 backdrop-blur-md">
                  Explorar Soluciones
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <section className="relative py-16 bg-brand-black overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src="/images/hero-bg.gif" 
            alt="" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-brand-black/60"></div>
        </div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left">
              <h2 className="text-brand-orange font-black text-sm uppercase tracking-[0.5em] mb-4">Resultados Comprobados</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-12 sm:gap-20">
                <div className="group">
                  <div className="text-5xl font-black text-white group-hover:text-brand-orange transition-colors duration-500 tracking-tighter">+500</div>
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Candidatos Evaluados</div>
                </div>
                <div className="group">
                  <div className="text-5xl font-black text-white group-hover:text-brand-blue transition-colors duration-500 tracking-tighter">+50</div>
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Empresas Aliadas</div>
                </div>
                <div className="group">
                  <div className="text-5xl font-black text-brand-orange tracking-tighter">7 Días</div>
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Tiempo de Respuesta</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
               <div className="w-px h-24 bg-white/10"></div>
            </div>
            <div className="text-center md:text-right max-w-md">
               <p className="text-slate-300 font-medium leading-relaxed italic">
                 "Impulsando la atracción de talento de empresas líderes con tecnología, precisión y análisis de ADN corporativo."
               </p>
               <div className="text-brand-orange font-black text-xs uppercase tracking-widest mt-4">Nuestra Promesa SaaS</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICES - STITCH CARDS */}
      <section className="relative py-32 bg-brand-black text-white overflow-hidden bg-[url('/images/candidatos-bg.gif')] bg-cover bg-center bg-fixed" aria-labelledby="services-title">
        <div className="absolute inset-0 bg-brand-black/70 pointer-events-none"></div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="text-center max-w-4xl mx-auto mb-24 space-y-6">
            <span className="text-brand-blue font-black tracking-[0.4em] uppercase text-xs">Atracción de Talento Especializado</span>
            <h2 id="services-title" className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">Soluciones a medida.</h2>
            <div className="w-24 h-2 bg-brand-orange mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            <Card className="group overflow-hidden bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-500">
              <div className="p-12 sm:p-20 space-y-8">
                <div className="w-24 h-24 bg-brand-blue/10 text-brand-blue rounded-[2.5rem] flex items-center justify-center transition-all duration-700 group-hover:bg-brand-blue group-hover:text-white group-hover:rotate-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div className="space-y-4">
                   <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">Reclutamiento <br/> Especializado</h3>
                   <p className="text-xl text-slate-400 font-medium leading-relaxed">
                     Headhunting de alto nivel para roles técnicos, gerenciales e IT. Encontramos la aguja en el pajar con metodología basada en datos.
                   </p>
                </div>
                <div className="pt-6">
                  <Link href="/empresas">
                    <Button variant="ghost" className="p-0 text-brand-blue hover:bg-transparent hover:translate-x-2">
                       Saber más <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
 
            <Card className="group overflow-hidden bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-500">
              <div className="p-12 sm:p-20 space-y-8">
                <div className="w-24 h-24 bg-brand-orange/10 text-brand-orange rounded-[2.5rem] flex items-center justify-center transition-all duration-700 group-hover:bg-brand-orange group-hover:text-white group-hover:-rotate-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div className="space-y-4">
                   <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">Reclutamiento <br/> Masivo</h3>
                   <p className="text-xl text-slate-400 font-medium leading-relaxed">
                     Escalamos tus operaciones en tiempo récord. Cobertura nacional con procesos ágiles y filtros de calidad certificados por HJ.
                   </p>
                </div>
                <div className="pt-6">
                  <Link href="/empresas">
                    <Button variant="ghost" className="p-0 text-brand-orange hover:bg-transparent hover:translate-x-2">
                       Saber más <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. METHODOLOGY - FLOATING ELEMENTS */}
      <section id="como-funciona" className="relative py-32 bg-brand-black text-white overflow-hidden bg-[url('/images/psicometrias-bg.gif')] bg-cover bg-center bg-fixed" aria-labelledby="method-title">
        <div className="absolute inset-0 bg-brand-black/70 pointer-events-none"></div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto space-y-16">
            <div className="space-y-6">
              <span className="text-brand-orange font-black tracking-[0.4em] uppercase text-xs">Nuestro Método</span>
              <h2 id="method-title" className="text-5xl md:text-[5.5rem] font-black text-white tracking-tighter leading-none">¿Cómo lo hacemos <span className="text-brand-blue">posible?</span></h2>
              <div className="w-24 h-2 bg-brand-orange mx-auto rounded-full mt-6"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 w-full">
              {[
                { n: '01', t: 'Análisis de ADN Corporativo', d: 'No solo buscamos habilidades, buscamos fit cultural profundo.' },
                { n: '02', t: 'Cribado con Inteligencia Artificial', d: 'Algoritmos propios para detectar potencial oculto en miles de CVs.' },
                { n: '03', t: 'Validación Psicométrica DISC', d: 'Reportes científicos de personalidad para decisiones sin sesgos.' }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-6 group p-8 rounded-[3rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500">
                  <span className="text-6xl font-black text-white/10 group-hover:text-brand-orange transition-colors duration-500 tracking-tighter leading-none">{step.n}</span>
                  <div className="space-y-3">
                     <h4 className="text-xl font-black text-white uppercase tracking-tight">{step.t}</h4>
                     <p className="text-slate-400 font-medium leading-relaxed">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING B2B SECTION */}
      <section className="relative py-32 bg-brand-black text-white overflow-hidden" aria-labelledby="pricing-title">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src="/images/empresas-bg.gif" 
            alt="" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-brand-black/60"></div>
        </div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto mb-24">
            <div className="lg:w-1/2 text-center lg:text-left space-y-6">
              <span className="text-brand-orange font-black tracking-[0.4em] uppercase text-xs">Módulo B2B</span>
              <h2 id="pricing-title" className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">Planes corporativos.</h2>
              <p className="text-xl text-slate-300 font-medium">Escala tu equipo con Inteligencia Artificial y procesos optimizados para el mercado mexicano.</p>
            </div>
            <div className="lg:w-2/5">
              <Illustration 
                src="/images/empresas-illustration.png"
                alt="Hackes Jobs Empresas"
                width={400}
                height={300}
                className="rounded-3xl shadow-2xl shadow-brand-orange/10 border border-white/10"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Basic */}
            <Card className="p-10 flex flex-col bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-500 group">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Growth</h3>
              <div className="text-4xl font-black text-white tracking-tighter mb-6">$499<span className="text-lg text-slate-400 font-medium">/mo</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-slate-300 font-medium"><svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> 5 Vacantes Activas</li>
                <li className="flex items-center gap-3 text-slate-300 font-medium"><svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> 100 Créditos Antigravity IA</li>
                <li className="flex items-center gap-3 text-slate-300 font-medium"><svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Filtro ATS Básico</li>
              </ul>
              <Button 
                variant="outline" 
                className={`w-full border-white/20 text-white hover:border-brand-orange hover:text-brand-orange h-14 rounded-2xl font-black text-xs uppercase tracking-widest bg-white/5 transition-all ${isSuccess ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : ''}`}
                onClick={handleGrowthPlan}
                disabled={isLoading || isSuccess}
              >
                {isLoading ? 'Procesando...' : isSuccess ? '¡Solicitud Enviada!' : 'Comenzar Plan Growth'}
              </Button>
            </Card>

            {/* Pro - Destacado */}
            <Card className="p-10 flex flex-col border-2 border-brand-blue bg-brand-blue/20 backdrop-blur-3xl relative transform lg:-translate-y-4 shadow-blue group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl border border-white/20">Más Popular</div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2 drop-shadow-md">Professional</h3>
              <div className="text-5xl font-black text-white tracking-tighter mb-8 drop-shadow-lg">$999<span className="text-lg text-white/70 font-medium">/mo</span></div>
              <ul className="space-y-6 mb-12 flex-1">
                <li className="flex items-center gap-4 text-white font-black drop-shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-white text-brand-blue flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <span>Vacantes Ilimitadas</span>
                </li>
                <li className="flex items-center gap-4 text-white font-black drop-shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-white text-brand-blue flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <span>500 Créditos IA</span>
                </li>
                <li className="flex items-center gap-4 text-white font-black drop-shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-white text-brand-blue flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <span>Matching Semántico</span>
                </li>
                <li className="flex items-center gap-4 text-white font-black drop-shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-white text-brand-blue flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <span>Soporte Prioritario</span>
                </li>
              </ul>
              <Link href="/precios" className="mt-auto block">
                <Button 
                  variant="primary" 
                  className="w-full h-14 mt-auto font-black text-xs uppercase tracking-widest rounded-2xl"
                >
                  Elegir Professional
                </Button>
              </Link>
            </Card>

            {/* Enterprise */}
            <Card className="p-10 flex flex-col bg-brand-black/60 backdrop-blur-md border border-white/10 hover:border-brand-orange/40 transition-all duration-500 text-white group shadow-2xl">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Enterprise</h3>
              <div className="text-4xl font-black text-white tracking-tighter mb-6">Custom</div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-slate-300 font-medium"><svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Infraestructura Dedicada</li>
                <li className="flex items-center gap-3 text-slate-300 font-medium"><svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Pruebas CAT Ilimitadas</li>
                <li className="flex items-center gap-3 text-slate-300 font-medium"><svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> API Access</li>
              </ul>
              <Link href="/precios" className="mt-auto block">
                <Button variant="outline" className="w-full h-14 text-white border-white/20 hover:border-brand-orange hover:text-brand-orange font-black text-xs uppercase tracking-widest rounded-2xl bg-white/5 backdrop-blur-md">Contactar Ventas</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA - HIGH IMPACT */}
      <section className="relative py-32 bg-brand-black overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.gif')] bg-cover bg-center opacity-30 bg-fixed"></div>
        <div className="absolute inset-0 bg-brand-black/60 pointer-events-none"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden border border-white/10 shadow-premium transition-transform hover:scale-[1.01] duration-700">
              <div className="relative z-10 space-y-12">
                <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
                  Tu próximo líder <br className="hidden md:block" /> 
                  <span className="text-brand-orange">está a un clic.</span>
                </h2>
                <p className="text-xl md:text-3xl text-slate-300 mb-12 max-w-3xl mx-auto font-medium">
                  Únete a las empresas que ya están transformando México con el mejor talento.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link href="/empresas">
                    <Button variant="secondary" size="xl" className="shadow-orange/40">
                      Comenzar Ahora
                    </Button>
                  </Link>
                  <Link href="/vacantes">
                    <Button variant="outline" size="xl" className="border-white/10 text-white hover:bg-white/5">
                      Soy Candidato
                    </Button>
                  </Link>
                </div>
                <p className="text-slate-500 font-black text-xs uppercase tracking-[0.5em] pt-8">
                  Hacke's Jobs Platform © {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
