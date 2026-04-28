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
    <div className="space-y-10">
      
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-brand-black uppercase tracking-tighter">Gestión de Vacantes</h1>
          <p className="text-slate-400 font-medium">Publica y administra las oportunidades laborales.</p>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          variant="secondary"
          className="flex gap-2 h-14 px-8 rounded-2xl"
        >
          <Plus size={18} /> Nueva Vacante
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: totalJobs, icon: Briefcase, color: 'text-brand-blue bg-brand-blue/10' },
          { label: 'Activas', value: approvedJobs, icon: Check, color: 'text-emerald-500 bg-emerald-50' },
          { label: 'Pendientes', value: pendingJobs, icon: AlertTriangle, color: 'text-amber-500 bg-amber-50' },
          { label: 'Aplicaciones', value: totalApplications, icon: Users, color: 'text-purple-500 bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={16} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
            </div>
            <p className="text-3xl font-black text-brand-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      {/* Create Form */}
      {isEditing && (
        <Card className="p-10 space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-brand-black uppercase tracking-tight">Nueva Vacante</h2>
            <button onClick={() => setIsEditing(false)} className="text-slate-300 hover:text-slate-500 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Título de la Posición *</label>
              <input
                type="text"
                className="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-blue font-black text-xl"
                placeholder="Ej: Senior Fullstack Developer"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Ubicación</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="text"
                  className="w-full p-4 pl-12 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-blue font-bold"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Rango Salarial</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="text"
                  className="w-full p-4 pl-12 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-blue font-bold"
                  placeholder="Ej: $40,000 - $60,000 MXN"
                  value={formData.salaryRange}
                  onChange={e => setFormData({ ...formData, salaryRange: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Modalidad</label>
              <select
                className="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-blue font-bold bg-white appearance-none"
                value={formData.modality}
                onChange={e => setFormData({ ...formData, modality: e.target.value })}
              >
                <option value="Presencial">Presencial</option>
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Posiciones</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="number"
                  min="1"
                  className="w-full p-4 pl-12 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-blue font-bold"
                  value={formData.positions}
                  onChange={e => setFormData({ ...formData, positions: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Descripción *</label>
            <textarea
              className="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-blue font-medium h-32 resize-none"
              placeholder="Describe las responsabilidades del puesto..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center pt-8 border-t border-slate-100 justify-end">
            <Button onClick={() => setIsEditing(false)} variant="outline">Cancelar</Button>
            <Button onClick={handleSave} disabled={isSaving} className="flex gap-2 h-14 px-10 rounded-2xl">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? 'Publicando...' : 'Publicar Vacante'}
            </Button>
          </div>
        </Card>
      )}

      {/* Jobs List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-blue" size={32} />
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest bg-white rounded-[3rem] border border-dashed border-slate-200">
          Aún no hay vacantes registradas. Crea la primera.
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className="relative">
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
                <div className="absolute top-4 right-28 flex gap-2">
                  <button
                    onClick={() => handleStatusChange(job.id, 'approved')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleStatusChange(job.id, 'rejected')}
                    className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
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
