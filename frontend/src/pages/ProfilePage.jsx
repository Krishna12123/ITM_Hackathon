import React, { useState, useEffect, useMemo } from 'react';
import {
  User,
  MapPin,
  Heart,
  Luggage,
  Sparkles,
  ShieldCheck,
  Edit3,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  Trash2,
  ArrowRight,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  LogOut,
  RefreshCw,
  Server,
  Database,
  Lock,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { MOCK_DESTINATIONS, MOCK_EXPERIENCES } from '../data/mockData';
import {
  getAuthenticatedSession,
  setActiveSessionRole,
  signOutSession,
  hasAdminPrivileges,
  DEFAULT_PROFILES
} from '../services/authService';

// Initial Mock Contributions submitted by user
const INITIAL_CONTRIBUTIONS = [
  {
    id: 'contrib-1',
    title: 'Hidden Chhattri by the Betwa Rapids',
    category: 'Hidden Place',
    location: 'Orchha Outskirts, Madhya Pradesh',
    date: '24 Oct 2026',
    status: 'Approved',
    description: 'An uncrowded 17th-century cenotaph tucked between granite boulders with ancient banyan roots growing through stone filigree.',
    feedback: 'Verified by Bundelkhand Tourism Elder council.'
  },
  {
    id: 'contrib-2',
    title: 'Heritage Roasted Bhutte ka Kees Stall',
    category: 'Local Food',
    location: 'Temple Lane, Orchha',
    date: '26 Oct 2026',
    status: 'Approved',
    description: 'Family-run cart serving hot grated corn cooked in spiced milk with coconut slivers, running for over 45 years.',
    feedback: 'Approved for the Heritage Food Walk route.'
  },
  {
    id: 'contrib-3',
    title: 'Alipura Village Earthen Terracotta Kiln',
    category: 'Arts & Crafts',
    location: 'Alipura Cluster, Bundelkhand',
    date: '27 Oct 2026',
    status: 'Pending',
    description: 'Traditional open-pit pottery workshop producing sacred votive animal figures and porous summer water vessels.',
    feedback: 'Under review by community moderation team.'
  },
  {
    id: 'contrib-4',
    title: 'Secret Sunset Viewpoint at Taraigram',
    category: 'Nature & Adventure',
    location: 'Taraigram Ridge, Madhya Pradesh',
    date: '27 Oct 2026',
    status: 'Needs Changes',
    description: 'A rocky ridge overlook offering panoramic views of the river sanctuary and distant temple spires.',
    feedback: 'Moderator note: Please specify safety precautions and if evening lighting is available along the trail.'
  }
];

// Initial Submissions in the Moderation Queue
const INITIAL_MODERATION_QUEUE = [
  {
    id: 'mod-1',
    title: 'Old Town Heritage Brass Bell Artisan Workshop',
    category: 'Arts & Crafts',
    location: 'Jorhat Town, Assam',
    submittedBy: 'Pranjal Saikia',
    date: '27 Oct 2026',
    status: 'Pending',
    description: 'One of the last traditional bell-metal forging guilds using lost-wax casting methods in Upper Assam.',
    landmark: 'Behind Old Bazaar Namghar',
    notes: 'Artisans welcome travelers for 1-hour demonstrations without commercial pressure.',
    hasPhoto: true
  },
  {
    id: 'mod-2',
    title: 'Kavita Devi Traditional Malpua & Rabdi Hearth',
    category: 'Local Food',
    location: 'Datia Heritage Gali, Madhya Pradesh',
    submittedBy: 'Sunil Sen',
    date: '27 Oct 2026',
    status: 'Pending',
    description: 'Slow-simmered rabdi reduced over firewood for 6 hours, paired with crisp saffron malpuas.',
    landmark: 'Opposite Pitambara Peeth North Gate',
    notes: 'Only open from 5:00 PM to 8:30 PM daily.',
    hasPhoto: true
  },
  {
    id: 'mod-3',
    title: 'Keviletuo Terrace Paddy Lookout',
    category: 'Village Experience',
    location: 'Khonoma Village, Nagaland',
    submittedBy: 'Imti Longkumer',
    date: '26 Oct 2026',
    status: 'Pending',
    description: 'Community-maintained stone gazebo overlooking organic alder tree terrace farming.',
    landmark: 'Upper Morung path, near village gate 2',
    notes: 'Requires walking 15 minutes on paved village steps.',
    hasPhoto: false
  }
];

export default function ProfilePage({
  favorites = [],
  onToggleFavorite,
  tripItems = [],
  onToggleTrip,
  onNavigateToPlace,
  onNavigateToExperiences,
  onShowToast
}) {
  // 1. Authenticated Session & Role State
  const [sessionLoading, setSessionLoading] = useState(true);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [userRole, setUserRole] = useState('user'); // 'user' | 'admin'
  const [sessionSource, setSessionSource] = useState('session_store');

  // 2. Active Tab
  const [activeTab, setActiveTab] = useState('contributions'); // 'contributions' | 'saved' | 'experiences' | 'settings' | 'moderation' | 'history' | 'system'

  // 3. Edit Profile Modal State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    bio: ''
  });

  // 4. Contributions State
  const [myContributions, setMyContributions] = useState(INITIAL_CONTRIBUTIONS);
  const [contributionSearch, setContributionSearch] = useState('');
  const [contributionStatusFilter, setContributionStatusFilter] = useState('All');

  // 5. Moderation Queue State (Admin Only)
  const [moderationQueue, setModerationQueue] = useState(INITIAL_MODERATION_QUEUE);
  const [moderationSearch, setModerationSearch] = useState('');
  const [moderationCategoryFilter, setModerationCategoryFilter] = useState('All');
  const [moderationActionModal, setModerationActionModal] = useState(null); // { item, action: 'approve' | 'request-changes' | 'reject' }
  const [actionReason, setActionReason] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // 6. Selected contribution for inspection modal
  const [selectedContributionModal, setSelectedContributionModal] = useState(null);

  // Initialize and detect authenticated session
  const loadSession = async () => {
    setSessionLoading(true);
    try {
      const sessionData = await getAuthenticatedSession();
      if (sessionData && sessionData.user) {
        setAuthenticatedUser(sessionData.user);
        const role = sessionData.user.role || 'user';
        setUserRole(role);
        setSessionSource(sessionData.source || 'session_store');
        setEditForm({
          name: sessionData.user.name || '',
          location: sessionData.user.location || '',
          bio: sessionData.user.bio || ''
        });

        // Set appropriate default tab based on detected role
        setActiveTab(role === 'admin' ? 'moderation' : 'contributions');
      }
    } catch (err) {
      console.warn('Failed to detect authenticated session:', err);
      // Fallback safely to regular user
      const fallback = DEFAULT_PROFILES.user;
      setAuthenticatedUser(fallback);
      setUserRole('user');
      setActiveTab('contributions');
    } finally {
      setSessionLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  // Compute Saved Places based on shared `favorites`
  const savedDestinations = useMemo(() => {
    return MOCK_DESTINATIONS.filter((d) => favorites.includes(d.id));
  }, [favorites]);

  const savedExperiences = useMemo(() => {
    return MOCK_EXPERIENCES.filter((e) => favorites.includes(e.id));
  }, [favorites]);

  // Filter My Contributions
  const filteredContributions = useMemo(() => {
    return myContributions.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(contributionSearch.toLowerCase()) ||
        c.location.toLowerCase().includes(contributionSearch.toLowerCase());
      const matchStatus =
        contributionStatusFilter === 'All' || c.status === contributionStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [myContributions, contributionSearch, contributionStatusFilter]);

  // Filter Moderation Queue (Admin only)
  const filteredModerationQueue = useMemo(() => {
    return moderationQueue.filter((m) => {
      const matchSearch =
        m.title.toLowerCase().includes(moderationSearch.toLowerCase()) ||
        m.location.toLowerCase().includes(moderationSearch.toLowerCase()) ||
        m.submittedBy.toLowerCase().includes(moderationSearch.toLowerCase());
      const matchCategory =
        moderationCategoryFilter === 'All' || m.category === moderationCategoryFilter;
      return matchSearch && matchCategory;
    });
  }, [moderationQueue, moderationSearch, moderationCategoryFilter]);

  const pendingModerationCount = moderationQueue.filter((m) => m.status === 'Pending').length;
  const approvedModerationCount = moderationQueue.filter((m) => m.status === 'Approved').length;

  // Handle Profile Update
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!authenticatedUser) return;
    const updated = {
      ...authenticatedUser,
      name: editForm.name,
      location: editForm.location,
      bio: editForm.bio
    };
    setAuthenticatedUser(updated);
    setIsEditingProfile(false);
    if (onShowToast) {
      onShowToast('Profile updated successfully!');
    }
  };

  // Switch Active Session Role (User / Admin)
  const handleSwitchSessionRole = (targetRole) => {
    const newProfile = setActiveSessionRole(targetRole);
    setAuthenticatedUser(newProfile);
    setUserRole(newProfile.role);
    setEditForm({
      name: newProfile.name,
      location: newProfile.location,
      bio: newProfile.bio
    });
    setActiveTab(newProfile.role === 'admin' ? 'moderation' : 'contributions');
    if (onShowToast) {
      onShowToast(`Switched active session to ${newProfile.role === 'admin' ? 'Administrator' : 'Regular User'}`);
    }
  };

  // Sign out session
  const handleSignOut = async () => {
    await signOutSession();
    // Reset to base regular user session
    const resetUser = DEFAULT_PROFILES.user;
    setAuthenticatedUser(resetUser);
    setUserRole('user');
    setActiveTab('contributions');
    if (onShowToast) {
      onShowToast('Signed out of session. Switched to guest explorer profile.');
    }
  };

  // Handle Moderation Action (Strictly guarded by hasAdminPrivileges)
  const handleExecuteModeration = () => {
    // 1. Independent authorization guard: reject non-admin callers
    if (!hasAdminPrivileges(authenticatedUser)) {
      if (onShowToast) {
        onShowToast('Security Alert: Action denied. Only verified administrators can moderate contributions.');
      }
      setModerationActionModal(null);
      return;
    }

    if (!moderationActionModal) return;
    const { item, action } = moderationActionModal;

    if ((action === 'request-changes' || action === 'reject') && !actionReason.trim()) {
      alert('Please provide a feedback note or reason for this moderation action.');
      return;
    }

    setIsProcessingAction(true);

    setTimeout(() => {
      setIsProcessingAction(false);
      let updatedStatus = 'Approved';
      let toastMsg = `Approved "${item.title}" for community discovery!`;

      if (action === 'request-changes') {
        updatedStatus = 'Needs Changes';
        toastMsg = `Changes requested for "${item.title}". Feedback logged.`;
      } else if (action === 'reject') {
        updatedStatus = 'Rejected';
        toastMsg = `Submission "${item.title}" rejected. Reason recorded in audit log.`;
      }

      setModerationQueue((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, status: updatedStatus } : m))
      );

      setModerationActionModal(null);
      setActionReason('');

      if (onShowToast) {
        onShowToast(toastMsg);
      }
    }, 450);
  };

  // 1. Loading State
  if (sessionLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-canvas p-6">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
        <h3 className="font-display font-bold text-base text-slate-800">
          Loading Authenticated Profile...
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Verifying security claims and account permissions.
        </p>
      </div>
    );
  }

  const isAdmin = userRole === 'admin';

  return (
    <div className="min-h-screen bg-canvas pb-20 animate-fadeInUp">
      {/* Profile Overview Header */}
      <section className="bg-gradient-to-b from-card to-canvas border-b border-border-subtle pt-8 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-xl p-6 sm:p-8 border border-border-subtle shadow-level-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Identity & Avatar */}
              <div className="flex items-start sm:items-center gap-4">
                <div className="relative">
                  {authenticatedUser?.avatar ? (
                    <img
                      src={authenticatedUser.avatar}
                      alt={authenticatedUser.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-primary/20"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-primary to-secondary text-white font-display font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-md">
                      {authenticatedUser?.name ? authenticatedUser.name.charAt(0) : 'U'}
                    </div>
                  )}

                  {/* Role Badge Indicator */}
                  <div
                    className={`absolute bottom-0 right-0 w-6 h-6 rounded-full text-white flex items-center justify-center border-2 border-white shadow-sm ${
                      isAdmin ? 'bg-amber-600' : 'bg-primary'
                    }`}
                    title={isAdmin ? 'Administrator Verified' : 'Community Explorer'}
                  >
                    {isAdmin ? (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                      {authenticatedUser?.name || 'Explorer Profile'}
                    </h1>

                    {/* Verified Role Badge */}
                    {isAdmin ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                        <ShieldCheck className="w-3 h-3 text-amber-700" />
                        <span>Administrator</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <User className="w-3 h-3" />
                        <span>Community Explorer</span>
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400 font-mono">
                      {authenticatedUser?.handle}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-600 mt-1">
                    {authenticatedUser?.roleTitle || (isAdmin ? 'System Administrator' : 'Community Explorer')}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {authenticatedUser?.location || 'India'}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      Joined {authenticatedUser?.joined || '2026'}
                    </span>
                    <span className="text-[11px] text-slate-400 border-l border-slate-200 pl-3">
                      {authenticatedUser?.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Controls & Session Switcher */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="btn-secondary text-xs sm:text-sm py-2 px-3.5 flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Edit Profile</span>
                </button>

                {/* Role Switcher for Testing */}
                <div className="p-1 bg-subtle rounded-lg border border-border-subtle flex items-center gap-1 text-xs">
                  <span className="text-[11px] font-bold text-slate-500 px-2 uppercase">Role:</span>
                  <button
                    onClick={() => handleSwitchSessionRole('user')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                      !isAdmin
                        ? 'bg-primary text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Switch to Regular User Profile"
                  >
                    User
                  </button>
                  <button
                    onClick={() => handleSwitchSessionRole('admin')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1 ${
                      isAdmin
                        ? 'bg-amber-600 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Switch to Administrator Profile"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Admin</span>
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleSignOut}
                  title="Sign out of current session"
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border border-border-subtle transition-colors flex items-center justify-center"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Bio */}
            <p className="text-xs sm:text-sm text-slate-600 mt-4 pt-4 border-t border-slate-100 leading-relaxed max-w-3xl">
              {authenticatedUser?.bio}
            </p>

            {/* Metrics Counters Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-100 text-center">
              {isAdmin ? (
                // Admin Metrics
                <>
                  <div className="p-3 bg-canvas rounded-lg border border-border-subtle">
                    <span className="text-[11px] font-bold uppercase text-amber-800 tracking-wider block">
                      Pending Reviews
                    </span>
                    <span className="font-display font-extrabold text-xl text-amber-600 mt-0.5 block">
                      {pendingModerationCount}
                    </span>
                  </div>

                  <div className="p-3 bg-canvas rounded-lg border border-border-subtle">
                    <span className="text-[11px] font-bold uppercase text-emerald-800 tracking-wider block">
                      Approved Gems
                    </span>
                    <span className="font-display font-extrabold text-xl text-emerald-600 mt-0.5 block">
                      {approvedModerationCount}
                    </span>
                  </div>

                  <div className="p-3 bg-canvas rounded-lg border border-border-subtle">
                    <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">
                      Queue Total
                    </span>
                    <span className="font-display font-extrabold text-xl text-slate-900 mt-0.5 block">
                      {moderationQueue.length}
                    </span>
                  </div>

                  <div className="p-3 bg-canvas rounded-lg border border-border-subtle">
                    <span className="text-[11px] font-bold uppercase text-primary tracking-wider block">
                      System Status
                    </span>
                    <span className="font-display font-extrabold text-sm text-emerald-600 mt-1.5 flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Healthy
                    </span>
                  </div>
                </>
              ) : (
                // Regular User Metrics
                <>
                  <div className="p-3 bg-canvas rounded-lg border border-border-subtle">
                    <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">
                      My Contributions
                    </span>
                    <span className="font-display font-extrabold text-xl text-slate-900 mt-0.5 block">
                      {myContributions.length}
                    </span>
                  </div>

                  <div className="p-3 bg-canvas rounded-lg border border-border-subtle">
                    <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">
                      Saved Wishlist
                    </span>
                    <span className="font-display font-extrabold text-xl text-primary mt-0.5 block">
                      {favorites.length}
                    </span>
                  </div>

                  <div className="p-3 bg-canvas rounded-lg border border-border-subtle">
                    <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">
                      Queued in Trip
                    </span>
                    <span className="font-display font-extrabold text-xl text-secondary mt-0.5 block">
                      {tripItems.length}
                    </span>
                  </div>

                  <div className="p-3 bg-canvas rounded-lg border border-border-subtle">
                    <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">
                      Contributions Approved
                    </span>
                    <span className="font-display font-extrabold text-xl text-emerald-600 mt-0.5 block">
                      {myContributions.filter((c) => c.status === 'Approved').length}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Profile Tabs Navigation */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-border-subtle overflow-x-auto scrollbar-none pb-1">
          {isAdmin ? (
            // Admin Tabs
            <>
              <button
                onClick={() => setActiveTab('moderation')}
                className={`px-4 py-2.5 rounded-t-lg text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'moderation'
                    ? 'border-amber-600 text-amber-900 font-bold bg-card'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Moderation Queue ({pendingModerationCount})</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2.5 rounded-t-lg text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'history'
                    ? 'border-primary text-primary font-bold bg-card'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Audit & History ({moderationQueue.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('system')}
                className={`px-4 py-2.5 rounded-t-lg text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'system'
                    ? 'border-primary text-primary font-bold bg-card'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Server className="w-4 h-4" />
                <span>System & Infrastructure</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2.5 rounded-t-lg text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-primary text-primary font-bold bg-card'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Account & Credentials</span>
              </button>
            </>
          ) : (
            // Regular User Tabs
            <>
              <button
                onClick={() => setActiveTab('contributions')}
                className={`px-4 py-2.5 rounded-t-lg text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'contributions'
                    ? 'border-primary text-primary font-bold bg-card'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>My Contributions ({myContributions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('saved')}
                className={`px-4 py-2.5 rounded-t-lg text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'saved'
                    ? 'border-primary text-primary font-bold bg-card'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Heart className="w-4 h-4 fill-primary/20 text-primary" />
                <span>Wishlist ({favorites.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('experiences')}
                className={`px-4 py-2.5 rounded-t-lg text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'experiences'
                    ? 'border-primary text-primary font-bold bg-card'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Luggage className="w-4 h-4" />
                <span>My Trip Queue ({tripItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2.5 rounded-t-lg text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-primary text-primary font-bold bg-card'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Account Settings</span>
              </button>
            </>
          )}
        </div>

        {/* -------------------- USER TAB 1: MY CONTRIBUTIONS -------------------- */}
        {!isAdmin && activeTab === 'contributions' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={contributionSearch}
                  onChange={(e) => setContributionSearch(e.target.value)}
                  placeholder="Search contributions by title or location..."
                  className="input-terra w-full pl-9 py-2 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['All', 'Approved', 'Pending', 'Needs Changes'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setContributionStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      contributionStatusFilter === status
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-card text-slate-600 hover:bg-subtle border border-border-subtle'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {filteredContributions.length === 0 ? (
              <div className="bg-card rounded-xl border border-dashed border-border-subtle p-12 text-center max-w-md mx-auto shadow-level-1">
                <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="font-display font-bold text-base text-slate-800">
                  No contributions found
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Share a secret street-food stall, craft workshop, or hidden monument to earn community badges!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredContributions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedContributionModal(item)}
                    className="bg-card rounded-xl p-5 border border-border-subtle shadow-level-1 hover:shadow-level-2 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            item.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : item.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-base text-slate-900 mb-1 leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{item.location}</span>
                      </p>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>Submitted on {item.date}</span>
                      <span className="text-primary font-bold inline-flex items-center gap-1">
                        View Details <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------- USER TAB 2: WISHLIST -------------------- */}
        {!isAdmin && activeTab === 'saved' && (
          <div className="space-y-4 animate-fadeIn">
            {savedDestinations.length === 0 && savedExperiences.length === 0 ? (
              <div className="bg-card rounded-xl border border-dashed border-border-subtle p-12 text-center max-w-md mx-auto shadow-level-1">
                <Heart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="font-display font-bold text-base text-slate-800">
                  Your Wishlist is Empty
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Browse destinations across India and click the heart icon to save them for later planning.
                </p>
                <button
                  onClick={onNavigateToExperiences}
                  className="btn-primary text-xs py-2 px-4"
                >
                  Explore Destinations
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedDestinations.map((dest) => (
                  <div
                    key={dest.id}
                    className="bg-card rounded-xl overflow-hidden border border-border-subtle shadow-level-1 hover:shadow-level-2 transition-all flex flex-col justify-between"
                  >
                    <div className="relative h-44">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => onToggleFavorite(dest.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-primary hover:bg-white shadow-sm"
                        title="Remove from Wishlist"
                      >
                        <Heart className="w-4 h-4 fill-primary text-primary" />
                      </button>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase">
                          {dest.state}
                        </span>
                        <h4 className="font-display font-bold text-base text-slate-900 leading-snug">
                          {dest.name}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {dest.overview}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-600">
                          ★ {dest.rating}
                        </span>
                        <button
                          onClick={() => onNavigateToPlace(dest.id)}
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          Place Details <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------- USER TAB 3: TRIP QUEUE -------------------- */}
        {!isAdmin && activeTab === 'experiences' && (
          <div className="space-y-4 animate-fadeIn">
            {tripItems.length === 0 ? (
              <div className="bg-card rounded-xl border border-dashed border-border-subtle p-12 text-center max-w-md mx-auto shadow-level-1">
                <Luggage className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="font-display font-bold text-base text-slate-800">
                  No Items in Trip Queue
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Add culinary walks, artisan workshops, and heritage sights to your trip queue to prepare your itinerary.
                </p>
                <button
                  onClick={onNavigateToExperiences}
                  className="btn-primary text-xs py-2 px-4"
                >
                  Browse Experiences
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {tripItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card rounded-xl p-4 border border-border-subtle shadow-level-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=400&q=80'}
                        alt={item.title || item.name}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase">
                          {item.category || 'Experience'}
                        </span>
                        <h4 className="font-display font-bold text-sm text-slate-900">
                          {item.title || item.name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          {item.duration && <span>⏱ {item.duration}</span>}
                          {item.price && <span>₹{item.price} per person</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleTrip(item)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded border border-rose-200 transition-colors"
                    >
                      Remove from Queue
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------- ADMIN TAB 1: MODERATION REVIEW QUEUE -------------------- */}
        {isAdmin && activeTab === 'moderation' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Administrative Community Moderation Console</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  As an authenticated administrator, audit submitted cultural gems and culinary stops before promoting them to the public recommendation engine.
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-900 bg-white px-3 py-1 rounded-full border border-amber-300 shadow-xs whitespace-nowrap self-start sm:self-auto">
                Admin Authorized
              </span>
            </div>

            {/* Moderation Search & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={moderationSearch}
                  onChange={(e) => setModerationSearch(e.target.value)}
                  placeholder="Search submissions by title, location, or contributor..."
                  className="input-terra w-full pl-9 py-2 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['All', 'Arts & Crafts', 'Local Food', 'Village Experience'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setModerationCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      moderationCategoryFilter === cat
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-card text-slate-600 hover:bg-subtle border border-border-subtle'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Queue List */}
            {filteredModerationQueue.filter((m) => m.status === 'Pending').length === 0 ? (
              <div className="bg-card rounded-xl border border-dashed border-border-subtle p-12 text-center max-w-md mx-auto shadow-level-1">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h3 className="font-display font-bold text-base text-slate-800">
                  Moderation Queue Clean!
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  All community submissions have been reviewed or match no active filter.
                </p>
                <button
                  onClick={() => {
                    setModerationSearch('');
                    setModerationCategoryFilter('All');
                  }}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Clear Queue Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredModerationQueue
                  .filter((m) => m.status === 'Pending')
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-card rounded-xl p-5 border border-border-subtle shadow-level-1 hover:shadow-level-2 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-0.5 rounded">
                              {item.category}
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-600">
                              Submitted by <strong>{item.submittedBy}</strong>
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-400">{item.date}</span>
                            <span className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                              Pending Review
                            </span>
                          </div>

                          <h3 className="font-display font-bold text-base text-slate-900 mb-1">
                            {item.title}
                          </h3>

                          <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            <span>{item.location}</span>
                            {item.landmark && <span className="text-slate-400">({item.landmark})</span>}
                          </p>

                          <p className="text-xs text-slate-700 leading-relaxed bg-subtle p-3 rounded-lg border border-slate-200/60 mb-2">
                            {item.description}
                          </p>

                          {item.notes && (
                            <p className="text-[11px] text-slate-500 italic">
                              Contributor Tip: "{item.notes}"
                            </p>
                          )}
                        </div>

                        {/* Admin Action Buttons */}
                        <div className="flex flex-row md:flex-col gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                          <button
                            onClick={() =>
                              setModerationActionModal({ item, action: 'approve' })
                            }
                            className="text-xs font-semibold py-2 px-3.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center justify-center gap-1 transition-all active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Approve</span>
                          </button>

                          <button
                            onClick={() =>
                              setModerationActionModal({ item, action: 'request-changes' })
                            }
                            className="text-xs font-semibold py-2 px-3 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center gap-1 transition-colors"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                            <span>Request Changes</span>
                          </button>

                          <button
                            onClick={() =>
                              setModerationActionModal({ item, action: 'reject' })
                            }
                            className="text-xs font-semibold py-2 px-3 rounded bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 flex items-center justify-center gap-1 transition-colors"
                          >
                            <X className="w-3.5 h-3.5 text-red-700" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------- ADMIN TAB 2: AUDIT & HISTORY -------------------- */}
        {isAdmin && activeTab === 'history' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-card rounded-xl p-5 border border-border-subtle shadow-level-1">
              <h3 className="font-display font-bold text-base text-slate-900 mb-1">
                Moderation Decisions Log
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Historical record of approved, rejected, and feedback-requested community submissions.
              </p>

              <div className="divide-y divide-slate-100">
                {moderationQueue.map((item) => (
                  <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800">{item.title}</span>
                        <span className="text-[10px] text-slate-400">({item.category})</span>
                      </div>
                      <span className="text-xs text-slate-500">{item.location} • Submitted by {item.submittedBy}</span>
                    </div>

                    <span
                      className={`self-start sm:self-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Needs Changes'
                          ? 'bg-amber-100 text-amber-800'
                          : item.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -------------------- ADMIN TAB 3: SYSTEM INFRASTRUCTURE -------------------- */}
        {isAdmin && activeTab === 'system' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card rounded-xl p-5 border border-border-subtle shadow-level-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary" />
                  <h4 className="font-display font-bold text-sm text-slate-900">
                    Supabase Database Engine
                  </h4>
                </div>
                <div className="text-xs space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>Host:</span>
                    <span className="font-mono text-[11px]">jxtmvfamgyrmnlzfgfwq.supabase.co</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Table Status:</span>
                    <span className="text-emerald-600 font-bold">Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Table:</span>
                    <span className="font-mono text-[11px]">public.trip_inputs</span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-5 border border-border-subtle shadow-level-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-tertiary" />
                  <h4 className="font-display font-bold text-sm text-slate-900">
                    FastAPI ML & Routing Backend
                  </h4>
                </div>
                <div className="text-xs space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>API Endpoint:</span>
                    <span className="font-mono text-[11px]">http://127.0.0.1:8000/api</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Health Probe:</span>
                    <span className="text-emerald-600 font-bold">Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Routing Engine:</span>
                    <span>OpenStreetMap / OSRM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- COMMON TAB: ACCOUNT SETTINGS -------------------- */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn max-w-2xl">
            <div className="bg-card rounded-xl p-6 border border-border-subtle shadow-level-1 space-y-4">
              <h3 className="font-display font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                <span>Account Credentials & Security</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-subtle rounded-lg">
                  <div>
                    <span className="font-bold text-slate-800 block">Authenticated User ID</span>
                    <span className="text-slate-500 font-mono text-[11px]">{authenticatedUser?.id}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-subtle rounded-lg">
                  <div>
                    <span className="font-bold text-slate-800 block">Verified Email</span>
                    <span className="text-slate-500 font-mono text-[11px]">{authenticatedUser?.email}</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-subtle rounded-lg">
                  <div>
                    <span className="font-bold text-slate-800 block">Assigned Role</span>
                    <span className="text-slate-600 font-medium capitalize">
                      {userRole} {isAdmin ? '(Full Moderation & Audit Privileges)' : '(Standard Community Explorer)'}
                    </span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    isAdmin ? 'bg-amber-100 text-amber-900' : 'bg-primary/10 text-primary'
                  }`}>
                    {userRole}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-subtle rounded-lg">
                  <div>
                    <span className="font-bold text-slate-800 block">Session Source</span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {sessionSource === 'supabase' ? 'Supabase JWT Session' : 'Local Trusted Session Store'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Verified</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Ready to conclude your session?
                </span>
                <button
                  onClick={handleSignOut}
                  className="btn-secondary text-xs py-2 px-4 text-red-600 hover:bg-red-50 hover:border-red-200 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card rounded-xl max-w-lg w-full p-6 shadow-level-3 border border-border-subtle animate-scaleIn">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Edit Profile Information
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="w-8 h-8 rounded-full hover:bg-subtle text-slate-500 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="input-terra w-full text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="input-terra w-full text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Community Bio
                </label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="input-terra w-full text-xs resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-2 px-5">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Moderation Confirmation Modal (Admin Only) */}
      {isAdmin && moderationActionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card rounded-xl max-w-md w-full p-6 shadow-level-3 border border-border-subtle animate-scaleIn">
            <h3 className="font-display font-bold text-base text-slate-900 mb-1">
              Confirm Moderation Decision
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              You are applying an action to <strong className="text-slate-800">"{moderationActionModal.item.title}"</strong>.
            </p>

            {moderationActionModal.action === 'approve' ? (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 mb-4">
                This submission will be marked as <strong>Approved</strong> and added to the community discovery feed.
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Reason / Feedback Note <span className="text-primary">*</span>
                </label>
                <textarea
                  rows={3}
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder={
                    moderationActionModal.action === 'request-changes'
                      ? 'e.g. Please clarify exact operating hours or add instructions for public transport.'
                      : 'e.g. Ineligible listing due to commercial chain or duplicate entry.'
                  }
                  className="input-terra w-full text-xs resize-none"
                  required
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setModerationActionModal(null);
                  setActionReason('');
                }}
                disabled={isProcessingAction}
                className="btn-secondary text-xs py-2 px-3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteModeration}
                disabled={isProcessingAction}
                className={`text-xs font-semibold py-2 px-4 rounded text-white flex items-center gap-1.5 ${
                  moderationActionModal.action === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : moderationActionModal.action === 'request-changes'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isProcessingAction ? (
                  <span>Processing...</span>
                ) : (
                  <span>Confirm {moderationActionModal.action.replace('-', ' ')}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Contribution Details Modal */}
      {selectedContributionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card rounded-xl max-w-lg w-full p-6 shadow-level-3 border border-border-subtle animate-scaleIn">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase">
                  {selectedContributionModal.category}
                </span>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {selectedContributionModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedContributionModal(null)}
                className="w-8 h-8 rounded-full hover:bg-subtle text-slate-500 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center justify-between p-2 bg-subtle rounded">
                <span className="font-semibold text-slate-700">Status:</span>
                <span className="font-bold text-slate-900">{selectedContributionModal.status}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-subtle rounded">
                <span className="font-semibold text-slate-700">Location:</span>
                <span>{selectedContributionModal.location}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700 block mb-1">Description:</span>
                <p className="p-3 bg-canvas border border-border-subtle rounded leading-relaxed">
                  {selectedContributionModal.description}
                </p>
              </div>
              {selectedContributionModal.feedback && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Moderator Review Note:</span>
                  <p className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded leading-relaxed">
                    {selectedContributionModal.feedback}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => setSelectedContributionModal(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
