export interface Workout {
  id: string;
  type: string;
  name: string;
  duration: number; // minutes
  calories: number;
  date: string; // ISO string
  intensity: 'low' | 'moderate' | 'high';
  icon: string;
}

export interface DailyGoals {
  steps: number;
  calories: number;
  water: number; // glasses
  activeMinutes: number;
}

export interface DailyStats {
  date: string;
  steps: number;
  caloriesBurned: number;
  waterIntake: number;
  activeMinutes: number;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  avatar: string;
}

const today = new Date();
const formatDate = (daysAgo: number): string => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

export const workoutTypes = [
  { type: 'running', name: 'Running', icon: 'footprints', calPerMin: 10 },
  { type: 'cycling', name: 'Cycling', icon: 'bike', calPerMin: 8 },
  { type: 'swimming', name: 'Swimming', icon: 'waves', calPerMin: 11 },
  { type: 'weights', name: 'Weight Training', icon: 'dumbbell', calPerMin: 7 },
  { type: 'yoga', name: 'Yoga', icon: 'heart', calPerMin: 4 },
  { type: 'hiit', name: 'HIIT', icon: 'zap', calPerMin: 13 },
  { type: 'walking', name: 'Walking', icon: 'footprints', calPerMin: 5 },
  { type: 'stretching', name: 'Stretching', icon: 'move', calPerMin: 3 },
];

export const defaultWorkouts: Workout[] = [
  { id: 'w1', type: 'running', name: 'Morning Run', duration: 35, calories: 350, date: formatDate(0), intensity: 'high', icon: 'footprints' },
  { id: 'w2', type: 'yoga', name: 'Sunrise Yoga', duration: 45, calories: 180, date: formatDate(0), intensity: 'low', icon: 'heart' },
  { id: 'w3', type: 'weights', name: 'Upper Body', duration: 50, calories: 350, date: formatDate(1), intensity: 'high', icon: 'dumbbell' },
  { id: 'w4', type: 'cycling', name: 'Evening Ride', duration: 40, calories: 320, date: formatDate(1), intensity: 'moderate', icon: 'bike' },
  { id: 'w5', type: 'hiit', name: 'Tabata Session', duration: 25, calories: 325, date: formatDate(2), intensity: 'high', icon: 'zap' },
  { id: 'w6', type: 'swimming', name: 'Pool Laps', duration: 30, calories: 330, date: formatDate(2), intensity: 'moderate', icon: 'waves' },
  { id: 'w7', type: 'walking', name: 'Lunch Walk', duration: 30, calories: 150, date: formatDate(3), intensity: 'low', icon: 'footprints' },
  { id: 'w8', type: 'weights', name: 'Leg Day', duration: 55, calories: 385, date: formatDate(3), intensity: 'high', icon: 'dumbbell' },
  { id: 'w9', type: 'running', name: 'Interval Run', duration: 30, calories: 300, date: formatDate(4), intensity: 'high', icon: 'footprints' },
  { id: 'w10', type: 'yoga', name: 'Power Yoga', duration: 60, calories: 240, date: formatDate(4), intensity: 'moderate', icon: 'heart' },
  { id: 'w11', type: 'cycling', name: 'Hill Climb', duration: 45, calories: 360, date: formatDate(5), intensity: 'high', icon: 'bike' },
  { id: 'w12', type: 'stretching', name: 'Recovery Stretch', duration: 20, calories: 60, date: formatDate(5), intensity: 'low', icon: 'move' },
  { id: 'w13', type: 'hiit', name: 'CrossFit WOD', duration: 35, calories: 455, date: formatDate(6), intensity: 'high', icon: 'zap' },
  { id: 'w14', type: 'swimming', name: 'Open Water', duration: 40, calories: 440, date: formatDate(6), intensity: 'high', icon: 'waves' },
  { id: 'w15', type: 'walking', name: 'Evening Stroll', duration: 25, calories: 125, date: formatDate(0), intensity: 'low', icon: 'footprints' },
];

export const defaultGoals: DailyGoals = {
  steps: 10000,
  calories: 500,
  water: 8,
  activeMinutes: 60,
};

export const defaultWeeklyStats: DailyStats[] = [
  { date: formatDate(6), steps: 8540, caloriesBurned: 620, waterIntake: 7, activeMinutes: 55 },
  { date: formatDate(5), steps: 11200, caloriesBurned: 480, waterIntake: 8, activeMinutes: 45 },
  { date: formatDate(4), steps: 9800, caloriesBurned: 540, waterIntake: 6, activeMinutes: 65 },
  { date: formatDate(3), steps: 7300, caloriesBurned: 430, waterIntake: 9, activeMinutes: 40 },
  { date: formatDate(2), steps: 12500, caloriesBurned: 710, waterIntake: 8, activeMinutes: 80 },
  { date: formatDate(1), steps: 10100, caloriesBurned: 550, waterIntake: 7, activeMinutes: 60 },
  { date: formatDate(0), steps: 6200, caloriesBurned: 380, waterIntake: 5, activeMinutes: 35 },
];

export const defaultProfile: UserProfile = {
  name: 'Alex Rivera',
  age: 28,
  weight: 74,
  height: 178,
  avatar: '',
};
