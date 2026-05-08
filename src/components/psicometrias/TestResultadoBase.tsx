'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export interface TestResultadoBaseProps {
  slug: string;
  testName: string;
}

export function TestResultadoBase({ slug, testName }: TestResultadoBaseProps) {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
          Evaluación Enviada
        </h1>
        <p className="text-xl text-slate-300">
          Tus resultados de <span className="font-black text-brand-orange">{testName}</span> están siendo procesados.
        </p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 text-center py-12">
          <h2 className="text-2xl font-black text-white mb-4">¡Gracias por tu participación!</h2>
          <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto">
            Hemos registrado tus respuestas exitosamente. Nuestro motor de IA analizará tu perfil y enviaremos el reporte detallado al correo electrónico que proporcionaste.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Link href="/psicometrias" className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto h-14 px-8 text-sm font-black rounded-xl uppercase tracking-widest bg-transparent border border-white/20 hover:bg-white/5 text-slate-300">
            <ArrowLeft size={18} className="mr-2" /> Volver al Catálogo
          </Button>
        </Link>
      </div>
    </div>
  );
}
