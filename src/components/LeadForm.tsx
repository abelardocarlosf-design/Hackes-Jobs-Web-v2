"use client";

import { useState } from 'react';
import { Button } from './Button';
import { z } from 'zod';
import { PrivacyCheckbox } from './PrivacyCheckbox';

// Frontend validation schema
const formSchema = z.object({
  nombre: z.string().min(2, "El nombre es muy corto"),
  empresa: z.string().min(2, "El nombre de la empresa es muy corto"),
  email: z.string().email("Ingresa un email válido"),
  telefono: z.string().min(10, "Mínimo 10 dígitos"),
  vacante: z.string().min(3, "Ingresa una vacante válida"),
});

export function LeadForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    vacante: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    setErrors({});
    
    // 1. Client-side validation
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      setStatus('idle');
      return;
    }

    try {
      // 2. API Request
      const response = await fetch('/api/empresas/solicitar-talento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar la solicitud');
      }

      if (data.success) {
        setStatus('success');
        setFormData({ nombre: '', empresa: '', email: '', telefono: '', vacante: '' });
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Ocurrió un error inesperado. Por favor, intenta de nuevo.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 sm:p-10 text-center animate-in fade-in duration-500 max-w-2xl mx-auto shadow-2xl">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">¡Solicitud Enviada!</h3>
        <p className="text-slate-600 font-medium text-lg mb-8 leading-relaxed">
          Gracias por confiar en Hacke's Jobs. Te contactaremos pronto en <a href="mailto:abelardo.carlos@hackesjobs.com.mx" className="font-bold text-slate-800 underline decoration-brand-orange hover:text-brand-blue transition-colors">abelardo.carlos@hackesjobs.com.mx</a> o al teléfono proporcionado.
        </p>
        <Button 
          variant="outline" 
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-100 h-12 px-6 font-bold rounded-xl"
          onClick={() => setStatus('idle')}
        >
          Enviar otra solicitud
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="text-left max-w-2xl mx-auto">
      <div className="space-y-6">
        {status === 'error' && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold animate-in slide-in-from-top-2">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="nombre" className="text-sm font-black text-brand-black uppercase tracking-widest">Nombre completo <span className="text-brand-orange">*</span></label>
            <input 
              required
              type="text" 
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-5 py-4 rounded-xl border-2 ${errors.nombre ? 'border-red-300 bg-red-50' : 'border-slate-100 bg-slate-50'} text-brand-black placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-medium`}
              placeholder="Ej. Juan Pérez"
            />
            {errors.nombre && <p className="text-xs text-red-500 font-bold ml-1">{errors.nombre}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="empresa" className="text-sm font-black text-brand-black uppercase tracking-widest">Empresa <span className="text-brand-orange">*</span></label>
            <input 
              required
              type="text" 
              id="empresa"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
              className={`w-full px-5 py-4 rounded-xl border-2 ${errors.empresa ? 'border-red-300 bg-red-50' : 'border-slate-100 bg-slate-50'} text-brand-black placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-medium`}
              placeholder="Ej. Acme Corp"
            />
            {errors.empresa && <p className="text-xs text-red-500 font-bold ml-1">{errors.empresa}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-black text-brand-black uppercase tracking-widest">Email corporativo <span className="text-brand-orange">*</span></label>
            <input 
              required
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-5 py-4 rounded-xl border-2 ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-100 bg-slate-50'} text-brand-black placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-medium`}
              placeholder="juan@acme.com"
            />
            {errors.email && <p className="text-xs text-red-500 font-bold ml-1">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="telefono" className="text-sm font-black text-brand-black uppercase tracking-widest">Teléfono <span className="text-brand-orange">*</span></label>
            <input 
              required
              type="tel" 
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className={`w-full px-5 py-4 rounded-xl border-2 ${errors.telefono ? 'border-red-300 bg-red-50' : 'border-slate-100 bg-slate-50'} text-brand-black placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-medium`}
              placeholder="+52 55 1234 5678"
            />
            {errors.telefono && <p className="text-xs text-red-500 font-bold ml-1">{errors.telefono}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="vacante" className="text-sm font-black text-brand-black uppercase tracking-widest">Vacante a cubrir <span className="text-brand-orange">*</span></label>
          <input 
            required
            type="text" 
            id="vacante"
            name="vacante"
            value={formData.vacante}
            onChange={handleChange}
            className={`w-full px-5 py-4 rounded-xl border-2 ${errors.vacante ? 'border-red-300 bg-red-50' : 'border-slate-100 bg-slate-50'} text-brand-black placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-medium`}
            placeholder="Ej. Desarrollador Senior React"
          />
          {errors.vacante && <p className="text-xs text-red-500 font-bold ml-1">{errors.vacante}</p>}
        </div>

        <PrivacyCheckbox 
          type="contacto comercial" 
          checked={privacyAccepted} 
          onChange={setPrivacyAccepted} 
        />

        <Button 
          type="submit" 
          size="lg" 
          disabled={status === 'submitting'}
          className="w-full text-xl h-20 bg-brand-blue hover:bg-brand-blue/90 text-white shadow-2xl shadow-brand-blue/20 hover:shadow-brand-blue/40 transition-all duration-300 hover:-translate-y-1 rounded-2xl font-black mt-4 border-0 uppercase tracking-widest flex items-center justify-center gap-3"
        >
          {status === 'submitting' ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </>
          ) : 'Solicitar talento'}
        </Button>
      </div>
    </form>
  );
}
