import { Flame, Footprints, Droplets, Timer, TrendingUp, Award } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import WeeklyChart from '../components/WeeklyChart';
import ProgressRing from '../components/ProgressRing';

export default function Progress() {
  const { weeklyStats, workouts, goals } = useFitness();

  // Streak calculation
  const streak = (() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const hasWorkout = workouts.some((w) => w.date.split('T')[0] === dateStr);
      if (hasWorkout) count++;
      else break;
    }
    return count;
  })();

  // Best day
  const bestDay = weeklyStats.reduce(
    (best, d) => (d.caloriesBurned > best.caloriesBurned ? d : best),
    weeklyStats[0]
  );

  // Weekly totals
  const weekTotals = weeklyStats.reduce(
    (acc, d) => ({
      calories: acc.calories + d.caloriesBurned,
      steps: acc.steps + d.steps,
      water: acc.water + d.waterIntake,
      activeMinutes: acc.activeMinutes + d.activeMinutes,
    }),
    { calories: 0, steps: 0, water: 0, activeMinutes: 0 }
  );

  // Goal completion rate
  const daysMetGoals = weeklyStats.filter(
    (d) =>
      d.caloriesBurned >= goals.calories &&
      d.steps >= goals.steps &&
      d.activeMinutes >= goals.activeMinutes
  ).length;
  const goalCompletionRate = Math.round((daysMetGoals / 7) * 100);

  // Workout type distribution
  const last7Days = new Set(weeklyStats.map((d) => d.date.split('T')[0]));
  const recentWorkouts = workouts.filter((w) => last7Days.has(w.date.split('T')[0]));
  const typeDistribution = recentWorkouts.reduce<Record<string, number>>((acc, w) => {
    acc[w.type] = (acc[w.type] || 0) + 1;
    return acc;
  }, {});
  const totalTypeCount = Object.values(typeDistribution).reduce((a, b) => a + b, 0) || 1;
  const typeColors: Record<string, string> = {
    running: '#06b6d4',
    cycling: '#8b5cf6',
    swimming: '#3b82f6',
    weights: '#f97316',
    yoga: '#10b981',
    hiit: '#ef4444',
    walking: '#6366f1',
    stretching: '#a855f7',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-white">Progress</h2>
        <p className="text-sm text-slate-400 mt-0.5">Your weekly performance overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="card-hover text-center py-5 animate-slide-up">
          <div className="mx-auto mb-3">
            <ProgressRing radius={32} stroke={4} progress={Math.min(streak * 15, 100)} color="#f59e0b">
              <Award size={20} className="text-amber-400" />
            </ProgressRing>
          </div>
          <p className="text-2xl font-heading font-bold text-white">{streak}</p>
          <p className="text-xs text-slate-400 mt-0.5">Day Streak</p>
        </div>

        {/* Goal Completion */}
        <div className="card-hover text-center py-5 animate-slide-up">
          <div className="mx-auto mb-3">
            <ProgressRing radius={32} stroke={4} progress={goalCompletionRate} color="#10b981">
              <TrendingUp size={20} className="text-emerald-400" />
            </ProgressRing>
          </div>
          <p className="text-2xl font-heading font-bold text-white">{goalCompletionRate}%</p>
          <p className="text-xs text-slate-400 mt-0.5">Goals Met</p>
        </div>

        {/* Weekly Calories */}
        <div className="card-hover text-center py-5 animate-slide-up">
          <div className="w-14 h-14 rounded-xl bg-orange-500/15 flex items-center justify-center mx-auto mb-3">
            <Flame size={24} className="text-orange-400" />
          </div>
          <p className="text-2xl font-heading font-bold text-white">
            {weekTotals.calories.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Weekly Calories</p>
        </div>

        {/* Weekly Active */}
        <div className="card-hover text-center py-5 animate-slide-up">
          <div className="w-14 h-14 rounded-xl bg-primary-500/15 flex items-center justify-center mx-auto mb-3">
            <Timer size={24} className="text-primary-400" />
          </div>
          <p className="text-2xl font-heading font-bold text-white">
            {weekTotals.activeMinutes}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Active Minutes</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeeklyChart
          data={weeklyStats}
          metric="caloriesBurned"
          label="Calories Burned"
          color="#f97316"
        />
        <WeeklyChart
          data={weeklyStats}
          metric="steps"
          label="Steps"
          color="#06b6d4"
        />
        <WeeklyChart
          data={weeklyStats}
          metric="activeMinutes"
          label="Active Minutes"
          color="#10b981"
        />
        <WeeklyChart
          data={weeklyStats}
          metric="waterIntake"
          label="Water Intake"
          color="#3b82f6"
          maxOverride={12}
        />
      </div>

      {/* Workout Distribution + Best Day */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Workout Type Distribution */}
        <div className="card animate-slide-up">
          <h3 className="text-sm font-semibold text-white mb-4">
            Workout Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(typeDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => {
                const pct = Math.round((count / totalTypeCount) * 100);
                const color = typeColors[type] || '#06b6d4';
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-300 capitalize">
                        {type}
                      </span>
                      <span className="text-xs text-slate-500">
                        {count} · {pct}%
                      </span>
                    </div>
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Best Day & Weekly Summary */}
        <div className="card animate-slide-up">
          <h3 className="text-sm font-semibold text-white mb-4">Weekly Highlights</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-400/70 uppercase tracking-wider font-medium mb-1">
                🏆 Best Day
              </p>
              <p className="text-sm font-medium text-white">
                {new Date(bestDay.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {bestDay.caloriesBurned} cal · {bestDay.steps.toLocaleString()} steps · {bestDay.activeMinutes} min active
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-surface-800/60">
                <div className="flex items-center gap-1.5 mb-1">
                  <Footprints size={12} className="text-primary-400" />
                  <span className="text-xs text-slate-400">Total Steps</span>
                </div>
                <p className="text-lg font-heading font-bold text-white">
                  {weekTotals.steps.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-surface-800/60">
                <div className="flex items-center gap-1.5 mb-1">
                  <Droplets size={12} className="text-blue-400" />
                  <span className="text-xs text-slate-400">Total Water</span>
                </div>
                <p className="text-lg font-heading font-bold text-white">
                  {weekTotals.water} glasses
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center pt-1">
              Keep it up! Consistency is key to reaching your goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
