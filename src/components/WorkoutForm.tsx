import { useState } from 'react';
import { Plus, X, Clock, Flame, Zap } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { workoutTypes } from '../data/mockData';

interface WorkoutFormProps {
  onClose?: () => void;
}

export default function WorkoutForm({ onClose }: WorkoutFormProps) {
  const { addWorkout } = useFitness();
  const [selectedType, setSelectedType] = useState(workoutTypes[0]);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState<'low' | 'moderate' | 'high'>('moderate');

  const estimatedCalories = Math.round(
    duration *
      selectedType.calPerMin *
      (intensity === 'low' ? 0.7 : intensity === 'high' ? 1.3 : 1)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWorkout({
      type: selectedType.type,
      name: name || selectedType.name,
      duration,
      calories: estimatedCalories,
      date: new Date().toISOString(),
      intensity,
      icon: selectedType.icon,
    });
    setName('');
    setDuration(30);
    setIntensity('moderate');
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Plus size={18} className="text-emerald-500" />
          Log Workout
        </h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Workout Type */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
          Type
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
          {workoutTypes.map((wt) => (
            <button
              key={wt.type}
              type="button"
              onClick={() => setSelectedType(wt)}
              className={`p-2.5 rounded-xl text-xs font-medium text-center transition-all ${
                selectedType.type === wt.type
                  ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {wt.name}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
          Name <span className="text-slate-600">(optional)</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={selectedType.name}
          className="input-field"
        />
      </div>

      {/* Duration + Intensity row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
            <Clock size={12} className="inline mr-1" />
            Duration (min)
          </label>
          <input
            type="number"
            min={1}
            max={300}
            value={duration}
            onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
            <Zap size={12} className="inline mr-1" />
            Intensity
          </label>
          <div className="flex gap-2">
            {(['low', 'moderate', 'high'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setIntensity(level)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium capitalize transition-all ${
                  intensity === level
                    ? level === 'low'
                      ? 'bg-white/5 text-slate-400 ring-1 ring-slate-600'
                      : level === 'moderate'
                      ? 'bg-white/5 text-slate-300 ring-1 ring-slate-600'
                      : 'bg-white/5 text-white ring-1 ring-slate-600'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Estimated Calories */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-800/40 border border-slate-700">
        <Flame size={16} className="text-slate-400" />
        <span className="text-sm text-slate-300">
          Est. calories:{' '}
          <span className="font-semibold text-white">{estimatedCalories}</span> kcal
        </span>
      </div>

      {/* Submit */}
      <button type="submit" className="btn-primary w-full">
        <Plus size={16} />
        Add Workout
      </button>
    </form>
  );
}
