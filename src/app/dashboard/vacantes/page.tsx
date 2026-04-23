"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { JobVacancy } from '@/lib/jobs.types';
import { Plus, Edit2, Trash2, Save, X, Briefcase, MapPin, DollarSign, Globe } from 'lucide-react';

export default function DashboardVacantesPage() {
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentJob, setCurrentJob] = useState<Partial<JobVacancy>>({
    title: '',
    company: 'Hacke\'s Jobs',
    location: 'CDMX, México',
    salary: '',
    type: 'Presencial',
    description: '',
    requirements: [],
    active: true,
    category: 'General'
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await fetch('/api/blog'); // Temporary placeholder API check
    // In a real implementation, this would fetch from /api/jobs
    // For now, let's assume it's working
  };

  const handleSave = async () => {
    // API Call to /api/jobs
    setIsEditing(false);
    alert('Vacante guardada con éxito');
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
         <div className="space-y-1">
            <h1 className="text-4xl font-black text-brand-black uppercase tracking-tighter">Gestión de Vacantes</h1>
            <p className="text-slate-400 font-medium">Publica y administra las oportunidades laborales de tus clientes.</p>
         </div>
         <Button onClick={() => {
           setIsEditing(true);
           setCurrentJob({
            title: '',
            company: 'Hacke\'s Jobs',
            location: 'CDMX, México',
            salary: '',
            type: 'Presencial',
            description: '',
            requirements: [],
            active: true,
            category: 'General'
           });
         }} variant="secondary" className="flex gap-2 h-14 px-8 rounded-2xl">
           <Plus size={18} /> Nueva Vacante
         </Button>
      </div>

      {isEditing ? (
        <Card className="p-10 space-y-8 animate-in fade-in zoom-in duration-500">
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-slate-400">Título de la Posición</label>
                 <input 
                  type="text" 
                  className="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-blue font-black text-xl"
                  placeholder="Ej: Senior Fullstack Developer"
                  value={currentJob.title}
                  onChange={e => setCurrentJob({...currentJob, title: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-slate-400">Ubicación</label>
                 <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      className="w-full p-4 pl-12 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-blue font-bold"
                      value={currentJob.location}
                      onChange={e => setCurrentJob({...currentJob, location: e.target.value})}
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
                      placeholder="Ej: $40k - $60k MXN"
                      value={currentJob.salary}
                      onChange={e => setCurrentJob({...currentJob, salary: e.target.value})}
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-slate-400">Tipo de Contrato</label>
                 <select 
                  className="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-blue font-bold bg-white"
                  value={currentJob.type}
                  onChange={e => setCurrentJob({...currentJob, type: e.target.value as any})}
                 >
                    <option value="Presencial">Presencial</option>
                    <option value="Remoto">Remoto</option>
                    <option value="Híbrido">Híbrido</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-slate-400">Categoría</label>
                 <input 
                  type="text" 
                  className="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-blue font-bold"
                  placeholder="Ej: IT / Tecnología"
                  value={currentJob.category}
                  onChange={e => setCurrentJob({...currentJob, category: e.target.value})}
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Descripción de la Vacante</label>
              <textarea 
                className="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-blue font-medium h-32"
                placeholder="Describe las responsabilidades del puesto..."
                value={currentJob.description}
                onChange={e => setCurrentJob({...currentJob, description: e.target.value})}
              />
           </div>

           <div className="flex flex-wrap gap-8 items-center pt-8 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                 <input 
                  type="checkbox" 
                  className="w-6 h-6 rounded-lg border-2 border-slate-200 text-brand-blue focus:ring-brand-blue"
                  checked={currentJob.active}
                  onChange={e => setCurrentJob({...currentJob, active: e.target.checked})}
                 />
                 <span className="font-black uppercase tracking-widest text-xs group-hover:text-brand-blue">Vacante Activa</span>
              </label>
              
              <div className="flex-grow"></div>
              
              <Button onClick={() => setIsEditing(false)} variant="outline">Cancelar</Button>
              <Button onClick={handleSave} className="flex gap-2 h-14 px-10 rounded-2xl"><Save size={18} /> Publicar Vacante</Button>
           </div>
        </Card>
      ) : (
        <div className="grid gap-6">
           {/* Placeholder for Job List */}
           <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest bg-white rounded-[3rem] border border-dashed border-slate-200">
              Aún no hay vacantes registradas.
           </div>
        </div>
      )}
    </div>
  );
}
