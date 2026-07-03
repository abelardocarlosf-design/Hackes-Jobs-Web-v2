'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { CheckCircle2, AlertCircle, ArrowRight, ClipboardList } from 'lucide-react';
import { RequisitionWizard } from '@/components/RequisitionWizard';

const INPUT_CLASS =
  'w-full bg-[#111] border border-white/10 text-white focus:bg-brand-black focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none rounded-xl py-3.5 px-4 placeholder:text-slate-500';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface QuickForm {
  empresa: string;
  nombre: string;
  puesto: string;
  cantidad: string;
  zona: string;
  telefono: string;
  email: string;
}

const initialForm: QuickForm = {
  empresa: '',
  nombre: '',
  puesto: '',
  cantidad: '1',
  zona: '',
  telefono: '',
  email: '',
};

/**
 * Formulario corto de 7 campos — vía rápida de conversión. Envía al mismo
 * webhook que el wizard completo (que solo exige empresa.nombre,
 * contacto.email y vacante.titulo); el resto se levanta en la llamada.
 */
export function QuickRequisitionForm() {
  const [form, setForm] = useState<QuickForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof QuickForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.empresa.trim() || !form.nombre.trim() || !form.puesto.trim() || !form.telefono.trim() || !form.email.trim()) {
      setError('Por favor completa todos los campos marcados con *.');
      return;
    }
    if (!EMAIL_REGEX.test(form.email.trim())) {
      setError('El correo electrónico no parece válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Mismo shape que RequisitionPayload del wizard; los campos que el
      // formulario corto no pide se levantan en la llamada de diagnóstico.
      const res = await fetch('/api/webhooks/perfilador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresa: { nombre: form.empresa.trim(), industria: '', tamano: '', sitio_web: '', ubicacion: form.zona.trim() },
          contacto: { nombre: form.nombre.trim(), cargo: '', email: form.email.trim(), telefono: form.telefono.trim(), linkedin: '' },
          vacante: { titulo: form.puesto.trim(), seniority: '', modalidad: '', salario_min: '', salario_max: '', tipo_contratacion: '', urgencia: '', vacantes: form.cantidad || '1' },
          perfil: { skills_tecnicas: [], soft_skills: [], anos_experiencia: '', idiomas: [], herramientas: [], certificaciones: [] },
          estrategia: { objetivo_rol: '', retos_principales: '', kpis: '', estructura_equipo: '', reporta_a: '', personas_a_cargo: '' },
          extras: { comentarios: '', fecha_contratacion: '', archivo: '' },
          metadata: {
            source: 'hackes_jobs_web',
            form_version: 'v2-quick',
            created_at: new Date().toISOString(),
            timezone: 'America/Mexico_City',
          },
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `Error del servidor: ${res.status}`);
      }
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'No se pudo conectar con el servidor. Intenta de nuevo o escríbenos por WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="card-premium p-8 md:p-14 max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 bg-brand-orange/20 text-brand-orange rounded-full flex items-center justify-center mx-auto border border-brand-orange/30">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">¡Vacante recibida!</h2>
        <p className="text-lg text-slate-300 leading-relaxed">
          Un consultor te contacta en menos de 24 horas hábiles por WhatsApp o correo para afinar el perfil y arrancar la búsqueda.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-premium p-6 md:p-10 max-w-2xl mx-auto space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="qr-empresa" className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Empresa *</label>
          <input id="qr-empresa" type="text" value={form.empresa} onChange={set('empresa')} placeholder="Nombre de tu empresa" className={INPUT_CLASS} required />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="qr-nombre" className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Tu nombre *</label>
          <input id="qr-nombre" type="text" value={form.nombre} onChange={set('nombre')} placeholder="Nombre y apellido" className={INPUT_CLASS} required />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="qr-puesto" className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Puesto a cubrir *</label>
          <input id="qr-puesto" type="text" value={form.puesto} onChange={set('puesto')} placeholder="Ej. Operador CNC, Supervisor de calidad" className={INPUT_CLASS} required />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="qr-cantidad" className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Cantidad de vacantes</label>
          <input id="qr-cantidad" type="number" min={1} value={form.cantidad} onChange={set('cantidad')} className={INPUT_CLASS} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="qr-zona" className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Zona / Ubicación</label>
          <input id="qr-zona" type="text" value={form.zona} onChange={set('zona')} placeholder="Ej. Toluca, Lerma, CDMX" className={INPUT_CLASS} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="qr-telefono" className="text-[11px] font-bold uppercase tracking-widest text-slate-400">WhatsApp / Teléfono *</label>
          <input id="qr-telefono" type="tel" value={form.telefono} onChange={set('telefono')} placeholder="10 dígitos" className={INPUT_CLASS} required />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="qr-email" className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Email corporativo *</label>
          <input id="qr-email" type="email" value={form.email} onChange={set('email')} placeholder="tu@empresa.com" className={INPUT_CLASS} required />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="secondary"
        size="xl"
        disabled={isSubmitting}
        className="w-full h-14 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] btn-elev shadow-[0_0_20px_rgba(249,115,22,0.4)]"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar mi vacante'}
        <ArrowRight size={16} className="ml-2" />
      </Button>

      <p className="text-[10px] text-slate-500 text-center leading-relaxed">
        Respuesta en menos de 24 horas hábiles. Los detalles del perfil los levantamos contigo en la llamada — sin formularios largos.
      </p>
    </form>
  );
}

/**
 * Selector entre la vía rápida (default) y el perfilador detallado de 6 pasos.
 */
export function RequisitionViews() {
  const [showWizard, setShowWizard] = useState(false);

  if (showWizard) {
    return <RequisitionWizard />;
  }

  return (
    <div className="space-y-6">
      <QuickRequisitionForm />
      <div className="text-center">
        <button
          type="button"
          onClick={() => setShowWizard(true)}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-orange transition-colors text-[11px] font-bold uppercase tracking-widest"
        >
          <ClipboardList size={14} />
          Prefiero llenar la requisición detallada (6 pasos)
        </button>
      </div>
    </div>
  );
}
