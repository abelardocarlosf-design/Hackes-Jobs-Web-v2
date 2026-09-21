import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { tipoSeguimientoLabel, formatoFecha, diasRelativos } from '@/lib/crm';
import { CrmHeader } from '@/components/crm/CrmShell';
import { CompletarSeguimiento } from '@/components/crm/CompletarSeguimiento';
import { Phone, Mail } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SeguimientosPage({
  searchParams,
}: {
  searchParams: { estado?: string };
}) {
  const estado = searchParams.estado || 'pendientes';

  const where =
    estado === 'completados'
      ? { completado: true }
      : estado === 'vencidos'
        ? { completado: false, fechaLimite: { lte: new Date() } }
        : { completado: false };

  const [seguimientos, vencidos, pendientes] = await Promise.all([
    prisma.seguimiento.findMany({
      where,
      orderBy: estado === 'completados' ? { completadoEn: 'desc' } : { fechaLimite: 'asc' },
      take: 100,
      include: { candidato: { select: { id: true, nombre: true, telefono: true, email: true } } },
    }),
    prisma.seguimiento.count({ where: { completado: false, fechaLimite: { lte: new Date() } } }),
    prisma.seguimiento.count({ where: { completado: false } }),
  ]);

  const filtros = [
    { id: 'pendientes', label: `Pendientes (${pendientes})` },
    { id: 'vencidos', label: `Vencidos (${vencidos})` },
    { id: 'completados', label: 'Completados' },
  ];

  return (
    <>
      <CrmHeader
        titulo="Seguimientos"
        subtitulo="Las tareas pendientes con cada candidato. Las automáticas se agendan solas al mover una etapa."
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {filtros.map((f) => (
          <Link key={f.id} href={`/crm/seguimientos?estado=${f.id}`}
            className={`px-5 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
              estado === f.id
                ? 'bg-brand-orange/15 border-brand-orange/30 text-brand-orange'
                : 'border-white/10 text-slate-500 hover:text-white'
            }`}>
            {f.label}
          </Link>
        ))}
      </div>

      {seguimientos.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-16 text-center">
          <p className="text-white font-black text-lg mb-2">Nada por aquí</p>
          <p className="text-slate-500 font-medium">
            {estado === 'completados'
              ? 'Aún no hay seguimientos completados.'
              : 'No hay seguimientos pendientes. Todo al corriente.'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/5 overflow-hidden">
          {seguimientos.map((s) => {
            const vencido = !s.completado && new Date(s.fechaLimite) <= new Date();
            return (
              <div key={s.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <CompletarSeguimiento id={s.id} completado={s.completado} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Link href={`/crm/candidatos/${s.candidato.id}`}
                      className="text-white font-black text-sm hover:text-brand-orange transition-colors">
                      {s.candidato.nombre}
                    </Link>
                    <span className="px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-wider">
                      {tipoSeguimientoLabel(s.tipo)}
                    </span>
                    {s.automatico && (
                      <span className="px-2.5 py-0.5 rounded-full border border-white/10 text-slate-600 text-[9px] font-black uppercase tracking-wider">
                        automático
                      </span>
                    )}
                  </div>

                  {s.nota && <p className="text-slate-500 text-xs mt-1.5">{s.nota}</p>}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-slate-600 text-[11px] font-medium">
                    {s.candidato.telefono && (
                      <a href={`tel:${s.candidato.telefono}`} className="flex items-center gap-1.5 hover:text-brand-orange transition-colors">
                        <Phone size={11} />{s.candidato.telefono}
                      </a>
                    )}
                    {s.candidato.email && (
                      <a href={`mailto:${s.candidato.email}`} className="flex items-center gap-1.5 hover:text-brand-orange transition-colors truncate">
                        <Mail size={11} />{s.candidato.email}
                      </a>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${
                    s.completado ? 'text-emerald-400' : vencido ? 'text-red-400' : 'text-slate-500'
                  }`}>
                    {s.completado ? 'Completado' : diasRelativos(s.fechaLimite)}
                  </p>
                  <p className="text-slate-700 text-[10px] font-bold mt-0.5">
                    {formatoFecha(s.completado ? s.completadoEn : s.fechaLimite)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
