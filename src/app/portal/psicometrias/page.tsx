import Link from 'next/link';
import { Card } from '@/components/Card';
import { prisma } from '@/lib/prisma';
import { getSesion } from '@/lib/crm-session';
import { BrainCircuit, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

const COLOR_ESTADO: Record<string, string> = {
  completado: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  procesando: 'bg-brand-orange/20 text-brand-orange border-brand-orange/30',
  pendiente: 'bg-white/5 text-slate-400 border-white/10',
  fallido: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default async function PortalPsicometriasPage() {
  const sesion = await getSesion();

  const candidato = sesion
    ? await prisma.candidate.findUnique({
        where: { userId: sesion.userId },
        include: {
          testResults: { orderBy: { createdAt: 'desc' }, include: { test: true } },
        },
      })
    : null;

  const resultados = candidato?.testResults ?? [];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Mis psicometrías</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
            {resultados.length} evaluación{resultados.length === 1 ? '' : 'es'} presentada{resultados.length === 1 ? '' : 's'}.
          </p>
        </div>
        <Link href="/psicometrias" className="inline-flex items-center gap-3 h-16 px-10 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
          <BrainCircuit size={20} /> Ver catálogo
        </Link>
      </div>

      {resultados.length === 0 ? (
        <Card className="p-16 bg-white/5 border-white/10 text-center space-y-6 rounded-[3rem]">
          <p className="text-slate-400 font-medium max-w-md mx-auto">
            Aún no has presentado ninguna evaluación. Las psicometrías ayudan al
            reclutador a colocarte en la vacante correcta.
          </p>
          <Link href="/psicometrias" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-orange to-orange-600 text-white text-[10px] font-black uppercase tracking-widest">
            Empezar una evaluación <ArrowRight size={14} />
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {resultados.map(r => (
            <Card key={r.id} className="p-8 bg-white/5 backdrop-blur-3xl border-white/10 rounded-[2.5rem]">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="min-w-0 space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{r.test.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>{r.createdAt.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    {r.score !== null && <span className="text-brand-blue">Puntaje {r.score}</span>}
                  </div>
                  {r.summary && (
                    <p className="text-slate-400 text-sm font-medium max-w-2xl pt-2">{r.summary}</p>
                  )}
                </div>
                <span className={`text-[9px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest border shrink-0 ${COLOR_ESTADO[r.status] ?? COLOR_ESTADO.pendiente}`}>
                  {r.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
