'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Clock, Activity, AlertCircle, ArrowRight, ArrowLeft, Hourglass } from 'lucide-react';
import { TestInfoProps } from '@/lib/psicometriasConfig';
import { PrivacyCheckbox } from '@/components/PrivacyCheckbox';

export function TestInstrucciones({ config }: { config: TestInfoProps }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
    empresa: '',           // opcional, alimenta datos_paciente.empresa en el contrato n8n v1
    cargo_postulado: ''    // opcional, alimenta datos_paciente.cargo_postulado en el contrato n8n v1
  });
  const [error, setError] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre_completo || !formData.email || !formData.telefono) {
      setError('Por favor, completa todos los campos para continuar.');
      return;
    }
    
    if (!privacyAccepted) {
      setError('Debes aceptar el Aviso de Privacidad para comenzar la evaluación.');
      return;
    }
    
    // Save to sessionStorage
    sessionStorage.setItem(`hj_lead_${config.slug}`, JSON.stringify(formData));
    
    // Navigate to the test application page
    router.push(`/psicometrias/${config.slug}/aplicar`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <Link href="/psicometrias" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Volver al Catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Test Info Section */}
        <div>
          <div className="mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-brand-orange mb-4 inline-block">
              {config.categoria}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
              {config.nombre}
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              {config.descripcion}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col gap-2">
              <Clock className="text-brand-orange" size={24} />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Duración</p>
                <p className="text-white font-black">{config.duracion}</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col gap-2">
              <Activity className="text-emerald-400" size={24} />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Nivel</p>
                <p className="text-white font-black">{config.nivel}</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col gap-2">
              <AlertCircle className="text-brand-blue" size={24} />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Inversión</p>
                <p className="text-white font-black">{config.precioFormateado}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
            <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              Instrucciones
            </h2>
            <ul className="space-y-4">
              {config.instrucciones.map((inst, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center text-xs font-black mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 leading-relaxed text-sm">{inst}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lead Form Section */}
        <div>
          {config.comingSoon ? (
            <div className="card-premium p-10 sticky top-24 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-orange/15 border border-brand-orange/30 flex items-center justify-center text-brand-orange">
                <Hourglass size={28} />
              </div>
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange text-[10px] font-black uppercase tracking-[0.25em]">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-brand-orange"></span>
                  Próximamente
                </span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Evaluación en preparación</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Esta evaluación requiere material visual especializado que estamos finalizando. Mientras tanto, puedes revisar el resto del catálogo, todas las demás pruebas están 100% activas.
                </p>
              </div>
              <Link href="/psicometrias" className="block">
                <Button variant="secondary" className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs">
                  Volver al catálogo <ArrowLeft size={14} className="ml-2 rotate-180" />
                </Button>
              </Link>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.25em]">
                ¿Te avisamos cuando esté lista? Escríbenos a <a href="mailto:abelardo.carlos@hackesjobs.com.mx" className="text-brand-orange hover:underline normal-case tracking-normal">abelardo.carlos@hackesjobs.com.mx</a>
              </p>
            </div>
          ) : (
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl sticky top-24">
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Registro Requerido</h2>
            <p className="text-slate-400 text-sm mb-8">Ingresa tus datos reales para poder enviarte los resultados al finalizar la prueba.</p>
            
            <form onSubmit={handleStart} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold animate-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="nombre_completo" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre completo</label>
                <input 
                  required
                  type="text" 
                  id="nombre_completo"
                  name="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl border border-white/10 bg-black/50 text-white placeholder-slate-500 focus:bg-[#111] focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue outline-none transition-all font-medium"
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correo Electrónico</label>
                <input 
                  required
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl border border-white/10 bg-black/50 text-white placeholder-slate-500 focus:bg-[#111] focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue outline-none transition-all font-medium"
                  placeholder="juan@ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="telefono" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono / WhatsApp</label>
                <input
                  required
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl border border-white/10 bg-black/50 text-white placeholder-slate-500 focus:bg-[#111] focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue outline-none transition-all font-medium"
                  placeholder="Ej. 55 1234 5678"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="empresa" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Empresa <span className="text-slate-600 normal-case tracking-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    id="empresa"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border border-white/10 bg-black/50 text-white placeholder-slate-500 focus:bg-[#111] focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue outline-none transition-all font-medium"
                    placeholder="Ej. Acme Corp"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cargo_postulado" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Cargo postulado <span className="text-slate-600 normal-case tracking-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    id="cargo_postulado"
                    name="cargo_postulado"
                    value={formData.cargo_postulado}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border border-white/10 bg-black/50 text-white placeholder-slate-500 focus:bg-[#111] focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue outline-none transition-all font-medium"
                    placeholder="Ej. Gerente de Operaciones"
                  />
                </div>
              </div>

              <p className="text-[10px] text-slate-500 leading-relaxed">
                Empresa y cargo son opcionales pero permiten que el reporte interprete tus resultados en el contexto del puesto al que aspiras.
              </p>

              <PrivacyCheckbox
                type="aplicación de evaluación psicométrica" 
                checked={privacyAccepted} 
                onChange={setPrivacyAccepted} 
              />

              <Button type="submit" variant="primary" className="w-full h-14 text-sm font-black rounded-xl uppercase tracking-widest mt-4">
                Comenzar Evaluación <ArrowRight size={18} className="ml-2" />
              </Button>
            </form>
          </div>
          )}
        </div>

      </div>
    </div>
  );
}
