import { useState } from 'react';
import {
  Target,
  Flame,
  Footprints,
  Droplets,
  Timer,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import ProgressRing from '../components/ProgressRing';

export default function Goals() {
  const { goals, todayStats, updateGoals } = useFitness();
  const [editGoals, setEditGoals] = useState({ ...goals });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateGoals(editGoals);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setEditGoals({ steps: 10000, calories: 500, water: 8, activeMinutes: 60 });
  };

  const goalItems = [
    {
      key: 'calories' as const,
      label: 'Calories',
      unit: 'kcal',
      icon: Flame,
      color: '#f97316',
      colorClass: 'orange',
      current: todayStats.caloriesBurned,
      min: 100,
      max: 3000,
      step: 50,
    },
    {
      key: 'steps' as const,
      label: 'Steps',
      unit: 'steps',
      icon: Footprints,
      color: '#06b6d4',
      colorClass: 'primary',
      current: todayStats.steps,
      min: 1000,
      max: 30000,
      step: 500,
    },
    {
      key: 'water' as const,
      label: 'Water',
      unit: 'glasses',
      icon: Droplets,
      color: '#3b82f6',
      colorClass: 'blue',
      current: todayStats.waterIntake,
      min: 1,
      max: 16,
      step: 1,
    },
    {
      key: 'activeMinutes' as const,
      label: 'Active Minutes',
      unit: 'min',
      icon: Timer,
      color: '#10b981',
      colorClass: 'emerald',
      current: todayStats.activeMinutes,
      min: 10,
      max: 180,
      step: 5,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white">Daily Goals</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Set and track your daily fitness targets
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="btn-secondary">
            <RotateCcw size={14} />
            Reset
          </button>
          <button onClick={handleSave} className="btn-primary">
            <Save size={14} />
            {saved ? 'Saved!' : 'Save Goals'}
          </button>
        </div>
      </div>

      {/* Success toast */}
      {saved && (
        <div className="animate-slide-up p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium text-center">
          ✓ Goals updated successfully!
        </div>
      )}

      {/* Goal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goalItems.map((item) => {
          const pct = Math.min((item.current / editGoals[item.key]) * 100, 100);
          const isComplete = pct >= 100;

          return (
            <div
              key={item.key}
              className={`card-hover animate-slide-up ${
                isComplete ? 'ring-1 ring-emerald-500/30' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Ring */}
                <ProgressRing
                  radius={36}
                  stroke={5}
                  progress={pct}
                  color={isComplete ? '#10b981' : item.color}
                >
                  <item.icon
                    size={22}
                    style={{ color: isComplete ? '#10b981' : item.color }}
                  />
                </ProgressRing>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white">{item.label}</h3>
                    {isComplete && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 uppercase">
                        Done!
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    <span className="text-white font-semibold">
                      {item.current.toLocaleString()}
                    </span>{' '}
                    / {editGoals[item.key].toLocaleString()} {item.unit}
                  </p>

                  {/* Progress bar */}
                  <div className="progress-bar-track mb-3">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: isComplete ? '#10b981' : item.color,
                      }}
                    />
                  </div>

                  {/* Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                        Target
                      </label>
                      <span className="text-xs font-semibold text-white tabular-nums">
                        {editGoals[item.key].toLocaleString()} {item.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={item.min}
                      max={item.max}
                      step={item.step}
                      value={editGoals[item.key]}
                      onChange={(e) =>
                        setEditGoals({
                          ...editGoals,
                          [item.key]: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                        bg-surface-800
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                        [&::-webkit-slider-thumb]:shadow-md
                        [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white
                        [&::-moz-range-thumb]:shadow-md"
                      style={{
                        // @ts-expect-error -- style for slider thumb
                        '--tw-slider-color': item.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Summary */}
      <div className="card animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <Target size={18} className="text-primary-400" />
          <h3 className="text-sm font-semibold text-white">Today's Summary</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {goalItems.map((item) => {
            const pct = Math.round(
              Math.min((item.current / editGoals[item.key]) * 100, 100)
            );
            return (
              <div
                key={item.key}
                className="text-center p-3 rounded-xl bg-surface-800/60"
              >
                <p className="text-2xl font-heading font-bold text-white mb-0.5">
                  {pct}%
                </p>
                <p className="text-[11px] text-slate-400">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
