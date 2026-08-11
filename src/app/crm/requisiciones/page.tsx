import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatoFecha } from '@/lib/crm';
import { CrmHeader } from '@/components/crm/CrmShell';
import { MapPin, Users, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

const ESTATUS_CLASES: Record<string, string> = {
  abierta: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  en_proceso: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  terna_entregada: 'bg-brand-orange/15 text-brand-orange border-brand-orange/25',
  cerrada: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
  cancelada: 'bg-red-500/15 text-red-300 border-red-500/25',
};

const ESTATUS_LABEL: Record<string, string> = {
  abierta: 'Abierta',
  en_proceso: 'En proceso',
  terna_entregada: 'Terna entregada',
  cerrada: 'Cerrada',
  cancelada: 'Cancelada',
};

export default async function RequisicionesPage({
  searchParams,
}: {
  searchParams: { estatus?: string };
}) {
  const estatus = searchParams.estatus || '';

  const requisiciones = await prisma.requisicion.findMany({
    where: estatus ? { estatus } : {},
    orderBy: { createdAt: 'desc' },
    include: {
      cliente: { select: { razonSocial: true, zona: true } },
      _count: { select: { procesos: true } },
    },
  });

  return (
    <>
      <CrmHeader
        titulo="Requisiciones"
        subtitulo={`${requisiciones.length} ${requisiciones.length === 1 ? 'vacante' : 'vacantes'} en cartera.`}
      />

      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/crm/requisiciones"
          className={`px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
            !estatus ? 'bg-white/10 border-white/25 text-white' : 'border-white/10 text-slate-500 hover:text-white'
          }`}>
          Todas
        </Link>
        {Object.entries(ESTATUS_LABEL).map(([id, label]) => (
          <Link key={id} href={`/crm/requisiciones?estatus=${id}`}
            className={`px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
              estatus === id ? ESTATUS_CLASES[id] : 'border-white/10 text-slate-500 hover:text-white'
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {requisiciones.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-16 text-center">
          <p className="text-white font-black text-lg mb-2">Sin requisiciones</p>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">
            Las requisiciones llegan desde el formulario de empresas y desde n8n
            (<code className="text-slate-400">/api/n8n/requisiciones/intake</code>).
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {requisiciones.map((r) => (
            <Link key={r.id} href={`/crm/requisiciones/${r.id}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-brand-orange/40 hover:bg-white/[0.07] transition-all group">
              <div className="flex items-start justify-between gap-3 mb-4">
                <h2 className="text-white font-black text-lg leading-tight group-hover:text-brand-orange transition-colors">
                  {r.puesto}
                </h2>
                <span className={`px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider shrink-0 ${ESTATUS_CLASES[r.estatus] || ''}`}>
                  {ESTATUS_LABEL[r.estatus] || r.estatus}
                </span>
              </div>

              <p className="text-slate-400 font-bold text-sm mb-4">{r.cliente.razonSocial}</p>

              <div className="space-y-2 text-slate-500 text-xs font-medium">
                {(r.zona || r.cliente.zona) && (
                  <p className="flex items-center gap-2"><MapPin size={12} />{r.zona || r.cliente.zona}</p>
                )}
                <p className="flex items-center gap-2"><Users size={12} />
                  {r._count.procesos} {r._count.procesos === 1 ? 'candidato' : 'candidatos'}
                </p>
                <p className="flex items-center gap-2"><Clock size={12} />
                  Solicitada {formatoFecha(r.fechaSolicitud)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
