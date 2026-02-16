import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  TrendingUp,
  Target,
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
            ? 'text-teal-500'
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
    return 'Tracker';
  })();

  return (
    <div className="flex min-h-screen">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-56 bg-[#181b24] border-r border-slate-800/60 z-30">
        {/* Brand */}
        <div className="flex items-center gap-2 px-5 h-14 border-b border-slate-800/60">
          <Dumbbell size={18} className="text-teal-500" />
          <span className="text-sm font-semibold text-white tracking-tight">
            Tracker
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-0.5 px-3 py-4">
          {navItems.map((item) => (
            <SidebarLink key={item.to} {...item} />
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-slate-800/60">
          <p className="text-[11px] text-slate-600 text-center">
            Built with React · 2026
          </p>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 lg:ml-56 pb-20 lg:pb-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-[#0f1117]/90 backdrop-blur-sm border-b border-slate-800/60">
          <div className="flex items-center h-14 px-4 sm:px-6 lg:px-8">
            {/* Mobile Brand */}
            <div className="flex lg:hidden items-center gap-2 mr-auto">
              <Dumbbell size={16} className="text-teal-500" />
              <span className="text-sm font-semibold text-white">
                Tracker
              </span>
            </div>

            <h1 className="hidden lg:block text-sm font-medium text-slate-300">
              {pageTitle}
            </h1>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#181b24] border-t border-slate-800/60">
        <div className="flex items-center justify-around h-14 px-2">
          {navItems.map((item) => (
            <BottomLink key={item.to} {...item} />
          ))}
        </div>
      </nav>
    </div>
  );
}
