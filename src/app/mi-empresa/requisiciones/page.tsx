import Link from 'next/link';
import { Card } from '@/components/Card';
import { prisma } from '@/lib/prisma';
import { getSesion } from '@/lib/crm-session';
import { Plus, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

const ETIQUETA_ESTATUS: Record<string, string> = {
  abierta: 'Abierta',
  en_proceso: 'En proceso',
  terna_entregada: 'Terna entregada',
  cerrada: 'Cerrada',
  cancelada: 'Cancelada',
};

const COLOR_ESTATUS: Record<string, string> = {
  abierta: 'bg-brand-blue/20 text-brand-blue border-brand-blue/30',
  en_proceso: 'bg-brand-orange/20 text-brand-orange border-brand-orange/30',
  terna_entregada: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cerrada: 'bg-white/5 text-slate-400 border-white/10',
  cancelada: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default async function MisRequisicionesPage() {
  const sesion = await getSesion();

  // El filtro por cliente.userId es lo que impide que una empresa vea las
  // requisiciones de otra: nunca se consulta por id de la URL.
  const requisiciones = sesion
    ? await prisma.requisicion.findMany({
        where: { cliente: { userId: sesion.userId } },
        orderBy: { fechaSolicitud: 'desc' },
        include: { _count: { select: { procesos: true } } },
      })
    : [];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Mis requisiciones</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
            {requisiciones.length} en total.
          </p>
        </div>
        <Link href="/empresas/requisicion" className="inline-flex items-center gap-3 h-16 px-10 rounded-2xl bg-gradient-to-r from-brand-orange to-orange-600 text-white text-[11px] font-black uppercase tracking-widest">
          <Plus size={20} /> Nueva requisición
        </Link>
      </div>

      {requisiciones.length === 0 ? (
        <Card className="p-16 bg-white/5 border-white/10 text-center space-y-6 rounded-[3rem]">
          <p className="text-slate-400 font-medium max-w-md mx-auto">
            Aún no hay requisiciones vinculadas a tu cuenta. Solicita talento y tu
            reclutador la asociará para que puedas seguir el proceso desde aquí.
          </p>
          <Link href="/empresas/requisicion" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
            Solicitar talento <ArrowRight size={14} />
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {requisiciones.map(r => (
            <Card key={r.id} className="p-8 bg-white/5 backdrop-blur-3xl border-white/10 rounded-[2.5rem]">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="min-w-0 space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{r.puesto}</h3>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>{r.zona || 'Sin zona'}</span>
                    {r.turno && <span>Turno {r.turno}</span>}
                    <span>Solicitada el {r.fechaSolicitud.toLocaleDateString('es-MX')}</span>
                    <span className="text-brand-blue">{r._count.procesos} candidatos en proceso</span>
                  </div>
                </div>
                <span className={`text-[9px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest border ${COLOR_ESTATUS[r.estatus] ?? COLOR_ESTATUS.cerrada}`}>
                  {ETIQUETA_ESTATUS[r.estatus] ?? r.estatus}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
