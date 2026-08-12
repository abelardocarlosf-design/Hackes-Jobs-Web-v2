"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, ChevronRight, Menu, X } from 'lucide-react';
import { MENU_POR_ROL, ETIQUETA_ROL, rutaCoincide, type Rol } from '@/lib/navegacion';
import { iconoDe } from '@/components/nav/iconos';
import { cerrarSesion } from '@/lib/sesion-cliente';

interface Props {
  rol: Rol;
  nombre: string;
  /** Rutas que solo marcan activo en coincidencia exacta (el inicio del rol). */
  inicio: string;
  children: React.ReactNode;
}

/**
 * Shell compartido de las zonas privadas /admin, /mi-empresa y /portal.
 *
 * El menú sale de MENU_POR_ROL, así que la barra lateral y el desplegable del
 * navbar muestran siempre lo mismo. El CRM conserva su propio CrmShell porque
 * necesita el contador de seguimientos vencidos en la navegación.
 *
 * Rescatado del antiguo src/app/dashboard/layout.tsx, corrigiendo: el botón de
 * "Desconexión" no tenía onClick y no hacía nada; el pie decía "Administrador /
 * Root Access" en duro para cualquier rol; y había un buscador que no buscaba y
 * una campana de notificaciones permanentemente encendida.
 */
export function PanelShell({ rol, nombre, inicio, children }: Props) {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const menu = MENU_POR_ROL[rol];

  return (
    <div className="min-h-screen bg-brand-black flex font-sans selection:bg-brand-orange/40 selection:text-white relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src="/images/hero-bg.gif" alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-brand-black/60"></div>
      </div>

      {abierto && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setAbierto(false)} aria-hidden="true" />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-brand-black/80 backdrop-blur-3xl border-r border-white/10 transition-transform duration-500 ${abierto ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 flex flex-col`}>
        <div className="p-8 lg:p-10 overflow-y-auto">
          <div className="flex items-center justify-between mb-12">
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="Hacke's Jobs" className="h-10 w-auto drop-shadow-2xl transition-transform group-hover:scale-105" />
            </Link>
            <button onClick={() => setAbierto(false)} className="lg:hidden text-slate-500 hover:text-white" aria-label="Cerrar menú">
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2.5">
            {menu.map(item => {
              const Icono = iconoDe(item.icono);
              // El inicio del rol solo se marca en coincidencia exacta; si no,
              // se quedaría encendido en todas sus subrutas.
              const activo = item.href === inicio
                ? pathname === inicio
                : rutaCoincide(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setAbierto(false)}
                  className={`flex items-center justify-between px-6 py-4 rounded-[1.75rem] transition-all duration-300 group ${activo ? 'bg-brand-orange text-white shadow-2xl shadow-brand-orange/20 border border-brand-orange/20' : 'text-slate-500 hover:bg-white/5 hover:text-white border border-transparent'}`}
                >
                  <div className="flex items-center gap-4">
                    <Icono size={20} className={activo ? 'text-white' : 'group-hover:text-brand-orange transition-colors'} />
                    <span className="text-[10.5px] font-black uppercase tracking-[0.18em]">{item.etiqueta}</span>
                  </div>
                  {activo && <ChevronRight size={16} />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 lg:p-10 space-y-5">
          <div className="p-5 rounded-[1.75rem] bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-brand-blue text-white flex items-center justify-center font-black text-lg shadow-lg shadow-brand-blue/20 uppercase shrink-0">
              {nombre.slice(0, 1)}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-[10px] font-black uppercase text-white tracking-tight truncate">{nombre}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">{ETIQUETA_ROL[rol]}</p>
            </div>
          </div>
          <button
            onClick={() => cerrarSesion()}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all group border border-transparent hover:border-red-500/20"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10.5px] font-black uppercase tracking-[0.18em]">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col min-w-0 relative h-screen overflow-y-auto custom-scrollbar">
        <header className="h-20 bg-brand-black/60 backdrop-blur-3xl border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-40 lg:hidden">
          <button onClick={() => setAbierto(true)} className="text-brand-orange p-2.5 bg-white/5 rounded-xl border border-white/10" aria-label="Abrir menú">
            <Menu size={20} />
          </button>
          <img src="/logo.png" alt="Hacke's Jobs" className="h-8 w-auto" />
        </header>

        <div className="p-6 sm:p-10 lg:p-16 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
