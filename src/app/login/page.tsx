'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { GoogleLogin } from '@react-oauth/google';
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
    <div className="min-h-screen flex font-sans">
      
      {/* ─── LEFT: VISUAL PANEL ──────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-black relative overflow-hidden items-center justify-center p-16">
        {/* Background effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-brand-blue/20 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-orange/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('/grid-light.svg')] opacity-[0.03]" />

        <div className="relative z-10 max-w-lg space-y-12">
          <div>
            <div className="relative w-[200px] h-[60px] mb-12">
              <Image src="/logo.png" fill className="object-contain object-left brightness-0 invert" alt="Hacke's Jobs" priority />
            </div>
            <h1 className="text-5xl xl:text-6xl font-black text-white tracking-tighter leading-[0.9] mb-6">
              Reclutamiento del <span className="text-brand-orange">futuro.</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              Automatiza, evalúa y contrata al mejor talento con la plataforma más avanzada de México.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: Sparkles, text: 'Scoring inteligente de candidatos', color: 'text-brand-orange' },
              { icon: Shield, text: 'Tests psicométricos integrados', color: 'text-brand-blue' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 ${item.color} flex items-center justify-center group-hover:bg-white/10 transition-colors`}>
                  <item.icon size={22} />
                </div>
                <span className="text-white/70 font-bold text-sm group-hover:text-white transition-colors">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
              Hacke's Jobs Platform © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>

      {/* ─── RIGHT: LOGIN FORM ───────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-10">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-4">
            <div className="relative w-[180px] h-[50px]">
              <Image src="/logo.png" fill className="object-contain" alt="Hacke's Jobs" priority />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-black text-brand-black tracking-tighter">Bienvenido</h2>
            <p className="text-slate-400 font-medium text-lg">
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Error al conectar con Google')}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
              text="continue_with"
              shape="pill"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400 font-bold uppercase tracking-widest text-[10px]">O ingresa con tu email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-brand-black placeholder-slate-300 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-medium text-lg"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Contraseña
                </label>
                <button type="button" className="text-[10px] font-bold text-brand-blue hover:underline uppercase tracking-widest">
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
                  className="w-full px-5 py-4 pr-14 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-brand-black placeholder-slate-300 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-medium text-lg"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 bg-brand-black text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-brand-black/90 focus:ring-4 focus:ring-brand-blue/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-brand-black/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3 group"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Ingresando...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-slate-400 font-medium">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="text-brand-blue font-black hover:underline decoration-brand-orange decoration-2 underline-offset-4 transition-all">
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
