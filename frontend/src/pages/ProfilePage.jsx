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
  ChevronDown,
  ChevronUp,
  LogOut,
  RefreshCw,
  Server,
  Database,
  Lock,
  Sliders,
  ShieldAlert,
  Award
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
    feedback: 'Verified by Bundelkhand Tourism Elder council. Featured in Hidden Trails map.'
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

// Initial Submissions in the Moderation Queue (Admin View)
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
  const [expandedFeedbackId, setExpandedFeedbackId] = useState(null);

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

        // Set default tab based on detected role
        setActiveTab(role === 'admin' ? 'moderation' : 'contributions');
      }
    } catch (err) {
      console.warn('Failed to detect authenticated session:', err);
      const fallback = DEFAULT_PROFILES.user;
      setAuthenticatedUser(fallback);
      setUserRole('user');
      setActiveTab('contributions');
    } finally {
      // Gentle pause to show smooth skeleton entrance
      setTimeout(() => {
        setSessionLoading(false);
      }, 260);
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
      onShowToast('Profile information updated successfully!');
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
      onShowToast(`Session updated: ${newProfile.role === 'admin' ? 'Administrator' : 'Regular Explorer'}`);
    }
  };

  // Sign out session
  const handleSignOut = async () => {
    await signOutSession();
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
        toastMsg = `Feedback sent for "${item.title}". Status set to Needs Changes.`;
      } else if (action === 'reject') {
        updatedStatus = 'Rejected';
        toastMsg = `Submission "${item.title}" rejected and archived in audit log.`;
      }

      setModerationQueue((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, status: updatedStatus } : m))
      );

      setModerationActionModal(null);
      setActionReason('');

      if (onShowToast) {
        onShowToast(toastMsg);
      }
    }, 400);
  };

  // --------------------------------------------------------------------------
  // LOADING SKELETON STATE (Indian Tourism Warm Ivory & Shimmer)
  // --------------------------------------------------------------------------
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] pb-20 animate-fadeIn">
        {/* Header Skeleton */}
        <section className="bg-gradient-to-b from-white to-[#FAF7F0] border-b border-[#E8E3D7] pt-8 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E3D7] shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full skeleton-shimmer shrink-0" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-44 h-7 rounded-lg skeleton-shimmer" />
                      <div className="w-24 h-5 rounded-full skeleton-shimmer" />
                    </div>
                    <div className="w-32 h-4 rounded skeleton-shimmer" />
                    <div className="w-64 h-3.5 rounded skeleton-shimmer" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-24 h-9 rounded-lg skeleton-shimmer" />
                  <div className="w-28 h-9 rounded-lg skeleton-shimmer" />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#E8E3D7]/60">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 rounded-xl skeleton-shimmer" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content Skeleton */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-4">
          <div className="flex gap-3 border-b border-[#E8E3D7] pb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-28 h-8 rounded-t-lg skeleton-shimmer" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 rounded-xl skeleton-shimmer" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  const isAdmin = userRole === 'admin';

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#263238] pb-24 animate-profile-enter">
      
      {/* ====================================================================
          PROFILE OVERVIEW HEADER (Heritage Indian Tourism Aesthetic)
          ==================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-white/80 to-[#FAF7F0] border-b border-[#E8E3D7] pt-8 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Subtle Tourism-Inspired Banner Texture for Explorer, or Subtle Abstract Gradient for Admin */}
        {!isAdmin ? (
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80"
              alt="Indian Tourism Background"
              className="w-full h-full object-cover object-center"
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[radial-gradient(#155E63_1px,transparent_1px)] [background-size:16px_16px]" />
        )}
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E3D7] shadow-sm relative overflow-hidden transition-all duration-300">
            {/* Top Decorative Indian Motif Accent Stripe */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 ${
              isAdmin
                ? 'bg-gradient-to-r from-[#B7791F] via-[#C76B45] to-[#E4B363]'
                : 'bg-gradient-to-r from-[#155E63] via-[#C76B45] to-[#E4B363]'
            }`} />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Identity & Avatar Section */}
              <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                <div className="relative shrink-0">
                  {authenticatedUser?.avatar ? (
                    <img
                      src={authenticatedUser.avatar}
                      alt={authenticatedUser.name}
                      className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shadow-md transition-all duration-300 ${
                        isAdmin
                          ? 'ring-2 ring-[#B7791F]/40'
                          : 'ring-2 ring-[#155E63]/30'
                      }`}
                    />
                  ) : (
                    <div
                      className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full text-white font-display font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-md transition-all duration-300 ${
                        isAdmin
                          ? 'bg-gradient-to-tr from-[#C76B45] to-[#B7791F]'
                          : 'bg-gradient-to-tr from-[#155E63] to-[#C76B45]'
                      }`}
                    >
                      {authenticatedUser?.name ? authenticatedUser.name.charAt(0) : 'U'}
                    </div>
                  )}

                  {/* Corner Role Badge Indicator */}
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full text-white flex items-center justify-center border-2 border-white shadow-sm transition-transform duration-200 hover:scale-110 ${
                      isAdmin ? 'bg-[#C76B45]' : 'bg-[#155E63]'
                    }`}
                    title={isAdmin ? 'Administrator Verified' : 'Community Explorer'}
                  >
                    {isAdmin ? (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>

                {/* Name, Roles, and Metadata */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#263238] tracking-tight">
                      {authenticatedUser?.name || 'Explorer Profile'}
                    </h1>

                    {/* Role Pill Badge */}
                    {isAdmin ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FEF8ED] text-[#B7791F] border border-[#F6E1B6] shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#B7791F]" />
                        <span>Administrator</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF4F5] text-[#155E63] border border-[#C2DFE1]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D5B]" />
                        <span>Verified Explorer</span>
                      </span>
                    )}

                    <span className="text-xs text-[#64748B] font-mono">
                      {authenticatedUser?.handle}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">
                    {authenticatedUser?.roleTitle || (isAdmin ? 'System Administrator' : 'Community Storyteller & Explorer')}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#64748B] mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C76B45]" />
                      <span className="text-[#263238] font-medium">{authenticatedUser?.location || 'India'}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[#64748B]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Joined {authenticatedUser?.joined || 'October 2026'}</span>
                    </span>
                    <span className="hidden sm:inline-block text-[#E8E3D7]">•</span>
                    <span className="text-[11px] font-mono text-[#64748B]">
                      {authenticatedUser?.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Controls & Session Switcher */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 lg:pt-0">
                {/* Edit Profile Button */}
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-white text-[#263238] border border-[#E8E3D7] hover:border-[#155E63] hover:text-[#155E63] hover:bg-[#F0F7F7] active:scale-[0.98] transition-all duration-200 text-xs font-semibold shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#C76B45]" />
                  <span>Edit Profile</span>
                </button>

                {/* Role Switcher (User / Admin) for Testing */}
                <div className="p-1 bg-[#FAF7F0] rounded-lg border border-[#E8E3D7] flex items-center gap-1 text-xs shadow-xs">
                  <span className="text-[10px] font-bold text-[#64748B] px-1.5 uppercase tracking-wider">Role:</span>
                  <button
                    onClick={() => handleSwitchSessionRole('user')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
                      !isAdmin
                        ? 'bg-[#155E63] text-white shadow-xs font-bold'
                        : 'text-[#64748B] hover:text-[#263238] hover:bg-white/60'
                    }`}
                    title="Switch to Regular User Profile"
                  >
                    <User className="w-3 h-3" />
                    <span>User</span>
                  </button>
                  <button
                    onClick={() => handleSwitchSessionRole('admin')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
                      isAdmin
                        ? 'bg-[#C76B45] text-white shadow-xs font-bold'
                        : 'text-[#64748B] hover:text-[#263238] hover:bg-white/60'
                    }`}
                    title="Switch to Administrator Profile"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Admin</span>
                  </button>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  title="Sign out of current session"
                  className="p-2 rounded-lg text-[#64748B] hover:text-[#C2413B] hover:bg-[#FDF2F1] border border-[#E8E3D7] hover:border-[#F8D0CD] transition-all duration-200 flex items-center justify-center active:scale-[0.98]"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Bio */}
            {authenticatedUser?.bio && (
              <p className="text-xs sm:text-sm text-[#263238]/80 mt-4 pt-4 border-t border-[#E8E3D7] leading-relaxed max-w-3xl">
                {authenticatedUser.bio}
              </p>
            )}

            {/* Metrics Counters Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#E8E3D7] text-center">
              {isAdmin ? (
                // Administrator Metrics Bar
                <>
                  <div className="p-3.5 bg-[#FAF7F0] hover:bg-white rounded-xl border border-[#E8E3D7] hover:border-[#B7791F]/40 shadow-xs hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-[#B7791F] tracking-wider block">
                      Pending Reviews
                    </span>
                    <span className="font-display font-extrabold text-2xl text-[#B7791F] mt-0.5 block">
                      {pendingModerationCount}
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#FAF7F0] hover:bg-white rounded-xl border border-[#E8E3D7] hover:border-[#2E7D5B]/40 shadow-xs hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-[#2E7D5B] tracking-wider block">
                      Approved Gems
                    </span>
                    <span className="font-display font-extrabold text-2xl text-[#2E7D5B] mt-0.5 block">
                      {approvedModerationCount}
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#FAF7F0] hover:bg-white rounded-xl border border-[#E8E3D7] hover:border-[#155E63]/40 shadow-xs hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-[#155E63] tracking-wider block">
                      Queue Total
                    </span>
                    <span className="font-display font-extrabold text-2xl text-[#263238] mt-0.5 block">
                      {moderationQueue.length}
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#FAF7F0] hover:bg-white rounded-xl border border-[#E8E3D7] hover:border-[#2E7D5B]/40 shadow-xs hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-[#64748B] tracking-wider block">
                      System Status
                    </span>
                    <span className="font-display font-extrabold text-sm text-[#2E7D5B] mt-2 flex items-center justify-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#2E7D5B] animate-pulse" />
                      Operational
                    </span>
                  </div>
                </>
              ) : (
                // Regular User Metrics Bar
                <>
                  <div className="p-3.5 bg-[#FAF7F0] hover:bg-white rounded-xl border border-[#E8E3D7] hover:border-[#155E63]/40 shadow-xs hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-[#155E63] tracking-wider block">
                      My Contributions
                    </span>
                    <span className="font-display font-extrabold text-2xl text-[#263238] mt-0.5 block">
                      {myContributions.length}
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#FAF7F0] hover:bg-white rounded-xl border border-[#E8E3D7] hover:border-[#C76B45]/40 shadow-xs hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-[#C76B45] tracking-wider block">
                      Saved Wishlist
                    </span>
                    <span className="font-display font-extrabold text-2xl text-[#C76B45] mt-0.5 block">
                      {favorites.length}
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#FAF7F0] hover:bg-white rounded-xl border border-[#E8E3D7] hover:border-[#B7791F]/40 shadow-xs hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-[#B7791F] tracking-wider block">
                      Queued in Trip
                    </span>
                    <span className="font-display font-extrabold text-2xl text-[#B7791F] mt-0.5 block">
                      {tripItems.length}
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#FAF7F0] hover:bg-white rounded-xl border border-[#E8E3D7] hover:border-[#2E7D5B]/40 shadow-xs hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-[#2E7D5B] tracking-wider block">
                      Approved Gems
                    </span>
                    <span className="font-display font-extrabold text-2xl text-[#2E7D5B] mt-0.5 block">
                      {myContributions.filter((c) => c.status === 'Approved').length}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          TABS NAVIGATION (Indian Heritage Styled Navigation)
          ==================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-[#E8E3D7] overflow-x-auto scrollbar-none pb-0.5">
          {isAdmin ? (
            // Admin Navigation Tabs
            <>
              <button
                onClick={() => setActiveTab('moderation')}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
                  activeTab === 'moderation'
                    ? 'border-[#C76B45] text-[#C76B45] font-bold bg-white shadow-xs'
                    : 'border-transparent text-[#64748B] hover:text-[#263238] hover:bg-white/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#C76B45]" />
                <span>Moderation Queue ({pendingModerationCount})</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
                  activeTab === 'history'
                    ? 'border-[#155E63] text-[#155E63] font-bold bg-white shadow-xs'
                    : 'border-transparent text-[#64748B] hover:text-[#263238] hover:bg-white/50'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Audit & History ({moderationQueue.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('system')}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
                  activeTab === 'system'
                    ? 'border-[#155E63] text-[#155E63] font-bold bg-white shadow-xs'
                    : 'border-transparent text-[#64748B] hover:text-[#263238] hover:bg-white/50'
                }`}
              >
                <Server className="w-4 h-4" />
                <span>System & Infrastructure</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
                  activeTab === 'settings'
                    ? 'border-[#155E63] text-[#155E63] font-bold bg-white shadow-xs'
                    : 'border-transparent text-[#64748B] hover:text-[#263238] hover:bg-white/50'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Account & Credentials</span>
              </button>
            </>
          ) : (
            // Regular User Navigation Tabs
            <>
              <button
                onClick={() => setActiveTab('contributions')}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
                  activeTab === 'contributions'
                    ? 'border-[#155E63] text-[#155E63] font-bold bg-white shadow-xs'
                    : 'border-transparent text-[#64748B] hover:text-[#263238] hover:bg-white/50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#155E63]" />
                <span>My Contributions ({myContributions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('saved')}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
                  activeTab === 'saved'
                    ? 'border-[#C76B45] text-[#C76B45] font-bold bg-white shadow-xs'
                    : 'border-transparent text-[#64748B] hover:text-[#263238] hover:bg-white/50'
                }`}
              >
                <Heart className="w-4 h-4 fill-[#C76B45]/20 text-[#C76B45]" />
                <span>Wishlist ({favorites.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('experiences')}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
                  activeTab === 'experiences'
                    ? 'border-[#B7791F] text-[#B7791F] font-bold bg-white shadow-xs'
                    : 'border-transparent text-[#64748B] hover:text-[#263238] hover:bg-white/50'
                }`}
              >
                <Luggage className="w-4 h-4 text-[#B7791F]" />
                <span>My Trip Queue ({tripItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
                  activeTab === 'settings'
                    ? 'border-[#155E63] text-[#155E63] font-bold bg-white shadow-xs'
                    : 'border-transparent text-[#64748B] hover:text-[#263238] hover:bg-white/50'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Account Settings</span>
              </button>
            </>
          )}
        </div>

        {/* ==================================================================
            USER TAB 1: MY CONTRIBUTIONS (Staggered Entrance & Status Styling)
            ================================================================== */}
        {!isAdmin && activeTab === 'contributions' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#64748B]" />
                <input
                  type="text"
                  value={contributionSearch}
                  onChange={(e) => setContributionSearch(e.target.value)}
                  placeholder="Search submissions by title or location..."
                  className="bg-white border border-[#E8E3D7] text-[#263238] placeholder:text-[#94A3B8] rounded-xl pl-9 pr-4 py-2 text-xs w-full outline-none focus:border-[#155E63] focus:ring-2 focus:ring-[#155E63]/20 transition-all duration-150 shadow-xs"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['All', 'Approved', 'Pending', 'Needs Changes'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setContributionStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98] ${
                      contributionStatusFilter === status
                        ? 'bg-[#155E63] text-white shadow-xs font-bold'
                        : 'bg-white text-[#64748B] hover:text-[#263238] hover:bg-[#FAF7F0] border border-[#E8E3D7]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Submissions List */}
            {filteredContributions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-[#E8E3D7] p-12 text-center max-w-md mx-auto shadow-sm">
                <Sparkles className="w-10 h-10 text-[#C76B45]/40 mx-auto mb-2" />
                <h3 className="font-display font-bold text-base text-[#263238]">
                  No contributions found
                </h3>
                <p className="text-xs text-[#64748B] mt-1 mb-4">
                  Share a secret street-food stall, craft workshop, or hidden monument to earn community badges!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredContributions.map((item, idx) => {
                  const isExpanded = expandedFeedbackId === item.id;
                  const staggerClass = `stagger-${(idx % 6) + 1}`;

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-2xl p-5 border border-[#E8E3D7] shadow-xs hover:shadow-md hover:border-[#155E63]/30 transition-all duration-200 flex flex-col justify-between animate-profile-enter ${staggerClass} hover:-translate-y-0.5`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold text-[#155E63] uppercase tracking-wider bg-[#EBF4F5] px-2.5 py-0.5 rounded-full border border-[#C2DFE1]">
                            {item.category}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                              item.status === 'Approved'
                                ? 'bg-[#EDF7F2] text-[#2E7D5B] border border-[#C5E6D4]'
                                : item.status === 'Pending'
                                ? 'bg-[#FEF8ED] text-[#B7791F] border border-[#F6E1B6]'
                                : 'bg-[#FDF2F1] text-[#C2413B] border border-[#F8D0CD]'
                            }`}
                          >
                            {item.status === 'Approved' && <CheckCircle2 className="w-3 h-3 text-[#2E7D5B]" />}
                            {item.status === 'Pending' && <Clock className="w-3 h-3 text-[#B7791F]" />}
                            {item.status === 'Needs Changes' && <AlertCircle className="w-3 h-3 text-[#C2413B]" />}
                            <span>{item.status}</span>
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-base text-[#263238] mb-1 leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-xs text-[#64748B] flex items-center gap-1 mb-2">
                          <MapPin className="w-3.5 h-3.5 text-[#C76B45]" />
                          <span>{item.location}</span>
                        </p>

                        <p className="text-xs text-[#263238]/80 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Expandable Feedback / Reviewer Note Accordion */}
                        {item.feedback && (
                          <div className="mt-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setExpandedFeedbackId(isExpanded ? null : item.id)}
                              className="text-[11px] font-semibold text-[#155E63] hover:text-[#0E474B] flex items-center gap-1 transition-colors"
                            >
                              <span>{isExpanded ? 'Hide Reviewer Note' : 'Show Reviewer Note'}</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                            </button>

                            {isExpanded && (
                              <div className="mt-2 p-2.5 rounded-lg bg-[#FAF7F0] border border-[#E8E3D7] text-xs text-[#263238]/85 animate-fadeIn">
                                <span className="font-bold text-[#64748B] block text-[10px] uppercase mb-0.5">
                                  Moderation Feedback
                                </span>
                                {item.feedback}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 mt-3 border-t border-[#E8E3D7] flex items-center justify-between text-xs text-[#64748B]">
                        <span>Submitted {item.date}</span>
                        <button
                          onClick={() => setSelectedContributionModal(item)}
                          className="text-[#155E63] font-bold inline-flex items-center gap-1 hover:underline active:scale-95 transition-transform"
                        >
                          View Details <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================
            USER TAB 2: WISHLIST (Heart Animations & Destination Cards)
            ================================================================== */}
        {!isAdmin && activeTab === 'saved' && (
          <div className="space-y-4 animate-fadeIn">
            {savedDestinations.length === 0 && savedExperiences.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-[#E8E3D7] p-12 text-center max-w-md mx-auto shadow-sm">
                <Heart className="w-10 h-10 text-[#C76B45]/40 mx-auto mb-2" />
                <h3 className="font-display font-bold text-base text-[#263238]">
                  Your Wishlist is Empty
                </h3>
                <p className="text-xs text-[#64748B] mt-1 mb-4">
                  Explore destinations across India and tap the heart icon to save them for your trip.
                </p>
                <button
                  onClick={onNavigateToExperiences}
                  className="inline-flex items-center justify-center font-semibold text-white bg-[#155E63] hover:bg-[#0E474B] active:scale-[0.98] transition-all duration-200 rounded-lg px-5 py-2.5 text-xs shadow-sm"
                >
                  Explore Destinations
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedDestinations.map((dest, idx) => (
                  <div
                    key={dest.id}
                    className={`bg-white rounded-2xl overflow-hidden border border-[#E8E3D7] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 animate-profile-enter stagger-${(idx % 6) + 1}`}
                  >
                    <div className="relative h-44 overflow-hidden group">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => onToggleFavorite(dest.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-[#C76B45] hover:bg-white shadow-sm transition-transform active:scale-90"
                        title="Remove from Wishlist"
                      >
                        <Heart className="w-4 h-4 fill-[#C76B45] text-[#C76B45] animate-heartPop" />
                      </button>
                      <span className="absolute bottom-2.5 left-3 text-[10px] font-bold text-white bg-[#263238]/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                        {dest.state}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-display font-bold text-base text-[#263238] leading-snug">
                          {dest.name}
                        </h4>
                        <p className="text-xs text-[#64748B] line-clamp-2 mt-1 leading-relaxed">
                          {dest.overview}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#E8E3D7] flex items-center justify-between">
                        <span className="text-xs font-bold text-[#B7791F] flex items-center gap-1">
                          <span>★</span> {dest.rating}
                        </span>
                        <button
                          onClick={() => onNavigateToPlace(dest.id)}
                          className="text-xs font-bold text-[#155E63] hover:text-[#0E474B] flex items-center gap-1 transition-colors"
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

        {/* ==================================================================
            USER TAB 3: TRIP QUEUE
            ================================================================== */}
        {!isAdmin && activeTab === 'experiences' && (
          <div className="space-y-4 animate-fadeIn">
            {tripItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-[#E8E3D7] p-12 text-center max-w-md mx-auto shadow-sm">
                <Luggage className="w-10 h-10 text-[#B7791F]/40 mx-auto mb-2" />
                <h3 className="font-display font-bold text-base text-[#263238]">
                  No Items in Trip Queue
                </h3>
                <p className="text-xs text-[#64748B] mt-1 mb-4">
                  Add culinary walks, artisan workshops, and heritage sights to your trip queue to prepare your itinerary.
                </p>
                <button
                  onClick={onNavigateToExperiences}
                  className="inline-flex items-center justify-center font-semibold text-white bg-[#155E63] hover:bg-[#0E474B] active:scale-[0.98] transition-all duration-200 rounded-lg px-5 py-2.5 text-xs shadow-sm"
                >
                  Browse Experiences
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {tripItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl p-4 border border-[#E8E3D7] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-profile-enter stagger-${(idx % 6) + 1} hover:shadow-sm transition-all duration-200`}
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=400&q=80'}
                        alt={item.title || item.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#E8E3D7]"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-[#155E63] uppercase tracking-wider bg-[#EBF4F5] px-2 py-0.5 rounded">
                          {item.category || 'Experience'}
                        </span>
                        <h4 className="font-display font-bold text-sm text-[#263238] mt-0.5">
                          {item.title || item.name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-[#64748B] mt-0.5">
                          {item.duration && <span>⏱ {item.duration}</span>}
                          {item.price && <span>₹{item.price} per person</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleTrip(item)}
                      className="text-xs font-semibold text-[#C2413B] hover:text-white hover:bg-[#C2413B] px-3.5 py-1.5 rounded-lg border border-[#F8D0CD] transition-all duration-150 active:scale-95"
                    >
                      Remove from Queue
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================
            ADMIN TAB 1: MODERATION REVIEW QUEUE
            ================================================================== */}
        {isAdmin && activeTab === 'moderation' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Heritage Admin Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF7F0] via-[#FEF8ED] to-[#FBF3EF] border border-[#E8E3D7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#B7791F] uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#C76B45]" />
                  <span>Administrative Community Moderation Console</span>
                </div>
                <p className="text-xs text-[#263238]/80 leading-relaxed">
                  As an authenticated administrator, audit submitted cultural gems and culinary stops before promoting them to the public recommendation engine.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#B7791F] bg-white px-3 py-1 rounded-full border border-[#F6E1B6] shadow-xs whitespace-nowrap self-start sm:self-auto">
                Admin Authorized
              </span>
            </div>

            {/* Moderation Search & Category Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#64748B]" />
                <input
                  type="text"
                  value={moderationSearch}
                  onChange={(e) => setModerationSearch(e.target.value)}
                  placeholder="Search submissions by title, location, or contributor..."
                  className="bg-white border border-[#E8E3D7] text-[#263238] placeholder:text-[#94A3B8] rounded-xl pl-9 pr-4 py-2 text-xs w-full outline-none focus:border-[#C76B45] focus:ring-2 focus:ring-[#C76B45]/20 transition-all duration-150 shadow-xs"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['All', 'Arts & Crafts', 'Local Food', 'Village Experience'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setModerationCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98] ${
                      moderationCategoryFilter === cat
                        ? 'bg-[#C76B45] text-white shadow-xs font-bold'
                        : 'bg-white text-[#64748B] hover:text-[#263238] hover:bg-[#FAF7F0] border border-[#E8E3D7]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Moderation Queue Submissions */}
            {filteredModerationQueue.filter((m) => m.status === 'Pending').length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-[#E8E3D7] p-12 text-center max-w-md mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-[#2E7D5B] mx-auto mb-2" />
                <h3 className="font-display font-bold text-base text-[#263238]">
                  Moderation Queue Clean!
                </h3>
                <p className="text-xs text-[#64748B] mt-1 mb-4">
                  All community submissions have been reviewed or match no active filter.
                </p>
                <button
                  onClick={() => {
                    setModerationSearch('');
                    setModerationCategoryFilter('All');
                  }}
                  className="inline-flex items-center justify-center font-semibold text-[#263238] bg-white hover:bg-[#FAF7F0] border border-[#E8E3D7] rounded-lg px-4 py-2 text-xs transition-colors"
                >
                  Clear Queue Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredModerationQueue
                  .filter((m) => m.status === 'Pending')
                  .map((item, idx) => (
                    <div
                      key={item.id}
                      className={`bg-white rounded-2xl p-5 border border-[#E8E3D7] shadow-xs hover:shadow-md transition-all duration-200 animate-profile-enter stagger-${(idx % 6) + 1}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold text-[#155E63] uppercase tracking-wider bg-[#EBF4F5] px-2.5 py-0.5 rounded-full border border-[#C2DFE1]">
                              {item.category}
                            </span>
                            <span className="text-xs text-[#E8E3D7]">•</span>
                            <span className="text-xs text-[#64748B]">
                              Submitted by <strong className="text-[#263238]">{item.submittedBy}</strong>
                            </span>
                            <span className="text-xs text-[#E8E3D7]">•</span>
                            <span className="text-xs text-[#64748B]">{item.date}</span>
                            <span className="ml-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FEF8ED] text-[#B7791F] border border-[#F6E1B6]">
                              Pending Review
                            </span>
                          </div>

                          <h3 className="font-display font-bold text-base text-[#263238] mb-1">
                            {item.title}
                          </h3>

                          <p className="text-xs text-[#64748B] flex items-center gap-1 mb-2">
                            <MapPin className="w-3.5 h-3.5 text-[#C76B45]" />
                            <span className="text-[#263238] font-medium">{item.location}</span>
                            {item.landmark && <span className="text-[#64748B]">({item.landmark})</span>}
                          </p>

                          <p className="text-xs text-[#263238]/85 leading-relaxed bg-[#FAF7F0] p-3 rounded-xl border border-[#E8E3D7] mb-2">
                            {item.description}
                          </p>

                          {item.notes && (
                            <p className="text-[11px] text-[#64748B] italic">
                              Contributor Tip: "{item.notes}"
                            </p>
                          )}
                        </div>

                        {/* Admin Action Buttons */}
                        <div className="flex flex-row md:flex-col gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#E8E3D7]">
                          <button
                            onClick={() =>
                              setModerationActionModal({ item, action: 'approve' })
                            }
                            className="text-xs font-semibold py-2 px-3.5 rounded-lg bg-[#2E7D5B] hover:bg-[#246549] text-white shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Approve</span>
                          </button>

                          <button
                            onClick={() =>
                              setModerationActionModal({ item, action: 'request-changes' })
                            }
                            className="text-xs font-semibold py-2 px-3 rounded-lg bg-[#FEF8ED] hover:bg-[#FCECCB] text-[#B7791F] border border-[#F6E1B6] flex items-center justify-center gap-1.5 transition-all active:scale-95"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-[#B7791F]" />
                            <span>Request Changes</span>
                          </button>

                          <button
                            onClick={() =>
                              setModerationActionModal({ item, action: 'reject' })
                            }
                            className="text-xs font-semibold py-2 px-3 rounded-lg bg-[#FDF2F1] hover:bg-[#F8D4D2] text-[#C2413B] border border-[#F8D0CD] flex items-center justify-center gap-1.5 transition-all active:scale-95"
                          >
                            <X className="w-3.5 h-3.5 text-[#C2413B]" />
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

        {/* ==================================================================
            ADMIN TAB 2: AUDIT & HISTORY LOG
            ================================================================== */}
        {isAdmin && activeTab === 'history' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 border border-[#E8E3D7] shadow-sm">
              <h3 className="font-display font-bold text-base text-[#263238] mb-1">
                Moderation Decisions Audit Log
              </h3>
              <p className="text-xs text-[#64748B] mb-4">
                Historical record of approved, rejected, and feedback-requested community submissions.
              </p>

              <div className="divide-y divide-[#E8E3D7]">
                {moderationQueue.map((item, idx) => (
                  <div key={item.id} className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-profile-enter stagger-${(idx % 6) + 1}`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#263238]">{item.title}</span>
                        <span className="text-[10px] text-[#64748B] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#E8E3D7]">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-xs text-[#64748B]">
                        {item.location} • Submitted by <strong className="text-[#263238]">{item.submittedBy}</strong>
                      </span>
                    </div>

                    <span
                      className={`self-start sm:self-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.status === 'Approved'
                          ? 'bg-[#EDF7F2] text-[#2E7D5B] border border-[#C5E6D4]'
                          : item.status === 'Needs Changes'
                          ? 'bg-[#FEF8ED] text-[#B7791F] border border-[#F6E1B6]'
                          : item.status === 'Rejected'
                          ? 'bg-[#FDF2F1] text-[#C2413B] border border-[#F8D0CD]'
                          : 'bg-[#FAF7F0] text-[#64748B] border border-[#E8E3D7]'
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

        {/* ==================================================================
            ADMIN TAB 3: SYSTEM INFRASTRUCTURE
            ================================================================== */}
        {isAdmin && activeTab === 'system' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-[#E8E3D7] shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#155E63]" />
                  <h4 className="font-display font-bold text-sm text-[#263238]">
                    Supabase Database Engine
                  </h4>
                </div>
                <div className="text-xs space-y-2 text-[#64748B]">
                  <div className="flex justify-between border-b border-[#FAF7F0] pb-1.5">
                    <span>Host:</span>
                    <span className="font-mono text-[11px] text-[#263238]">jxtmvfamgyrmnlzfgfwq.supabase.co</span>
                  </div>
                  <div className="flex justify-between border-b border-[#FAF7F0] pb-1.5">
                    <span>Table Status:</span>
                    <span className="text-[#2E7D5B] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D5B]" />
                      Connected
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Table:</span>
                    <span className="font-mono text-[11px] text-[#263238]">public.trip_inputs</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E8E3D7] shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#C76B45]" />
                  <h4 className="font-display font-bold text-sm text-[#263238]">
                    FastAPI ML & Routing Backend
                  </h4>
                </div>
                <div className="text-xs space-y-2 text-[#64748B]">
                  <div className="flex justify-between border-b border-[#FAF7F0] pb-1.5">
                    <span>API Endpoint:</span>
                    <span className="font-mono text-[11px] text-[#263238]">http://127.0.0.1:8000/api</span>
                  </div>
                  <div className="flex justify-between border-b border-[#FAF7F0] pb-1.5">
                    <span>Health Probe:</span>
                    <span className="text-[#2E7D5B] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D5B]" />
                      Online
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Routing Engine:</span>
                    <span className="text-[#263238] font-medium">OpenStreetMap / OSRM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            COMMON TAB: ACCOUNT SETTINGS & CREDENTIALS
            ================================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn max-w-2xl">
            <div className="bg-white rounded-2xl p-6 border border-[#E8E3D7] shadow-sm space-y-4">
              <h3 className="font-display font-bold text-base text-[#263238] border-b border-[#E8E3D7] pb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#155E63]" />
                <span>Account Credentials & Security</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3.5 bg-[#FAF7F0] rounded-xl border border-[#E8E3D7]">
                  <div>
                    <span className="font-bold text-[#263238] block">Authenticated User ID</span>
                    <span className="text-[#64748B] font-mono text-[11px]">{authenticatedUser?.id}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#155E63] bg-[#EBF4F5] px-2.5 py-0.5 rounded-full border border-[#C2DFE1]">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#FAF7F0] rounded-xl border border-[#E8E3D7]">
                  <div>
                    <span className="font-bold text-[#263238] block">Verified Email</span>
                    <span className="text-[#64748B] font-mono text-[11px]">{authenticatedUser?.email}</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D5B]" />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#FAF7F0] rounded-xl border border-[#E8E3D7]">
                  <div>
                    <span className="font-bold text-[#263238] block">Assigned Role</span>
                    <span className="text-[#64748B] font-medium capitalize">
                      {userRole} {isAdmin ? '(Full Moderation & Audit Privileges)' : '(Standard Community Explorer)'}
                    </span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                    isAdmin ? 'bg-[#FEF8ED] text-[#B7791F] border border-[#F6E1B6]' : 'bg-[#EBF4F5] text-[#155E63] border border-[#C2DFE1]'
                  }`}>
                    {userRole}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#FAF7F0] rounded-xl border border-[#E8E3D7]">
                  <div>
                    <span className="font-bold text-[#263238] block">Session Source</span>
                    <span className="text-[#64748B] font-mono text-[11px]">
                      {sessionSource === 'supabase' ? 'Supabase JWT Session' : 'Local Trusted Session Store'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#2E7D5B] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E3D7] flex items-center justify-between">
                <span className="text-xs text-[#64748B]">
                  Ready to conclude your session?
                </span>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center font-semibold text-[#C2413B] bg-white hover:bg-[#FDF2F1] hover:border-[#F8D0CD] border border-[#E8E3D7] active:scale-[0.98] transition-all duration-200 rounded-lg px-4 py-2 text-xs gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ====================================================================
          EDIT PROFILE MODAL
          ==================================================================== */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#263238]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E3D7] animate-scaleIn">
            <div className="flex items-center justify-between border-b border-[#E8E3D7] pb-3 mb-4">
              <h3 className="font-display font-bold text-lg text-[#263238]">
                Edit Profile Information
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="w-8 h-8 rounded-full hover:bg-[#FAF7F0] text-[#64748B] hover:text-[#263238] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#263238] uppercase mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="bg-white border border-[#E8E3D7] text-[#263238] placeholder:text-[#94A3B8] rounded-xl px-4 py-2.5 text-xs w-full outline-none focus:border-[#155E63] focus:ring-2 focus:ring-[#155E63]/20 transition-all duration-150"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263238] uppercase mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="bg-white border border-[#E8E3D7] text-[#263238] placeholder:text-[#94A3B8] rounded-xl px-4 py-2.5 text-xs w-full outline-none focus:border-[#155E63] focus:ring-2 focus:ring-[#155E63]/20 transition-all duration-150"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263238] uppercase mb-1">
                  Community Bio
                </label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="bg-white border border-[#E8E3D7] text-[#263238] placeholder:text-[#94A3B8] rounded-xl px-4 py-2.5 text-xs w-full outline-none focus:border-[#155E63] focus:ring-2 focus:ring-[#155E63]/20 transition-all duration-150 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E3D7]">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="inline-flex items-center justify-center font-semibold text-[#263238] bg-white hover:bg-[#FAF7F0] border border-[#E8E3D7] rounded-lg px-4 py-2 text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center font-semibold text-white bg-[#155E63] hover:bg-[#0E474B] active:scale-[0.98] transition-all duration-200 rounded-lg px-5 py-2 text-xs shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODERATION ACTION MODAL (Admin Only)
          ==================================================================== */}
      {isAdmin && moderationActionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#263238]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E3D7] animate-scaleIn">
            <h3 className="font-display font-bold text-base text-[#263238] mb-1">
              Confirm Moderation Decision
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              You are applying an action to <strong className="text-[#263238]">"{moderationActionModal.item.title}"</strong>.
            </p>

            {moderationActionModal.action === 'approve' ? (
              <div className="p-3.5 bg-[#EDF7F2] rounded-xl border border-[#C5E6D4] text-xs text-[#2E7D5B] mb-4">
                This submission will be marked as <strong>Approved</strong> and added to the community discovery feed.
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <label className="block text-xs font-bold text-[#263238] uppercase">
                  Reason / Feedback Note <span className="text-[#C76B45]">*</span>
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
                  className="bg-white border border-[#E8E3D7] text-[#263238] placeholder:text-[#94A3B8] rounded-xl px-4 py-2.5 text-xs w-full outline-none focus:border-[#C76B45] focus:ring-2 focus:ring-[#C76B45]/20 transition-all duration-150 resize-none"
                  required
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E3D7]">
              <button
                type="button"
                onClick={() => {
                  setModerationActionModal(null);
                  setActionReason('');
                }}
                disabled={isProcessingAction}
                className="inline-flex items-center justify-center font-semibold text-[#263238] bg-white hover:bg-[#FAF7F0] border border-[#E8E3D7] rounded-lg px-4 py-2 text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteModeration}
                disabled={isProcessingAction}
                className={`text-xs font-semibold py-2 px-4 rounded-lg text-white flex items-center gap-1.5 shadow-sm active:scale-95 transition-all ${
                  moderationActionModal.action === 'approve'
                    ? 'bg-[#2E7D5B] hover:bg-[#246549]'
                    : moderationActionModal.action === 'request-changes'
                    ? 'bg-[#B7791F] hover:bg-[#9A6417]'
                    : 'bg-[#C2413B] hover:bg-[#A63530]'
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

      {/* ====================================================================
          VIEW CONTRIBUTION DETAILS MODAL
          ==================================================================== */}
      {selectedContributionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#263238]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E3D7] animate-scaleIn">
            <div className="flex items-center justify-between border-b border-[#E8E3D7] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold text-[#155E63] uppercase bg-[#EBF4F5] px-2 py-0.5 rounded border border-[#C2DFE1]">
                  {selectedContributionModal.category}
                </span>
                <h3 className="font-display font-bold text-lg text-[#263238] mt-1">
                  {selectedContributionModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedContributionModal(null)}
                className="w-8 h-8 rounded-full hover:bg-[#FAF7F0] text-[#64748B] hover:text-[#263238] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#64748B]">
              <div className="flex items-center justify-between p-2.5 bg-[#FAF7F0] rounded-xl border border-[#E8E3D7]">
                <span className="font-semibold text-[#263238]">Current Status:</span>
                <span className={`font-bold px-2 py-0.5 rounded-full ${
                  selectedContributionModal.status === 'Approved'
                    ? 'bg-[#EDF7F2] text-[#2E7D5B]'
                    : selectedContributionModal.status === 'Pending'
                    ? 'bg-[#FEF8ED] text-[#B7791F]'
                    : 'bg-[#FDF2F1] text-[#C2413B]'
                }`}>
                  {selectedContributionModal.status}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#FAF7F0] rounded-xl border border-[#E8E3D7]">
                <span className="font-semibold text-[#263238]">Location:</span>
                <span className="text-[#263238]">{selectedContributionModal.location}</span>
              </div>
              <div>
                <span className="font-semibold text-[#263238] block mb-1">Description:</span>
                <p className="p-3.5 bg-[#FAF7F0] border border-[#E8E3D7] rounded-xl leading-relaxed text-[#263238]/85">
                  {selectedContributionModal.description}
                </p>
              </div>
              {selectedContributionModal.feedback && (
                <div>
                  <span className="font-semibold text-[#263238] block mb-1">Moderator Review Note:</span>
                  <p className="p-3.5 bg-[#FEF8ED] border border-[#F6E1B6] text-[#B7791F] rounded-xl leading-relaxed">
                    {selectedContributionModal.feedback}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-[#E8E3D7] mt-4">
              <button
                onClick={() => setSelectedContributionModal(null)}
                className="inline-flex items-center justify-center font-semibold text-[#263238] bg-white hover:bg-[#FAF7F0] border border-[#E8E3D7] rounded-lg px-4 py-2 text-xs transition-colors"
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
