'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './Button';
import { useAuth } from '@/lib/auth-context';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/psicometrias', label: 'Psicometrías' },
    { href: '/empresas', label: 'Automatización B2B' },
    { href: '/precios', label: 'Precios' },
    { href: '/blog', label: 'Blog' },
    { href: '/vacantes', label: 'Vacantes' },
    { href: '/contacto', label: 'Contacto' },
  ];

  return (
    <header className="fixed top-0 z-[100] w-full transition-all duration-500 pt-4">
      <div className="container mx-auto px-4">
        <div className={`backdrop-blur-2xl border border-white/10 rounded-[2.5rem] px-8 sm:px-12 h-20 flex items-center justify-between ring-1 ring-white/5 transition-all duration-500 ${
          scrolled
            ? 'bg-[#07070f]/80 shadow-[0_8px_40px_0_rgba(0,0,0,0.65)] border-white/12'
            : 'bg-[#07070f]/35 shadow-[0_8px_32px_0_rgba(0,0,0,0.35)]'
        }`}>
          <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95">
            <div className="relative w-[180px] sm:w-[240px] h-12 sm:h-14">
              <Image
                src="/logo.png"
                fill
                className="object-contain object-left brightness-0 invert"
                alt="Hacke's Jobs Technologies"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-9 items-center text-[10px] font-black uppercase tracking-[0.28em] text-slate-300">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white relative group/link transition-colors duration-300"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-brand-orange rounded-full transition-all duration-300 ease-out group-hover/link:w-full"></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button variant="secondary" size="sm" className="rounded-xl px-8 h-11 font-black text-[10px] shadow-orange/40 hover:shadow-orange border-none uppercase tracking-widest">
                    DASHBOARD
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-[0.2em] text-white hover:text-brand-orange transition-colors">
                      Ingresar
                    </Button>
                  </Link>
                  <Link href="/empresas">
                    <Button variant="secondary" size="sm" className="rounded-2xl px-8 h-11 font-black text-[10px] shadow-orange/40 hover:shadow-orange tracking-widest uppercase border-none">
                      EMPRESAS
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu} 
              className="lg:hidden text-brand-orange hover:text-orange-400 transition-colors p-2 bg-white/5 rounded-xl border border-white/10"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="lg:hidden mt-4 bg-brand-black/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_32px_64px_rgba(0,0,0,0.8)] flex flex-col gap-8 items-center text-center animate-in fade-in slide-in-from-top-10 duration-500">
            <nav className="flex flex-col gap-6 text-[12px] font-black uppercase tracking-[0.3em] text-white w-full">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="hover:text-brand-orange py-2 transition-colors border-b border-white/5 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-4 w-full pt-4">
              {isAuthenticated ? (
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="secondary" size="xl" className="w-full rounded-2xl h-14 font-black text-[11px] uppercase tracking-widest">
                    MI DASHBOARD
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                    <Button variant="ghost" size="xl" className="w-full font-black text-[11px] uppercase tracking-widest text-white">
                      INGRESAR
                    </Button>
                  </Link>
                  <Link href="/empresas" onClick={() => setIsOpen(false)} className="w-full">
                    <Button variant="secondary" size="xl" className="w-full rounded-2xl h-14 font-black text-[11px] uppercase tracking-widest">
                      PARA EMPRESAS
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
