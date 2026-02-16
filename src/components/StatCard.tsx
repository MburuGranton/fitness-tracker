import { LucideIcon } from 'lucide-react';
import ProgressRing from './ProgressRing';

interface StatCardProps {
  label: string;
  value: number | string;
  target?: number;
  unit?: string;
  icon: LucideIcon;
  color: string; // tailwind color token like 'primary' or 'emerald'
  ringColor: string; // actual hex for SVG
}

export default function StatCard({
  label,
  value,
  target,
  unit,
  icon: Icon,
  color,
  ringColor,
}: StatCardProps) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const percent = target ? Math.min((numericValue / target) * 100, 100) : 0;

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
            {label}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-heading font-bold text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && (
              <span className="text-sm text-slate-400 font-medium">{unit}</span>
            )}
          </div>
          {target && (
            <p className="text-xs text-slate-500 mt-0.5">
              of {target.toLocaleString()} goal
            </p>
          )}
        </div>

        <div className="relative">
          {target ? (
            <ProgressRing
              radius={28}
              stroke={4}
              progress={percent}
              color={ringColor}
            >
              <Icon
                size={18}
                className={`text-${color}-400`}
              />
            </ProgressRing>
          ) : (
            <div
              className={`w-10 h-10 rounded-lg bg-${color}-500/10 flex items-center justify-center`}
            >
              <Icon
                size={18}
                className={`text-${color}-400`}
              />
            </div>
          )}
        </div>
      </div>

      {target && (
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{
              width: `${percent}%`,
              background: `linear-gradient(90deg, ${ringColor}, ${ringColor}bb)`,
            }}
          />
        </div>
      )}
    </div>
  );
}
