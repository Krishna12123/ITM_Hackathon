import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, AlertCircle, ArrowRight, MapPin, Compass } from 'lucide-react';
import { CATEGORIES, MOCK_EXPERIENCES, STATE_THEMES, STATE_SPECIALITIES } from '../data/mockData';
import ExperienceCard from '../components/ExperienceCard';
import ExperienceDetailModal from '../components/ExperienceDetailModal';
import StateSpecialitySection from '../components/StateSpecialitySection';

export default function ExperiencesPage({
  favorites,
  onToggleFavorite,
  tripItems,
  onToggleTrip,
  onNavigateToPlace,
  onNavigateToState
}) {
  // Controlled input value & applied search query
  const [searchInput, setSearchInput] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Experiences');
  const [selectedState, setSelectedState] = useState('all');
  const [activeModalExperience, setActiveModalExperience] = useState(null);

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
  };

  // Support pressing Enter key inside search input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  // Clear search and preserve current category
  const handleClearSearch = () => {
    setSearchInput('');
    setAppliedQuery('');
  };

  // Clear all filters
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
      const matchesState =
        selectedState === 'all' || item.stateId === selectedState;
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
    <div className="min-h-screen bg-canvas pb-20 animate-fadeInUp">
      {/* ========================================================= */}
      {/* 1. HEADER: HEADING, SUBTITLE, SEARCH & CATEGORY SELECTOR  */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-border-subtle py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        {/* Scenic Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              activeStateTheme
                ? activeStateTheme.image
                : "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2000&q=85"
            }
            alt={activeStateTheme ? `${activeStateTheme.name} Landscape` : "Scenic India Tourism"}
            className="w-full h-full object-cover object-center transition-all duration-700 ease-out"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Subtle multi-layer cinematic dark gradient for high contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Experiences page heading and subtitle */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[11px] font-bold tracking-wider uppercase mb-3 shadow-md backdrop-blur-md bg-primary">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {activeStateTheme
                  ? `${activeStateTheme.name} • ${activeStateTheme.badge}`
                  : "LOCAL STORIES • REAL EXPERIENCES"}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight drop-shadow-md">
              {activeStateTheme
                ? `Explore ${activeStateTheme.name}`
                : "Discover Local Experiences"}
            </h1>
            <p className="mt-3 text-slate-200 text-sm sm:text-base leading-relaxed drop-shadow-sm max-w-2xl">
              {activeStateTheme
                ? activeStateTheme.tagline
                : "Meet local hosts, explore traditions, and experience authentic destinations beyond the usual tourist trail."}
            </p>
          </div>

          {/* 1. Search Input and Functional Search Button */}
          <div className="mt-8 space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative flex flex-col sm:flex-row items-stretch sm:items-center max-w-2xl gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search by name, description, location, or category…"
                  className="input-terra w-full pl-10 pr-10 py-3 shadow-level-2 text-sm bg-white/95 backdrop-blur-md focus:bg-white text-slate-900 rounded-xl border border-white/40 focus:ring-2 focus:ring-primary"
                  aria-label="Search experiences"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Functional Search Button */}
              <button
                type="submit"
                className="btn-primary py-3 px-6 text-sm font-bold flex items-center justify-center gap-2 shrink-0 rounded-xl shadow-md active:scale-95 transition-all"
                title="Search experiences"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Search</span>
              </button>

              {/* Prominent Explore Destinations Action */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('explore-states-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-3 px-5 rounded-xl bg-white/95 hover:bg-white text-[#F45B0B] font-bold text-sm shadow-md flex items-center justify-center gap-2 shrink-0 active:scale-95 transition-all whitespace-nowrap"
              >
                <Compass className="w-4 h-4 text-[#F45B0B]" />
                <span>Explore Destinations</span>
              </button>
            </form>

            {/* 2. Experience Category Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? "bg-primary text-white shadow-level-1 font-bold border border-primary scale-[1.02]"
                        : "bg-white/90 hover:bg-white text-slate-800 border border-white/50 backdrop-blur-md"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        
        {/* ========================================================================= */}
        {/* 3. MATCHING SEARCH RESULTS & EXPERIENCE CARDS (DIRECTLY BELOW SELECTOR!)  */}
        {/* ========================================================================= */}
        <section aria-labelledby="experience-results-heading" className="space-y-6">
          {/* Active Filter Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border-subtle">
            <div>
              <h2 id="experience-results-heading" className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 tracking-tight">
                {appliedQuery || selectedCategory !== 'All Experiences' || selectedState !== 'all'
                  ? 'Search & Filter Results'
                  : 'Curated Local Experiences'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Showing <span className="font-bold text-slate-900">{filteredExperiences.length}</span> experiences
                {selectedCategory !== 'All Experiences' && (
                  <span> in <strong className="text-primary font-bold">{selectedCategory}</strong></span>
                )}
                {selectedState !== 'all' && (
                  <span> in <strong className="text-slate-900">{activeStateTheme?.name}</strong></span>
                )}
                {appliedQuery && (
                  <span> matching "<span className="italic font-semibold text-slate-900">{appliedQuery}</span>"</span>
                )}
              </p>
            </div>

            {(selectedCategory !== 'All Experiences' || selectedState !== 'all' || appliedQuery) && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto py-1 px-2.5 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>

          {/* 5. Matching experience cards grid OR Empty state */}
          {filteredExperiences.length === 0 ? (
            <div className="bg-card rounded-2xl border border-dashed border-border-subtle p-10 sm:p-14 text-center max-w-lg mx-auto shadow-level-1 my-6 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3.5">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-1.5">
                No experiences found. Try another search.
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                {appliedQuery
                  ? `We couldn't find any experiences matching "${appliedQuery}" in ${selectedCategory}.`
                  : `No experiences available in the "${selectedCategory}" category.`} Try checking spelling, using broader keywords, or resetting your category filter.
              </p>
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="btn-primary text-xs py-2.5 px-5 rounded-lg shadow-sm font-semibold"
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
        {/* 4. STATE SPECIALITIES SECTIONS (4 DISTINCT REGIONAL HUBS)                 */}
        {/* ========================================================================= */}
        <section id="explore-states-section" aria-labelledby="state-discovery-heading" className="space-y-10 pt-6 border-t border-border-subtle">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-amber-500/25">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Regional Heritage & Cultural Pillars</span>
              </div>
              <h2
                id="state-discovery-heading"
                className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight"
              >
                Discover India, One State at a Time
              </h2>
              <p className="text-slate-600 text-sm max-w-2xl mt-1">
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
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-border-subtle bg-card hover:bg-subtle text-slate-700 shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
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
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                >
                  <X className="w-3 h-3" />
                  <span>All States</span>
                </button>
              )}
            </div>
          </div>

          {/* 4 Separate State Specialities Sections in Exact Order */}
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
                  window.scrollTo({ top: 300, behavior: 'smooth' });
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

      {/* 5. Remaining Content: Experience Details Modal Drawer */}
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
