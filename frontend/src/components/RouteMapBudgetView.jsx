import React, { useEffect, useState } from 'react';

export default function RouteMapBudgetView({ onNavigate }) {
  const [activePlan] = useState(() => {
    try {
      const raw = localStorage.getItem('generated_smart_itinerary');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const destinationName = activePlan?.destination || 'Udaipur, Rajasthan';
  const totalBudget = activePlan?.budget_ledger?.total_budget || 37000;
  const perPersonSpend = activePlan?.budget_ledger?.per_person_spend || 18500;
  const stayAmount = activePlan?.budget_ledger?.stay_allocation?.target_amount || 15540;
  const expAmount = activePlan?.budget_ledger?.experiences_allocation?.target_amount || 12580;
  const diningAmount = activePlan?.budget_ledger?.dining_transit_allocation?.target_amount || 8880;
  const bufferAmount = activePlan?.budget_ledger?.safety_buffer_retained || 4300;

  useEffect(() => {
    const dayTabs = document.querySelectorAll('#dayTabs button');
    dayTabs.forEach(button => {
      button.addEventListener('click', () => {
        dayTabs.forEach(b => {
          b.className = 'px-4 py-2 rounded-lg text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg transition-all';
        });
        button.className = 'px-4 py-2 rounded-lg bg-surface-container-lowest text-primary shadow-sm font-label-lg text-label-lg font-semibold flex items-center gap-2 transition-all';
      });
    });
  }, []);

  return (
  <main className="w-full pt-20 bg-surface min-h-[calc(100vh-16rem)]">
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
      <div className="flex flex-col w-full">
        <div className="flex flex-col gap-6">
          {/* Top Summary & Control Deck */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-label-sm bg-mint-light text-secondary font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5 animate-pulse"></span>

            Optimal Route Verified
                          </span>
                <span className="font-label-sm text-label-sm text-outline">Udaipur, Rajasthan · 24°34'N 73°41'E</span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-bold">Trip Route Map & Financial Pulse</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">Interactive spatial navigation, elevation profile, and live category budget distribution for Udaipur.</p>
            </div>
            {/* Action Utilities */}
            <div className="flex items-center gap-3 shrink-0">
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-lowest shadow-sm hover:shadow text-primary font-label-lg text-label-lg transition-all duration-150" type="button">
                <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
                <span>Offline Ready</span>
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg shadow hover:opacity-95 transition-all duration-150" type="button">
                <span className="material-symbols-outlined text-[18px]">share_location</span>
                <span>Export GPX & Ledger</span>
              </button>
            </div>
          </div>
          {/* Filter Tab Rails */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" id="dayTabs">
              <button className="px-4 py-2 rounded-lg bg-surface-container-lowest text-primary shadow-sm font-label-lg text-label-lg font-semibold flex items-center gap-2 transition-all" type="button">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>

          Day 1: Heritage Trail
                      </button>
              <button className="px-4 py-2 rounded-lg text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg transition-all" type="button">Day 2: Royal Palaces & Ghats</button>
              <button className="px-4 py-2 rounded-lg text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg transition-all" type="button">Day 3: Sajjangarh Monsoon Sanctuary</button>
              <button className="px-4 py-2 rounded-lg text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg transition-all" type="button">All Days Combined</button>
            </div>
            <div className="flex items-center gap-3 px-3 py-1 font-label-sm text-label-sm text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">trending_up</span>

          142m Elev. Gain
                      </span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">speed</span>

          Easy Pace · 4.2 km/h
                      </span>
            </div>
          </div>
          {/* Main Desktop Grid (12-Col Split) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Spatial Engine & Stop Inspector (7 Cols, ~58%) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Route Header Banner */}
              <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">alt_route</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg font-bold text-on-surface">Day 1 Heritage Trail Overview</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">4 stops · 5.8 km · ~35m total transit</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-surface-container text-primary font-label-sm text-label-sm font-semibold">Tuk-tuk & Walk</span>
                  <span className="px-2.5 py-1 rounded bg-mint-light text-secondary font-label-sm text-label-sm font-semibold">Zero Detours</span>
                </div>
              </div>
              {/* Interactive Map Canvas Shell */}
              <div className="relative w-full h-[460px] rounded-2xl overflow-hidden shadow-md bg-surface-container-high group">
                {/* Static/Interactive Map Anchor */}
                <div className="w-full h-full bg-cover bg-center" data-location="Lake Pichola, Udaipur, Rajasthan, India" style={{}}>
                  {/* Simulated Map Canvas Overlay with Vector Routes */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-primary/10 pointer-events-none"></div>
                  {/* Stylized SVG Route Trajectory Overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 700 460">
                    <defs>
                      <lineargradient id="routeGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#006b5f" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#3cddc7" stopOpacity="1" />
                        <stop offset="100%" stopColor="#0d5c75" stopOpacity="0.9" />
                      </lineargradient>
                      <filter height="140%" id="glow" width="140%" x="-20%" y="-20%">
                        <fegaussianblur result="blur" stdDeviation="3"></fegaussianblur>
                        <fecomposite in="SourceGraphic" in2="blur" operator="over"></fecomposite>
                      </filter>
                    </defs>
                    {/* Connecting Route Line */}
                    <path d="M 120,290 C 190,260 210,180 270,165 S 390,220 440,240 S 550,220 590,130" fill="none" filter="url(#glow)" stroke="url(#routeGradient)" strokeDasharray="8 4" strokeLinecap="round" strokeWidth="5" />
                    {/* Secondary Walk Path to Stop 3 */}
                    <path d="M 440,240 Q 480,260 510,290" fill="none" stroke="#ffffff" strokeDasharray="4 4" strokeLinecap="round" strokeWidth="3" />
                  </svg>
                  {/* Map Floating Pin 1: Jagdish Temple */}
                  <div className="absolute top-[260px] left-[95px] flex flex-col items-center transform -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform cursor-pointer">
                    <div className="px-2 py-0.5 rounded shadow-sm bg-surface-container-lowest text-on-surface font-label-sm text-label-sm font-semibold mb-1 whitespace-nowrap">1. Jagdish Temple</div>
                    <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg font-label-md text-label-md font-bold ring-4 ring-surface-container-lowest">1</div>
                  </div>
                  {/* Map Floating Pin 2: Jheel Sunrise Cafe */}
                  <div className="absolute top-[140px] left-[255px] flex flex-col items-center transform -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform cursor-pointer">
                    <div className="px-2 py-0.5 rounded shadow-sm bg-surface-container-lowest text-on-surface font-label-sm text-label-sm font-semibold mb-1 whitespace-nowrap">2. Jheel Sunrise Café</div>
                    <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg font-label-md text-label-md font-bold ring-4 ring-surface-container-lowest">2</div>
                  </div>
                  {/* Map Floating Pin 3 (Active Focus): Mewar Artisan Miniature Painting */}
                  <div className="absolute top-[215px] left-[425px] flex flex-col items-center transform -translate-x-1/2 -translate-y-full scale-110 cursor-pointer z-20">
                    <div className="px-2.5 py-1 rounded shadow-md bg-secondary text-on-secondary font-label-sm text-label-sm font-bold mb-1 whitespace-nowrap flex items-center gap-1 animate-bounce">
                      <span className="material-symbols-outlined text-[14px]">pin_drop</span>

                3. Active Inspector
                                  </div>
                    <div className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shadow-xl font-label-lg text-label-lg font-bold ring-4 ring-surface-container-lowest">3</div>
                  </div>
                  {/* Map Floating Pin 4: Ambrai Ghat Sunset */}
                  <div className="absolute top-[105px] left-[575px] flex flex-col items-center transform -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform cursor-pointer">
                    <div className="px-2 py-0.5 rounded shadow-sm bg-surface-container-lowest text-on-surface font-label-sm text-label-sm font-semibold mb-1 whitespace-nowrap">4. Ambrai Sunset</div>
                    <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg font-label-md text-label-md font-bold ring-4 ring-surface-container-lowest">4</div>
                  </div>
                  {/* Map Geographic Landmarks Badges */}
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md shadow-sm text-on-surface font-label-sm text-label-sm flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>

                Lake Pichola Basin
                                  </span>
                    <span className="text-outline">·</span>
                    <span>Fateh Sagar Pass 1.4km North</span>
                  </div>
                  {/* Map Controls Float */}
                  <div className="absolute top-4 right-4 flex flex-col gap-1.5">
                    <button className="w-8 h-8 rounded-lg bg-surface-container-lowest/95 backdrop-blur-sm shadow flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors" title="Zoom in" type="button">
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-surface-container-lowest/95 backdrop-blur-sm shadow flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors" title="Zoom out" type="button">
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-surface-container-lowest/95 backdrop-blur-sm shadow flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors" title="Layer options" type="button">
                      <span className="material-symbols-outlined text-[18px]">layers</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Active Stop Focus Panel */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm font-bold text-primary">Stop #3 of 4</span>
                      <span className="px-2.5 py-0.5 rounded bg-mint-light text-secondary font-label-sm text-label-sm font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">verified</span>

                  Master Artisan Certified
                                      </span>
                    </div>
                    <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Mewar Artisan Miniature Painting Studio</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>

                  1:30 PM – 3:30 PM (2h stay)
                                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">directions_transit</span>

                  15m via Auto from Stop 2
                                      </span>
                    </p>
                  </div>
                  {/* Cost Badge */}
                  <div className="text-right shrink-0 bg-surface-container-low px-4 py-2 rounded-xl">
                    <span className="font-label-sm text-label-sm text-on-surface-variant block">Entry & Canvas Fee</span>
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">₹1,200</span>
                  </div>
                </div>
                {/* Description & Highlight attributes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-surface-container-low">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[18px]">brush</span>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant block">Hands-on Session</span>
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface">Natural Stone Dyes</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shrink-0">
                      <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant block">Take-home Souvenir</span>
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface">Silk Scroll Included</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[18px]">local_parking</span>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant block">Transit Access</span>
                      <span className="font-label-lg text-label-lg font-semibold text-on-surface">Pedestrian Alley Drop</span>
                    </div>
                  </div>
                </div>
                {/* CTAs */}
                <div className="flex items-center gap-3 pt-1">
                  <button className="flex-1 py-3 px-5 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 hover:opacity-95 shadow transition-all" type="button">
                    <span className="material-symbols-outlined text-[18px]">navigation</span>

              Get Turn-by-Turn Directions
                              </button>
                  <button className="py-3 px-5 rounded-lg bg-surface-container text-primary font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors" type="button">
                    <span className="material-symbols-outlined text-[18px]">swap_horiz</span>

              Swap Stop
                              </button>
                  <button className="p-3 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="Bookmark stop" type="button">
                    <span className="material-symbols-outlined text-[20px]">bookmark</span>
                  </button>
                </div>
              </div>
              {/* Route Highlights Carousel / Row */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">route</span>

              Connected Itinerary Sequence
                              </h3>
                  <span className="font-label-sm text-label-sm text-outline">Click card to refocus</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Stop 1 Card */}
                  <div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm hover:shadow transition-shadow cursor-pointer flex flex-col gap-3 group">
                    <div className="relative h-28 w-full rounded-lg overflow-hidden bg-surface-container-high">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Intricately carved stone pillars and sanctum spires of Jagdish Temple in Udaipur with worshippers during clear golden morning daylight." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4zmRjZXu_fuNTgfvCZPOWtDdl2pkhx6Bs352sVbQD8mP5pa-lTHEECYh98frFKG23SbDxGSMt7n5YCBpnpRcVvcFNiOHLr__xKkUMDo_X2sc8dKBjYiqBNx1Td4QlnMblaRgL9Was3cMt1Lh20maJrL1ysn6r1Ar8HwWO4pEdeREQSuidavveltcaSWFJ5SEM_CfDkPNATN9rwymEPV-Aq1kK3Fam5Y_EtTlrbqE" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-surface-container-lowest/90 font-label-sm text-label-sm font-bold text-primary">Stop 1</span>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-label-lg text-label-lg font-bold text-on-surface truncate">Jagdish Temple</h4>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">9:00 AM – 10:00 AM · ₹0 (Free)</p>
                    </div>
                  </div>
                  {/* Stop 2 Card */}
                  <div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm hover:shadow transition-shadow cursor-pointer flex flex-col gap-3 group">
                    <div className="relative h-28 w-full rounded-lg overflow-hidden bg-surface-container-high">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Lake Pichola waterfront terrace cafe with cozy outdoor wooden tables, masala chai, fresh poha, and panoramic views of Lake Palace in Udaipur." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_a776rLZr2uJoBT9EK5rp8SNUU9Mc8zVg5A7x_fV7hlmChZAKKURSwJ4JNRojPe3p34NB6maFVqtFoxrbKNmx3QDWWXwDaVlJnkZqdnzxYcQSKZDZn1QN6NpmIQ9gLWvB_BzGY6CK5iy3S3bZY8zzbA69COEhh-U31a1rmw73tFo-OGDSHom5iBLN9BXydmGoh3joMfeJzNhoq2y8m-WHjYgJ2dbkL7EemH-Frqs" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-surface-container-lowest/90 font-label-sm text-label-sm font-bold text-primary">Stop 2</span>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-label-lg text-label-lg font-bold text-on-surface truncate">Jheel's Sunrise Café</h4>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">10:00 AM – 11:30 AM · ₹650</p>
                    </div>
                  </div>
                  {/* Stop 4 Card */}
                  <div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-sm hover:shadow transition-shadow cursor-pointer flex flex-col gap-3 group">
                    <div className="relative h-28 w-full rounded-lg overflow-hidden bg-surface-container-high">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Vibrant orange and pink twilight sky over Ambrai Ghat marble steps overlooking Udaipur City Palace illuminated against Lake Pichola." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOT2QFEZEWjGnWShf_qQRAbPxLmdsWfLtCt-Kve0qWdhg110Y5lbga5yMhSqjRNm_MmO37htNxwi_kAOJdOymbrP5pvwAF9ixEwVaOwkU0HIhfeox-0ipRLsUkWDIbpqENxfUFLhsOOQSBJ-VIoZtL1IFWOe-64oGmzHzpUqvAIAh5A69ktmiI1G0MBbqdMS8w8ar2wxX9hiVankpXP15L4CNCBKnlkDB0y4qsUN4" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-surface-container-lowest/90 font-label-sm text-label-sm font-bold text-primary">Stop 4</span>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-label-lg text-label-lg font-bold text-on-surface truncate">Ambrai Ghat Sunset</h4>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">5:30 PM – 7:30 PM · ₹10 (Token)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* RIGHT COLUMN: Financial Pulse & Budget Analytics (5 Cols, ~42%) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Spent vs Budget Hero Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-bold">Trip Financial Velocity</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-mint-light text-secondary font-label-sm text-label-sm font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>

              76.7% Committed
                              </span>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-body-md text-body-md text-on-surface-variant">Spent:</span>
                    <span className="font-headline-xl text-headline-xl font-bold text-primary tracking-tight">₹14,200</span>
                    <span className="font-body-lg text-body-lg text-outline">/ ₹18,500</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Paced for a 3-day itinerary with healthy surplus headroom.</p>
                </div>
                {/* Dual Progress Rail */}
                <div className="space-y-2">
                  <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden flex">
                    <div className="h-full bg-primary-container transition-all duration-500" style={{width: "76.7%"}} title="Allocated Spend (76.7%)"></div>
                    <div className="h-full bg-secondary-fixed transition-all duration-500" style={{width: "23.3%"}} title="Buffer Reserve (23.3%)"></div>
                  </div>
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="text-on-surface-variant font-medium">₹14,200 Spent</span>
                    <span className="text-secondary font-bold">₹4,300 Safety Reserve</span>
                  </div>
                </div>
              </div>
              {/* Categorized Spend Distribution & Donut Graphic */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Category Allocation</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Live breakdown across 5 functional ledgers</p>
                  </div>
                  <span className="p-2 rounded-lg bg-surface-container-low text-primary">
                    <span className="material-symbols-outlined text-[20px]">pie_chart</span>
                  </span>
                </div>
                {/* Inline Donut Visualization & Center Stats */}
                <div className="flex items-center justify-center gap-6 py-2">
                  <div className="relative w-40 h-40 shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background Ring */}
                      <circle cx="50" cy="50" fill="none" r="38" stroke="#eff4ff" strokeWidth="12" />
                      {/* Category 1: Stay & Heritage Haveli (37%) -> dasharray = 88.3 238.7 */}
                      <circle cx="50" cy="50" fill="none" r="38" stroke="#004357" strokeDasharray="88.3 238.7" strokeDashoffset="0" strokeWidth="12" />
                      {/* Category 2: Workshops & Tickets (25%) -> dasharray = 59.6 238.7 */}
                      <circle cx="50" cy="50" fill="none" r="38" stroke="#0d5c75" strokeDasharray="59.6 238.7" strokeDashoffset="-88.3" strokeWidth="12" />
                      {/* Category 3: Dining & Cafes (18%) -> dasharray = 42.9 238.7 */}
                      <circle cx="50" cy="50" fill="none" r="38" stroke="#006b5f" strokeDasharray="42.9 238.7" strokeDashoffset="-147.9" strokeWidth="12" />
                      {/* Category 4: Transit (9%) -> dasharray = 21.5 238.7 */}
                      <circle cx="50" cy="50" fill="none" r="38" stroke="#3cddc7" strokeDasharray="21.5 238.7" strokeDashoffset="-190.8" strokeWidth="12" />
                      {/* Category 5: Unused Buffer (11%) -> dasharray = 26.3 238.7 */}
                      <circle cx="50" cy="50" fill="none" r="38" stroke="#62fae3" strokeDasharray="26.3 238.7" strokeDashoffset="-212.3" strokeWidth="12" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-headline-sm text-headline-sm font-bold text-primary">5</span>
                      <span className="font-label-sm text-label-sm text-outline">Buckets</span>
                    </div>
                  </div>
                  {/* Compact Legend */}
                  <div className="flex flex-col gap-2 w-full text-body-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-primary"></span>
                        <span className="text-on-surface truncate">Stay & Haveli</span>
                      </span>
                      <span className="font-bold text-on-surface">
₹6,800                         <span className="text-outline font-normal">(37%)</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-primary-container"></span>
                        <span className="text-on-surface truncate">Workshops & Entry</span>
                      </span>
                      <span className="font-bold text-on-surface">
₹3,600                         <span className="text-outline font-normal">(25%)</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-secondary"></span>
                        <span className="text-on-surface truncate">Dining & Cafés</span>
                      </span>
                      <span className="font-bold text-on-surface">
₹2,600                         <span className="text-outline font-normal">(18%)</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-secondary-fixed-dim"></span>
                        <span className="text-on-surface truncate">Auto & Transit</span>
                      </span>
                      <span className="font-bold text-on-surface">
₹1,200                         <span className="text-outline font-normal">(9%)</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-secondary-container"></span>
                        <span className="text-on-surface font-semibold truncate">Safe Buffer</span>
                      </span>
                      <span className="font-bold text-secondary">
₹4,300                         <span className="text-outline font-normal">(11%)</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Smart Travel Tip Card */}
              <div className="bg-surface-container-high rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-secondary shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">lightbulb</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-label-lg text-label-lg font-bold text-primary">Budget Optimization Insight</h4>
                      <span className="px-2 py-0.2 rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-semibold">₹4,300 Surplus</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">You have remaining headroom! Consider adding a twilight solar boat cruise on Lake Pichola or a traditional Dharohar folk dance at Bagore Ki Haveli.</p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-1">
                  <button className="px-3.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm font-semibold transition-colors" type="button">Dismiss</button>
                  <button className="px-4 py-2 rounded-lg bg-surface-container-lowest text-primary shadow-sm hover:shadow font-label-lg text-label-lg font-semibold flex items-center gap-1.5 transition-all" type="button">
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>

              Add Experience
                              </button>
                </div>
              </div>
              {/* Expense Split & Conversion Widget */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-primary">group</span>
                    <h3 className="font-label-lg text-label-lg font-bold text-on-surface">Traveler Split Ledger</h3>
                  </div>
                  <span className="font-label-sm text-label-sm text-outline">Equal Split</span>
                </div>
                {/* Split Calculation Box */}
                <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 overflow-hidden">
                      <div className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container-lowest bg-primary-container text-on-primary flex items-center justify-center font-label-sm font-bold">AK</div>
                      <div className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container-lowest bg-secondary text-on-secondary flex items-center justify-center font-label-sm font-bold">RV</div>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant block">Divided between 2 travelers</span>
                      <span className="font-label-lg text-label-lg font-bold text-on-surface">₹7,100 / person</span>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-surface-container text-primary transition-colors" title="Adjust split settings" type="button">
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                  </button>
                </div>
                {/* Currency Conversion Switcher & Utility Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button className="px-2.5 py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm font-semibold" type="button">INR (₹)</button>
                    <button className="px-2.5 py-1 rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm font-semibold transition-colors" type="button">USD ($)</button>
                    <button className="px-2.5 py-1 rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm font-semibold transition-colors" type="button">EUR (€)</button>
                  </div>
                  <button className="inline-flex items-center gap-1.5 text-primary hover:opacity-80 font-label-sm text-label-sm font-semibold transition-opacity" type="button">
                    <span className="material-symbols-outlined text-[16px]">receipt_long</span>

              Export Receipts
                              </button>
                </div>
              </div>
            </div>
          </div>
          {/* Bottom Route Elevation & Transit Profile Strip */}
          <div className="mt-4 bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">show_chart</span>
                </span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Day 1 Elevation & Mobility Graph</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Topographic terrain transitions from Jagdish Hill down to Lake Pichola bank</p>
                </div>
              </div>
              <div className="flex items-center gap-4 font-label-sm text-label-sm text-outline">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-primary"></span>

            Walk Segment
                          </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-secondary"></span>

            Tuk-Tuk Transit
                          </span>
              </div>
            </div>
            {/* Elevation Profile Inline SVG */}
            <div className="w-full h-24 relative overflow-hidden rounded-xl bg-surface-container-low p-2">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 80">
                <defs>
                  <lineargradient id="elevationFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#006b5f" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#006b5f" stopOpacity="0.0" />
                  </lineargradient>
                </defs>
                <path d="M 0,60 Q 150,20 300,35 T 600,45 T 850,25 L 1000,55 L 1000,80 L 0,80 Z" fill="url(#elevationFill)" />
                <path d="M 0,60 Q 150,20 300,35 T 600,45 T 850,25 L 1000,55" fill="none" stroke="#006b5f" strokeWidth="2.5" />
                {/* Checkpoint Marker Lines */}
                <line stroke="#004357" strokeDasharray="2 2" strokeWidth="1" x1="120" x2="120" y1="10" y2="80" />
                <line stroke="#004357" strokeDasharray="2 2" strokeWidth="1" x1="380" x2="380" y1="10" y2="80" />
                <line stroke="#004357" strokeDasharray="2 2" strokeWidth="1" x1="650" x2="650" y1="10" y2="80" />
                <line stroke="#004357" strokeDasharray="2 2" strokeWidth="1" x1="900" x2="900" y1="10" y2="80" />
              </svg>
              {/* Dynamic Marker Labels */}
              <div className="absolute inset-x-0 bottom-2 flex justify-between px-6 font-label-sm text-label-sm text-on-surface-variant pointer-events-none">
                <span>Jagdish (598m)</span>
                <span>Jheel Ghat (582m)</span>
                <span>Artisan Quarter (590m)</span>
                <span>Ambrai Lookout (579m)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  );
}
