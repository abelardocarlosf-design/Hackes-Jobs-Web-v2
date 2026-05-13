import Link from 'next/link';
import { MapPin, Briefcase, ArrowRight, Star } from 'lucide-react';
import type { Vacante } from '@/data/vacantes';
import { EmpresaLogo } from './EmpresaLogo';

const MODALIDAD_STYLE: Record<Vacante['modalidad'], string> = {
  Presencial: 'text-slate-300 bg-white/5 border-white/10',
  Híbrido: 'text-brand-blue bg-brand-blue/10 border-brand-blue/20',
  Remoto: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
};

export function VacanteCard({ vacante }: { vacante: Vacante }) {
  return (
    <Link
      href={`/vacantes/${vacante.id}`}
      className="card-premium group p-7 flex flex-col gap-5 min-h-[280px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60 rounded-3xl"
    >
      <div className="flex items-start justify-between gap-4">
        <EmpresaLogo empresa={vacante.empresa} size="md" />
        {vacante.destacada && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange text-[9px] font-black uppercase tracking-[0.2em]">
            <Star size={10} className="fill-brand-orange" /> Destacada
          </span>
        )}
      </div>

      <div className="flex-1 space-y-3">
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">
          {vacante.categoria}
        </span>
        <h3 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight group-hover:text-brand-orange transition-colors duration-300">
          {vacante.titulo}
        </h3>
        <p className="text-sm text-slate-400 font-medium leading-relaxed line-clamp-2">
          {vacante.descripcion}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
          <MapPin size={11} className="text-brand-orange" />
          {vacante.ubicacion.split(',')[0]}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${MODALIDAD_STYLE[vacante.modalidad]}`}
        >
          <Briefcase size={11} />
          {vacante.modalidad}
        </span>
        {vacante.salario && (
          <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
            {vacante.salario}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">
          {vacante.empresa}
        </span>
        <span className="inline-flex items-center gap-1.5 text-brand-orange text-[10px] font-black uppercase tracking-[0.25em] group-hover:gap-2.5 transition-all duration-300">
          Ver detalle <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}
