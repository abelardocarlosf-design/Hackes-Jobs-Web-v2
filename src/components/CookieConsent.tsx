'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie } from 'lucide-react';
import { Button } from './Button';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const consent = localStorage.getItem('hj_cookie_consent');
    if (!consent) {
      // Small delay for better UX, don't show immediately on paint
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('hj_cookie_consent', 'all');
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('hj_cookie_consent', 'essential');
    setIsVisible(false);
  };

  // Do not render anything during SSR to prevent hydration mismatch
  if (!isClient || !isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 sm:p-6 pointer-events-none flex justify-center">
      <div className="glass-card-dark rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 w-full max-w-5xl pointer-events-auto overflow-hidden relative animate-in slide-in-from-bottom-24 duration-700 ease-out">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
        
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
          
          {/* Icon & Text */}
          <div className="flex-1 flex gap-6 items-start">
            <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full bg-brand-orange/10 text-brand-orange items-center justify-center border border-brand-orange/20">
              <Cookie size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-black text-white tracking-tighter uppercase">
                  Uso de Cookies
                </h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed font-medium">
                Utilizamos cookies propias y de terceros para habilitar funciones esenciales de la plataforma, analizar nuestro tráfico y optimizar tu experiencia de reclutamiento. Puedes aceptar todas las cookies o limitar su uso a las estrictamente necesarias.
              </p>
              <div className="flex gap-4 mt-3 text-[10px] font-black uppercase tracking-widest">
                <Link href="/privacidad" className="text-brand-orange hover:text-orange-400 transition-colors">Aviso de Privacidad</Link>
                <Link href="/terminos" className="text-brand-orange hover:text-orange-400 transition-colors">Términos del Servicio</Link>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Button 
              onClick={handleAcceptEssential}
              variant="outline"
              className="border-white/10 text-slate-300 hover:text-white hover:border-white/30 hover:bg-white/5 rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-xs"
            >
              Solo esenciales
            </Button>
            <Button 
              onClick={handleAcceptAll}
              variant="primary"
              className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-xs bg-brand-orange hover:bg-orange-500 text-white shadow-lg shadow-brand-orange/20"
            >
              Aceptar todas
            </Button>
          </div>

        </div>

        {/* Close button (top right) */}
        <button 
          onClick={handleAcceptEssential}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
