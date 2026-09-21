import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatoFecha, calidadMatch, CALIDAD_META, type CalidadMatch } from '@/lib/crm';
import { CrmHeader } from '@/components/crm/CrmShell';
import { TableroPipeline } from '@/components/crm/TableroPipeline';
import { EvaluarAplicantes } from '@/components/crm/EvaluarAplicantes';
import { ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RequisicionDetallePage({ params }: { params: { id: string } }) {
  const requisicion = await prisma.requisicion.findUnique({
    where: { id: params.id },
    include: {
      cliente: true,
      procesos: {
        orderBy: { updatedAt: 'desc' },
        include: {
          candidato: {
            select: { id: true, nombre: true, telefono: true, email: true, cvKey: true, zona: true },
          },
        },
      },
    },
  });

  if (!requisicion) notFound();

  const banda =
    requisicion.bandaSalarialMin || requisicion.bandaSalarialMax
      ? `$${(requisicion.bandaSalarialMin ?? 0).toLocaleString('es-MX')} – $${(requisicion.bandaSalarialMax ?? 0).toLocaleString('es-MX')}`
      : '—';

  return (
    <>
      <nav className="flex items-center gap-2 text-xs font-bold mb-6">
        <Link href="/crm/requisiciones" className="text-brand-orange hover:text-orange-400 transition-colors">
          Requisiciones
        </Link>
        <ChevronRight size={13} className="text-slate-700" />
        <span className="text-slate-500">{requisicion.puesto}</span>
      </nav>

      <CrmHeader
        titulo={requisicion.puesto}
        subtitulo={`${requisicion.cliente.razonSocial} · solicitada ${formatoFecha(requisicion.fechaSolicitud)}`}
        acciones={<EvaluarAplicantes requisicionId={requisicion.id} />}
      />

      {/* Reparto por calidad de match, como los chips de la referencia */}
      {requisicion.procesos.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          {(['sobresaliente', 'potencial', 'descartable'] as CalidadMatch[]).map((c) => {
            const n = requisicion.procesos.filter((p) => calidadMatch(p.scoreMatch) === c).length;
            return (
              <span key={c}
                className={`px-4 py-2 rounded-xl border text-[11px] font-black uppercase tracking-wider ${CALIDAD_META[c].clases}`}>
                {n} {CALIDAD_META[c].label}
              </span>
            );
          })}
          {requisicion.procesos.some((p) => p.scoreMatch == null) && (
            <span className="px-4 py-2 rounded-xl border border-white/10 text-slate-500 text-[11px] font-black uppercase tracking-wider">
              {requisicion.procesos.filter((p) => p.scoreMatch == null).length} sin evaluar
            </span>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
                Pipeline · {requisicion.procesos.length} {requisicion.procesos.length === 1 ? 'candidato' : 'candidatos'}
              </h2>
            </div>

            {requisicion.procesos.length === 0 ? (
              <p className="text-slate-500 font-medium text-sm py-10 text-center">
                Todavía no hay candidatos en esta requisición. Asígnalos desde la ficha de cada candidato.
              </p>
            ) : (
              <TableroPipeline
                procesos={requisicion.procesos.map((p) => ({
                  id: p.id,
                  etapa: p.etapa,
                  scoreMatch: p.scoreMatch,
                  candidato: {
                    id: p.candidato.id,
                    nombre: p.candidato.nombre,
                    telefono: p.candidato.telefono,
                    zona: p.candidato.zona,
                    tieneCV: !!p.candidato.cvKey,
                  },
                }))}
              />
            )}
          </section>
        </div>

        <aside>
          <section className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-5">
              Datos del puesto
            </h2>
            <dl className="space-y-3.5 text-sm">
              {[
                ['Cliente', requisicion.cliente.razonSocial],
                ['Zona', requisicion.zona || requisicion.cliente.zona || '—'],
                ['Turno', requisicion.turno || '—'],
                ['Banda salarial', banda],
                ['Estatus', requisicion.estatus.replace('_', ' ')],
                ['Fecha límite', formatoFecha(requisicion.fechaLimite)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-white/5 pb-3 last:border-0">
                  <dt className="text-slate-500 font-medium shrink-0">{k}</dt>
                  <dd className="text-white font-bold text-right capitalize">{v}</dd>
                </div>
              ))}
            </dl>

            {requisicion.cliente.contactoNombre && (
              <div className="mt-6 pt-5 border-t border-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3">Contacto</h3>
                <p className="text-white font-bold text-sm">{requisicion.cliente.contactoNombre}</p>
                {requisicion.cliente.contactoEmail && (
                  <a href={`mailto:${requisicion.cliente.contactoEmail}`}
                    className="text-slate-500 text-xs hover:text-brand-orange transition-colors block truncate">
                    {requisicion.cliente.contactoEmail}
                  </a>
                )}
                {requisicion.cliente.contactoTel && (
                  <a href={`tel:${requisicion.cliente.contactoTel}`}
                    className="text-slate-500 text-xs hover:text-brand-orange transition-colors">
                    {requisicion.cliente.contactoTel}
                  </a>
                )}
              </div>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
