import { useState } from 'react';
import {
  Plus,
  Trash2,
  Flame,
  Clock,
  Dumbbell,
  Search,
  Filter,
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import WorkoutForm from '../components/WorkoutForm';

export default function Workouts() {
  const { workouts, deleteWorkout } = useFitness();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const workoutTypeSet = Array.from(new Set(workouts.map((w) => w.type)));

  const filtered = workouts
    .filter((w) => {
      if (filterType !== 'all' && w.type !== filterType) return false;
      if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group by date
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, w) => {
    const dateKey = w.date.split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(w);
    return acc;
  }, {});

  const formatDateLabel = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const intensityColors = {
    low: 'bg-emerald-500/15 text-emerald-400',
    moderate: 'bg-amber-500/15 text-amber-400',
    high: 'bg-rose-500/15 text-rose-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white">Workouts</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {workouts.length} total workouts logged
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={showForm ? 'btn-secondary' : 'btn-primary'}
        >
          {showForm ? (
            'Cancel'
          ) : (
            <>
              <Plus size={16} /> Log Workout
            </>
          )}
        </button>
      </div>

      {/* Add Workout Form */}
      {showForm && <WorkoutForm onClose={() => setShowForm(false)} />}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search workouts..."
            className="input-field pl-10"
          />
        </div>
        <div className="relative">
          <Filter
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field pl-10 pr-8 appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="all">All Types</option>
            {workoutTypeSet.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Workout History */}
      {Object.keys(grouped).length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-12 text-center">
          <Dumbbell size={40} className="text-slate-700 mb-3" />
          <p className="text-slate-400 font-medium">No workouts found</p>
          <p className="text-sm text-slate-600 mt-1">
            {search || filterType !== 'all'
              ? 'Try adjusting your filters'
              : 'Log your first workout above!'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => {
            const totalCal = items.reduce((sum, w) => sum + w.calories, 0);
            const totalMin = items.reduce((sum, w) => sum + w.duration, 0);

            return (
              <div key={date} className="animate-slide-up">
                {/* Day header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-sm font-semibold text-slate-300">
                    {formatDateLabel(date)}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Flame size={12} className="text-orange-400" />
                      {totalCal} kcal
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-primary-400" />
                      {totalMin} min
                    </span>
                  </div>
                </div>

                {/* Workout cards */}
                <div className="space-y-2">
                  {items.map((w) => (
                    <div
                      key={w.id}
                      className="card-hover flex items-center gap-4 group/item"
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          intensityColors[w.intensity]
                        }`}
                      >
                        <Dumbbell size={18} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {w.name}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock size={10} /> {w.duration} min
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Flame size={10} /> {w.calories} kcal
                          </span>
                          <span
                            className={`text-[10px] font-medium px-1.5 py-0.5 rounded capitalize ${
                              intensityColors[w.intensity]
                            }`}
                          >
                            {w.intensity}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteWorkout(w.id)}
                        className="p-2 rounded-lg opacity-0 group-hover/item:opacity-100 hover:bg-rose-500/15 text-slate-500 hover:text-rose-400 transition-all"
                        title="Delete workout"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
