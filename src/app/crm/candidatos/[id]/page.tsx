import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatoFecha, tiempoTranscurrido, calidadMatch, CALIDAD_META } from '@/lib/crm';
import { CrmHeader } from '@/components/crm/CrmShell';
import { PipelineCandidato, SeguimientosCandidato } from '@/components/crm/CandidatoAcciones';
import { AsignarRequisicion } from '@/components/crm/AsignarRequisicion';
import { CandidatoEditor, GestorCV, BorrarCandidato } from '@/components/crm/CandidatoEditor';
// lucide-react ya no exporta iconos de marca; Link2 hace de enlace externo.
import { Mail, Phone, MapPin, ChevronRight, ShieldCheck, ShieldAlert, Link2, Briefcase } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CandidatoDetallePage({ params }: { params: { id: string } }) {
  const candidato = await prisma.candidato.findUnique({
    where: { id: params.id },
    include: {
      procesos: {
        orderBy: { updatedAt: 'desc' },
        include: { requisicion: { include: { cliente: { select: { razonSocial: true } } } } },
      },
      seguimientos: { orderBy: [{ completado: 'asc' }, { fechaLimite: 'asc' }] },
    },
  });

  if (!candidato) notFound();

  const requisicionesAbiertas = await prisma.requisicion.findMany({
    where: {
      estatus: { in: ['abierta', 'en_proceso', 'terna_entregada'] },
      procesos: { none: { candidatoId: candidato.id } },
    },
    orderBy: { createdAt: 'desc' },
    include: { cliente: { select: { razonSocial: true } } },
  });

  // El mejor score entre sus procesos resume qué tan trabajable es el perfil.
  const mejorScore = candidato.procesos.reduce<number | null>(
    (max, p) => (p.scoreMatch != null && (max === null || p.scoreMatch > max) ? p.scoreMatch : max),
    null
  );
  const calidad = calidadMatch(mejorScore);

  return (
    <>
      <nav className="flex items-center gap-2 text-xs font-bold mb-6">
        <Link href="/crm/candidatos" className="text-brand-orange hover:text-orange-400 transition-colors">
          Candidatos
        </Link>
        <ChevronRight size={13} className="text-slate-700" />
        <span className="text-slate-500">{candidato.nombre}</span>
      </nav>

      <CrmHeader
        titulo={candidato.nombre}
        subtitulo={`${candidato.puestoInteres || 'Sin puesto indicado'} · alta ${formatoFecha(candidato.createdAt)} (${tiempoTranscurrido(candidato.createdAt)})`}
        acciones={
          <CandidatoEditor
            id={candidato.id}
            inicial={{
              nombre: candidato.nombre,
              email: candidato.email ?? '',
              telefono: candidato.telefono ?? '',
              zona: candidato.zona ?? '',
              puestoInteres: candidato.puestoInteres ?? '',
              linkedin: candidato.linkedin ?? '',
              experienciaAnios: candidato.experienciaAnios?.toString() ?? '',
              notas: candidato.notas ?? '',
            }}
          />
        }
      />

      {calidad && mejorScore !== null && (
        <div className="mb-8 flex items-center gap-3 flex-wrap">
          <span className={`px-4 py-2 rounded-xl border text-[11px] font-black uppercase tracking-wider ${CALIDAD_META[calidad].clases}`}>
            {CALIDAD_META[calidad].label} · {mejorScore}%
          </span>
          <span className="text-slate-600 text-[11px] font-medium">
            Match calculado por reglas sobre puesto, zona, expediente y experiencia.
          </span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-5">Pipeline</h2>
            <PipelineCandidato
              procesos={candidato.procesos.map((p) => ({
                id: p.id,
                etapa: p.etapa,
                notas: p.notas,
                scoreMatch: p.scoreMatch,
                requisicion: {
                  id: p.requisicion.id,
                  puesto: p.requisicion.puesto,
                  cliente: { razonSocial: p.requisicion.cliente.razonSocial },
                },
              }))}
            />

            {requisicionesAbiertas.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/5">
                <AsignarRequisicion
                  candidatoId={candidato.id}
                  requisiciones={requisicionesAbiertas.map((r) => ({
                    id: r.id,
                    puesto: r.puesto,
                    cliente: r.cliente.razonSocial,
                  }))}
                />
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-5">Seguimientos</h2>
            <SeguimientosCandidato
              candidatoId={candidato.id}
              seguimientos={candidato.seguimientos.map((s) => ({
                id: s.id,
                tipo: s.tipo,
                nota: s.nota,
                fechaLimite: s.fechaLimite.toISOString(),
                completado: s.completado,
                automatico: s.automatico,
              }))}
            />
          </section>

          {candidato.notas && (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Notas internas</h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{candidato.notas}</p>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-5">Contacto</h2>
            <dl className="space-y-4">
              {[
                { icono: Mail, label: 'Correo', valor: candidato.email, href: candidato.email ? `mailto:${candidato.email}` : null },
                { icono: Phone, label: 'Teléfono', valor: candidato.telefono, href: candidato.telefono ? `tel:${candidato.telefono}` : null },
                { icono: MapPin, label: 'Zona', valor: candidato.zona, href: null },
                { icono: Link2, label: 'LinkedIn', valor: candidato.linkedin ? 'Ver perfil' : null, href: candidato.linkedin },
                {
                  icono: Briefcase,
                  label: 'Experiencia',
                  valor: candidato.experienciaAnios != null ? `${candidato.experienciaAnios} años` : null,
                  href: null,
                },
              ].map((d) => (
                <div key={d.label} className="flex items-start gap-3">
                  <d.icono size={15} className="text-slate-600 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">{d.label}</dt>
                    <dd className="text-white font-bold text-sm truncate">
                      {d.valor ? (
                        d.href ? (
                          <a href={d.href} target={d.label === 'LinkedIn' ? '_blank' : undefined}
                            rel={d.label === 'LinkedIn' ? 'noopener noreferrer' : undefined}
                            className="hover:text-brand-orange transition-colors">
                            {d.valor}
                          </a>
                        ) : d.valor
                      ) : (
                        <span className="text-slate-700">—</span>
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-5">Curriculum</h2>
            <GestorCV id={candidato.id} nombreArchivo={candidato.cvNombreArchivo} />
            {candidato.cvSubidoEn && (
              <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-4">
                Subido {formatoFecha(candidato.cvSubidoEn)}
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-5">Expediente</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500 font-medium">Fuente</dt>
                <dd className="text-white font-bold capitalize">{candidato.fuente || '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500 font-medium">Procesos</dt>
                <dd className="text-white font-bold">{candidato.procesos.length}</dd>
              </div>
            </dl>

            <div className={`mt-5 pt-5 border-t border-white/5 flex items-center gap-3 ${
              candidato.consentimientoLFPDPPP ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {candidato.consentimientoLFPDPPP ? <ShieldCheck size={17} /> : <ShieldAlert size={17} />}
              <p className="text-[10px] font-black uppercase tracking-wider leading-tight">
                {candidato.consentimientoLFPDPPP ? 'Consentimiento LFPDPPP otorgado' : 'Sin consentimiento LFPDPPP'}
              </p>
            </div>
          </section>

          <div className="px-2">
            <BorrarCandidato id={candidato.id} nombre={candidato.nombre} />
          </div>
        </aside>
      </div>
    </>
  );
}
