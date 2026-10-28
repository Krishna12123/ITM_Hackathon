import React from 'react';

export default function Navbar({ currentView, setCurrentView, onOpenTrip, tripCount = 0 }) {
  const views = [
    { id: 'experiences', label: 'Experiences' },
    { id: 'place-details', label: 'Place Details' },
    { id: 'planner', label: 'Itinerary Planner' },
    { id: 'itinerary', label: 'Smart Itinerary' },
    { id: 'route_budget', label: 'Route & Budget' },
    { id: 'contribute', label: 'Share a Gem' },
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div 
          onClick={() => setCurrentView('experiences')}
          className="flex items-center gap-2.5 shrink-0 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[20px]">explore</span>
          </div>
          <div>
            <span className="font-display font-bold text-lg text-primary tracking-tight block leading-tight">
              YatraSaathi
            </span>
            <span className="text-[10px] text-on-surface-variant font-medium hidden sm:block">
              TerraVenture
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
          {views.map((v) => {
            const isActive = currentView === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setCurrentView(v.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Trip / Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* My Trip Trigger */}
          <button
            onClick={onOpenTrip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface border border-outline-variant/40 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">luggage</span>
            <span className="hidden sm:inline">My Trip</span>
            {tripCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                {tripCount}
              </span>
            )}
          </button>

          {/* Profile Button */}
          <button
            onClick={() => setCurrentView('profile')}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              currentView === 'profile'
                ? 'bg-primary text-white ring-2 ring-primary/30'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/40'
            }`}
            title="Profile & Moderation"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>

      </div>
    </header>
  );
}
