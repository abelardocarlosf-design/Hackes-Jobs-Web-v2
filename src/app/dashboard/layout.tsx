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
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-brand-blue/10 selection:text-brand-blue">
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center gap-3 mb-12">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          </div>

          <nav className="flex-grow space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${isActive ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20' : 'text-slate-400 hover:bg-slate-50 hover:text-brand-black'}`}
                >
                  <div className="flex items-center gap-4">
                    <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-brand-blue'} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={14} />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-8 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-4 px-2">
               <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-black">A</div>
               <div className="flex-grow">
                  <p className="text-[10px] font-black uppercase text-brand-black tracking-tight">Admin Principal</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Administrador</p>
               </div>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-slate-400 hover:text-red-500 hover:bg-red-50 p-4">
              <LogOut size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-6 flex-grow max-w-xl">
              <div className="relative w-full">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                 <input 
                  type="text" 
                  placeholder="Buscar vacantes, candidatos..." 
                  className="w-full h-12 bg-slate-50 border-none rounded-xl pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                 />
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 relative">
                 <Bell size={20} />
                 <span className="absolute top-3 right-3 w-2 h-2 bg-brand-orange rounded-full"></span>
              </button>
              <div className="h-10 w-px bg-slate-100 mx-2"></div>
              <Button size="sm" variant="secondary" className="hidden sm:flex h-12 px-6 rounded-xl text-[10px] uppercase font-black tracking-widest">
                Nueva Vacante
              </Button>
           </div>
        </header>

        {/* Page Content */}
        <div className="p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
