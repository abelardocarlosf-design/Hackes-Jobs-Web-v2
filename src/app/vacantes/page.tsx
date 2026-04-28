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
    <div className="min-h-screen bg-white font-sans pt-28 pb-20">
      
      {/* ─── HERO ───────────────────────────────────── */}
      <section className="relative container mx-auto px-4 mb-16 pt-8 pb-16 rounded-b-[3rem] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/parallax-vacantes.png')] bg-cover bg-center bg-fixed -z-20"></div>
        <div className="absolute inset-0 bg-brand-white/90 -z-10"></div>
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="text-brand-blue font-black tracking-[0.4em] uppercase text-xs">Oportunidades Activas</span>
          <h1 className="text-5xl md:text-7xl font-black text-brand-black tracking-tighter leading-none">
            <Typewriter text="Encuentra tu próximo" speed={60} delay={300} className="text-brand-orange" /> <span className="text-brand-blue">reto.</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
            Posiciones seleccionadas en las empresas más innovadoras de México.
          </p>
        </div>
      </section>

      {/* ─── SEARCH & FILTERS ────────────────────────── */}
      <section className="container mx-auto px-4 mb-12">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="relative mb-6">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={22} />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Buscar vacantes por título, tecnología o empresa..."
              className="w-full h-16 pl-14 pr-40 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-brand-black placeholder-slate-300 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-medium text-lg"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${showFilters ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                <SlidersHorizontal size={14} />
                Filtros
              </button>
              <button
                type="submit"
                className="h-10 px-6 rounded-xl bg-brand-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-black/90 transition-all"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Filter chips */}
          {showFilters && (
            <div className="flex flex-wrap gap-3 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
              {['Remoto', 'Híbrido', 'Presencial'].map(mod => (
                <button
                  key={mod}
                  onClick={() => setModality(modality === mod ? '' : mod)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    modality === mod
                      ? 'bg-brand-blue text-white border-brand-blue shadow-blue'
                      : 'bg-white text-slate-500 border-slate-100 hover:border-brand-blue/20'
                  }`}
                >
                  {mod === 'Remoto' && <MapPin size={12} />}
                  {mod === 'Híbrido' && <Briefcase size={12} />}
                  {mod === 'Presencial' && <Briefcase size={12} />}
                  {mod}
                </button>
              ))}
            </div>
          )}

          {/* Active filters indicator */}
          {hasFilters && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {pagination.total} resultado{pagination.total !== 1 ? 's' : ''}
              </span>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors"
              >
                <X size={12} />
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── JOBS GRID ───────────────────────────────── */}
      <section className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="animate-spin text-brand-blue" size={36} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cargando vacantes...</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-32 space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto">
                <Briefcase size={32} className="text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-brand-black tracking-tight">No hay vacantes disponibles</h3>
              <p className="text-slate-400 font-medium">
                {hasFilters ? 'Intenta con otros filtros de búsqueda' : 'Próximamente publicaremos nuevas oportunidades'}
              </p>
              {hasFilters && (
                <button onClick={clearFilters} className="text-brand-blue font-bold text-sm hover:underline mt-2">
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
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
                <div className="flex items-center justify-center gap-3 mt-16">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => fetchJobs(page)}
                      className={`w-12 h-12 rounded-xl text-sm font-black transition-all ${
                        page === pagination.page
                          ? 'bg-brand-blue text-white shadow-blue'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
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
