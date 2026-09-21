'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';

export function CompletarSeguimiento({ id, completado }: { id: string; completado: boolean }) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);

  const alternar = async () => {
    setCargando(true);
    await fetch(`/api/seguimientos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completado: !completado }),
    });
    router.refresh();
    setCargando(false);
  };

  return (
    <button
      type="button"
      onClick={alternar}
      disabled={cargando}
      aria-label={completado ? 'Reabrir seguimiento' : 'Marcar como hecho'}
      className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
        completado
          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
          : 'border-white/20 text-transparent hover:border-brand-orange hover:text-brand-orange/40'
      }`}
    >
      {cargando ? <Loader2 size={15} className="animate-spin text-brand-orange" /> : <Check size={17} />}
    </button>
  );
}
