'use client';

import { useMemo, useState } from 'react';
import { Search, X, Briefcase } from 'lucide-react';
import {
  type Vacante,
  type CategoriaVacante,
  type ModalidadVacante,
  CATEGORIAS,
  MODALIDADES,
} from '@/data/vacantes';
import { VacanteCard } from './VacanteCard';

interface Props {
  vacantes: Vacante[];
  ubicaciones: string[];
}

export function VacantesCatalog({ vacantes, ubicaciones }: Props) {
  const [query, setQuery] = useState('');
  const [categoria, setCategoria] = useState<CategoriaVacante | ''>('');
  const [modalidad, setModalidad] = useState<ModalidadVacante | ''>('');
  const [ubicacion, setUbicacion] = useState<string>('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vacantes.filter((v) => {
      if (categoria && v.categoria !== categoria) return false;
      if (modalidad && v.modalidad !== modalidad) return false;
      if (ubicacion && v.ubicacion !== ubicacion) return false;
      if (q) {
        const haystack = `${v.titulo} ${v.empresa} ${v.descripcion} ${v.categoria} ${v.ubicacion}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [vacantes, query, categoria, modalidad, ubicacion]);

  const hasFilters = !!(query || categoria || modalidad || ubicacion);
  const clearAll = () => {
    setQuery('');
    setCategoria('');
    setModalidad('');
    setUbicacion('');
  };

  return (
    <div className="space-y-10">
      {/* Search bar */}
      <div className="card-premium p-2 max-w-3xl mx-auto rounded-2xl">
        <div className="relative">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            size={18}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, empresa o palabra clave…"
            className="w-full h-14 pl-14 pr-14 rounded-xl bg-transparent text-white placeholder-slate-500 focus:outline-none font-medium text-base"
            aria-label="Buscar vacantes"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 flex items-center justify-center"
              aria-label="Limpiar búsqueda"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Filter chips — Categorías */}
      <div className="space-y-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto px-2">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            Categoría
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto">
          {(['' as const, ...CATEGORIAS]).map((c) => {
            const active = categoria === c;
            const label = c === '' ? 'Todas' : c;
            return (
              <button
                key={label}
                onClick={() => setCategoria(c)}
                className={`h-9 px-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-300 ${
                  active
                    ? 'bg-brand-orange text-white border-brand-orange shadow-[0_8px_24px_-8px_rgba(249,115,22,0.5)]'
                    : 'bg-white/[0.04] text-slate-300 border-white/10 hover:border-white/25 hover:bg-white/[0.08]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modalidad + Ubicación side by side */}
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <div className="space-y-3">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block">
            Modalidad
          </span>
          <div className="flex flex-wrap gap-2">
            {(['' as const, ...MODALIDADES]).map((m) => {
              const active = modalidad === m;
              const label = m === '' ? 'Todas' : m;
              return (
                <button
                  key={label}
                  onClick={() => setModalidad(m)}
                  className={`h-9 px-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-300 ${
                    active
                      ? 'bg-brand-blue text-white border-brand-blue shadow-[0_8px_24px_-8px_rgba(30,64,175,0.6)]'
                      : 'bg-white/[0.04] text-slate-300 border-white/10 hover:border-white/25 hover:bg-white/[0.08]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <label
            htmlFor="ubicacion-select"
            className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block"
          >
            Ubicación
          </label>
          <div className="relative">
            <select
              id="ubicacion-select"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-medium focus:border-brand-orange/50 focus:bg-white/[0.07] outline-none transition-all duration-300 appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#0a0a0f]">Todas las ubicaciones</option>
              {ubicaciones.map((u) => (
                <option key={u} value={u} className="bg-[#0a0a0f]">
                  {u}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▾</div>
          </div>
        </div>
      </div>

      {/* Active filters indicator */}
      <div className="flex items-center justify-between max-w-5xl mx-auto px-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
          {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
        </span>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-2 text-[10px] font-black text-brand-orange hover:text-orange-300 uppercase tracking-[0.25em] transition-colors"
          >
            <X size={12} /> Limpiar filtros
          </button>
        )}
      </div>

      {/* Results grid */}
      <div className="max-w-5xl mx-auto">
        {filtered.length === 0 ? (
          <div className="card-premium p-16 text-center max-w-3xl mx-auto space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
              <Briefcase size={28} />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-white tracking-tight">Sin coincidencias</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
                {hasFilters
                  ? 'Ajusta los filtros o limpia tu búsqueda para ver más opciones.'
                  : 'No hay vacantes activas en este momento. Vuelve pronto.'}
              </p>
            </div>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-brand-orange text-white text-[10px] font-black uppercase tracking-[0.25em] btn-elev"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((v) => (
              <VacanteCard key={v.id} vacante={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
