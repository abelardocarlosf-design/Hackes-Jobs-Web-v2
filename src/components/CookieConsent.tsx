'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full p-8 md:p-12 relative overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex-grow text-center">
            <h3 className="text-xl md:text-2xl font-black text-zinc-800 tracking-tight">
              Gestionar consentimiento
            </h3>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-zinc-400 hover:text-zinc-800 transition-colors p-2"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Text Content */}
        <p className="text-zinc-600 text-sm md:text-base leading-relaxed mb-10 text-center md:text-left font-medium">
          Para ofrecer las mejores experiencias, utilizamos tecnologías como las cookies para almacenar y/o acceder a la información del dispositivo. El consentimiento de estas tecnologías nos permitirá procesar datos como el comportamiento de navegación o las identificaciones únicas en este sitio. No consentir o retirar el consentimiento, puede afectar negativamente a ciertas características y funciones.
        </p>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <button 
            onClick={handleAccept}
            className="bg-[#D1A68F] hover:bg-[#C1967F] text-zinc-800 font-black py-4 px-6 rounded-2xl transition-all active:scale-95 uppercase text-xs tracking-widest"
          >
            ACEPTAR
          </button>
          <button 
            onClick={handleDecline}
            className="bg-[#D1A68F] hover:bg-[#C1967F] text-zinc-800 font-black py-4 px-6 rounded-2xl transition-all active:scale-95 uppercase text-xs tracking-widest"
          >
            DENEGAR
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="bg-[#D1A68F] hover:bg-[#C1967F] text-zinc-800 font-black py-4 px-6 rounded-2xl transition-all active:scale-95 uppercase text-xs tracking-widest"
          >
            VER PREFERENCIAS
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] md:text-xs font-bold uppercase tracking-widest">
          <Link href="/cookies" className="text-[#D1A68F] hover:underline underline-offset-4">Política de Cookies</Link>
          <Link href="/privacidad" className="text-[#D1A68F] hover:underline underline-offset-4">Política de Privacidad</Link>
          <Link href="/terminos" className="text-[#D1A68F] hover:underline underline-offset-4">Términos y Condiciones</Link>
        </div>
      </div>
    </div>
  );
}
