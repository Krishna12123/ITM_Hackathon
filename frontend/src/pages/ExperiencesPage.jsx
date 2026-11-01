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
  Heart
} from 'lucide-react';
import {
  CATEGORIES,
  MOCK_EXPERIENCES,
  STATE_SPECIALITIES,
  STATE_THEMES
} from '../data/mockData';
import ExperienceCard from '../components/ExperienceCard';
import ExperienceDetailModal from '../components/ExperienceDetailModal';
import StateSpecialitySection from '../components/StateSpecialitySection';

const STATE_FILTER_OPTIONS = [
  { id: 'all', label: 'All Regions' },
  { id: 'rajasthan', label: 'Rajasthan' },
  { id: 'gujarat', label: 'Gujarat' },
  { id: 'west-bengal', label: 'West Bengal' },
  { id: 'assam', label: 'Assam' },
  { id: 'kerala', label: 'Kerala' },
  { id: 'himachal-pradesh', label: 'Himachal' },
  { id: 'madhya-pradesh', label: 'Madhya Pradesh' },
  { id: 'goa', label: 'Goa' }
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
  const [searchInput, setSearchInput] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Experiences');
  const [selectedState, setSelectedState] = useState('all');
  const [activeModalExperience, setActiveModalExperience] = useState(null);

  const activeStateTheme = useMemo(() => {
    return STATE_THEMES.find((s) => s.id === selectedState) || null;
  }, [selectedState]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    if (!val.trim()) {
      setAppliedQuery('');
    }
  };

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setAppliedQuery(searchInput.trim());
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
      {/* 1. HERO SECTION: EXPERIENCES HEADER & SEARCH                              */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-[#38291F] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E7C9A5]/30">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=2200&q=85"
            alt="Authentic Indian Experiences"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#38291F] via-[#38291F]/80 to-[#38291F]/55" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-white text-xs font-bold tracking-wider uppercase shadow-md bg-[#F36B21] border border-[#F36B21]/30">
            <Utensils className="w-3.5 h-3.5 text-amber-200" />
            <span>NATIVE COMMUNITY HOSTS & MASTER ARTISANS</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight drop-shadow-md">
            Curated Local Experiences
          </h1>

          <p className="max-w-3xl text-slate-200 text-sm sm:text-base leading-relaxed font-medium drop-shadow-sm">
            Meet local hosts, explore ancestral traditions, and experience authentic Indian culture beyond typical tourist trails. Book workshops, folk circles, and culinary walks directly with native custodians.
          </p>

          {/* Search Form */}
          <div className="pt-2 max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search by experience name, host, location, or craft…"
                  className="w-full pl-10 pr-10 py-3 text-sm bg-white/95 backdrop-blur-md text-[#38291F] placeholder-slate-400 rounded-xl border border-white/40 shadow-md focus:outline-none focus:ring-2 focus:ring-[#F36B21]"
                  aria-label="Search experiences"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search text"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-[#F36B21] hover:bg-[#D94E0B] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 shrink-0 active:scale-95 transition-all"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Search</span>
              </button>
            </form>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? 'bg-[#F36B21] text-white shadow-xs font-bold scale-[1.02]'
                      : 'bg-white/90 hover:bg-white text-[#38291F] border border-white/40 backdrop-blur-md'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-16">

        {/* ========================================================================= */}
        {/* 2. REGIONAL STATE FILTER BAR                                              */}
        {/* ========================================================================= */}
        <section aria-labelledby="state-filter-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F36B21]" />
              <h2 id="state-filter-heading" className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#38291F]">
                Filter by Region:
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {STATE_FILTER_OPTIONS.map((opt) => {
                const isSelected = selectedState === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedState(opt.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 active:scale-95 ${
                      isSelected
                        ? 'bg-[#38291F] text-white shadow-xs'
                        : 'bg-white hover:bg-[#F2E4D2] text-[#64748B] hover:text-[#38291F] border border-[#F2E4D2]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. MATCHING EXPERIENCE RESULTS                                            */}
        {/* ========================================================================= */}
        <section aria-labelledby="results-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#E7C9A5]/40">
            <div>
              <h2 id="results-heading" className="text-xl sm:text-2xl font-display font-extrabold text-[#38291F] tracking-tight">
                {appliedQuery || selectedCategory !== 'All Experiences' || selectedState !== 'all'
                  ? 'Search & Filter Results'
                  : 'All Curated Experiences'}
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                Showing <span className="font-bold text-[#38291F]">{filteredExperiences.length}</span> experiences
                {selectedCategory !== 'All Experiences' && (
                  <span> in <strong className="text-[#F36B21] font-bold">{selectedCategory}</strong></span>
                )}
                {selectedState !== 'all' && (
                  <span> in <strong className="text-[#38291F]">{activeStateTheme?.name || selectedState}</strong></span>
                )}
                {appliedQuery && (
                  <span> matching "<span className="italic font-semibold text-[#38291F]">{appliedQuery}</span>"</span>
                )}
              </p>
            </div>

            {(selectedCategory !== 'All Experiences' || selectedState !== 'all' || appliedQuery) && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="text-xs font-bold text-[#F36B21] hover:underline flex items-center gap-1 self-start sm:self-auto py-1 px-2.5 rounded-lg bg-[#F36B21]/10 hover:bg-[#F36B21]/20 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>

          {filteredExperiences.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#E7C9A5] p-10 sm:p-14 text-center max-w-lg mx-auto shadow-xs my-6 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-[#F36B21]/10 text-[#F36B21] flex items-center justify-center mx-auto mb-3.5">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#38291F] mb-1.5">
                No experiences found. Try another search.
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] mb-6 leading-relaxed">
                {appliedQuery
                  ? `We couldn't find any experiences matching "${appliedQuery}" in ${selectedCategory}.`
                  : `No experiences available in the "${selectedCategory}" category.`} Try checking spelling or resetting your filters.
              </p>
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="py-2.5 px-5 rounded-xl bg-[#F36B21] hover:bg-[#D94E0B] text-white text-xs font-bold shadow-xs"
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
        {/* 4. REGIONAL SPECIALITIES SHOWCASE                                         */}
        {/* ========================================================================= */}
        <section aria-labelledby="state-pillars-heading" className="space-y-10 pt-4 border-t border-[#E7C9A5]/40">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-amber-500/25">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Living Culture & Ancestral Craft</span>
            </div>
            <h2
              id="state-pillars-heading"
              className="font-display font-extrabold text-2xl sm:text-3xl text-[#38291F] tracking-tight"
            >
              Regional Experience Pillars
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm max-w-2xl mt-1">
              Explore culinary lineages, classical performance guilds, and master workshops across Rajasthan, Gujarat, West Bengal, and Assam.
            </p>
          </div>

          <div className="space-y-12">
            {STATE_SPECIALITIES.slice(0, 4).map((stateData) => (
              <StateSpecialitySection
                key={stateData.stateId}
                stateData={stateData}
                onExploreState={(stateId) => {
                  if (onNavigateToState) onNavigateToState(stateId);
                }}
                onFilterCategory={(stateId, cat) => {
                  setSelectedState(stateId);
                  setSelectedCategory(cat);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                onNavigateToPlace={(destId) => {
                  if (onNavigateToPlace) onNavigateToPlace(destId);
                }}
                onViewExperience={(expId) => {
                  const exp = MOCK_EXPERIENCES.find((e) => e.id === expId);
                  if (exp) setActiveModalExperience(exp);
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
    </div>
  );
}
