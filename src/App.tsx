import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FitnessProvider } from './context/FitnessContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Progress from './pages/Progress';
import Goals from './pages/Goals';

export default function App() {
  return (
    <HashRouter>
      <FitnessProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </FitnessProvider>
    </HashRouter>
  );
}
