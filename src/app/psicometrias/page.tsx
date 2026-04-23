import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Illustration } from '@/components/Illustration';

export const metadata: Metadata = {
  title: 'Evaluaciones Psicométricas | Hacke\'s Jobs',
  description: 'Descubre el potencial de tu talento con nuestras pruebas psicométricas validadas. Test DISC y más para una selección de personal objetiva y científica.',
};

export default function PsicometriasPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-brand-orange/20 selection:text-brand-orange">
      
      {/* Header Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-brand-black text-white relative overflow-hidden" aria-labelledby="psicometria-hero">
        <div className="absolute inset-0 bg-[url('/grid-light.svg')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-brand-orange text-xs sm:text-sm font-black tracking-[0.2em] uppercase mb-8 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-pulse" aria-hidden="true"></span>
                Módulo de Evaluación Científica
              </div>
              
              <h1 id="psicometria-hero" className="text-5xl sm:text-7xl font-black tracking-tighter mb-8 leading-none">
                Evaluaciones <br className="hidden sm:block" /> <span className="text-brand-blue">Psicométricas.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-400 max-w-3xl leading-relaxed font-medium">
                Descubre el verdadero potencial de tus candidatos en México. Nuestras pruebas validadas te ayudarán a tomar decisiones <span className="text-white font-bold underline decoration-brand-orange underline-offset-4">basadas en datos objetivos y comportamiento predecible.</span>
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <Illustration 
                src="/images/psicometria-illustration.png"
                alt="Ilustración detallando el análisis de perfiles psicológicos y psicométricos para reclutamiento"
                width={500}
                height={400}
                priority={true}
                className="w-full max-w-md shadow-2xl shadow-brand-blue/5 border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tests Section */}
      <section className="py-24 md:py-32 container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl" aria-labelledby="catalog-title">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-left">
          <div className="max-w-xl">
            <h2 id="catalog-title" className="text-4xl md:text-5xl font-black text-brand-black tracking-tighter">Catálogo de pruebas</h2>
            <div className="w-16 h-1.5 bg-brand-orange mt-4 rounded-full" aria-hidden="true"></div>
          </div>
          <p className="text-slate-500 text-xl font-medium">Selecciona un test validado para iniciar el proceso de evaluación profesional.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Test DISC Card */}
          <Card className="border-none shadow-2xl shadow-slate-200/60 hover:shadow-brand-blue/10 hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] bg-white overflow-hidden group">
            <div className="h-2 w-full bg-brand-blue" aria-hidden="true"></div>
            <CardHeader className="p-10 pb-4">
              <div className="flex justify-between items-start mb-8">
                <div className="w-20 h-20 bg-brand-blue/10 text-brand-blue rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:bg-brand-blue group-hover:text-white" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <span className="bg-slate-50 text-brand-black text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border border-slate-100 shadow-sm">Comportamiento Organizacional</span>
              </div>
              <CardTitle className="text-4xl font-black text-brand-black tracking-tight mb-2">Test DISC</CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-4">
              <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
                Evalúa el comportamiento predecible y la personalidad en el entorno laboral de alto rendimiento. Mide <span className="text-brand-blue font-bold tracking-tight italic">Dominancia, Influencia, Estabilidad y Cumplimiento.</span>
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 mb-12 font-black uppercase tracking-wider">
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm">
                  <svg className="text-brand-orange" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  15 - 20 min
                </div>
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm">
                  <svg className="text-brand-blue" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  24 preguntas
                </div>
              </div>

              <Link href="/psicometrias/disc" className="block w-full">
                <Button variant="secondary" className="w-full h-20 text-2xl font-black rounded-2xl shadow-xl shadow-brand-orange/20 hover:shadow-brand-orange/40 transition-all duration-500" aria-label="Comenzar Test DISC ahora">
                  Iniciar test gratuito
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Placeholder for future test */}
          <Card className="border-2 border-slate-200 border-dashed rounded-[2.5rem] bg-white flex flex-col items-center justify-center p-16 text-center opacity-60 hover:opacity-100 transition-all duration-500 hover:border-brand-blue/30 group">
            <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:bg-brand-blue/5 group-hover:text-brand-blue" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            </div>
            <h3 className="text-3xl font-black text-slate-400 mb-4 tracking-tighter uppercase transition-colors group-hover:text-brand-black">Más pruebas de talento</h3>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-[280px]">Estamos integrando nuevos tests de inteligencia emocional y habilidades cognitivas avanzadas.</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
