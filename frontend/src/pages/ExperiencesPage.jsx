import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, AlertCircle, ArrowRight, MapPin, Clock, Star, CheckCircle, Plus, Check } from 'lucide-react';
import { CATEGORIES, MOCK_EXPERIENCES } from '../data/mockData';
import ExperienceCard from '../components/ExperienceCard';
import ExperienceDetailModal from '../components/ExperienceDetailModal';

export default function ExperiencesPage({
  favorites,
  onToggleFavorite,
  tripItems,
  onToggleTrip
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Experiences');
  const [activeModalExperience, setActiveModalExperience] = useState(null);

  // Featured experience item (Bundelkhand Local Food Walk or Local Cooking)
  const featuredExperience = MOCK_EXPERIENCES[0]; // "Bundelkhand Local Food Walk"
  const isFeaturedInTrip = tripItems.some((item) => item.id === featuredExperience.id);

  // Filter experiences based on search query and category
  const filteredExperiences = useMemo(() => {
    return MOCK_EXPERIENCES.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All Experiences' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.host && item.host.name.toLowerCase().includes(q)) ||
        item.shortDescription.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Experiences');
  };

  return (
    <div className="min-h-screen bg-canvas pb-20 animate-fadeInUp">
      {/* 2.A Page Header with Scenic Tourism Hero Background */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-border-subtle py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        {/* Scenic Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2000&q=85"
            alt="Scenic heritage and landscape"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Subtle multi-layer cinematic dark gradient for guaranteed high contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-3xl">
            {/* Community-focused label */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-white text-[11px] font-bold tracking-wider uppercase mb-3 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>LOCAL STORIES • REAL EXPERIENCES</span>
            </div>

            {/* Heading & Subtitle */}
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight drop-shadow-md">
              Discover Local Experiences
            </h1>
            <p className="mt-3 text-slate-200 text-sm sm:text-base leading-relaxed drop-shadow-sm max-w-2xl">
              Meet local hosts, explore traditions, and experience destinations beyond the usual tourist trail.
            </p>
          </div>

          {/* 2.B Search and Filters */}
          <div className="mt-8 space-y-4">
            {/* Search Input with glassmorphism */}
            <div className="relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food, crafts, culture, or local experiences…"
                className="input-terra w-full pl-10 pr-10 py-3.5 shadow-level-2 text-sm bg-white/95 backdrop-blur-md focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Horizontally Scrollable Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 ${
                      isSelected
                        ? "bg-primary text-white shadow-md ring-2 ring-primary/40 font-bold"
                        : "bg-white/90 hover:bg-white text-slate-800 border border-white/30 backdrop-blur-md shadow-sm"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* 2.C Featured Experience Section (above regular results when on default view) */}
        {selectedCategory === 'All Experiences' && !searchQuery && (
          <section className="bg-card rounded-xl border border-border-subtle overflow-hidden shadow-level-1 hover:shadow-level-2 hover:-translate-y-0.5 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
              {/* Image Column */}
              <div className="md:col-span-5 relative min-h-[220px] md:min-h-full overflow-hidden">
                <img
                  src={featuredExperience.image}
                  alt={featuredExperience.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-primary text-white shadow-sm">
                    Featured Experience
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-md">
                    Demo Data
                  </span>
                </div>
              </div>

              {/* Information Column */}
              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-tertiary bg-tertiary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {featuredExperience.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{featuredExperience.location}</span>
                    </div>
                  </div>

                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-snug mb-2">
                    Taste the Traditions
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Discover regional flavours and stories through a local food experience. Walk side-by-side with culinary hosts through centuries-old haveli kitchens, sample heritage recipes, and taste genuine Bundelkhandi delicacies.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-6">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-700" />
                      <span>{featuredExperience.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-bold text-slate-800">{featuredExperience.rating}</span>
                      <span>({featuredExperience.reviewsCount} sample reviews)</span>
                    </div>
                    <div className="text-slate-800 font-bold">
                      ₹{featuredExperience.price} <span className="font-normal text-slate-500">/ person (demo rate)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setActiveModalExperience(featuredExperience)}
                    className="btn-primary py-2.5 px-5 text-xs sm:text-sm flex items-center gap-2"
                  >
                    <span>Explore Experience</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onToggleTrip(featuredExperience)}
                    className={`btn-secondary py-2.5 px-4 text-xs sm:text-sm flex items-center gap-1.5 ${
                      isFeaturedInTrip ? "border-tertiary text-tertiary" : ""
                    }`}
                  >
                    {isFeaturedInTrip ? (
                      <>
                        <Check className="w-4 h-4 text-tertiary stroke-[2.5]" />
                        <span>Added to My Trip</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>Add to My Trip</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Results Metadata & Clear Filters */}
        <div className="flex items-center justify-between">
          <div className="text-xs sm:text-sm text-slate-600">
            Showing <span className="font-bold text-slate-900">{filteredExperiences.length}</span> experiences
            {selectedCategory !== 'All Experiences' && (
              <span> in <span className="font-semibold text-primary">{selectedCategory}</span></span>
            )}
            {searchQuery && (
              <span> matching "<span className="italic font-medium">{searchQuery}</span>"</span>
            )}
          </div>

          {(selectedCategory !== 'All Experiences' || searchQuery) && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* 2.E Empty State */}
        {filteredExperiences.length === 0 ? (
          <div className="bg-card rounded-xl border border-dashed border-border-subtle p-12 text-center max-w-lg mx-auto shadow-level-1 my-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
              No Experiences Found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-5">
              We couldn't find any experiences matching your current filters. Try searching with different keywords or reset your category selection.
            </p>
            <button
              onClick={handleClearFilters}
              className="btn-primary text-xs py-2 px-5"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* 2.D Responsive Experience Cards Grid (3 col desktop, 2 col tablet, 1 col mobile) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((exp) => (
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
      </main>

      {/* Experience Details Modal */}
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
