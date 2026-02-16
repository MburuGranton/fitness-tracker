import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  TrendingUp,
  Target,
  Activity,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/workouts', label: 'Workouts', icon: Dumbbell },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/goals', label: 'Goals', icon: Target },
];

function SidebarLink({ to, label, icon: Icon }: (typeof navItems)[0]) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        isActive ? 'nav-item-active' : 'nav-item'
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
}

function BottomLink({ to, label, icon: Icon }: (typeof navItems)[0]) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors duration-150 ${
          isActive
            ? 'text-primary-400'
            : 'text-slate-500 hover:text-slate-300'
        }`
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  const pageTitle = (() => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/workouts') return 'Workouts';
    if (path === '/progress') return 'Progress';
    if (path === '/goals') return 'Goals';
    return 'FitPulse';
  })();

  return (
    <div className="flex min-h-screen">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-surface-900 border-r border-surface-700 z-30">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-surface-700">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-400 flex items-center justify-center">
            <Activity size={20} className="text-white" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight gradient-text">
            FitPulse
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
          {navItems.map((item) => (
            <SidebarLink key={item.to} {...item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-surface-700">
          <p className="text-[11px] text-slate-500 text-center">
            © 2026 FitPulse · Portfolio Demo
          </p>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-surface-950/80 border-b border-surface-700">
          <div className="flex items-center h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile Brand */}
            <div className="flex lg:hidden items-center gap-2 mr-auto">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-400 flex items-center justify-center">
                <Activity size={16} className="text-white" />
              </div>
              <span className="font-heading text-lg font-bold gradient-text">
                FitPulse
              </span>
            </div>

            <h1 className="hidden lg:block font-heading text-lg font-semibold text-white">
              {pageTitle}
            </h1>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-surface-900/95 backdrop-blur-xl border-t border-surface-700">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => (
            <BottomLink key={item.to} {...item} />
          ))}
        </div>
      </nav>
    </div>
  );
}
