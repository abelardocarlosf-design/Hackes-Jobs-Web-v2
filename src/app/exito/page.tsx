'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';
import { CheckCircle2, ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { Typewriter } from '@/components/Typewriter';

export default function SuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-black font-sans selection:bg-brand-orange/40 selection:text-white overflow-x-hidden relative">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <main className="flex-grow flex items-center justify-center relative z-10 p-4">
        <div className="max-w-2xl w-full">
          <div className="glass-card p-12 md:p-16 text-center space-y-10 border-white/5 shadow-2xl relative overflow-hidden">
            {/* Success Icon Animation */}
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
              <div className="w-24 h-24 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto relative z-10 shadow-lg shadow-emerald-500/40 animate-in zoom-in duration-700">
                <CheckCircle2 size={48} />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                <Typewriter text="¡Pago Exitoso!" speed={80} />
              </h1>
              <p className="text-xl text-slate-400 font-medium max-w-md mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                Tu suscripción al <span className="text-brand-orange font-bold italic">Plan Growth</span> ha sido activada correctamente.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
              <div className="bg-white/5 rounded-3xl p-8 border border-white/10 flex flex-col items-center gap-4 group hover:bg-white/10 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 text-brand-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase text-xs tracking-widest mb-1">Revisa tu Email</h3>
                  <p className="text-slate-500 text-sm font-medium">Hemos enviado los detalles de acceso y tu factura.</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-3xl p-8 border border-white/10 flex flex-col items-center gap-4 group hover:bg-white/10 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-brand-orange/20 text-brand-orange flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase text-xs tracking-widest mb-1">Acceso Inmediato</h3>
                  <p className="text-slate-500 text-sm font-medium">Tu panel de reclutamiento ya está habilitado.</p>
                </div>
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
              <Link href="/">
                <Button variant="secondary" size="xl" className="px-12 shadow-orange/40">
                  Ir al Dashboard
                  <ArrowRight className="ml-3" size={20} />
                </Button>
              </Link>
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
              Hacke's Jobs 2.0 • Sistema de Reclutamiento AI
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
