/**
 * ScoreBar — Barra de score visual con tier badge
 */

interface ScoreBarProps {
  score: number;
  maxScore?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

function getTierInfo(score: number) {
  if (score >= 90) return { tier: 'S', label: 'Excepcional', bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50' };
  if (score >= 75) return { tier: 'A', label: 'Excelente', bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50' };
  if (score >= 60) return { tier: 'B', label: 'Bueno', bg: 'bg-brand-blue', text: 'text-brand-blue', light: 'bg-blue-50' };
  if (score >= 40) return { tier: 'C', label: 'Aceptable', bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50' };
  return { tier: 'D', label: 'Por debajo', bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-50' };
}

export function ScoreBar({ score, maxScore = 100, showLabel = true, size = 'md', animated = true }: ScoreBarProps) {
  const percentage = Math.min((score / maxScore) * 100, 100);
  const tier = getTierInfo(score);

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  const textSizes = { sm: 'text-[9px]', md: 'text-xs', lg: 'text-sm' };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-lg ${tier.bg} text-white flex items-center justify-center text-[10px] font-black`}>
              {tier.tier}
            </span>
            <span className={`${textSizes[size]} font-bold ${tier.text}`}>{tier.label}</span>
          </div>
          <span className={`${textSizes[size]} font-black text-brand-black tabular-nums`}>
            {score}<span className="text-slate-300">/{maxScore}</span>
          </span>
        </div>
      )}
      <div className={`w-full ${heights[size]} bg-slate-100 rounded-full overflow-hidden`}>
        <div
          className={`${heights[size]} ${tier.bg} rounded-full ${animated ? 'transition-all duration-1000 ease-out' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * ScoreBreakdownCard — Desglose de score por categoría
 */
interface BreakdownItem {
  label: string;
  score: number;
  maxScore: number;
  icon: string;
}

export function ScoreBreakdownCard({ items }: { items: BreakdownItem[] }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 space-y-5">
      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Desglose de Score</h4>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                <span>{item.icon}</span>
                {item.label}
              </span>
              <span className="text-xs font-black text-brand-black tabular-nums">
                {item.score}<span className="text-slate-300">/{item.maxScore}</span>
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-1.5 bg-brand-blue rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(item.score / item.maxScore) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * TierBadge — Badge compacto con tier
 */
export function TierBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const tier = getTierInfo(score);
  const sizes = {
    sm: 'w-6 h-6 text-[8px]',
    md: 'w-8 h-8 text-[10px]',
    lg: 'w-10 h-10 text-xs',
  };

  return (
    <div className={`${sizes[size]} rounded-xl ${tier.bg} text-white flex items-center justify-center font-black shadow-lg`}
      title={`${tier.label} (${score}/100)`}>
      {tier.tier}
    </div>
  );
}
