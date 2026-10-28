import React, { useState } from 'react';
import { fetchItineraryPlan } from '../services/api';

const INTEREST_OPTIONS = [
  { id: 'heritage', label: 'Heritage & Forts', icon: 'fort' },
  { id: 'culinary', label: 'Culinary Trails', icon: 'restaurant' },
  { id: 'nature', label: 'Nature & Lakes', icon: 'landscape' },
  { id: 'art', label: 'Art & Workshops', icon: 'palette' },
  { id: 'folk', label: 'Folk Performances', icon: 'theater_comedy' },
  { id: 'nightlife', label: 'Evening Rooftops', icon: 'nightlife' },
  { id: 'kayaking', label: 'Lake Kayaking', icon: 'kayaking' }
];

const SPIRITUAL_OPTIONS = [
  { id: 'hindu', label: 'Hindu & Vedic Temples', icon: 'temple_hindu' },
  { id: 'jain', label: 'Jain Pilgrimage & Architecture', icon: 'account_balance' },
  { id: 'sufi', label: 'Sufi & Islamic Shrines', icon: 'mosque' },
  { id: 'buddhist', label: 'Buddhist Monasteries', icon: 'self_improvement' },
  { id: 'sikh', label: 'Sikh Gurdwaras', icon: 'brightness_5' },
  { id: 'church', label: 'Ancient Synagogues & Churches', icon: 'church' },
  { id: 'secular', label: 'All Spiritual Traditions / Secular', icon: 'explore' }
];

