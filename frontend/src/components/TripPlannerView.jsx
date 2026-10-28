import React, { useState } from 'react';
import { submitTripInputs, fetchItineraryPlan } from '../services/api';
import { supabase } from '../lib/supabaseClient';

export default function TripPlannerView({ onNavigate }) {
  const [budget, setBudget] = useState(18500);
  const [guestCount, setGuestCount] = useState(2);
  const [destination, setDestination] = useState('Udaipur, Rajasthan, India');

  const onBudgetChange = (val) => {
    const numeric = parseInt(val, 10);
    setBudget(numeric);
    const slider = document.getElementById('budget-range');
    if (slider) slider.value = numeric;
    const display = document.getElementById('budget-display');
    const badge = document.getElementById('budget-tier-badge');
    if (display) display.textContent = '₹' + Number(numeric).toLocaleString('en-IN');
    if (badge) {
      if (numeric < 10000) {
        badge.textContent = 'Backpacker Smart';
        badge.className = 'px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold shadow-sm';
      } else if (numeric < 32000) {
        badge.textContent = 'Comfortable Boutique';
        badge.className = 'px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold shadow-sm';
      } else {
        badge.textContent = 'Heritage Luxury';
        badge.className = 'px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-semibold shadow-sm';
      }
    }
  };

  const onSelectDestination = (name) => {
    setDestination(name + ', India');
    const input = document.getElementById('destination-input');
    if (input) {
      input.value = name + ', India';
      input.focus();
    }
  };

  const onClearDestination = () => {
    setDestination('');
    const input = document.getElementById('destination-input');
    if (input) {
      input.value = '';
      input.focus();
    }
  };

  const onIncrementGuests = () => {
    if (guestCount < 12) {
      const next = guestCount + 1;
      setGuestCount(next);
      const label = document.getElementById('guest-count-label');
      const num = document.getElementById('guest-numeric');
      if (label && num) {
        label.textContent = next + (next === 1 ? ' Guest' : ' Guests');
        num.textContent = next;
      }
    }
  };

  const onDecrementGuests = () => {
    if (guestCount > 1) {
      const next = guestCount - 1;
      setGuestCount(next);
      const label = document.getElementById('guest-count-label');
      const num = document.getElementById('guest-numeric');
      if (label && num) {
        label.textContent = next + (next === 1 ? ' Guest' : ' Guests');
        num.textContent = next;
      }
    }
  };

  const onToggleInterest = (e) => {
    const btn = e.currentTarget;
    const isActive = btn.classList.contains('active');
    if (isActive) {
      btn.classList.remove('active', 'bg-primary', 'text-on-primary', 'shadow-sm');
      btn.classList.add('inactive', 'bg-surface-container-low', 'text-on-surface-variant');
    } else {
      btn.classList.add('active', 'bg-primary', 'text-on-primary', 'shadow-sm');
      btn.classList.remove('inactive', 'bg-surface-container-low', 'text-on-surface-variant');
    }
  };

  const onSetPace = (e) => {
    const btn = e.currentTarget;
    document.querySelectorAll('.pace-btn').forEach(b => {
      b.classList.remove('bg-surface-container-lowest', 'text-primary', 'font-semibold', 'shadow-sm');
      b.classList.add('text-on-surface-variant');
    });
    btn.classList.add('bg-surface-container-lowest', 'text-primary', 'font-semibold', 'shadow-sm');
    btn.classList.remove('text-on-surface-variant');
  };

  const onSetTransit = (e) => {
    const btn = e.currentTarget;
    document.querySelectorAll('.transit-btn').forEach(b => {
      b.classList.remove('bg-surface-container-lowest', 'text-primary', 'font-semibold', 'shadow-sm');
      b.classList.add('text-on-surface-variant');
    });
    btn.classList.add('bg-surface-container-lowest', 'text-primary', 'font-semibold', 'shadow-sm');
    btn.classList.remove('text-on-surface-variant');
  };

  const onGenerate = async () => {
    const btn = document.getElementById('generate-btn');
    if (!btn) return;
    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined text-[20px] animate-spin">refresh</span><span>Synthesizing ML Itinerary & Storing in Supabase...</span>';

    // 1. Gather all active interests and themes
    const activeInterests = Array.from(document.querySelectorAll('#interest-container .interest-chip.active'))
      .map(el => el.innerText.trim().replace(/^[a-z0-9_]+\n*/i, '').trim())
      .filter(Boolean);

    // 2. Gather active spiritual heritage focus
    const activeSpiritual = Array.from(document.querySelectorAll('#faith-container .interest-chip.active'))
      .map(el => el.innerText.trim().replace(/^[a-z0-9_]+\n*/i, '').trim())
      .filter(Boolean);

    // 3. Gather pace selection
    const activePaceEl = document.querySelector('.pace-btn.bg-surface-container-lowest') || document.querySelector('.pace-btn.text-primary');
    const activePace = activePaceEl ? activePaceEl.textContent.trim() : 'Balanced';

    // 4. Gather transit selection
    const activeTransitEl = document.querySelector('.transit-btn.bg-surface-container-lowest');
    const transitTitle = activeTransitEl ? (activeTransitEl.getAttribute('title') || 'local_taxi') : 'local_taxi';

    // 5. Construct full trip inputs payload
    const tripPayload = {
      destination: destination || 'Udaipur, Rajasthan, India',
      start_date: 'Oct 14',
      end_date: 'Oct 18',
      days: 4,
      nights: 3,
      guests: guestCount,
      spend_per_person: budget,
      total_budget: budget * guestCount,
      budget_tier: budget < 10000 ? 'Backpacker Smart' : budget < 32000 ? 'Comfortable Boutique' : 'Heritage Luxury',
      budget_breakdown: {
        stay_pct: 42.0,
        experiences_pct: 34.0,
        dining_transit_pct: 24.0
      },
      interests: activeInterests.length > 0 ? activeInterests : ['Heritage & Forts', 'Culinary Trails', 'Art & Workshops'],
      spiritual_traditions: activeSpiritual.length > 0 ? activeSpiritual : ['Jain Pilgrimage & Architecture'],
      pacing: activePace,
      transit_mode: transitTitle
    };

    // Cache locally for instant UI state
    try {
      localStorage.setItem('active_trip_inputs', JSON.stringify(tripPayload));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // 6. Generate ML smart itinerary and persist in Supabase
    try {
      const plan = await fetchItineraryPlan(tripPayload);
      if (plan) {
        localStorage.setItem('generated_smart_itinerary', JSON.stringify(plan));
        if (plan.trip_id) {
          localStorage.setItem('active_trip_id', plan.trip_id);
        }
      }
    } catch (err) {
      console.warn('ML Itinerary fetch note:', err);
    }

    // 7. Direct navigation to Smart Itinerary where all UI is populated by ML model
    if (onNavigate) {
      onNavigate('itinerary');
    }
  };

  return (
  <main className="w-full pt-20 bg-surface min-h-[calc(100vh-16rem)]">
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Column: Intelligent Planner Form Engine (approx 58%) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
            {/* Top Navigation & Engine Tag */}
            <div className="flex flex-col gap-3">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
                <a className="hover:text-primary transition-colors flex items-center gap-1" href="#">
                  <span className="material-symbols-outlined text-[16px]">home</span>

            Home
                          </a>
                <span className="text-outline-variant">/</span>
                <a className="hover:text-primary transition-colors" href="#">Trip Planner</a>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface font-semibold">New Trip</span>
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
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-tight">Tell us your budget, we'll plan the rest.</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">Personalized multi-day routes, opening-hour optimization, and community-backed hidden gems crafted in seconds.</p>
            </div>
            {/* Main Input Card (Elevated Level 1) */}
            <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
              {/* Field 1: Destination Search & Rapid Quick-Tags */}
              <div className="flex flex-col gap-2.5">
                <label className="font-label-lg text-label-lg text-on-surface flex items-center justify-between">
                  <span className="">Where do you want to explore?</span>
                  <span className="font-label-sm text-label-sm text-secondary font-medium">India & Beyond</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-outline pointer-events-none">search</span>
                  <input className="w-full pl-10 pr-10 py-3 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface placeholder:text-outline outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-fixed transition-all" id="destination-input" placeholder="Search destination, region or national park..." type="text" value="Udaipur, Rajasthan" />
                  <button className="absolute right-3 text-outline hover:text-on-surface transition-colors" onClick={onClearDestination} type="button">
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                  </button>
                </div>
                {/* Popular Pills */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">Trending:</span>
                  <button className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm transition-colors" onClick={() => onSelectDestination("Jaipur")} type="button">Jaipur</button>
                  <button className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm transition-colors" onClick={() => onSelectDestination("Varanasi")} type="button">Varanasi</button>
                  <button className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm transition-colors" onClick={() => onSelectDestination("Hampi")} type="button">Hampi</button>
                  <button className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm transition-colors" onClick={() => onSelectDestination("Goa")} type="button">Goa</button>
                  <button className="px-2.5 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm transition-colors" onClick={() => onSelectDestination("Udaipur")} type="button">Udaipur</button>
                </div>
              </div>
              {/* Field 2: Dates & Travelers Split Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date Range Picker */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant">Dates & Duration</label>
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="material-symbols-outlined text-[20px] text-primary">calendar_month</span>
                      <div className="flex flex-col truncate">
                        <span className="font-label-lg text-label-lg text-on-surface truncate">Oct 14 - Oct 18</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">4 Days, 3 Nights</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-outline">expand_more</span>
                  </div>
                </div>
                {/* Traveler Stepper */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface-variant">Number of Explorers</label>
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-surface-container-low">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-primary">group</span>
                      <span className="font-label-lg text-label-lg text-on-surface" id="guest-count-label">2 Guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="w-7 h-7 rounded-md bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-surface-container transition-colors shadow-sm" onClick={onDecrementGuests} type="button">
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <span className="w-6 text-center font-label-lg text-label-lg text-on-surface font-semibold" id="guest-numeric">2</span>
                      <button className="w-7 h-7 rounded-md bg-surface-container-lowest text-on-surface flex items-center justify-center hover:bg-surface-container transition-colors shadow-sm" onClick={onIncrementGuests} type="button">
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Field 3: Dynamic Budget Slider Card */}
              <div className="rounded-xl p-4 bg-surface-container-low flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Estimated Spend Per Person</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight" id="budget-display">₹18,500</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">total itinerary</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold shadow-sm" id="budget-tier-badge">Comfortable Boutique</span>
                </div>
                {/* Range slider */}
                <div className="space-y-2">
                  <input className="w-full h-2 rounded-lg bg-surface-container-highest appearance-none cursor-pointer accent-primary focus:outline-none" id="budget-range" max="65000" min="4000" onInput={(e) => onBudgetChange(e.target.value)} step="500" type="range" value="18500" />
                  <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant px-0.5">
                    <span className="hover:text-primary cursor-pointer" onClick={() => onBudgetChange(4000)}>₹4k Backpacker</span>
                    <span className="hover:text-primary cursor-pointer font-medium text-primary" onClick={() => onBudgetChange(25000)}>₹25k Heritage</span>
                    <span className="hover:text-primary cursor-pointer" onClick={() => onBudgetChange(55000)}>₹50k+ Luxury</span>
                  </div>
                </div>
                {/* Micro Allocation Chart (SVG spark/breakdown) */}
                <div className="pt-2 flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                    <span className="">Stay: 42%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block"></span>
                    <span className="">Experiences: 34%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-alert-warning inline-block"></span>
                    <span className="">Dining & Transit: 24%</span>
                  </div>
                </div>
              </div>
              {/* Field 4: Travel Interests / Category Pills (Multi-Select) */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-lg text-label-lg text-on-surface">Curated Interests & Themes</label>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Select 2 to 5</span>
                </div>
                <div className="flex flex-wrap gap-2" id="interest-container">
                  <button className="interest-chip active px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm transition-all flex items-center gap-1.5 shadow-sm" onClick={onToggleInterest} type="button">
                    <span className="material-symbols-outlined text-[16px]">fort</span>

              Heritage & Forts
                              </button>
                  <button className="interest-chip active px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm transition-all flex items-center gap-1.5 shadow-sm" onClick={onToggleInterest} type="button">
                    <span className="material-symbols-outlined text-[16px]">restaurant</span>

              Culinary Trails
                              </button>
                  <button className="interest-chip inactive px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm transition-all flex items-center gap-1.5" onClick={onToggleInterest} type="button">
                    <span className="material-symbols-outlined text-[16px]">landscape</span>

              Nature & Lakes
                              </button>
                  <button className="interest-chip active px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm transition-all flex items-center gap-1.5 shadow-sm" onClick={onToggleInterest} type="button">
                    <span className="material-symbols-outlined text-[16px]">palette</span>

              Art & Workshops
                              </button>
                  <button className="interest-chip inactive px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm transition-all flex items-center gap-1.5" onClick={onToggleInterest} type="button">
                    <span className="material-symbols-outlined text-[16px]">theater_comedy</span>

              Folk Performances
                              </button>
                  <button className="interest-chip inactive px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm transition-all flex items-center gap-1.5" onClick={onToggleInterest} type="button">
                    <span className="material-symbols-outlined text-[16px]">nightlife</span>

              Evening Rooftops
                              </button>
                  <button className="interest-chip inactive px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm transition-all flex items-center gap-1.5" onClick={onToggleInterest} type="button">
                    <span className="material-symbols-outlined text-[16px]">kayaking</span>

              Lake Kayaking
                              </button>
                </div>
                <div className="flex flex-col gap-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-primary">temple_hindu</span>
                      <span className="">Religion & Sacred Traditions</span>
                    </label>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Spiritual Heritage</span>
                  </div>
                  <div className="flex flex-wrap gap-2" id="faith-container">
                    <button type="button" onClick={onToggleInterest} className="interest-chip inactive px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm transition-all flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">temple_hindu</span>
Hindu & Vedic Temples                    </button>
                    <button type="button" onClick={onToggleInterest} className="interest-chip active px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm transition-all flex items-center gap-1.5 shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">account_balance</span>
Jain Pilgrimage & Architecture                    </button>
                    <button type="button" onClick={onToggleInterest} className="interest-chip inactive px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm transition-all flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">mosque</span>
Sufi & Islamic Shrines                    </button>
                    <button type="button" onClick={onToggleInterest} className="interest-chip inactive px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm transition-all flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">self_improvement</span>
Buddhist Monasteries                    </button>
                    <button type="button" onClick={onToggleInterest} className="interest-chip inactive px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm transition-all flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">brightness_5</span>
Sikh Gurdwaras                    </button>
                    <button type="button" onClick={onToggleInterest} className="interest-chip inactive px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm transition-all flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">church</span>
Ancient Synagogues & Churches                    </button>
                    <button type="button" onClick={onToggleInterest} className="interest-chip inactive px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm transition-all flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">explore</span>
All Spiritual Traditions / Secular                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-primary">temple_hindu</span>
                      <span className="">Religion & Sacred Traditions</span>
                    </label>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Optional Heritage Focus</span>
                  </div>
                </div>
              </div>
              {/* Field 5: Pace & Transit Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Pace Segmented Control */}
                <div className="flex flex-col gap-2">
                  <span className="font-label-md text-label-md text-on-surface-variant">Expedition Pace</span>
                  <div className="p-1 rounded-lg bg-surface-container-low grid grid-cols-3 gap-1">
                    <button className="pace-btn py-1.5 text-center rounded-md font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-all" onClick={onSetPace} type="button">Relaxed</button>
                    <button className="pace-btn py-1.5 text-center rounded-md font-label-sm text-label-sm bg-surface-container-lowest text-primary font-semibold shadow-sm transition-all" onClick={onSetPace} type="button">Balanced</button>
                    <button className="pace-btn py-1.5 text-center rounded-md font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-all" onClick={onSetPace} type="button">Packed</button>
                  </div>
                </div>
                {/* Transit Preference */}
                <div className="flex flex-col gap-2">
                  <span className="font-label-md text-label-md text-on-surface-variant">Transit Mode</span>
                  <div className="p-1 rounded-lg bg-surface-container-low grid grid-cols-4 gap-1 text-center font-label-sm text-label-sm">
                    <button className="transit-btn py-1.5 rounded-md text-on-surface-variant hover:text-on-surface transition-all flex items-center justify-center" onClick={onSetTransit} title="Walking & On Foot" type="button">
                      <span className="material-symbols-outlined text-[18px]">directions_walk</span>
                    </button>
                    <button className="transit-btn py-1.5 rounded-md bg-surface-container-lowest text-primary font-semibold shadow-sm transition-all flex items-center justify-center" onClick={onSetTransit} title="Auto-rickshaw / Taxi" type="button">
                      <span className="material-symbols-outlined text-[18px]">local_taxi</span>
                    </button>
                    <button className="transit-btn py-1.5 rounded-md text-on-surface-variant hover:text-on-surface transition-all flex items-center justify-center" onClick={onSetTransit} title="Public Ferry & Bus" type="button">
                      <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                    </button>
                    <button className="transit-btn py-1.5 rounded-md text-on-surface-variant hover:text-on-surface transition-all flex items-center justify-center" onClick={onSetTransit} title="Rented Bike / Car" type="button">
                      <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Primary Action CTA */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <button className="w-full py-4 px-6 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer" id="generate-btn" onClick={onGenerate} type="button">
                  <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-12">auto_fix_high</span>
                  <span className="">Generate My Trip</span>
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </button>
                <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-alert-warning">bolt</span>
                  <span className="">4,280+ itineraries generated by community rovers this week</span>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column: Interactive Destination Spotlight & Realtime Context (approx 42%) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
            {/* Destination Spotlight Card (Scenic preview of Udaipur) */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="relative w-full h-56 overflow-hidden">
                <img className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" data-alt="Majestic golden hour sunlight reflecting off the calm waters of Lake Pichola in Udaipur, showing the pristine white marble architecture of City Palace and traditional Rajasthani boats, warm terracotta and amber sky colors, documentary cinematic travel photography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOYKsoTr-Mx2FgHgt95mU7u9T0E3gCN0FRTrjmsYlGFrXuvIZYYnAI00TKXPGwv0u9AG3CxbHRwdo3wKSgjUFcWJre7ELSiRqrDd93KUHPm8e_jhy6KTj_TjIhXORSGB_PN3KNNlQe_pshArdWrgo01uHuslE_XhkF9bvomNqC58P0--EdSd8oJcEhAEWdXD_515jDvRtPCNuEqNlXDsCV1mB5x0w5PC7Y_-vZp08" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex flex-col justify-end p-5 text-on-primary">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold uppercase tracking-wider">Target Hub</span>
                    <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-primary bg-primary/40 backdrop-blur-md px-2 py-0.5 rounded-md">
                      <span className="material-symbols-outlined text-[14px] text-alert-warning">star</span>

                4.92 / 5 Community Score
                                  </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-primary mt-1">Udaipur, City of Lakes</h3>
                  <p className="font-label-sm text-label-sm text-primary-fixed-dim">Mewar Kingdom Heritage Corridor · 24.5854° N, 73.7125° E</p>
                </div>
              </div>
              {/* Location Intelligence Banner */}
              <div className="p-5 flex flex-col gap-4">
                <div className="p-3.5 rounded-lg bg-surface-container-low flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">AI Route Intelligence · October Window</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Mild 26°C sunset breezes around Pichola. Booking the Composite Museum Heritage Pass avoids 45-min peak ticketing queues.</p>
                  </div>
                </div>
                {/* Topographic & Itinerary Feature Highlights */}
                <div className="space-y-3">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">YatraSathi Engine Inclusions</span>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 font-body-sm text-body-sm">
                      <div className="w-6 h-6 rounded-md bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[14px]">route</span>
                      </div>
                      <div>
                        <strong className="text-on-surface font-label-md">Topographic Step-Sequencing:</strong>
                        <span className="text-on-surface-variant">Orders uphill palaces before midday sun to conserve walking stamina.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 font-body-sm text-body-sm">
                      <div className="w-6 h-6 rounded-md bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                      </div>
                      <div>
                        <strong className="text-on-surface font-label-md">Live Crowd Dispersion:</strong>
                        <span className="text-on-surface-variant">Flags morning aarti ceremonies at Jagdish Temple before bus tour arrivals.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 font-body-sm text-body-sm">
                      <div className="w-6 h-6 rounded-md bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                      </div>
                      <div>
                        <strong className="text-on-surface font-label-md">Artisan & Culinary Verification:</strong>
                        <span className="text-on-surface-variant">Routes through 4 authentic miniature-painting workshops run by generational masters.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Verified Community Traveler Card */}
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex items-start gap-4">
              <div className="relative shrink-0">
                <img className="w-12 h-12 rounded-full object-cover shadow-sm" data-alt="Portrait photo of a young female solo traveler smiling outdoors with camera strap against ancient carved sandstone architecture, soft golden morning light, realistic documentary style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxczpXnnWkVn8w8swJjxs7qy8UuCUPHYbGHGxEHXi_Y-ZBdf6lhhVxqAc0XU_nLDAG0jE7gjn-NvdB9dxGRG4QmHQi_PtUz0hnEYeTRyD30BHMBlNb8cer2uePWz_1bzFmjCLyAVgRs4PLVsCItuEc1TGcStKuHLu_KA1oyeDyj9x8xh5-9CUXwMAuKLehoS8U3_49Pik_K3W8Mxi9NiXosBvjIF4j8k_WTVMfHmE" />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[12px]">check</span>
                </span>
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">Ananya Sharma</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Planned 3 days ago</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant italic line-clamp-2">“The dynamic budget slider hit my ₹16,000 threshold precisely. Found rooftops in Old Udaipur I never would have discovered on social media.”</p>
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
