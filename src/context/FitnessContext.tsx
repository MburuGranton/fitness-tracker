import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import {
  Workout,
  DailyGoals,
  DailyStats,
  UserProfile,
  defaultWorkouts,
  defaultGoals,
  defaultWeeklyStats,
  defaultProfile,
} from '../data/mockData';

interface FitnessState {
  workouts: Workout[];
  goals: DailyGoals;
  weeklyStats: DailyStats[];
  profile: UserProfile;
  todayStats: DailyStats;
}

type FitnessAction =
  | { type: 'ADD_WORKOUT'; payload: Workout }
  | { type: 'DELETE_WORKOUT'; payload: string }
  | { type: 'UPDATE_GOALS'; payload: Partial<DailyGoals> }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'UPDATE_TODAY_STATS'; payload: Partial<DailyStats> }
  | { type: 'INCREMENT_WATER' }
  | { type: 'DECREMENT_WATER' };

interface FitnessContextValue extends FitnessState {
  dispatch: React.Dispatch<FitnessAction>;
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  deleteWorkout: (id: string) => void;
  updateGoals: (goals: Partial<DailyGoals>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  incrementWater: () => void;
  decrementWater: () => void;
}

const STORAGE_KEY = 'fitpulse_data';

function loadFromStorage(): Partial<FitnessState> | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // ignore
  }
  return null;
}

function saveToStorage(state: FitnessState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const todayStr = new Date().toISOString().split('T')[0];

function getInitialState(): FitnessState {
  const saved = loadFromStorage();
  const todayDefault: DailyStats = defaultWeeklyStats[defaultWeeklyStats.length - 1] || {
    date: todayStr,
    steps: 6200,
    caloriesBurned: 380,
    waterIntake: 5,
    activeMinutes: 35,
  };

  if (saved) {
    return {
      workouts: saved.workouts || defaultWorkouts,
      goals: saved.goals || defaultGoals,
      weeklyStats: saved.weeklyStats || defaultWeeklyStats,
      profile: saved.profile || defaultProfile,
      todayStats: saved.todayStats || todayDefault,
    };
  }

  return {
    workouts: defaultWorkouts,
    goals: defaultGoals,
    weeklyStats: defaultWeeklyStats,
    profile: defaultProfile,
    todayStats: todayDefault,
  };
}

function fitnessReducer(state: FitnessState, action: FitnessAction): FitnessState {
  switch (action.type) {
    case 'ADD_WORKOUT': {
      const newWorkouts = [action.payload, ...state.workouts];
      const newTodayStats = {
        ...state.todayStats,
        caloriesBurned: state.todayStats.caloriesBurned + action.payload.calories,
        activeMinutes: state.todayStats.activeMinutes + action.payload.duration,
      };
      return { ...state, workouts: newWorkouts, todayStats: newTodayStats };
    }
    case 'DELETE_WORKOUT': {
      const workout = state.workouts.find((w) => w.id === action.payload);
      const newWorkouts = state.workouts.filter((w) => w.id !== action.payload);
      let newTodayStats = state.todayStats;
      if (workout && workout.date.split('T')[0] === todayStr) {
        newTodayStats = {
          ...state.todayStats,
          caloriesBurned: Math.max(0, state.todayStats.caloriesBurned - workout.calories),
          activeMinutes: Math.max(0, state.todayStats.activeMinutes - workout.duration),
        };
      }
      return { ...state, workouts: newWorkouts, todayStats: newTodayStats };
    }
    case 'UPDATE_GOALS':
      return { ...state, goals: { ...state.goals, ...action.payload } };
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'UPDATE_TODAY_STATS':
      return { ...state, todayStats: { ...state.todayStats, ...action.payload } };
    case 'INCREMENT_WATER':
      return {
        ...state,
        todayStats: { ...state.todayStats, waterIntake: state.todayStats.waterIntake + 1 },
      };
    case 'DECREMENT_WATER':
      return {
        ...state,
        todayStats: {
          ...state.todayStats,
          waterIntake: Math.max(0, state.todayStats.waterIntake - 1),
        },
      };
    default:
      return state;
  }
}

const FitnessContext = createContext<FitnessContextValue | undefined>(undefined);

export function FitnessProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(fitnessReducer, undefined, getInitialState);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const addWorkout = (workout: Omit<Workout, 'id'>) => {
    const id = `w_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    dispatch({ type: 'ADD_WORKOUT', payload: { ...workout, id } });
  };

  const deleteWorkout = (id: string) => {
    dispatch({ type: 'DELETE_WORKOUT', payload: id });
  };

  const updateGoals = (goals: Partial<DailyGoals>) => {
    dispatch({ type: 'UPDATE_GOALS', payload: goals });
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
  };

  const incrementWater = () => dispatch({ type: 'INCREMENT_WATER' });
  const decrementWater = () => dispatch({ type: 'DECREMENT_WATER' });

  return (
    <FitnessContext.Provider
      value={{
        ...state,
        dispatch,
        addWorkout,
        deleteWorkout,
        updateGoals,
        updateProfile,
        incrementWater,
        decrementWater,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
}

export function useFitness() {
  const context = useContext(FitnessContext);
  if (!context) throw new Error('useFitness must be used within a FitnessProvider');
  return context;
}
