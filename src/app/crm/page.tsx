import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCrmUser } from '@/lib/crm-session';
import { ETAPAS, ETAPA_CLASES, formatoFecha, diasRelativos } from '@/lib/crm';
import { CrmHeader } from '@/components/crm/CrmShell';
import { Users, Briefcase, FileUp, AlertTriangle, ArrowRight, Inbox } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CrmPanelPage() {
  const user = await getCrmUser();

  const [porEtapa, totalCandidatos, conCV, sinProceso, requisiciones, vencidos, recientes] =
    await Promise.all([
      prisma.proceso.groupBy({ by: ['etapa'], _count: true }),
      prisma.candidato.count(),
      prisma.candidato.count({ where: { cvKey: { not: null } } }),
      prisma.candidato.count({ where: { procesos: { none: {} } } }),
      prisma.requisicion.groupBy({ by: ['estatus'], _count: true }),
      prisma.seguimiento.findMany({
        where: { completado: false, fechaLimite: { lte: new Date() } },
        orderBy: { fechaLimite: 'asc' },
        take: 5,
        include: { candidato: { select: { id: true, nombre: true } } },
      }),
      prisma.candidato.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, nombre: true, puestoInteres: true, fuente: true, createdAt: true, cvKey: true },
      }),
    ]);

  const cuenta = (etapa: string) => porEtapa.find((p) => p.etapa === etapa)?._count ?? 0;
  const reqAbiertas = requisiciones
    .filter((r) => ['abierta', 'en_proceso', 'terna_entregada'].includes(r.estatus))
    .reduce((a, r) => a + r._count, 0);
  const reqTotal = requisiciones.reduce((a, r) => a + r._count, 0);

  return (
    <>
      <CrmHeader
        titulo="Panel de reclutamiento"
        subtitulo={`Bienvenido de nuevo, ${user?.name ?? ''}. Esto es lo que hay hoy.`}
        acciones={
          <>
            <Link href="/crm/candidatos/nuevo"
              className="h-12 px-6 rounded-xl bg-brand-orange text-white font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 hover:scale-[1.02] transition-transform">
              <FileUp size={16} /> Alta de candidato
            </Link>
            <Link href="/crm/candidatos"
              className="h-12 px-6 rounded-xl border border-white/15 bg-white/5 text-white font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 hover:border-brand-orange/40 transition-all">
              <Users size={16} /> Ver candidatos
            </Link>
          </>
        }
      />

      {/* Pipeline */}
      <section className="mb-10">
        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-5">
          Pipeline general
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
          {ETAPAS.map((e) => (
            <Link key={e.id} href={`/crm/candidatos?etapa=${e.id}`}
              className={`rounded-2xl border p-5 hover:scale-[1.03] transition-transform ${ETAPA_CLASES[e.id]}`}>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] opacity-80 leading-tight">
                {e.label}
              </p>
              <p className="text-4xl font-black text-white mt-3">{cuenta(e.id)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Cifras */}
      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Candidatos', valor: totalCandidatos, icono: Users, pie: `${conCV} con CV` },
          { label: 'Sin proceso', valor: sinProceso, icono: Inbox, pie: 'Talento disponible' },
          { label: 'Requisiciones', valor: reqTotal, icono: Briefcase, pie: `${reqAbiertas} abiertas` },
          { label: 'Seguimientos vencidos', valor: vencidos.length, icono: AlertTriangle, pie: 'Requieren acción' },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{c.label}</p>
              <c.icono size={18} className="text-slate-600" />
            </div>
            <p className="text-5xl font-black text-white mt-3">{c.valor}</p>
            <p className="text-slate-500 text-xs font-bold mt-2">{c.pie}</p>
          </div>
        ))}
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Seguimientos vencidos */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
              Seguimientos vencidos
            </h2>
            <Link href="/crm/seguimientos" className="text-brand-orange text-[11px] font-black uppercase tracking-widest hover:text-orange-400 flex items-center gap-1">
              Ver todos <ArrowRight size={13} />
            </Link>
          </div>

          {vencidos.length === 0 ? (
            <p className="text-slate-500 font-medium text-sm py-6 text-center">
              Nada vencido. Todo al corriente.
            </p>
          ) : (
            <ul className="divide-y divide-white/5">
              {vencidos.map((s) => (
                <li key={s.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <Link href={`/crm/candidatos/${s.candidato.id}`}
                      className="text-white font-bold text-sm hover:text-brand-orange transition-colors truncate block">
                      {s.candidato.nombre}
                    </Link>
                    <p className="text-slate-500 text-xs truncate">{s.nota || s.tipo}</p>
                  </div>
                  <span className="text-red-400 text-[10px] font-black uppercase tracking-widest shrink-0">
                    {diasRelativos(s.fechaLimite)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Candidatos recientes */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
              Últimos candidatos
            </h2>
            <Link href="/crm/candidatos" className="text-brand-orange text-[11px] font-black uppercase tracking-widest hover:text-orange-400 flex items-center gap-1">
              Ver todos <ArrowRight size={13} />
            </Link>
          </div>

          {recientes.length === 0 ? (
            <p className="text-slate-500 font-medium text-sm py-6 text-center">
              Aún no hay candidatos. Los que envíen su CV desde la web aparecerán aquí.
            </p>
          ) : (
            <ul className="divide-y divide-white/5">
              {recientes.map((c) => (
                <li key={c.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <Link href={`/crm/candidatos/${c.id}`}
                      className="text-white font-bold text-sm hover:text-brand-orange transition-colors truncate block">
                      {c.nombre}
                    </Link>
                    <p className="text-slate-500 text-xs truncate">
                      {c.puestoInteres || 'Sin puesto indicado'} · {c.fuente || 'sin fuente'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      {formatoFecha(c.createdAt)}
                    </p>
                    {c.cvKey && (
                      <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">CV</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
