'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './Button';
import { useAuth } from '@/lib/auth-context';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles, 
  Cpu, 
  Layers, 
  FileText, 
  ExternalLink, 
  ArrowRight, 
  User, 
  LogOut, 
  Building, 
  LayoutDashboard, 
  BookOpen, 
  TrendingUp,
  Search,
  UserPlus
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Estatus de menús desplegables (Desktop)
  const [activeDropdown, setActiveDropdown] = useState<'soluciones' | 'plataforma' | 'recursos' | 'candidatos' | 'usuario' | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Estatus de menús expandibles (Mobile Accordion)
  const [mobileActiveSub, setMobileActiveSub] = useState<'soluciones' | 'plataforma' | 'recursos' | 'candidatos' | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Controladores de Hover con Grace Period (Debounce de 120ms para una experiencia física y fluida del mouse)
  const handleMouseEnter = (menu: 'soluciones' | 'plataforma' | 'recursos' | 'candidatos' | 'usuario') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
  };

  const toggleMobileSub = (menu: 'soluciones' | 'plataforma' | 'recursos' | 'candidatos') => {
    setMobileActiveSub(mobileActiveSub === menu ? null : menu);
  };

  // Cierre de todos los menús al navegar
  const handleNavClick = () => {
    setIsOpen(false);
    setActiveDropdown(null);
    setMobileActiveSub(null);
  };

  return (
    <header className="fixed top-0 z-[100] w-full transition-all duration-500 pt-4">
      <div className="container mx-auto px-4">
        {/* Floating Capsule Nav Container */}
        <div className={`backdrop-blur-2xl border rounded-[2.5rem] px-3 sm:px-4 lg:px-3 xl:px-8 2xl:px-10 h-20 flex items-center justify-between ring-1 transition-all duration-500 ${
          scrolled
            ? 'bg-[#07070f]/90 border-white/12 shadow-[0_12px_40px_0_rgba(0,0,0,0.65)] ring-white/10'
            : 'bg-[#07070f]/35 border-white/8 shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] ring-white/5'
        }`}>
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95 flex-shrink-0">
            <div className="relative w-[140px] sm:w-[180px] lg:w-[120px] xl:w-[160px] 2xl:w-[200px] h-8 sm:h-10 lg:h-8 xl:h-10 2xl:h-11">
              <Image
                src="/logo.png"
                fill
                className="object-contain object-left brightness-0 invert"
                alt="Hacke's Jobs Technologies"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex gap-1.5 xl:gap-4 2xl:gap-7 items-center text-[8px] xl:text-[9.5px] 2xl:text-[10px] font-black uppercase tracking-wider xl:tracking-[0.2em] 2xl:tracking-[0.25em] text-slate-300 flex-shrink">
            
            {/* SOLUCIONES (Mega Menu Dropdown para Empresas) */}
            <div 
              className="relative py-6"
              onMouseEnter={() => handleMouseEnter('soluciones')}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`hover:text-white flex items-center gap-1.5 transition-colors duration-300 focus:outline-none whitespace-nowrap ${
                activeDropdown === 'soluciones' ? 'text-white' : ''
              }`}>
                EMPRESAS
                <ChevronDown size={12} className={`transition-transform duration-300 ${
                  activeDropdown === 'soluciones' ? 'rotate-180 text-brand-orange' : 'text-slate-400'
                }`} />
              </button>

              {/* Soluciones Mega Menu Panel */}
              {activeDropdown === 'soluciones' && (
                <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-[25%] w-[680px] glass-card-dark rounded-3xl p-6 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="col-span-2 text-[9px] font-black text-brand-orange tracking-[0.3em] pb-2 border-b border-white/5 uppercase">
                    Servicios de Atracción & Reclutamiento B2B
                  </div>

                  <Link href="/empresas" onClick={handleNavClick} className="group/item p-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-orange-500/10 text-brand-orange group-hover/item:bg-brand-orange group-hover/item:text-white transition-colors duration-300">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white tracking-wider group-hover/item:text-brand-orange transition-colors">HEADHUNTING CON IA</div>
                        <div className="text-[9px] font-medium text-slate-400 normal-case tracking-normal mt-1 leading-normal">
                          Atracción estratégica de talento clave respaldada por algoritmos de perfilado avanzado y consultores senior.
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/empresas" onClick={handleNavClick} className="group/item p-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-brand-blue group-hover/item:bg-brand-blue group-hover/item:text-white transition-colors duration-300">
                        <Cpu size={18} />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white tracking-wider group-hover/item:text-brand-blue transition-colors">AUTOMATIZACIÓN RPO</div>
                        <div className="text-[9px] font-medium text-slate-400 normal-case tracking-normal mt-1 leading-normal">
                          Tercerización completa del pipeline de atracción. Diseñamos tus workflows e integramos pipelines eficientes.
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/psicometrias" onClick={handleNavClick} className="group/item p-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-colors duration-300">
                        <Layers size={18} />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white tracking-wider group-hover/item:text-emerald-400 transition-colors">PSICOMETRÍA AVANZADA</div>
                        <div className="text-[9px] font-medium text-slate-400 normal-case tracking-normal mt-1 leading-normal">
                          Evaluaciones en lote automatizadas con reportes consolidados y scoring predictivo de candidatos.
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/contacto" onClick={handleNavClick} className="group/item p-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover/item:bg-purple-500 group-hover/item:text-white transition-colors duration-300">
                        <Building size={18} />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white tracking-wider group-hover/item:text-purple-400 transition-colors">EMPLOYER BRANDING</div>
                        <div className="text-[9px] font-medium text-slate-400 normal-case tracking-normal mt-1 leading-normal">
                          Posiciona la cultura tecnológica de tu compañía y conviértete en un imán para los mejores ingenieros.
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Mega Menu Footer Banner */}
                  <Link 
                    href="/empresas/requisicion" 
                    onClick={handleNavClick}
                    className="col-span-2 mt-2 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-orange/20 flex items-center justify-between text-[9px] font-bold text-slate-300 hover:text-white transition-all group/banner"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-brand-orange animate-pulse"></span>
                      <span>¿Listo para contratar? Levanta tu perfil de requisición empresarial con IA ahora</span>
                    </div>
                    <span className="flex items-center gap-1 text-brand-orange font-black uppercase tracking-widest group-hover/banner:translate-x-1 transition-transform">
                      Iniciar
                      <ArrowRight size={10} />
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* PLATAFORMA (SaaS & Future tech Dropdown) */}
            <div 
              className="relative py-6"
              onMouseEnter={() => handleMouseEnter('plataforma')}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`hover:text-white flex items-center gap-1.5 transition-colors duration-300 focus:outline-none whitespace-nowrap ${
                activeDropdown === 'plataforma' ? 'text-white' : ''
              }`}>
                PLATAFORMA
                <ChevronDown size={12} className={`transition-transform duration-300 ${
                  activeDropdown === 'plataforma' ? 'rotate-180 text-brand-blue' : 'text-slate-400'
                }`} />
              </button>

              {/* Plataforma Dropdown Panel */}
              {activeDropdown === 'plataforma' && (
                <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-[340px] glass-card-dark rounded-3xl p-5 flex flex-col gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="text-[9px] font-black text-brand-blue tracking-[0.3em] pb-1 border-b border-white/5 uppercase">
                    Ecosistema SaaS & Automatizaciones
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 opacity-60 relative group/saas select-none">
                    <div className="absolute top-3 right-3 px-2 py-0.5 text-[7px] font-black text-brand-orange bg-brand-orange/10 border border-brand-orange/20 rounded-full tracking-widest uppercase">
                      PROXIMAMENTE
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 text-slate-400">
                        <LayoutDashboard size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-300">ATS INTELIGENTE</div>
                        <div className="text-[8px] font-medium text-slate-500 normal-case tracking-normal mt-0.5 leading-normal">
                          Gestión y pipeline visual de candidatos.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 opacity-60 relative group/saas select-none">
                    <div className="absolute top-3 right-3 px-2 py-0.5 text-[7px] font-black text-brand-orange bg-brand-orange/10 border border-brand-orange/20 rounded-full tracking-widest uppercase">
                      PROXIMAMENTE
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 text-slate-400">
                        <User size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-300">TALENT CRM & POOLS</div>
                        <div className="text-[8px] font-medium text-slate-500 normal-case tracking-normal mt-0.5 leading-normal">
                          Base de datos automatizada y comunicación activa.
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link href="/empresas" onClick={handleNavClick} className="group/item p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-brand-blue group-hover/item:bg-brand-blue group-hover/item:text-white transition-colors duration-300">
                        <Cpu size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-white group-hover/item:text-brand-blue transition-colors">INTEGRACIONES & API</div>
                        <div className="text-[8px] font-medium text-slate-400 normal-case tracking-normal mt-0.5 leading-normal">
                          Conecta flujos de contratación vía n8n, Slack o ERP.
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* PRECIOS (Empresas) */}
            <Link 
              href="/precios" 
              onClick={handleNavClick}
              className="hover:text-white relative group/link transition-colors duration-300 whitespace-nowrap"
            >
              PRECIOS
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-brand-orange rounded-full transition-all duration-300 ease-out group-hover/link:w-full"></span>
            </Link>

            {/* RECURSOS */}
            <div 
              className="relative py-6"
              onMouseEnter={() => handleMouseEnter('recursos')}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`hover:text-white flex items-center gap-1.5 transition-colors duration-300 focus:outline-none whitespace-nowrap ${
                activeDropdown === 'recursos' ? 'text-white' : ''
              }`}>
                RECURSOS
                <ChevronDown size={12} className={`transition-transform duration-300 ${
                  activeDropdown === 'recursos' ? 'rotate-180 text-brand-orange' : 'text-slate-400'
                }`} />
              </button>

              {/* Recursos Dropdown Panel */}
              {activeDropdown === 'recursos' && (
                <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-[280px] glass-card-dark rounded-3xl p-4 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-3 duration-200">
                  <Link href="/blog" onClick={handleNavClick} className="group/item p-2.5 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-500/10 text-brand-orange group-hover/item:bg-brand-orange group-hover/item:text-white transition-colors duration-300">
                        <BookOpen size={14} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-white group-hover/item:text-brand-orange transition-colors">BLOG CORPORATIVO</div>
                        <div className="text-[8px] font-medium text-slate-400 normal-case tracking-normal mt-0.5">Análisis, reportes salariales y tendencias.</div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/empresas/requisicion" onClick={handleNavClick} className="group/item p-2.5 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-brand-blue group-hover/item:bg-brand-blue group-hover/item:text-white transition-colors duration-300">
                        <FileText size={14} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-white group-hover/item:text-brand-blue transition-colors">BIBLIOTECA DE PLANTILLAS</div>
                        <div className="text-[8px] font-medium text-slate-400 normal-case tracking-normal mt-0.5">Estructura tus vacantes de forma perfecta.</div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/empresas" onClick={handleNavClick} className="group/item p-2.5 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-colors duration-300">
                        <TrendingUp size={14} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-white group-hover/item:text-emerald-400 transition-colors">CASOS DE ÉXITO</div>
                        <div className="text-[8px] font-medium text-slate-400 normal-case tracking-normal mt-0.5">Cómo startups escalan su equipo técnico.</div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* SEPARADOR DE SECCIÓN */}
            <div className="h-4 w-[1px] bg-white/10 mx-1"></div>

            {/* BOLSA DE TRABAJO (Enlace de primer nivel de alta visibilidad para Candidatos) */}
            <Link 
              href="/vacantes" 
              onClick={handleNavClick}
              className="text-brand-orange hover:text-orange-400 flex items-center gap-1.5 xl:gap-2 relative group/link transition-all duration-300 py-1.5 px-2.5 xl:px-3.5 rounded-full bg-orange-500/5 hover:bg-orange-500/10 border border-brand-orange/20 font-black tracking-wider xl:tracking-widest text-[8px] xl:text-[10px] whitespace-nowrap"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-brand-orange animate-pulse"></span>
              BOLSA DE TRABAJO
            </Link>

            {/* SECCIÓN CANDIDATOS (Dropdown Dedicado para simplificar la vida de quienes buscan empleo) */}
            <div 
              className="relative py-6"
              onMouseEnter={() => handleMouseEnter('candidatos')}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`hover:text-white flex items-center gap-1.5 transition-colors duration-300 focus:outline-none whitespace-nowrap ${
                activeDropdown === 'candidatos' ? 'text-white' : ''
              }`}>
                SOY CANDIDATO
                <ChevronDown size={12} className={`transition-transform duration-300 ${
                  activeDropdown === 'candidatos' ? 'rotate-180 text-brand-orange' : 'text-slate-400'
                }`} />
              </button>

              {/* Panel de Candidatos Dropdown (Claro y directo) */}
              {activeDropdown === 'candidatos' && (
                <div className="absolute top-[calc(100%-8px)] right-0 w-[280px] glass-card-dark rounded-3xl p-4 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="text-[9px] font-black text-brand-orange tracking-[0.3em] pb-1 border-b border-white/5 uppercase text-left">
                    Ecosistema de Talento
                  </div>

                  <Link href="/register" onClick={handleNavClick} className="group/cand-item p-2.5 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-brand-blue group-hover/cand-item:bg-brand-blue group-hover/cand-item:text-white transition-colors duration-300">
                        <UserPlus size={14} />
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] font-black text-white group-hover/cand-item:text-brand-blue transition-colors">REGISTRAR CV / PERFIL</div>
                        <div className="text-[8px] font-medium text-slate-400 normal-case tracking-normal mt-0.5 leading-normal">
                          Sube tu CV para que nuestra IA te vincule automáticamente a vacantes compatibles.
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/candidatos" onClick={handleNavClick} className="group/cand-item p-2.5 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover/cand-item:bg-emerald-500 group-hover/cand-item:text-white transition-colors duration-300">
                        <User size={14} />
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] font-black text-white group-hover/cand-item:text-emerald-400 transition-colors">PORTAL DE TALENTO</div>
                        <div className="text-[8px] font-medium text-slate-400 normal-case tracking-normal mt-0.5 leading-normal">
                          Conoce los beneficios de la terna inteligente, evaluaciones psicométricas y preparación.
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

          </nav>

          {/* Action Area & CTAs (ThemeToggle, Login, primary B2B CTA or Authenticated User Profile) */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            
            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-4">
              {isAuthenticated ? (
                /* Profile Dropdown for B2B Client / Candidate */
                <div 
                  className="relative py-2"
                  onMouseEnter={() => handleMouseEnter('usuario')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className={`flex items-center gap-3.5 pl-3 pr-4 h-11 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all active:scale-95 focus:outline-none ${
                    activeDropdown === 'usuario' ? 'bg-white/10 border-brand-orange/30' : ''
                  }`}>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-orange to-brand-blue flex items-center justify-center text-white text-[9px] font-black uppercase ring-1 ring-white/10">
                      {user?.name ? user.name.slice(0, 2) : <User size={12} />}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-black text-white max-w-[90px] truncate uppercase tracking-widest">{user?.name}</span>
                      <span className="text-[7px] font-bold text-slate-400 tracking-wider lowercase max-w-[90px] truncate">{user?.email}</span>
                    </div>
                    <ChevronDown size={11} className={`text-slate-400 transition-transform duration-300 ${
                      activeDropdown === 'usuario' ? 'rotate-180 text-brand-orange' : ''
                    }`} />
                  </button>

                  {/* Authenticated User Menu */}
                  {activeDropdown === 'usuario' && (
                    <div className="absolute top-[calc(100%-4px)] right-0 w-[240px] glass-card-dark rounded-2xl p-3 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-3 duration-200">
                      <div className="px-3.5 py-2 border-b border-white/5 mb-1.5 text-left">
                        <div className="text-[9px] font-black text-brand-orange tracking-widest uppercase">
                          {user?.role === 'company' ? 'CUENTA EMPRESA' : 'PORTAL TALENTO'}
                        </div>
                        <div className="text-[7px] font-bold text-slate-500 mt-0.5 uppercase tracking-wider">HACKE'S JOBS PLATFORM</div>
                      </div>

                      <Link href="/dashboard" onClick={handleNavClick} className="group/user-link p-2 rounded-xl hover:bg-white/5 flex items-center gap-3 text-slate-300 hover:text-white transition-all">
                        <LayoutDashboard size={14} className="text-slate-400 group-hover/user-link:text-brand-orange transition-colors" />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Mi Dashboard</span>
                      </Link>

                      {user?.role === 'company' && (
                        <Link href="/empresas/requisicion" onClick={handleNavClick} className="group/user-link p-2 rounded-xl hover:bg-white/5 flex items-center gap-3 text-slate-300 hover:text-white transition-all">
                          <FileText size={14} className="text-slate-400 group-hover/user-link:text-brand-blue transition-colors" />
                          <span className="text-[9px] font-bold tracking-widest uppercase font-black text-brand-blue">Nueva Requisición</span>
                        </Link>
                      )}

                      <button 
                        onClick={() => {
                          handleNavClick();
                          logout();
                        }}
                        className="group/user-link p-2 rounded-xl hover:bg-red-500/5 hover:border hover:border-red-500/10 flex items-center gap-3 text-slate-400 hover:text-red-400 transition-all mt-1 w-full text-left"
                      >
                        <LogOut size={14} className="text-slate-500 group-hover/user-link:text-red-400 transition-colors" />
                        <span className="text-[9px] font-black tracking-widest uppercase">Cerrar Sesión</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" onClick={handleNavClick} className="hidden min-[1200px]:inline-flex">
                    <Button variant="ghost" size="sm" className="font-black text-[9px] xl:text-[10px] uppercase tracking-wider xl:tracking-[0.2em] text-white hover:text-brand-orange transition-colors whitespace-nowrap">
                      Ingresar
                    </Button>
                  </Link>
                  <Link href="/empresas/requisicion" onClick={handleNavClick}>
                    {/* CRO-focused glow B2B CTA button */}
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="rounded-2xl px-3 lg:px-3 lg:h-9 lg:text-[7.5px] xl:px-5 xl:h-10 xl:text-[8.5px] 2xl:px-6 2xl:h-11 2xl:text-[9.5px] shadow-[0_4px_20px_rgba(249,115,22,0.25)] hover:shadow-[0_4px_30px_rgba(249,115,22,0.45)] tracking-wider xl:tracking-widest uppercase border-none bg-gradient-to-r from-brand-orange to-orange-600 transition-all hover:scale-[1.03] active:scale-95 whitespace-nowrap"
                    >
                      SOLICITAR TALENTO
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Theme Toggle (Integrates cleanly) */}
            <ThemeToggle />

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={toggleMenu} 
              className="lg:hidden text-brand-orange hover:text-orange-400 transition-all duration-300 p-2.5 bg-white/5 rounded-xl border border-white/10 active:scale-95 flex-shrink-0"
              aria-label="Abrir navegación móvil"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>

        {/* Mobile Accordion Navigation Panel */}
        {isOpen && (
          <div className="mobile-menu-panel lg:hidden mt-4 glass-card-dark rounded-[2.5rem] p-8 flex flex-col gap-6 items-center text-center animate-in fade-in slide-in-from-top-6 duration-300 max-h-[85vh] overflow-y-auto w-full">
            
            <nav className="flex flex-col gap-4 text-[11px] font-black uppercase tracking-[0.25em] text-white w-full">
              
              {/* SECTOR EMPRESAS HEADER */}
              <div className="text-[9px] font-black text-brand-blue tracking-[0.3em] text-left border-b border-white/5 pb-1 uppercase mt-2">
                💼 Para Empresas (B2B)
              </div>

              {/* SOLUCIONES (Mobile B2B) */}
              <div className="border-b border-white/5 pb-2">
                <button 
                  onClick={() => toggleMobileSub('soluciones')}
                  className="w-full flex items-center justify-between py-2 text-slate-200 hover:text-white"
                >
                  <span>Servicios de Reclutamiento</span>
                  <ChevronDown size={14} className={`text-brand-orange transition-transform duration-300 ${
                    mobileActiveSub === 'soluciones' ? 'rotate-180' : ''
                  }`} />
                </button>

                {mobileActiveSub === 'soluciones' && (
                  <div className="flex flex-col gap-3.5 pl-4 pr-2 pt-2 pb-1 text-[10px] items-start text-left text-slate-400 bg-white/5 rounded-2xl p-4 mt-1 border border-white/5 w-full">
                    <Link href="/empresas" onClick={handleNavClick} className="hover:text-brand-orange py-1 flex items-center gap-2">
                      <Sparkles size={12} className="text-brand-orange" /> HEADHUNTING IA
                    </Link>
                    <Link href="/empresas" onClick={handleNavClick} className="hover:text-brand-blue py-1 flex items-center gap-2">
                      <Cpu size={12} className="text-brand-blue" /> AUTOMATIZACIÓN RPO
                    </Link>
                    <Link href="/psicometrias" onClick={handleNavClick} className="hover:text-emerald-400 py-1 flex items-center gap-2">
                      <Layers size={12} className="text-emerald-400" /> PSICOMETRÍA AVANZADA
                    </Link>
                    <Link href="/contacto" onClick={handleNavClick} className="hover:text-purple-400 py-1 flex items-center gap-2">
                      <Building size={12} className="text-purple-400" /> EMPLOYER BRANDING
                    </Link>
                  </div>
                )}
              </div>

              {/* PLATAFORMA (Mobile B2B) */}
              <div className="border-b border-white/5 pb-2">
                <button 
                  onClick={() => toggleMobileSub('plataforma')}
                  className="w-full flex items-center justify-between py-2 text-slate-200 hover:text-white"
                >
                  <span>SaaS & Tecnología</span>
                  <ChevronDown size={14} className={`text-brand-blue transition-transform duration-300 ${
                    mobileActiveSub === 'plataforma' ? 'rotate-180' : ''
                  }`} />
                </button>

                {mobileActiveSub === 'plataforma' && (
                  <div className="flex flex-col gap-3.5 pl-4 pr-2 pt-2 pb-1 text-[10px] items-start text-left text-slate-500 bg-white/5 rounded-2xl p-4 mt-1 border border-white/5 w-full">
                    <div className="py-1 flex items-center justify-between w-full opacity-50">
                      <span className="flex items-center gap-2"><LayoutDashboard size={12} /> ATS INTELIGENTE</span>
                      <span className="text-[6px] font-black text-brand-orange border border-brand-orange/20 px-1.5 py-0.5 rounded-full">PRÓX.</span>
                    </div>
                    <div className="py-1 flex items-center justify-between w-full opacity-50">
                      <span className="flex items-center gap-2"><User size={12} /> TALENT CRM & POOLS</span>
                      <span className="text-[6px] font-black text-brand-orange border border-brand-orange/20 px-1.5 py-0.5 rounded-full">PRÓX.</span>
                    </div>
                    <Link href="/empresas" onClick={handleNavClick} className="hover:text-brand-blue py-1 flex items-center gap-2 text-slate-400">
                      <Cpu size={12} className="text-brand-blue" /> INTEGRACIONES & API
                    </Link>
                  </div>
                )}
              </div>

              {/* PRECIOS */}
              <Link 
                href="/precios" 
                onClick={handleNavClick}
                className="hover:text-brand-orange py-2 text-slate-200 hover:text-white border-b border-white/5 flex justify-between items-center text-left"
              >
                <span>Planes & Precios B2B</span>
                <ChevronDown size={14} className="-rotate-90 text-slate-600" />
              </Link>

              {/* RECURSOS */}
              <div className="border-b border-white/5 pb-2">
                <button 
                  onClick={() => toggleMobileSub('recursos')}
                  className="w-full flex items-center justify-between py-2 text-slate-200 hover:text-white"
                >
                  <span>Biblioteca & Recursos</span>
                  <ChevronDown size={14} className={`text-brand-orange transition-transform duration-300 ${
                    mobileActiveSub === 'recursos' ? 'rotate-180' : ''
                  }`} />
                </button>

                {mobileActiveSub === 'recursos' && (
                  <div className="flex flex-col gap-3.5 pl-4 pr-2 pt-2 pb-1 text-[10px] items-start text-left text-slate-400 bg-white/5 rounded-2xl p-4 mt-1 border border-white/5 w-full">
                    <Link href="/blog" onClick={handleNavClick} className="hover:text-brand-orange py-1 flex items-center gap-2">
                      <BookOpen size={12} className="text-brand-orange" /> BLOG CORPORATIVO
                    </Link>
                    <Link href="/empresas/requisicion" onClick={handleNavClick} className="hover:text-brand-blue py-1 flex items-center gap-2">
                      <FileText size={12} className="text-brand-blue" /> BIBLIOTECA DE PLANTILLAS
                    </Link>
                    <Link href="/empresas" onClick={handleNavClick} className="hover:text-emerald-400 py-1 flex items-center gap-2">
                      <TrendingUp size={12} className="text-emerald-400" /> CASOS DE ÉXITO
                    </Link>
                  </div>
                )}
              </div>

              {/* SECTOR CANDIDATOS HEADER */}
              <div className="text-[9px] font-black text-brand-orange tracking-[0.3em] text-left border-b border-white/5 pb-1 uppercase mt-6">
                👩‍💻 Para Candidatos (Talento)
              </div>

              {/* ACCESOS DIRECTOS SIN ACORDEONES ANIDADOS */}
              <div className="flex flex-col gap-3 pt-2 text-left w-full">
                {/* BOLSA DE EMPLEO - BOTÓN PRINCIPAL DE ALTA GAMA */}
                <Link 
                  href="/vacantes" 
                  onClick={handleNavClick}
                  className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-orange-500/10 to-orange-600/5 hover:from-orange-500/15 border border-brand-orange/20 hover:border-brand-orange/45 rounded-2xl transition-all duration-300 w-full group select-none"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-pulse" />
                    <span className="text-[10px] font-black text-white group-hover:text-brand-orange transition-colors uppercase tracking-[0.15em]">BOLSA DE TRABAJO (VACANTES)</span>
                  </span>
                  <ArrowRight size={14} className="text-brand-orange group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* REGISTRAR MI CV */}
                <Link 
                  href="/register" 
                  onClick={handleNavClick} 
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 rounded-xl text-slate-300 hover:text-white transition-all text-[10px] font-black tracking-widest uppercase"
                >
                  <UserPlus size={14} className="text-brand-blue" />
                  <span>REGISTRAR MI CV / PERFIL</span>
                </Link>

                {/* PORTAL DE TALENTO */}
                <Link 
                  href="/candidatos" 
                  onClick={handleNavClick} 
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 rounded-xl text-slate-300 hover:text-white transition-all text-[10px] font-black tracking-widest uppercase"
                >
                  <User size={14} className="text-emerald-400" />
                  <span>PORTAL DE TALENTO (CÓMO FUNCIONA)</span>
                </Link>
              </div>

            </nav>

            {/* Mobile CTAs */}
            <div className="flex flex-col gap-3.5 w-full pt-4 border-t border-white/5 mt-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-white/5 rounded-2xl border border-white/5 text-left w-full select-none">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-orange to-brand-blue flex items-center justify-center text-white text-[10px] font-black uppercase">
                      {user?.name ? user.name.slice(0, 2) : <User size={12} />}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] font-black text-white truncate max-w-[170px]">{user?.name}</span>
                      <span className="text-[8px] font-bold text-slate-500 truncate max-w-[170px] lowercase">{user?.email}</span>
                    </div>
                  </div>

                  <Link href="/dashboard" onClick={handleNavClick} className="w-full">
                    <Button variant="ghost" size="xl" className="w-full rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest border border-white/10 text-white">
                      MI DASHBOARD
                    </Button>
                  </Link>

                  <button 
                    onClick={() => {
                      handleNavClick();
                      logout();
                    }} 
                    className="w-full h-14 bg-red-500/10 hover:bg-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-400 border border-red-500/10 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <LogOut size={14} /> CERRAR SESIÓN
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={handleNavClick} className="w-full">
                    <Button variant="ghost" size="xl" className="w-full font-black text-[10px] uppercase tracking-widest text-white h-14 border border-white/5 rounded-2xl">
                      INGRESAR
                    </Button>
                  </Link>
                  <Link href="/empresas/requisicion" onClick={handleNavClick} className="w-full">
                    <Button 
                      variant="secondary" 
                      size="xl" 
                      className="w-full rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest bg-gradient-to-r from-brand-orange to-orange-600 border-none shadow-orange/20"
                    >
                      SOLICITAR TALENTO
                    </Button>
                  </Link>
                </>
              )}
            </div>

          </div>
        )}
      </div>
    </header>
  );
}


