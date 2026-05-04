'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Button } from './Button';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-black/60 backdrop-blur-md animate-in fade-in duration-500">
      <div className="glass-card-dark rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.8)] max-w-2xl w-full p-10 md:p-14 relative overflow-hidden animate-in slide-in-from-bottom-12 duration-700 border border-white/10">
        
        {/* Glow effect background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div className="flex-grow text-center">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">
              Gestionar consentimiento
            </h3>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-white/40 hover:text-white transition-all hover:scale-110 p-2"
          >
            <X size={28} strokeWidth={3} />
          </button>
        </div>

        {/* Text Content */}
        <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-12 text-center md:text-left font-medium relative z-10">
          Para ofrecer las mejores experiencias, utilizamos tecnologías como las cookies para almacenar y/o acceder a la información del dispositivo. El consentimiento de estas tecnologías nos permitirá procesar datos como el comportamiento de navegación o las identificaciones únicas en este sitio. No consentir o retirar el consentimiento, puede afectar negativamente a ciertas características y funciones.
        </p>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 relative z-10">
          <Button 
            onClick={handleAccept}
            variant="secondary"
            size="lg"
            className="w-full rounded-2xl shadow-orange/40"
          >
            ACEPTAR
          </Button>
          <Button 
            onClick={handleDecline}
            variant="outline"
            size="lg"
            className="w-full rounded-2xl border-white/10 hover:border-brand-blue"
          >
            DENEGAR
          </Button>
          <Button 
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="lg"
            className="w-full rounded-2xl font-black text-xs"
          >
            PREFERENCIAS
          </Button>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] relative z-10">
          <Link href="/cookies" className="text-brand-orange hover:text-orange-400 transition-colors">Política de Cookies</Link>
          <Link href="/privacidad" className="text-brand-orange hover:text-orange-400 transition-colors">Política de Privacidad</Link>
          <Link href="/terminos" className="text-brand-orange hover:text-orange-400 transition-colors">Términos y Condiciones</Link>
        </div>
      </div>
    </div>
  );
}
