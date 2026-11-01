import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Sparkles,
  AlertCircle,
  ArrowRight,
  MapPin,
  Compass,
  Calendar,
  Utensils,
  Music,
  Palette,
  Footprints,
  Mountain,
  Flame,
  Star,
  CheckCircle2,
  Users,
  ShieldCheck,
  Award,
  Route,
  Share2,
  Heart
} from 'lucide-react';
import { CATEGORIES, MOCK_EXPERIENCES, STATE_THEMES, STATE_SPECIALITIES } from '../data/mockData';
import ExperienceCard from '../components/ExperienceCard';
import ExperienceDetailModal from '../components/ExperienceDetailModal';
import StateSpecialitySection from '../components/StateSpecialitySection';

// 6 Popular Indian Destinations
const POPULAR_DESTINATIONS = [
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    stateId: 'rajasthan',
    tagline: 'Heritage forts, desert life & timeless royal artistry',
    description: 'Immerse in grand sandstone ramparts, desert ballads under starlit dunes, and royal haveli craftsmanship.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80',
    badge: 'Royal Heritage',
    stats: '12 Experiences',
    isSupportedState: true
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    stateId: 'gujarat',
    tagline: 'Textiles, craftsmanship & boundless white salt plains',
    description: 'Venture through the Great Rann of Kutch, discover stepwell architecture, and master Rogan & Ajrakh art.',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=900&q=80',
    badge: 'Vibrant Culture',
    stats: '10 Experiences',
    isSupportedState: true
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    stateId: 'west-bengal',
    tagline: 'Living literature, mist-kissed tea estates & mangrove forests',
    description: 'Wander along historic Kolkata tram lanes, Bishnupur terracotta temple trails, and Himalayan tea gardens.',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=900&q=80',
    badge: 'Art & Literature',
    stats: '14 Experiences',
    isSupportedState: true
  },
  {
    id: 'assam',
    name: 'Assam',
    stateId: 'assam',
    tagline: 'Brahmaputra river life, wildlife sanctuaries & lush tea valleys',
    description: 'Discover the freshwater island of Majuli, one-horned rhinos in Kaziranga, and rhythmic Bihu music.',
    image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=900&q=80',
    badge: 'Nature & Traditions',
    stats: '8 Experiences',
    isSupportedState: true
  },
  {
    id: 'kerala',
    name: 'Kerala',
    stateId: 'kerala',
    tagline: 'Backwaters, spice plantations & coastal folklore',
    description: 'Glide through tranquil palm-fringed backwaters, sample spice harvests with native families, and witness Kathakali.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80',
    badge: "God's Own Country",
    stats: 'Featured Region',
    isSupportedState: false,
    spotlight: {
      highlights: [
        'Alleppey & Kumarakom canal canoe trails',
        'Wayanad ancestral spice & coffee estates',
        'Kathakali & Theyyam temple ritual recitals',
        'Traditional organic banana-leaf sadhya cooking'
      ]
    }
  },
  {
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    stateId: 'himachal-pradesh',
    tagline: 'Snow-crested trails, cliffside monasteries & apple orchards',
    description: 'Trek ancient cedar pathways, discover cliffside Buddhist monasteries in Spiti, and stay in rustic mountain homes.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
    badge: 'Himalayan Sanctuary',
    stats: 'Featured Region',
    isSupportedState: false,
    spotlight: {
      highlights: [
        'Spiti & Kinnaur thousand-year monastery walks',
        'Himachali Siddu & Dham culinary masterclass',
        'High-altitude apple orchard seasonal harvest',
        'Eco-trails through Great Himalayan National Park'
      ]
    }
  }
];

