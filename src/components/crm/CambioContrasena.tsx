'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';

const clase =
  'w-full h-12 px-4 pr-12 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:bg-white/10 focus:border-brand-orange outline-none transition-all font-medium';

export function CambioContrasena() {
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [repetir, setRepetir] = useState('');
  const [ver, setVer] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [listo, setListo] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setListo(false);

    if (nueva.length < 8) return setError('La nueva contraseña debe tener al menos 8 caracteres.');
    if (nueva !== repetir) return setError('Las contraseñas nuevas no coinciden.');

    setGuardando(true);
    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actual, nueva }),
      });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.message || 'No se pudo cambiar');
      setListo(true);
      setActual('');
      setNueva('');
      setRepetir('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={enviar} className="space-y-5 max-w-md">
      {error && (
        <p className="text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          {error}
        </p>
      )}
      {listo && (
        <p className="text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
          <CheckCircle2 size={15} /> Contraseña actualizada.
        </p>
      )}

      {[
        { label: 'Contraseña actual', valor: actual, set: setActual, auto: 'current-password' },
        { label: 'Nueva contraseña', valor: nueva, set: setNueva, auto: 'new-password' },
        { label: 'Repetir nueva contraseña', valor: repetir, set: setRepetir, auto: 'new-password' },
      ].map((c, i) => (
        <div key={c.label} className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{c.label}</label>
          <div className="relative">
            <input
              type={ver ? 'text' : 'password'}
              required
              autoComplete={c.auto}
              value={c.valor}
              onChange={(e) => c.set(e.target.value)}
              className={clase}
            />
            {i === 0 && (
              <button type="button" onClick={() => setVer(!ver)}
                aria-label={ver ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                {ver ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
        </div>
      ))}

      <button type="submit" disabled={guardando}
        className="h-12 px-7 rounded-xl bg-brand-orange text-white font-black text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 flex items-center gap-2">
        {guardando && <Loader2 size={14} className="animate-spin" />}
        Actualizar contraseña
      </button>
    </form>
  );
}
