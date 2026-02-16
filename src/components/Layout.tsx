import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', label: 'Overview' },
  { to: '/workouts', label: 'Workouts' },
  { to: '/progress', label: 'Progress' },
  { to: '/goals', label: 'Goals' },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-[#0f1117]/95 backdrop-blur-sm border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-1 h-11 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.to === '/'}
                className={({ isActive }) =>
                  `shrink-0 px-3 py-1 text-[13px] rounded-md transition-colors ${
                    isActive
                      ? 'text-white bg-slate-800'
                      : 'text-slate-500 hover:text-slate-300'
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
