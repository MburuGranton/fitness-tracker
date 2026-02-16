import {
  Flame,
  Footprints,
  Droplets,
  Timer,
  TrendingUp,
  Plus,
  Minus,
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import StatCard from '../components/StatCard';
import WeeklyChart from '../components/WeeklyChart';

export default function Dashboard() {
  const { todayStats, goals, workouts, weeklyStats, incrementWater, decrementWater } =
    useFitness();

  const todaysWorkouts = workouts.filter(
    (w) => w.date.split('T')[0] === new Date().toISOString().split('T')[0]
  );

  const streak = (() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const hasWorkout = workouts.some((w) => w.date.split('T')[0] === dateStr);
      if (hasWorkout) count++;
      else break;
    }
    return count;
  })();

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'} 👋
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Here's your fitness summary for today
          </p>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-semibold text-amber-400">
              {streak} day streak
            </span>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Calories Burned"
          value={todayStats.caloriesBurned}
          target={goals.calories}
          unit="kcal"
          icon={Flame}
          color="orange"
          ringColor="#f97316"
        />
        <StatCard
          label="Steps"
          value={todayStats.steps}
          target={goals.steps}
          unit="steps"
          icon={Footprints}
          color="primary"
          ringColor="#06b6d4"
        />
        <div className="card-hover group animate-slide-up">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                Water Intake
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-heading font-bold text-white">
                  {todayStats.waterIntake}
                </span>
                <span className="text-sm text-slate-400 font-medium">
                  / {goals.water} glasses
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={decrementWater}
                className="w-8 h-8 rounded-lg bg-surface-800 hover:bg-surface-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <Minus size={14} />
              </button>
              <button
                onClick={incrementWater}
                className="w-8 h-8 rounded-lg bg-primary-500/15 hover:bg-primary-500/25 flex items-center justify-center text-primary-400 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
          {/* Water Drops visual */}
          <div className="flex gap-1.5 flex-wrap">
            {Array.from({ length: goals.water }).map((_, i) => (
              <Droplets
                key={i}
                size={18}
                className={`transition-colors duration-300 ${
                  i < todayStats.waterIntake
                    ? 'text-blue-400'
                    : 'text-surface-700'
                }`}
              />
            ))}
          </div>
        </div>
        <StatCard
          label="Active Minutes"
          value={todayStats.activeMinutes}
          target={goals.activeMinutes}
          unit="min"
          icon={Timer}
          color="emerald"
          ringColor="#10b981"
        />
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
      </div>

      {/* Today's Workouts */}
      <div className="card animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-400" />
            Today's Activity
          </h3>
          <span className="text-xs text-slate-500">
            {todaysWorkouts.length} workout{todaysWorkouts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {todaysWorkouts.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">
            No workouts logged yet today. Head to{' '}
            <span className="text-primary-400">Workouts</span> to add one!
          </p>
        ) : (
          <div className="space-y-2">
            {todaysWorkouts.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-4 px-4 py-3 rounded-xl bg-surface-800/50 hover:bg-surface-800 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    w.intensity === 'high'
                      ? 'bg-rose-500/15 text-rose-400'
                      : w.intensity === 'moderate'
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'bg-emerald-500/15 text-emerald-400'
                  }`}
                >
                  <Flame size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {w.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {w.duration} min · {w.intensity}
                  </p>
                </div>
                <span className="text-sm font-semibold text-orange-400">
                  {w.calories} kcal
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
