'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Briefcase, BellRing, Menu, X, LogOut, UserCircle, ChevronDown } from 'lucide-react';
import { cerrarSesion } from '@/lib/sesion-cliente';

const NAV = [
  { href: '/crm', label: 'Panel', icon: LayoutDashboard, exact: true },
  { href: '/crm/candidatos', label: 'Candidatos', icon: Users },
  { href: '/crm/requisiciones', label: 'Requisiciones', icon: Briefcase },
  { href: '/crm/seguimientos', label: 'Seguimientos', icon: BellRing },
];

export function CrmShell({
  children,
  nombre,
  email,
  rol,
  pendientes,
}: {
  children: React.ReactNode;
  nombre: string;
  email: string;
  rol: string;
  pendientes: number;
}) {
  const [abierto, setAbierto] = useState(false);
  const [menuUsuario, setMenuUsuario] = useState(false);
  const pathname = usePathname();

  const activo = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-brand-black">
      {/* ─── Barra superior ─────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-black/95 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 sm:px-8 h-20">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setAbierto(true)}
              aria-label="Abrir menú"
              className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 text-white flex items-center justify-center hover:bg-white/10 hover:border-brand-orange/40 transition-all"
            >
              <Menu size={20} />
            </button>
            <Link href="/crm" className="relative w-[140px] h-[38px] hidden sm:block">
              <Image src="/logo.png" alt="Hacke's Jobs" fill sizes="140px" className="object-contain object-left" priority />
            </Link>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuUsuario((v) => !v)}
              aria-expanded={menuUsuario}
              aria-haspopup="menu"
              className="flex items-center gap-4 rounded-xl px-2 py-1.5 hover:bg-white/5 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-white font-black text-sm leading-tight">{nombre}</p>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                  {rol === 'admin' ? 'Administrador' : 'Reclutador'}
                </p>
              </div>
              <div className="w-11 h-11 rounded-full bg-brand-orange text-white flex items-center justify-center font-black text-lg shrink-0">
                {nombre.charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={16} className={`text-slate-500 transition-transform ${menuUsuario ? 'rotate-180' : ''}`} />
            </button>

            {menuUsuario && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuUsuario(false)} aria-hidden />
                <div role="menu"
                  className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-white/10 bg-[#0d0d0f] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-3 border-b border-white/5 mb-2">
                    <p className="text-white font-bold text-sm truncate">{nombre}</p>
                    <p className="text-slate-500 text-xs truncate">{email}</p>
                  </div>
                  <Link href="/crm/perfil" onClick={() => setMenuUsuario(false)} role="menuitem"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-bold text-sm transition-all">
                    <UserCircle size={17} /> Mi perfil
                  </Link>
                  <button type="button" onClick={() => cerrarSesion()} role="menuitem"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 font-bold text-sm transition-all">
                    <LogOut size={17} /> Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── Cajón de navegación ────────────────────────── */}
      {abierto && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setAbierto(false)}
            aria-hidden
          />
          <nav className="relative w-[300px] max-w-[85vw] h-full bg-[#0d0d0f] border-r border-white/10 p-6 flex flex-col gap-6 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Menú</span>
              <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar menú"
                className="text-slate-500 hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5">
              <div className="w-12 h-12 rounded-full bg-brand-orange text-white flex items-center justify-center font-black text-lg shrink-0">
                {nombre.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white font-black text-sm truncate">{nombre}</p>
                <p className="text-slate-500 text-xs truncate">{email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              {NAV.map((item) => {
                const on = activo(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setAbierto(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                      on
                        ? 'bg-brand-orange/15 text-brand-orange border border-brand-orange/25'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="flex-1">{item.label}</span>
                    {item.href === '/crm/seguimientos' && pendientes > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-orange text-white text-[10px] font-black">
                        {pendientes}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 space-y-1">
              {/* Solo el admin tiene panel de administración; a un reclutador
                  este enlace le aparecía igual y solo lo rebotaba. */}
              {rol === 'admin' && (
                <Link href="/admin" onClick={() => setAbierto(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 font-bold text-sm transition-all">
                  <LayoutDashboard size={18} />
                  Panel de administración
                </Link>
              )}
              <Link href="/crm/perfil" onClick={() => setAbierto(false)}
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 font-bold text-sm transition-all">
                <UserCircle size={18} />
                Mi perfil
              </Link>
              <button type="button" onClick={() => cerrarSesion()}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 font-bold text-sm transition-all">
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          </nav>
        </div>
      )}

      <main className="px-4 sm:px-8 py-10 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}

/** Encabezado de página con el borde de acento del patrón de referencia. */
export function CrmHeader({
  titulo,
  subtitulo,
  acciones,
}: {
  titulo: string;
  subtitulo?: string;
  acciones?: React.ReactNode;
}) {
  return (
    <div className="border-l-4 border-brand-orange pl-6 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{titulo}</h1>
        {subtitulo && <p className="text-slate-400 font-medium">{subtitulo}</p>}
      </div>
      {acciones && <div className="flex flex-wrap gap-3 shrink-0">{acciones}</div>}
    </div>
  );
}
