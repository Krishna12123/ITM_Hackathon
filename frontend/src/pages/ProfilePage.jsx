import React, { useState, useMemo } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { MOCK_DESTINATIONS, MOCK_EXPERIENCES } from '../data/mockData';

// Initial Mock Contributions submitted by this user
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
  favorites,
  onToggleFavorite,
  tripItems,
  onToggleTrip,
  onNavigateToPlace,
  onNavigateToExperiences,
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('contributions'); // 'contributions' | 'saved' | 'experiences' | 'moderation'
  const [isModeratorView, setIsModeratorView] = useState(false);

  // Profile Information State (Demo User)
  const [profile, setProfile] = useState({
    name: 'Bhavna Sharma',
    handle: '@bhavna_explorer',
    role: 'Community Storyteller & Verified Verifier',
    bio: 'Heritage and community tourism scout exploring Bundelkhand & North-East India. Passionate about folk oral traditions, rural farming homestays, and reviving indigenous crafts.',
    location: 'Madhya Pradesh, India',
    joined: 'October 2026'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });

  // Contributions State
  const [myContributions, setMyContributions] = useState(INITIAL_CONTRIBUTIONS);
  const [contributionSearch, setContributionSearch] = useState('');
  const [contributionStatusFilter, setContributionStatusFilter] = useState('All');

  // Moderation Queue State
  const [moderationQueue, setModerationQueue] = useState(INITIAL_MODERATION_QUEUE);
  const [moderationSearch, setModerationSearch] = useState('');
  const [moderationCategoryFilter, setModerationCategoryFilter] = useState('All');
  const [moderationActionModal, setModerationActionModal] = useState(null); // { item, action: 'approve' | 'request-changes' | 'reject' }
  const [actionReason, setActionReason] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Selected contribution for inspection modal
  const [selectedContributionModal, setSelectedContributionModal] = useState(null);

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

  // Filter Moderation Queue
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

  // Handle Profile Update
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile({ ...editForm });
    setIsEditingProfile(false);
    if (onShowToast) {
      onShowToast('Profile updated successfully! (Demo data saved)');
    }
  };

  // Handle Moderation Action
  const handleExecuteModeration = () => {
    if (!moderationActionModal) return;
    const { item, action } = moderationActionModal;

    if ((action === 'request-changes' || action === 'reject') && !actionReason.trim()) {
      alert('Please provide a reason or note for this moderation action.');
      return;
    }

    setIsProcessingAction(true);

    setTimeout(() => {
      setIsProcessingAction(false);
      let updatedStatus = 'Approved';
      let toastMsg = `Approved "${item.title}" for community discovery!`;

      if (action === 'request-changes') {
        updatedStatus = 'Needs Changes';
        toastMsg = `Changes requested for "${item.title}". Feedback sent to contributor.`;
      } else if (action === 'reject') {
        updatedStatus = 'Rejected';
        toastMsg = `Submission "${item.title}" rejected. Reason logged.`;
      }

      setModerationQueue((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, status: updatedStatus } : m))
      );

      setModerationActionModal(null);
      setActionReason('');

      if (onShowToast) {
        onShowToast(toastMsg);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-canvas pb-20 animate-fadeInUp">
      {/* 2. Profile Overview Header */}
      <section className="bg-gradient-to-b from-card to-canvas border-b border-border-subtle pt-8 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-xl p-6 sm:p-8 border border-border-subtle shadow-level-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left Profile Identity */}
              <div className="flex items-start sm:items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-primary to-secondary text-white font-display font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-md">
                    BS
                  </div>
                  <div
                    className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-tertiary text-white flex items-center justify-center border-2 border-white shadow-sm"
                    title="Verified Community Scout"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                      {profile.name}
                    </h1>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      Demo Profile
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-500 mt-0.5">{profile.role}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Joined {profile.joined}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Profile Actions & Demo Mode Toggle */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="btn-secondary text-xs sm:text-sm py-2 px-4 flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4 text-slate-600" />
                  <span>Edit Profile</span>
                </button>

                {/* Moderator Access Switcher */}
                <div className="p-1.5 bg-subtle rounded-lg border border-border-subtle flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-600 font-semibold px-2">Role:</span>
                  <button
                    onClick={() => {
                      setIsModeratorView(false);
                      if (activeTab === 'moderation') setActiveTab('contributions');
                    }}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      !isModeratorView
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Contributor
                  </button>
                  <button
                    onClick={() => {
                      setIsModeratorView(true);
                      setActiveTab('moderation');
                    }}
                    className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                      isModeratorView
                        ? 'bg-tertiary text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Moderator</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Bio */}
            <p className="text-xs sm:text-sm text-slate-600 mt-4 pt-4 border-t border-slate-100 leading-relaxed max-w-3xl">
              {profile.bio}
            </p>

            {/* Metrics Counters Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-100 text-center">
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
                  Saved Places
                </span>
                <span className="font-display font-extrabold text-xl text-primary mt-0.5 block">
                  {favorites.length}
                </span>
              </div>

              <div className="p-3 bg-canvas rounded-lg border border-border-subtle">
                <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">
                  Queued in Trip
                </span>
                <span className="font-display font-extrabold text-xl text-tertiary mt-0.5 block">
                  {tripItems.length}
                </span>
              </div>

              <div className="p-3 bg-canvas rounded-lg border border-border-subtle">
                <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">
                  Pending Reviews
                </span>
                <span className="font-display font-extrabold text-xl text-secondary mt-0.5 block">
                  {pendingModerationCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Profile Tabs Navigation */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-border-subtle overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => setActiveTab('contributions')}
            className={`px-4 py-2.5 rounded-t-lg text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'contributions'
                ? 'border-primary text-primary bg-card'
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
                ? 'border-primary text-primary bg-card'
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
                ? 'border-primary text-primary bg-card'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Luggage className="w-4 h-4" />
            <span>My Trip Queue ({tripItems.length})</span>
          </button>

          {isModeratorView && (
            <button
              onClick={() => setActiveTab('moderation')}
              className={`px-4 py-2.5 rounded-t-lg text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'moderation'
                  ? 'border-tertiary text-tertiary bg-card'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Moderation Queue</span>
              {pendingModerationCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-secondary text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {pendingModerationCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Tab 1: My Contributions */}
        {activeTab === 'contributions' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Search & Filters for Contributions */}
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

            {/* Contributions Cards List */}
            {filteredContributions.length === 0 ? (
              <div className="bg-card rounded-xl border border-dashed border-border-subtle p-12 text-center max-w-md mx-auto shadow-level-1">
                <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="font-display font-bold text-base text-slate-800">
                  No contributions found
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  {contributionSearch || contributionStatusFilter !== 'All'
                    ? 'No contributions matched your filter criteria.'
                    : "You haven't contributed any hidden gems yet."}
                </p>
                <button
                  onClick={() => {
                    setContributionSearch('');
                    setContributionStatusFilter('All');
                  }}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredContributions.map((item) => {
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" />
                      Pending Review
                    </span>
                  );
                  if (item.status === 'Approved') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Approved
                      </span>
                    );
                  } else if (item.status === 'Needs Changes') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        Needs Changes
                      </span>
                    );
                  }

                  return (
                    <div
                      key={item.id}
                      className="bg-card rounded-xl p-5 border border-border-subtle shadow-level-1 hover:shadow-level-2 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-subtle text-slate-600">
                            {item.category}
                          </span>
                          {statusBadge}
                        </div>

                        <h3 className="font-display font-bold text-base text-slate-900 mb-1">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span>{item.location}</span>
                          <span className="text-slate-300">•</span>
                          <span>{item.date}</span>
                        </p>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                          {item.description}
                        </p>

                        {item.feedback && (
                          <div className="p-2.5 bg-subtle rounded-md border border-slate-200/70 text-[11px] text-slate-600">
                            <span className="font-semibold text-slate-700">Moderator note: </span>
                            {item.feedback}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">ID: {item.id}</span>
                        <button
                          onClick={() => setSelectedContributionModal(item)}
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          <span>View Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Wishlist Bookmarks */}
        {activeTab === 'saved' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg text-slate-900">
                  Wishlist Bookmarks & Saved Gems
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Persisted
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Saved destinations and authentic experiences you plan to explore later. Automatically synced and saved to your browser session.
              </p>
            </div>

            {favorites.length === 0 ? (
              <div className="bg-card rounded-xl border border-dashed border-border-subtle p-12 text-center max-w-md mx-auto shadow-level-1">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Heart className="w-6 h-6 fill-primary/30 text-primary" />
                </div>
                <h3 className="font-display font-bold text-base text-slate-800">
                  Your wishlist has no bookmarks yet
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Browse destinations or community experiences and tap the heart or bookmark icon to save them for later.
                </p>
                <button
                  onClick={onNavigateToExperiences}
                  className="btn-primary text-xs py-2 px-5"
                >
                  Browse Experiences & Destinations
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Saved Destinations */}
                {savedDestinations.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Destinations ({savedDestinations.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {savedDestinations.map((dest) => (
                        <div
                          key={dest.id}
                          className="bg-card rounded-xl border border-border-subtle shadow-level-1 overflow-hidden flex flex-col sm:flex-row items-stretch"
                        >
                          <img
                            src={dest.heroImage}
                            alt={dest.name}
                            className="w-full sm:w-40 h-36 object-cover"
                          />
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-tertiary uppercase">
                                Destination
                              </span>
                              <h4 className="font-display font-bold text-sm text-slate-900">
                                {dest.name}
                              </h4>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-primary" />
                                {dest.location}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                              <button
                                onClick={onNavigateToPlace}
                                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                              >
                                <span>Open Details</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onToggleFavorite(dest.id)}
                                className="text-xs text-slate-400 hover:text-red-600 transition-colors py-1.5 px-2 flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Saved Experiences */}
                {savedExperiences.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Experiences ({savedExperiences.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {savedExperiences.map((exp) => (
                        <div
                          key={exp.id}
                          className="bg-card rounded-xl border border-border-subtle shadow-level-1 overflow-hidden flex flex-col sm:flex-row items-stretch"
                        >
                          <img
                            src={exp.image}
                            alt={exp.title}
                            className="w-full sm:w-40 h-36 object-cover"
                          />
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-primary uppercase">
                                {exp.category}
                              </span>
                              <h4 className="font-display font-bold text-sm text-slate-900">
                                {exp.title}
                              </h4>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-primary" />
                                {exp.location}
                              </p>
                              <span className="text-xs font-semibold text-slate-800 block mt-1">
                                ₹{exp.price} <span className="font-normal text-slate-400">(demo)</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                              <button
                                onClick={onNavigateToExperiences}
                                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                              >
                                <span>View Experience</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onToggleFavorite(exp.id)}
                                className="text-xs text-slate-400 hover:text-red-600 transition-colors py-1.5 px-2 flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Experiences (Added to Trip Queue) */}
        {activeTab === 'experiences' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900 mb-1">
                Experiences Queued in My Trip Plan
              </h2>
              <p className="text-xs text-slate-500">
                These community items are currently in your active trip itinerary waiting for AI route generation.
              </p>
            </div>

            {tripItems.length === 0 ? (
              <div className="bg-card rounded-xl border border-dashed border-border-subtle p-12 text-center max-w-md mx-auto shadow-level-1">
                <Luggage className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="font-display font-bold text-base text-slate-800">
                  Your trip queue is empty
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Browse authentic village walks, food tastings, and craft sessions to queue them into your plan.
                </p>
                <button
                  onClick={onNavigateToExperiences}
                  className="btn-primary text-xs py-2 px-4"
                >
                  Explore Experiences
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tripItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-card rounded-xl border border-border-subtle shadow-level-1 flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.image || item.heroImage}
                      alt={item.title || item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-primary uppercase block">
                        {item.category || 'Destination'}
                      </span>
                      <h4 className="font-display font-bold text-sm text-slate-900 truncate">
                        {item.title || item.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        {item.duration && <span>{item.duration}</span>}
                        {item.price && <span className="font-bold text-slate-800">₹{item.price}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => onToggleTrip(item)}
                      className="text-xs text-red-500 hover:text-red-700 p-2"
                      title="Remove from trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Moderation Review Queue (Demo Mode) */}
        {isModeratorView && activeTab === 'moderation' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-tertiary uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Community Verifier Moderation Queue</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Community verifiers audit submitted hidden gems before publishing them to the YatraSaathi AI trip recommendation engine.
                </p>
              </div>
              <span className="text-[11px] font-bold text-tertiary bg-white px-3 py-1 rounded-full border border-teal-200 shadow-sm whitespace-nowrap self-start sm:self-auto">
                Demo Moderation Mode
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
                  placeholder="Search queue by gem title, location, or contributor..."
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
                        ? 'bg-tertiary text-white shadow-sm'
                        : 'bg-card text-slate-600 hover:bg-subtle border border-border-subtle'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Queue List */}
            {filteredModerationQueue.length === 0 ? (
              <div className="bg-card rounded-xl border border-dashed border-border-subtle p-12 text-center max-w-md mx-auto shadow-level-1">
                <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="font-display font-bold text-base text-slate-800">
                  No submissions in review queue
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  All community suggestions have been audited or no submissions match your filter.
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
                {filteredModerationQueue.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card rounded-xl p-5 border border-border-subtle shadow-level-1 hover:shadow-level-2 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider bg-tertiary/10 px-2.5 py-0.5 rounded">
                            {item.category}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">Submitted by <strong>{item.submittedBy}</strong></span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-400">{item.date}</span>
                          <span
                            className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              item.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'Needs Changes'
                                ? 'bg-amber-100 text-amber-800'
                                : item.status === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            Status: {item.status}
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

                      {/* Moderation Actions Column */}
                      <div className="flex flex-row md:flex-col gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <button
                          onClick={() =>
                            setModerationActionModal({ item, action: 'approve' })
                          }
                          disabled={item.status === 'Approved'}
                          className={`text-xs font-semibold py-2 px-3 rounded flex items-center justify-center gap-1 transition-all ${
                            item.status === 'Approved'
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          }`}
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
      </main>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card rounded-xl max-w-lg w-full p-6 shadow-level-3 border border-border-subtle animate-scaleIn">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Edit Demo Profile
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

              <div className="p-2.5 bg-amber-50 rounded-md border border-amber-200 text-xs text-amber-800">
                <strong>Demo notice:</strong> Profile changes update the local session state for the hackathon MVP.
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

      {/* Moderation Confirmation Modal */}
      {moderationActionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card rounded-xl max-w-md w-full p-6 shadow-level-3 border border-border-subtle animate-scaleIn">
            <h3 className="font-display font-bold text-base text-slate-900 mb-1">
              Confirm Moderation Action
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
