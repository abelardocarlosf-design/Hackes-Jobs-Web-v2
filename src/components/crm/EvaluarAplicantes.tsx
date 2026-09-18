'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2 } from 'lucide-react';

/**
 * Recalcula el match de todos los candidatos de la requisición.
 * Equivalente al "Evaluar aplicantes" de la referencia, pero con el cálculo
 * por reglas: determinista y explicable, sin llamada a un modelo.
 */
export function EvaluarAplicantes({ requisicionId }: { requisicionId: string }) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const evaluar = async () => {
    setCargando(true);
    setMensaje('');
    try {
      const res = await fetch(`/api/requisiciones/${requisicionId}/evaluar`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.message || 'No se pudo evaluar');
      setMensaje(`${json.data.evaluados} evaluados · ${json.data.actualizados} actualizados`);
      router.refresh();
    } catch (e: any) {
      setMensaje(e.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button type="button" onClick={evaluar} disabled={cargando}
        className="h-11 px-5 rounded-xl border border-white/15 bg-white/5 text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:border-brand-orange hover:text-brand-orange transition-all disabled:opacity-50">
        {cargando ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        Recalcular match
      </button>
      {mensaje && <span className="text-slate-500 text-[11px] font-bold">{mensaje}</span>}
    </div>
  );
}
