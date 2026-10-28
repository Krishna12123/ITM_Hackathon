import React, { useState } from 'react';
import {
  MapPin,
  Star,
  ShieldCheck,
  Heart,
  Luggage,
  Share2,
  Clock,
  Ticket,
  Sun,
  CheckCircle,
  Lightbulb,
  Navigation,
  Compass,
  ArrowRight,
  ExternalLink,
  Check
} from 'lucide-react';
import { MOCK_DESTINATIONS, MOCK_EXPERIENCES } from '../data/mockData';
import ExperienceCard from '../components/ExperienceCard';
import ExperienceDetailModal from '../components/ExperienceDetailModal';

export default function PlaceDetailsPage({
  favorites,
  onToggleFavorite,
  tripItems,
  onToggleTrip,
  onNavigateToExperiences
}) {
  const [selectedDestinationId, setSelectedDestinationId] = useState('orchha-heritage');
  const [activeModalExperience, setActiveModalExperience] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Active Destination
  const destination = MOCK_DESTINATIONS.find((d) => d.id === selectedDestinationId) || MOCK_DESTINATIONS[0];
  const isDestinationFavorite = favorites.includes(destination.id);
  const isDestinationInTrip = tripItems.some((item) => item.id === destination.id);

  // Filter related experiences
  const relatedExperiences = MOCK_EXPERIENCES.filter((exp) =>
    destination.relatedExperiences?.includes(exp.id)
  );

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="min-h-screen bg-canvas pb-20 animate-fadeInUp">
      {/* Breadcrumb Navigation & Destination Selector */}
      <div className="bg-card border-b border-border-subtle py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Breadcrumb path */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
            <span
              onClick={onNavigateToExperiences}
              className="hover:text-primary cursor-pointer transition-colors"
            >
              Home
            </span>
            <span>/</span>
            <span className="hover:text-primary cursor-pointer transition-colors">
              Destinations
            </span>
            <span>/</span>
            <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-none">
              {destination.name}
            </span>
          </nav>

          {/* Quick Destination Switcher for Demo */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
              Sample Place:
            </span>
            <div className="flex items-center gap-1 bg-subtle p-1 rounded-full border border-border-subtle">
              {MOCK_DESTINATIONS.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDestinationId(dest.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 active:scale-95 ${
                    selectedDestinationId === dest.id
                      ? "bg-primary text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {dest.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden shadow-level-2 border border-border-subtle bg-slate-900 transition-all duration-300">
          <div className="relative h-[360px] sm:h-[460px] w-full bg-slate-900">
            <img
              src={destination.heroImage}
              alt={destination.name}
              loading="eager"
              fetchPriority="high"
              className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80";
              }}
            />
            {/* Cinematic Multi-Stop Dark Gradient for Guaranteed High Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/20 pointer-events-none" />

            {/* Top Action Buttons: Favorite & Share */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                onClick={handleShare}
                aria-label="Share destination"
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-slate-800 hover:text-primary flex items-center justify-center transition-all duration-200 shadow-md active:scale-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {copiedShare ? (
                  <Check className="w-4 h-4 text-tertiary" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => onToggleFavorite(destination.id)}
                aria-label={isDestinationFavorite ? "Remove favorite" : "Favorite destination"}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-800 hover:text-primary transition-all duration-200 shadow-md active:scale-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-200 ${
                    isDestinationFavorite ? "fill-primary text-primary scale-110" : ""
                  }`}
                />
              </button>
            </div>

            {/* Hero Information Overlay */}
            <div className="absolute bottom-6 left-6 right-6 text-white max-w-4xl animate-fadeInUp">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-tertiary px-3 py-1 rounded-full shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {destination.verifiedStatus}
                </span>

                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                  <span>{destination.rating}</span>
                  <span className="font-semibold text-slate-800">
                    ({destination.reviewsCount} reviews)
                  </span>
                </div>
              </div>

              {/* Title & Tagline */}
              <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mb-2 drop-shadow-md">
                {destination.name}
              </h1>

              <div className="flex items-center gap-2 text-slate-200 text-xs sm:text-sm mb-4 drop-shadow-sm">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{destination.location}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl line-clamp-2 drop-shadow-sm">
                {destination.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action & Quick Overview Bar */}
        <div className="bg-card rounded-xl p-4 sm:p-6 border border-border-subtle shadow-level-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Planning your journey to {destination.name.split(' ')[0]}?
              </h3>
              <p className="text-xs text-slate-500">
                Add this destination to your itinerary to generate an AI-optimized route with local transport and timings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto">
            <button
              onClick={() => onToggleTrip(destination)}
              className={`flex-1 md:flex-initial btn-primary px-8 py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                isDestinationInTrip ? "bg-tertiary hover:bg-tertiary-hover text-white" : ""
              }`}
            >
              {isDestinationInTrip ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Added to My Trip</span>
                </>
              ) : (
                <>
                  <Luggage className="w-4 h-4" />
                  <span>Add to My Trip</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Two-Column Layout: Details + Map Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Section */}
            <section className="bg-card rounded-xl p-6 border border-border-subtle shadow-level-1">
              <h2 className="font-display font-bold text-xl text-slate-900 mb-3 flex items-center gap-2">
                <span>About the Destination</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {destination.overview}
              </p>
            </section>

            {/* Highlights Section */}
            <section className="bg-card rounded-xl p-6 border border-border-subtle shadow-level-1">
              <h2 className="font-display font-bold text-xl text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-tertiary" />
                <span>Destination Highlights</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {destination.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-lg bg-subtle border border-slate-200/70 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Travel Tips Section */}
            <section className="bg-card rounded-xl p-6 border border-border-subtle shadow-level-1">
              <h2 className="font-display font-bold text-xl text-slate-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-secondary" />
                <span>Local Insider Travel Tips</span>
              </h2>
              <div className="space-y-3">
                {destination.travelTips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs sm:text-sm"
                  >
                    <span className="text-secondary font-bold text-base leading-none mt-0.5">💡</span>
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Practical Details & Map Preview */}
          <div className="space-y-6">
            {/* Practical Visitor Details Card */}
            <div className="bg-card rounded-xl p-6 border border-border-subtle shadow-level-1 space-y-5">
              <h3 className="font-display font-bold text-lg text-slate-900 border-b border-border-subtle pb-3">
                Visitor Information
              </h3>

              {/* Opening Hours */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Opening Hours
                  </span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {destination.openingHours}
                  </p>
                </div>
              </div>

              {/* Entry Fee */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Entry Fee
                  </span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5 leading-snug">
                    {destination.entryFee}
                  </p>
                </div>
              </div>

              {/* Best Visiting Time */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0 mt-0.5">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Best Visiting Time
                  </span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {destination.bestVisitingTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Map / Location Preview Card */}
            <div className="bg-card rounded-xl overflow-hidden border border-border-subtle shadow-level-1">
              <div className="p-4 border-b border-border-subtle bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-primary" />
                  <h3 className="font-display font-bold text-sm text-slate-900">
                    Location & Geography
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">
                  GPS Ready
                </span>
              </div>

              {/* Visual Map Mock Box */}
              <div className="relative h-48 bg-gradient-to-br from-slate-100 via-emerald-50 to-orange-50 p-4 flex flex-col justify-between overflow-hidden">
                {/* Visual grid / contour lines */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0F766E_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Map Pin Marker */}
                <div className="relative z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md p-2.5 rounded-lg shadow-level-2 border border-slate-200 self-start max-w-xs">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white shrink-0 animate-bounce">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-xs text-slate-900 truncate">
                      {destination.name}
                    </h5>
                    <p className="text-[10px] text-slate-500">
                      {destination.mapCoordinates.lat}° N, {destination.mapCoordinates.lng}° E
                    </p>
                  </div>
                </div>

                {/* Coordinates & Elevation Info */}
                <div className="relative z-10 bg-slate-900/80 backdrop-blur-md rounded-md p-2 text-white text-[11px] flex items-center justify-between">
                  <span>Alt: {destination.mapCoordinates.elevation}</span>
                  <span className="text-primary-tint font-mono">
                    {destination.mapCoordinates.lat.toFixed(2)}, {destination.mapCoordinates.lng.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Transit detail */}
              <div className="p-4 bg-white text-xs text-slate-600 border-t border-border-subtle space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-800">Nearest Transit:</span>
                  <span>{destination.mapCoordinates.nearestTransit}</span>
                </div>
                <a
                  href={`https://maps.google.com/?q=${destination.mapCoordinates.lat},${destination.mapCoordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary font-semibold hover:underline pt-1"
                >
                  <span>Open in External Navigation Map</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Experiences Section */}
        {relatedExperiences.length > 0 && (
          <section className="pt-6 border-t border-border-subtle">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-slate-900">
                  Top Experiences Around {destination.name.split(' ')[0]}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Authentic local cultural immersion and culinary trails verified near this destination.
                </p>
              </div>

              <button
                onClick={onNavigateToExperiences}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary-hover transition-colors"
              >
                <span>Browse All Experiences</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedExperiences.map((exp) => (
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
          </section>
        )}
      </main>

      {/* Modal for Experience Inspection */}
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
