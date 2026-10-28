import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Home,
  Globe,
  Sparkles,
  MapPin,
  Calendar,
  Cpu,
  Route,
  PlusCircle,
  Heart,
  Bell,
  User,
  Luggage,
  Menu,
  X,
  ChevronRight,
  CheckCircle2,
  Clock
} from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'Route Verified',
    desc: 'Bundelkhand Heritage Food Walk route verified by council.',
    time: '12m ago',
    unread: true
  },
  {
    id: 2,
    title: 'New Hidden Gem',
    desc: 'Betwa Rapids Chhattri added to Community Trails.',
    time: '1h ago',
    unread: true
  }
];

export default function Navbar({
  activeTab,
  setActiveTab,
  tripItems = [],
  favoritesCount = 0,
  onOpenTrip
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const notifRef = useRef(null);

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    setIsNotificationsOpen(false);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Navigation Items defined in strict order requested
  const primaryNavItems = [
    { id: 'home', label: 'Home', icon: Home, action: () => handleNavClick('experiences') },
    { id: 'explore', label: 'Explore', icon: Globe, action: () => handleNavClick('experiences') },
    { id: 'experiences', label: 'Experiences', icon: Sparkles, action: () => handleNavClick('experiences') },
    { id: 'place-details', label: 'Place Details', icon: MapPin, action: () => handleNavClick('place-details') },
    { id: 'planner', label: 'AI Planner', icon: Calendar, action: () => handleNavClick('planner') },
    {
      id: 'itinerary',
      label: 'Smart Itinerary',
      icon: Cpu,
      action: () => handleNavClick('itinerary'),
      isPrimaryAction: true // Distinctive Orange Highlight
    },
    { id: 'route_budget', label: 'Route & Budget', icon: Route, action: () => handleNavClick('route_budget') },
    { id: 'contribute', label: 'Share a Gem', icon: PlusCircle, action: () => handleNavClick('contribute') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-xs animate-slideDown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
          
          {/* =============================================================== */}
          {/* 1. BRANDING & LOGO                                             */}
          {/* =============================================================== */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0 group select-none"
            onClick={() => handleNavClick('experiences')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F45B0B] group-hover:bg-[#C94708] flex items-center justify-center text-white shadow-sm transition-all duration-300 group-hover:scale-105 active:scale-95">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2] animate-profile-enter" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display font-extrabold text-lg sm:text-xl text-[#172033] tracking-tight">
                  Yatra<span className="text-[#F45B0B]">Saathi</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#F45B0B]/10 text-[#F45B0B] border border-[#F45B0B]/20 hidden xs:inline-block">
                  India
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#64748B] font-medium leading-none hidden sm:block">
                Community-Powered Tourism
              </p>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 2. DESKTOP NAVIGATION (Clean, Horizontal & Well-Spaced)        */}
          {/* =============================================================== */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id ||
                (item.id === 'home' && activeTab === 'experiences') ||
                (item.id === 'explore' && activeTab === 'state-details');

              if (item.isPrimaryAction) {
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 shadow-xs focus-visible:ring-2 focus-visible:ring-[#F45B0B] focus-visible:outline-none ${
                      isActive
                        ? 'bg-[#C94708] text-white ring-2 ring-[#F45B0B]/40'
                        : 'bg-[#F45B0B] text-white hover:bg-[#C94708]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs transition-all duration-150 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#F45B0B] focus-visible:outline-none ${
                    isActive
                      ? 'text-[#F45B0B] font-bold bg-[#FFF9F1] border-b-2 border-[#F45B0B] rounded-b-none'
                      : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F7F8FC]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F45B0B]' : 'text-[#64748B]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Compact Tablet-Desktop Nav (1024px to 1279px) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1 text-xs font-semibold">
            {primaryNavItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`p-2 rounded-lg transition-colors ${
                    isActive ? 'text-[#F45B0B] bg-[#FFF9F1]' : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F7F8FC]'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
            <button
              onClick={() => handleNavClick('itinerary')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F45B0B] text-white font-bold text-xs shadow-xs hover:bg-[#C94708]"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Itinerary</span>
            </button>
          </nav>

          {/* =============================================================== */}
          {/* 3. RIGHT UTILITIES: SAVED, NOTIFICATIONS, MY TRIP, PROFILE    */}
          {/* =============================================================== */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Saved Places Heart Trigger */}
            <button
              onClick={() => handleNavClick('profile')}
              title={`Saved Places (${favoritesCount})`}
              className={`relative p-2 rounded-full transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#F45B0B] focus-visible:outline-none ${
                activeTab === 'profile'
                  ? 'bg-[#FFF9F1] text-[#F45B0B]'
                  : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F7F8FC]'
              }`}
              aria-label="View Saved Places"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'text-[#F45B0B] fill-[#F45B0B]' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#F45B0B] text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-xs">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Notifications Trigger & Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotificationsOpen((prev) => !prev)}
                title="Notifications"
                className={`relative p-2 rounded-full transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#F45B0B] focus-visible:outline-none ${
                  isNotificationsOpen
                    ? 'bg-[#FFF9F1] text-[#F45B0B]'
                    : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F7F8FC]'
                }`}
                aria-label="Community Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F45B0B] ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* Notifications Popover */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-4 z-50 animate-scaleIn">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-[#F45B0B]" />
                      <span className="font-display font-bold text-sm text-[#172033]">
                        Notifications
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] font-semibold text-[#F45B0B] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border text-xs transition-colors ${
                          n.unread
                            ? 'bg-[#FFF9F1] border-[#FED7AA]'
                            : 'bg-white border-[#E5E7EB]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-[#172033]">{n.title}</span>
                          <span className="text-[10px] text-[#64748B]">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-[#64748B] leading-relaxed">
                          {n.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#E5E7EB] mt-3 text-center">
                    <span className="text-[10px] text-[#64748B]">
                      Verified by YatraSaathi Tourism Council
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* My Trip Drawer Trigger */}
            <button
              onClick={onOpenTrip}
              className="relative flex items-center gap-1.5 sm:gap-2 bg-[#F7F8FC] hover:bg-[#FFF9F1] hover:border-[#F45B0B] border border-[#E5E7EB] text-[#172033] px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 shadow-xs"
              title="Open Planned Trip Queue"
            >
              <Luggage className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F45B0B]" />
              <span className="hidden sm:inline">My Trip</span>
              {tripItems.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#F45B0B] text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {tripItems.length}
                </span>
              )}
            </button>

            {/* Profile / Account Trigger */}
            <button
              onClick={() => handleNavClick('profile')}
              title="Profile & Role Dashboard"
              className={`p-1.5 sm:p-2 rounded-full transition-all duration-150 border focus-visible:ring-2 focus-visible:ring-[#F45B0B] focus-visible:outline-none ${
                activeTab === 'profile'
                  ? 'bg-[#F45B0B] text-white border-[#F45B0B] shadow-xs'
                  : 'bg-white hover:bg-[#F7F8FC] text-[#172033] border-[#E5E7EB] hover:border-[#F45B0B]'
              }`}
              aria-label="User Profile"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Mobile / Tablet Menu Button Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-xl text-[#172033] hover:bg-[#F7F8FC] border border-[#E5E7EB] lg:hidden focus-visible:ring-2 focus-visible:ring-[#F45B0B] focus-visible:outline-none transition-colors"
              aria-label={isMobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#C2413B]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =============================================================== */}
      {/* 4. RESPONSIVE MOBILE & TABLET NAVIGATION DRAWER                 */}
      {/* =============================================================== */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 sm:top-18 bg-white border-b border-[#E5E7EB] shadow-2xl z-50 max-h-[calc(100vh-4.5rem)] overflow-y-auto animate-slideDown">
          <div className="p-4 sm:p-6 space-y-4">
            
            {/* Quick Status Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFF9F1] border border-[#FED7AA]">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#F45B0B]" />
                <span className="text-xs font-bold text-[#172033]">
                  YatraSaathi Explorer
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#F45B0B] border border-[#FED7AA]">
                {favoritesCount} Saved Places
              </span>
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={`flex items-center justify-between w-full p-3 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-[0.98] ${
                      item.isPrimaryAction
                        ? 'bg-[#F45B0B] text-white font-bold shadow-xs'
                        : isActive
                        ? 'bg-[#FFF9F1] text-[#F45B0B] font-bold border border-[#FED7AA]'
                        : 'bg-[#F7F8FC] text-[#172033] hover:bg-white border border-[#E5E7EB]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${item.isPrimaryAction ? 'text-white' : isActive ? 'text-[#F45B0B]' : 'text-[#64748B]'}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${item.isPrimaryAction ? 'text-white' : 'text-[#94A3B8]'}`} />
                  </button>
                );
              })}

              {/* Profile Shortcut */}
              <button
                onClick={() => handleNavClick('profile')}
                className={`flex items-center justify-between w-full p-3 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-[0.98] ${
                  activeTab === 'profile'
                    ? 'bg-[#FFF9F1] text-[#F45B0B] font-bold border border-[#FED7AA]'
                    : 'bg-[#F7F8FC] text-[#172033] hover:bg-white border border-[#E5E7EB]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-[#F45B0B]" />
                  <span>Profile & Admin Dashboard</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>
            </div>

            {/* Bottom Community Footer info in drawer */}
            <div className="pt-3 border-t border-[#E5E7EB] text-center">
              <p className="text-[11px] text-[#64748B]">
                Discover authentic India • Handcrafted itineraries & community stories
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
