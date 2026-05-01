'use client';

import { useState, useEffect, useCallback } from 'react';
import { JobCard } from '@/components/JobCard';
import { Search, MapPin, Briefcase, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { Typewriter } from '@/components/Typewriter';

interface Job {
  id: string;
  title: string;
  description: string;
  salaryRange: string | null;
  location: string | null;
  modality: string | null;
  positions: number;
  status: string;
  createdAt: string;
  company: {
    name: string;
    industry: string | null;
    verified: boolean;
  };
  _count: { applications: number };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function VacantesPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 12, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modality, setModality] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const fetchJobs = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '12');
      if (search) params.set('search', search);
      if (modality) params.set('modality', modality);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setJobs(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [search, modality]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const clearFilters = () => {
    setSearch('');
    setSearchInput('');
    setModality('');
  };

  const hasFilters = search || modality;

  return (
    <div className="min-h-screen bg-brand-black font-sans pt-28 pb-20 selection:bg-brand-orange/40 selection:text-white">
      
      {/* ─── HERO ───────────────────────────────────── */}
      <section className="relative container mx-auto px-4 mb-16 pt-16 pb-24 rounded-[4rem] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.gif')] bg-cover bg-center bg-fixed"></div>
        <div className="absolute inset-0 bg-brand-black/70"></div>
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <span className="text-brand-orange font-black tracking-[0.4em] uppercase text-xs">Oportunidades Activas</span>
          <h1 className="text-5xl md:text-[6.5rem] font-black text-white tracking-tighter leading-[0.9]">
            <Typewriter text="Encuentra tu próximo" speed={60} delay={300} /> <br/>
            <span className="text-brand-blue drop-shadow-2xl">reto profesional.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Posiciones seleccionadas en las empresas más innovadoras de México.
          </p>
        </div>
      </section>

      {/* ─── SEARCH & FILTERS ────────────────────────── */}
      <section className="container relative mx-auto px-4 mb-12 z-20">
        <div className="absolute inset-0 bg-[url('/images/candidatos-bg.gif')] bg-cover bg-center opacity-10 bg-fixed -z-10 rounded-[4rem]"></div>
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="relative mb-8 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-orange group-focus-within:scale-110 transition-transform" size={24} />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Buscar vacantes por título, tecnología o empresa..."
              className="w-full h-20 pl-16 pr-44 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl text-white placeholder-slate-500 focus:bg-white/10 focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all font-bold text-xl shadow-2xl"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`h-12 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border ${showFilters ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}
              >
                <SlidersHorizontal size={16} />
                Filtros
              </button>
              <button
                type="submit"
                className="h-12 px-8 rounded-2xl bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-orange/20"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Filter chips */}
          {showFilters && (
            <div className="flex flex-wrap gap-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
              {['Remoto', 'Híbrido', 'Presencial'].map(mod => (
                <button
                  key={mod}
                  onClick={() => setModality(modality === mod ? '' : mod)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all hover:scale-105 ${
                    modality === mod
                      ? 'bg-brand-blue text-white border-brand-blue shadow-xl shadow-brand-blue/20'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:border-brand-blue/40'
                  }`}
                >
                  {mod === 'Remoto' && <MapPin size={14} />}
                  {mod === 'Híbrido' && <Briefcase size={14} />}
                  {mod === 'Presencial' && <Briefcase size={14} />}
                  {mod}
                </button>
              ))}
            </div>
          )}

          {/* Active filters indicator */}
          {hasFilters && (
            <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/5 inline-flex">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {pagination.total} resultado{pagination.total !== 1 ? 's' : ''} encontrados
              </span>
              <div className="w-px h-4 bg-white/10"></div>
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-[10px] font-black text-brand-orange hover:text-orange-400 uppercase tracking-widest transition-colors"
              >
                <X size={14} />
                Limpiar búsqueda
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── JOBS GRID ───────────────────────────────── */}
      <section className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <Loader2 className="animate-spin text-brand-orange" size={48} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Analizando el mercado...</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-40 glass-card rounded-[4rem] space-y-8 max-w-4xl mx-auto border-dashed border-white/10">
              <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto border border-white/10">
                <Briefcase size={40} className="text-slate-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-white tracking-tight uppercase">No hay vacantes disponibles</h3>
                <p className="text-slate-400 font-medium text-xl max-w-md mx-auto leading-relaxed">
                  {hasFilters ? 'Intenta ajustando tus filtros de búsqueda para encontrar nuevas oportunidades.' : 'Estamos trabajando con las mejores empresas para publicar nuevas posiciones muy pronto.'}
                </p>
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all">
                  Ver todas las vacantes
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-8">
                {jobs.map(job => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    modality={job.modality}
                    salaryRange={job.salaryRange}
                    positions={job.positions}
                    createdAt={job.createdAt}
                    applicationsCount={job._count.applications}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-20">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => fetchJobs(page)}
                      className={`w-14 h-14 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${
                        page === pagination.page
                          ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/30 border-none'
                          : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
