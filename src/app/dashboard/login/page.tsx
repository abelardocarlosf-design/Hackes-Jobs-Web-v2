"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('hj_user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black px-4 py-20 relative overflow-hidden">
      <div className="surface-backdrop absolute inset-0 bg-fixed pointer-events-none"></div>
      
      <Card className="w-full max-w-xl p-12 md:p-20 bg-brand-black/60 backdrop-blur-3xl border border-white/10 rounded-[4rem] shadow-2xl relative z-10 overflow-hidden">
         {/* Decoration */}
         <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl -mr-24 -mt-24 animate-pulse"></div>
         
         <div className="flex flex-col items-center text-center space-y-12 relative z-10">
            <img src="/logo.png" alt="Hacke's Jobs" className="h-16 w-auto mb-4 drop-shadow-2xl" />
            
            <div className="space-y-4">
               <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Acceso al Hub</h1>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Control total del ecosistema inteligente.</p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-8">
               <div className="space-y-6 text-left">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Identificador</label>
                     <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={22} />
                        <input 
                         type="text" 
                         placeholder="Usuario o correo" 
                         required
                         className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl pl-16 pr-8 text-white font-bold outline-none focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue transition-all shadow-inner"
                         value={username}
                         onChange={e => setUsername(e.target.value)}
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Código de Seguridad</label>
                     <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={22} />
                        <input 
                         type="password" 
                         placeholder="Contraseña" 
                         required
                         className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl pl-16 pr-8 text-white font-bold outline-none focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue transition-all shadow-inner"
                         value={password}
                         onChange={e => setPassword(e.target.value)}
                        />
                     </div>
                  </div>
               </div>

               {error && (
                 <div className="bg-red-500/10 text-red-400 p-6 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 border border-red-500/20 backdrop-blur-xl">
                    <ShieldCheck size={24} className="animate-pulse" />
                    {error}
                 </div>
               )}

               <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 uppercase tracking-[0.3em] font-black text-[11px] shadow-orange/40 hover:shadow-orange/60 rounded-2xl border-none"
               >
                 {loading ? <Loader2 className="animate-spin" /> : 'Sincronizar Acceso'}
               </Button>
            </form>

            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">
               Neural Shield Protection Active
            </p>
         </div>
      </Card>
    </div>
  );
}
