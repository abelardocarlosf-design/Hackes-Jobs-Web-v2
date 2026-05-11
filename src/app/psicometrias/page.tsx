import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Brain, Briefcase, Activity, ShieldCheck, ArrowRight } from 'lucide-react';
import { testsByLevel } from '@/lib/psicometriasConfig';

export const metadata: Metadata = {
  title: 'Suite Psicométrica · Catálogo de Tests',
  description: 'Catálogo de evaluaciones psicométricas validadas con scoring automático. Pago por test en MXN ($349, $519, $867) vía Stripe. Reportes PDF entregables.',
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
      <div className="page-overlay"></div>
      <div className="page-dotgrid"></div>

      {/* Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 text-white relative z-10">
        <div className="container relative mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-bold tracking-[0.25em] uppercase">
              <span className="flex h-2 w-2 rounded-full bg-brand-orange"></span>
              Suite Psicométrica
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.05]">
              Catálogo de evaluaciones <span className="text-brand-orange">validadas</span>.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              Pruebas con scoring automático y reporte PDF profesional. Pago por test en MXN vía Stripe — $349, $519 y $867 según nivel.
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
                  const isComingSoon = test.comingSoon === true;
                  return (
                    <Card
                      key={test.slug}
                      className={`card-premium p-0 rounded-3xl overflow-hidden group relative flex flex-col ${isComingSoon ? 'opacity-90' : ''}`}
                    >
                      {isComingSoon && (
                        <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange text-[9px] font-black uppercase tracking-[0.25em]">
                          <span className="flex h-1.5 w-1.5 rounded-full bg-brand-orange"></span>
                          Próximamente
                        </div>
                      )}
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

                          {isComingSoon ? (
                            <Button
                              variant="outline"
                              disabled
                              className="h-10 px-5 text-[10px] font-black rounded-xl uppercase tracking-widest border-white/15 text-slate-500 bg-white/[0.02]"
                            >
                              Próximamente
                            </Button>
                          ) : (
                            <Link href={`/psicometrias/${test.slug}`}>
                              <Button variant="secondary" className="h-10 px-5 text-[10px] font-black rounded-xl uppercase tracking-widest btn-elev">
                                Iniciar <ArrowRight size={14} className="ml-1" />
                              </Button>
                            </Link>
                          )}
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
