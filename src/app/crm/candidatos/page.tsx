import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ETAPAS, tiempoTranscurrido, calidadMatch, CALIDAD_META, type CalidadMatch } from '@/lib/crm';
import { CrmHeader } from '@/components/crm/CrmShell';
import { CambioEtapaFila } from '@/components/crm/CambioEtapaFila';
import { Search, Mail, Phone, MapPin, UserPlus, Download, Inbox, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

const POR_PAGINA = 20;

const FUENTES = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'scraping', label: 'Scraping' },
  { id: 'formulario', label: 'Formulario público' },
  { id: 'referido', label: 'Referido' },
  { id: 'otro', label: 'Otro' },
] as const;

const RANGO_CALIDAD: Record<string, { gte?: number; lt?: number }> = {
  sobresaliente: { gte: 70 },
  potencial: { gte: 40, lt: 70 },
  descartable: { lt: 40 },
};

const PILL_BASE = 'px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2';
const PILL_INACTIVA = 'border-white/10 text-slate-500 hover:text-white';
const PILL_ACTIVA = 'bg-white/10 border-white/25 text-white';

export default async function CandidatosPage({
  searchParams,
}: {
  searchParams: {
    q?: string; etapa?: string; cv?: string; bolsa?: string; page?: string;
    zona?: string; fuente?: string; calidad?: string;
  };
}) {
  const q = searchParams.q?.trim() || '';
  const etapa = searchParams.etapa || '';
  const soloCV = searchParams.cv === '1';
  // "Bolsa de talento": candidatos sin ninguna vacante asignada todavía.
  const soloBolsa = searchParams.bolsa === '1';
  const zona = searchParams.zona?.trim() || '';
  const fuente = searchParams.fuente || '';
  const calidad = searchParams.calidad || '';
  const page = Math.max(1, parseInt(searchParams.page || '1', 10));

  // Filtros sobre el candidato mismo (independientes de si tiene proceso).
  const baseCandidato = {
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
    ...(zona ? { zona: { contains: zona } } : {}),
    ...(fuente ? { fuente } : {}),
    ...(soloCV ? { cvKey: { not: null } } : {}),
  };

  // Filtro sobre el proceso más relevante: etapa y/o calidad de match, en el
  // MISMO proceso (no en procesos distintos del mismo candidato).
  const condicionCalidad: Record<string, any> =
    calidad === 'sin_evaluar' ? { scoreMatch: null } : calidad && RANGO_CALIDAD[calidad] ? { scoreMatch: RANGO_CALIDAD[calidad] } : {};
  const procesoCondicion: Record<string, any> = { ...(etapa ? { etapa } : {}), ...condicionCalidad };

  const where = {
    ...baseCandidato,
    ...(soloBolsa
      ? { procesos: { none: {} } }
      : Object.keys(procesoCondicion).length > 0
        ? { procesos: { some: procesoCondicion } }
        : {}),
  };

  // Conteos para las pestañas/chips: mismos filtros de candidato, variando
  // solo la dimensión que cada pestaña o chip representa.
  const contarConProceso = (extra: Record<string, any>) =>
    prisma.candidato.count({ where: { ...baseCandidato, procesos: { some: extra } } });

  const [candidatos, total, conteosEtapa, nSobresaliente, nPotencial, nDescartable, nSinEvaluar] = await Promise.all([
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
    Promise.all(ETAPAS.map((e) => contarConProceso({ etapa: e.id, ...condicionCalidad }))),
    contarConProceso({ ...(etapa ? { etapa } : {}), scoreMatch: { gte: 70 } }),
    contarConProceso({ ...(etapa ? { etapa } : {}), scoreMatch: { gte: 40, lt: 70 } }),
    contarConProceso({ ...(etapa ? { etapa } : {}), scoreMatch: { lt: 40 } }),
    contarConProceso({ ...(etapa ? { etapa } : {}), scoreMatch: null }),
  ]);

  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const qs = (extra: Record<string, string>) => {
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (etapa) p.set('etapa', etapa);
    if (soloCV) p.set('cv', '1');
    if (soloBolsa) p.set('bolsa', '1');
    if (zona) p.set('zona', zona);
    if (fuente) p.set('fuente', fuente);
    if (calidad) p.set('calidad', calidad);
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
      <div className="flex flex-wrap gap-2 mb-4">
        <Link href="/crm/candidatos"
          className={`${PILL_BASE} ${!soloBolsa && !etapa && !soloCV && !calidad && !zona && !fuente ? PILL_ACTIVA : PILL_INACTIVA}`}>
          Todos
        </Link>
        <Link href="/crm/candidatos?bolsa=1"
          className={`${PILL_BASE} ${soloBolsa ? 'bg-brand-orange/15 border-brand-orange/30 text-brand-orange' : PILL_INACTIVA}`}>
          <Inbox size={13} /> Bolsa de talento
        </Link>
        <Link href="/crm/candidatos?cv=1"
          className={`${PILL_BASE} ${soloCV && !soloBolsa ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : PILL_INACTIVA}`}>
          Con CV
        </Link>
      </div>

      {/* Pestañas de etapa, con el conteo en vivo de la referencia */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Link href={qs({ etapa: '', bolsa: '' })} className={`${PILL_BASE} ${!etapa && !soloBolsa ? PILL_ACTIVA : PILL_INACTIVA}`}>
          Todas las etapas
        </Link>
        {ETAPAS.map((e, i) => (
          <Link key={e.id} href={qs({ etapa: e.id, bolsa: '' })}
            className={`${PILL_BASE} ${etapa === e.id && !soloBolsa ? PILL_ACTIVA : PILL_INACTIVA}`}>
            {e.label} <span className="opacity-60">{conteosEtapa[i]}</span>
          </Link>
        ))}
      </div>

      {/* Chips de calidad de match, clicables como filtro (en la referencia solo eran conteo estático) */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link href={qs({ calidad: '', bolsa: '' })} className={`${PILL_BASE} ${!calidad ? PILL_ACTIVA : PILL_INACTIVA}`}>
          Toda calidad
        </Link>
        {(['sobresaliente', 'potencial', 'descartable'] as CalidadMatch[]).map((c, i) => (
          <Link key={c} href={qs({ calidad: c, bolsa: '' })}
            className={`${PILL_BASE} ${calidad === c ? CALIDAD_META[c].clases : PILL_INACTIVA}`}>
            {CALIDAD_META[c].label} <span className="opacity-60">{[nSobresaliente, nPotencial, nDescartable][i]}</span>
          </Link>
        ))}
        <Link href={qs({ calidad: 'sin_evaluar', bolsa: '' })}
          className={`${PILL_BASE} ${calidad === 'sin_evaluar' ? PILL_ACTIVA : PILL_INACTIVA}`}>
          Sin evaluar <span className="opacity-60">{nSinEvaluar}</span>
        </Link>
      </div>

      {/* Filtros */}
      <form method="GET" className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-8 flex flex-col lg:flex-row gap-4">
        {etapa && <input type="hidden" name="etapa" value={etapa} />}
        {calidad && <input type="hidden" name="calidad" value={calidad} />}
        {soloBolsa && <input type="hidden" name="bolsa" value="1" />}

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

        <input
          type="text"
          name="zona"
          defaultValue={zona}
          placeholder="Zona (ej. Toluca)"
          className="h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:bg-white/10 focus:border-brand-orange outline-none transition-all font-medium lg:w-52"
        />

        <select name="fuente" defaultValue={fuente}
          className="h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white font-bold text-sm outline-none focus:border-brand-orange cursor-pointer">
          <option value="" className="bg-brand-black">Todas las fuentes</option>
          {FUENTES.map((f) => (
            <option key={f.id} value={f.id} className="bg-brand-black">{f.label}</option>
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
            {q || etapa || soloCV || zona || fuente || calidad
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
                    {proceso && <CambioEtapaFila procesoId={proceso.id} etapa={proceso.etapa} />}
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
