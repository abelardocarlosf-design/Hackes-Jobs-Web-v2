'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { useAuth } from '@/lib/auth-context';
import {
  Menu,
  X,
  ChevronDown,
  FileText,
  ArrowRight,
  User,
  LogOut,
  LayoutDashboard,
  UserPlus,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

// Navegación pública simplificada: links directos, sin mega-menús SaaS.
const NAV_LINKS = [
  { href: '/empresas', label: 'EMPRESAS' },
  { href: '/psicometrias', label: 'PSICOMETRÍAS' },
  { href: '/precios', label: 'PRECIOS' },
  { href: '/blog', label: 'BLOG' },
  { href: '/contacto', label: 'CONTACTO' },
];

/**
 * Animated "tubelight" indicator (21st.dev pattern) — a glowing pill that
 * slides between top-level nav items via framer-motion shared layout, topped
 * with a brand-orange light bar and soft halo.
 */
function NavLamp() {
  return (
    <motion.span
      layoutId="nav-lamp"
      className="absolute inset-0 -z-10 rounded-full bg-white/[0.07] ring-1 ring-white/10"
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
    >
      <span className="absolute -top-[14px] left-1/2 h-1 w-9 -translate-x-1/2 rounded-full bg-brand-orange shadow-[0_0_10px_2px_rgba(249,115,22,0.7)]">
        <span className="absolute -left-3 -top-2 h-6 w-14 rounded-full bg-brand-orange/25 blur-md" />
        <span className="absolute -top-1 h-6 w-9 rounded-full bg-brand-orange/20 blur-md" />
        <span className="absolute left-2 top-0 h-4 w-4 rounded-full bg-brand-orange/30 blur-sm" />
      </span>
    </motion.span>
  );
}

// Reusable motion props for the dropdown panels.
const panelMotion = {
  initial: { opacity: 0, y: -8, filter: 'blur(6px)', scale: 0.98 },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 },
  exit: { opacity: 0, y: -8, filter: 'blur(6px)', scale: 0.98 },
  transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const },
};

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Estatus de menús desplegables (Desktop)
  const [activeDropdown, setActiveDropdown] = useState<'candidatos' | 'usuario' | null>(null);
  // Item resaltado por la lámpara (incluye enlaces sin dropdown)
  const [hovered, setHovered] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
  const handleMouseEnter = (menu: 'candidatos' | 'usuario') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
  };

  // Cierre de todos los menús al navegar
  const handleNavClick = () => {
    setIsOpen(false);
    setActiveDropdown(null);
    setHovered(null);
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
                sizes="200px"
                className="object-contain object-left brightness-0 invert"
                alt="Hacke's Jobs Technologies"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            onMouseLeave={() => setHovered(null)}
            className="hidden lg:flex gap-1.5 xl:gap-4 2xl:gap-7 items-center text-[8px] xl:text-[9.5px] 2xl:text-[10px] font-black uppercase tracking-wider xl:tracking-[0.2em] 2xl:tracking-[0.25em] text-slate-300 flex-shrink"
          >

            {/* LINKS DIRECTOS (Empresas · Psicometrías · Precios · Blog · Contacto) */}
            {NAV_LINKS.map(({ href, label }) => (
              <div
                key={href}
                className="relative py-6"
                onMouseEnter={() => setHovered(href)}
              >
                <Link
                  href={href}
                  onClick={handleNavClick}
                  className={`isolate relative flex items-center rounded-full px-3 py-2 transition-colors duration-300 whitespace-nowrap hover:text-white ${
                    hovered === href ? 'text-white' : ''
                  }`}
                >
                  {label}
                  {hovered === href && <NavLamp />}
                </Link>
              </div>
            ))}

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
              onMouseEnter={() => { handleMouseEnter('candidatos'); setHovered('candidatos'); }}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`isolate relative flex items-center gap-1.5 rounded-full px-3 py-2 transition-colors duration-300 focus:outline-none whitespace-nowrap hover:text-white ${
                hovered === 'candidatos' ? 'text-white' : ''
              }`}>
                SOY CANDIDATO
                <ChevronDown size={12} className={`transition-transform duration-300 ${
                  activeDropdown === 'candidatos' ? 'rotate-180 text-brand-orange' : 'text-slate-400'
                }`} />
                {hovered === 'candidatos' && <NavLamp />}
              </button>

              {/* Panel de Candidatos Dropdown (Claro y directo) */}
              <AnimatePresence>
                {activeDropdown === 'candidatos' && (
                  <motion.div {...panelMotion} className="absolute top-[calc(100%-8px)] right-0 w-[280px] glass-card-dark rounded-3xl p-4 flex flex-col gap-2.5">
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
                  </motion.div>
                )}
              </AnimatePresence>
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
                  <AnimatePresence>
                    {activeDropdown === 'usuario' && (
                      <motion.div {...panelMotion} className="absolute top-[calc(100%-4px)] right-0 w-[240px] glass-card-dark rounded-2xl p-3 flex flex-col gap-1.5">
                        <div className="px-3.5 py-2 border-b border-white/5 mb-1.5 text-left">
                          <div className="text-[9px] font-black text-brand-orange tracking-widest uppercase">
                            {user?.role === 'company' ? 'CUENTA EMPRESA' : 'PORTAL TALENTO'}
                          </div>
                          <div className="text-[7px] font-bold text-slate-500 mt-0.5 uppercase tracking-wider">HACKE&apos;S JOBS PLATFORM</div>
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
                      </motion.div>
                    )}
                  </AnimatePresence>
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
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mobile-menu-panel lg:hidden mt-4 glass-card-dark rounded-[2.5rem] p-8 flex flex-col gap-6 items-center text-center max-h-[85vh] overflow-y-auto w-full"
            >

              <nav className="flex flex-col gap-4 text-[11px] font-black uppercase tracking-[0.25em] text-white w-full">

                {/* SECTOR EMPRESAS HEADER */}
                <div className="text-[9px] font-black text-brand-blue tracking-[0.3em] text-left border-b border-white/5 pb-1 uppercase mt-2">
                  💼 Para Empresas (B2B)
                </div>

                {/* LINKS DIRECTOS (Mobile B2B) */}
                {[
                  { href: '/empresas', label: 'Empresas' },
                  { href: '/psicometrias', label: 'Psicometrías' },
                  { href: '/precios', label: 'Precios' },
                  { href: '/blog', label: 'Blog' },
                  { href: '/contacto', label: 'Contacto' },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={handleNavClick}
                    className="py-2 text-slate-200 hover:text-white border-b border-white/5 flex justify-between items-center text-left"
                  >
                    <span>{label}</span>
                    <ChevronDown size={14} className="-rotate-90 text-slate-600" />
                  </Link>
                ))}

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

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
