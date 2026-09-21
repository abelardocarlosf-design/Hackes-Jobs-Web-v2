'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth, type RegisterData } from '@/lib/auth-context';
import { BotonGoogle } from '@/components/BotonGoogle';
import { inicioDe } from '@/lib/navegacion';
import { Eye, EyeOff, ArrowRight, Building2, UserCircle, Check, Briefcase, Brain, BarChart3 } from 'lucide-react';
import { PrivacyCheckbox } from '@/components/PrivacyCheckbox';

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
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!privacyAccepted) {
      setError('Debes aceptar el Aviso de Privacidad para registrarte.');
      setIsLoading(false);
      return;
    }

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
      // Empresa y candidato tienen paneles distintos: cada uno al suyo.
      router.push(inicioDe(result.user?.role ?? role));
    } else {
      setError(result.message || 'Error al crear la cuenta');
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
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
        window.location.href = inicioDe(data.data?.user?.role);
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
    <div className="min-h-screen flex font-sans overflow-hidden relative">
      <div className="page-overlay"></div>
      <div className="page-dotgrid"></div>
      
      {/* ─── LEFT: VISUAL PANEL ──────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-center justify-center p-16 z-10">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-lg space-y-12">
          <div>
            <div className="relative w-[200px] h-[60px] mb-12">
              <Image src="/logo.png" fill className="object-contain object-left drop-shadow-2xl" alt="Hacke's Jobs" priority />
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter leading-[0.9] mb-6">
              Únete a la revolución del <span className="text-brand-orange">talento.</span>
            </h1>
            <p className="text-lg text-slate-300 font-medium leading-relaxed">
              Miles de empresas ya optimizan su reclutamiento con nosotros.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Briefcase, label: 'Vacantes ilimitadas', desc: 'Publica y gestiona todas tus posiciones' },
              { icon: Brain, label: 'Tests psicométricos', desc: 'Evaluaciones DISC y más, integradas' },
              { icon: BarChart3, label: 'Scoring inteligente', desc: 'Rankea candidatos automáticamente' },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-5 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <feature.icon size={22} />
                </div>
                <div>
                  <h4 className="text-white font-black text-sm uppercase tracking-tight mb-1">{feature.label}</h4>
                  <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest leading-tight">{feature.desc}</p>
                </div>
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

      {/* ─── RIGHT: REGISTER FORM ────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative z-20 overflow-y-auto pt-24 pb-24">
        <div className="w-full max-w-lg space-y-10 bg-white/5 backdrop-blur-3xl p-10 sm:p-16 rounded-[4rem] border border-white/10 shadow-3xl">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="relative w-[180px] h-[50px]">
              <Image src="/logo.png" fill className="object-contain drop-shadow-2xl" alt="Hacke's Jobs" priority />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Crear cuenta</h2>
            <p className="text-slate-400 font-medium text-lg">Selecciona tu perfil para comenzar</p>
          </div>

          {/* ─── ROLE SELECTOR ─────────────────────── */}
          <div className="grid grid-cols-2 gap-4">
            {([
              { id: 'company' as Role, label: 'Empresa', desc: 'Contratar Talento', icon: Building2, color: 'brand-blue' },
              { id: 'candidate' as Role, label: 'Candidato', desc: 'Buscar Empleo', icon: UserCircle, color: 'brand-orange' },
            ]).map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => setRole(option.id)}
                className={`relative p-6 rounded-3xl border-2 text-left transition-all duration-300 group ${
                  role === option.id
                    ? `border-${option.color} bg-${option.color}/10 shadow-lg`
                    : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
                style={role === option.id ? {
                  borderColor: option.id === 'company' ? '#1E40AF' : '#F97316',
                } : {}}
              >
                {role === option.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center animate-in zoom-in duration-300"
                    style={{ backgroundColor: option.id === 'company' ? '#1E40AF' : '#F97316' }}>
                    <Check size={14} className="text-white" />
                  </div>
                )}
                <option.icon size={32} className={`mb-4 ${role === option.id ? (option.id === 'company' ? 'text-brand-blue' : 'text-brand-orange') : 'text-slate-600'} transition-colors group-hover:scale-110 duration-300`} />
                <h4 className="font-black text-white text-xs uppercase tracking-widest">{option.label}</h4>
                <p className="text-[10px] text-slate-500 font-black uppercase mt-1 tracking-widest">{option.desc}</p>
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-3xl p-6 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          {/* Solo para candidatos: el alta con Google siempre crea rol
              `candidate`, así que ofrecerlo en el flujo de empresa engañaría. */}
          {role === 'candidate' && (
            <BotonGoogle
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Error al conectar con Google')}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">
                Nombre Completo <span className="text-brand-orange">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                className="w-full h-16 px-8 rounded-3xl border border-white/10 bg-white/5 text-white placeholder-slate-700 focus:bg-white/10 focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">
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
                className="w-full h-16 px-8 rounded-3xl border border-white/10 bg-white/5 text-white placeholder-slate-700 focus:bg-white/10 focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">
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
                  className="w-full h-16 px-8 pr-16 rounded-3xl border border-white/10 bg-white/5 text-white placeholder-slate-700 focus:bg-white/10 focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* ─── COMPANY FIELDS ──────────────────── */}
            {role === 'company' && (
              <div className="space-y-6 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-3">
                  <label htmlFor="companyName" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">
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
                    className="w-full h-16 px-8 rounded-3xl border border-white/10 bg-white/5 text-white placeholder-slate-700 focus:bg-white/10 focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label htmlFor="companyIndustry" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">
                      Industria
                    </label>
                    <input
                      id="companyIndustry"
                      name="companyIndustry"
                      type="text"
                      value={formData.companyIndustry}
                      onChange={handleChange}
                      placeholder="Ej. Fintech"
                      className="w-full h-16 px-8 rounded-3xl border border-white/10 bg-white/5 text-white placeholder-slate-700 focus:bg-white/10 focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="companySize" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">
                      Tamaño
                    </label>
                    <select
                      id="companySize"
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                      className="w-full h-16 px-8 rounded-3xl border border-white/10 bg-white/5 text-white focus:bg-white/10 focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-bold appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-brand-black">Seleccionar...</option>
                      <option value="1-10" className="bg-brand-black">1-10</option>
                      <option value="11-50" className="bg-brand-black">11-50</option>
                      <option value="51-200" className="bg-brand-black">51-200</option>
                      <option value="201-500" className="bg-brand-black">201-500</option>
                      <option value="500+" className="bg-brand-black">500+</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <PrivacyCheckbox 
              type="reclutamiento" 
              checked={privacyAccepted} 
              onChange={setPrivacyAccepted} 
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-20 bg-brand-orange text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] focus:ring-4 focus:ring-brand-orange/20 transition-all duration-300 shadow-xl shadow-brand-orange/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group mt-4"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  CREANDO CUENTA...
                </>
              ) : (
                <>
                  Crear mi cuenta
                  <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center space-y-6">
            <p className="text-slate-400 font-medium text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-brand-orange font-black hover:text-orange-400 transition-colors uppercase tracking-widest text-[10px] ml-2">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
