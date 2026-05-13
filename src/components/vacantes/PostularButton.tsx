'use client';

import { ArrowRight } from 'lucide-react';

interface Props {
  vacanteId: string;
  vacanteTitulo: string;
  vacanteEmpresa: string;
}

export function PostularButton({ vacanteId, vacanteTitulo, vacanteEmpresa }: Props) {
  const whatsappNumber = '525650405218';
  const text = encodeURIComponent(`Hola, me interesa la vacante de ${vacanteTitulo} en ${vacanteEmpresa} (${vacanteId})`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;

  return (
    <div className="space-y-3">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-14 rounded-xl bg-brand-orange text-white text-[11px] font-black uppercase tracking-[0.3em] inline-flex items-center justify-center gap-2.5 btn-elev hover:bg-brand-orange/90 transition-colors"
      >
        Me interesa esta vacante <ArrowRight size={14} />
      </a>

      <p className="text-[10px] text-slate-500 leading-relaxed text-center">
        Al hacer clic, serás redirigido a WhatsApp para hablar con un asesor.
      </p>
    </div>
  );
}
