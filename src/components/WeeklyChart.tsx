import { DailyStats } from '../data/mockData';

interface WeeklyChartProps {
  data: DailyStats[];
  metric: keyof Omit<DailyStats, 'date'>;
  label: string;
  color: string; // hex
  maxOverride?: number;
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WeeklyChart({
  data,
  metric,
  label,
  color,
  maxOverride,
}: WeeklyChartProps) {
  const values = data.map((d) => d[metric] as number);
  const max = maxOverride || Math.max(...values, 1);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white">{label}</h3>
          <p className="text-xs text-slate-500 mt-0.5">Last 7 days · avg {avg.toLocaleString()}</p>
        </div>
        <div
          className="px-2.5 py-1 rounded-lg text-xs font-semibold"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {values[values.length - 1]?.toLocaleString()} today
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-2 h-40">
        {data.map((d, i) => {
          const val = d[metric] as number;
          const pct = Math.max((val / max) * 100, 4);
          const dayOfWeek = new Date(d.date).getDay();
          const isToday = i === data.length - 1;

          return (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
              {/* Value label */}
              <span className="text-[10px] text-slate-500 font-medium tabular-nums">
                {val.toLocaleString()}
              </span>

              {/* Bar */}
              <div className="w-full flex justify-center">
                <div
                  className="relative w-full max-w-[32px] rounded-lg transition-all duration-700 ease-out group cursor-default"
                  style={{
                    height: `${pct}%`,
                    minHeight: '6px',
                    background: isToday
                      ? `linear-gradient(180deg, ${color}, ${color}99)`
                      : `linear-gradient(180deg, ${color}88, ${color}44)`,
                    boxShadow: isToday ? `0 0 12px ${color}40` : 'none',
                  }}
                >
                  {/* Hover tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-800 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap pointer-events-none z-10">
                    {val.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Day label */}
              <span
                className={`text-[11px] font-medium ${
                  isToday ? 'text-primary-400' : 'text-slate-500'
                }`}
              >
                {isToday ? 'Today' : dayLabels[dayOfWeek]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
