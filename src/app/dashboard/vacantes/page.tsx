"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { JobCard } from '@/components/JobCard';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Plus, Save, X, Briefcase, MapPin, DollarSign, Users, Check, Loader2, AlertTriangle } from 'lucide-react';

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
  company: { name: string; industry: string | null; verified: boolean };
  _count: { applications: number };
}

export default function DashboardVacantesPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: 'CDMX, México',
    salaryRange: '',
    modality: 'Presencial' as string,
    positions: 1,
  });

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      // Admin/recruiter ven todo, empresa ve solo las suyas
      if (user?.role === 'admin' || user?.role === 'recruiter') {
        // No filter, see all
      }
      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      setMessage({ type: 'error', text: 'Título y descripción son requeridos' });
      return;
    }
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: '✅ Vacante publicada exitosamente' });
        setIsEditing(false);
        setFormData({ title: '', description: '', location: 'CDMX, México', salaryRange: '', modality: 'Presencial', positions: 1 });
        fetchJobs();
      } else {
        setMessage({ type: 'error', text: data.message || 'Error al publicar' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexión' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchJobs();
        setMessage({ type: 'success', text: `Vacante ${newStatus === 'approved' ? 'aprobada' : newStatus === 'rejected' ? 'rechazada' : 'actualizada'}` });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al actualizar status' });
    }
  };

  // Stats
  const totalJobs = jobs.length;
  const approvedJobs = jobs.filter(j => j.status === 'approved').length;
  const pendingJobs = jobs.filter(j => j.status === 'pending').length;
  const totalApplications = jobs.reduce((sum, j) => sum + j._count.applications, 0);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Gestión de Vacantes</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Publica y administra las oportunidades laborales del ecosistema.</p>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          variant="secondary"
          className="flex gap-4 h-16 px-10 rounded-2xl shadow-orange/20 text-[11px] font-black uppercase tracking-widest border-none"
        >
          <Plus size={20} /> Nueva Vacante
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total', value: totalJobs, icon: Briefcase, color: 'text-brand-blue bg-brand-blue/20' },
          { label: 'Activas', value: approvedJobs, icon: Check, color: 'text-emerald-400 bg-emerald-500/20' },
          { label: 'Pendientes', value: pendingJobs, icon: AlertTriangle, color: 'text-amber-400 bg-amber-500/20' },
          { label: 'Aplicaciones', value: totalApplications, icon: Users, color: 'text-purple-400 bg-purple-500/20' },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl group hover:bg-white/10 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform`}>
                <stat.icon size={22} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</span>
            </div>
            <p className="text-5xl font-black text-white tracking-tighter group-hover:text-brand-orange transition-colors">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div className={`p-6 rounded-3xl text-[11px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-500 backdrop-blur-xl ${
          message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {message.text}
        </div>
      )}

      {/* Create Form */}
      {isEditing && (
        <Card className="p-12 space-y-10 animate-in fade-in zoom-in duration-500 bg-brand-black/40 backdrop-blur-3xl border-white/10 rounded-[3rem]">
          <div className="flex items-center justify-between border-b border-white/5 pb-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Publicar Nueva Vacante</h2>
            <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white transition-colors">
              <X size={32} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Título de la Posición *</label>
              <input
                type="text"
                className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-8 font-black text-2xl text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner"
                placeholder="Ej: Senior Fullstack Developer"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Ubicación Estratégica</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="text"
                  className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl pl-16 pr-8 font-bold text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Rango Salarial</label>
              <div className="relative">
                <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="text"
                  className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl pl-16 pr-8 font-bold text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner"
                  placeholder="Ej: $40,000 - $60,000 MXN"
                  value={formData.salaryRange}
                  onChange={e => setFormData({ ...formData, salaryRange: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Modalidad de Trabajo</label>
              <select
                className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-8 font-bold text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all appearance-none cursor-pointer"
                value={formData.modality}
                onChange={e => setFormData({ ...formData, modality: e.target.value })}
              >
                <option value="Presencial" className="bg-brand-black">Presencial</option>
                <option value="Remoto" className="bg-brand-black">Remoto</option>
                <option value="Híbrido" className="bg-brand-black">Híbrido</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Posiciones Disponibles</label>
              <div className="relative">
                <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="number"
                  min="1"
                  className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl pl-16 pr-8 font-bold text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner"
                  value={formData.positions}
                  onChange={e => setFormData({ ...formData, positions: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Descripción Detallada *</label>
            <textarea
              className="w-full h-48 bg-white/5 border border-white/5 rounded-[2rem] p-8 font-medium text-white focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-inner resize-none"
              placeholder="Describe las responsabilidades del puesto..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex flex-wrap gap-6 items-center pt-10 border-t border-white/5 justify-end">
            <Button onClick={() => setIsEditing(false)} variant="ghost" className="text-slate-500 hover:text-white uppercase font-black text-[11px] tracking-widest">Descartar</Button>
            <Button onClick={handleSave} disabled={isSaving} className="flex gap-4 h-16 px-12 rounded-2xl shadow-2xl shadow-brand-blue/20 text-[11px] font-black uppercase tracking-widest border-none">
              {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              {isSaving ? 'Publicando...' : 'Autorizar Vacante'}
            </Button>
          </div>
        </Card>
      )}

      {/* Jobs List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
          <Loader2 className="animate-spin text-brand-blue" size={60} />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Escaneando Ecosistema...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-40 text-center text-slate-500 font-black uppercase tracking-[0.4em] bg-white/5 rounded-[4rem] border-2 border-dashed border-white/10 backdrop-blur-md">
          El radar está vacío. Comienza a atraer talento.
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map(job => (
            <div key={job.id} className="relative group">
              <JobCard
                id={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                modality={job.modality}
                salaryRange={job.salaryRange}
                positions={job.positions}
                status={job.status}
                createdAt={job.createdAt}
                applicationsCount={job._count.applications}
                variant="dashboard"
              />
              {/* Admin actions */}
              {(user?.role === 'admin' || user?.role === 'recruiter') && job.status === 'pending' && (
                <div className="absolute top-8 right-32 flex gap-4 z-20">
                  <button
                    onClick={() => handleStatusChange(job.id, 'approved')}
                    className="px-6 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 hover:bg-emerald-500/30 transition-all shadow-lg"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleStatusChange(job.id, 'rejected')}
                    className="px-6 py-3 rounded-xl bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-500/30 hover:bg-red-500/30 transition-all shadow-lg"
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
