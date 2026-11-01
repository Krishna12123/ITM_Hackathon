import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Home,
  Globe,
  Sparkles,
  MapPin,
  Calendar,
  Route,
  PlusCircle,
  Heart,
  Bell,
  User,
  Luggage,
  Menu,
  X,
  ChevronRight,
  LogIn,
  LogOut,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { getCurrentUser, signOutSession, hasAdminPrivileges } from '../services/authService';

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
  onOpenTrip,
  onShowToast
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Authentication state
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const isAuthenticated = Boolean(currentUser);
  const isAdmin = hasAdminPrivileges(currentUser);

  // Listen to auth state broadcasts
  useEffect(() => {
    const handleAuthChange = (e) => {
      if (e.detail) {
        setCurrentUser(e.detail.user || null);
      } else {
        setCurrentUser(getCurrentUser());
      }
    };

    window.addEventListener('yaatrasaathi_auth_change', handleAuthChange);
    return () => window.removeEventListener('yaatrasaathi_auth_change', handleAuthChange);
  }, []);

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
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
    setIsUserMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOutSession();
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    if (onShowToast) onShowToast('Signed out successfully. Switched to guest mode.');
    setActiveTab('home');
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Navigation Items defined in strict order requested
  const primaryNavItems = [
    { id: 'home', label: 'Home', icon: Home, action: () => handleNavClick('home') },
    { id: 'explore', label: 'Explore', icon: Globe, action: () => handleNavClick('explore') },
    { id: 'experiences', label: 'Experiences', icon: Sparkles, action: () => handleNavClick('experiences') },
    { id: 'place-details', label: 'Place Details', icon: MapPin, action: () => handleNavClick('place-details') },
    { id: 'planner', label: 'AI Trip Planner', icon: Calendar, action: () => handleNavClick('planner') },
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
            onClick={() => handleNavClick('home')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F36B21] group-hover:bg-[#D94E0B] flex items-center justify-center text-white shadow-sm transition-all duration-300 group-hover:scale-105 active:scale-95">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2] animate-profile-enter" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-lg sm:text-xl text-[#38291F] tracking-tight group-hover:text-[#F36B21] transition-colors">
                  YaatraSaathi
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-[#FFF8EF] text-[#D94E0B] border border-[#E7C9A5] rounded-full hidden sm:inline-block">
                  India
                </span>
              </div>
              <span className="text-[10px] font-medium text-[#64748B] hidden sm:block -mt-0.5 tracking-tight">
                Community-Powered Tourism
              </span>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 2. PRIMARY NAVIGATION LINKS (DESKTOP)                          */}
          {/* =============================================================== */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id ||
                (item.id === 'explore' && activeTab === 'state-details');

              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs transition-all duration-150 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#F36B21] focus-visible:outline-none ${
                    isActive
                      ? 'text-[#F36B21] font-bold bg-[#FFF8EF] border-b-2 border-[#F36B21] rounded-b-none'
                      : 'text-[#64748B] hover:text-[#38291F] hover:bg-[#F7F8FC]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F36B21]' : 'text-[#64748B]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Compact Tablet-Desktop Nav (1024px to 1279px) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1 text-xs font-semibold">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id ||
                (item.id === 'explore' && activeTab === 'state-details');
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`p-2 rounded-lg transition-colors ${
                    isActive ? 'text-[#F36B21] bg-[#FFF8EF]' : 'text-[#64748B] hover:text-[#38291F] hover:bg-[#F7F8FC]'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </nav>

          {/* =============================================================== */}
          {/* 3. RIGHT UTILITIES: SAVED, NOTIFICATIONS, MY TRIP, AUTH/PROFILE */}
          {/* =============================================================== */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Saved Places Heart Trigger */}
            <button
              onClick={() => handleNavClick(isAuthenticated ? 'profile' : 'login')}
              title={`Saved Places (${favoritesCount})`}
              className={`relative p-2 rounded-full transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#F36B21] focus-visible:outline-none ${
                activeTab === 'profile'
                  ? 'bg-[#FFF8EF] text-[#F36B21]'
                  : 'text-[#64748B] hover:text-[#38291F] hover:bg-[#F7F8FC]'
              }`}
              aria-label="View Saved Places"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'text-[#F36B21] fill-[#F36B21]' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#F36B21] text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-xs">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Notifications Trigger & Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotificationsOpen((prev) => !prev)}
                title="Notifications"
                className={`relative p-2 rounded-full transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#F36B21] focus-visible:outline-none ${
                  isNotificationsOpen
                    ? 'bg-[#FFF8EF] text-[#F36B21]'
                    : 'text-[#64748B] hover:text-[#38291F] hover:bg-[#F7F8FC]'
                }`}
                aria-label="Community Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F36B21] ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* Notifications Popover */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-4 z-50 animate-scaleIn">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-[#F36B21]" />
                      <span className="font-display font-bold text-sm text-[#38291F]">
                        Notifications
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] font-semibold text-[#F36B21] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border text-xs transition-colors ${
                          n.unread
                            ? 'bg-[#FFF8EF] border-[#E7C9A5]/60'
                            : 'bg-white border-[#E5E7EB]'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-[#38291F]">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-[#64748B] font-normal flex items-center gap-0.5">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] mt-1 leading-snug">
                          {n.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#E5E7EB] mt-3 text-center">
                    <span className="text-[10px] text-[#64748B]">
                      Verified by YaatraSaathi Tourism Council
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* My Trip Drawer Trigger */}
            <button
              onClick={onOpenTrip}
              className="relative flex items-center gap-1.5 sm:gap-2 bg-[#F7F8FC] hover:bg-[#FFF8EF] hover:border-[#F36B21] border border-[#E5E7EB] text-[#38291F] px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 shadow-xs"
              title="Open Planned Trip Queue"
            >
              <Luggage className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F36B21]" />
              <span className="hidden sm:inline">My Trip</span>
              {tripItems.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#F36B21] text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {tripItems.length}
                </span>
              )}
            </button>

            {/* =========================================================== */}
            {/* AUTHENTICATION INTEGRATION                                  */}
            {/* =========================================================== */}
            {!isAuthenticated ? (
              /* BEFORE LOGIN: Show "Sign In" Option */
              <button
                onClick={() => handleNavClick('login')}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#D94E0B] to-[#F36B21] hover:from-[#c44307] hover:to-[#e05e19] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold shadow-xs hover:shadow transition-all duration-150 active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            ) : (
              /* AFTER LOGIN: Profile Pill + Dropdown with ADMIN Badge & Logout */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#F36B21] ${
                    isAdmin
                      ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-100/70'
                      : 'bg-[#FFF8EF] border-[#E7C9A5] hover:bg-[#F2E4D2]'
                  }`}
                  aria-label="User account menu"
                >
                  <img
                    src={
                      currentUser.avatar ||
                      (isAdmin
                        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
                        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80')
                    }
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-white shadow-xs shrink-0"
                  />
                  
                  <div className="flex items-center gap-1.5 hidden md:flex">
                    <span className="text-xs font-bold text-[#38291F] max-w-[100px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    {isAdmin && (
                      <span className="px-1.5 py-0.2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-[9px] uppercase tracking-wider rounded shadow-xs">
                        Admin
                      </span>
                    )}
                  </div>

                  <ChevronDown className="w-3 h-3 text-[#64748B]" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-2 z-50 animate-scaleIn">
                    {/* User Identity Header */}
                    <div className="px-3 py-2 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#38291F] truncate">{currentUser.name}</p>
                        {isAdmin && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 font-bold text-[9px] uppercase rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#64748B] truncate mt-0.5">{currentUser.email}</p>
                    </div>

                    {/* Navigation Items */}
                    <div className="py-1">
                      <button
                        onClick={() => handleNavClick('profile')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#38291F] hover:bg-[#FFF8EF] hover:text-[#F36B21] rounded-xl transition-colors text-left"
                      >
                        {isAdmin ? <ShieldCheck className="w-4 h-4 text-amber-600" /> : <User className="w-4 h-4 text-[#F36B21]" />}
                        <span>{isAdmin ? 'Admin Dashboard' : 'My Account & Saved'}</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('contribute')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#38291F] hover:bg-[#FFF8EF] hover:text-[#F36B21] rounded-xl transition-colors text-left"
                      >
                        <PlusCircle className="w-4 h-4 text-[#64748B]" />
                        <span>Share a Gem</span>
                      </button>
                    </div>

                    {/* Intuitive Logout Option */}
                    <div className="pt-1 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile / Tablet Menu Button Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-xl text-[#38291F] hover:bg-[#F7F8FC] border border-[#E5E7EB] lg:hidden focus-visible:ring-2 focus-visible:ring-[#F36B21] focus-visible:outline-none transition-colors"
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
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFF8EF] border border-[#E7C9A5]/50">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#F36B21]" />
                <span className="text-xs font-bold text-[#38291F]">
                  {currentUser ? (isAdmin ? 'Admin Portal Active' : `Hi, ${currentUser.name.split(' ')[0]}`) : 'YaatraSaathi Explorer'}
                </span>
              </div>
              {isAdmin && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  ADMIN
                </span>
              )}
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  activeTab === item.id ||
                  (item.id === 'explore' && activeTab === 'state-details');

                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={`flex items-center justify-between w-full p-3 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-[0.98] ${
                      item.isPrimaryAction
                        ? 'bg-[#F36B21] text-white font-bold shadow-xs'
                        : isActive
                        ? 'bg-[#FFF8EF] text-[#F36B21] font-bold border border-[#F2E4D2]'
                        : 'bg-[#F7F8FC] text-[#38291F] hover:bg-white border border-[#E5E7EB]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${item.isPrimaryAction ? 'text-white' : isActive ? 'text-[#F36B21]' : 'text-[#64748B]'}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${item.isPrimaryAction ? 'text-white' : 'text-[#94A3B8]'}`} />
                  </button>
                );
              })}

              {/* Profile or Sign-In in Mobile Drawer */}
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleNavClick('profile')}
                    className={`flex items-center justify-between w-full p-3 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-[0.98] ${
                      activeTab === 'profile'
                        ? 'bg-[#FFF8EF] text-[#F36B21] font-bold border border-[#F2E4D2]'
                        : 'bg-[#F7F8FC] text-[#38291F] hover:bg-white border border-[#E5E7EB]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-[#F36B21]" />
                      <span>{isAdmin ? 'Admin Dashboard' : 'Profile & Saved'}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-between w-full p-3 rounded-xl text-xs font-semibold text-red-600 bg-red-50 border border-red-200 transition-all duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Log Out</span>
                    </div>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavClick('login')}
                  className="flex items-center justify-between w-full p-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D94E0B] to-[#F36B21] shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to YaatraSaathi</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
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
