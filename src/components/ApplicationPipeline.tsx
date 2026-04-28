import { Users, Eye, Star, XCircle, CheckCircle2 } from 'lucide-react';

interface PipelineStats {
  total: number;
  pending: number;
  reviewing: number;
  shortlisted: number;
  rejected: number;
  hired: number;
  avgScore: number;
}

interface ApplicationPipelineProps {
  stats: PipelineStats;
  activeFilter?: string;
  onFilterChange: (status: string) => void;
}

const stages = [
  { key: '', label: 'Todos', icon: Users, color: 'bg-slate-100 text-slate-600' },
  { key: 'pending', label: 'Pendientes', icon: Users, color: 'bg-amber-50 text-amber-600' },
  { key: 'reviewing', label: 'En Revisión', icon: Eye, color: 'bg-blue-50 text-blue-600' },
  { key: 'shortlisted', label: 'Preseleccionados', icon: Star, color: 'bg-purple-50 text-purple-600' },
  { key: 'hired', label: 'Contratados', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
  { key: 'rejected', label: 'Rechazados', icon: XCircle, color: 'bg-red-50 text-red-500' },
];

export function ApplicationPipeline({ stats, activeFilter = '', onFilterChange }: ApplicationPipelineProps) {
  const getCount = (key: string): number => {
    if (key === '') return stats.total;
    return (stats as any)[key] || 0;
  };

  return (
    <div className="space-y-6">
      {/* Pipeline stages */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {stages.map(stage => {
          const count = getCount(stage.key);
          const isActive = activeFilter === stage.key;

          return (
            <button
              key={stage.key}
              onClick={() => onFilterChange(stage.key)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border-2 transition-all duration-300 shrink-0 ${
                isActive
                  ? 'border-brand-blue bg-brand-blue/5 shadow-blue'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl ${stage.color} flex items-center justify-center`}>
                <stage.icon size={14} />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{stage.label}</p>
                <p className="text-lg font-black text-brand-black leading-none">{count}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Average score indicator */}
      {stats.total > 0 && (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Score promedio</span>
            <span className="text-xl font-black text-brand-black">{stats.avgScore}</span>
            <span className="text-sm text-slate-300 font-bold">/100</span>
          </div>
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${
                stats.avgScore >= 75 ? 'bg-emerald-500' :
                stats.avgScore >= 60 ? 'bg-brand-blue' :
                stats.avgScore >= 40 ? 'bg-amber-500' : 'bg-red-400'
              }`}
              style={{ width: `${stats.avgScore}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
