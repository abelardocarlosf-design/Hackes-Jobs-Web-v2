'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ScoreBar, ScoreBreakdownCard } from '@/components/ScoreBar';
import {
  ArrowLeft, Send, Building2, MapPin, Briefcase,
  CheckCircle2, Loader2, PartyPopper, AlertTriangle,
} from 'lucide-react';

interface JobInfo {
  id: string;
  title: string;
  company: { name: string; verified: boolean };
  location: string | null;
  modality: string | null;
  salaryRange: string | null;
}

interface ScoreResult {
  total: number;
  experience: number;
  skills: number;
  education: number;
  psychometric: number;
  tier: string;
  tierLabel: string;
  details: {
    matchedSkills: string[];
    missingSkills: string[];
  };
}

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  const [job, setJob] = useState<JobInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [result, setResult] = useState<{ application: any; score: ScoreResult } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${params.jobId}`);
        const data = await res.json();
        if (data.success) setJob(data.data);
        else setError('Vacante no encontrada');
      } catch {
        setError('Error al cargar la vacante');
      } finally {
        setIsLoading(false);
      }
    }
    if (params.jobId) fetchJob();
  }, [params.jobId]);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/apply/${params.jobId}`);
    }
    if (!authLoading && user?.role !== 'candidate') {
      setError('Solo candidatos pueden aplicar a vacantes');
    }
  }, [authLoading, isAuthenticated, user, router, params.jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: params.jobId,
          coverLetter: coverLetter || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Error al enviar tu aplicación');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-blue" size={40} />
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto">
            <AlertTriangle size={32} className="text-red-400" />
          </div>
          <h2 className="text-3xl font-black text-brand-black tracking-tight">{error}</h2>
          <Link href="/vacantes" className="inline-flex items-center gap-2 text-brand-blue font-bold hover:underline">
            <ArrowLeft size={16} /> Volver a vacantes
          </Link>
        </div>
      </div>
    );
  }

  // ─── SUCCESS STATE ──────────────────────────────
  if (result) {
    return (
      <div className="min-h-screen bg-white font-sans pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-10 animate-in fade-in zoom-in duration-700">
            
            <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto">
              <PartyPopper size={40} className="text-emerald-500" />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-brand-black tracking-tighter">
                ¡Aplicación enviada!
              </h1>
              <p className="text-xl text-slate-400 font-medium">
                Tu perfil ha sido evaluado automáticamente para <span className="text-brand-black font-bold">{job?.title}</span>
              </p>
            </div>

            {/* Score Result */}
            {result.score && (
              <div className="space-y-6 text-left">
                <div className="p-8 rounded-[2rem] bg-brand-black text-white relative overflow-hidden">
                  <div className="absolute top-[-30%] right-[-20%] w-[60%] h-[60%] bg-brand-blue/20 rounded-full blur-[80px]" />
                  <div className="relative z-10 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Tu Score</p>
                    <div className="flex items-end gap-4">
                      <span className="text-7xl font-black leading-none">{result.score.total}</span>
                      <span className="text-2xl text-slate-500 font-bold mb-2">/100</span>
                      <span className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest mb-2 ${
                        result.score.total >= 75 ? 'bg-emerald-500/20 text-emerald-400' :
                        result.score.total >= 60 ? 'bg-blue-500/20 text-blue-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        Tier {result.score.tier}
                      </span>
                    </div>
                    <p className="text-slate-400 font-medium">{result.score.tierLabel}</p>
                  </div>
                </div>

                <ScoreBreakdownCard items={[
                  { label: 'Experiencia', score: result.score.experience, maxScore: 30, icon: '💼' },
                  { label: 'Skills técnicos', score: result.score.skills, maxScore: 35, icon: '⚡' },
                  { label: 'Educación', score: result.score.education, maxScore: 15, icon: '🎓' },
                  { label: 'Tests psicométricos', score: result.score.psychometric, maxScore: 20, icon: '🧠' },
                ]} />

                {/* Skills Match */}
                {(result.score.details.matchedSkills.length > 0 || result.score.details.missingSkills.length > 0) && (
                  <div className="p-6 rounded-2xl bg-white border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Compatibilidad de Skills</h4>
                    {result.score.details.matchedSkills.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">✓ Coincidencias</p>
                        <div className="flex flex-wrap gap-2">
                          {result.score.details.matchedSkills.map((s: string, i: number) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.score.details.missingSkills.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">✗ Faltantes</p>
                        <div className="flex flex-wrap gap-2">
                          {result.score.details.missingSkills.map((s: string, i: number) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link
                href="/vacantes"
                className="h-14 px-8 bg-slate-100 text-brand-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
              >
                Ver más vacantes
              </Link>
              <Link
                href="/dashboard"
                className="h-14 px-8 bg-brand-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-black/90 transition-all flex items-center justify-center gap-2"
              >
                Ir a mi dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── APPLICATION FORM ───────────────────────────
  return (
    <div className="min-h-screen bg-white font-sans pt-28 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">

          <div className="mb-8">
            <Link href={`/jobs/${params.jobId}`} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-brand-blue transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Volver al detalle
            </Link>
          </div>

          {/* Job Summary */}
          {job && (
            <div className="p-8 rounded-[2rem] bg-brand-black text-white mb-10 relative overflow-hidden">
              <div className="absolute top-[-30%] right-[-15%] w-[50%] h-[50%] bg-brand-orange/15 rounded-full blur-[100px]" />
              <div className="relative z-10 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Estás aplicando a</p>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={14} />
                    {job.company.name}
                    {job.company.verified && <CheckCircle2 size={12} className="text-brand-blue" />}
                  </span>
                  {job.location && <span className="flex items-center gap-1.5"><MapPin size={14} />{job.location}</span>}
                  {job.modality && <span className="flex items-center gap-1.5"><Briefcase size={14} />{job.modality}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-brand-black tracking-tight">Carta de presentación</h2>
              <p className="text-slate-400 font-medium">
                Opcional pero recomendada. Cuéntale a la empresa por qué eres el candidato ideal.
              </p>
              <textarea
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                placeholder="Escribe aquí por qué te interesa esta posición y qué valor puedes aportar..."
                className="w-full h-48 px-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-brand-black placeholder-slate-300 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-medium resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm font-bold">
                {error}
              </div>
            )}

            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 space-y-3">
              <h4 className="text-sm font-black text-brand-blue">⚡ Evaluación automática</h4>
              <p className="text-xs text-blue-600/70 font-medium">
                Al enviar tu aplicación, nuestro motor de scoring evaluará automáticamente tu perfil contra los requisitos de la vacante. 
                Recibirás tu score inmediatamente.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-16 bg-brand-orange text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-brand-orange/90 focus:ring-4 focus:ring-brand-orange/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-brand-orange/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Evaluando tu perfil...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Enviar mi aplicación
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
