'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function PreciosPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    setIsLoading(planId);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, isCredits: false })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Error al iniciar el pago');
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió la URL de pago');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error de conexión con la pasarela de pagos.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black font-sans selection:bg-brand-orange/40 selection:text-white overflow-x-hidden pt-40 pb-32">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/images/hero-bg.gif" 
          alt="" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-brand-black/60"></div>
      </div>
      <div className="container relative mx-auto px-4 max-w-7xl z-10">
        
        <div className="text-center max-w-4xl mx-auto mb-24 space-y-8">
          <span className="text-brand-orange font-black tracking-[0.4em] uppercase text-xs">Módulo B2B Enterprise</span>
          <h1 className="text-5xl md:text-[6.5rem] font-black text-white tracking-tighter leading-none uppercase">
            Planes <span className="text-brand-blue">Escalables.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Tecnología de reclutamiento empresarial de última generación. Elige el plan que impulsará tu crecimiento.
          </p>
        </div>

        {error && (
          <div className="mb-12 bg-red-500/10 border border-red-500/20 text-red-400 px-8 py-6 rounded-[2rem] flex items-center gap-6 max-w-2xl mx-auto backdrop-blur-xl">
            <ShieldAlert size={32} />
            <p className="font-black uppercase tracking-widest text-xs leading-relaxed">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-12 items-stretch mt-56">
          {/* STARTER */}
          <Card className="glass-card p-12 flex flex-col hover:bg-white/10 transition-all duration-500 border-none group">
            <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-brand-orange transition-colors">Starter</h3>
            <p className="text-[10px] font-black text-slate-500 mb-8 uppercase tracking-[0.3em]">Ideal para Pymes</p>
            <div className="text-6xl font-black text-white tracking-tighter mb-10">$499<span className="text-lg text-slate-500 font-black uppercase ml-2 tracking-widest">/mo</span></div>
            <ul className="space-y-6 mb-12 flex-1">
              <li className="flex items-start gap-4 text-slate-400 font-medium leading-relaxed"><CheckCircle2 className="w-6 h-6 text-brand-orange shrink-0 mt-0.5"/> Hasta 5 vacantes activas.</li>
              <li className="flex items-start gap-4 text-slate-400 font-medium leading-relaxed"><CheckCircle2 className="w-6 h-6 text-brand-orange shrink-0 mt-0.5"/> Cribado básico con IA.</li>
              <li className="flex items-start gap-4 text-slate-400 font-medium leading-relaxed"><CheckCircle2 className="w-6 h-6 text-brand-orange shrink-0 mt-0.5"/> Evaluaciones de Personalidad DISC.</li>
              <li className="flex items-start gap-4 text-slate-400 font-medium leading-relaxed"><CheckCircle2 className="w-6 h-6 text-brand-orange shrink-0 mt-0.5"/> Soporte por correo prioritario.</li>
            </ul>
            <Button 
              variant="outline" 
              className="w-full border-white/20 text-white hover:bg-white/10 h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all" 
              disabled={isLoading !== null}
              onClick={() => handleCheckout('starter')}
            >
              {isLoading === 'starter' ? 'Procesando...' : 'Prueba 14 Días Gratis'}
            </Button>
          </Card>

          {/* PROFESSIONAL */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-blue to-brand-orange rounded-[4rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
            <Card className="relative p-12 pt-28 flex flex-col bg-brand-black/80 backdrop-blur-3xl border-2 border-brand-blue rounded-[4rem] h-full shadow-2xl overflow-visible">
              <div className="absolute top-10 left-1/2 -translate-x-1/2 px-10 py-3 bg-brand-blue text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl z-20 border border-white/20 whitespace-nowrap">
                MÁS POPULAR
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Professional</h3>
              <p className="text-[10px] font-black text-brand-blue mb-8 uppercase tracking-[0.3em]">Corporativos en Expansión</p>
              <div className="text-7xl font-black text-white tracking-tighter mb-10">$999<span className="text-xl text-brand-blue font-black uppercase ml-2 tracking-widest">/mo</span></div>
              <ul className="space-y-6 mb-12 flex-1">
                <li className="flex items-start gap-4 text-white font-bold leading-relaxed"><CheckCircle2 className="w-6 h-6 text-brand-blue shrink-0 mt-0.5"/> Vacantes ilimitadas.</li>
                <li className="flex items-start gap-4 text-white font-bold leading-relaxed"><CheckCircle2 className="w-6 h-6 text-brand-blue shrink-0 mt-0.5"/> Filtrado IA y Smart Hunting.</li>
                <li className="flex items-start gap-4 text-white font-bold leading-relaxed"><CheckCircle2 className="w-6 h-6 text-brand-blue shrink-0 mt-0.5"/> Suite Completa de Evaluaciones CAT.</li>
                <li className="flex items-start gap-4 text-white font-bold leading-relaxed"><CheckCircle2 className="w-6 h-6 text-brand-blue shrink-0 mt-0.5"/> Advanced HR Analytics.</li>
              </ul>
              <Button 
                variant="secondary" 
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white shadow-2xl shadow-brand-blue/40 h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] border-none"
                disabled={isLoading !== null}
                onClick={() => handleCheckout('professional')}
              >
                {isLoading === 'professional' ? 'Procesando...' : 'Elegir Professional'}
              </Button>
            </Card>
          </div>

          {/* ENTERPRISE */}
          <Card className="glass-card p-12 flex flex-col hover:bg-white/10 transition-all duration-500 border-none group relative overflow-hidden">
            <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-brand-blue transition-colors">Enterprise</h3>
            <p className="text-[10px] font-black text-slate-500 mb-8 uppercase tracking-[0.3em]">Operaciones Masivas</p>
            <div className="text-6xl font-black text-white tracking-tighter mb-10">Custom</div>
            <ul className="space-y-6 mb-12 flex-1">
              <li className="flex items-start gap-4 text-slate-400 font-medium leading-relaxed"><CheckCircle2 className="w-6 h-6 text-white shrink-0 mt-0.5"/> Todo lo del plan Professional.</li>
              <li className="flex items-start gap-4 text-slate-400 font-medium leading-relaxed"><CheckCircle2 className="w-6 h-6 text-white shrink-0 mt-0.5"/> Videoentrevistas con Análisis de IA.</li>
              <li className="flex items-start gap-4 text-slate-400 font-medium leading-relaxed"><CheckCircle2 className="w-6 h-6 text-white shrink-0 mt-0.5"/> Integraciones API y SSO (SAML).</li>
              <li className="flex items-start gap-4 text-slate-400 font-medium leading-relaxed"><CheckCircle2 className="w-6 h-6 text-white shrink-0 mt-0.5"/> Key Account Manager Dedicado.</li>
            </ul>
            <Link href="/empresas">
              <Button 
                variant="secondary" 
                className="w-full bg-brand-orange hover:bg-orange-600 shadow-orange/40 h-16 rounded-2xl font-black uppercase tracking-widest text-[10px]"
              >
                Hablar con Consultor
              </Button>
            </Link>
          </Card>
        </div>

      </div>
    </div>


  );
}
