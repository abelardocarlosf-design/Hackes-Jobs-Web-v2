'use client';

import { useRef, useState } from 'react';
import { z } from 'zod';
import { PrivacyCheckbox } from './PrivacyCheckbox';
import { UploadCloud, FileText, X, CheckCircle2 } from 'lucide-react';

const MAX_BYTES = 5 * 1024 * 1024;
const TIPOS_ACEPTADOS = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const schema = z.object({
  nombre: z.string().min(2, 'Escribe tu nombre completo'),
  email: z.string().email('Ingresa un correo válido'),
  telefono: z.string().min(10, 'Mínimo 10 dígitos'),
  zona: z.string().optional(),
  puestoInteres: z.string().optional(),
});

const claseInput =
  'w-full h-14 px-5 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:bg-white/10 focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all font-medium';

export function CVUploadForm() {
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    telefono: '',
    zona: '',
    puestoInteres: '',
  });
  const [archivo, setArchivo] = useState<File | null>(null);
  const [privacidad, setPrivacidad] = useState(false);
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'exito' | 'error'>('idle');
  const [mensajeError, setMensajeError] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const inputArchivo = useRef<HTMLInputElement>(null);

  const cambiar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => {
        const copia = { ...prev };
        delete copia[name];
        return copia;
      });
    }
  };

  const elegirArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setMensajeError('');
    if (!f) return setArchivo(null);

    if (!TIPOS_ACEPTADOS.includes(f.type)) {
      setMensajeError('Formato no admitido. Envía tu CV en PDF, DOC o DOCX.');
      setArchivo(null);
      if (inputArchivo.current) inputArchivo.current.value = '';
      return;
    }
    if (f.size > MAX_BYTES) {
      setMensajeError('El archivo supera el límite de 5 MB.');
      setArchivo(null);
      if (inputArchivo.current) inputArchivo.current.value = '';
      return;
    }
    setArchivo(f);
  };

  const quitarArchivo = () => {
    setArchivo(null);
    if (inputArchivo.current) inputArchivo.current.value = '';
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeError('');
    setErrores({});

    const resultado = schema.safeParse(datos);
    if (!resultado.success) {
      const campos: Record<string, string> = {};
      resultado.error.issues.forEach((i) => {
        if (i.path[0]) campos[i.path[0] as string] = i.message;
      });
      setErrores(campos);
      return;
    }
    if (!archivo) return setMensajeError('Adjunta tu CV para continuar.');
    if (!privacidad) return setMensajeError('Debes aceptar el Aviso de Privacidad.');

    setEstado('enviando');
    try {
      const form = new FormData();
      Object.entries(datos).forEach(([k, v]) => form.append(k, v));
      form.append('consentimientoLFPDPPP', 'true');
      form.append('cv', archivo);

      const res = await fetch('/api/candidatos/cv', { method: 'POST', body: form });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'No pudimos enviar tu CV.');
      }
      setEstado('exito');
    } catch (err: any) {
      setEstado('error');
      setMensajeError(err.message || 'Ocurrió un error inesperado. Inténtalo de nuevo.');
    }
  };

  if (estado === 'exito') {
    return (
      <div className="card-premium p-12 text-center space-y-6 animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-3xl font-black text-white tracking-tight">CV recibido</h3>
        <p className="text-slate-300 font-medium text-lg max-w-lg mx-auto leading-relaxed">
          Tu perfil ya está con nuestro equipo de reclutamiento. Si tu experiencia coincide con alguna
          vacante activa, te contactamos al teléfono o correo que registraste.
        </p>
        <button
          type="button"
          onClick={() => {
            setEstado('idle');
            setDatos({ nombre: '', email: '', telefono: '', zona: '', puestoInteres: '' });
            quitarArchivo();
            setPrivacidad(false);
          }}
          className="text-brand-orange font-black uppercase tracking-widest text-[11px] hover:text-orange-400 transition-colors"
        >
          Enviar otro CV
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="card-premium p-8 sm:p-12 space-y-6 text-left">
      {mensajeError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-5 text-sm font-bold animate-in fade-in slide-in-from-top-2">
          {mensajeError}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label htmlFor="cv-nombre" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">
            Nombre completo <span className="text-brand-orange">*</span>
          </label>
          <input id="cv-nombre" name="nombre" type="text" required value={datos.nombre} onChange={cambiar}
            placeholder="Ej. Juan Pérez" className={claseInput} />
          {errores.nombre && <p className="text-xs text-red-400 font-bold ml-1">{errores.nombre}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="cv-telefono" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">
            Teléfono <span className="text-brand-orange">*</span>
          </label>
          <input id="cv-telefono" name="telefono" type="tel" required value={datos.telefono} onChange={cambiar}
            placeholder="722 123 4567" className={claseInput} />
          {errores.telefono && <p className="text-xs text-red-400 font-bold ml-1">{errores.telefono}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="cv-email" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">
          Correo electrónico <span className="text-brand-orange">*</span>
        </label>
        <input id="cv-email" name="email" type="email" required value={datos.email} onChange={cambiar}
          placeholder="tu@correo.com" className={claseInput} />
        {errores.email && <p className="text-xs text-red-400 font-bold ml-1">{errores.email}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label htmlFor="cv-puesto" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">
            Puesto de interés
          </label>
          <input id="cv-puesto" name="puestoInteres" type="text" value={datos.puestoInteres} onChange={cambiar}
            placeholder="Ej. Operador de producción" className={claseInput} />
        </div>
        <div className="space-y-2">
          <label htmlFor="cv-zona" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">
            Zona donde buscas
          </label>
          <input id="cv-zona" name="zona" type="text" value={datos.zona} onChange={cambiar}
            placeholder="Ej. Toluca, Lerma, Metepec" className={claseInput} />
        </div>
      </div>

      {/* Adjuntar CV */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">
          Tu CV <span className="text-brand-orange">*</span>
        </label>

        {archivo ? (
          <div className="flex items-center gap-4 p-5 rounded-2xl border border-brand-orange/30 bg-brand-orange/5">
            <FileText className="text-brand-orange shrink-0" size={24} />
            <div className="min-w-0 flex-1">
              <p className="text-white font-bold text-sm truncate">{archivo.name}</p>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                {(archivo.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <button type="button" onClick={quitarArchivo} aria-label="Quitar archivo"
              className="text-slate-500 hover:text-white transition-colors shrink-0">
              <X size={20} />
            </button>
          </div>
        ) : (
          <label
            htmlFor="cv-archivo"
            className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-white/15 bg-white/5 hover:border-brand-orange/50 hover:bg-white/10 cursor-pointer transition-all text-center"
          >
            <UploadCloud className="text-slate-500" size={32} />
            <span className="text-white font-bold text-sm">Haz clic para adjuntar tu CV</span>
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">
              PDF, DOC o DOCX · máximo 5 MB
            </span>
          </label>
        )}

        <input
          ref={inputArchivo}
          id="cv-archivo"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={elegirArchivo}
          className="sr-only"
        />
      </div>

      <PrivacyCheckbox type="reclutamiento" checked={privacidad} onChange={setPrivacidad} />

      <button
        type="submit"
        disabled={estado === 'enviando'}
        className="w-full h-16 bg-brand-orange text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.01] active:scale-[0.99] focus:ring-4 focus:ring-brand-orange/20 transition-all duration-300 shadow-xl shadow-brand-orange/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {estado === 'enviando' ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Enviando...
          </>
        ) : (
          'Enviar mi CV'
        )}
      </button>
    </form>
  );
}