// 6 Community Tourism Experience Categories
const COMMUNITY_CATEGORIES = [
  {
    title: 'Local Food & Culinary Secrets',
    categoryKey: 'Local Food',
    desc: 'Heirloom family recipes, clay hearths & street food secrets',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    icon: Utensils,
    count: '15+ Hosts'
  },
  {
    title: 'Folk Performances & Traditional Music',
    categoryKey: 'Folk Dance & Music',
    desc: 'Desert ballads, Baul poetry & tribal folk circles',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80',
    icon: Music,
    count: '8+ Troupes'
  },
  {
    title: 'Art & Artisan Workshops',
    categoryKey: 'Handicrafts & Workshops',
    desc: 'Hands-on pottery, block printing, weaving & terracotta',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    icon: Palette,
    count: '12+ Masters'
  },
  {
    title: 'Heritage Walks & Untold Histories',
    categoryKey: 'Heritage & Cultural Walks',
    desc: 'Ancient stepwells, hidden cenotaphs & oral chronicles',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
    icon: Footprints,
    count: '10+ Trails'
  },
  {
    title: 'Nature, Lakes & Mountain Trails',
    categoryKey: 'Nature & Adventure',
    desc: 'Mangrove boat safaris, sacred groves & alpine paths',
    image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=600&q=80',
    icon: Mountain,
    count: '9+ Expeditions'
  },
  {
    title: 'Local Festivals & Fairs',
    categoryKey: 'Festivals & Traditions',
    desc: 'Seasonal harvest feasts, village melas & temple celebrations',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80',
    icon: Flame,
    count: '6+ Annual Fairs'
  }
];

// Community Traveler Testimonials
const COMMUNITY_TESTIMONIALS = [
  {
    id: 1,
    name: 'Aarav & Meera Sen',
    city: 'Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'Heritage Explorers',
    quote: 'Visiting the remote pottery village near Jaipur was magical. We spent three hours with Master Ramdas at his wheel. Not a single tour bus in sight—just real craft.',
    experience: 'Blue Pottery Artisan Circle',
    location: 'Sanganer, Rajasthan',
    rating: 5
  },
  {
    id: 2,
    name: 'Devika Sharma',
    city: 'New Delhi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    role: 'Culinary Enthusiast',
    quote: 'The Bundelkhand food walk opened our eyes to culinary heritage that never makes it to big restaurants. The homemade bafla and spiced kadhi were incredible.',
    experience: 'Bundelkhand Heritage Food Walk',
    location: 'Orchha, Bundelkhand',
    rating: 5
  },
  {
    id: 3,
    name: 'Rohan & Priya Mukherjee',
    city: 'Kolkata',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'Adventure Photographers',
    quote: 'YaatraSaathi’s community tips led us to master Rogan painters in Nirona village. Seeing 300-year-old castor oil dye art practiced with passion was extraordinary.',
    experience: 'Kutch Rogan & Bell Art Trail',
    location: 'Nirona, Gujarat',
    rating: 5
  }
];

