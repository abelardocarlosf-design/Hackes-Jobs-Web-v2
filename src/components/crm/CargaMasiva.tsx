'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileText, X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_ARCHIVOS = 20;
const TIPOS = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const clase =
  'w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:bg-white/10 focus:border-brand-orange outline-none transition-all font-medium';

type Resultado = {
  creados: { id: string; nombre: string }[];
  errores: { archivo: string; motivo: string }[];
  total: number;
};

export function CargaMasiva() {
  const router = useRouter();
  const [archivos, setArchivos] = useState<File[]>([]);
  const [zona, setZona] = useState('');
  const [puestoInteres, setPuestoInteres] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const elegir = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const lista = Array.from(e.target.files || []);
    const validos: File[] = [];
    for (const f of lista) {
      if (!TIPOS.includes(f.type)) { setError(`"${f.name}": formato no admitido.`); continue; }
      if (f.size > MAX_BYTES) { setError(`"${f.name}": supera los 5 MB.`); continue; }
      validos.push(f);
    }
    setArchivos(validos.slice(0, MAX_ARCHIVOS));
    if (validos.length > MAX_ARCHIVOS) setError(`Solo se toman los primeros ${MAX_ARCHIVOS} archivos.`);
  };

  const quitar = (i: number) => setArchivos((p) => p.filter((_, idx) => idx !== i));

  const subir = async (e: React.FormEvent) => {
    e.preventDefault();
    if (archivos.length === 0) return setError('Adjunta al menos un CV.');
    setSubiendo(true);
    setError('');
    try {
      const form = new FormData();
      archivos.forEach((f) => form.append('cvs', f));
      if (zona) form.append('zona', zona);
      if (puestoInteres) form.append('puestoInteres', puestoInteres);
      form.append('fuente', 'otro');

      const res = await fetch('/api/candidatos/carga', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok && !json.data) throw new Error(json.message || 'No se pudo procesar la carga');
      setResultado(json.data);
      setArchivos([]);
      if (input.current) input.current.value = '';
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubiendo(false);
    }
  };

  if (resultado) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-6">
        <div className="flex items-center gap-4">
          <CheckCircle2 size={32} className="text-emerald-400 shrink-0" />
          <div>
            <h2 className="text-white font-black text-xl">Carga terminada</h2>
            <p className="text-slate-400 text-sm font-medium">
              {resultado.creados.length} de {resultado.total} fichas creadas.
            </p>
          </div>
        </div>

        {resultado.creados.length > 0 && (
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-5 flex gap-4">
            <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-amber-200/90 text-xs leading-relaxed">
              Las fichas quedaron con el nombre del archivo y <strong>sin consentimiento LFPDPPP</strong>.
              Ábrelas para capturar nombre real, contacto y confirmar el consentimiento antes de
              meterlas a un proceso.
            </p>
          </div>
        )}

        {resultado.creados.length > 0 && (
          <ul className="divide-y divide-white/5 max-h-72 overflow-y-auto">
            {resultado.creados.map((c) => (
              <li key={c.id} className="py-3 flex items-center justify-between gap-4">
                <span className="text-white font-bold text-sm truncate">{c.nombre}</span>
                <Link href={`/crm/candidatos/${c.id}`}
                  className="text-brand-orange text-[10px] font-black uppercase tracking-widest hover:text-orange-400 shrink-0">
                  Completar ficha
                </Link>
              </li>
            ))}
          </ul>
        )}

        {resultado.errores.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">No procesados</p>
            {resultado.errores.map((e, i) => (
              <p key={i} className="text-slate-500 text-xs">
                <span className="text-slate-400 font-bold">{e.archivo}</span> — {e.motivo}
              </p>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => setResultado(null)}
            className="h-12 px-6 rounded-xl bg-brand-orange text-white font-black text-[10px] uppercase tracking-[0.2em]">
            Cargar más
          </button>
          <Link href="/crm/candidatos"
            className="h-12 px-6 rounded-xl border border-white/15 text-slate-300 font-black text-[10px] uppercase tracking-[0.2em] flex items-center hover:text-white transition-colors">
            Ver candidatos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={subir} className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm font-bold">{error}</div>
      )}

      <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Cómo funciona</p>
        <ol className="text-slate-400 text-sm space-y-1.5 leading-relaxed list-decimal list-inside">
          <li>Adjunta hasta {MAX_ARCHIVOS} CVs en PDF, DOC o DOCX.</li>
          <li>Se crea una ficha por archivo, con el nombre del fichero como nombre provisional.</li>
          <li>Completas los datos reales y el consentimiento desde cada ficha.</li>
        </ol>
        <p className="text-slate-600 text-xs pt-1">
          Los datos no se extraen del PDF automáticamente: la captura la hace una persona.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Puesto de interés <span className="text-slate-700 normal-case tracking-normal font-medium">(se aplica a todos)</span>
          </label>
          <input value={puestoInteres} onChange={(e) => setPuestoInteres(e.target.value)}
            placeholder="Ej. Operador de producción" className={clase} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Zona <span className="text-slate-700 normal-case tracking-normal font-medium">(se aplica a todos)</span>
          </label>
          <input value={zona} onChange={(e) => setZona(e.target.value)} placeholder="Ej. Toluca" className={clase} />
        </div>
      </div>

      <button type="button" onClick={() => input.current?.click()}
        className="w-full flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed border-white/15 bg-white/5 hover:border-brand-orange/50 transition-all">
        <UploadCloud className="text-slate-500" size={34} />
        <span className="text-white font-bold text-sm">Seleccionar archivos</span>
        <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">
          PDF, DOC o DOCX · máx 5 MB cada uno
        </span>
      </button>
      <input ref={input} type="file" multiple onChange={elegir} className="sr-only"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />

      {archivos.length > 0 && (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {archivos.map((f, i) => (
            <li key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5">
              <FileText size={16} className="text-brand-orange shrink-0" />
              <span className="text-white font-bold text-xs truncate flex-1">{f.name}</span>
              <span className="text-slate-600 text-[10px] font-bold shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
              <button type="button" onClick={() => quitar(i)} aria-label={`Quitar ${f.name}`}
                className="text-slate-600 hover:text-white transition-colors shrink-0">
                <X size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="submit" disabled={subiendo || archivos.length === 0}
        className="w-full h-14 rounded-xl bg-brand-orange text-white font-black text-[11px] uppercase tracking-[0.2em] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3">
        {subiendo && <Loader2 size={16} className="animate-spin" />}
        {subiendo ? 'Procesando...' : `Cargar ${archivos.length || ''} ${archivos.length === 1 ? 'CV' : 'CVs'}`.trim()}
      </button>
    </form>
  );
}
