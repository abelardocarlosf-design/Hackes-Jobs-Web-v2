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

// metadata moved to layout or generateMetadata

export default function EmpresasPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-brand-orange/20 selection:text-brand-orange overflow-x-hidden">
      
      <main className="flex-grow">
        {/* 1. HERO SECTION */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-brand-white bg-[url('/images/parallax-office.png')] bg-cover bg-center bg-fixed">
          <div className="absolute inset-0 bg-brand-white/80 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[url('/grid-light.svg')] bg-center opacity-[0.03] pointer-events-none"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center space-y-10">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-brand-black text-white text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
                <span className="flex h-2 w-2 rounded-full bg-brand-blue animate-pulse"></span>
                Headhunting de Nueva Generación
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-brand-black leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700">
                <Typewriter text="Encuentra al talento ideal" speed={60} delay={400} className="text-brand-orange" /> <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-blue">sin perder tiempo ni dinero.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                Deja de recibir cientos de CVs sin filtrar. Utilizamos tecnología y análisis profundo para conectar tu empresa con el <span className="text-brand-black font-bold italic">top 1% del talento</span> calificado.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
                <Link href="/empresas/requisicion">
                  <Button variant="secondary" size="xl" className="w-full sm:w-auto shadow-orange/60">
                    Solicitar perfil de vacante
                    <ArrowRight className="ml-3" size={20} />
                  </Button>
                </Link>
                <WhatsAppButton className="w-full sm:w-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. EL PROBLEMA */}
        <section className="py-24 bg-brand-black text-white relative">
          <div className="container mx-auto px-4">
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
                <div key={i} className="space-y-6 p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <item.icon className="mx-auto text-brand-orange" size={40} />
                  <h3 className="text-2xl font-black uppercase tracking-tight">{item.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. LA SOLUCIÓN - PROCESO */}
        <section className="py-32 bg-brand-slate relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2 space-y-10">
                <span className="text-brand-orange font-black tracking-[0.4em] uppercase text-xs">Metodología HJ</span>
                <h2 className="text-5xl md:text-7xl font-black text-brand-black tracking-tighter leading-none">
                  Un proceso estructurado para <span className="italic">resultados garantizados.</span>
                </h2>
                
                <div className="space-y-8">
                  {[
                    { step: "01", title: "Llenas el perfilador", desc: "Nuestro wizard inteligente captura los detalles técnicos y culturales de la vacante." },
                    { step: "02", title: "Analizamos con IA", desc: "Cruzamos tu necesidad con nuestra base de datos y algoritmos de evaluación profunda." },
                    { step: "03", title: "Recibes candidatos", desc: "Te presentamos una terna calificada lista para la entrevista final en menos de 7 días." }
                  ].map((p, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="text-4xl font-black text-brand-blue/20 group-hover:text-brand-blue transition-colors duration-500">{p.step}</div>
                      <div className="space-y-2">
                        <h4 className="text-2xl font-black text-brand-black uppercase tracking-tight">{p.title}</h4>
                        <p className="text-slate-500 font-medium">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <Illustration 
                  src="/images/process-visual.png"
                  alt="Proceso de Reclutamiento HJ"
                  width={600}
                  height={600}
                  className="rounded-[4rem] shadow-premium"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. BENEFICIOS */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-24 space-y-6">
              <span className="text-brand-blue font-black tracking-[0.4em] uppercase text-xs">Ventajas Competitivas</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Más que reclutamiento, <br className="hidden md:block" /> somos tu socio de crecimiento.</h2>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-10">
              {[
                { 
                  t: "Ahorro del 60% de Tiempo", 
                  d: "Eliminamos las fases iniciales de filtrado manual para que solo hables con los mejores.",
                  icon: Clock
                },
                { 
                  t: "Calidad Técnica Validada", 
                  d: "Cada candidato pasa por pruebas psicométricas y técnicas antes de llegar a ti.",
                  icon: Target
                },
                { 
                  t: "Proceso 100% Transparente", 
                  d: "Monitorea el avance de tu búsqueda con reportes detallados y comunicación constante.",
                  icon: Zap
                }
              ].map((b, i) => (
                <Card key={i} className="border-b-8 border-brand-orange/20 hover:border-brand-orange transition-all duration-500">
                  <div className="p-12 space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-brand-orange/5 text-brand-orange flex items-center justify-center">
                      <b.icon size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-brand-black uppercase tracking-tight">{b.t}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{b.d}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 5. TESTIMONIOS (SIMULADOS) */}
        <section className="py-32 bg-brand-slate overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
              <div className="md:w-1/3">
                <h2 className="text-4xl md:text-6xl font-black text-brand-black tracking-tighter leading-none mb-8">Lo que dicen <br/> los líderes.</h2>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(i => <Zap key={i} className="fill-brand-orange text-brand-orange" size={20} />)}
                </div>
              </div>
              
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { q: "Hacke's Jobs redujo nuestro tiempo de contratación de 45 a 12 días para perfiles críticos de ingeniería.", n: "Fernando Gomez", p: "CTO @ Goncalves Mexico" },
                  { q: "La calidad de los candidatos es excepcional. Entienden perfectamente la cultura de mi empresa.", n: "Norma Rosas", p: "HR Manager @ Grupo Prisma" }
                ].map((t, i) => (
                  <div key={i} className="bg-white p-10 rounded-[3rem] shadow-premium space-y-6">
                    <p className="text-lg text-slate-600 italic font-medium">"{t.q}"</p>
                    <div>
                      <div className="font-black text-brand-black uppercase text-xs tracking-widest">{t.n}</div>
                      <div className="text-brand-blue text-[10px] font-bold uppercase tracking-widest">{t.p}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. FINAL CTA */}
        <section className="py-40 relative overflow-hidden bg-brand-black text-white">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] opacity-[0.05] pointer-events-none"></div>
          <div className="container mx-auto px-4 relative z-10 text-center space-y-12">
            <h2 className="text-5xl md:text-[6rem] font-black tracking-tighter leading-none">
              ¿Listo para armar <br/> el equipo de tus sueños?
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium">
              Empieza hoy mismo creando tu primer perfil de vacante sin costo inicial.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link href="/empresas/requisicion">
                <Button variant="secondary" size="xl" className="px-12">
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
