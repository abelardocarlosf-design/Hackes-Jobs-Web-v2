'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  ETAPAS,
  ETAPA_CLASES,
  TIPOS_SEGUIMIENTO,
  tipoSeguimientoLabel,
  diasRelativos,
  formatoFecha,
  calidadMatch,
  CALIDAD_META,
} from '@/lib/crm';
import { Check, Plus, Loader2, CalendarClock, Trash2 } from 'lucide-react';

type Proceso = {
  id: string;
  etapa: string;
  notas: string | null;
  scoreMatch: number | null;
  requisicion: { id: string; puesto: string; cliente: { razonSocial: string } };
};

type Seguimiento = {
  id: string;
  tipo: string;
  nota: string | null;
  fechaLimite: string;
  completado: boolean;
  automatico: boolean;
};

function Aviso({ texto }: { texto: string }) {
  return (
    <p className="text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
      {texto}
    </p>
  );
}

/** Selector de etapa por proceso. Al cambiar, el backend agenda el seguimiento. */
export function PipelineCandidato({ procesos }: { procesos: Proceso[] }) {
  const router = useRouter();
  const [cargando, setCargando] = useState<string | null>(null);
  const [error, setError] = useState('');

  const mover = async (procesoId: string, etapa: string) => {
    setCargando(procesoId);
    setError('');
    try {
      const res = await fetch(`/api/procesos/${procesoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ etapa }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'No se pudo mover la etapa');
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCargando(null);
    }
  };

  if (procesos.length === 0) {
    return (
      <p className="text-slate-500 font-medium text-sm py-6 text-center">
        Este candidato no está en ningún proceso todavía. Asígnalo a una requisición para moverlo por el pipeline.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error && <Aviso texto={error} />}
      {procesos.map((p) => (
        <div key={p.id} className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              <p className="text-white font-black text-sm">{p.requisicion.puesto}</p>
              <p className="text-slate-500 text-xs font-bold">{p.requisicion.cliente.razonSocial}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {p.scoreMatch != null && (() => {
                const c = calidadMatch(p.scoreMatch)!;
                return (
                  <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${CALIDAD_META[c].clases}`}>
                    {p.scoreMatch}% · {CALIDAD_META[c].label}
                  </span>
                );
              })()}
              {cargando === p.id && <Loader2 size={18} className="animate-spin text-brand-orange" />}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {ETAPAS.map((e) => {
              const actual = p.etapa === e.id;
              return (
                <button
                  key={e.id}
                  type="button"
                  disabled={actual || cargando === p.id}
                  onClick={() => mover(p.id, e.id)}
                  className={`px-3 py-2 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all disabled:cursor-default ${
                    actual
                      ? ETAPA_CLASES[e.id]
                      : 'border-white/10 bg-transparent text-slate-600 hover:text-white hover:border-white/25'
                  }`}
                >
                  {e.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Lista de seguimientos + alta de uno nuevo. */
export function SeguimientosCandidato({
  candidatoId,
  seguimientos,
}: {
  candidatoId: string;
  seguimientos: Seguimiento[];
}) {
  const router = useRouter();
  const [pendiente, startTransition] = useTransition();
  const [abriendo, setAbriendo] = useState(false);
  const [tipo, setTipo] = useState('llamada');
  const [nota, setNota] = useState('');
  const [dias, setDias] = useState('3');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const refrescar = () => startTransition(() => router.refresh());

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setError('');
    try {
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() + parseInt(dias, 10));
      const res = await fetch('/api/seguimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidatoId, tipo, nota: nota || undefined, fechaLimite }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'No se pudo crear el seguimiento');
      setNota('');
      setAbriendo(false);
      refrescar();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const alternar = async (id: string, completado: boolean) => {
    await fetch(`/api/seguimientos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completado }),
    });
    refrescar();
  };

  const borrar = async (id: string) => {
    await fetch(`/api/seguimientos/${id}`, { method: 'DELETE' });
    refrescar();
  };

  const abiertos = seguimientos.filter((s) => !s.completado);
  const cerrados = seguimientos.filter((s) => s.completado);

  return (
    <div className="space-y-5">
      {error && <Aviso texto={error} />}

      {abriendo ? (
        <form onSubmit={crear} className="rounded-xl border border-brand-orange/25 bg-brand-orange/5 p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Tipo</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-white/10 bg-white/5 text-white font-bold text-sm outline-none focus:border-brand-orange cursor-pointer">
                {TIPOS_SEGUIMIENTO.map((t) => (
                  <option key={t.id} value={t.id} className="bg-brand-black">{t.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Vence en</label>
              <select value={dias} onChange={(e) => setDias(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-white/10 bg-white/5 text-white font-bold text-sm outline-none focus:border-brand-orange cursor-pointer">
                <option value="0" className="bg-brand-black">Hoy</option>
                <option value="1" className="bg-brand-black">Mañana</option>
                <option value="3" className="bg-brand-black">3 días</option>
                <option value="7" className="bg-brand-black">1 semana</option>
                <option value="15" className="bg-brand-black">15 días</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Nota</label>
            <input type="text" value={nota} onChange={(e) => setNota(e.target.value)}
              placeholder="Ej. Confirmar disponibilidad para turno nocturno"
              className="w-full h-11 px-4 rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-600 outline-none focus:border-brand-orange font-medium text-sm" />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={guardando}
              className="h-11 px-6 rounded-lg bg-brand-orange text-white font-black text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 flex items-center gap-2">
              {guardando && <Loader2 size={14} className="animate-spin" />}
              Agendar
            </button>
            <button type="button" onClick={() => setAbriendo(false)}
              className="h-11 px-6 rounded-lg border border-white/15 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button type="button" onClick={() => setAbriendo(true)}
          className="w-full h-12 rounded-xl border border-dashed border-white/15 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:border-brand-orange/50 hover:text-brand-orange transition-all flex items-center justify-center gap-2">
          <Plus size={15} /> Agendar seguimiento
        </button>
      )}

      {abiertos.length === 0 && cerrados.length === 0 ? (
        <p className="text-slate-500 font-medium text-sm py-4 text-center">Sin seguimientos registrados.</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {[...abiertos, ...cerrados].map((s) => {
            const vencido = !s.completado && new Date(s.fechaLimite) <= new Date();
            return (
              <li key={s.id} className="py-3.5 flex items-start gap-4">
                <button type="button" onClick={() => alternar(s.id, !s.completado)}
                  aria-label={s.completado ? 'Reabrir' : 'Marcar como hecho'}
                  className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    s.completado
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'border-white/20 text-transparent hover:border-brand-orange'
                  }`}>
                  <Check size={14} />
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-bold text-sm ${s.completado ? 'text-slate-600 line-through' : 'text-white'}`}>
                      {tipoSeguimientoLabel(s.tipo)}
                    </span>
                    {s.automatico && (
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-500 text-[9px] font-black uppercase tracking-wider">
                        automático
                      </span>
                    )}
                  </div>
                  {s.nota && <p className="text-slate-500 text-xs mt-0.5">{s.nota}</p>}
                  <p className={`text-[10px] font-black uppercase tracking-widest mt-1 flex items-center gap-1.5 ${
                    s.completado ? 'text-slate-700' : vencido ? 'text-red-400' : 'text-slate-500'
                  }`}>
                    <CalendarClock size={11} />
                    {s.completado ? 'Hecho' : `${formatoFecha(s.fechaLimite)} · ${diasRelativos(s.fechaLimite)}`}
                  </p>
                </div>

                <button type="button" onClick={() => borrar(s.id)} aria-label="Eliminar seguimiento"
                  className="text-slate-700 hover:text-red-400 transition-colors shrink-0 mt-0.5">
                  <Trash2 size={15} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
