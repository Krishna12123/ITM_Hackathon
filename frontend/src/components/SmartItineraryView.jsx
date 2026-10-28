import React, { useState } from 'react';

export default function SmartItineraryView({ onNavigate }) {
  const [activePlan] = useState(() => {
    try {
      const raw = localStorage.getItem('generated_smart_itinerary');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const destinationName = activePlan?.destination || 'Udaipur, Rajasthan, India';
  const durationDays = activePlan?.duration_days || 4;
  const travelersCount = activePlan?.travelers || 2;
  const paceName = activePlan?.travel_pace || 'Balanced';
  const transitName = activePlan?.transit_mode || 'Auto / Walk';
  const totalBudget = activePlan?.budget_ledger?.total_budget || 37000;
  const perPersonSpend = activePlan?.budget_ledger?.per_person_spend || 18500;
  const activeDays = activePlan?.itinerary_days || [];
  return (
  <main className="w-full pt-20 bg-surface min-h-[calc(100vh-16rem)]">
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
      <div className="flex flex-col w-full">
        {/* Command Header & Meta Strip */}
        <div className="w-full flex flex-col gap-6 mb-8">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 pb-6 shadow-sm rounded-xl p-6 bg-surface-container-lowest">
            <div className="flex flex-col gap-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-label-md text-label-md text-primary font-semibold">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>

            Rajasthan, India
                          </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint-light font-label-md text-label-md text-secondary font-semibold">
                  <span className="material-symbols-outlined text-[16px]">verified</span>

            Curated Expedition
                          </span>
                <span className="text-outline font-label-md text-label-md">• Updated 12m ago</span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-clinical-navy tracking-tight">{destinationName}</h1>
              <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-body-sm text-body-sm">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[18px] text-outline">calendar_month</span>
                  <span>{durationDays} Days Expedited</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-outline-variant"></div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[18px] text-outline">group</span>
                  <span>{travelersCount} Explorers</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-outline-variant"></div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[18px] text-secondary">speed</span>
                  <span>Pace: {paceName}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-outline-variant"></div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[18px] text-outline">directions_walk</span>
                  <span>{transitName}</span>
                </div>
              </div>
            </div>
            {/* Real-Time Budget Tracker Widget */}
            <div className="w-full xl:w-80 p-4 rounded-xl bg-surface-container-low flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Live Budget Tracker</span>
                <span className="font-label-sm text-label-sm text-secondary font-bold px-2 py-0.5 rounded-full bg-surface-container-lowest">76% Utilized</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-headline-sm text-headline-sm text-clinical-navy font-bold">₹14,200</span>
                <span className="font-body-sm text-body-sm text-outline">of ₹18,500</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden flex">
                <div className="h-full bg-secondary transition-all duration-500 rounded-full" style={{width: "76.7%"}}></div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">format_image_left</span>

            ₹4,300 Safety Buffer
                          </span>
                <button className="font-label-sm text-label-sm text-primary hover:underline font-semibold">Ledger</button>
              </div>
            </div>
          </div>
          {/* Action Bar & Optimization Card */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Day Selector Pill Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                <button className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm font-semibold flex items-center gap-2 shrink-0">
                  <span>Day 1</span>
                  <span className="text-on-primary/80 font-normal">· Old City & Lake Pichola</span>
                </button>
                <button className="px-4 py-2 rounded-xl bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg hover:bg-surface-container-low transition-colors shrink-0 font-medium">
                  <span>Day 2</span>
                  <span className="text-outline font-normal">· Lakes & Forts</span>
                </button>
                <button className="px-4 py-2 rounded-xl bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg hover:bg-surface-container-low transition-colors shrink-0 font-medium">
                  <span>Day 3</span>
                  <span className="text-outline font-normal">· Artisan Workshops</span>
                </button>
                <button className="px-4 py-2 rounded-xl bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg hover:bg-surface-container-low transition-colors shrink-0 font-medium">
                  <span>Day 4</span>
                  <span className="text-outline font-normal">· Monsoon Palace</span>
                </button>
                <button className="px-3.5 py-2 rounded-xl bg-surface-container-lowest text-primary hover:bg-surface-container-low font-label-lg text-label-lg transition-colors flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[18px]">add</span>

            Add Day
                          </button>
              </div>
              {/* Itinerary Global Actions */}
              <div className="flex items-center gap-2.5">
                <button className="px-3.5 py-2 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg shadow-sm flex items-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">share</span>

            Share
                          </button>
                <button className="px-3.5 py-2 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg shadow-sm flex items-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">download</span>

            Export GPX
                          </button>
                <button className="px-3.5 py-2 rounded-lg bg-mint-light text-secondary hover:bg-secondary/10 font-label-lg text-label-lg shadow-sm flex items-center gap-1.5 transition-colors font-semibold">
                  <span className="material-symbols-outlined text-[18px]">tune</span>

            Customize
                          </button>
                <button className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:brightness-110 font-label-lg text-label-lg shadow-md flex items-center gap-1.5 transition-all font-semibold">
                  <span className="material-symbols-outlined text-[18px]">add_location_alt</span>

            Add Stop
                          </button>
              </div>
            </div>
            {/* Route Optimization Notice */}
            <div className="w-full p-4 rounded-xl bg-primary text-on-primary flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-container-lowest/15 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] text-secondary-container">bolt</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg font-bold tracking-tight">Route Auto-Optimized for Old City Alleyways</span>
                  <span className="font-body-sm text-body-sm text-on-primary-container">Sequential routing scheduled: saves 45 min travel time & 3.2 km unnecessary walking across Ghat corridors.</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest/20 hover:bg-surface-container-lowest/30 text-on-primary font-label-md text-label-md transition-colors">View Analytics</button>
              </div>
            </div>
          </div>
        </div>
        {/* Main Split Workspace: 55% Timeline vs 45% Map */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT PANEL: Timeline Sequence (7 cols = ~58%) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* MORNING PHASE */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-alert-warning"></span>
                  <h2 className="font-headline-sm text-headline-sm text-clinical-navy font-bold tracking-tight">Morning Sequence</h2>
                  <span className="font-label-sm text-label-sm text-outline font-medium">8:00 AM – 12:30 PM</span>
                </div>
                <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-medium">2 Stops · 4.2 km total</span>
              </div>
              {/* Stop 1 Card */}
              <div className="group relative p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5">
                <div className="relative w-full md:w-44 h-40 md:h-auto rounded-xl overflow-hidden shrink-0 bg-surface-container">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Intricate carved white marble facade of Jagdish Temple in Udaipur under warm morning sunlight, cinematic perspective showcasing stone elephants and traditional Rajasthani architectural friezes with clean deep teal sky" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-xjYYBBoTJOWG1mmbz-Z2HdDxJyDVYU_7GodrqOZAZTKvo6gARHI_4m5Eumf6ocX6TyFuM5S8xERPPmsnzpTiCefjCOMO3XuwqTOIqZmfVnSghMdGOImU2WohZv7nXCX-JsApbYZfzp6U-qlgfPi1PWuj2f6I4Lz3-s0-gxey0PuroxJRReAMLWn-FkF8MhjhVGkm-uHw42QGb3p_YHO6EEiF6xkio2MVYpYl4Ms" />
                  <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-headline-sm text-[14px] font-bold shadow-md">1</div>
                </div>
                <div className="flex flex-col flex-1 justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-mint-light text-secondary font-label-sm text-label-sm font-semibold">Heritage Landmark</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-low text-alert-warning font-label-sm text-label-sm font-bold">
                          <span className="material-symbols-outlined text-[13px] fill-current">star</span>

                    4.8
                                          </span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-medium">Open Now</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-outline hover:text-primary transition-colors" title="Reorder stop">
                          <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                        </button>
                        <button className="p-1 text-outline hover:text-alert-danger transition-colors" title="Options">
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                      </div>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-clinical-navy font-bold leading-snug">Jagdish Temple & Heritage Sanctum</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Commence at the 1651 CE Indo-Aryan temple. Admire hand-carved pillars and the tranquil morning bell ritual before navigating narrow alley artisans.</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between pt-2 text-on-surface-variant font-label-md text-label-md">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-semibold text-clinical-navy">
                        <span className="material-symbols-outlined text-[16px] text-outline">schedule</span>

                  08:00 – 09:30 AM
                                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-outline">payments</span>

                  Free Entry
                                      </span>
                    </div>
                    <span className="text-secondary font-semibold flex items-center gap-1">Suggested duration: 90m</span>
                  </div>
                </div>
              </div>
              {/* Transit Connector: Stop 1 to 2 */}
              <div className="flex items-center gap-4 px-4 py-1">
                <div className="w-8 flex justify-center">
                  <div className="w-0.5 h-10 bg-outline-variant/60 border-l border-dashed border-outline"></div>
                </div>
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md font-medium">
                  <span className="material-symbols-outlined text-[16px] text-secondary">directions_walk</span>
                  <span>12 min · 1.4 km · Historic Ghat Pedestrian Way</span>
                  <span className="text-outline font-normal">| Flat gradient</span>
                </div>
              </div>
              {/* Stop 2 Card */}
              <div className="group relative p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5">
                <div className="relative w-full md:w-44 h-40 md:h-auto rounded-xl overflow-hidden shrink-0 bg-surface-container">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Charming rooftop lakeside café in Udaipur overlooking Lake Pichola and white palaces, breakfast artisanal coffee served alongside freshly baked cinnamon rolls, warm morning golden glow aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLuUjR-I_uYVMfrNIqegK3ahW-gTRaOWssX0zf2W2SHOQXZpV6XDcBgCKWIiwW4f01WuHhj_dn55JLaPDGZ5ajX3ki210Zv6vPCBIci_BEFb4m0C1T5P5OZ9NlvSrYS4Cf4OzLsCmPjK38W5u-FPaEnH164ftEQy0KMw4Lw5m46lo1hZ1rDi38cnhD3TqDqWh9w3MGa2MCYZL5zbvqsqvL2QzvZaxalEkR1aZQhnM" />
                  <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-headline-sm text-[14px] font-bold shadow-md">2</div>
                </div>
                <div className="flex flex-col flex-1 justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-semibold">Culinary Gem</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-low text-alert-warning font-label-sm text-label-sm font-bold">
                          <span className="material-symbols-outlined text-[13px] fill-current">star</span>

                    4.9
                                          </span>
                        <span className="px-2 py-0.5 rounded-full bg-mint-light text-secondary font-label-sm text-label-sm font-medium">Lakefront View</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-outline hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                        </button>
                        <button className="p-1 text-outline hover:text-alert-danger transition-colors">
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                      </div>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-clinical-navy font-bold leading-snug">Jheel's Ginger Sunrise Café</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Waterfront Italian espresso and freshly prepared wood-fired flatbreads with panoramic vantage of Taj Lake Palace glistening on calm morning waters.</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between pt-2 text-on-surface-variant font-label-md text-label-md">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-semibold text-clinical-navy">
                        <span className="material-symbols-outlined text-[16px] text-outline">schedule</span>

                  09:45 – 10:45 AM
                                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-outline">payments</span>

                  ₹450 for two
                                      </span>
                    </div>
                    <span className="text-secondary font-semibold">Reserved Table #4</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Transit Connector: Morning to Afternoon Transit */}
            <div className="flex items-center gap-4 px-4 py-1">
              <div className="w-8 flex justify-center">
                <div className="w-0.5 h-10 bg-outline-variant/60 border-l border-dashed border-outline"></div>
              </div>
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md font-medium">
                <span className="material-symbols-outlined text-[16px] text-primary">electric_rickshaw</span>
                <span>15 min · 3.8 km · Prepaid Eco-Auto Transit</span>
                <span className="text-outline font-normal">| Estimated ₹80 fare</span>
              </div>
            </div>
            {/* AFTERNOON PHASE */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <h2 className="font-headline-sm text-headline-sm text-clinical-navy font-bold tracking-tight">Afternoon Immersion</h2>
                  <span className="font-label-sm text-label-sm text-outline font-medium">1:00 PM – 4:30 PM</span>
                </div>
                <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-medium">1 Workshop · Interactive</span>
              </div>
              {/* Stop 3 Card (Active / Highlighted Stop) */}
              <div className="group relative p-5 rounded-2xl bg-surface-container-lowest shadow-md transition-all flex flex-col md:flex-row gap-5">
                <div className="relative w-full md:w-44 h-40 md:h-auto rounded-xl overflow-hidden shrink-0 bg-surface-container">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Master Indian artisan painting an intricate Mewar miniature painting using squirrel hair brush and natural gemstone pigments, detailed hands holding gold leaf parchment, traditional studio setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzK797LzabQGEmGfpp2SFCDOqSrAl8QxsqeK0CyM2AvUPlu2axn6Atk81fQjSyQ2tMkTRA7ABqrlfbSmvN8jdrxYaTytRBRAWON33pFxCFFklliGtZ7WBRF1CKEzo54iR10ya0X0Gt9cy3M9af66c-YbyYZS3TLYJFjYTxMx_-B7eppe_cB4RB_B34GlLCbQuFPV_rCLtulXiMkKVZDi0TuyCYuPhycBbfBQFr96E" />
                  <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-headline-sm text-[14px] font-bold shadow-md">3</div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-primary/90 text-on-primary font-label-sm text-label-sm font-semibold backdrop-blur-sm">Active Focus</span>
                </div>
                <div className="flex flex-col flex-1 justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-bold">Hands-on Masterclass</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-low text-alert-warning font-label-sm text-label-sm font-bold">
                          <span className="material-symbols-outlined text-[13px] fill-current">star</span>

                    4.9
                                          </span>
                        <span className="px-2 py-0.5 rounded-full bg-mint-light text-secondary font-label-sm text-label-sm font-medium">Slot Confirmed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-outline hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                        </button>
                        <button className="p-1 text-outline hover:text-alert-danger transition-colors">
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                      </div>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-clinical-navy font-bold leading-snug">Mewar Miniature Painting Workshop</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Under 4th-generation court painter Shri Sharma, learn pigment grinding with crushed lapis lazuli and gold leaf gilding techniques on silk panels.</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between pt-2 text-on-surface-variant font-label-md text-label-md">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-semibold text-clinical-navy">
                        <span className="material-symbols-outlined text-[16px] text-outline">schedule</span>

                  01:30 – 03:30 PM
                                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-outline">payments</span>

                  ₹1,200 / person
                                      </span>
                    </div>
                    <span className="text-secondary font-semibold">Includes take-home artwork</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Transit Connector: Stop 3 to 4 */}
            <div className="flex items-center gap-4 px-4 py-1">
              <div className="w-8 flex justify-center">
                <div className="w-0.5 h-10 bg-outline-variant/60 border-l border-dashed border-outline"></div>
              </div>
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md font-medium">
                <span className="material-symbols-outlined text-[16px] text-secondary">directions_walk</span>
                <span>8 min · 600 m · Lakeside Promenade Trail</span>
                <span className="text-outline font-normal">| Gentle breeze</span>
              </div>
            </div>
            {/* EVENING PHASE */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                  <h2 className="font-headline-sm text-headline-sm text-clinical-navy font-bold tracking-tight">Evening Finale</h2>
                  <span className="font-label-sm text-label-sm text-outline font-medium">5:30 PM – 8:30 PM</span>
                </div>
                <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-medium">Sunset & Folk Dance</span>
              </div>
              {/* Stop 4 Card */}
              <div className="group relative p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5">
                <div className="relative w-full md:w-44 h-40 md:h-auto rounded-xl overflow-hidden shrink-0 bg-surface-container">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Rajasthani folk dancers performing Dharohar dance in the courtyard of Bagore Ki Haveli at dusk, colorful swirling lehengas with brass pots balanced on heads against illuminated stone archways" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjanXuLvc89wuDuQewFA91PhdSunQn_OkL064o1fHlR-oBW2jgUB4MOUDOP3DmvPSHwVgclYm5pUnHn5BvMhQYg1UIYa6WYXWtr3fnFwR3Lh605IGIaBbDGl9irN1xR4R_5KJEPsL5cX0I8SO9lxOPG5v1KQaFLNgaZKQs17gLmEBEFO3Yz8FPTngJWyiQIRTqhBOu3jgstgSQiWTQD97IkESbdhNjf4M0v6ZU7eU" />
                  <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-headline-sm text-[14px] font-bold shadow-md">4</div>
                </div>
                <div className="flex flex-col flex-1 justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm font-semibold">Cultural Must-See</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-low text-alert-warning font-label-sm text-label-sm font-bold">
                          <span className="material-symbols-outlined text-[13px] fill-current">star</span>

                    4.9
                                          </span>
                        <span className="px-2 py-0.5 rounded-full bg-mint-light text-secondary font-label-sm text-label-sm font-medium">Sunset Prime</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-outline hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                        </button>
                        <button className="p-1 text-outline hover:text-alert-danger transition-colors">
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                      </div>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-clinical-navy font-bold leading-snug">Dharohar Folk Performance & Sunset Watch</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Historic 18th-century Bagore-Ki-Haveli courtyard. Experience Bhavai dance balancing seven earthen pots, puppet theatre, and amber sunset over Gangaur Ghat.</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between pt-2 text-on-surface-variant font-label-md text-label-md">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-semibold text-clinical-navy">
                        <span className="material-symbols-outlined text-[16px] text-outline">schedule</span>

                  06:30 – 08:00 PM
                                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-outline">payments</span>

                  ₹150 / ticket
                                      </span>
                    </div>
                    <span className="text-secondary font-semibold">Arrive 20m early for front row</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* RIGHT PANEL: Sticky Desktop Interactive Vector Map Visualizer (5 cols = ~42%) */}
          <div className="lg:col-span-5 sticky top-28 flex flex-col gap-4">
            <div className="relative w-full h-[680px] rounded-2xl overflow-hidden shadow-xl bg-surface-container-low flex flex-col">
              {/* Floating Interactive Map Header Controls */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 pointer-events-auto">
                  <div className="px-3.5 py-1.5 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-md text-clinical-navy font-label-md text-label-md font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-alert-success animate-pulse"></span>

              GPS Vector Nav: Day 1 Route
                              </div>
                </div>
                <div className="flex items-center gap-1.5 pointer-events-auto">
                  <button className="w-9 h-9 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-md text-on-surface flex items-center justify-center hover:bg-surface-container transition-colors" title="Toggle Layer">
                    <span className="material-symbols-outlined text-[18px]">layers</span>
                  </button>
                  <button className="w-9 h-9 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-md text-on-surface flex items-center justify-center hover:bg-surface-container transition-colors" title="3D Terrain">
                    <span className="material-symbols-outlined text-[18px]">terrain</span>
                  </button>
                  <button className="w-9 h-9 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-md text-on-surface flex items-center justify-center hover:bg-surface-container transition-colors" title="Fullscreen">
                    <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                  </button>
                </div>
              </div>
              {/* Zoom Floating Pods */}
              <div className="absolute right-4 top-20 z-20 flex flex-col gap-1 pointer-events-auto">
                <button className="w-9 h-9 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-md text-on-surface flex items-center justify-center hover:bg-surface-container text-headline-sm font-bold">+</button>
                <button className="w-9 h-9 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-md text-on-surface flex items-center justify-center hover:bg-surface-container text-headline-sm font-bold">−</button>
              </div>
              {/* Custom Stylized Interactive SVG Vector Map Canvas */}
              <div className="w-full h-full relative overflow-hidden bg-[#e9f1f7]">
                {/* Water body: Lake Pichola & Swaroop Sagar stylized SVG */}
                <svg className="w-full h-full object-cover" fill="none" viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <lineargradient id="lakeGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#93d3ef" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#3cddc7" stopOpacity="0.3" />
                    </lineargradient>
                    <filter height="140%" id="shadowGlow" width="140%" x="-20%" y="-20%">
                      <fedropshadow dx="0" dy="3" floodColor="#0F172A" floodOpacity="0.15" stdDeviation="3"></fedropshadow>
                    </filter>
                  </defs>
                  {/* Grid & terrain base contours */}
                  <path d="M-20,120 Q120,80 260,140 T580,90" fill="none" stroke="#d3e4fe" strokeDasharray="4 6" strokeWidth="1.5" />
                  <path d="M-20,380 Q180,320 320,400 T620,350" fill="none" stroke="#d3e4fe" strokeDasharray="4 6" strokeWidth="1.5" />
                  <path d="M-20,580 Q220,530 400,610 T620,570" fill="none" stroke="#d3e4fe" strokeDasharray="4 6" strokeWidth="1.5" />
                  {/* Lake Pichola Shoreline Polygon */}
                  <path d="M140,0 C170,80 210,140 180,220 C150,300 110,380 130,480 C150,580 230,640 210,700 L0,700 L0,0 Z" fill="url(#lakeGradient)" />
                  {/* City Palace Island / Jag Mandir in Lake */}
                  <rect fill="#eff4ff" height="24" rx="6" stroke="#bfc8cd" strokeWidth="1.5" width="34" x="70" y="340" />
                  <text fill="#004357" fontFamily="Plus Jakarta Sans" fontSize="9" fontWeight="600" x="75" y="356">JAG NIWAS</text>
                  {/* Secondary water channel (Swaroop Sagar) */}
                  <path d="M220,0 C250,70 310,90 300,150 C290,210 240,240 230,300" fill="none" stroke="#93d3ef" strokeLinecap="round" strokeWidth="18" />
                  {/* Old City Urban Block Geometries */}
                  <path d="M280,180 L390,160 L440,230 L340,270 Z" fill="#ffffff" opacity="0.75" rx="8" />
                  <path d="M370,290 L480,270 L510,380 L410,400 Z" fill="#ffffff" opacity="0.75" />
                  <path d="M290,320 L370,310 L380,420 L270,410 Z" fill="#ffffff" opacity="0.75" />
                  <path d="M320,440 L450,430 L430,550 L310,540 Z" fill="#ffffff" opacity="0.75" />
                  {/* City Street Network Lines */}
                  <path d="M220,120 L320,180 L400,240 L340,330 L320,440 L240,490" fill="none" stroke="#cbdbf5" strokeLinecap="round" strokeWidth="4" />
                  <path d="M320,180 L470,160 L540,260" fill="none" stroke="#cbdbf5" strokeWidth="3" />
                  <path d="M340,330 L490,360 L520,480" fill="none" stroke="#cbdbf5" strokeWidth="3" />
                  {/* CONNECTING ROUTE POLYLINE (Numbered Stops 1 -> 2 -> 3 -> 4) */}
                  {/* Stop 1 (310, 190) -> Stop 2 (240, 240) -> Stop 3 (360, 360) -> Stop 4 (235, 450) */}
                  <path d="M310,190 Q270,210 240,240 Q310,290 360,360 Q300,410 235,450" fill="none" stroke="#004357" strokeDasharray="9 5" strokeLinecap="round" strokeWidth="5" />
                  <path d="M310,190 Q270,210 240,240 Q310,290 360,360 Q300,410 235,450" fill="none" stroke="#62fae3" strokeLinecap="round" strokeWidth="2" />
                  {/* WAYPOINT PIN 1: Jagdish Temple */}
                  <g className="cursor-pointer" filter="url(#shadowGlow)" transform="translate(310, 190)">
                    <circle fill="#004357" r="18" />
                    <circle className="animate-ping" opacity="0.3" r="22" stroke="#004357" strokeWidth="2" />
                    <text dy="5" fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="13" fontWeight="700" textAnchor="middle">1</text>
                    {/* Label tag */}
                    <rect fill="#0b1c30" height="24" opacity="0.9" rx="6" width="104" x="24" y="-12" />
                    <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="600" x="32" y="4">Jagdish Temple</text>
                  </g>
                  {/* WAYPOINT PIN 2: Jheel Sunrise Cafe */}
                  <g className="cursor-pointer" filter="url(#shadowGlow)" transform="translate(240, 240)">
                    <circle fill="#004357" r="16" />
                    <text dy="5" fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="700" textAnchor="middle">2</text>
                    <rect fill="#0b1c30" height="24" opacity="0.9" rx="6" width="96" x="-120" y="-12" />
                    <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="600" x="-112" y="4">Jheel's Café</text>
                  </g>
                  {/* WAYPOINT PIN 3: Painting Workshop (ACTIVE PULSING) */}
                  <g className="cursor-pointer" filter="url(#shadowGlow)" transform="translate(360, 360)">
                    <circle fill="#004357" r="20" />
                    <circle opacity="0.6" r="28" stroke="#006b5f" strokeWidth="2.5" />
                    <text dy="5" fill="#62fae3" fontFamily="Plus Jakarta Sans" fontSize="14" fontWeight="800" textAnchor="middle">3</text>
                    {/* Callout badge */}
                    <rect fill="#004357" height="28" rx="8" width="128" x="26" y="-14" />
                    <text fill="#62fae3" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700" x="36" y="4">Mewar Art Studio ★</text>
                  </g>
                  {/* WAYPOINT PIN 4: Bagore Ki Haveli / Sunset Ghat */}
                  <g className="cursor-pointer" filter="url(#shadowGlow)" transform="translate(235, 450)">
                    <circle fill="#004357" r="16" />
                    <text dy="5" fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="700" textAnchor="middle">4</text>
                    <rect fill="#0b1c30" height="24" opacity="0.9" rx="6" width="112" x="-132" y="-12" />
                    <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="600" x="-124" y="4">Bagore Ki Haveli</text>
                  </g>
                  {/* Lake Landmark Icon */}
                  <g transform="translate(85, 230)">
                    <text fill="#004357" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="700" letterSpacing="2" opacity="0.6" x="0" y="0">LAKE PICHOLA</text>
                    <text fill="#006b5f" fontFamily="Plus Jakarta Sans" fontSize="9" opacity="0.5" x="14" y="14">Calm Waters · 24°C</text>
                  </g>
                </svg>
              </div>
              {/* Pinned Active Stop Quick Inspector Card */}
              <div className="absolute bottom-4 left-4 right-4 z-20 p-4 rounded-xl bg-surface-container-lowest/95 backdrop-blur-xl shadow-xl flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold shrink-0">3</div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Waypoint 3 of 4 Selected</span>
                      <h4 className="font-headline-sm text-[16px] text-clinical-navy font-bold leading-tight">Mewar Miniature Painting Hub</h4>
                      <span className="font-body-sm text-[13px] text-on-surface-variant">Lal Ghat Corridor · Opens 01:00 PM</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-mint-light text-secondary font-label-sm text-label-sm font-bold shrink-0">₹1,200/p</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button className="flex-1 py-2 px-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:brightness-110 flex items-center justify-center gap-1.5 transition-all">
                    <span className="material-symbols-outlined text-[16px]">navigation</span>

              Get Walking Directions
                              </button>
                  <button className="py-2 px-3 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">swap_horiz</span>

              Swap Stop
                              </button>
                  <button className="p-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Quick Route Statistics Bar Under Map */}
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between text-center">
              <div className="flex flex-col flex-1">
                <span className="font-label-sm text-label-sm text-outline">Total Distance</span>
                <span className="font-headline-sm text-[18px] text-clinical-navy font-bold">5.8 km</span>
              </div>
              <div className="w-px h-8 bg-surface-container"></div>
              <div className="flex flex-col flex-1">
                <span className="font-label-sm text-label-sm text-outline">Moving Time</span>
                <span className="font-headline-sm text-[18px] text-clinical-navy font-bold">35 min</span>
              </div>
              <div className="w-px h-8 bg-surface-container"></div>
              <div className="flex flex-col flex-1">
                <span className="font-label-sm text-label-sm text-outline">Est. Pace</span>
                <span className="font-headline-sm text-[18px] text-secondary font-bold">Optimal</span>
              </div>
              <div className="w-px h-8 bg-surface-container"></div>
              <div className="flex flex-col flex-1">
                <span className="font-label-sm text-label-sm text-outline">Weather</span>
                <span className="font-headline-sm text-[18px] text-alert-warning font-bold">28° Clear</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  );
}
