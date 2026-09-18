'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ETAPAS, ETAPA_CLASES, calidadMatch, CALIDAD_META } from '@/lib/crm';
import { FileText, Phone, MapPin, ChevronLeft, ChevronRight, Loader2, Download } from 'lucide-react';

type Proceso = {
  id: string;
  etapa: string;
  scoreMatch: number | null;
  candidato: {
    id: string;
    nombre: string;
    telefono: string | null;
    zona: string | null;
    tieneCV: boolean;
  };
};

/**
 * Tablero por columnas. Se mueve con flechas en vez de arrastrar: es más
 * confiable en móvil y accesible por teclado, que es como el reclutador
 * trabaja realmente en planta.
 */
export function TableroPipeline({ procesos }: { procesos: Proceso[] }) {
  const router = useRouter();
  const [cargando, setCargando] = useState<string | null>(null);
  const [error, setError] = useState('');

  const mover = async (proceso: Proceso, direccion: -1 | 1) => {
    const indice = ETAPAS.findIndex((e) => e.id === proceso.etapa);
    const destino = ETAPAS[indice + direccion];
    if (!destino) return;

    setCargando(proceso.id);
    setError('');
    try {
      const res = await fetch(`/api/procesos/${proceso.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ etapa: destino.id }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'No se pudo mover');
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCargando(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="overflow-x-auto -mx-2 px-2 pb-2">
        <div className="flex gap-4 min-w-max">
          {ETAPAS.map((etapa) => {
            const enEtapa = procesos.filter((p) => p.etapa === etapa.id);
            return (
              <div key={etapa.id} className="w-[260px] shrink-0">
                <div className={`rounded-xl border px-4 py-3 mb-3 ${ETAPA_CLASES[etapa.id]}`}>
                  <p className="text-[10px] font-black uppercase tracking-wider flex items-center justify-between">
                    {etapa.label}
                    <span className="text-white">{enEtapa.length}</span>
                  </p>
                </div>

                <div className="space-y-2.5">
                  {enEtapa.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 p-5 text-center">
                      <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest">Vacío</p>
                    </div>
                  ) : (
                    enEtapa.map((p) => {
                      const indice = ETAPAS.findIndex((e) => e.id === p.etapa);
                      return (
                        <div key={p.id} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <Link href={`/crm/candidatos/${p.candidato.id}`}
                              className="text-white font-bold text-sm hover:text-brand-orange transition-colors leading-tight">
                              {p.candidato.nombre}
                            </Link>
                            {p.scoreMatch != null && (() => {
                              const c = calidadMatch(p.scoreMatch)!;
                              return (
                                <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black shrink-0 ${CALIDAD_META[c].clases}`}
                                  title={CALIDAD_META[c].label}>
                                  {p.scoreMatch}%
                                </span>
                              );
                            })()}
                          </div>

                          <div className="space-y-1 text-slate-500 text-[11px] font-medium">
                            {p.candidato.telefono && (
                              <a href={`tel:${p.candidato.telefono}`} className="flex items-center gap-1.5 truncate hover:text-brand-orange transition-colors">
                                <Phone size={10} />{p.candidato.telefono}
                              </a>
                            )}
                            {p.candidato.zona && (
                              <p className="flex items-center gap-1.5 truncate"><MapPin size={10} />{p.candidato.zona}</p>
                            )}
                            {p.candidato.tieneCV && (
                              <a href={`/api/candidatos/${p.candidato.id}/cv`}
                                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors">
                                <Download size={10} />Descargar CV
                              </a>
                            )}
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <button type="button" disabled={indice === 0 || cargando === p.id}
                              onClick={() => mover(p, -1)} aria-label="Etapa anterior"
                              className="w-8 h-8 rounded-lg border border-white/10 text-slate-500 flex items-center justify-center hover:text-white hover:border-white/30 disabled:opacity-25 disabled:cursor-not-allowed transition-all">
                              <ChevronLeft size={15} />
                            </button>
                            {cargando === p.id ? (
                              <Loader2 size={14} className="animate-spin text-brand-orange mx-auto" />
                            ) : (
                              <span className="flex-1" />
                            )}
                            <button type="button" disabled={indice === ETAPAS.length - 1 || cargando === p.id}
                              onClick={() => mover(p, 1)} aria-label="Etapa siguiente"
                              className="w-8 h-8 rounded-lg border border-white/10 text-slate-500 flex items-center justify-center hover:text-white hover:border-white/30 disabled:opacity-25 disabled:cursor-not-allowed transition-all">
                              <ChevronRight size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
