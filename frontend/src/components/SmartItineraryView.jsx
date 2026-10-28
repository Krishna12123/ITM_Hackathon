import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const DEFAULT_DAYS = [
  {
    day_number: 1,
    day_title: "Old City Heritage Sanctum & Lake Sunset",
    route_distance_km: 5.8,
    transit_time_mins: 35,
    insider_travel_tip: "Arrive at Jagdish Temple early to observe the serene morning aarti and avoid alley traffic.",
    cultural_etiquette: "Remove footwear before ascending temple steps; photography is restricted in the inner sanctum.",
    morning_sequence: {
      activity_title: "Jagdish Temple & Heritage Sanctum",
      category: "Heritage & Spiritual",
      time_slot: "08:00 – 10:30 AM",
      entry_fee: 0,
      suggested_duration_minutes: 90,
      description: "Commence at the 1651 CE Indo-Aryan temple. Admire hand-carved pillars and the tranquil morning bell ritual before navigating narrow alley artisans.",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-xjYYBBoTJOWG1mmbz-Z2HdDxJyDVYU_7GodrqOZAZTKvo6gARHI_4m5Eumf6ocX6TyFuM5S8xERPPmsnzpTiCefjCOMO3XuwqTOIqZmfVnSghMdGOImU2WohZv7nXCX-JsApbYZfzp6U-qlgfPi1PWuj2f6I4Lz3-s0-gxey0PuroxJRReAMLWn-FkF8MhjhVGkm-uHw42QGb3p_YHO6EEiF6xkio2MVYpYl4Ms"
    },
    afternoon_immersion: {
      activity_title: "Mewar Miniature Painting Workshop",
      category: "Hands-on Masterclass",
      time_slot: "01:30 – 03:30 PM",
      entry_fee: 800,
      suggested_duration_minutes: 90,
      description: "Under court artisans, learn pigment grinding with crushed lapis lazuli and gold leaf gilding techniques on silk panels.",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzK797LzabQGEmGfpp2SFCDOqSrAl8QxsqeK0CyM2AvUPlu2axn6Atk81fQjSyQ2tMkTRA7ABqrlfbSmvN8jdrxYaTytRBRAWON33pFxCFFklliGtZ7WBRF1CKEzo54iR10ya0X0Gt9cy3M9af66c-YbyYZS3TLYJFjYTxMx_-B7eppe_cB4RB_B34GlLCbQuFPV_rCLtulXiMkKVZDi0TuyCYuPhycBbfBQFr96E"
    },
    evening_finale: {
      activity_title: "Bagore Ki Haveli & Dharohar Folk Show",
      category: "Folk Performances",
      time_slot: "06:30 – 08:00 PM",
      entry_fee: 150,
      suggested_duration_minutes: 90,
      description: "Historic 18th-century lakefront haveli at Gangaur Ghat hosting Bhavai dance balancing seven earthen pots, puppet theatre, and amber sunset over Gangaur Ghat.",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjanXuLvc89wuDuQewFA91PhdSunQn_OkL064o1fHlR-oBW2jgUB4MOUDOP3DmvPSHwVgclYm5pUnHn5BvMhQYg1UIYa6WYXWtr3fnFwR3Lh605IGIaBbDGl9irN1xR4R_5KJEPsL5cX0I8SO9lxOPG5v1KQaFLNgaZKQs17gLmEBEFO3Yz8FPTngJWyiQIRTqhBOu3jgstgSQiWTQD97IkESbdhNjf4M0v6ZU7eU"
    }
  },
  {
    day_number: 2,
    day_title: "Royal Palaces, Hilltop Monsoons & Nature Trails",
    route_distance_km: 12.4,
    transit_time_mins: 42,
    insider_travel_tip: "Purchase City Palace composite museum tickets early and take an eco-cab up to Sajjangarh by 4:30 PM for sunset.",
    cultural_etiquette: "Audio guides are recommended in the palace; maintain decorum on palace corridors.",
    morning_sequence: {
      activity_title: "City Palace & Complex",
      category: "Royal Heritage",
      time_slot: "09:00 – 12:00 PM",
      entry_fee: 300,
      suggested_duration_minutes: 150,
      description: "Sprawling granite and marble palace complex built over 400 years, showcasing Sheesh Mahal mirror work, Suraj Gokhada, and peacock courtyards.",
      image_url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80"
    },
    afternoon_immersion: {
      activity_title: "Saheliyon Ki Bari (Garden of Maidens)",
      category: "Nature & Parks",
      time_slot: "01:00 – 03:00 PM",
      entry_fee: 50,
      suggested_duration_minutes: 60,
      description: "Historic ornamental royal gardens built in the 18th century featuring shaded lawns, marble elephants, and natural siphon fountains.",
      image_url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80"
    },
    evening_finale: {
      activity_title: "Sajjangarh Monsoon Palace & Wildlife Sanctuary",
      category: "Heritage & Nature",
      time_slot: "04:30 – 06:00 PM",
      entry_fee: 160,
      suggested_duration_minutes: 110,
      description: "Hilltop palace perched on Bansdara peak at 944m above sea level, offering 360-degree panoramic sunset vistas across Udaipur's Aravali ranges.",
      image_url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    day_number: 3,
    day_title: "Artisan Guilds, Miniature Painting & Waterfront Terrace",
    route_distance_km: 7.2,
    transit_time_mins: 30,
    insider_travel_tip: "Bargain respectfully in Hathi Pol for genuine camel-leather journals and hand-painted Pichwai tapestries.",
    cultural_etiquette: "Ask permission before photographing artisans in their workshops.",
    morning_sequence: {
      activity_title: "Jheel's Sunrise Café & Bakery",
      category: "Culinary & Waterfront",
      time_slot: "08:30 – 10:30 AM",
      entry_fee: 250,
      suggested_duration_minutes: 60,
      description: "Scenic waterfront café by Gangaur Ghat serving wood-fired morning breakfast with serene vistas of Lake Pichola.",
      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLuUjR-I_uYVMfrNIqegK3ahW-gTRaOWssX0zf2W2SHOQXZpV6XDcBgCKWIiwW4f01WuHhj_dn55JLaPDGZ5ajX3ki210Zv6vPCBIci_BEFb4m0C1T5P5OZ9NlvSrYS4Cf4OzLsCmPjK38W5u-FPaEnH164ftEQy0KMw4Lw5m46lo1hZ1rDi38cnhD3TqDqWh9w3MGa2MCYZL5zbvqsqvL2QzvZaxalEkR1aZQhnM"
    },
    afternoon_immersion: {
      activity_title: "Hathi Pol Artisan Market & Spice Trail",
      category: "Artisan Culture & Shopping",
      time_slot: "12:30 – 03:30 PM",
      entry_fee: 0,
      suggested_duration_minutes: 120,
      description: "Historic marketplace known for genuine Mewari Pichwai paintings, Bandhani textiles, silver jewelry, and fragrant Rajasthani spices.",
      image_url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80"
    },
    evening_finale: {
      activity_title: "Ambrai Ghat & Waterfront Terrace",
      category: "Scenic Waterfront",
      time_slot: "05:00 – 07:30 PM",
      entry_fee: 0,
      suggested_duration_minutes: 90,
      description: "Famous sunset promenade directly opposite City Palace and Jag Mandir, featuring glowing heritage lampposts and tranquil lake breezes.",
      image_url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    day_number: 4,
    day_title: "Sacred Temples, Scenic Waterfronts & Farewell Sunset",
    route_distance_km: 18.5,
    transit_time_mins: 55,
    insider_travel_tip: "Pre-book the sunset boat cruise from Rameshwar Ghat for golden hour views of Jag Mandir Island.",
    cultural_etiquette: "Maintain quiet devotion inside Eklingji sanctum during priests' chanting.",
    morning_sequence: {
      activity_title: "Shri Eklingji Mahadev Temple Complex",
      category: "Sacred Architecture",
      time_slot: "08:30 – 11:30 AM",
      entry_fee: 0,
      suggested_duration_minutes: 90,
      description: "728 CE Mewar ruling deity shrine complex housing 108 marble temples and a striking four-faced black marble Shiva idol.",
      image_url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80"
    },
    afternoon_immersion: {
      activity_title: "Ranakpur Jain Temple Sanctum",
      category: "Jain Architecture",
      time_slot: "12:30 – 03:30 PM",
      entry_fee: 200,
      suggested_duration_minutes: 120,
      description: "15th-century marble temple renowned for its 1,444 intricately carved pillars, no two alike, dedicated to Tirthankara Rishabhanatha.",
      image_url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80"
    },
    evening_finale: {
      activity_title: "Lake Pichola & Sunset Boat Cruise",
      category: "Nature & Water",
      time_slot: "04:30 – 06:00 PM",
      entry_fee: 450,
      suggested_duration_minutes: 75,
      description: "Peaceful freshwater lake with picturesque mountain backdrops, historic ghats, Jag Mandir island palace, and golden sunset reflections.",
      image_url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80"
    }
  }
];

function StopCard({ stop, stopNumber, badgeTitle, badgeColor, onSelect, isActive }) {
  if (!stop) return null;
  const title = stop.activity_title || stop.place_name || "Featured Attraction";
  const desc = stop.description || "Scenic regional attraction optimized for your itinerary timing and cultural interests.";
  const timeSlot = stop.time_slot || "Scheduled Stop";
  const feeText = stop.entry_fee ? `₹${stop.entry_fee} ${stop.entry_fee > 200 ? '/ person' : 'Entry'}` : "Free Entry";
  const durationText = stop.suggested_duration_minutes ? `Duration: ${stop.suggested_duration_minutes}m` : null;
  const category = stop.category || "Heritage Landmark";
  const imgUrl = stop.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80";

  return (
    <div 
      onClick={onSelect}
      className={`group relative p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5 cursor-pointer ${
        isActive ? 'ring-2 ring-primary shadow-md' : ''
      }`}
    >
      <div className="relative w-full md:w-44 h-40 md:h-auto rounded-xl overflow-hidden shrink-0 bg-surface-container">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          src={imgUrl} 
          alt={title}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-headline-sm text-[14px] font-bold shadow-md">
          {stopNumber}
        </div>
        {isActive && (
          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-primary/90 text-on-primary font-label-sm text-label-sm font-semibold backdrop-blur-sm">
            Active Focus
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${badgeColor || 'bg-mint-light text-secondary'}`}>
                {badgeTitle || category}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-low text-alert-warning font-label-sm text-label-sm font-bold">
                <span className="material-symbols-outlined text-[13px] fill-current">star</span>
                4.9
              </span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-medium">
                Verified Timing
              </span>
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
          <h3 className="font-headline-sm text-headline-sm text-clinical-navy font-bold leading-snug">{title}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{desc}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between pt-2 text-on-surface-variant font-label-md text-label-md">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-clinical-navy">
              <span className="material-symbols-outlined text-[16px] text-outline">schedule</span>
              {timeSlot}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-outline">payments</span>
              {feeText}
            </span>
          </div>
          {durationText && <span className="text-secondary font-semibold">{durationText}</span>}
        </div>
      </div>
    </div>
  );
}

function TransitConnector({ durationMins, distanceKm, mode, text }) {
  const isWalk = mode === 'walking' || mode === 'directions_walk' || mode === 'auto_walk';
  return (
    <div className="flex items-center gap-4 px-4 py-1">
      <div className="w-8 flex justify-center">
        <div className="w-0.5 h-10 bg-outline-variant/60 border-l border-dashed border-outline"></div>
      </div>
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md font-medium">
        <span className="material-symbols-outlined text-[16px] text-secondary">
          {isWalk ? 'directions_walk' : 'electric_rickshaw'}
        </span>
        <span>{durationMins || 12} min · {distanceKm || 1.4} km · {text || (isWalk ? 'Pedestrian Heritage Corridor' : 'Prepaid Eco-Auto Transit')}</span>
        <span className="text-outline font-normal">| Smooth Gradient</span>
      </div>
    </div>
  );
}

export default function SmartItineraryView({ onNavigate }) {
  const [activePlan, setActivePlan] = useState(() => {
    try {
      const raw = localStorage.getItem('generated_smart_itinerary');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [tripId] = useState(() => {
    try {
      const urlId = new URLSearchParams(window.location.search).get('id');
      const storedPlan = localStorage.getItem('generated_smart_itinerary');
      const parsedPlan = storedPlan ? JSON.parse(storedPlan) : null;
      return urlId || localStorage.getItem('active_trip_id') || parsedPlan?.trip_id || null;
    } catch (e) {
      return null;
    }
  });

  const [isSyncedWithSupabase, setIsSyncedWithSupabase] = useState(() => {
    return Boolean(activePlan?.supabase_synced || activePlan?.trip_id);
  });

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [activeStopIndex, setActiveStopIndex] = useState(0);

  // Fetch live itinerary directly from Supabase
  useEffect(() => {
    if (!tripId) return;

    let isMounted = true;
    async function loadFromSupabase() {
      try {
        const { data, error } = await supabase
          .from('trip_inputs')
          .select('*')
          .eq('id', tripId)
          .single();

        if (data && isMounted) {
          const remotePlan = data.budget_breakdown?.generated_itinerary || data.generated_itinerary;
          if (remotePlan) {
            setActivePlan(remotePlan);
            setIsSyncedWithSupabase(true);
            try {
              localStorage.setItem('generated_smart_itinerary', JSON.stringify(remotePlan));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.info('Supabase client fetch note:', err);
      }
    }

    loadFromSupabase();
    return () => { isMounted = false; };
  }, [tripId]);

  const destinationName = activePlan?.destination || 'Udaipur, Rajasthan, India';
  const durationDays = activePlan?.duration_days || activePlan?.days || activePlan?.itinerary_days?.length || 4;
  const nightsCount = activePlan?.nights || activePlan?.budget_ledger?.nights || Math.max(1, durationDays - 1);
  const startDateStr = activePlan?.start_date || 'Oct 14';
  const endDateStr = activePlan?.end_date || 'Oct 18';
  const travelersCount = activePlan?.travelers || activePlan?.guests || 2;
  const paceName = activePlan?.travel_pace || activePlan?.selected_pace || 'Balanced';
  const transitName = activePlan?.transit_mode || activePlan?.selected_transit || 'Auto / Walk';
  
  // Real budget ledger calculations
  const ledger = activePlan?.budget_ledger || {};
  const perPersonSpend = ledger.per_person_spend || activePlan?.spend_per_person || 18500;
  const totalBudgetVal = ledger.total_budget || (perPersonSpend * travelersCount) || 37000;
  const bufferVal = ledger.safety_buffer_retained || Math.round(totalBudgetVal * 0.12);
  const projectedSpend = Math.max(totalBudgetVal - bufferVal, 0);
  const utilizedPercent = Math.min(100, Math.max(10, Math.round((projectedSpend / totalBudgetVal) * 100))) || 76;

  // Active Days List
  const activeDays = (activePlan?.itinerary_days && activePlan.itinerary_days.length > 0)
    ? activePlan.itinerary_days
    : DEFAULT_DAYS;

  const safeDayIndex = Math.min(selectedDayIndex, Math.max(0, activeDays.length - 1));
  const currentDay = activeDays[safeDayIndex] || activeDays[0] || {};
  const morning = currentDay.morning_sequence;
  const afternoon = currentDay.afternoon_immersion;
  const evening = currentDay.evening_finale;

  const dayStops = [morning, afternoon, evening].filter(Boolean);
  const activeStop = dayStops[activeStopIndex] || dayStops[0];

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
                    <span>India & Beyond</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint-light font-label-md text-label-md text-secondary font-semibold">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>ML Smart Itinerary</span>
                  </span>
                  {isSyncedWithSupabase && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-label-md text-label-md font-semibold">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">cloud_done</span>
                      <span>Supabase Synced{tripId ? ` (${tripId.slice(0, 8)})` : ''}</span>
                    </span>
                  )}
                  <span className="text-outline font-label-md text-label-md">• Verified Constraints</span>
                </div>
                <h1 className="font-headline-xl text-headline-xl text-clinical-navy tracking-tight">{destinationName}</h1>
                <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-body-sm text-body-sm">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
                    <span className="text-clinical-navy font-semibold">{durationDays} Days, {nightsCount} Nights</span>
                    <span className="text-outline text-xs">({startDateStr} – {endDateStr})</span>
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

              {/* Real-Time Live Budget Tracker Widget */}
              <div className="w-full xl:w-80 p-4 rounded-xl bg-surface-container-low flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Live Budget Tracker</span>
                  <span className="font-label-sm text-label-sm text-secondary font-bold px-2 py-0.5 rounded-full bg-surface-container-lowest">
                    {utilizedPercent}% Utilized
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-headline-sm text-headline-sm text-clinical-navy font-bold">
                    ₹{Math.round(projectedSpend / travelersCount).toLocaleString('en-IN')}
                  </span>
                  <span className="font-body-sm text-body-sm text-outline">
                    of ₹{Math.round(totalBudgetVal / travelersCount).toLocaleString('en-IN')} / person
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden flex">
                  <div 
                    className="h-full bg-secondary transition-all duration-500 rounded-full" 
                    style={{ width: `${utilizedPercent}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">format_image_left</span>
                    <span>₹{Math.round(bufferVal).toLocaleString('en-IN')} Safety Buffer</span>
                  </span>
                  <button onClick={() => onNavigate && onNavigate('route-budget')} className="font-label-sm text-label-sm text-primary hover:underline font-semibold cursor-pointer">
                    Ledger
                  </button>
                </div>
              </div>
            </div>

            {/* Action Bar & Day Selector Pill Tabs */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Dynamic Day Selector Pill Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {activeDays.map((day, idx) => {
                    const isSelected = selectedDayIndex === idx;
                    const dayLabel = day.day_title ? day.day_title.split('&')[0].trim() : `Route Phase ${idx + 1}`;
                    return (
                      <button
                        key={day.day_number || idx}
                        onClick={() => {
                          setSelectedDayIndex(idx);
                          setActiveStopIndex(0);
                        }}
                        className={`px-4 py-2 rounded-xl font-label-lg text-label-lg shadow-sm font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-medium'
                        }`}
                      >
                        <span>Day {day.day_number || idx + 1}</span>
                        <span className={isSelected ? 'text-on-primary/80 font-normal' : 'text-outline font-normal'}>
                          · {dayLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Itinerary Global Actions */}
                <div className="flex items-center gap-2.5">
                  <button onClick={() => onNavigate && onNavigate('planner')} className="px-3.5 py-2 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                    <span>New Trip</span>
                  </button>
                  <button onClick={() => onNavigate && onNavigate('route-budget')} className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:brightness-110 font-label-lg text-label-lg shadow-md flex items-center gap-1.5 transition-all font-semibold cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">map</span>
                    <span>Route & Budget</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Route Optimization Banner */}
              <div className="w-full p-4 rounded-xl bg-primary text-on-primary flex items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-container-lowest/15 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px] text-secondary-container">bolt</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg font-bold tracking-tight">
                      Day {currentDay.day_number || selectedDayIndex + 1}: {currentDay.day_title || "Optimized Multi-Stop Expedition"}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-primary-container">
                      Sequential OR-Tools routing scheduled: {currentDay.route_distance_km || 5.8} km distance & {currentDay.transit_time_mins || 35} mins transit time via {transitName}.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => onNavigate && onNavigate('route-budget')} className="px-3 py-1.5 rounded-lg bg-surface-container-lowest/20 hover:bg-surface-container-lowest/30 text-on-primary font-label-md text-label-md transition-colors cursor-pointer">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Split Workspace: 58% Timeline vs 42% Map */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT PANEL: Timeline Sequence */}
            <div className="lg:col-span-7 flex flex-col gap-6">

              {/* Rover AI Insider Guidance */}
              {(currentDay.insider_travel_tip || currentDay.cultural_etiquette) && (
                <div className="p-4 rounded-xl bg-surface-container-low border border-secondary/20 flex items-start gap-3 shadow-sm">
                  <span className="material-symbols-outlined text-[22px] text-secondary shrink-0 mt-0.5">lightbulb</span>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-md text-label-md font-bold text-clinical-navy">Rover AI Verified Guidance</span>
                    {currentDay.insider_travel_tip && (
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        <strong className="text-secondary font-semibold">Insider Tip: </strong>{currentDay.insider_travel_tip}
                      </p>
                    )}
                    {currentDay.cultural_etiquette && (
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        <strong className="text-primary font-semibold">Etiquette: </strong>{currentDay.cultural_etiquette}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* MORNING PHASE */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-alert-warning"></span>
                    <h2 className="font-headline-sm text-headline-sm text-clinical-navy font-bold tracking-tight">Morning Sequence</h2>
                    <span className="font-label-sm text-label-sm text-outline font-medium">
                      {morning?.time_slot || "08:30 AM – 11:30 AM"}
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-medium">
                    Stop 1 · Active
                  </span>
                </div>
                <StopCard 
                  stop={morning} 
                  stopNumber={1} 
                  badgeTitle="Morning Focus" 
                  badgeColor="bg-mint-light text-secondary"
                  onSelect={() => setActiveStopIndex(0)}
                  isActive={activeStopIndex === 0}
                />
              </div>

              {/* Transit Connector: Stop 1 to Stop 2 */}
              <TransitConnector 
                durationMins={12} 
                distanceKm={1.8} 
                mode={transitName} 
                text="Midday Transit to Afternoon Immersion"
              />

              {/* AFTERNOON PHASE */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <h2 className="font-headline-sm text-headline-sm text-clinical-navy font-bold tracking-tight">Afternoon Immersion</h2>
                    <span className="font-label-sm text-label-sm text-outline font-medium">
                      {afternoon?.time_slot || "12:30 PM – 03:30 PM"}
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-medium">
                    Stop 2 · Interactive
                  </span>
                </div>
                <StopCard 
                  stop={afternoon} 
                  stopNumber={2} 
                  badgeTitle="Hands-on Masterclass" 
                  badgeColor="bg-primary/10 text-primary font-bold"
                  onSelect={() => setActiveStopIndex(1)}
                  isActive={activeStopIndex === 1}
                />
              </div>

              {/* Transit Connector: Stop 2 to Stop 3 */}
              <TransitConnector 
                durationMins={16} 
                distanceKm={2.6} 
                mode={transitName} 
                text="Evening Transit to Sunset Finale"
              />

              {/* EVENING PHASE */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                    <h2 className="font-headline-sm text-headline-sm text-clinical-navy font-bold tracking-tight">Evening Finale</h2>
                    <span className="font-label-sm text-label-sm text-outline font-medium">
                      {evening?.time_slot || "05:00 PM – 07:30 PM"}
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-medium">
                    Stop 3 · Sunset Prime
                  </span>
                </div>
                <StopCard 
                  stop={evening} 
                  stopNumber={3} 
                  badgeTitle="Cultural Must-See" 
                  badgeColor="bg-surface-container-highest text-primary"
                  onSelect={() => setActiveStopIndex(2)}
                  isActive={activeStopIndex === 2}
                />
              </div>
            </div>

            {/* RIGHT PANEL: Sticky Desktop Interactive Vector Map Visualizer */}
            <div className="lg:col-span-5 sticky top-28 flex flex-col gap-4">
              <div className="relative w-full h-[680px] rounded-2xl overflow-hidden shadow-xl bg-surface-container-low flex flex-col">
                {/* Floating Interactive Map Header Controls */}
                <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2 pointer-events-auto">
                    <div className="px-3.5 py-1.5 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-md text-clinical-navy font-label-md text-label-md font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-alert-success animate-pulse"></span>
                      <span>GPS Vector Nav: Day {currentDay.day_number || selectedDayIndex + 1}</span>
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

                {/* Stylized Interactive SVG Vector Map Canvas */}
                <div className="w-full h-full relative overflow-hidden bg-[#e9f1f7]">
                  <svg className="w-full h-full object-cover" fill="none" viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="lakeGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#93d3ef" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#3cddc7" stopOpacity="0.3" />
                      </linearGradient>
                      <filter height="140%" id="shadowGlow" width="140%" x="-20%" y="-20%">
                        <feDropShadow dx="0" dy="3" floodColor="#0F172A" floodOpacity="0.15" stdDeviation="3" />
                      </filter>
                    </defs>

                    {/* Grid & terrain base contours */}
                    <path d="M-20,120 Q120,80 260,140 T580,90" fill="none" stroke="#d3e4fe" strokeDasharray="4 6" strokeWidth="1.5" />
                    <path d="M-20,380 Q180,320 320,400 T620,350" fill="none" stroke="#d3e4fe" strokeDasharray="4 6" strokeWidth="1.5" />
                    <path d="M-20,580 Q220,530 400,610 T620,570" fill="none" stroke="#d3e4fe" strokeDasharray="4 6" strokeWidth="1.5" />

                    {/* Lake Pichola Shoreline Polygon */}
                    <path d="M140,0 C170,80 210,140 180,220 C150,300 110,380 130,480 C150,580 230,640 210,700 L0,700 L0,0 Z" fill="url(#lakeGradient)" />
                    <rect fill="#eff4ff" height="24" rx="6" stroke="#bfc8cd" strokeWidth="1.5" width="40" x="65" y="340" />
                    <text fill="#004357" fontFamily="Plus Jakarta Sans" fontSize="9" fontWeight="600" x="70" y="356">HERITAGE</text>

                    {/* Old City Street Network Lines */}
                    <path d="M220,120 L320,180 L400,240 L340,330 L320,440 L240,490" fill="none" stroke="#cbdbf5" strokeLinecap="round" strokeWidth="4" />
                    <path d="M320,180 L470,160 L540,260" fill="none" stroke="#cbdbf5" strokeWidth="3" />
                    <path d="M340,330 L490,360 L520,480" fill="none" stroke="#cbdbf5" strokeWidth="3" />

                    {/* CONNECTING ROUTE POLYLINE (Stops 1 -> 2 -> 3) */}
                    <path d="M310,190 Q270,220 250,280 Q310,340 350,420" fill="none" stroke="#004357" strokeDasharray="9 5" strokeLinecap="round" strokeWidth="5" />
                    <path d="M310,190 Q270,220 250,280 Q310,340 350,420" fill="none" stroke="#62fae3" strokeLinecap="round" strokeWidth="2" />

                    {/* WAYPOINT PIN 1: Morning Stop */}
                    {morning && (
                      <g className="cursor-pointer" filter="url(#shadowGlow)" transform="translate(310, 190)" onClick={() => setActiveStopIndex(0)}>
                        <circle fill={activeStopIndex === 0 ? "#ea580c" : "#004357"} r="18" />
                        {activeStopIndex === 0 && <circle className="animate-ping" opacity="0.3" r="24" stroke="#ea580c" strokeWidth="2" />}
                        <text dy="5" fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="13" fontWeight="700" textAnchor="middle">1</text>
                        <rect fill="#0b1c30" height="24" opacity="0.9" rx="6" width="120" x="24" y="-12" />
                        <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="600" x="32" y="4">
                          {(morning.activity_title || morning.place_name || "Stop 1").slice(0, 16)}...
                        </text>
                      </g>
                    )}

                    {/* WAYPOINT PIN 2: Afternoon Stop */}
                    {afternoon && (
                      <g className="cursor-pointer" filter="url(#shadowGlow)" transform="translate(250, 280)" onClick={() => setActiveStopIndex(1)}>
                        <circle fill={activeStopIndex === 1 ? "#ea580c" : "#004357"} r="18" />
                        {activeStopIndex === 1 && <circle className="animate-ping" opacity="0.3" r="24" stroke="#ea580c" strokeWidth="2" />}
                        <text dy="5" fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="13" fontWeight="700" textAnchor="middle">2</text>
                        <rect fill="#0b1c30" height="24" opacity="0.9" rx="6" width="120" x="-144" y="-12" />
                        <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="600" x="-136" y="4">
                          {(afternoon.activity_title || afternoon.place_name || "Stop 2").slice(0, 16)}...
                        </text>
                      </g>
                    )}

                    {/* WAYPOINT PIN 3: Evening Stop */}
                    {evening && (
                      <g className="cursor-pointer" filter="url(#shadowGlow)" transform="translate(350, 420)" onClick={() => setActiveStopIndex(2)}>
                        <circle fill={activeStopIndex === 2 ? "#ea580c" : "#004357"} r="18" />
                        {activeStopIndex === 2 && <circle className="animate-ping" opacity="0.3" r="24" stroke="#ea580c" strokeWidth="2" />}
                        <text dy="5" fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="13" fontWeight="700" textAnchor="middle">3</text>
                        <rect fill="#0b1c30" height="24" opacity="0.9" rx="6" width="120" x="24" y="-12" />
                        <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="600" x="32" y="4">
                          {(evening.activity_title || evening.place_name || "Stop 3").slice(0, 16)}...
                        </text>
                      </g>
                    )}
                  </svg>
                </div>

                {/* Pinned Active Stop Quick Inspector Card */}
                {activeStop && (
                  <div className="absolute bottom-4 left-4 right-4 z-20 p-4 rounded-xl bg-surface-container-lowest/95 backdrop-blur-xl shadow-xl flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold shrink-0">
                          {activeStopIndex + 1}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                            Waypoint {activeStopIndex + 1} of {dayStops.length} Selected
                          </span>
                          <h4 className="font-headline-sm text-[16px] text-clinical-navy font-bold leading-tight">
                            {activeStop.activity_title || activeStop.place_name}
                          </h4>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            {activeStop.category || "Heritage Landmark"} · {activeStop.time_slot || "Scheduled"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">
                          {activeStop.entry_fee ? `₹${activeStop.entry_fee}` : "Free"}
                        </span>
                        <span className="block font-label-sm text-label-sm text-outline">Entry</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Waypoint Stats Strip */}
              <div className="grid grid-cols-4 gap-3 p-4 rounded-xl bg-surface-container-lowest shadow-sm text-center">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">Total Distance</span>
                  <span className="font-headline-sm text-headline-sm text-clinical-navy font-bold">
                    {currentDay.route_distance_km || 5.8} km
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">Moving Time</span>
                  <span className="font-headline-sm text-headline-sm text-clinical-navy font-bold">
                    {currentDay.transit_time_mins || 35} min
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">Est. Pace</span>
                  <span className="font-headline-sm text-headline-sm text-secondary font-bold">{paceName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">Weather</span>
                  <span className="font-headline-sm text-headline-sm text-clinical-navy font-bold">28° Clear</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
