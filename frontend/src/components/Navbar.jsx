import React from 'react';
import { Compass, MapPin, Sparkles, Luggage, Heart, PlusCircle, User, Calendar, Route, Cpu } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, tripItems = [], favoritesCount = 0, onOpenTrip }) {
  const navItems = [
    { id: 'experiences', label: 'Experiences', icon: Sparkles },
    { id: 'place-details', label: 'Place Details', icon: MapPin },
    { id: 'planner', label: 'AI Planner', icon: Calendar },
    { id: 'itinerary', label: 'Smart Itinerary', icon: Cpu },
    { id: 'route_budget', label: 'Route & Budget', icon: Route },
    { id: 'contribute', label: 'Share a Gem', icon: PlusCircle },
  ];

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border-subtle shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('experiences')}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-level-1">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl text-slate-900 tracking-tight">
                  YatraSaathi
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  TerraVenture
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Community-Powered Tourism</p>
            </div>
          </div>

          {/* Center Navigation Tabs (scrollable on tablet/mobile) */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-[50vw] sm:max-w-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-full text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-primary text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-subtle'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: My Trip Drawer Trigger, Favorites, & Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-1 text-xs text-slate-500 bg-subtle px-3 py-1.5 rounded-full border border-border-subtle">
              <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
              <span>{favoritesCount} saved</span>
            </div>

            <button
              onClick={onOpenTrip}
              className="relative flex items-center gap-2 bg-canvas hover:bg-subtle border border-border-subtle text-slate-900 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all hover:border-primary active:scale-98 shadow-sm"
            >
              <Luggage className="w-4 h-4 text-primary" />
              <span className="hidden xs:inline">My Trip</span>
              {tripItems.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {tripItems.length}
                </span>
              )}
            </button>

            {/* Profile / Account Trigger */}
            <button
              onClick={() => setActiveTab('profile')}
              title="Profile & Moderation"
              className={`p-2 rounded-full transition-all border ${
                activeTab === 'profile'
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-canvas hover:bg-subtle text-slate-700 border-border-subtle hover:border-primary'
              }`}
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
