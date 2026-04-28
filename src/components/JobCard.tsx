import Link from 'next/link';
import { MapPin, Clock, Users, Building2, CheckCircle2, DollarSign, Briefcase } from 'lucide-react';

interface JobCardProps {
  id: string;
  title: string;
  company: {
    name: string;
    industry?: string | null;
    verified?: boolean;
  };
  location?: string | null;
  modality?: string | null;
  salaryRange?: string | null;
  positions?: number;
  status?: string;
  createdAt: string;
  applicationsCount?: number;
  variant?: 'default' | 'compact' | 'dashboard';
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  if (days < 7) return `Hace ${days} días`;
  if (days < 30) return `Hace ${Math.floor(days / 7)} sem`;
  return `Hace ${Math.floor(days / 30)} mes`;
}

const modalityColors: Record<string, string> = {
  'Remoto': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Híbrido': 'bg-blue-50 text-blue-700 border-blue-100',
  'Presencial': 'bg-amber-50 text-amber-700 border-amber-100',
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'En revisión', color: 'bg-amber-50 text-amber-600' },
  approved: { label: 'Activa', color: 'bg-emerald-50 text-emerald-600' },
  rejected: { label: 'Rechazada', color: 'bg-red-50 text-red-600' },
  closed: { label: 'Cerrada', color: 'bg-slate-100 text-slate-500' },
};

export function JobCard({
  id,
  title,
  company,
  location,
  modality,
  salaryRange,
  positions = 1,
  status = 'approved',
  createdAt,
  applicationsCount = 0,
  variant = 'default',
}: JobCardProps) {
  const statusInfo = statusConfig[status] || statusConfig.pending;

  if (variant === 'compact') {
    return (
      <Link href={`/jobs/${id}`} className="block">
        <div className="p-5 rounded-2xl border border-slate-100 hover:border-brand-blue/20 hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 bg-white group">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-brand-black text-sm uppercase tracking-tight truncate group-hover:text-brand-blue transition-colors">{title}</h4>
              <p className="text-xs text-slate-400 font-bold mt-1 flex items-center gap-1.5">
                <Building2 size={12} />
                {company.name}
              </p>
            </div>
            {modality && (
              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${modalityColors[modality] || 'bg-slate-50 text-slate-500'} shrink-0`}>
                {modality}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            {location && <span className="flex items-center gap-1"><MapPin size={10} />{location}</span>}
            <span className="flex items-center gap-1"><Clock size={10} />{timeAgo(createdAt)}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className="p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-premium transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link href={`/jobs/${id}`} className="group">
              <h4 className="font-black text-brand-black text-base uppercase tracking-tight group-hover:text-brand-blue transition-colors">{title}</h4>
            </Link>
            <p className="text-xs text-slate-400 font-bold mt-1">{company.name}</p>
          </div>
          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          {location && <span className="flex items-center gap-1"><MapPin size={10} />{location}</span>}
          {modality && <span className="flex items-center gap-1"><Briefcase size={10} />{modality}</span>}
          <span className="flex items-center gap-1"><Users size={10} />{applicationsCount} aplicantes</span>
          <span className="flex items-center gap-1"><Clock size={10} />{timeAgo(createdAt)}</span>
        </div>
      </div>
    );
  }

  // Default: card pública completa
  return (
    <Link href={`/jobs/${id}`} className="block group">
      <div className="p-8 rounded-[2rem] border border-slate-100 bg-white hover:border-brand-blue/20 hover:shadow-premium hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                  <Building2 size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1 truncate">
                    {company.name}
                    {company.verified && <CheckCircle2 size={12} className="text-brand-blue shrink-0" />}
                  </p>
                  {company.industry && <p className="text-[10px] text-slate-300 font-medium">{company.industry}</p>}
                </div>
              </div>
              <h3 className="text-xl font-black text-brand-black uppercase tracking-tight leading-tight group-hover:text-brand-blue transition-colors duration-300">
                {title}
              </h3>
            </div>
            {modality && (
              <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border shrink-0 ${modalityColors[modality] || 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                {modality}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-3 mb-5">
            {location && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                <MapPin size={13} className="text-slate-400" />
                {location}
              </span>
            )}
            {salaryRange && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                <DollarSign size={13} />
                {salaryRange}
              </span>
            )}
            {positions > 1 && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-brand-blue bg-brand-blue/5 px-3 py-1.5 rounded-lg">
                <Users size={13} />
                {positions} plazas
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              {timeAgo(createdAt)}
            </span>
            <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
              Ver detalles
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
