import Link from 'next/link';
import { Button } from '@/components/Button';
import { Search, MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-brand-orange/40 selection:text-white">
      <div className="page-overlay" />
      <div className="page-dotgrid" />

      {/* Decorative ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-orange/[0.05] blur-[120px] pointer-events-none" />

      <section className="flex-1 flex flex-col items-center justify-center relative z-10 pt-32 pb-20 px-4">
        <div className="card-premium p-10 md:p-16 max-w-2xl w-full text-center flex flex-col items-center gap-8 relative overflow-hidden">
          {/* Subtle grid pattern inside card */}
          <div className="absolute inset-0 bg-dotgrid opacity-20 pointer-events-none" />

          {/* Icon/Badge */}
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-slate-500 shadow-2xl relative z-10">
            <Search size={32} strokeWidth={1.5} />
          </div>

          <div className="space-y-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              <span className="text-brand-orange">404</span> <span className="opacity-50 mx-2">|</span> Ruta no encontrada.
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-lg mx-auto">
              Parece que la vacante o sección que buscas ha sido movida o ya no está disponible.
            </p>
          </div>

          {/* Missing info tags context */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-500 text-xs font-bold uppercase tracking-widest">
              <MapPin size={12} /> URL Inválida
            </span>
          </div>

          <div className="pt-6 relative z-10 w-full sm:w-auto">
            <Link href="/vacantes" className="block">
              <Button 
                variant="outline" 
                size="xl" 
                className="w-full sm:w-auto border-white/20 text-white hover:border-brand-orange hover:text-brand-orange bg-white/5 btn-elev"
              >
                Ver vacantes disponibles
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
