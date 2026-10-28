import React from 'react';
import { Heart, Star, Clock, MapPin, CheckCircle, Plus, Check } from 'lucide-react';

export default function ExperienceCard({
  experience,
  isFavorite,
  onToggleFavorite,
  isInTrip,
  onToggleTrip,
  onViewDetails
}) {
  return (
    <div className="card-discovery group flex flex-col h-full bg-card border border-slate-100 hover:border-border-subtle transition-all duration-300">
      {/* 4:3 Aspect Ratio Image Container */}
      <div className="relative p-3 pb-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-slate-100">
          <img
            src={experience.image}
            alt={experience.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80";
            }}
          />

          {/* Gradient overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/90 text-slate-900 backdrop-blur-md shadow-sm">
              {experience.category}
            </span>
            {experience.badge && (
              <span className="text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-full bg-primary text-white shadow-sm">
                {experience.badge}
              </span>
            )}
          </div>

          {/* Favorite / Wishlist Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(experience.id);
            }}
            title={isFavorite ? "Remove from Wishlist" : "Save to Wishlist"}
            aria-label={isFavorite ? "Remove from Wishlist" : "Save to Wishlist"}
            className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-primary transition-all duration-200 active:scale-75 shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
          >
            <Heart
              className={`w-4 h-4 transition-all duration-200 ${
                isFavorite ? "fill-primary text-primary scale-110" : "text-slate-700 hover:text-primary"
              }`}
            />
          </button>

          {/* Bottom Overlay: Duration & Location */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs font-medium">
            <div className="flex items-center gap-1.5 drop-shadow-md">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{experience.duration}</span>
            </div>
            <div className="flex items-center gap-1 drop-shadow-md">
              <MapPin className="w-3.5 h-3.5 text-orange-300" />
              <span className="truncate max-w-[120px]">{experience.location.split(',')[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{experience.rating}</span>
              <span className="text-slate-500 font-normal">({experience.reviewsCount})</span>
            </div>

            {/* Host info badge */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <img
                src={experience.host.avatar}
                alt={experience.host.name}
                className="w-5 h-5 rounded-full object-cover border border-border-subtle"
              />
              <span className="truncate max-w-[100px] font-medium text-slate-700">
                {experience.host.name.split(' ')[0]}
              </span>
              {experience.host.verified && (
                <CheckCircle className="w-3.5 h-3.5 text-tertiary" title="Verified Host" />
              )}
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(experience)}
            className="font-display font-bold text-base text-slate-900 group-hover:text-primary transition-colors cursor-pointer line-clamp-2 mb-1.5 leading-snug"
          >
            {experience.title}
          </h3>

          {/* Short description */}
          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-3">
            {experience.shortDescription}
          </p>
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-slate-100 mt-2">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xs text-slate-500 block">Sample Price</span>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-bold text-lg text-slate-900">₹{experience.price}</span>
                <span className="text-[11px] text-slate-500 font-normal">/ person</span>
              </div>
            </div>
            <span className="text-[10px] text-tertiary font-semibold uppercase px-2 py-0.5 rounded bg-tertiary/10">
              Demo Data
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetails(experience)}
              className="w-full text-xs font-semibold py-2 px-3 rounded bg-subtle hover:bg-slate-200 text-slate-800 transition-colors text-center"
            >
              View Experience
            </button>

            <button
              onClick={() => onToggleTrip(experience)}
              className={`w-full text-xs font-semibold py-2 px-3 rounded flex items-center justify-center gap-1 transition-all active:scale-98 ${
                isInTrip
                  ? "bg-tertiary text-white hover:bg-tertiary-hover"
                  : "bg-primary text-white hover:bg-primary-hover shadow-sm"
              }`}
            >
              {isInTrip ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add to Trip</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
