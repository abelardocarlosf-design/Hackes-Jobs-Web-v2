'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Link2 } from 'lucide-react';

/** Mete al candidato en una requisición abierta, creando el Proceso. */
export function AsignarRequisicion({
  candidatoId,
  requisiciones,
}: {
  candidatoId: string;
  requisiciones: { id: string; puesto: string; cliente: string }[];
}) {
  const router = useRouter();
  const [requisicionId, setRequisicionId] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const asignar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requisicionId) return;
    setGuardando(true);
    setError('');
    try {
      const res = await fetch('/api/procesos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidatoId, requisicionId, etapa: 'filtro_cv' }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'No se pudo asignar');
      setRequisicionId('');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={asignar} className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
        <Link2 size={13} /> Asignar a una requisición
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={requisicionId}
          onChange={(e) => setRequisicionId(e.target.value)}
          className="flex-1 h-11 px-3 rounded-lg border border-white/10 bg-white/5 text-white font-bold text-sm outline-none focus:border-brand-orange cursor-pointer"
        >
          <option value="" className="bg-brand-black">Selecciona una requisición...</option>
          {requisiciones.map((r) => (
            <option key={r.id} value={r.id} className="bg-brand-black">
              {r.puesto} — {r.cliente}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!requisicionId || guardando}
          className="h-11 px-6 rounded-lg bg-white/10 border border-white/15 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-orange hover:border-brand-orange transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {guardando && <Loader2 size={14} className="animate-spin" />}
          Asignar
        </button>
      </div>
      {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
    </form>
  );
}
