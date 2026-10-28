import React from 'react';
import { X, Star, Clock, MapPin, CheckCircle, ShieldCheck, Heart, Plus, Check } from 'lucide-react';

export default function ExperienceDetailModal({
  experience,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  isInTrip,
  onToggleTrip
}) {
  if (!isOpen || !experience) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-card rounded-xl max-w-2xl w-full shadow-level-3 overflow-hidden border border-border-subtle"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-100">
          <img
            src={experience.image}
            alt={experience.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-colors shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Favorite Button */}
          <button
            onClick={() => onToggleFavorite(experience.id)}
            className="absolute top-4 right-16 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-800 hover:text-primary flex items-center justify-center transition-colors shadow-md"
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? "fill-primary text-primary" : ""}`}
            />
          </button>

          {/* Overlay details */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary text-white">
                {experience.category}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                Demo Experience
              </span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl leading-tight">
              {experience.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-subtle rounded-lg text-center">
            <div>
              <span className="text-[11px] text-slate-500 block">Rating</span>
              <div className="flex items-center justify-center gap-1 font-display font-bold text-slate-900 text-sm mt-0.5">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{experience.rating}</span>
              </div>
            </div>
            <div className="border-x border-border-subtle">
              <span className="text-[11px] text-slate-500 block">Duration</span>
              <div className="flex items-center justify-center gap-1 font-display font-bold text-slate-900 text-sm mt-0.5">
                <Clock className="w-4 h-4 text-slate-700" />
                <span>{experience.duration}</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Sample Price</span>
              <div className="font-display font-bold text-primary text-sm mt-0.5">
                ₹{experience.price}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-display font-bold text-sm text-slate-900 mb-2">About This Experience</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {experience.shortDescription} This immersive session is curated with local culture-bearers to ensure authentic community engagement and direct economic benefit to regional artisans.
            </p>
          </div>

          {/* Highlights */}
          {experience.highlights && (
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900 mb-2.5">Key Highlights</h4>
              <ul className="space-y-2">
                {experience.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Host Bio Card */}
          <div className="p-4 rounded-lg border border-border-subtle bg-canvas flex items-center gap-3">
            <img
              src={experience.host.avatar}
              alt={experience.host.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h5 className="font-display font-bold text-sm text-slate-900">{experience.host.name}</h5>
                {experience.host.verified && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Host
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{experience.host.role}</p>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {experience.location}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-border-subtle bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">Sample Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-xl text-slate-900">₹{experience.price}</span>
              <span className="text-xs text-slate-500">{experience.priceNote}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold rounded-DEFAULT bg-white border border-border-subtle text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onToggleTrip(experience)}
              className={`px-5 py-2.5 text-sm font-semibold rounded-DEFAULT flex items-center gap-1.5 transition-all active:scale-98 shadow-sm ${
                isInTrip
                  ? "bg-tertiary text-white hover:bg-tertiary-hover"
                  : "bg-primary text-white hover:bg-primary-hover"
              }`}
            >
              {isInTrip ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Added to Trip</span>
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
    </div>
  );
}
