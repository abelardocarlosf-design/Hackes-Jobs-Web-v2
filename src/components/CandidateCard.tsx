import { TierBadge } from '@/components/ScoreBar';
import { User, Mail, Briefcase, GraduationCap, Clock } from 'lucide-react';

interface CandidateCardProps {
  name: string;
  email: string;
  avatar?: string | null;
  experienceYears?: number;
  education?: string | null;
  skills?: string[];
  score?: number | null;
  status: string;
  appliedAt: string;
  onStatusChange?: (newStatus: string) => void;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pendiente', color: 'text-amber-600', bg: 'bg-amber-50' },
  reviewing: { label: 'En revisión', color: 'text-blue-600', bg: 'bg-blue-50' },
  shortlisted: { label: 'Preseleccionado', color: 'text-purple-600', bg: 'bg-purple-50' },
  rejected: { label: 'Rechazado', color: 'text-red-500', bg: 'bg-red-50' },
  hired: { label: 'Contratado', color: 'text-emerald-600', bg: 'bg-emerald-50' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  if (days < 7) return `Hace ${days}d`;
  return `Hace ${Math.floor(days / 7)}sem`;
}

export function CandidateCard({
  name,
  email,
  experienceYears = 0,
  education,
  skills = [],
  score,
  status,
  appliedAt,
  onStatusChange,
}: CandidateCardProps) {
  const statusInfo = statusConfig[status] || statusConfig.pending;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:shadow-premium transition-all duration-300 group">
      <div className="flex items-start gap-4">
        
        {/* Avatar + Score */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <User size={22} />
          </div>
          {score !== null && score !== undefined && <TierBadge score={score} size="sm" />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-black text-brand-black text-sm uppercase tracking-tight truncate">{name}</h4>
              <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                <Mail size={11} /> {email}
              </p>
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${statusInfo.bg} ${statusInfo.color} shrink-0`}>
              {statusInfo.label}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-2">
            {experienceYears > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                <Briefcase size={10} /> {experienceYears} año{experienceYears !== 1 ? 's' : ''}
              </span>
            )}
            {education && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                <GraduationCap size={10} /> {education}
              </span>
            )}
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
              <Clock size={10} /> {timeAgo(appliedAt)}
            </span>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 5).map((skill, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-brand-blue/5 text-brand-blue text-[9px] font-bold">
                  {skill}
                </span>
              ))}
              {skills.length > 5 && (
                <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[9px] font-bold">
                  +{skills.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Score bar inline */}
          {score !== null && score !== undefined && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-1000 ${
                    score >= 75 ? 'bg-emerald-500' : score >= 60 ? 'bg-brand-blue' : score >= 40 ? 'bg-amber-500' : 'bg-red-400'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-brand-black tabular-nums w-8">{score}</span>
            </div>
          )}

          {/* Actions */}
          {onStatusChange && status !== 'hired' && status !== 'rejected' && (
            <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {status === 'pending' && (
                <button onClick={() => onStatusChange('reviewing')} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors">
                  Revisar
                </button>
              )}
              {(status === 'pending' || status === 'reviewing') && (
                <button onClick={() => onStatusChange('shortlisted')} className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 text-[8px] font-black uppercase tracking-widest hover:bg-purple-100 transition-colors">
                  Preseleccionar
                </button>
              )}
              {status === 'shortlisted' && (
                <button onClick={() => onStatusChange('hired')} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors">
                  Contratar
                </button>
              )}
              <button onClick={() => onStatusChange('rejected')} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-[8px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors">
                Rechazar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
