import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { getAllJobs } from '@/lib/jobs';
import Link from 'next/link';

export default async function VacantesPage() {
  const jobs = await getAllJobs();
  const activeJobs = jobs.filter(j => j.active);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-brand-orange/20 selection:text-brand-orange font-sans">
      {/* Header Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-brand-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-light.svg')] opacity-[0.05]"></div>
        <div className="container relative mx-auto px-4 text-center z-10 max-w-4xl">
          <span className="text-brand-blue font-black tracking-[0.4em] uppercase text-[10px] mb-6 block">Talento Extraordinario</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none">Oportunidades <br/> <span className="text-gradient-blue">Reales.</span></h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">Conectamos tu potencial con las mejores vacantes en tecnología y negocios de México.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl -mt-12 relative z-20 pb-32">
        <div className="grid gap-8">
          {activeJobs.length > 0 ? activeJobs.map((vacante) => (
            <Card key={vacante.id} className="group overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-10 md:p-14 gap-10">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                     <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-brand-blue/20">
                       {vacante.category}
                     </span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Publicado hoy</span>
                  </div>
                  
                  <h3 className="text-3xl font-black text-brand-black tracking-tighter group-hover:text-brand-blue transition-colors uppercase leading-none">{vacante.title}</h3>
                  
                  <div className="text-slate-500 font-bold text-xs flex flex-wrap gap-x-6 gap-y-3 uppercase tracking-widest">
                    <span className="text-brand-orange flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div>
                       {vacante.company}
                    </span>
                    <span>{vacante.location}</span>
                    <span className="text-slate-400">{vacante.type}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {vacante.requirements.slice(0, 3).map(req => (
                      <span key={req} className="bg-slate-50 text-slate-400 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-100 uppercase tracking-widest">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col md:items-end gap-8 shrink-0">
                  <div className="text-brand-black font-black text-2xl tracking-tighter italic bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">{vacante.salary}</div>
                  <Button variant="secondary" size="xl" className="rounded-2xl px-12 h-16 font-black text-xs uppercase tracking-widest shadow-orange/40">
                    Aplicar ahora
                  </Button>
                </div>
              </div>
            </Card>
          )) : (
            <div className="text-center py-40 bg-white rounded-[3rem] border border-dashed border-slate-200">
               <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs">Aún no hay vacantes activas</p>
            </div>
          )}
        </div>
        
        <div className="mt-20 text-center">
          <p className="text-slate-300 font-black uppercase tracking-[0.5em] text-[10px]">Actualizado por Hacke's Jobs Hub</p>
        </div>
      </div>
    </div>
  );
}
