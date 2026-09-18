'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileText, X, Loader2 } from 'lucide-react';

const MAX_BYTES = 5 * 1024 * 1024;
const TIPOS = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const FUENTES = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'referido', label: 'Referido' },
  { id: 'scraping', label: 'Scraping' },
  { id: 'formulario', label: 'Formulario web' },
  { id: 'otro', label: 'Otro' },
];

const clase =
  'w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:bg-white/10 focus:border-brand-orange outline-none transition-all font-medium';

export function NuevoCandidatoForm() {
  const router = useRouter();
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    telefono: '',
    zona: '',
    puestoInteres: '',
    fuente: 'whatsapp',
  });
  const [archivo, setArchivo] = useState<File | null>(null);
  const [consentimiento, setConsentimiento] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const inputArchivo = useRef<HTMLInputElement>(null);

  const cambiar = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setDatos((p) => ({ ...p, [e.target.name]: e.target.value }));

  const elegir = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setError('');
    if (!f) return setArchivo(null);
    if (!TIPOS.includes(f.type)) {
      setError('Formato no admitido. Usa PDF, DOC o DOCX.');
      if (inputArchivo.current) inputArchivo.current.value = '';
      return setArchivo(null);
    }
    if (f.size > MAX_BYTES) {
      setError('El archivo supera los 5 MB.');
      if (inputArchivo.current) inputArchivo.current.value = '';
      return setArchivo(null);
    }
    setArchivo(f);
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (datos.nombre.trim().length < 2) return setError('Escribe el nombre completo.');
    if (!consentimiento) {
      return setError(
        'Sin consentimiento LFPDPPP no se puede registrar al candidato. Confírmalo antes de continuar.'
      );
    }

    setGuardando(true);
    try {
      let res: Response;

      if (archivo) {
        // Con CV va por el endpoint multipart, que además guarda el archivo.
        const form = new FormData();
        Object.entries(datos).forEach(([k, v]) => form.append(k, v));
        form.append('consentimientoLFPDPPP', 'true');
        form.append('cv', archivo);
        res = await fetch('/api/candidatos/cv', { method: 'POST', body: form });
      } else {
        // Sin CV basta el alta JSON.
        res = await fetch('/api/candidatos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: datos.nombre.trim(),
            email: datos.email.trim() || undefined,
            telefono: datos.telefono.trim() || undefined,
            zona: datos.zona.trim() || undefined,
            puestoInteres: datos.puestoInteres.trim() || undefined,
            fuente: datos.fuente,
            consentimientoLFPDPPP: true,
          }),
        });
      }

      const json = await res.json();
      if (!res.ok || json.success === false) {
        throw new Error(json.message || 'No se pudo registrar al candidato.');
      }

      const id = json.data?.candidatoId || json.data?.id;
      router.push(id ? `/crm/candidatos/${id}` : '/crm/candidatos');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error inesperado.');
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={enviar} className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm font-bold">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Nombre completo <span className="text-brand-orange">*</span>
          </label>
          <input name="nombre" required value={datos.nombre} onChange={cambiar} placeholder="Ej. Juan Pérez" className={clase} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Teléfono</label>
          <input name="telefono" type="tel" value={datos.telefono} onChange={cambiar} placeholder="722 123 4567" className={clase} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Correo {archivo && <span className="text-brand-orange">*</span>}
        </label>
        <input name="email" type="email" required={!!archivo} value={datos.email} onChange={cambiar} placeholder="correo@ejemplo.com" className={clase} />
        {archivo && (
          <p className="text-slate-600 text-xs font-medium">
            Con CV adjunto el correo es obligatorio: es la llave para no duplicar fichas.
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Puesto de interés</label>
          <input name="puestoInteres" value={datos.puestoInteres} onChange={cambiar} placeholder="Operador" className={clase} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Zona</label>
          <input name="zona" value={datos.zona} onChange={cambiar} placeholder="Toluca" className={clase} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Fuente</label>
          <select name="fuente" value={datos.fuente} onChange={cambiar}
            className={`${clase} cursor-pointer`}>
            {FUENTES.map((f) => (
              <option key={f.id} value={f.id} className="bg-brand-black">{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CV opcional */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          CV <span className="text-slate-700 normal-case tracking-normal font-medium">(opcional)</span>
        </label>
        {archivo ? (
          <div className="flex items-center gap-4 p-4 rounded-xl border border-brand-orange/30 bg-brand-orange/5">
            <FileText className="text-brand-orange shrink-0" size={20} />
            <p className="text-white font-bold text-sm truncate flex-1">{archivo.name}</p>
            <button type="button" onClick={() => { setArchivo(null); if (inputArchivo.current) inputArchivo.current.value = ''; }}
              aria-label="Quitar archivo" className="text-slate-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        ) : (
          <label htmlFor="cv-crm"
            className="flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-white/15 bg-white/5 hover:border-brand-orange/50 cursor-pointer transition-all">
            <UploadCloud className="text-slate-500" size={22} />
            <span className="text-slate-400 font-bold text-sm">Adjuntar CV · PDF, DOC o DOCX, máx 5 MB</span>
          </label>
        )}
        <input ref={inputArchivo} id="cv-crm" type="file" onChange={elegir} className="sr-only"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
      </div>

      {/* Consentimiento */}
      <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-white/10 bg-white/5">
        <input type="checkbox" checked={consentimiento} onChange={(e) => setConsentimiento(e.target.checked)}
          className="w-5 h-5 accent-brand-orange cursor-pointer mt-0.5 shrink-0" />
        <span className="text-slate-300 text-sm font-medium leading-relaxed">
          Confirmo que el candidato otorgó su consentimiento para el tratamiento de sus datos
          personales conforme al Aviso de Privacidad (LFPDPPP).
        </span>
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={guardando}
          className="h-14 px-8 rounded-xl bg-brand-orange text-white font-black text-[11px] uppercase tracking-[0.2em] disabled:opacity-50 flex items-center gap-3 hover:scale-[1.02] transition-transform">
          {guardando && <Loader2 size={16} className="animate-spin" />}
          Registrar candidato
        </button>
      </div>
    </form>
  );
}
