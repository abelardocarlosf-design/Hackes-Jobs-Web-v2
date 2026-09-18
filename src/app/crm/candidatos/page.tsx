import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ETAPAS, ETAPA_CLASES, etapaLabel, tiempoTranscurrido, calidadMatch, CALIDAD_META } from '@/lib/crm';
import { CrmHeader } from '@/components/crm/CrmShell';
import { Search, Mail, Phone, MapPin, UserPlus, Download, Inbox, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

const POR_PAGINA = 20;

export default async function CandidatosPage({
  searchParams,
}: {
  searchParams: { q?: string; etapa?: string; cv?: string; bolsa?: string; page?: string };
}) {
  const q = searchParams.q?.trim() || '';
  const etapa = searchParams.etapa || '';
  const soloCV = searchParams.cv === '1';
  // "Bolsa de talento": candidatos sin ninguna vacante asignada todavía.
  const soloBolsa = searchParams.bolsa === '1';
  const page = Math.max(1, parseInt(searchParams.page || '1', 10));

  const where = {
    ...(q
      ? {
          OR: [
            { nombre: { contains: q } },
            { email: { contains: q } },
            { telefono: { contains: q } },
            { puestoInteres: { contains: q } },
          ],
        }
      : {}),
    ...(soloCV ? { cvKey: { not: null } } : {}),
    ...(soloBolsa ? { procesos: { none: {} } } : etapa ? { procesos: { some: { etapa } } } : {}),
  };

  const [candidatos, total] = await Promise.all([
    prisma.candidato.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * POR_PAGINA,
      take: POR_PAGINA,
      include: {
        procesos: {
          orderBy: { updatedAt: 'desc' },
          take: 1,
          include: { requisicion: { select: { puesto: true } } },
        },
        _count: { select: { seguimientos: { where: { completado: false } } } },
      },
    }),
    prisma.candidato.count({ where }),
  ]);

  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const qs = (extra: Record<string, string>) => {
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (etapa) p.set('etapa', etapa);
    if (soloCV) p.set('cv', '1');
    if (soloBolsa) p.set('bolsa', '1');
    Object.entries(extra).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    return `?${p.toString()}`;
  };

  return (
    <>
      <CrmHeader
        titulo="Candidatos"
        subtitulo={`${total} ${total === 1 ? 'perfil registrado' : 'perfiles registrados'} en la cartera de talento.`}
        acciones={
          <>
            <Link href="/crm/candidatos/carga"
              className="h-12 px-6 rounded-xl border border-white/15 bg-white/5 text-white font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 hover:border-brand-orange hover:text-brand-orange transition-all">
              <Layers size={16} /> Carga masiva
            </Link>
            <Link href="/crm/candidatos/nuevo"
              className="h-12 px-6 rounded-xl bg-brand-orange text-white font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 hover:scale-[1.02] transition-transform">
              <UserPlus size={16} /> Alta de candidato
            </Link>
          </>
        }
      />

      {/* Accesos rápidos */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link href="/crm/candidatos"
          className={`px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
            !soloBolsa && !etapa && !soloCV ? 'bg-white/10 border-white/25 text-white' : 'border-white/10 text-slate-500 hover:text-white'
          }`}>
          Todos
        </Link>
        <Link href="/crm/candidatos?bolsa=1"
          className={`px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            soloBolsa ? 'bg-brand-orange/15 border-brand-orange/30 text-brand-orange' : 'border-white/10 text-slate-500 hover:text-white'
          }`}>
          <Inbox size={13} /> Bolsa de talento
        </Link>
        <Link href="/crm/candidatos?cv=1"
          className={`px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
            soloCV && !soloBolsa ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'border-white/10 text-slate-500 hover:text-white'
          }`}>
          Con CV
        </Link>
      </div>

      {/* Filtros */}
      <form method="GET" className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-8 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Buscar por nombre, correo, teléfono o puesto..."
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:bg-white/10 focus:border-brand-orange outline-none transition-all font-medium"
          />
        </div>

        <select name="etapa" defaultValue={etapa}
          className="h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white font-bold text-sm outline-none focus:border-brand-orange cursor-pointer">
          <option value="" className="bg-brand-black">Todas las etapas</option>
          {ETAPAS.map((e) => (
            <option key={e.id} value={e.id} className="bg-brand-black">{e.label}</option>
          ))}
        </select>

        <label className="h-12 px-4 rounded-xl border border-white/10 bg-white/5 flex items-center gap-3 cursor-pointer hover:border-white/20 transition-all">
          <input type="checkbox" name="cv" value="1" defaultChecked={soloCV}
            className="w-4 h-4 accent-brand-orange cursor-pointer" />
          <span className="text-slate-300 font-bold text-sm whitespace-nowrap">Solo con CV</span>
        </label>

        <button type="submit"
          className="h-12 px-8 rounded-xl bg-white/10 border border-white/15 text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-brand-orange hover:border-brand-orange transition-all">
          Filtrar
        </button>
      </form>

      {/* Lista */}
      {candidatos.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-16 text-center">
          <p className="text-white font-black text-lg mb-2">Sin resultados</p>
          <p className="text-slate-500 font-medium">
            {q || etapa || soloCV
              ? 'Ningún candidato coincide con estos filtros.'
              : 'Aún no hay candidatos. Los que envíen su CV desde /candidatos aparecerán aquí automáticamente.'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/5 overflow-hidden">
          {candidatos.map((c) => {
            const proceso = c.procesos[0];
            return (
              <div key={c.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-white/5 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link href={`/crm/candidatos/${c.id}`}
                      className="text-white font-black text-base hover:text-brand-orange transition-colors">
                      {c.nombre}
                    </Link>
                    {proceso && (
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${ETAPA_CLASES[proceso.etapa]}`}>
                        {etapaLabel(proceso.etapa)}
                      </span>
                    )}
                    {proceso?.scoreMatch != null && (() => {
                      const cal = calidadMatch(proceso.scoreMatch)!;
                      return (
                        <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${CALIDAD_META[cal].clases}`}>
                          {proceso.scoreMatch}% · {CALIDAD_META[cal].label}
                        </span>
                      );
                    })()}
                    {c.cvKey && (
                      <a href={`/api/candidatos/${c.id}/cv`}
                        className="px-2.5 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/15 text-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 hover:bg-emerald-500/25 transition-colors">
                        <Download size={11} /> CV
                      </a>
                    )}
                    {c._count.seguimientos > 0 && (
                      <span className="px-2.5 py-1 rounded-full border border-brand-orange/25 bg-brand-orange/15 text-brand-orange text-[10px] font-black uppercase tracking-wider">
                        {c._count.seguimientos} pendiente{c._count.seguimientos > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2 text-slate-500 text-xs font-medium">
                    {c.email && <span className="flex items-center gap-1.5"><Mail size={12} />{c.email}</span>}
                    {c.telefono && <span className="flex items-center gap-1.5"><Phone size={12} />{c.telefono}</span>}
                    {c.zona && <span className="flex items-center gap-1.5"><MapPin size={12} />{c.zona}</span>}
                  </div>

                  <p className="text-slate-600 text-xs font-bold mt-1.5">
                    {c.puestoInteres || 'Sin puesto indicado'}
                    {proceso?.requisicion && ` · ${proceso.requisicion.puesto}`}
                    {` · alta ${tiempoTranscurrido(c.createdAt)}`}
                  </p>
                </div>

                <Link href={`/crm/candidatos/${c.id}`}
                  className="h-11 px-6 rounded-xl border border-white/15 bg-white/5 text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center hover:border-brand-orange hover:text-brand-orange transition-all shrink-0">
                  Ver perfil
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {paginas > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          {page > 1 && (
            <Link href={qs({ page: String(page - 1) })}
              className="h-11 px-5 rounded-xl border border-white/15 bg-white/5 text-white font-bold text-sm hover:border-brand-orange transition-all flex items-center">
              Anterior
            </Link>
          )}
          <span className="text-slate-500 font-black text-[11px] uppercase tracking-widest">
            Página {page} de {paginas}
          </span>
          {page < paginas && (
            <Link href={qs({ page: String(page + 1) })}
              className="h-11 px-5 rounded-xl border border-white/15 bg-white/5 text-white font-bold text-sm hover:border-brand-orange transition-all flex items-center">
              Siguiente
            </Link>
          )}
        </div>
      )}
    </>
  );
}
