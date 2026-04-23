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
    <div className="min-h-screen flex items-center justify-center bg-brand-slate px-4 py-20">
      <div className="absolute inset-0 bg-[url('/grid-light.svg')] opacity-[0.03] pointer-events-none"></div>
      
      <Card className="w-full max-w-xl p-12 md:p-20 relative overflow-hidden shadow-3xl">
         {/* Decoration */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
         
         <div className="flex flex-col items-center text-center space-y-10">
            <img src="/logo.png" alt="Hacke's Jobs" className="h-14 w-auto mb-4" />
            
            <div className="space-y-4">
               <h1 className="text-4xl font-black text-brand-black uppercase tracking-tighter leading-none">Acceso al Hub</h1>
               <p className="text-slate-400 font-medium">Ingresa tus credenciales para gestionar el ecosistema.</p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-6">
               <div className="space-y-4 text-left">
                  <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                     <input 
                      type="text" 
                      placeholder="Usuario o correo" 
                      required
                      className="w-full h-16 bg-slate-50 border-2 border-transparent rounded-2xl pl-14 pr-6 text-brand-black font-bold outline-none focus:border-brand-blue focus:bg-white transition-all"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                     />
                  </div>
                  <div className="relative">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                     <input 
                      type="password" 
                      placeholder="Contraseña" 
                      required
                      className="w-full h-16 bg-slate-50 border-2 border-transparent rounded-2xl pl-14 pr-6 text-brand-black font-bold outline-none focus:border-brand-blue focus:bg-white transition-all"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                     />
                  </div>
               </div>

               {error && (
                 <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3">
                    <ShieldCheck size={18} />
                    {error}
                 </div>
               )}

               <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 uppercase tracking-[0.2em] font-black text-xs shadow-orange/40 hover:shadow-orange/60"
               >
                 {loading ? <Loader2 className="animate-spin" /> : 'Entrar al Dashboard'}
               </Button>
            </form>

            <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em]">
               Protegido por Hacke's Jobs Security
            </p>
         </div>
      </Card>
    </div>
  );
}
