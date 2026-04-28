'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth, type RegisterData } from '@/lib/auth-context';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, ArrowRight, Building2, UserCircle, Check, Briefcase, Brain, BarChart3 } from 'lucide-react';

type Role = 'company' | 'candidate';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [role, setRole] = useState<Role>('company');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    companyIndustry: '',
    companySize: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    const data: RegisterData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
      ...(role === 'company' ? {
        companyName: formData.companyName,
        companyIndustry: formData.companyIndustry,
        companySize: formData.companySize,
      } : {}),
    };

    const result = await register(data);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.message || 'Error al crear la cuenta');
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
        window.location.href = '/dashboard';
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
      <div className="hidden lg:flex lg:w-[45%] bg-brand-black relative overflow-hidden items-center justify-center p-16">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-orange/15 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-brand-blue/15 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-[url('/grid-light.svg')] opacity-[0.03]" />

        <div className="relative z-10 max-w-lg space-y-12">
          <div>
            <div className="relative w-[200px] h-[60px] mb-12">
              <Image src="/logo.png" fill className="object-contain object-left brightness-0 invert" alt="Hacke's Jobs" priority />
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter leading-[0.9] mb-6">
              Únete a la revolución del <span className="text-brand-orange">talento.</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed">
              Miles de empresas ya optimizan su reclutamiento con nosotros.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Briefcase, label: 'Vacantes ilimitadas', desc: 'Publica y gestiona todas tus posiciones' },
              { icon: Brain, label: 'Tests psicométricos', desc: 'Evaluaciones DISC y más, integradas' },
              { icon: BarChart3, label: 'Scoring inteligente', desc: 'Rankea candidatos automáticamente' },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <feature.icon size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{feature.label}</h4>
                  <p className="text-slate-500 text-xs font-medium">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── RIGHT: REGISTER FORM ────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-lg space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-4">
            <div className="relative w-[180px] h-[50px]">
              <Image src="/logo.png" fill className="object-contain" alt="Hacke's Jobs" priority />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-black text-brand-black tracking-tighter">Crear cuenta</h2>
            <p className="text-slate-400 font-medium text-lg">Selecciona tu perfil para comenzar</p>
          </div>

          {/* ─── ROLE SELECTOR ─────────────────────── */}
          <div className="grid grid-cols-2 gap-4">
            {([
              { id: 'company' as Role, label: 'Soy Empresa', desc: 'Publicar vacantes y contratar', icon: Building2, color: 'brand-blue' },
              { id: 'candidate' as Role, label: 'Soy Candidato', desc: 'Buscar empleo y evaluarme', icon: UserCircle, color: 'brand-orange' },
            ]).map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => setRole(option.id)}
                className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group ${
                  role === option.id
                    ? `border-${option.color} bg-${option.color}/5 shadow-lg`
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
                style={role === option.id ? {
                  borderColor: option.id === 'company' ? '#1E40AF' : '#F97316',
                  backgroundColor: option.id === 'company' ? 'rgba(30,64,175,0.05)' : 'rgba(249,115,22,0.05)',
                } : {}}
              >
                {role === option.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: option.id === 'company' ? '#1E40AF' : '#F97316' }}>
                    <Check size={14} className="text-white" />
                  </div>
                )}
                <option.icon size={28} className={`mb-3 ${role === option.id ? (option.id === 'company' ? 'text-brand-blue' : 'text-brand-orange') : 'text-slate-300'} transition-colors`} />
                <h4 className="font-black text-brand-black text-sm uppercase tracking-tight">{option.label}</h4>
                <p className="text-[11px] text-slate-400 font-medium mt-1">{option.desc}</p>
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          {role === 'candidate' && (
            <>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Error al conectar con Google')}
                  useOneTap
                  theme="outline"
                  size="large"
                  width="100%"
                  text="signup_with"
                  shape="pill"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-400 font-bold uppercase tracking-widest text-[10px]">O regístrate con tu email</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Nombre completo <span className="text-brand-orange">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-brand-black placeholder-slate-300 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Email {role === 'company' ? 'corporativo' : ''} <span className="text-brand-orange">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={role === 'company' ? 'contacto@empresa.com' : 'tu@email.com'}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-brand-black placeholder-slate-300 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Contraseña <span className="text-brand-orange">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-5 py-4 pr-14 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-brand-black placeholder-slate-300 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-medium"
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

            {/* ─── COMPANY FIELDS ──────────────────── */}
            {role === 'company' && (
              <div className="space-y-5 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="pt-4 space-y-2">
                  <label htmlFor="companyName" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Nombre de la empresa <span className="text-brand-orange">*</span>
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Ej. TechCorp México"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-brand-black placeholder-slate-300 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="companyIndustry" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                      Industria
                    </label>
                    <input
                      id="companyIndustry"
                      name="companyIndustry"
                      type="text"
                      value={formData.companyIndustry}
                      onChange={handleChange}
                      placeholder="Ej. Fintech"
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-brand-black placeholder-slate-300 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="companySize" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                      Tamaño
                    </label>
                    <select
                      id="companySize"
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-brand-black focus:bg-white focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-medium appearance-none"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 bg-brand-black text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-brand-black/90 focus:ring-4 focus:ring-brand-blue/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-brand-black/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear mi cuenta
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-slate-400 font-medium">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-brand-blue font-black hover:underline decoration-brand-orange decoration-2 underline-offset-4 transition-all">
                Inicia sesión
              </Link>
            </p>
          </div>

          <p className="text-center text-[10px] text-slate-300 font-medium uppercase tracking-widest">
            Al registrarte aceptas los Términos de Servicio
          </p>
        </div>
      </div>
    </div>
  );
}
