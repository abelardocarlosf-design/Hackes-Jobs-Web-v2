'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Save, X, Loader2, UploadCloud, Download, Trash2, FileText } from 'lucide-react';

const clase =
  'w-full h-11 px-4 rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:bg-white/10 focus:border-brand-orange outline-none transition-all font-medium text-sm';

type Datos = {
  nombre: string;
  email: string;
  telefono: string;
  zona: string;
  puestoInteres: string;
  linkedin: string;
  experienciaAnios: string;
  notas: string;
};

/** Edición en línea de la ficha del candidato. */
export function CandidatoEditor({ id, inicial }: { id: string; inicial: Datos }) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [datos, setDatos] = useState<Datos>(inicial);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const cambiar = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDatos((p) => ({ ...p, [e.target.name]: e.target.value }));

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setError('');
    try {
      const res = await fetch(`/api/candidatos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.message || 'No se pudo guardar');
      setEditando(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (!editando) {
    return (
      <button type="button" onClick={() => setEditando(true)}
        className="h-11 px-5 rounded-xl border border-white/15 bg-white/5 text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:border-brand-orange hover:text-brand-orange transition-all">
        <Pencil size={14} /> Editar ficha
      </button>
    );
  }

  return (
    <form onSubmit={guardar} className="rounded-2xl border border-brand-orange/25 bg-brand-orange/5 p-6 space-y-5 w-full">
      {error && (
        <p className="text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { name: 'nombre', label: 'Nombre completo', type: 'text' },
          { name: 'telefono', label: 'Teléfono', type: 'tel' },
          { name: 'email', label: 'Correo', type: 'email' },
          { name: 'zona', label: 'Zona', type: 'text' },
          { name: 'puestoInteres', label: 'Puesto de interés', type: 'text' },
          { name: 'experienciaAnios', label: 'Años de experiencia', type: 'number' },
        ].map((c) => (
          <div key={c.name} className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{c.label}</label>
            <input name={c.name} type={c.type} value={(datos as any)[c.name]} onChange={cambiar} className={clase} />
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">LinkedIn</label>
        <input name="linkedin" type="url" value={datos.linkedin} onChange={cambiar}
          placeholder="https://linkedin.com/in/..." className={clase} />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Notas internas</label>
        <textarea name="notas" value={datos.notas} onChange={cambiar} rows={4}
          placeholder="Observaciones de la entrevista, disponibilidad, expectativa salarial..."
          className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:bg-white/10 focus:border-brand-orange outline-none transition-all font-medium text-sm resize-y" />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={guardando}
          className="h-11 px-6 rounded-lg bg-brand-orange text-white font-black text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 flex items-center gap-2">
          {guardando ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Guardar
        </button>
        <button type="button" onClick={() => { setEditando(false); setDatos(inicial); setError(''); }}
          className="h-11 px-6 rounded-lg border border-white/15 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2">
          <X size={14} /> Cancelar
        </button>
      </div>
    </form>
  );
}

/** Subir, reemplazar, descargar o quitar el CV. */
export function GestorCV({
  id,
  nombreArchivo,
}: {
  id: string;
  nombreArchivo: string | null;
}) {
  const router = useRouter();
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState('');
  const input = useRef<HTMLInputElement>(null);

  const subir = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setOcupado(true);
    setError('');
    try {
      const form = new FormData();
      form.append('cv', f);
      const res = await fetch(`/api/candidatos/${id}/cv`, { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.message || 'No se pudo subir');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setOcupado(false);
      if (input.current) input.current.value = '';
    }
  };

  const quitar = async () => {
    setOcupado(true);
    setError('');
    try {
      const res = await fetch(`/api/candidatos/${id}/cv`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.message || 'No se pudo eliminar');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setOcupado(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && <p className="text-red-400 text-xs font-bold">{error}</p>}

      {nombreArchivo ? (
        <>
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-white/5">
            <FileText size={17} className="text-brand-orange shrink-0" />
            <p className="text-white font-bold text-xs truncate flex-1">{nombreArchivo}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={`/api/candidatos/${id}/cv`}
              className="h-10 px-4 rounded-lg bg-brand-orange text-white font-black text-[10px] uppercase tracking-[0.15em] flex items-center gap-2 hover:scale-[1.02] transition-transform">
              <Download size={13} /> Descargar
            </a>
            <button type="button" onClick={() => input.current?.click()} disabled={ocupado}
              className="h-10 px-4 rounded-lg border border-white/15 text-slate-300 font-black text-[10px] uppercase tracking-[0.15em] flex items-center gap-2 hover:border-white/30 hover:text-white transition-all disabled:opacity-50">
              {ocupado ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
              Reemplazar
            </button>
            <button type="button" onClick={quitar} disabled={ocupado}
              className="h-10 px-4 rounded-lg border border-red-500/25 text-red-400 font-black text-[10px] uppercase tracking-[0.15em] flex items-center gap-2 hover:bg-red-500/10 transition-all disabled:opacity-50">
              <Trash2 size={13} /> Quitar
            </button>
          </div>
        </>
      ) : (
        <button type="button" onClick={() => input.current?.click()} disabled={ocupado}
          className="w-full h-14 rounded-xl border-2 border-dashed border-white/15 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:border-brand-orange/50 hover:text-brand-orange transition-all flex items-center justify-center gap-2 disabled:opacity-50">
          {ocupado ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
          Subir CV
        </button>
      )}

      <input ref={input} type="file" onChange={subir} className="sr-only"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
    </div>
  );
}

/** Borrado de la ficha completa, con confirmación explícita. */
export function BorrarCandidato({ id, nombre }: { id: string; nombre: string }) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [error, setError] = useState('');

  const borrar = async () => {
    setBorrando(true);
    setError('');
    try {
      const res = await fetch(`/api/candidatos/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.message || 'No se pudo eliminar');
      router.push('/crm/candidatos');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setBorrando(false);
    }
  };

  if (!confirmando) {
    return (
      <button type="button" onClick={() => setConfirmando(true)}
        className="text-slate-600 hover:text-red-400 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transition-colors">
        <Trash2 size={13} /> Eliminar candidato
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-5 space-y-4">
      <p className="text-white font-bold text-sm">¿Eliminar a {nombre}?</p>
      <p className="text-slate-400 text-xs leading-relaxed">
        Se borran también su CV, sus procesos y sus seguimientos. No se puede deshacer.
      </p>
      {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
      <div className="flex gap-3">
        <button type="button" onClick={borrar} disabled={borrando}
          className="h-10 px-5 rounded-lg bg-red-500 text-white font-black text-[10px] uppercase tracking-[0.15em] disabled:opacity-50 flex items-center gap-2">
          {borrando && <Loader2 size={13} className="animate-spin" />}
          Sí, eliminar
        </button>
        <button type="button" onClick={() => setConfirmando(false)}
          className="h-10 px-5 rounded-lg border border-white/15 text-slate-400 font-black text-[10px] uppercase tracking-[0.15em] hover:text-white transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  );
}
