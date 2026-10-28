import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Compass, 
  Utensils, 
  Music, 
  Palette, 
  Trees, 
  Info, 
  Sun, 
  Plane, 
  Lightbulb, 
  ArrowRight, 
  Search, 
  X, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { STATE_SPECIALITIES, MOCK_EXPERIENCES, CATEGORIES } from '../data/mockData';
import ExperienceCard from '../components/ExperienceCard';
import ExperienceDetailModal from '../components/ExperienceDetailModal';

export default function StateDestinationPage({
  stateId = 'rajasthan',
  onBackToExplore,
  onNavigateToPlace,
  onSelectOtherState,
  favorites = [],
  onToggleFavorite,
  tripItems = [],
  onToggleTrip
}) {
  // Find state data
  const stateData = useMemo(() => {
    return (
      STATE_SPECIALITIES.find((s) => s.stateId === stateId) ||
      STATE_SPECIALITIES[0]
    );
  }, [stateId]);

  const { theme, specialities = [], natureAdventure, travelInfo } = stateData;

  // Filter experiences for this specific state
  const stateExperiences = useMemo(() => {
    return MOCK_EXPERIENCES.filter((exp) => exp.stateId === stateData.stateId);
  }, [stateData.stateId]);

  // Search and Category filtering within this state
  const [selectedCategory, setSelectedCategory] = useState('All Experiences');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalExperience, setActiveModalExperience] = useState(null);

  // Derived filtered experiences
  const displayedExperiences = useMemo(() => {
    return stateExperiences.filter((item) => {
      // Category match
      const catMatch =
        selectedCategory === 'All Experiences' ||
        (item.category && item.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        (selectedCategory.toLowerCase().includes('food') && item.category?.toLowerCase().includes('food')) ||
        (selectedCategory.toLowerCase().includes('folk') && (item.category?.toLowerCase().includes('folk') || item.category?.toLowerCase().includes('festiv')));

      // Search match
      const q = searchQuery.toLowerCase().trim();
      const searchMatch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.shortDescription && item.shortDescription.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));

      return catMatch && searchMatch;
    });
  }, [stateExperiences, selectedCategory, searchQuery]);

  // Smooth scroll to experiences section
  const handleScrollToExperiences = () => {
    const el = document.getElementById('state-experiences-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Specific speciality extractors
  const foodSpeciality = specialities.find((s) => s.category.toLowerCase().includes('food'));
  const folkSpeciality = specialities.find(
    (s) => s.category.toLowerCase().includes('folk') || s.category.toLowerCase().includes('music') || s.category.toLowerCase().includes('arts')
  );
  const craftSpeciality = specialities.find(
    (s) => s.category.toLowerCase().includes('craft') || s.category.toLowerCase().includes('handicraft')
  );
  const placesSpeciality = specialities.find(
    (s) => s.category.toLowerCase().includes('place') || s.category.toLowerCase().includes('heritage') || s.category.toLowerCase().includes('nature')
  );

  return (
    <div className="min-h-screen bg-canvas pb-24 animate-fadeIn">
      {/* ========================================================= */}
      {/* 1. HERO SECTION                                           */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-border-subtle text-white min-h-[460px] sm:min-h-[520px] flex flex-col justify-between">
        {/* State Banner Photography */}
        <div className="absolute inset-0 z-0">
          <img
            src={stateData.bannerImage}
            alt={`${stateData.name} Landscape & Architecture`}
            className="w-full h-full object-cover object-center transition-all duration-700"
            onError={(e) => {
              e.currentTarget.src = stateData.fallbackImage;
            }}
          />
          {/* Subtle multi-layer gradient overlay for high contrast and readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/45" />
          <div
            className="absolute inset-0 opacity-25 mix-blend-color"
            style={{ backgroundColor: theme.primary }}
          />
        </div>

        {/* Top Breadcrumb & Switcher Bar */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Back to Explore Breadcrumb */}
            <button
              type="button"
              onClick={onBackToExplore}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/20 transition-all active:scale-95 shadow-sm"
              title="Return to main Explore page"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Explore</span>
            </button>

            {/* Quick State Switcher Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-semibold text-slate-300 hidden sm:inline mr-1">
                Other States:
              </span>
              {STATE_SPECIALITIES.map((st) => {
                const isCurrent = st.stateId === stateData.stateId;
                return (
                  <button
                    key={st.stateId}
                    type="button"
                    onClick={() => {
                      if (!isCurrent && onSelectOtherState) {
                        onSelectOtherState(st.stateId);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                      isCurrent
                        ? "text-white shadow-md font-bold ring-2 ring-white/60"
                        : "bg-black/40 hover:bg-black/60 text-slate-200 border border-white/15 backdrop-blur-sm"
                    }`}
                    style={isCurrent ? { backgroundColor: st.theme.primary } : undefined}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: st.theme.accent || st.theme.primary }}
                    />
                    <span>{st.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hero Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl space-y-4">
            <div
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-white text-[11px] font-bold tracking-wider uppercase shadow-md backdrop-blur-md"
              style={{ backgroundColor: theme.primary }}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{stateData.title}</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight text-white drop-shadow-md">
              {stateData.name}
            </h1>

            <p className="text-amber-200 text-sm sm:text-base font-serif italic tracking-wide">
              "{stateData.subtitle}"
            </p>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed drop-shadow-sm max-w-2xl pt-1">
              {stateData.introduction}
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleScrollToExperiences}
                className="btn-primary py-3 px-6 text-sm font-bold flex items-center gap-2 shadow-level-2 active:scale-95 transition-all text-white rounded-xl"
                style={{ backgroundColor: theme.primary }}
              >
                <Compass className="w-4 h-4 stroke-[2.5]" />
                <span>Explore {stateData.name} Experiences</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {placesSpeciality?.targetId && (
                <button
                  type="button"
                  onClick={() => onNavigateToPlace && onNavigateToPlace(placesSpeciality.targetId)}
                  className="py-3 px-5 text-sm font-semibold flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/25 transition-all active:scale-95 shadow-sm"
                >
                  <MapPin className="w-4 h-4 text-amber-300" />
                  <span>View Featured Destination</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hero Bottom Strip: Fast Facts & Travel Highlight */}
        <div className="relative z-10 bg-slate-950/80 backdrop-blur-md border-t border-white/10 py-3.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-white">Best Visiting Season:</strong>{' '}
                {travelInfo?.bestTimeToVisit || 'October to March'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-white">Climate & Weather:</strong>{' '}
                {travelInfo?.weather || 'Pleasant & temperate'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate max-w-xs sm:max-w-none">
                <strong className="text-white">Transit:</strong>{' '}
                {travelInfo?.connectivity?.split(';')[0] || 'Well-connected by Air & Rail'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-16">
        
        {/* ========================================================= */}
        {/* 2. STATE SPECIALITIES: DEDICATED SECTIONS                 */}
        {/* ========================================================= */}
        <section aria-labelledby="state-pillars-heading" className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-border-subtle pb-4">
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase mb-1"
                style={{
                  backgroundColor: `${theme.primary}18`,
                  color: theme.primary
                }}
              >
                <Sparkles className="w-3 h-3" />
                <span>Regional Culture & Authenticity</span>
              </div>
              <h2
                id="state-pillars-heading"
                className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight"
              >
                {stateData.name} Signature Specialities
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              From culinary heirlooms and vibrant folk melodies to master artisans and natural wonders.
            </p>
          </div>

          {/* Grid of 4 Core Pillars: Food, Folk Dance/Music, Handicrafts, Famous Places */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* PILLAR 1: Local Food */}
            {foodSpeciality && (
              <div className="bg-card rounded-2xl border border-border-subtle overflow-hidden shadow-level-1 hover:shadow-level-2 transition-all flex flex-col justify-between group">
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={foodSpeciality.image}
                      alt={foodSpeciality.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white shadow-sm"
                        style={{ backgroundColor: theme.primary }}
                      >
                        <Utensils className="w-3 h-3" />
                        <span>Local Food</span>
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 inset-x-3 text-white">
                      <h3 className="font-display font-bold text-base tracking-tight leading-snug">
                        {foodSpeciality.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="flex flex-wrap gap-1">
                      {foodSpeciality.items.map((it, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-subtle text-slate-800 border border-border-subtle"
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {foodSpeciality.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      const exp = stateExperiences.find((e) => e.category.toLowerCase().includes('food'));
                      if (exp) setActiveModalExperience(exp);
                    }}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 border"
                    style={{
                      borderColor: theme.primary,
                      color: theme.primary,
                      backgroundColor: `${theme.primary}0C`
                    }}
                  >
                    <span>Taste Regional Flavors</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* PILLAR 2: Folk Dance & Music */}
            {folkSpeciality && (
              <div className="bg-card rounded-2xl border border-border-subtle overflow-hidden shadow-level-1 hover:shadow-level-2 transition-all flex flex-col justify-between group">
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={folkSpeciality.image}
                      alt={folkSpeciality.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white shadow-sm"
                        style={{ backgroundColor: theme.primary }}
                      >
                        <Music className="w-3 h-3" />
                        <span>Folk Culture</span>
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 inset-x-3 text-white">
                      <h3 className="font-display font-bold text-base tracking-tight leading-snug">
                        {folkSpeciality.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="flex flex-wrap gap-1">
                      {folkSpeciality.items.map((it, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-subtle text-slate-800 border border-border-subtle"
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {folkSpeciality.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      const exp = stateExperiences.find(
                        (e) =>
                          e.category.toLowerCase().includes('folk') ||
                          e.category.toLowerCase().includes('music') ||
                          e.category.toLowerCase().includes('dance') ||
                          e.category.toLowerCase().includes('tradition')
                      );
                      if (exp) setActiveModalExperience(exp);
                    }}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 border"
                    style={{
                      borderColor: theme.primary,
                      color: theme.primary,
                      backgroundColor: `${theme.primary}0C`
                    }}
                  >
                    <span>Discover Performances</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* PILLAR 3: Handicrafts & Workshops */}
            {craftSpeciality && (
              <div className="bg-card rounded-2xl border border-border-subtle overflow-hidden shadow-level-1 hover:shadow-level-2 transition-all flex flex-col justify-between group">
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={craftSpeciality.image}
                      alt={craftSpeciality.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white shadow-sm"
                        style={{ backgroundColor: theme.primary }}
                      >
                        <Palette className="w-3 h-3" />
                        <span>Handicrafts</span>
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 inset-x-3 text-white">
                      <h3 className="font-display font-bold text-base tracking-tight leading-snug">
                        {craftSpeciality.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="flex flex-wrap gap-1">
                      {craftSpeciality.items.map((it, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-subtle text-slate-800 border border-border-subtle"
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {craftSpeciality.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      const exp = stateExperiences.find((e) =>
                        e.category.toLowerCase().includes('handicraft') || e.category.toLowerCase().includes('workshop')
                      );
                      if (exp) setActiveModalExperience(exp);
                    }}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 border"
                    style={{
                      borderColor: theme.primary,
                      color: theme.primary,
                      backgroundColor: `${theme.primary}0C`
                    }}
                  >
                    <span>Meet Artisan Guilds</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* PILLAR 4: Famous Places */}
            {placesSpeciality && (
              <div className="bg-card rounded-2xl border border-border-subtle overflow-hidden shadow-level-1 hover:shadow-level-2 transition-all flex flex-col justify-between group">
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={placesSpeciality.image}
                      alt={placesSpeciality.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white shadow-sm"
                        style={{ backgroundColor: theme.primary }}
                      >
                        <MapPin className="w-3 h-3" />
                        <span>Famous Places</span>
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 inset-x-3 text-white">
                      <h3 className="font-display font-bold text-base tracking-tight leading-snug">
                        {placesSpeciality.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="flex flex-wrap gap-1">
                      {placesSpeciality.items.map((it, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-subtle text-slate-800 border border-border-subtle"
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {placesSpeciality.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToPlace && placesSpeciality.targetId) {
                        onNavigateToPlace(placesSpeciality.targetId);
                      }
                    }}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Explore Place Details</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. NATURE & ADVENTURE HIGHLIGHT BANNER                    */}
        {/* ========================================================= */}
        {natureAdventure && (
          <section aria-labelledby="nature-adventure-heading" className="rounded-3xl border border-border-subtle overflow-hidden bg-card shadow-level-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Photo Area */}
              <div className="lg:col-span-5 relative min-h-[240px] sm:min-h-[300px] overflow-hidden bg-slate-900">
                <img
                  src={natureAdventure.image}
                  alt={natureAdventure.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md uppercase tracking-wider"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <Trees className="w-3.5 h-3.5 text-amber-300" />
                    <span>Nature & Adventure</span>
                  </span>
                </div>
              </div>

              {/* Text & Circuit Description */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Wild Escapes & Open Horizons
                  </span>
                  <h3
                    id="nature-adventure-heading"
                    className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight"
                  >
                    {natureAdventure.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {natureAdventure.description}
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                      Featured Trails & Activities:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {natureAdventure.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-subtle border border-border-subtle text-slate-800"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{it}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border-subtle">
                  <button
                    type="button"
                    onClick={() => {
                      const exp = stateExperiences.find((e) =>
                        e.category.toLowerCase().includes('nature') || e.category.toLowerCase().includes('adventure')
                      );
                      if (exp) {
                        setActiveModalExperience(exp);
                      } else {
                        handleScrollToExperiences();
                      }
                    }}
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                  >
                    <span>View Nature Experiences in {stateData.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* 4. ESSENTIAL TRAVEL INFORMATION                           */}
        {/* ========================================================= */}
        {travelInfo && (
          <section aria-labelledby="travel-info-heading" className="bg-card rounded-3xl border border-border-subtle p-6 sm:p-8 space-y-6 shadow-level-1">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: theme.primary }}
              >
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h3
                  id="travel-info-heading"
                  className="font-display font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight"
                >
                  Essential Travel Tips & Information for {stateData.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Verified regional travel guidance from local tourism experts and hosts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Season & Climate */}
              <div className="p-4 rounded-2xl bg-subtle/80 border border-border-subtle space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>Best Visiting Time</span>
                </div>
                <p className="text-xs text-slate-900 font-semibold">
                  {travelInfo.bestTimeToVisit}
                </p>
                <p className="text-[11px] text-slate-500">
                  {travelInfo.weather}
                </p>
              </div>

              {/* Transit & Gateway Hubs */}
              <div className="p-4 rounded-2xl bg-subtle/80 border border-border-subtle space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <Plane className="w-3.5 h-3.5 text-primary" />
                  <span>How to Reach</span>
                </div>
                <p className="text-xs text-slate-900 leading-relaxed">
                  {travelInfo.connectivity}
                </p>
              </div>

              {/* Local Travel Advice */}
              <div className="p-4 rounded-2xl bg-subtle/80 border border-border-subtle space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Insider Etiquette</span>
                </div>
                <ul className="space-y-1.5">
                  {travelInfo.travelTips.map((tip, idx) => (
                    <li key={idx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                      <span className="text-primary font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* 5. EXPERIENCE CARDS GRID                                  */}
        {/* ========================================================= */}
        <section id="state-experiences-section" aria-labelledby="experiences-grid-heading" className="space-y-6 pt-4 border-t border-border-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase mb-1"
                style={{
                  backgroundColor: `${theme.primary}18`,
                  color: theme.primary
                }}
              >
                <Compass className="w-3 h-3" />
                <span>Bookable Local Host Tours</span>
              </div>
              <h2
                id="experiences-grid-heading"
                className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight"
              >
                Curated {stateData.name} Experiences
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Showing {displayedExperiences.length} authentic experiences in {stateData.name}
              </p>
            </div>

            {/* Quick in-state Search Box */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${stateData.name} experiences…`}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-card border border-border-subtle focus:ring-2 focus:ring-primary shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* In-State Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 ${
                    isSelected
                      ? "text-white shadow-sm font-bold"
                      : "bg-card hover:bg-subtle text-slate-700 border border-border-subtle"
                  }`}
                  style={isSelected ? { backgroundColor: theme.primary } : undefined}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Experience Cards Grid */}
          {displayedExperiences.length === 0 ? (
            <div className="bg-card rounded-2xl border border-dashed border-border-subtle p-10 text-center max-w-md mx-auto my-8">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h4 className="font-display font-bold text-slate-900 text-base mb-1">
                No matching experiences found
              </h4>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                There are currently no experiences matching "{searchQuery || selectedCategory}" in {stateData.name}. Try selecting "All Experiences" or clearing your search.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All Experiences');
                  setSearchQuery('');
                }}
                className="btn-primary text-xs py-2 px-4 rounded-xl"
                style={{ backgroundColor: theme.primary }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedExperiences.map((exp) => (
                <ExperienceCard
                  key={exp.id}
                  experience={exp}
                  isFavorite={favorites.includes(exp.id)}
                  onToggleFavorite={onToggleFavorite}
                  isInTrip={tripItems.some((item) => item.id === exp.id)}
                  onToggleTrip={onToggleTrip}
                  onViewDetails={setActiveModalExperience}
                />
              ))}
            </div>
          )}
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