export default function TripPlannerView({ onNavigate }) {
  const [destination, setDestination] = useState('Goa, India');
  const [budget, setBudget] = useState(18500);
  const [guestCount, setGuestCount] = useState(2);
  const [selectedInterests, setSelectedInterests] = useState(['Heritage & Forts', 'Culinary Trails', 'Art & Workshops']);
  const [selectedSpiritual, setSelectedSpiritual] = useState(['All Spiritual Traditions / Secular']);
  const [pace, setPace] = useState('Balanced');
  const [transitMode, setTransitMode] = useState('local_taxi');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Dynamic Date & Duration State
  const [startDate, setStartDate] = useState('2026-10-14');
  const [durationDays, setDurationDays] = useState(4);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Helper to calculate end date based on start date and number of days
  const calculateEndDate = (start, days) => {
    try {
      const d = new Date(start);
      if (isNaN(d.getTime())) return '2026-10-17';
      d.setDate(d.getDate() + (days - 1));
      return d.toISOString().split('T')[0];
    } catch (e) {
      return start;
    }
  };

  const endDate = calculateEndDate(startDate, durationDays);
  const nights = Math.max(1, durationDays - 1);

  const formatDateDisplay = (startStr, endStr) => {
    try {
      const s = new Date(startStr);
      const e = new Date(endStr);
      if (isNaN(s.getTime()) || isNaN(e.getTime())) {
        return 'Oct 14 – Oct 17, 2026';
      }
      const sMonth = s.toLocaleString('en-US', { month: 'short' });
      const eMonth = e.toLocaleString('en-US', { month: 'short' });
      const sDay = s.getDate();
      const eDay = e.getDate();
      if (sMonth === eMonth) {
        return `${sMonth} ${sDay} – ${eDay}, ${s.getFullYear()}`;
      }
      return `${sMonth} ${sDay} – ${eMonth} ${eDay}, ${s.getFullYear()}`;
    } catch (err) {
      return `${startStr} – ${endStr}`;
    }
  };

  const handleStartDateChange = (newStart) => {
    setStartDate(newStart);
  };

  const handleEndDateChange = (newEnd) => {
    try {
      const s = new Date(startDate);
      const e = new Date(newEnd);
      const diffMs = e - s;
      if (diffMs >= 0) {
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
        setDurationDays(Math.min(7, Math.max(1, diffDays)));
      }
    } catch (err) {}
  };

  const handleDurationSelect = (daysCount) => {
    setDurationDays(daysCount);
  };

  const handleIncrementDays = () => {
    if (durationDays < 7) {
      setDurationDays(prev => prev + 1);
    }
  };

  const handleDecrementDays = () => {
    if (durationDays > 1) {
      setDurationDays(prev => prev - 1);
    }
  };

  const getBudgetTier = (val) => {
    if (val < 10000) return { label: 'Backpacker Smart', bg: 'bg-surface-container-high text-on-surface' };
    if (val < 32000) return { label: 'Comfortable Boutique', bg: 'bg-secondary text-on-secondary' };
    return { label: 'Heritage Luxury', bg: 'bg-primary text-on-primary' };
  };

  const tier = getBudgetTier(budget);

  const toggleInterest = (label) => {
    setSelectedInterests(prev =>
      prev.includes(label)
        ? (prev.length > 1 ? prev.filter(item => item !== label) : prev)
        : [...prev, label]
    );
  };

  const toggleSpiritual = (label) => {
    setSelectedSpiritual(prev =>
      prev.includes(label)
        ? (prev.length > 1 ? prev.filter(item => item !== label) : prev)
        : [...prev, label]
    );
  };

  const onSelectDestination = (city) => {
    setDestination(`${city}, India`);
  };

  const onClearDestination = () => {
    setDestination('');
  };

  const onIncrementGuests = () => {
    if (guestCount < 12) setGuestCount(prev => prev + 1);
  };

  const onDecrementGuests = () => {
    if (guestCount > 1) setGuestCount(prev => prev - 1);
  };

  const onGenerate = async () => {
    const finalDest = destination.trim() || 'Goa, India';
    setIsGenerating(true);
    setStatusMessage(`Synthesizing ${durationDays}-Day AI Itinerary & Syncing with Supabase...`);

    const tripPayload = {
      destination: finalDest,
      start_date: startDate,
      end_date: endDate,
      days: durationDays,
      nights: nights,
      guests: guestCount,
      spend_per_person: budget,
      total_budget: budget * guestCount,
      budget_tier: tier.label,
      budget_breakdown: {
        stay_pct: 42.0,
        experiences_pct: 34.0,
        dining_transit_pct: 24.0
      },
      interests: selectedInterests.length > 0 ? selectedInterests : ['Heritage & Forts', 'Culinary Trails'],
      spiritual_traditions: selectedSpiritual.length > 0 ? selectedSpiritual : ['All Spiritual Traditions / Secular'],
      pacing: pace,
      transit_mode: transitMode
    };

    // Save inputs locally
    try {
      localStorage.setItem('active_trip_inputs', JSON.stringify(tripPayload));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Call ML Backend Itinerary API
    try {
      const plan = await fetchItineraryPlan(tripPayload);
      if (plan) {
        localStorage.setItem('generated_smart_itinerary', JSON.stringify(plan));
        if (plan.trip_id) {
          localStorage.setItem('active_trip_id', plan.trip_id);
        }
      }
    } catch (err) {
      console.warn('Backend generation note:', err);
    } finally {
      setIsGenerating(false);
      // Navigate to Smart Itinerary View where dynamic output renders
      if (onNavigate) {
        onNavigate('itinerary');
      }
    }
  };

  const isGoa = destination.toLowerCase().includes('goa');

  return (
    <main className="w-full pt-20 bg-surface min-h-[calc(100vh-16rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="flex flex-col w-full">
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* Left Column: Intelligent Planner Form Engine */}
            <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
              {/* Top Navigation & Engine Tag */}
              <div className="flex flex-col gap-3">
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
                  <span className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer" onClick={() => onNavigate && onNavigate('experiences')}>
                    <span className="material-symbols-outlined text-[16px]">home</span>
                    Home
                  </span>
                  <span className="text-outline-variant">/</span>
                  <span className="text-on-surface font-semibold">AI Trip Planner</span>
                </nav>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm tracking-wider uppercase font-bold shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    AI-Powered Itinerary Engine
                  </span>
                  <span className="inline-flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                    <span className="w-2 h-2 rounded-full bg-alert-success animate-pulse"></span>
                    v3.4 Neural Route Synth Active
                  </span>
                </div>
              </div>

              {/* Headline Block */}
              <div className="space-y-2">
                <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-tight">
                  Tell us your budget, we'll plan the rest.
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                  Personalized multi-day routes, opening-hour optimization, and community-backed hidden gems crafted in seconds.
                </p>
              </div>

              {/* Main Input Card */}
              <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 border border-border-subtle">
                {/* Field 1: Destination Search & Rapid Quick-Tags */}
                <div className="flex flex-col gap-2.5">
                  <label className="font-label-lg text-label-lg text-on-surface flex items-center justify-between">
                    <span>Where do you want to explore?</span>
                    <span className="font-label-sm text-label-sm text-primary font-semibold">India & Beyond</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">search</span>
                    <input
                      className="w-full pl-10 pr-10 py-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface placeholder:text-outline outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all border border-border-subtle"
                      id="destination-input"
                      placeholder="Search destination, region or national park..."
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                    {destination && (
                      <button
                        className="absolute right-3 text-outline hover:text-on-surface transition-colors cursor-pointer"
                        onClick={onClearDestination}
                        type="button"
                        title="Clear destination"
                      >
                        <span className="material-symbols-outlined text-[18px]">cancel</span>
                      </button>
                    )}
                  </div>
                  {/* Popular Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">Trending:</span>
                    {["Goa", "Jaipur", "Varanasi", "Hampi", "Udaipur"].map((city) => {
                      const isSelected = destination.toLowerCase().includes(city.toLowerCase());
                      return (
                        <button
                          key={city}
                          className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-all cursor-pointer ${
                            isSelected
                              ? "bg-primary text-on-primary font-bold shadow-sm"
                              : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                          }`}
                          onClick={() => onSelectDestination(city)}
                          type="button"
                        >
                          {city}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Field 2: Dates & Travelers Split Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Interactive Date Range & Duration Picker */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="font-label-md text-label-md text-on-surface-variant">Dates & Duration</label>
                      <button
                        type="button"
                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit_calendar</span>
                        <span>{isDatePickerOpen ? 'Hide Inputs' : 'Select Dates'}</span>
                      </button>
                    </div>

                    {/* Summary Pill Card (Clickable to toggle inputs) */}
                    <div
                      onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all border border-border-subtle"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="material-symbols-outlined text-[20px] text-primary">calendar_month</span>
                        <div className="flex flex-col truncate">
                          <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                            {formatDateDisplay(startDate, endDate)}
                          </span>
                          <span className="font-label-sm text-label-sm text-primary font-bold">
                            {durationDays} {durationDays === 1 ? 'Day' : 'Days'}, {nights} {nights === 1 ? 'Night' : 'Nights'} Plan
                          </span>
                        </div>
                      </div>
                      <span className={`material-symbols-outlined text-[18px] text-outline transition-transform duration-200 ${isDatePickerOpen ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </div>

                    {/* Interactive Duration Quick-Chips (Always accessible) */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">Plan:</span>
                      {[2, 3, 4, 5, 6, 7].map((num) => {
                        const isSelected = durationDays === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => handleDurationSelect(num)}
                            className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-on-primary font-bold shadow-sm'
                                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            {num} Days
                          </button>
                        );
                      })}
                    </div>

                    {/* Expandable Calendar Inputs & Custom Day Stepper */}
                    {isDatePickerOpen && (
                      <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-primary/20 shadow-md flex flex-col gap-3 mt-1 animate-fadeIn">
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="flex flex-col gap-1">
                            <span className="font-label-sm text-[11px] text-outline uppercase font-semibold">Start Date</span>
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => handleStartDateChange(e.target.value)}
                              className="px-2.5 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-xs font-semibold border border-border-subtle outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-label-sm text-[11px] text-outline uppercase font-semibold">End Date</span>
                            <input
                              type="date"
                              value={endDate}
                              min={startDate}
                              onChange={(e) => handleEndDateChange(e.target.value)}
                              className="px-2.5 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-xs font-semibold border border-border-subtle outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1.5 border-t border-border-subtle/70">
                          <span className="font-label-sm text-label-sm text-on-surface font-medium">Trip Duration</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={handleDecrementDays}
                              className="w-6 h-6 rounded bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center justify-center font-bold text-xs cursor-pointer shadow-sm"
                              title="Decrease days"
                            >
                              −
                            </button>
                            <span className="font-label-md text-label-md font-bold text-primary px-2">
                              {durationDays} Days ({nights} Nights)
                            </span>
                            <button
                              type="button"
                              onClick={handleIncrementDays}
                              className="w-6 h-6 rounded bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center justify-center font-bold text-xs cursor-pointer shadow-sm"
                              title="Increase days"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Traveler Stepper */}
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface-variant">Number of Explorers</label>
                    <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-border-subtle">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px] text-primary">group</span>
                        <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                          {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          className="w-7 h-7 rounded-md bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-surface-container transition-colors shadow-sm cursor-pointer"
                          onClick={onDecrementGuests}
                          type="button"
                          aria-label="Decrease guests"
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="w-6 text-center font-label-lg text-label-lg text-on-surface font-bold">
                          {guestCount}
                        </span>
                        <button
                          className="w-7 h-7 rounded-md bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-surface-container transition-colors shadow-sm cursor-pointer"
                          onClick={onIncrementGuests}
                          type="button"
                          aria-label="Increase guests"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Field 3: Dynamic Budget Slider Card */}
                <div className="rounded-xl p-4 bg-surface-container-low flex flex-col gap-3.5 border border-border-subtle">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Estimated Spend Per Person</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
                          ₹{Number(budget).toLocaleString('en-IN')}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">total itinerary</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold shadow-sm ${tier.bg}`}>
                      {tier.label}
                    </span>
                  </div>
                  {/* Range slider */}
                  <div className="space-y-2">
                    <input
                      className="w-full h-2 rounded-lg bg-surface-container-highest appearance-none cursor-pointer accent-primary focus:outline-none"
                      id="budget-range"
                      max="65000"
                      min="4000"
                      onChange={(e) => setBudget(Number(e.target.value))}
                      step="500"
                      type="range"
                      value={budget}
                    />
                    <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant px-0.5">
                      <button type="button" className="hover:text-primary cursor-pointer transition-colors" onClick={() => setBudget(4000)}>
                        ₹4k Backpacker
                      </button>
                      <button type="button" className="hover:text-primary cursor-pointer font-medium text-primary transition-colors" onClick={() => setBudget(25000)}>
                        ₹25k Heritage
                      </button>
                      <button type="button" className="hover:text-primary cursor-pointer transition-colors" onClick={() => setBudget(50000)}>
                        ₹50k+ Luxury
                      </button>
                    </div>
                  </div>
                  {/* Allocation Chart */}
                  <div className="pt-2 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant border-t border-border-subtle/50">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                      <span>Stay: 42%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block"></span>
                      <span>Experiences: 34%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary inline-block"></span>
                      <span>Dining & Transit: 24%</span>
                    </div>
                  </div>
                </div>

                {/* Field 4: Travel Interests / Category Pills (Multi-Select) */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-lg text-label-lg text-on-surface">Curated Interests & Themes</label>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Select 2 to 5</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map((item) => {
                      const isSelected = selectedInterests.includes(item.label);
                      return (
                        <button
                          key={item.id}
                          className={`px-3.5 py-1.5 rounded-full font-label-sm text-label-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-on-primary font-bold shadow-sm'
                              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                          }`}
                          onClick={() => toggleInterest(item.label)}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Field 4B: Religion & Sacred Traditions */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-primary">temple_hindu</span>
                      <span>Religion & Sacred Traditions</span>
                    </label>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Spiritual Heritage</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SPIRITUAL_OPTIONS.map((item) => {
                      const isSelected = selectedSpiritual.includes(item.label);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleSpiritual(item.label)}
                          className={`px-3.5 py-1.5 rounded-full font-label-sm text-label-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-on-primary font-bold shadow-sm'
                              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Field 5: Pace & Transit Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Pace Segmented Control */}
                  <div className="flex flex-col gap-2">
                    <span className="font-label-md text-label-md text-on-surface-variant">Expedition Pace</span>
                    <div className="p-1 rounded-lg bg-surface-container-low grid grid-cols-3 gap-1 border border-border-subtle">
                      {['Relaxed', 'Balanced', 'Packed'].map((p) => {
                        const isSelected = pace === p;
                        return (
                          <button
                            key={p}
                            className={`py-1.5 text-center rounded-md font-label-sm text-label-sm transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                                : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                            onClick={() => setPace(p)}
                            type="button"
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Transit Preference */}
                  <div className="flex flex-col gap-2">
                    <span className="font-label-md text-label-md text-on-surface-variant">Transit Mode</span>
                    <div className="p-1 rounded-lg bg-surface-container-low grid grid-cols-4 gap-1 text-center font-label-sm text-label-sm border border-border-subtle">
                      {[
                        { id: 'directions_walk', label: 'Walk', icon: 'directions_walk' },
                        { id: 'local_taxi', label: 'Taxi', icon: 'local_taxi' },
                        { id: 'directions_bus', label: 'Bus', icon: 'directions_bus' },
                        { id: 'two_wheeler', label: 'Bike', icon: 'two_wheeler' }
                      ].map((t) => {
                        const isSelected = transitMode === t.id;
                        return (
                          <button
                            key={t.id}
                            className={`py-1.5 rounded-md transition-all flex items-center justify-center cursor-pointer ${
                              isSelected
                                ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                                : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                            onClick={() => setTransitMode(t.id)}
                            title={t.label}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Primary Action CTA */}
                <div className="flex flex-col items-center gap-3 pt-2">
                  <button
                    className="w-full py-4 px-6 rounded-lg bg-primary hover:bg-primary-hover text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    id="generate-btn"
                    onClick={onGenerate}
                    disabled={isGenerating}
                    type="button"
                  >
                    {isGenerating ? (
                      <>
                        <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                        <span>{statusMessage || 'Synthesizing ML Itinerary...'}</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-12">auto_fix_high</span>
                        <span>Generate {durationDays}-Day Trip Plan</span>
                        <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                      </>
                    )}
                  </button>
                  <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-alert-warning">bolt</span>
                    <span>4,280+ itineraries generated by community rovers this week</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Destination Spotlight */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
              {/* Destination Spotlight Card */}
              <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col border border-border-subtle">
                <div className="relative w-full h-56 overflow-hidden">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    alt={isGoa ? "Goa Coastal Beach & Portuguese Architecture" : "Udaipur Lake Pichola & Palaces"}
                    src={
                      isGoa
                        ? "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"
                        : "https://lh3.googleusercontent.com/aida-public/AB6AXuAOYKsoTr-Mx2FgHgt95mU7u9T0E3gCN0FRTrjmsYlGFrXuvIZYYnAI00TKXPGwv0u9AG3CxbHRwdo3wKSgjUFcWJre7ELSiRqrDd93KUHPm8e_jhy6KTj_TjIhXORSGB_PN3KNNlQe_pshArdWrgo01uHuslE_XhkF9bvomNqC58P0--EdSd8oJcEhAEWdXD_515jDvRtPCNuEqNlXDsCV1mB5x0w5PC7Y_-vZp08"
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex flex-col justify-end p-5 text-on-primary">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold uppercase tracking-wider">
                        Target Hub
                      </span>
                      <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-primary bg-primary/40 backdrop-blur-md px-2 py-0.5 rounded-md">
                        <span className="material-symbols-outlined text-[14px] text-alert-warning">star</span>
                        4.92 / 5 Community Score
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-primary mt-1">
                      {isGoa ? 'Goa, Tropical Coast & Heritage' : 'Udaipur, City of Lakes'}
                    </h3>
                    <p className="font-label-sm text-label-sm text-primary-fixed-dim">
                      {isGoa
                        ? 'Arabian Sea Coastal Corridor · 15.2993° N, 74.1240° E'
                        : 'Mewar Kingdom Heritage Corridor · 24.5854° N, 73.7125° E'}
                    </p>
                  </div>
                </div>

                {/* Location Intelligence Banner */}
                <div className="p-5 flex flex-col gap-4">
                  <div className="p-3.5 rounded-lg bg-surface-container-low flex items-start gap-3 border border-border-subtle">
                    <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        AI Route Intelligence · {durationDays}-Day Expedition
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {isGoa
                          ? `Covering top coastal forts, Dudhsagar cascades, Old Goa cathedrals, and spice plantations across ${durationDays} days (${nights} nights).`
                          : `Sequencing royal palaces, Lake Pichola ghats, monsoon viewpoints, and generational artisan guilds across ${durationDays} days (${nights} nights).`}
                      </p>
                    </div>
                  </div>

                  {/* Topographic & Itinerary Feature Highlights */}
                  <div className="space-y-3">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
                      YatraSaathi Engine Inclusions
                    </span>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 font-body-sm text-body-sm">
                        <div className="w-6 h-6 rounded-md bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">route</span>
                        </div>
                        <div>
                          <strong className="text-on-surface font-label-md">Dynamic Day Sequencing: </strong>
                          <span className="text-on-surface-variant">Plans exactly {durationDays} distinct days balancing morning, afternoon & evening activities.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 font-body-sm text-body-sm">
                        <div className="w-6 h-6 rounded-md bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                        </div>
                        <div>
                          <strong className="text-on-surface font-label-md">Opening-Hour Verification: </strong>
                          <span className="text-on-surface-variant">Checks verified opening and closing hours for every scheduled stop.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 font-body-sm text-body-sm">
                        <div className="w-6 h-6 rounded-md bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">verified</span>
                        </div>
                        <div>
                          <strong className="text-on-surface font-label-md">Budget Balancing: </strong>
                          <span className="text-on-surface-variant">Distributes accommodation across {nights} nights with safety buffer protection.</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Verified Community Traveler Card */}
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex items-start gap-4 border border-border-subtle">
                <div className="relative shrink-0">
                  <img
                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                    alt="Traveler portrait"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[12px]">check</span>
                  </span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">Ananya Sharma</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Planned 3 days ago</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant italic line-clamp-2">
                    “The dynamic duration and budget selector adjusted my {durationDays}-day plan instantly. Every day was structured seamlessly.”
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="font-label-sm text-label-sm text-secondary font-medium">Verified Rover · 14 Expeditions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
