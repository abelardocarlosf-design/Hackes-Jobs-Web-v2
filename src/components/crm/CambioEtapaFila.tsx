'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ETAPAS, ETAPA_CLASES, etapaLabel } from '@/lib/crm';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

/**
 * Cambio de etapa desde una fila de lista (no el tablero). Mismo contrato que
 * `TableroPipeline` (PATCH /api/procesos/[id] con { etapa }) y mismo patrón de
 * flechas en vez de drag, por la misma razón: confiable en móvil y accesible
 * por teclado.
 */
export function CambioEtapaFila({ procesoId, etapa }: { procesoId: string; etapa: string }) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const indice = ETAPAS.findIndex((e) => e.id === etapa);

  const mover = async (direccion: -1 | 1) => {
    const destino = ETAPAS[indice + direccion];
    if (!destino) return;

    setCargando(true);
    setError('');
    try {
      const res = await fetch(`/api/procesos/${procesoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ etapa: destino.id }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'No se pudo mover');
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <button type="button" disabled={indice <= 0 || cargando} onClick={() => mover(-1)}
        aria-label="Etapa anterior"
        className="w-6 h-6 rounded-lg border border-white/10 text-slate-500 flex items-center justify-center hover:text-white hover:border-white/30 disabled:opacity-25 disabled:cursor-not-allowed transition-all">
        <ChevronLeft size={12} />
      </button>

      {cargando ? (
        <Loader2 size={12} className="animate-spin text-brand-orange" />
      ) : (
        <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${ETAPA_CLASES[etapa]}`}>
          {etapaLabel(etapa)}
        </span>
      )}

      <button type="button" disabled={indice >= ETAPAS.length - 1 || cargando} onClick={() => mover(1)}
        aria-label="Etapa siguiente"
        className="w-6 h-6 rounded-lg border border-white/10 text-slate-500 flex items-center justify-center hover:text-white hover:border-white/30 disabled:opacity-25 disabled:cursor-not-allowed transition-all">
        <ChevronRight size={12} />
      </button>

      {error && <span className="text-red-400 text-[9px] font-bold">{error}</span>}
    </div>
  );
}
