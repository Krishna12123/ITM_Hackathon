import React from 'react';
import { ArrowRight, MapPin, Sparkles, Utensils, Music, Palette, Compass, ExternalLink } from 'lucide-react';

export default function StateSpecialitySection({
  stateData,
  onExploreState,
  onFilterCategory,
  onNavigateToPlace,
  onViewExperience
}) {
  const { theme, specialities, categories } = stateData;

  // Icon mapper helper
  const getCategoryIcon = (cat) => {
    const c = cat.toLowerCase();
    if (c.includes('food')) return <Utensils className="w-3.5 h-3.5" />;
    if (c.includes('folk') || c.includes('music') || c.includes('dance')) return <Music className="w-3.5 h-3.5" />;
    if (c.includes('craft') || c.includes('handicraft')) return <Palette className="w-3.5 h-3.5" />;
    return <Compass className="w-3.5 h-3.5" />;
  };

  return (
    <section
      id={`section-${stateData.stateId}`}
      aria-labelledby={`heading-${stateData.stateId}`}
      className="rounded-3xl border border-border-subtle overflow-hidden shadow-level-1 transition-all duration-300 hover:shadow-level-2"
      style={{
        backgroundColor: theme.bgSubtle ? `${theme.bgSubtle}33` : '#FFFFFF'
      }}
    >
      {/* 1. STATE BANNER HEADER */}
      <div className="relative overflow-hidden py-10 sm:py-14 px-6 sm:px-10 text-white bg-slate-900">
        {/* Banner Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={stateData.bannerImage}
            alt={stateData.title}
            className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = stateData.fallbackImage;
            }}
          />
          {/* Multi-layer gradient overlay for high contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/50" />
        </div>

        {/* Banner Text Content */}
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-md backdrop-blur-md text-white"
            style={{ backgroundColor: theme.primary }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>State Specialities</span>
          </div>

          <h2
            id={`heading-${stateData.stateId}`}
            className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight text-white drop-shadow-sm"
          >
            {stateData.title}
          </h2>

          <p className="text-amber-200/90 text-xs sm:text-sm font-semibold tracking-wide font-serif italic">
            "{stateData.subtitle}"
          </p>

          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-2xl pt-1">
            {stateData.introduction}
          </p>

          {/* Quick Category Jump Pills & Explore Button */}
          <div className="flex flex-wrap items-center gap-2.5 pt-3">
            <button
              type="button"
              onClick={() => onExploreState(stateData.stateId)}
              className="py-2.5 px-5 rounded-full text-xs font-bold text-white flex items-center gap-2 shadow-md active:scale-95 transition-all"
              style={{ backgroundColor: theme.primary }}
              title={`Explore all ${stateData.name} experiences`}
            >
              <span>{stateData.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Category Filter Pills within this State */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onFilterCategory(stateData.stateId, cat)}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-[11px] font-semibold bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-all active:scale-95"
                  title={`Filter ${stateData.name} ${cat}`}
                >
                  {getCategoryIcon(cat)}
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. FOUR DISTINCT SPECIALITY CARDS */}
      <div className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: theme.primary }}
            />
            <span>{stateData.name} Cultural Pillars & Regional Highlights</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            4 Signature Highlights
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {specialities.map((item) => (
            <div
              key={item.id}
              className="group bg-card rounded-2xl border border-border-subtle overflow-hidden shadow-level-1 hover:shadow-level-3 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Container with 16:10 aspect ratio */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt={`${item.title} - ${stateData.name}`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full text-white shadow-sm"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {getCategoryIcon(item.category)}
                    <span>{item.category}</span>
                  </span>
                </div>

                {/* Overlay Title */}
                <div className="absolute bottom-2.5 inset-x-3 z-10">
                  <h4 className="font-display font-bold text-base text-white tracking-tight leading-snug drop-shadow-sm">
                    {item.title}
                  </h4>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  {/* Item Highlights Pills */}
                  <div className="flex flex-wrap gap-1">
                    {item.items.map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-subtle text-slate-800 border border-border-subtle"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Action Trigger */}
                <div className="pt-2 border-t border-slate-100 mt-1">
                  {item.actionType === 'place' ? (
                    <button
                      type="button"
                      onClick={() => onNavigateToPlace(item.targetId)}
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Explore Place Details</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (item.targetId) {
                          onViewExperience(item.targetId);
                        } else {
                          onFilterCategory(stateData.stateId, item.filterCategory);
                        }
                      }}
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 border"
                      style={{
                        borderColor: theme.primary,
                        color: theme.primary,
                        backgroundColor: `${theme.primary}0D`
                      }}
                    >
                      <span>Discover {item.category}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
