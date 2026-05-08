import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Typewriter } from '@/components/Typewriter';
import { Brain, Briefcase, Activity, ShieldCheck, ArrowRight } from 'lucide-react';
import { testsByLevel } from '@/lib/psicometriasConfig';

export const metadata: Metadata = {
  title: 'Catálogo de Evaluaciones Psicométricas | Hacke\'s Jobs',
  description: 'Descubre el potencial de tu talento con nuestras pruebas psicométricas validadas.',
};

const levelConfig: Record<string, { color: string; label: string; icon: any; border: string }> = {
  basico: { color: 'text-emerald-500', label: 'Nivel Básico', icon: Activity, border: 'border-emerald-200 bg-emerald-50' },
  intermedio: { color: 'text-brand-blue', label: 'Nivel Intermedio', icon: Briefcase, border: 'border-blue-200 bg-blue-50' },
  avanzado: { color: 'text-brand-orange', label: 'Nivel Avanzado', icon: Brain, border: 'border-orange-200 bg-orange-50' },
  premium: { color: 'text-purple-500', label: 'Nivel Clínico / Premium', icon: ShieldCheck, border: 'border-purple-200 bg-purple-50' }
};

export default function PsicometriasPage() {
  const levels = ['basico', 'intermedio', 'avanzado', 'premium'] as const;
  
  return (
    <div className="flex flex-col min-h-screen bg-brand-black font-sans selection:bg-brand-orange/40 selection:text-white pb-32 relative">
      {/* Full page dynamic background - City Theme */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="/images/hero-bg.gif" 
          alt="" 
          className="w-full h-full object-cover opacity-[0.2]"
        />
        <div className="absolute inset-0 bg-brand-black/20"></div>
      </div>
      
      {/* Header Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 text-white relative overflow-hidden z-10">
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
          <div className="flex flex-col items-center justify-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-brand-orange text-xs sm:text-sm font-black tracking-[0.2em] uppercase mb-8 shadow-sm backdrop-blur-xl">
              <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-pulse" aria-hidden="true"></span>
              Evaluación Científica 4.0
            </div>
            <h1 className="text-5xl md:text-[6.5rem] font-black tracking-tighter text-white leading-none uppercase flex flex-col items-center gap-2 mb-8">
              <span className="leading-none"><Typewriter text="Catálogo de" speed={70} delay={400} /></span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-blue leading-[1.2] py-2">
                Psicometrías IA.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl leading-relaxed font-medium drop-shadow-lg">
              Descubre el potencial oculto de tu talento con evaluaciones validadas científicamente y potenciadas por algoritmos adaptativos.
            </p>
          </div>
        </div>
      </section>

      {/* Tests Catalog */}
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl mt-12 space-y-24 z-10">
        
        {levels.map(levelKey => {
          const levelTests = testsByLevel[levelKey];
          if (!levelTests || levelTests.length === 0) return null;

          const config = levelConfig[levelKey];
          const Icon = config.icon;

          return (
            <section key={levelKey} className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${config.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">{config.label}</h2>
                  <p className="text-slate-400 font-medium">
                    {levelKey === 'basico' ? 'Evaluaciones fundamentales gratuitas.' : `Acceso Profesional - Mide dimensiones profundas.`}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {levelTests.map(test => {
                  return (
                    <Card key={test.slug} className={`glass-card p-0 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-white/10 border-white/10 group relative flex flex-col`}>
                      <div className="p-8 pb-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg self-start inline-block ${config.color} bg-white/5 border border-white/10 mb-4`}>
                          {test.categoria}
                        </span>
                        <h3 className="text-xl font-black text-white leading-tight uppercase">
                          {test.nombre}
                        </h3>
                      </div>
                      
                      <div className="p-8 pt-2 flex-1 flex flex-col">
                        <p className="text-sm text-slate-400 font-medium mb-6 flex-1 leading-relaxed">
                          {test.descripcion}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex gap-2">
                            <div className="text-[10px] font-black text-slate-300 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 uppercase tracking-widest">
                              ⏱ {test.duracion}
                            </div>
                            <div className={`text-[10px] font-black flex items-center gap-1.5 px-3 py-1.5 rounded-lg border uppercase tracking-widest ${test.precio > 0 ? 'text-brand-orange bg-brand-orange/10 border-brand-orange/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'}`}>
                              {test.precioFormateado}
                            </div>
                          </div>
                          
                          <Link href={`/psicometrias/${test.slug}`}>
                            <Button variant="secondary" className="h-10 px-5 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-orange/40">
                              Iniciar <ArrowRight size={14} className="ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
