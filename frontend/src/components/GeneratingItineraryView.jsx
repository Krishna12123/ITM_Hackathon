import React, { useEffect } from 'react';
import { fetchItineraryPlan } from '../services/api';

export default function GeneratingItineraryView({ onNavigate }) {
  useEffect(() => {
    // 1. Fetch ML Itinerary in Background
    const runGeneration = async () => {
      try {
        const stored = localStorage.getItem('active_trip_inputs');
        const params = stored ? JSON.parse(stored) : {
          destination: 'Udaipur, Rajasthan',
          days: 4,
          guests: 2,
          budget: 18500,
          spend_per_person: 18500,
          interests: ['heritage', 'culinary', 'nature', 'art'],
          spiritual_traditions: ['hindu_temples', 'jain_architecture'],
          pacing: 'Balanced',
          transit_mode: 'auto_walk'
        };

        const plan = await fetchItineraryPlan(params);
        if (plan && plan.status !== 'error') {
          localStorage.setItem('generated_smart_itinerary', JSON.stringify(plan));
          if (plan.trip_id) {
            localStorage.setItem('active_trip_id', plan.trip_id);
          }
        }
        const tickerElem = document.getElementById('ticker-text');
        if (tickerElem) tickerElem.textContent = "Itinerary synthesized! Opening view...";
        const percentElem = document.getElementById('percent-display');
        if (percentElem) percentElem.textContent = "100%";
        const progressFill = document.getElementById('progress-bar-fill');
        if (progressFill) progressFill.style.width = "100%";

        setTimeout(() => {
          if (onNavigate) onNavigate('itinerary');
        }, 900);
      } catch (err) {
        console.warn('ML Itinerary fetch background note:', err);
      }
    };

    runGeneration();

    const phrases = [
      "Running Sentence Transformers semantic matching on regional attractions...",
      "Executing Google OR-Tools routing & opening-hours constraint solver...",
      "Evaluating Lake Pichola water levels for sunset photography...",
      "Balancing afternoon heat index with shaded café rest stops...",
      "Generating Gemini cultural narratives & verified budget ledgers..."
    ];
    
    let stepIndex = 0;
    let percent = 68;
    const tickerElem = document.getElementById('ticker-text');
    const percentElem = document.getElementById('percent-display');
    const progressFill = document.getElementById('progress-bar-fill');

    const tickerInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % phrases.length;
      if (tickerElem) tickerElem.textContent = phrases[stepIndex];
      
      if (percent < 96) {
        percent += Math.floor(Math.random() * 5) + 3;
        if (percent > 96) percent = 96;
        if (percentElem) percentElem.textContent = percent + '%';
        if (progressFill) progressFill.style.width = percent + '%';
      }
    }, 2000);

    return () => clearInterval(tickerInterval);
  }, []);

  return (
    <div onClick={() => onNavigate && onNavigate('itinerary')} className="cursor-pointer">
  <main className="w-full pt-20 bg-surface min-h-[calc(100vh-16rem)]">
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
      <div className="flex flex-col w-full">
        {/* Interactive Progress Engine (Vanilla JS simulated live state) */}
        <div className="w-full flex flex-col gap-8 pb-16">
          {/* Top Progress Stage / Ambient Header Panel */}
          <div className="relative w-full rounded-xl bg-surface-container-lowest shadow-md p-8 md:p-10 overflow-hidden">
            {/* Ambient Topographical & Warm Flare Blobs */}
            <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none"></div>
            <div className="absolute left-1/3 -bottom-32 w-80 h-80 rounded-full bg-surface-container-highest/60 blur-2xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col gap-6">
              {/* Waypoint Synthesis Milestones Stepper */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-secondary-fixed-dim/30 text-secondary">
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  </span>
                  <span className="font-label-lg text-label-lg tracking-wider uppercase text-secondary">SSM Neural Synthesizer</span>
                </div>
                {/* Micro Waypoint Progress Track */}
                <div className="flex items-center gap-2 md:gap-3 bg-surface-container-low px-4 py-2 rounded-full self-start sm:self-auto">
                  {/* Step 1: Done */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-secondary text-surface-container-lowest flex items-center justify-center">
                      <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface">Curated</span>
                  </div>
                  <div className="w-5 h-[2px] bg-secondary"></div>
                  {/* Step 2: Active */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center animate-pulse">
                      <span className="material-symbols-outlined text-[13px]">explore</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-primary font-semibold">Routing</span>
                  </div>
                  <div className="w-5 h-[2px] bg-outline-variant"></div>
                  {/* Step 3: Imminent */}
                  <div className="flex items-center gap-1.5 opacity-60">
                    <div className="w-2.5 h-2.5 rounded-full bg-outline"></div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Hours</span>
                  </div>
                  <div className="w-5 h-[2px] bg-outline-variant"></div>
                  {/* Step 4: Pending */}
                  <div className="flex items-center gap-1.5 opacity-40">
                    <div className="w-2.5 h-2.5 rounded-full bg-outline"></div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Pacing</span>
                  </div>
                </div>
              </div>
              {/* Main Narrative Headline & Context */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="max-w-3xl space-y-2">
                  <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">Crafting your perfect 4-day Udaipur journey...</h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">Harmonizing Lake Pichola heritage, royal havelis, artisan rooftop cafés, and sunset vantage points.</p>
                </div>
                {/* Dynamic Counter Widget */}
                <div className="flex items-baseline gap-2 shrink-0 bg-surface-container px-5 py-3 rounded-lg">
                  <span className="font-headline-lg text-headline-lg text-primary font-extrabold tracking-tight" id="percent-display">68%</span>
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Synthesized</span>
                </div>
              </div>
              {/* Live Gradient Progress Rail */}
              <div className="flex flex-col gap-2.5 pt-2">
                <div className="w-full h-3 rounded-full bg-surface-container-high overflow-hidden relative">
                  <div className="h-full rounded-full transition-all duration-700 ease-out bg-primary" id="progress-bar-fill" style={{width: "68%"}}></div>
                </div>
                {/* Live Step Sub-ticker Badge */}
                <div className="flex items-center justify-between flex-wrap gap-2 text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                    <span className="font-label-lg text-label-lg text-on-surface font-medium" id="ticker-text">Aligning Jagdish Temple morning aarti ceremony timings with Ghat crowd density...</span>
                  </div>
                  <div className="flex items-center gap-2 text-outline font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>Estimated finish: ~6s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 12-Column Desktop Synthesis Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: AI Execution Pipeline & Real-Time Inferences (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Live Checklist Card */}
              <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">hub</span>
                    </div>
                    <h2 className="font-headline-sm text-headline-sm text-primary">Execution Pipeline</h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-secondary-fixed/40 text-on-secondary-container font-label-sm text-label-sm">5 Engines Active</span>
                </div>
                {/* Step Progression Items */}
                <div className="flex flex-col gap-3 font-body-sm text-body-sm">
                  {/* Step 1: Done */}
                  <div className="flex items-start gap-3.5 p-3 rounded-lg bg-mint-light">
                    <div className="w-6 h-6 rounded-full bg-secondary text-surface-container-lowest flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-primary font-medium">Clustered 14 cultural heritage nodes</span>
                      <span className="text-on-surface-variant text-label-sm">Grouped within Old City & Gangaur Ghat walking perimeter</span>
                    </div>
                  </div>
                  {/* Step 2: Done */}
                  <div className="flex items-start gap-3.5 p-3 rounded-lg bg-mint-light">
                    <div className="w-6 h-6 rounded-full bg-secondary text-surface-container-lowest flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-primary font-medium">Verified City Palace holiday calendar</span>
                      <span className="text-on-surface-variant text-label-sm">Confirmed morning courtyard access & audio guide slot</span>
                    </div>
                  </div>
                  {/* Step 3: Current In-Progress */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-surface-container">
                    <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-label-lg text-label-lg text-primary font-bold">Balancing Lake Pichola sunset slots</span>
                        <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">In Progress</span>
                      </div>
                      <span className="text-on-surface-variant text-label-sm">Comparing Ambrai Ghat vs. Sajjangarh Monsoon Palace azimuth</span>
                    </div>
                  </div>
                  {/* Step 4: Pending */}
                  <div className="flex items-start gap-3.5 p-3 rounded-lg bg-surface-container-low opacity-75">
                    <div className="w-6 h-6 rounded-full bg-surface-container-highest text-outline flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[15px]">schedule</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-surface">Auto-rickshaw transit & food hygiene index</span>
                      <span className="text-on-surface-variant text-label-sm">Calculating fair meter tariff & verified safe lassi venues</span>
                    </div>
                  </div>
                  {/* Step 5: Pending */}
                  <div className="flex items-start gap-3.5 p-3 rounded-lg bg-surface-container-low opacity-60">
                    <div className="w-6 h-6 rounded-full bg-surface-container-highest text-outline flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-lg text-label-lg text-on-surface">Injecting community golden-hour vantage points</span>
                      <span className="text-on-surface-variant text-label-sm">Pulling 24 local recommendations from verified explorers</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Smart Intelligence Callout Card */}
              <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-primary">
                    <span className="material-symbols-outlined text-[24px]">lightbulb</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">Dynamic Insight</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Solar API</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface">

                SSM synchronizes with live sunset timings at                       <strong className="text-primary font-semibold">Monsoon Palace (5:45 PM)</strong>
. Your afternoon route will automatically front-load uphill transit to avoid ghat bottleneck traffic.
                                  </p>
                  </div>
                </div>
              </div>
              {/* Metric Pulse Snapshot Mini-Card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-outline">Target Pacing</span>
                  <span className="font-headline-sm text-headline-sm text-primary">Immersive & Relaxed</span>
                  <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">nature_people</span>
 ≤ 3 stops/day
                              </span>
                </div>
                <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-outline">Est. Daily Budget</span>
                  <span className="font-headline-sm text-headline-sm text-primary">$42 – 65 / day</span>
                  <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">local_activity</span>
 Mid-range cultural
                              </span>
                </div>
              </div>
            </div>
            {/* RIGHT COLUMN: Real-Time Wireframe / Day 1 Progressive Itinerary Canvas (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="rounded-xl bg-surface-container-lowest p-6 md:p-8 shadow-sm flex flex-col gap-6">
                {/* Wireframe Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded bg-surface-container text-primary font-semibold tracking-wide">PREVIEW DRAFT</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">• 4 of 12 Nodes Assembled</span>
                    </div>
                    <h2 className="font-headline-md text-headline-md text-primary">Day 1: Old City & Pichola Waterfront</h2>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-primary self-start sm:self-auto">
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    <span className="font-label-sm text-label-sm font-semibold">Generating Itinerary...</span>
                  </div>
                </div>
                {/* Stop 1: Jagdish Temple (Materialized card with shimmer accent) */}
                <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-xl bg-surface-container-low transition-all">
                  {/* Photo Media Block with thematic imagery */}
                  <div className="relative w-full sm:w-44 h-36 rounded-lg overflow-hidden shrink-0 shadow-sm">
                    <img className="w-full h-full object-cover" data-alt="Intricately carved stone pillars and traditional Rajasthani shikhara spire of Jagdish Temple in Udaipur under warm morning sunlight, vibrant marigold garlands, serene spiritual atmosphere with clinical architectural clarity." src="https://lh3.googleusercontent.com/aida-public/AB6AXuASOiEp89F_iVAxicBfZRCYIhvG-dRU8-YPL57eIVAjplrOQZm762xkVMEqUq-ktyw8MiqjBIHcbeqX-onlEJf5seK2xciKsN3vVwIstyb94riNNvbWoFG-9Jt8RqM0i90-F0IPBLbX-kfF8M7ncfpZxhQFONYnkrzaUC9UkatDA7TLB8FaptBq1LiKVxacmelzfUEDu86nmvilnaDo9-OyrKb-B84eCy5msrXrXQg" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-clinical-navy/80 text-surface-container-lowest font-label-sm text-label-sm">08:30 AM</div>
                  </div>
                  {/* Content Details */}
                  <div className="flex flex-col justify-between w-full">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm text-label-sm font-bold">1</span>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface">Jagdish Temple</h3>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-semibold">90 Min</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">17th-century Indo-Aryan Hindu sanctuary. Synced with the quietest acoustic moment of the morning bell prayer.</p>
                    </div>
                    {/* Tags / Meta */}
                    <div className="flex flex-wrap items-center gap-3 pt-3">
                      <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">footprint</span>
 Modest attire required
                                      </span>
                      <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[15px]">payments</span>
 Free entry • $2 guide
                                      </span>
                    </div>
                  </div>
                </div>
                {/* Transit Connector Connector Node */}
                <div className="flex items-center gap-4 pl-6 -my-2 py-1">
                  <div className="w-0.5 h-10 bg-outline-variant flex flex-col justify-around items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                  </div>
                  <div className="flex items-center gap-2 bg-surface-container px-3 py-1 rounded-full text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px] text-secondary">directions_walk</span>
                    <span>8 min scenic stroll through Ghantaghar Bazaar (bypasses congested tuk-tuk alley)</span>
                  </div>
                </div>
                {/* Stop 2: Jheel's Sunrise Cafe (Partially synthesized card) */}
                <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-xl bg-surface-container-low transition-all">
                  {/* Photo Media Block with thematic imagery */}
                  <div className="relative w-full sm:w-44 h-36 rounded-lg overflow-hidden shrink-0 shadow-sm">
                    <img className="w-full h-full object-cover" data-alt="Charming rooftop cafe balcony overlooking tranquil Lake Pichola in Udaipur with traditional low seating cushions, masala chai cup, gentle water reflections and distant Aravalli hills in soft warm morning tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTFNcoraDxugVCpT2TWs2_frX5jPkw1bOA65K8-0C5l3A5bNINPH-07x3J5HN1sgniu6uYz__yNzF-lvweuKrqolu2k04YXjrdKJKfBbKdEhXrP8mj0wH9m-F9DX2CUfKaFWwukv5TEsngvi4CKsYG4ZIjju_7HZnqSof4eJgNhWem8lZKj1TIqCHOsCCl4GU3v25Ddt5HU52vgbwHEaEQDxbHW8hnYvCks1vGRvQ" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-clinical-navy/80 text-surface-container-lowest font-label-sm text-label-sm">10:15 AM</div>
                  </div>
                  {/* Content Details */}
                  <div className="flex flex-col justify-between w-full">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm text-label-sm font-bold">2</span>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface">Jheel's Sunrise Bakery & Rooftop</h3>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-semibold">60 Min</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Waterfront stone step terrace overlooking the bathing ghats. Highlight: Hand-brewed cardamom tea & fresh wood-oven croissants.</p>
                    </div>
                    {/* Tags / Meta */}
                    <div className="flex flex-wrap items-center gap-3 pt-3">
                      <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">wifi</span>
 Co-working friendly
                                      </span>
                      <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[15px]">coffee</span>
 $4 – 7 per person
                                      </span>
                    </div>
                  </div>
                </div>
                {/* Transit Connector Connector Node 2 */}
                <div className="flex items-center gap-4 pl-6 -my-2 py-1">
                  <div className="w-0.5 h-10 bg-outline-variant flex flex-col justify-around items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                  </div>
                  <div className="flex items-center gap-2 bg-surface-container px-3 py-1 rounded-full text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px] text-secondary">sailing</span>
                    <span>15 min private wooden boat crossing towards Jagmandir Island</span>
                  </div>
                </div>
                {/* Stop 3: Skeleton Shimmer Placeholder (In synthesis) */}
                <div className="relative p-5 rounded-xl bg-surface-container overflow-hidden">
                  {/* Shimmer Bar */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-surface-container-lowest/60 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-full sm:w-44 h-32 rounded-lg bg-surface-container-highest shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline text-[32px] animate-pulse">landscape</span>
                    </div>
                    <div className="flex flex-col justify-between w-full space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="h-5 w-48 rounded bg-surface-container-highest animate-pulse"></div>
                          <div className="h-4 w-16 rounded bg-surface-container-highest animate-pulse"></div>
                        </div>
                        <div className="h-3.5 w-full rounded bg-surface-container-highest/80 animate-pulse"></div>
                        <div className="h-3.5 w-3/4 rounded bg-surface-container-highest/80 animate-pulse"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-4 w-24 rounded bg-surface-container-highest animate-pulse"></div>
                        <div className="h-4 w-20 rounded bg-surface-container-highest animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progress Polyline Micro Map Container */}
                <div className="mt-2 rounded-xl bg-surface-container-low p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[20px]">route</span>
                      <span className="font-label-lg text-label-lg text-on-surface">Spatial Route Topology • Udaipur Old Quarter</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-outline">Real-Time Vector Mesh</span>
                  </div>
                  {/* Interactive Map Graphic with progressive line generation */}
                  <div className="relative w-full h-44 rounded-lg bg-surface-container-highest overflow-hidden">
                    {/* Actual Map Background Container via data-location */}
                    <div className="w-full h-full bg-cover bg-center filter saturate-75 brightness-95" data-location="Lake Pichola, Udaipur, Rajasthan, India" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB27Df5ZcRtA_y-fjKGWHmYJ-EAbzunIvWIdV5siT1c3ZeC_TU7OQ_ihRCQ72oQJH5p8uAHT7arx0R4cGAacJiu4Mzxk7dKETIujgwB8gFSORtd_LwatfAIIZP_tklgv1OEFJWxSVXaIq351oneZQzLX70gMgHuJNqGNL3cy6v0uQIpRJ1E6M7uuqC7Vhf43LCxxDtieVo1NGNKk1pw8mG_-qO_HEx5g4FDGyrLO10')"}}></div>
                    {/* Subtle dark overlay for clarity */}
                    <div className="absolute inset-0 bg-clinical-navy/20 backdrop-blur-[1px]"></div>
                    {/* Overlaid SVG Polyline with Waypoint Markers */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" preserveAspectRatio="none" viewBox="0 0 600 180">
                      {/* Water glow shadow line */}
                      <path className="text-surface-container-lowest/50" d="M 80 120 Q 180 60 260 90 T 420 50 T 540 85" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="6" />
                      {/* Active dynamic path */}
                      <path className="text-secondary" d="M 80 120 Q 180 60 260 90 T 420 50 T 540 85" fill="none" stroke="currentColor" strokeDasharray="8 6" strokeLinecap="round" strokeWidth="3">
                        <animate attributename="stroke-dashoffset" dur="2s" repeatcount="indefinite" values="40;0"></animate>
                      </path>
                      {/* Node 1 */}
                      <circle className="text-primary" cx="80" cy="120" fill="currentColor" r="7" />
                      <circle cx="80" cy="120" fill="#ffffff" r="3" />
                      {/* Node 2 */}
                      <circle className="text-primary" cx="260" cy="90" fill="currentColor" r="7" />
                      <circle cx="260" cy="90" fill="#ffffff" r="3" />
                      {/* Node 3 (Pulse) */}
                      <circle className="text-secondary-fixed-dim animate-ping opacity-75" cx="420" cy="50" fill="currentColor" r="8" />
                      <circle className="text-primary-container" cx="420" cy="50" fill="currentColor" r="6" />
                      <circle cx="420" cy="50" fill="#ffffff" r="2.5" />
                      {/* Node 4 (Unresolved) */}
                      <circle className="text-outline-variant" cx="540" cy="85" fill="currentColor" r="5" stroke="#ffffff" strokeWidth="1.5" />
                    </svg>
                    {/* Float Badge On Map */}
                    <div className="absolute bottom-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      <span className="font-label-sm text-label-sm text-on-surface font-medium">3.8 km total pedestrian elevation profile verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

    </div>
  );
}
