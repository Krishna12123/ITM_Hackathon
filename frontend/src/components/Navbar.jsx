import React from 'react';

export default function Navbar({ currentView, setCurrentView }) {
  const views = [
    { id: 'planner', label: 'Itinerary Planner' },
    { id: 'generating', label: 'AI Synthesis' },
    { id: 'itinerary', label: 'Smart Itinerary' },
    { id: 'route_budget', label: 'Route & Budget' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
        
        {/* Brand */}
        <div 
          onClick={() => setCurrentView('planner')}
          className="flex items-center gap-3 shrink-0 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-[24px]">terrain</span>
          </div>
          <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
            YatraSathi
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {views.map((v) => {
            const isActive = currentView === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setCurrentView(v.id)}
                className={`px-3.5 py-2 rounded-lg font-label-lg text-label-lg transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Search */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative hidden sm:block w-48 xl:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
              search
            </span>
            <input
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-outline outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-fixed transition-all"
              placeholder="Search destinations, routes..."
              type="text"
            />
          </div>
          <button
            className="w-10 h-10 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors relative"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>

      </div>
    </header>
  );
}
