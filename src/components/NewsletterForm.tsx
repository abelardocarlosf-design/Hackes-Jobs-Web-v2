"use client";

import { useState } from 'react';
import { Button } from '@/components/Button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Algo salió mal. Intenta de nuevo.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Error de conexión. Intenta más tarde.');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto pt-6">
      {status === 'success' ? (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center gap-4 animate-in fade-in zoom-in duration-500">
           <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle size={24} />
           </div>
           <p className="text-white font-bold text-lg">{message}</p>
           <Button 
            variant="ghost" 
            className="ml-auto text-white hover:bg-white/10"
            onClick={() => setStatus('idle')}
           >
             Cerrar
           </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
             <div className="relative flex-grow group">
                <input 
                  type="email" 
                  placeholder="Tu correo corporativo" 
                  required
                  className={`w-full h-16 rounded-2xl px-6 bg-white/10 border ${status === 'error' ? 'border-red-500' : 'border-white/20'} text-white placeholder:text-white/40 outline-none focus:bg-white/20 focus:border-white/40 transition-all font-bold`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                />
                {status === 'error' && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 flex items-center gap-2">
                     <AlertCircle size={20} />
                  </div>
                )}
             </div>
             <Button 
              type="submit"
              disabled={status === 'loading'}
              className="h-16 px-10 bg-white text-brand-blue hover:bg-slate-100 border-none font-black uppercase text-xs tracking-widest min-w-[180px] shadow-2xl shadow-black/20"
             >
               {status === 'loading' ? (
                 <Loader2 className="animate-spin" />
               ) : (
                 'Suscribirme'
               )}
             </Button>
          </div>
          {status === 'error' && (
            <p className="text-red-400 text-xs font-black uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-1">
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
