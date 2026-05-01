'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Illustration } from '@/components/Illustration';
import { 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Zap, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  Target 
} from 'lucide-react';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Typewriter } from '@/components/Typewriter';
import { TypewriterHeading } from '@/components/TypewriterHeading';

// metadata moved to layout or generateMetadata

export default function EmpresasPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-black font-sans selection:bg-brand-orange/40 selection:text-white overflow-x-hidden relative">
      {/* Full page dynamic background */}
      <div className="fixed inset-0 bg-[url('/images/empresas-bg.gif')] bg-cover bg-center bg-fixed opacity-[0.2] pointer-events-none z-0"></div>
      
      <main className="flex-grow relative z-10">
        {/* 1. HERO SECTION */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden text-white">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center space-y-10">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-brand-black/80 backdrop-blur-md text-white text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
                <span className="flex h-2 w-2 rounded-full bg-brand-blue animate-pulse"></span>
                Headhunting de Nueva Generación
              </div>
              
              <h1 className="text-5xl md:text-[6.5rem] font-black tracking-tighter text-white leading-[1.1] drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex flex-col items-center gap-2">
                <span className="leading-none"><Typewriter text="Automatización y" speed={70} delay={400} /></span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-blue leading-[1.2] py-2">
                  Equipos de Alto Rendimiento.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                Deja atrás los procesos manuales. Hacke's Jobs centraliza todo tu embudo de contratación en un solo dashboard. Desde la redacción de la vacante hasta la oferta final, nuestra <span className="text-brand-orange font-bold italic">IA trabaja para ti.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
                <Link href="/empresas/requisicion">
                  <Button variant="secondary" size="xl" className="w-full sm:w-auto shadow-orange/60">
                    Transforma tu Reclutamiento Hoy
                    <ArrowRight className="ml-3" size={20} />
                  </Button>
                </Link>
                <WhatsAppButton className="w-full sm:w-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. EL PROBLEMA */}
        <section className="relative py-32 text-white overflow-hidden">
          <div className="container relative mx-auto px-4 z-10">
            <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
              <span className="text-brand-blue font-black tracking-[0.4em] uppercase text-xs">La realidad del mercado</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">¿Por qué contratar es hoy más difícil que nunca?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                { 
                  title: "Saturación de Perfiles", 
                  desc: "Las plataformas tradicionales te inundan con candidatos que no cumplen con los requisitos mínimos.",
                  icon: Users
                },
                { 
                  title: "Costos de Oportunidad", 
                  desc: "Cada día que una posición clave está vacante, tu empresa pierde dinero y velocidad operativa.",
                  icon: TrendingUp
                },
                { 
                  title: "Falta de Validación", 
                  desc: "El 70% de los CVs mienten sobre habilidades técnicas o competencias blandas.",
                  icon: ShieldCheck
                }
              ].map((item, i) => (
                <div key={i} className="glass-card space-y-6 p-10 group hover:bg-white/10 transition-all duration-500">
                  <item.icon className="mx-auto text-brand-orange group-hover:scale-110 transition-transform duration-500" size={40} />
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">{item.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. LA SOLUCIÓN - PROCESO */}
        <section className="relative py-32 overflow-hidden">
          <div className="container relative mx-auto px-4 z-10">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2 space-y-10">
                <span className="text-brand-orange font-black tracking-[0.4em] uppercase text-xs">Metodología HJ</span>
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                  Un proceso estructurado para <span className="italic text-brand-blue">resultados garantizados.</span>
                </h2>
                
                <div className="space-y-8">
                  {[
                    { step: "01", title: "Llenas el perfilador", desc: "Nuestro wizard inteligente captura los detalles técnicos y culturales de la vacante." },
                    { step: "02", title: "Analizamos con IA", desc: "Cruzamos tu necesidad con nuestra base de datos y algoritmos de evaluación profunda." },
                    { step: "03", title: "Recibes candidatos", desc: "Te presentamos una terna calificada lista para la entrevista final en menos de 7 días." }
                  ].map((p, i) => (
                    <div key={i} className="flex gap-6 group glass-card p-6 border-none bg-white/5">
                      <div className="text-4xl font-black text-brand-blue group-hover:scale-110 transition-transform duration-500">{p.step}</div>
                      <div className="space-y-2">
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight">{p.title}</h4>
                        <p className="text-slate-300 font-medium">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <Illustration 
                  src="/images/empresas-illustration.png"
                  alt="Proceso de Reclutamiento HJ"
                  width={600}
                  height={600}
                  className="rounded-[4rem] shadow-2xl border border-white/10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. BENEFICIOS */}
        <section className="relative py-32 overflow-hidden">
          <div className="container relative mx-auto px-4 z-10">
            <div className="text-center mb-24 space-y-6">
              <span className="text-brand-blue font-black tracking-[0.4em] uppercase text-xs">Ventajas Competitivas</span>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Más que reclutamiento, <br className="hidden md:block" /> somos tu socio de crecimiento.</h2>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-10">
              {[
                { 
                  t: "Cribado con Inteligencia Artificial", 
                  d: "Algoritmos avanzados de procesamiento de lenguaje natural (NLP) que analizan miles de CVs en segundos, identificando el talento oculto con un match semántico perfecto.",
                  icon: Target
                },
                { 
                  t: "Evaluaciones CAT (Pruebas Adaptativas)", 
                  d: "Evaluaciones psicométricas y técnicas que se adaptan en tiempo real al nivel del candidato. Máxima precisión clínica en una fracción del tiempo tradicional.",
                  icon: ShieldCheck
                },
                { 
                  t: "HR Analytics y Reducción de Rotación", 
                  d: "Toma decisiones basadas en datos. Mide el desempeño, los tiempos de respuesta y el ROI de tus contrataciones con reportes ejecutivos automatizados.",
                  icon: TrendingUp
                }
              ].map((b, i) => (
                <Card key={i} className="glass-card p-10 border-b-8 border-brand-orange/40 hover:border-brand-orange hover:bg-white/10 transition-all duration-500">
                  <div className="space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-brand-orange/20 text-brand-orange flex items-center justify-center">
                      <b.icon size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">{b.t}</h3>
                    <p className="text-slate-400 font-medium leading-relaxed">{b.d}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 5. TESTIMONIOS (SIMULADOS) */}
        <section className="relative py-32 overflow-hidden">
          <div className="container relative mx-auto px-4 z-10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
              <div className="md:w-1/3">
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-8">Lo que dicen <br/> los líderes.</h2>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(i => <Zap key={i} className="fill-brand-orange text-brand-orange" size={20} />)}
                </div>
              </div>
              
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { q: "Hacke's Jobs redujo nuestro tiempo de contratación de 45 a 12 días para perfiles críticos de ingeniería.", n: "Fernando Gomez", p: "CTO @ Goncalves Mexico" },
                  { q: "La calidad de los candidatos es excepcional. Entienden perfectamente la cultura de mi empresa.", n: "Norma Rosas", p: "HR Manager @ Grupo Prisma" }
                ].map((t, i) => (
                  <div key={i} className="glass-card p-10 space-y-6">
                    <p className="text-lg text-slate-300 italic font-medium">"{t.q}"</p>
                    <div>
                      <div className="font-black text-white uppercase text-xs tracking-widest">{t.n}</div>
                      <div className="text-brand-blue text-[10px] font-bold uppercase tracking-widest">{t.p}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. FINAL CTA */}
        <section className="relative py-40 overflow-hidden text-white">
          <div className="container relative mx-auto px-4 z-10 text-center space-y-12">
            <h2 className="text-5xl md:text-[6.5rem] font-black tracking-tighter leading-none text-white">
              ¿Listo para armar <br/> el equipo de tus sueños?
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-medium">
              Empieza hoy mismo creando tu primer perfil de vacante sin costo inicial.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link href="/empresas/requisicion">
                <Button variant="secondary" size="xl" className="px-12 shadow-orange/60">
                  Crear perfil de vacante
                </Button>
              </Link>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
              Sin compromisos • Respuesta en 24h • Top 1% Talento
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
