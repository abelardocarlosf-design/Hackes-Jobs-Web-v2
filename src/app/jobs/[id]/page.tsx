'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  MapPin, Briefcase, DollarSign, Users, Clock, Building2,
  CheckCircle2, ArrowLeft, Send, Share2, BookmarkPlus,
  Globe, Shield, Loader2,
} from 'lucide-react';

interface JobDetail {
  id: string;
  title: string;
  description: string;
  salaryRange: string | null;
  location: string | null;
  modality: string | null;
  requirements: string | null;
  schedule: string | null;
  benefits: string | null;
  positions: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
    industry: string | null;
    size: string | null;
    verified: boolean;
  };
  _count: { applications: number };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  if (days < 7) return `Hace ${days} días`;
  if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
  return `Hace ${Math.floor(days / 30)} meses`;
}

function parseJSON(str: string | null): Record<string, unknown> | null {
  if (!str) return null;
  try { return JSON.parse(str); } catch { return null; }
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setJob(data.data);
        } else {
          setError(data.message || 'Vacante no encontrada');
        }
      } catch {
        setError('Error al cargar la vacante');
      } finally {
        setIsLoading(false);
      }
    }
    if (params.id) fetchJob();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-blue" size={40} />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto">
            <Briefcase size={32} className="text-red-400" />
          </div>
          <h2 className="text-3xl font-black text-brand-black tracking-tight">{error || 'Vacante no encontrada'}</h2>
          <Link href="/vacantes" className="inline-flex items-center gap-2 text-brand-blue font-bold hover:underline">
            <ArrowLeft size={16} /> Volver a vacantes
          </Link>
        </div>
      </div>
    );
  }

  const requirements = parseJSON(job.requirements);
  const skills = requirements?.skills as string[] || [];
  const experience = requirements?.experience as number || 0;
  const education = requirements?.education as string || '';

  return (
    <div className="min-h-screen bg-white font-sans pt-28 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">

          {/* ─── BREADCRUMB ──────────────────────────── */}
          <div className="mb-8">
            <Link href="/vacantes" className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-brand-blue transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Volver a vacantes
            </Link>
          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-10">

            {/* ─── MAIN CONTENT ──────────────────────── */}
            <div className="space-y-10">

              {/* Header */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 flex-wrap">
                  {job.modality && (
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
                      job.modality === 'Remoto' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      job.modality === 'Híbrido' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {job.modality}
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                    <Clock size={12} /> Publicada {timeAgo(job.createdAt)}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-brand-black tracking-tighter leading-tight">
                  {job.title}
                </h1>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                    <Building2 size={22} />
                  </div>
                  <div>
                    <p className="font-black text-brand-black text-sm flex items-center gap-1.5">
                      {job.company.name}
                      {job.company.verified && <CheckCircle2 size={14} className="text-brand-blue" />}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      {[job.company.industry, job.company.size ? `${job.company.size} empleados` : null].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: MapPin, label: 'Ubicación', value: job.location || 'No especificada', color: 'text-blue-500 bg-blue-50' },
                  { icon: DollarSign, label: 'Salario', value: job.salaryRange || 'A convenir', color: 'text-emerald-500 bg-emerald-50' },
                  { icon: Users, label: 'Posiciones', value: `${job.positions} plaza${job.positions > 1 ? 's' : ''}`, color: 'text-purple-500 bg-purple-50' },
                  { icon: Globe, label: 'Modalidad', value: job.modality || 'No especificada', color: 'text-amber-500 bg-amber-50' },
                ].map((fact, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                    <div className={`w-9 h-9 rounded-xl ${fact.color} flex items-center justify-center`}>
                      <fact.icon size={16} />
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{fact.label}</p>
                    <p className="text-sm font-black text-brand-black tracking-tight">{fact.value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-[11px] font-black text-brand-blue uppercase tracking-[0.3em]">Descripción del puesto</h2>
                <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
                  {job.description.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </div>

              {/* Requirements */}
              {(skills.length > 0 || experience || education) && (
                <div className="space-y-6">
                  <h2 className="text-[11px] font-black text-brand-blue uppercase tracking-[0.3em]">Requisitos</h2>
                  
                  {skills.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Habilidades técnicas</p>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, i) => (
                          <span key={i} className="px-4 py-2 rounded-xl bg-brand-blue/5 text-brand-blue text-xs font-bold border border-brand-blue/10">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    {experience > 0 && (
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Experiencia mínima</p>
                        <p className="text-lg font-black text-brand-black">{experience} año{experience > 1 ? 's' : ''}</p>
                      </div>
                    )}
                    {education && (
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Educación</p>
                        <p className="text-lg font-black text-brand-black">{education}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && (
                <div className="space-y-4">
                  <h2 className="text-[11px] font-black text-brand-blue uppercase tracking-[0.3em]">Beneficios</h2>
                  <div className="prose prose-slate max-w-none text-slate-600 font-medium">
                    {job.benefits.split('\n').map((b, i) => (
                      <div key={i} className="flex items-start gap-3 mb-2">
                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ─── SIDEBAR ───────────────────────────── */}
            <div className="lg:mt-0 mt-6">
              <div className="sticky top-32 space-y-6">
                
                {/* Apply CTA */}
                <div className="p-8 rounded-[2rem] bg-brand-black text-white relative overflow-hidden">
                  <div className="absolute top-[-30%] right-[-20%] w-[60%] h-[60%] bg-brand-blue/20 rounded-full blur-[80px]" />
                  <div className="relative z-10 space-y-6">
                    <div>
                      <h3 className="text-xl font-black tracking-tight mb-2">¿Te interesa esta posición?</h3>
                      <p className="text-sm text-slate-400 font-medium">
                        {job._count.applications} candidato{job._count.applications !== 1 ? 's' : ''} aplicaron
                      </p>
                    </div>
                    
                    {isAuthenticated && user?.role === 'candidate' ? (
                      <Link
                        href={`/apply/${job.id}`}
                        className="w-full h-14 bg-brand-orange text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-orange/90 transition-all flex items-center justify-center gap-2 group"
                      >
                        <Send size={16} />
                        Aplicar ahora
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </Link>
                    ) : isAuthenticated ? (
                      <p className="text-xs text-slate-400 font-bold text-center py-4 bg-white/5 rounded-xl">
                        Solo candidatos pueden aplicar
                      </p>
                    ) : (
                      <Link
                        href={`/register?redirect=/apply/${job.id}`}
                        className="w-full h-14 bg-brand-orange text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-orange/90 transition-all flex items-center justify-center gap-2"
                      >
                        <Send size={16} />
                        Regístrate para aplicar
                      </Link>
                    )}

                    <div className="flex gap-3">
                      <button className="flex-1 h-11 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                        <BookmarkPlus size={14} />
                        Guardar
                      </button>
                      <button className="flex-1 h-11 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                        <Share2 size={14} />
                        Compartir
                      </button>
                    </div>
                  </div>
                </div>

                {/* Company Card */}
                <div className="p-6 rounded-[2rem] border border-slate-100 bg-white space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <p className="font-black text-brand-black flex items-center gap-1.5">
                        {job.company.name}
                        {job.company.verified && <CheckCircle2 size={14} className="text-brand-blue" />}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">{job.company.industry || 'Empresa'}</p>
                    </div>
                  </div>

                  {job.company.size && (
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 bg-slate-50 px-4 py-3 rounded-xl">
                      <Users size={14} className="text-slate-400" />
                      {job.company.size} empleados
                    </div>
                  )}

                  {job.company.verified && (
                    <div className="flex items-center gap-3 text-xs font-bold text-brand-blue bg-brand-blue/5 px-4 py-3 rounded-xl">
                      <Shield size={14} />
                      Empresa verificada
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
