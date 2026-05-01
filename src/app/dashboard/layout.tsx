"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '@/components/Button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { name: 'Vista General', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Blog', href: '/dashboard/blog', icon: FileText },
    { name: 'Vacantes', href: '/dashboard/vacantes', icon: Briefcase },
    { name: 'Equipo', href: '/dashboard/usuarios', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-brand-black flex font-sans selection:bg-brand-orange/40 selection:text-white overflow-hidden relative">
      {/* Background GIF layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/images/hero-bg.gif" 
          alt="" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-brand-black/60"></div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-brand-black/60 backdrop-blur-3xl border-r border-white/10 transition-all duration-500 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 flex flex-col`}>
        <div className="p-10">
          <Link href="/" className="flex items-center gap-3 mb-16 group">
            <img src="/logo.png" alt="Logo" className="h-12 w-auto drop-shadow-2xl transition-transform group-hover:scale-105" />
          </Link>

          <nav className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center justify-between px-8 py-5 rounded-[2rem] transition-all duration-300 group ${isActive ? 'bg-brand-orange text-white shadow-2xl shadow-brand-orange/20 border border-brand-orange/20' : 'text-slate-500 hover:bg-white/5 hover:text-white border border-transparent'}`}
                >
                  <div className="flex items-center gap-5">
                    <Icon size={22} className={isActive ? 'text-white' : 'group-hover:text-brand-orange transition-colors'} />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={16} className="animate-in slide-in-from-left-2 duration-300" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-10 space-y-6">
          <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center gap-5 group hover:bg-white/10 transition-all duration-500">
             <div className="w-12 h-12 rounded-2xl bg-brand-blue text-white flex items-center justify-center font-black text-xl shadow-lg shadow-brand-blue/20 group-hover:scale-110 transition-transform">A</div>
             <div className="flex-grow min-w-0">
                <p className="text-[10px] font-black uppercase text-white tracking-tight truncate">Administrador</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">Root Access</p>
             </div>
          </div>
          <button className="w-full flex items-center gap-5 px-8 py-5 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all group border border-transparent hover:border-red-500/20">
            <LogOut size={22} className="group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Desconexión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-w-0 relative h-screen overflow-y-auto custom-scrollbar">
        {/* Topbar */}
        <header className="h-24 bg-brand-black/60 backdrop-blur-3xl border-b border-white/10 px-12 flex items-center justify-between sticky top-0 z-40 transition-all duration-500">
           <div className="flex items-center gap-8 flex-grow max-w-2xl">
              <div className="relative w-full group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-orange transition-colors" size={20} />
                 <input 
                  type="text" 
                  placeholder="Inteligencia Artificial: Buscar vacantes, talentos..." 
                  className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-16 pr-6 text-[11px] font-black uppercase tracking-widest text-white placeholder-slate-600 focus:bg-white/10 focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner"
                 />
              </div>
           </div>
           
           <div className="flex items-center gap-6">
              <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white relative transition-all group">
                 <Bell size={22} className="group-hover:rotate-12 transition-transform" />
                 <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-brand-orange rounded-full border-2 border-brand-black animate-pulse"></span>
              </button>
              <div className="h-10 w-px bg-white/10 mx-2"></div>
              <Button size="xl" variant="secondary" className="hidden sm:flex h-14 px-10 rounded-2xl text-[10px] uppercase font-black tracking-widest border-none shadow-2xl shadow-brand-orange/20">
                Lanzar Vacante
              </Button>
           </div>
        </header>

        {/* Page Content */}
        <div className="p-10 lg:p-16 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
