import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { LeadForm } from '@/components/LeadForm';
import { Illustration } from '@/components/Illustration';

export const metadata: Metadata = {
  title: 'Soluciones para Empresas | Hacke\'s Jobs',
  description: 'Optimiza tu proceso de contratación con Hacke\'s Jobs. Headhunting especializado, reclutamiento masivo y evaluaciones psicométricas para encontrar el talento ideal.',
};

export default function EmpresasPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-brand-orange/20 selection:text-brand-orange overflow-x-hidden">
      
      {/* 1. PREMIUM HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-24 overflow-hidden bg-brand-white">
        <div className="absolute inset-0 bg-[url('/grid-light.svg')] bg-center opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-brand-orange/5 rounded-full blur-[150px] animate-pulse-slow"></div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-1/2 space-y-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-brand-black text-white text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl animate-in fade-in slide-in-from-left-4 duration-1000">
                <span className="flex h-2 w-2 rounded-full bg-brand-blue animate-pulse" aria-hidden="true"></span>
                Agenda Abierta 2026
              </div>
              
              <h1 className="text-6xl sm:text-7xl md:text-[6.5rem] font-black tracking-tighter text-brand-black leading-[0.85] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                Tu empresa merece <br/>
                <span className="text-gradient-orange">el mejor talento.</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-slate-400 max-w-2xl leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                No pierdas más candidatos frente a tu competencia. Encontramos al <span className="text-brand-black font-black italic">top 1% del talento calificado</span> en México mediante tecnología disruptiva.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
                <Link href="#contacto">
                  <Button variant="secondary" size="xl" className="w-full sm:w-auto shadow-orange/60">
                    Agendar diagnóstico gratuito
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-3">
                      {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 shadow-sm"></div>)}
                   </div>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Más de 50 empresas <br/> confían en HJ</p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 relative animate-in fade-in zoom-in duration-1000 delay-300">
              <Illustration 
                src="/images/empresas-illustration.png"
                alt="Empresas Hackes Jobs"
                width={600}
                height={500}
                priority={true}
                className="w-full max-w-lg lg:max-w-none animate-float drop-shadow-[0_35px_35px_rgba(249,115,22,0.15)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION - DARK MODE */}
      <section className="py-24 bg-brand-black relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-center md:text-left">
            {[
              { t: "+50", d: "Empresas en México", c: "brand-blue" },
              { t: "+500", d: "Contrataciones IT", c: "brand-orange" },
              { t: "98%", d: "Índice de Retención", c: "brand-blue" },
              { t: "7 Días", d: "Tiempo Promedio", c: "brand-orange" }
            ].map((s, i) => (
              <div key={i} className="space-y-2 border-l-2 border-white/5 pl-8 hover:border-brand-orange transition-colors duration-500">
                <div className={`text-6xl font-black tracking-tighter text-white`}>{s.t}</div>
                <div className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROBLEM & SOLUTION - STITCH STYLE */}
      <section className="py-32 bg-brand-slate" aria-labelledby="challenges-title">
        <div className="container mx-auto px-4 text-center mb-24 space-y-6">
           <span className="text-brand-orange font-black tracking-[0.4em] uppercase text-xs">El Desafío del Reclutamiento</span>
           <h2 id="challenges-title" className="text-5xl md:text-8xl font-black text-brand-black tracking-tighter leading-none">¿Tu proceso frena tu expansión?</h2>
        </div>
        
        <div className="container mx-auto px-4 max-w-7xl">
           <div className="grid md:grid-cols-2 gap-10">
              {[
                { t: "Desgaste operativo", d: "Horas perdidas revisando CVs sin filtrar en lugar de dirigir tu visión estratégica hacia el éxito." },
                { t: "Pérdida de oportunidad", d: "Tardas semanas en entrevistas mediocres mientras el talento top ya firmó con tu competencia." },
                { t: "Falta de especialización", d: "Es frustrante no encontrar los perfiles técnicos exactos que el mercado IT oculta." },
                { t: "Fuga de capital", d: "La rotación por una mala elección cuesta hasta un 30% del salario anual del puesto vacante." }
              ].map((p, i) => (
                <Card key={i} className="group hover:bg-brand-black transition-all duration-700">
                   <div className="p-12 space-y-6">
                      <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center transition-all duration-700 group-hover:bg-brand-orange group-hover:text-white" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </div>
                      <h3 className="text-3xl font-black text-brand-black group-hover:text-white transition-colors uppercase tracking-tight leading-none">{p.t}</h3>
                      <p className="text-lg text-slate-500 group-hover:text-slate-400 transition-colors font-medium leading-relaxed">{p.d}</p>
                   </div>
                </Card>
              ))}
           </div>
        </div>
      </section>

      {/* 4. SERVICES - PREMIUM CARDS */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24 space-y-6">
            <span className="text-brand-blue font-black tracking-[0.4em] uppercase text-xs">Nuestro Valor Agregado</span>
            <h2 className="text-5xl md:text-[6rem] font-black tracking-tighter leading-none">Un modelo para <br className="hidden md:block" /> cada necesidad.</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="border-t-8 border-brand-blue">
               <div className="p-12 sm:p-20 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black text-brand-black uppercase tracking-tighter leading-none">Reclutamiento Especializado</h3>
                    <p className="text-xl text-slate-500 font-medium">Headhunting de alto nivel para perfiles críticos.</p>
                  </div>
                  <ul className="space-y-6">
                    {['Búsqueda directa y confidencial', 'Evaluación técnica profunda', 'Garantía de reposición extendida'].map((item, i) => (
                      <li key={i} className="flex items-center gap-4 text-brand-black font-bold uppercase tracking-widest text-[10px]">
                        <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
               </div>
            </Card>

            <Card className="border-t-8 border-brand-orange">
               <div className="p-12 sm:p-20 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black text-brand-black uppercase tracking-tighter leading-none">Reclutamiento Masivo</h3>
                    <p className="text-xl text-slate-500 font-medium">Cobertura ágil para expansiones aceleradas.</p>
                  </div>
                  <ul className="space-y-6">
                    {['Velocidad de cobertura garantizada', 'Filtros automatizados por IA', 'Onboarding simplificado'].map((item, i) => (
                      <li key={i} className="flex items-center gap-4 text-brand-black font-bold uppercase tracking-widest text-[10px]">
                        <div className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
               </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. FORM SECTION - STITCH MODAL LOOK */}
      <section id="contacto" className="py-32 bg-brand-slate relative pb-60">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-[4rem] p-12 md:p-24 shadow-premium border border-slate-100 relative overflow-hidden transition-all hover:shadow-premium-hover duration-700">
               {/* Background blur decoration */}
               <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/5 rounded-full blur-[80px] pointer-events-none"></div>
               
               <div className="relative z-10 flex flex-col lg:flex-row gap-20">
                  <div className="lg:w-2/5 space-y-8 text-left">
                     <h2 className="text-5xl font-black text-brand-black tracking-tighter uppercase leading-none">Inicia tu <br/> <span className="text-gradient-blue">Transformación.</span></h2>
                     <p className="text-lg text-slate-400 font-medium leading-relaxed">
                       Agenda una consultoría gratuita y construye el equipo que llevará tu empresa al siguiente nivel.
                     </p>
                     <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-4 text-brand-black font-black uppercase tracking-widest text-[10px]">
                           <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-brand-orange">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                           </div>
                           Respuesta en 24h
                        </div>
                        <div className="flex items-center gap-4 text-brand-black font-black uppercase tracking-widest text-[10px]">
                           <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-brand-blue">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                           </div>
                           Diagnóstico Gratuito
                        </div>
                     </div>
                  </div>
                  
                  <div className="lg:w-3/5 bg-slate-50/50 p-8 sm:p-12 rounded-[3rem] border border-slate-100 shadow-inner">
                    <LeadForm />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
