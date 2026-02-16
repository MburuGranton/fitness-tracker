import {
  Flame,
  Droplets,
  TrendingUp,
  Plus,
  Minus,
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import WeeklyChart from '../components/WeeklyChart';

export default function Dashboard() {
  const { todayStats, goals, workouts, weeklyStats, incrementWater, decrementWater } =
    useFitness();

  const todaysWorkouts = workouts.filter(
    (w) => w.date.split('T')[0] === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-white">Overview</h2>

      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="card">
          <p className="text-xs text-slate-500 mb-1">Calories</p>
          <p className="text-xl font-bold text-white">
            {todayStats.caloriesBurned}
            <span className="text-xs font-normal text-slate-500 ml-1">/ {goals.calories}</span>
          </p>
          <div className="progress-bar-track mt-2">
            <div className="progress-bar-fill bg-orange-500" style={{ width: `${Math.min((todayStats.caloriesBurned / goals.calories) * 100, 100)}%` }} />
          </div>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500 mb-1">Steps</p>
          <p className="text-xl font-bold text-white">
            {todayStats.steps.toLocaleString()}
            <span className="text-xs font-normal text-slate-500 ml-1">/ {goals.steps.toLocaleString()}</span>
          </p>
          <div className="progress-bar-track mt-2">
            <div className="progress-bar-fill bg-teal-500" style={{ width: `${Math.min((todayStats.steps / goals.steps) * 100, 100)}%` }} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-500">Water</p>
            <div className="flex items-center gap-1">
              <button
                onClick={decrementWater}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <Minus size={12} />
              </button>
              <button
                onClick={incrementWater}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
          <p className="text-xl font-bold text-white">
            {todayStats.waterIntake}
            <span className="text-xs font-normal text-slate-500 ml-1">/ {goals.water} glasses</span>
          </p>
          <div className="flex gap-1 mt-2">
            {Array.from({ length: goals.water }).map((_, i) => (
              <Droplets
                key={i}
                size={14}
                className={i < todayStats.waterIntake ? 'text-blue-400' : 'text-slate-700'}
              />
            ))}
          </div>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500 mb-1">Active</p>
          <p className="text-xl font-bold text-white">
            {todayStats.activeMinutes}
            <span className="text-xs font-normal text-slate-500 ml-1">/ {goals.activeMinutes} min</span>
          </p>
          <div className="progress-bar-track mt-2">
            <div className="progress-bar-fill bg-emerald-500" style={{ width: `${Math.min((todayStats.activeMinutes / goals.activeMinutes) * 100, 100)}%` }} />
          </div>
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
      </div>

      {/* Today's Workouts */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <TrendingUp size={16} className="text-teal-500" />
            Today's Activity
          </h3>
          <span className="text-xs text-slate-500">
            {todaysWorkouts.length} workout{todaysWorkouts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {todaysWorkouts.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">
            No workouts logged yet today. Head to{' '}
            <span className="text-teal-500">Workouts</span> to add one!
          </p>
        ) : (
          <div className="space-y-2">
            {todaysWorkouts.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-4 px-4 py-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 transition-colors"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    w.intensity === 'high'
                      ? 'bg-rose-500/10 text-rose-400'
                      : w.intensity === 'moderate'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-emerald-500/10 text-emerald-400'
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
