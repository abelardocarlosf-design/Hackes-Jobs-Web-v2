import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { Illustration } from '@/components/Illustration';

export const metadata: Metadata = {
  title: "Hacke's Jobs | Reclutamiento Inteligente y Atracción de Talento",
  description: "Transformamos el reclutamiento con IA y psicometría avanzada. Encontramos al top 1% de talento para empresas que buscan escalar.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-brand-orange/20 selection:text-brand-orange overflow-x-hidden">
      
      {/* 1. PREMIUM HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-brand-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-[url('/grid-light.svg')] bg-center opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-blue/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-orange/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="text-left lg:w-3/5 space-y-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-brand-black text-white text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase shadow-2xl shadow-brand-black/20 animate-in fade-in slide-in-from-left-4 duration-1000">
                <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-pulse" aria-hidden="true"></span>
                Reclutamiento Inteligente 4.0
              </div>
              
              <h1 className="text-6xl sm:text-8xl md:text-[7rem] font-black tracking-tighter text-brand-black leading-[0.85] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                Contrata al mejor <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">talento del país.</span>
              </h1>
              
              <p className="text-xl sm:text-3xl text-slate-400 max-w-3xl leading-tight font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                Filtramos y evaluamos al <span className="text-brand-black font-black italic">Top 1% de perfiles</span> para que tu empresa nunca deje de crecer. <span className="text-brand-blue underline decoration-brand-orange decoration-4 underline-offset-8">Headhunting de alto nivel.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                <Link href="/empresas">
                  <Button variant="secondary" size="xl" className="w-full sm:w-auto shadow-2xl hover:scale-105" aria-label="Encontrar talento para mi empresa">
                    Encontrar talento hoy
                  </Button>
                </Link>
                <Link href="#como-funciona">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto border-brand-black/10 hover:border-brand-blue hover:scale-105">
                    Ver método HJ
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:w-2/5 relative animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="absolute inset-0 bg-brand-blue/5 rounded-full blur-[80px] -z-10 animate-pulse"></div>
              <Illustration 
                src="/images/hero-illustration.png"
                alt="Hackes Jobs reclutamiento inteligente"
                width={700}
                height={700}
                priority={true}
                className="w-full max-w-lg lg:max-w-none animate-float drop-shadow-[0_35px_35px_rgba(30,64,175,0.15)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <section className="py-16 bg-brand-black relative z-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left">
              <h2 className="text-brand-white/30 font-black text-sm uppercase tracking-[0.5em] mb-4">Resultados Comprobados</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-12 sm:gap-20">
                <div className="group">
                  <div className="text-5xl font-black text-brand-white group-hover:text-brand-orange transition-colors duration-500 tracking-tighter">+500</div>
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Candidatos Evaluados</div>
                </div>
                <div className="group">
                  <div className="text-5xl font-black text-brand-white group-hover:text-brand-blue transition-colors duration-500 tracking-tighter">+50</div>
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Empresas Aliadas</div>
                </div>
                <div className="group">
                  <div className="text-5xl font-black text-brand-orange tracking-tighter">7 Días</div>
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Tiempo de Respuesta</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
               <div className="w-px h-24 bg-white/10"></div>
            </div>
            <div className="text-center md:text-right max-w-xs">
               <p className="text-slate-400 font-medium leading-relaxed italic">
                 "La mejor decisión que tomamos para nuestro equipo este año fue apostar por los avances tecnologicos."
               </p>
               <div className="text-brand-orange font-black text-xs uppercase tracking-widest mt-4">— Director General, Hacke's Jobs Latam</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICES - STITCH CARDS */}
      <section className="py-32 bg-brand-slate relative" aria-labelledby="services-title">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-24 space-y-6">
            <span className="text-brand-blue font-black tracking-[0.4em] uppercase text-xs">Atracción de Talento Especializado</span>
            <h2 id="services-title" className="text-5xl md:text-8xl font-black text-brand-black tracking-tighter leading-none">Soluciones a medida.</h2>
            <div className="w-24 h-2 bg-brand-orange mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            <Card className="group overflow-hidden">
              <div className="p-12 sm:p-20 space-y-8">
                <div className="w-24 h-24 bg-brand-blue/10 text-brand-blue rounded-[2.5rem] flex items-center justify-center transition-all duration-700 group-hover:bg-brand-blue group-hover:text-white group-hover:rotate-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl md:text-5xl font-black text-brand-black tracking-tighter uppercase leading-none">Reclutamiento <br/> Especializado</h3>
                  <p className="text-xl text-slate-500 font-medium leading-relaxed">
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

            <Card className="group overflow-hidden">
              <div className="p-12 sm:p-20 space-y-8">
                <div className="w-24 h-24 bg-brand-orange/10 text-brand-orange rounded-[2.5rem] flex items-center justify-center transition-all duration-700 group-hover:bg-brand-orange group-hover:text-white group-hover:-rotate-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl md:text-5xl font-black text-brand-black tracking-tighter uppercase leading-none">Reclutamiento <br/> Masivo</h3>
                  <p className="text-xl text-slate-500 font-medium leading-relaxed">
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
      <section id="como-funciona" className="py-32 bg-white overflow-hidden" aria-labelledby="method-title">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 space-y-12">
               <div className="space-y-6">
                 <span className="text-brand-orange font-black tracking-[0.4em] uppercase text-xs">Nuestro Método</span>
                 <h2 id="method-title" className="text-5xl md:text-7xl font-black text-brand-black tracking-tighter leading-[0.9]">¿Cómo lo hacemos <span className="text-brand-blue">posible?</span></h2>
               </div>
               
               <div className="space-y-12">
                 {[
                   { n: '01', t: 'Análisis de ADN Corporativo', d: 'No solo buscamos habilidades, buscamos fit cultural profundo.' },
                   { n: '02', t: 'Cribado con Inteligencia Artificial', d: 'Algoritmos propios para detectar potencial oculto en miles de CVs.' },
                   { n: '03', t: 'Validación Psicométrica DISC', d: 'Reportes científicos de personalidad para decisiones sin sesgos.' }
                 ].map((step, i) => (
                   <div key={i} className="flex gap-8 group">
                     <span className="text-5xl font-black text-slate-100 group-hover:text-brand-orange transition-colors duration-500 tracking-tighter">{step.n}</span>
                     <div className="space-y-2">
                        <h4 className="text-2xl font-black text-brand-black uppercase tracking-tight">{step.t}</h4>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed">{step.d}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="lg:w-1/2 relative">
               <div className="relative z-10 p-12">
                 <Illustration 
                    src="/images/psicometria-illustration.png"
                    alt="Metodología Hackes Jobs"
                    width={600}
                    height={600}
                    className="shadow-5xl shadow-brand-blue/10 rounded-[4rem] rotate-2 transition-transform hover:rotate-0 duration-700"
                 />
               </div>
               {/* Background blob */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-blue/5 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA - HIGH IMPACT */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white pb-40">
        <div className="max-w-7xl mx-auto">
          <div className="bg-brand-black rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden shadow-premium transition-transform hover:scale-[1.01] duration-700">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/grid-light.svg')] opacity-[0.03] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-blue/20 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 space-y-12">
              <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none animate-pulse-slow">
                Tu próximo líder <br className="hidden md:block" /> 
                <span className="text-brand-orange">está a un clic.</span>
              </h2>
              <p className="text-xl md:text-3xl text-slate-400 mb-12 max-w-3xl mx-auto font-medium">
                Únete a las empresas que ya están transformando México con el mejor talento.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/empresas">
                  <Button variant="secondary" size="xl" className="h-24 px-16 text-2xl shadow-orange/60">
                    Comenzar Ahora
                  </Button>
                </Link>
                <Link href="/vacantes">
                  <Button variant="outline" size="xl" className="h-24 px-16 text-2xl border-white/10 text-white hover:bg-white/5">
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
      </section>
    </div>
  );
}
