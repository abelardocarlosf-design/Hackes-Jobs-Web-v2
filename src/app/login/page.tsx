'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/Button';
import { Eye, EyeOff, ArrowRight, Sparkles, Shield } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(email, password);

    if (result.success) {
      router.push(redirectTo);
    } else {
      setError(result.message || 'Error al iniciar sesión');
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (data.success) {
        // Necesitamos recargar o despachar un evento para que el AuthContext se entere
        window.location.href = redirectTo;
      } else {
        setError(data.message || 'Error con Google Sign-In');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Error de conexión');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-brand-black overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/images/hero-bg.gif')] bg-cover bg-center bg-fixed opacity-40"></div>
      
      {/* ─── LEFT: VISUAL PANEL ──────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-16">
        <div className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-lg space-y-12">
          <div>
            <div className="relative w-[200px] h-[60px] mb-12">
              <Image src="/logo.png" fill className="object-contain object-left drop-shadow-2xl" alt="Hacke's Jobs" priority />
            </div>
            <h1 className="text-5xl xl:text-6xl font-black text-white tracking-tighter leading-[0.9] mb-6">
              Reclutamiento del <span className="text-brand-orange">futuro.</span>
            </h1>
            <p className="text-xl text-slate-300 font-medium leading-relaxed">
              Automatiza, evalúa y contrata al mejor talento con la plataforma más avanzada de México.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: Sparkles, text: 'Scoring inteligente de candidatos', color: 'text-brand-orange' },
              { icon: Shield, text: 'Tests psicométricos integrados', color: 'text-brand-blue' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <div className={`w-14 h-14 rounded-2xl bg-white/5 ${item.color} flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors`}>
                  <item.icon size={26} />
                </div>
                <span className="text-slate-300 font-black uppercase tracking-widest text-[11px] group-hover:text-white transition-colors">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
              Hacke's Jobs Platform © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>

      {/* ─── RIGHT: LOGIN FORM ───────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative z-20">
        <div className="w-full max-w-md space-y-10 bg-brand-black/40 backdrop-blur-3xl p-10 sm:p-16 rounded-[4rem] border border-white/10 shadow-3xl">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="relative w-[180px] h-[50px]">
              <Image src="/logo.png" fill className="object-contain drop-shadow-2xl" alt="Hacke's Jobs" priority />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Bienvenido</h2>
            <p className="text-slate-400 font-medium text-lg">
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Error al conectar con Google')}
              useOneTap
              theme="filled_black"
              size="large"
              width="100%"
              text="continue_with"
              shape="pill"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="px-6 bg-transparent text-slate-500">O ingresa con email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">
                Email Profesional
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@empresa.com"
                className="w-full h-16 px-8 rounded-3xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:bg-white/10 focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-bold text-lg"
                autoComplete="email"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between ml-4">
                <label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                  Contraseña
                </label>
                <button type="button" className="text-[9px] font-black text-brand-blue hover:text-brand-orange uppercase tracking-widest transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-16 px-8 pr-16 rounded-3xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:bg-white/10 focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-bold text-lg"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="secondary"
              disabled={isLoading}
              className="w-full h-16 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-orange/20 flex items-center justify-center gap-3 group"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Validando...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-6">
            <p className="text-slate-400 font-medium text-sm">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="text-brand-orange font-black hover:text-orange-400 transition-colors uppercase tracking-widest text-[10px] ml-2">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