export default function ExperiencesPage({
  favorites = [],
  onToggleFavorite,
  tripItems = [],
  onToggleTrip,
  onNavigateToPlace,
  onNavigateToState,
  onNavigate
}) {
  // Search & filter states
  const [searchInput, setSearchInput] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Experiences');
  const [selectedState, setSelectedState] = useState('all');
  const [activeModalExperience, setActiveModalExperience] = useState(null);
  const [spotlightState, setSpotlightState] = useState(null);

  // Active state theme object
  const activeStateTheme = useMemo(() => {
    return STATE_THEMES.find((s) => s.id === selectedState) || null;
  }, [selectedState]);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    if (!val.trim()) {
      setAppliedQuery('');
    }
  };

  // Perform search on button click or form submit
  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setAppliedQuery(searchInput.trim());
    // Smooth scroll down to results
    const el = document.getElementById('curated-experiences-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setAppliedQuery('');
  };

  const handleClearAllFilters = () => {
    setSearchInput('');
    setAppliedQuery('');
    setSelectedCategory('All Experiences');
    setSelectedState('all');
  };

  // Category filter trigger with smooth scroll
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    const el = document.getElementById('curated-experiences-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Semantic category matching helper
  const matchesCategory = (itemCategory, targetCategory) => {
    if (!targetCategory || targetCategory === 'All Experiences') return true;
    if (!itemCategory) return false;

    const item = itemCategory.toLowerCase().trim();
    const target = targetCategory.toLowerCase().trim();

    if (item === target) return true;
    if (item.includes(target) || target.includes(item)) return true;

    if (target.includes('food') && (item.includes('food') || item.includes('culinary') || item.includes('hearth') || item.includes('feast') || item.includes('snack'))) return true;
    if (target.includes('craft') && (item.includes('craft') || item.includes('pottery') || item.includes('weaving') || item.includes('artisan') || item.includes('bell') || item.includes('print'))) return true;
    if ((target.includes('hidden') || target.includes('place')) && (item.includes('hidden') || item.includes('place') || item.includes('ruin') || item.includes('cenotaph') || item.includes('chhattri') || item.includes('stepwell'))) return true;
    if (target.includes('village') && (item.includes('village') || item.includes('rural') || item.includes('homestay') || item.includes('terrace') || item.includes('farming'))) return true;
    if ((target.includes('heritage') || target.includes('culture') || target.includes('folk')) &&
        (item.includes('heritage') || item.includes('culture') || item.includes('folk') || item.includes('music') || item.includes('dance') || item.includes('performance') || item.includes('story'))) return true;
    if ((target.includes('walk') || target.includes('trail')) &&
        (item.includes('walk') || item.includes('heritage') || item.includes('tram'))) return true;
    if ((target.includes('nature') || target.includes('adventure')) &&
        (item.includes('nature') || item.includes('adventure') || item.includes('safari') || item.includes('kayak') || item.includes('desert') || item.includes('walk'))) return true;
    if ((target.includes('festival') || target.includes('tradition')) &&
        (item.includes('festival') || item.includes('tradition') || item.includes('garba') || item.includes('bihu') || item.includes('utsav'))) return true;

    return false;
  };

  // Filter experiences based on state, category, and search query
  const filteredExperiences = useMemo(() => {
    return MOCK_EXPERIENCES.filter((item) => {
      const matchesState = selectedState === 'all' || item.stateId === selectedState;
      const catMatch = matchesCategory(item.category, selectedCategory);
      const q = appliedQuery.toLowerCase().trim();
      const searchMatch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.shortDescription && item.shortDescription.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.state && item.state.toLowerCase().includes(q)) ||
        (item.host?.name && item.host.name.toLowerCase().includes(q)) ||
        (item.badge && item.badge.toLowerCase().includes(q)) ||
        (item.highlights && item.highlights.some((h) => h.toLowerCase().includes(q)));

      return matchesState && catMatch && searchMatch;
    });
  }, [appliedQuery, selectedCategory, selectedState]);

  return (
    <div className="min-h-screen bg-[#FFF8EF] text-[#38291F] pb-24">
      {/* ========================================================================= */}
      {/* B. DESTINATION HERO SECTION                                               */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-[#38291F] py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 border-b border-[#E7C9A5]/30">
        {/* Destination Hero Photographic Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2200&q=85"
            alt="Scenic Indian Heritage Landscape"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Multi-layered cinematic dark warm overlay for high text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#38291F] via-[#38291F]/75 to-[#38291F]/50" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs font-bold tracking-wider uppercase shadow-md bg-[#F36B21] border border-[#F36B21]/30 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>COMMUNITY-POWERED INDIAN TOURISM</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight sm:leading-none drop-shadow-md animate-fadeInUp">
            Discover India Beyond <br className="hidden sm:inline" />
            <span className="text-[#E7C9A5]">the Ordinary.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-slate-200 text-sm sm:text-lg sm:leading-relaxed font-medium drop-shadow-sm animate-fadeInUp">
            Explore hidden gems, experience local culture, and travel with the people who know it best.
          </p>

          {/* Search Box */}
          <div className="pt-2 max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search destinations, experiences, crafts, local food…"
                  className="w-full pl-11 pr-10 py-3.5 text-sm sm:text-base bg-white/95 backdrop-blur-md text-[#38291F] placeholder-slate-400 rounded-xl border border-white/40 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F36B21]"
                  aria-label="Search destinations and experiences"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search text"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="py-3.5 px-6 rounded-xl bg-[#F36B21] hover:bg-[#D94E0B] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 shrink-0 active:scale-95 transition-all duration-200"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Search</span>
              </button>
            </form>
          </div>

          {/* Dual Call-to-action buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('popular-destinations');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-3 px-6 rounded-xl bg-white hover:bg-[#FFF8EF] text-[#38291F] font-bold text-sm sm:text-base shadow-md flex items-center gap-2 transition-all duration-200 active:scale-95 border border-[#E7C9A5]"
            >
              <Compass className="w-4 h-4 text-[#F36B21]" />
              <span>Explore Destinations</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigate) {
                  onNavigate('planner');
                } else {
                  window.location.href = '/planner';
                }
              }}
              className="py-3 px-6 rounded-xl bg-[#F36B21] hover:bg-[#D94E0B] text-white font-bold text-sm sm:text-base shadow-md flex items-center gap-2 transition-all duration-200 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Plan My Trip</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-300 shrink-0" />
              <div>
                <p className="text-white font-bold text-xs sm:text-sm leading-tight">100% Verified</p>
                <p className="text-slate-300 text-[10px] sm:text-xs">Native Local Hosts</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-amber-300 shrink-0" />
              <div>
                <p className="text-white font-bold text-xs sm:text-sm leading-tight">45+ Gems</p>
                <p className="text-slate-300 text-[10px] sm:text-xs">Untold Local Sites</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 flex items-center gap-2.5">
              <Route className="w-5 h-5 text-amber-300 shrink-0" />
              <div>
                <p className="text-white font-bold text-xs sm:text-sm leading-tight">AI Planner</p>
                <p className="text-slate-300 text-[10px] sm:text-xs">Smart Budget Routing</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 flex items-center gap-2.5">
              <Star className="w-5 h-5 text-amber-300 fill-amber-300 shrink-0" />
              <div>
                <p className="text-white font-bold text-xs sm:text-sm leading-tight">4.9 / 5.0</p>
                <p className="text-slate-300 text-[10px] sm:text-xs">Community Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-20">

        {/* ========================================================================= */}
        {/* C. POPULAR DESTINATIONS (COMMUNITY FAVORITES)                             */}
        {/* ========================================================================= */}
        <section id="popular-destinations" aria-labelledby="popular-destinations-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-3 border-b border-[#E7C9A5]/40">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F36B21]/10 text-[#F36B21] text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-[#F36B21]/20">
                <Sparkles className="w-3.5 h-3.5 text-[#F36B21]" />
                <span>Community Favorites</span>
              </div>
              <h2
                id="popular-destinations-heading"
                className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#38291F] tracking-tight"
              >
                Popular Destinations
              </h2>
              <p className="text-[#64748B] text-xs sm:text-sm max-w-2xl mt-1">
                From desert ramparts and Himalayan cedar trails to backwaters and tea estates, discover regions loved by community travelers.
              </p>
            </div>
          </div>

          {/* 6 Destination Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_DESTINATIONS.map((dest) => (
              <div
                key={dest.id}
                className="group relative bg-white rounded-2xl border border-[#F2E4D2] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Image with overlay and zoom */}
                <div className="relative h-56 sm:h-60 overflow-hidden bg-slate-900">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#38291F]/90 via-[#38291F]/30 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-white/90 text-[#38291F] shadow-sm backdrop-blur-md">
                      {dest.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight leading-tight drop-shadow-sm">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-amber-200 font-medium line-clamp-1 drop-shadow-sm">
                      {dest.tagline}
                    </p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed line-clamp-3">
                    {dest.description}
                  </p>

                  <div className="pt-2 border-t border-[#F2E4D2] flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#F36B21] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {dest.stats}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        if (dest.isSupportedState) {
                          if (onNavigateToState) {
                            onNavigateToState(dest.stateId);
                          } else {
                            setSelectedState(dest.stateId);
                            const el = document.getElementById(`section-${dest.stateId}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }
                        } else {
                          setSpotlightState(dest);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F36B21] hover:bg-[#D94E0B] text-white shadow-xs active:scale-95 transition-all"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* D. DISCOVER LOCAL EXPERIENCES (CATEGORY CARDS)                            */}
        {/* ========================================================================= */}
        <section id="local-experiences-section" aria-labelledby="local-experiences-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-3 border-b border-[#E7C9A5]/40">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-emerald-500/20">
                <Utensils className="w-3.5 h-3.5 text-emerald-700" />
                <span>Authentic Community Culture</span>
              </div>
              <h2
                id="local-experiences-heading"
                className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#38291F] tracking-tight"
              >
                Discover Local Experiences
              </h2>
              <p className="text-[#64748B] text-xs sm:text-sm max-w-2xl mt-1">
                Choose a category to browse authentic hands-on encounters hosted by native villagers, master artisans, and oral storytellers.
              </p>
            </div>
          </div>

          {/* 6 Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMUNITY_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.categoryKey;
              return (
                <div
                  key={cat.title}
                  onClick={() => handleCategorySelect(cat.categoryKey)}
                  className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
                    isSelected
                      ? 'border-[#F36B21] ring-2 ring-[#F36B21]/30 shadow-lg bg-white'
                      : 'border-[#F2E4D2] bg-white hover:border-[#E7C9A5] shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#38291F]/90 via-[#38291F]/40 to-transparent" />
                    
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F36B21] text-white shadow-sm">
                        {cat.count}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                        <Icon className="w-4 h-4 text-amber-200" />
                      </div>
                      <h3 className="font-display font-bold text-base sm:text-lg leading-tight drop-shadow-sm text-white">
                        {cat.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <p className="text-xs text-[#64748B] line-clamp-1 pr-2">
                      {cat.desc}
                    </p>
                    <span className="text-xs font-bold text-[#F36B21] flex items-center gap-1 shrink-0 group-hover:translate-x-1 transition-transform">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* LIVE FILTERED EXPERIENCES SECTION & CARDS GRID                            */}
        {/* ========================================================================= */}
        <section id="curated-experiences-section" aria-labelledby="curated-experiences-heading" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#E7C9A5]/40">
            <div>
              <h2 id="curated-experiences-heading" className="text-xl sm:text-2xl font-display font-extrabold text-[#38291F] tracking-tight">
                {appliedQuery || selectedCategory !== 'All Experiences' || selectedState !== 'all'
                  ? 'Filtered Community Experiences'
                  : 'Curated Local Experiences'}
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                Showing <span className="font-bold text-[#38291F]">{filteredExperiences.length}</span> experiences
                {selectedCategory !== 'All Experiences' && (
                  <span> in <strong className="text-[#F36B21] font-bold">{selectedCategory}</strong></span>
                )}
                {selectedState !== 'all' && (
                  <span> in <strong className="text-[#38291F]">{activeStateTheme?.name}</strong></span>
                )}
                {appliedQuery && (
                  <span> matching "<span className="italic font-semibold text-[#38291F]">{appliedQuery}</span>"</span>
                )}
              </p>
            </div>

            {/* Quick Horizontal Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? 'bg-[#F36B21] text-white shadow-xs font-bold scale-[1.02]'
                        : 'bg-white hover:bg-[#F2E4D2] text-[#38291F] border border-[#F2E4D2]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}

              {(selectedCategory !== 'All Experiences' || selectedState !== 'all' || appliedQuery) && (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="text-xs font-bold text-[#F36B21] hover:underline flex items-center gap-1 py-1 px-2.5 rounded-lg bg-[#F36B21]/10 hover:bg-[#F36B21]/20 transition-colors whitespace-nowrap"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid or Empty State */}
          {filteredExperiences.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#E7C9A5] p-10 sm:p-14 text-center max-w-lg mx-auto shadow-sm my-6 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-[#F36B21]/10 text-[#F36B21] flex items-center justify-center mx-auto mb-3.5">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#38291F] mb-1.5">
                No experiences found. Try another search.
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] mb-6 leading-relaxed">
                {appliedQuery
                  ? `We couldn't find any experiences matching "${appliedQuery}" in ${selectedCategory}.`
                  : `No experiences currently listed under "${selectedCategory}".`} Try resetting your filters.
              </p>
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="py-2.5 px-5 rounded-xl bg-[#F36B21] hover:bg-[#D94E0B] text-white text-xs font-bold shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map((exp) => (
                <ExperienceCard
                  key={exp.id}
                  experience={exp}
                  onSelect={() => setActiveModalExperience(exp)}
                  isFavorite={favorites.includes(exp.id)}
                  onToggleFavorite={onToggleFavorite}
                  isInTrip={tripItems.some((item) => item.id === exp.id)}
                  onToggleTrip={onToggleTrip}
                  onNavigateToPlace={() => {
                    if (onNavigateToPlace && exp.destinationId) {
                      onNavigateToPlace(exp.destinationId);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* E. HOW YAATRASAATHI WORKS (3-STEP ILLUSTRATED PROCESS)                    */}
        {/* ========================================================================= */}
        <section aria-labelledby="how-it-works-heading" className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F2E4D2] shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F36B21]/10 text-[#F36B21] text-[11px] font-bold tracking-wider uppercase border border-[#F36B21]/20">
              <Compass className="w-3.5 h-3.5 text-[#F36B21]" />
              <span>Simple & Transparent</span>
            </div>
            <h2
              id="how-it-works-heading"
              className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#38291F] tracking-tight"
            >
              How YaatraSaathi Works
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm">
              We empower native community hosts, preserve cultural craft, and make authentic travel seamless for every explorer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 relative">
            {/* Step 1 */}
            <div className="relative bg-[#FFF8EF] rounded-2xl p-6 border border-[#F2E4D2] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#F36B21] text-white flex items-center justify-center font-display font-extrabold text-lg shadow-sm">
                  1
                </div>
                <h3 className="font-display font-bold text-lg text-[#38291F]">
                  Discover Hidden Destinations
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Browse hand-curated trails, ancestral stepwells, and secluded sanctuaries shared directly by local community custodians and verified rovers.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#F36B21]">
                <MapPin className="w-4 h-4" />
                <span>Locally Sourced Spots</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-[#FFF8EF] rounded-2xl p-6 border border-[#F2E4D2] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#D94E0B] text-white flex items-center justify-center font-display font-extrabold text-lg shadow-sm">
                  2
                </div>
                <h3 className="font-display font-bold text-lg text-[#38291F]">
                  Connect with Local Experiences
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Book genuine cooking hearth workshops, folk music sessions, and master artisan studios with 100% verified native hosts.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#D94E0B]">
                <Users className="w-4 h-4" />
                <span>Direct Host Connection</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-[#FFF8EF] rounded-2xl p-6 border border-[#F2E4D2] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#38291F] text-white flex items-center justify-center font-display font-extrabold text-lg shadow-sm">
                  3
                </div>
                <h3 className="font-display font-bold text-lg text-[#38291F]">
                  Plan Your Personalized Journey
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Use our AI Trip Planner and neural route engine to budget smartly, balance travel times, and generate culturally rich itineraries.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#38291F]">
                <Route className="w-4 h-4" />
                <span>AI-Assisted Routing</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* F. COMMUNITY CONTRIBUTIONS / REAL TRAVEL STORIES                          */}
        {/* ========================================================================= */}
        <section aria-labelledby="community-stories-heading" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-3 border-b border-[#E7C9A5]/40">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-900 text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-amber-500/20">
                <Heart className="w-3.5 h-3.5 text-amber-700" />
                <span>Voices of the Yaatra</span>
              </div>
              <h2
                id="community-stories-heading"
                className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#38291F] tracking-tight"
              >
                Community Contributions & Stories
              </h2>
              <p className="text-[#64748B] text-xs sm:text-sm max-w-2xl mt-1">
                Hear from fellow explorers and see how community-powered travel creates unforgettable connections across India.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('contribute');
              }}
              className="py-2.5 px-5 rounded-xl bg-[#F36B21] hover:bg-[#D94E0B] text-white font-bold text-xs shadow-xs flex items-center gap-2 self-start sm:self-auto transition-all active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share a Gem</span>
            </button>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMMUNITY_TESTIMONIALS.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-2xl p-6 border border-[#F2E4D2] shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-[#38291F] italic leading-relaxed">
                    "{story.quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2E4D2] flex items-center gap-3">
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#F2E4D2]"
                  />
                  <div>
                    <h4 className="font-display font-bold text-xs sm:text-sm text-[#38291F]">
                      {story.name}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-[#64748B]">
                      {story.city} • <span className="text-[#F36B21] font-semibold">{story.experience}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Community Contribution Invitation Banner */}
          <div className="bg-gradient-to-r from-[#38291F] to-[#4A3729] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                Know an Untold Gem or Heritage Host?
              </h3>
              <p className="text-xs sm:text-sm text-[#E7C9A5] max-w-xl">
                Contribute your discovery to YaatraSaathi. Help conscious travelers experience your hometown’s living culture and support local artisans.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('contribute');
              }}
              className="py-3 px-6 rounded-xl bg-[#F36B21] hover:bg-[#D94E0B] text-white font-bold text-xs sm:text-sm shadow-md whitespace-nowrap active:scale-95 transition-all"
            >
              Share Your Gem Now
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* G. AI TRIP PLANNER PROMOTION                                              */}
        {/* ========================================================================= */}
        <section aria-labelledby="ai-planner-promo-heading" className="relative overflow-hidden bg-gradient-to-br from-[#FFF8EF] via-[#F2E4D2] to-[#E7C9A5]/40 rounded-3xl p-8 sm:p-12 border border-[#E7C9A5] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F36B21]/15 text-[#D94E0B] text-[11px] font-bold tracking-wider uppercase border border-[#F36B21]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#F36B21]" />
                <span>AI-Powered Indian Journeys</span>
              </div>

              <h2
                id="ai-planner-promo-heading"
                className="font-display font-extrabold text-2xl sm:text-4xl text-[#38291F] tracking-tight leading-tight"
              >
                Plan Budget-Friendly, Cultural Itineraries in Seconds
              </h2>

              <p className="text-xs sm:text-sm text-[#38291F]/80 leading-relaxed">
                Tell us your budget, preferred pace, and cultural interests. The YaatraSaathi AI Trip Planner crafts a day-by-day journey featuring verified community hosts, authentic food walks, and scenic heritage routes.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#38291F]">
                  <CheckCircle2 className="w-4 h-4 text-[#F36B21] shrink-0" />
                  <span>Real-time budget tracking & cost breakdown</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#38291F]">
                  <CheckCircle2 className="w-4 h-4 text-[#F36B21] shrink-0" />
                  <span>Interactive Route Map with scenic transit options</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#38291F]">
                  <CheckCircle2 className="w-4 h-4 text-[#F36B21] shrink-0" />
                  <span>Curated community homestays and folk masterclasses</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigate) onNavigate('planner');
                  }}
                  className="py-3 px-6 rounded-xl bg-[#F36B21] hover:bg-[#D94E0B] text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Start Planning with AI</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onNavigate) onNavigate('route_budget');
                  }}
                  className="py-3 px-5 rounded-xl bg-white hover:bg-[#FFF8EF] text-[#38291F] font-bold text-sm shadow-xs border border-[#E7C9A5] flex items-center gap-2 transition-all active:scale-95"
                >
                  <Route className="w-4 h-4 text-[#F36B21]" />
                  <span>Route & Budget Calculator</span>
                </button>
              </div>
            </div>

            {/* Visual Preview Graphic */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-white/60 bg-white p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#F2E4D2] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#F36B21]/10 text-[#F36B21] flex items-center justify-center">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs sm:text-sm text-[#38291F]">
                      Neural Expedition Synthesis
                    </h4>
                    <p className="text-[10px] text-[#64748B]">Personalized 4-Day Golden Sands Circuit</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ₹18,500 Budget
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl bg-[#FFF8EF] border border-[#F2E4D2] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#F36B21] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                    <span className="font-semibold text-[#38291F]">Amber Fort & Stepwell Heritage Trail</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#F36B21]">Morning</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FFF8EF] border border-[#F2E4D2] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#F36B21] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    <span className="font-semibold text-[#38291F]">Traditional Blue Pottery Masterclass</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#F36B21]">Afternoon</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FFF8EF] border border-[#F2E4D2] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#F36B21] text-white flex items-center justify-center text-[10px] font-bold">3</span>
                    <span className="font-semibold text-[#38291F]">Dune Sunset Ballad & Desert Dinner</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#F36B21]">Evening</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-medium text-[#64748B]">
                <span>🌿 3 Community Hosts Booked</span>
                <span>⏱️ Balanced Travel Times</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* H. STATE SPECIALITIES SECTION (DEEP REGIONAL HUBS)                        */}
        {/* ========================================================================= */}
        <section id="explore-states-section" aria-labelledby="state-discovery-heading" className="space-y-10 pt-4 border-t border-[#E7C9A5]/40">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-amber-500/25">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Regional Heritage & Cultural Pillars</span>
              </div>
              <h2
                id="state-discovery-heading"
                className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#38291F] tracking-tight"
              >
                Discover India, One State at a Time
              </h2>
              <p className="text-[#64748B] text-xs sm:text-sm max-w-2xl mt-1">
                Explore signature culinary traditions, folk arts, heritage craftsmanship, and storied destinations across Rajasthan, Gujarat, West Bengal, and Assam.
              </p>
            </div>

            {/* Quick State Anchor Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
              {STATE_SPECIALITIES.map((st) => (
                <button
                  key={st.stateId}
                  type="button"
                  onClick={() => {
                    const el = document.getElementById(`section-${st.stateId}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#F2E4D2] bg-white hover:bg-[#FFF8EF] text-[#38291F] shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: st.theme.primary }}
                  />
                  <span>{st.name}</span>
                </button>
              ))}

              {selectedState !== 'all' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedState('all');
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-[#38291F] text-white hover:bg-black transition-all shadow-xs active:scale-95"
                >
                  <X className="w-3 h-3" />
                  <span>All States</span>
                </button>
              )}
            </div>
          </div>

          {/* 4 Separate State Specialities Sections */}
          <div className="space-y-12">
            {STATE_SPECIALITIES.map((stateData) => (
              <StateSpecialitySection
                key={stateData.stateId}
                stateData={stateData}
                onExploreState={(stateId) => {
                  if (onNavigateToState) {
                    onNavigateToState(stateId);
                  } else {
                    setSelectedState(stateId);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }
                }}
                onFilterCategory={(stateId, cat) => {
                  setSelectedState(stateId);
                  setSelectedCategory(cat);
                  const el = document.getElementById('curated-experiences-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onNavigateToPlace={(destId) => {
                  if (onNavigateToPlace) onNavigateToPlace(destId);
                }}
                onViewExperience={(expId) => {
                  const exp = MOCK_EXPERIENCES.find((e) => e.id === expId);
                  if (exp) {
                    setActiveModalExperience(exp);
                  }
                }}
              />
            ))}
          </div>
        </section>

      </main>

      {/* Experience Details Modal Drawer */}
      <ExperienceDetailModal
        experience={activeModalExperience}
        isOpen={Boolean(activeModalExperience)}
        onClose={() => setActiveModalExperience(null)}
        isFavorite={activeModalExperience ? favorites.includes(activeModalExperience.id) : false}
        onToggleFavorite={onToggleFavorite}
        isInTrip={activeModalExperience ? tripItems.some((item) => item.id === activeModalExperience.id) : false}
        onToggleTrip={onToggleTrip}
      />

      {/* Featured Region Spotlight Modal (Kerala & Himachal Pradesh) */}
      {spotlightState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#F2E4D2] animate-scaleIn">
            <div className="relative h-48 bg-slate-900">
              <img
                src={spotlightState.image}
                alt={spotlightState.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#38291F] via-[#38291F]/40 to-transparent" />
              
              <button
                type="button"
                onClick={() => setSpotlightState(null)}
                aria-label="Close modal"
                className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F36B21] text-white">
                  {spotlightState.badge}
                </span>
                <h3 className="font-display font-extrabold text-2xl tracking-tight mt-1 text-white">
                  {spotlightState.name}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                {spotlightState.description}
              </p>

              {spotlightState.spotlight?.highlights && (
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#38291F]">
                    Signature Community Highlights
                  </h4>
                  <ul className="space-y-1.5">
                    {spotlightState.spotlight.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-[#38291F] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F36B21] shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-3 border-t border-[#F2E4D2] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSpotlightState(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#38291F] transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSpotlightState(null);
                    if (onNavigate) {
                      onNavigate('planner');
                    } else {
                      window.location.href = '/planner';
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#F36B21] hover:bg-[#D94E0B] text-white shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Plan {spotlightState.name} with AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
