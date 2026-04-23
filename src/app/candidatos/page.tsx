import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { Illustration } from '@/components/Illustration';

export const metadata: Metadata = {
  title: 'Oportunidades para Candidatos | Hacke\'s Jobs',
  description: 'Impulsa tu carrera profesional con Hacke\'s Jobs. Conectamos tu talento con las mejores empresas. Encuentra vacantes, realiza pruebas psicométricas y crece con nosotros.',
};

export default function CandidatosPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-brand-orange/20 selection:text-brand-orange overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center pt-32 pb-24 overflow-hidden bg-brand-white">
        <div className="absolute inset-0 bg-[url('/grid-light.svg')] bg-center opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-brand-blue/5 rounded-full blur-[150px] animate-pulse-slow"></div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-3/5 space-y-10 text-left">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-brand-black text-white text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl animate-in fade-in slide-in-from-left-4 duration-1000">
                <span className="flex h-2 w-2 rounded-full bg-brand-blue animate-pulse" aria-hidden="true"></span>
                Talento Extraordinario en México
              </div>
              
              <h1 className="text-6xl sm:text-7xl md:text-[6.5rem] font-black tracking-tighter text-brand-black leading-[0.85] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                Impulsa tu <br/>
                <span className="text-gradient-blue">Carrera Profesional.</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-slate-400 max-w-2xl leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                Conectamos tu potencial con las mejores oportunidades laborales en México. Nuestro proceso es <span className="text-brand-black font-black italic">transparente, rápido y enfocado 100% en tu crecimiento.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
                <Link href="/vacantes">
                  <Button variant="secondary" size="xl" className="w-full sm:w-auto shadow-orange/60">
                    Ver vacantes disponibles
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-3">
                      {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 shadow-sm"></div>)}
                   </div>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">+500 Candidatos <br/> evaluados con éxito</p>
                </div>
              </div>
            </div>

            <div className="lg:w-2/5 relative animate-in fade-in zoom-in duration-1000 delay-300">
              <Illustration 
                src="/images/candidatos-illustration.png"
                alt="Candidatos Hackes Jobs"
                width={500}
                height={600}
                priority={true}
                className="w-full max-w-md lg:max-w-none animate-float drop-shadow-[0_35px_35px_rgba(30,64,175,0.15)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROCESS SECTION - STITCH STEPS */}
      <section className="py-32 bg-brand-black relative z-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/grid-light.svg')] opacity-[0.05] pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-24 space-y-6">
            <span className="text-brand-blue font-black tracking-[0.4em] uppercase text-xs">Tu Camino al Éxito</span>
            <h2 className="text-5xl md:text-[5rem] font-black tracking-tighter leading-none text-white uppercase">¿Cómo aplicar con nosotros?</h2>
            <div className="w-24 h-2 bg-brand-orange mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-white/10 -z-10"></div>
            {[
              { n: '01', t: 'Postulación Ágil', d: 'Aplica a las vacantes que hagan match perfecto con tus valores y expectativas salariales.' },
              { n: '02', t: 'Entrevista Profunda', d: 'Realiza pruebas psicométricas validadas por expertos y cuéntanos tu historia.' },
              { n: '03', t: 'Tu Nuevo Reto', d: 'Te acompañamos en el proceso de oferta y contratación para asegurar tu éxito.' }
            ].map((step, i) => (
              <div key={i} className="space-y-6 text-center group">
                <div className="w-24 h-24 bg-white/5 border border-white/10 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black mx-auto transition-all duration-500 group-hover:bg-brand-blue group-hover:text-white group-hover:scale-110 shadow-2xl">
                   {step.n}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{step.t}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-[280px] mx-auto">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CTA & SOCIAL PROOF */}
      <section className="py-32 bg-brand-slate relative pb-60">
        <div className="container mx-auto px-4">
          <Card className="max-w-6xl mx-auto overflow-hidden bg-brand-orange text-white shadow-orange">
             <div className="p-12 sm:p-24 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10 space-y-8 text-center md:text-left">
                   <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">¿Listo para tu <br/> próximo gran reto?</h2>
                   <p className="text-xl md:text-2xl font-medium text-white/80 max-w-xl">
                     Nuestra bolsa de trabajo se actualiza diariamente con oportunidades en las mejores empresas de México.
                   </p>
                </div>
                <Link href="/vacantes" className="relative z-10">
                   <Button variant="dark" size="xl" className="h-24 px-16 text-2xl shadow-premium hover:scale-110 bg-white text-brand-orange hover:bg-slate-50 border-0">
                      Explorar Vacantes
                   </Button>
                </Link>
             </div>
          </Card>
          
          <div className="mt-20 text-center space-y-4">
             <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-[10px]">Actualizado hoy por el equipo de Hacke's Jobs</p>
          </div>
        </div>
      </section>
    </div>
  );
}
