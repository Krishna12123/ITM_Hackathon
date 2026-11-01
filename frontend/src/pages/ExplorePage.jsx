import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Sparkles,
  MapPin,
  Compass,
  ArrowRight,
  Heart,
  Luggage,
  Star,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Utensils,
  Music,
  Palette,
  Footprints,
  Mountain,
  Flame,
  Trees,
  Sun,
  Users,
  Share2,
  AlertCircle
} from 'lucide-react';
import {
  MOCK_DESTINATIONS,
  MOCK_EXPERIENCES,
  STATE_SPECIALITIES
} from '../data/mockData';
import ExperienceCard from '../components/ExperienceCard';
import ExperienceDetailModal from '../components/ExperienceDetailModal';

// 8 Interactive Destination Categories
const DESTINATION_CATEGORIES = [
  {
    id: 'heritage',
    title: 'Heritage & Forts',
    query: 'heritage',
    desc: 'Grand sandstone ramparts, mirror palaces & royal havelis',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    icon: Compass
  },
  {
    id: 'nature',
    title: 'Nature & Lakes',
    query: 'nature',
    desc: 'Tranquil backwater canals, sacred river basins & wildlife parks',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    icon: Trees
  },
  {
    id: 'beaches',
    title: 'Beaches',
    query: 'beach',
    desc: 'Golden coastal sands, Portuguese fishing villages & palm coves',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    icon: Sun
  },
  {
    id: 'mountains',
    title: 'Mountains',
    query: 'mountain',
    desc: 'Alpine Himalayan passes, cedar forest trails & apple orchards',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    icon: Mountain
  },
  {
    id: 'spiritual',
    title: 'Spiritual Places',
    query: 'spiritual',
    desc: 'Cliffside Buddhist gompas, sacred river aartis & ancient temples',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    icon: Flame
  },
  {
    id: 'historical',
    title: 'Historical Sites',
    query: 'historical',
    desc: 'Intricate medieval stepwells, stone cenotaphs & baroque basilicas',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    icon: Footprints
  },
  {
    id: 'villages',
    title: 'Local Villages',
    query: 'village',
    desc: 'Living artisan hamlets, generational potters & organic farmsteads',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    icon: Users
  },
  {
    id: 'adventure',
    title: 'Adventure Tourism',
    query: 'adventure',
    desc: 'Betwa rapids kayaking, Thar desert safaris & high mountain treks',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    icon: MapPin
  }
];

// 8 State Cards with rich details
const STATE_CARDS = [
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    tagline: 'Land of Kings, Palaces & Golden Sands',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    badge: 'Royal Heritage',
    attractions: ['Amber Fort', 'Hawa Mahal', 'Thar Desert'],
    food: 'Dal Baati Churma, Gatte ki Sabzi, Ghewar',
    culture: 'Ghoomar & Kalbelia dance, Blue pottery, Bandhani',
    accentColor: '#F36B21'
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    tagline: 'Vibrant Colors, Living Craft & White Salt Desert',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
    badge: 'Vibrant Culture',
    attractions: ['Great Rann of Kutch', 'Rani ki Vav', 'Modhera Sun Temple'],
    food: 'Dhokla, Thepla, Khandvi, Gujarati Thali',
    culture: 'Garba & Raas dances, Rogan art, Ajrakh block prints',
    accentColor: '#D94E0B'
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    tagline: 'Literature, Mist-Kissed Tea Hills & Cultural Renaissance',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
    badge: 'Art & Literature',
    attractions: ['Victoria Memorial', 'Darjeeling Tea Valleys', 'Sundarbans'],
    food: 'Kosha Mangsho, Shorshe Ilish, Mishti Doi',
    culture: 'Baul folk singing, Terracotta temples, Kolkata Tramways',
    accentColor: '#7A2946'
  },
  {
    id: 'assam',
    name: 'Assam',
    tagline: 'Brahmaputra Riverways, Rhinos & Heirloom Tea Valleys',
    image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=800&q=80',
    badge: 'Living Traditions',
    attractions: ['Majuli River Island', 'Kaziranga Safari', 'Kamakhya Temple'],
    food: 'Khaar, Masor Tenga, Pitha, Black Rice Pudding',
    culture: 'Bihu dance, Vaishnavite Satra masks, Muga silk',
    accentColor: '#285943'
  },
  {
    id: 'kerala',
    name: 'Kerala',
    tagline: 'Tranquil Canals, Spice Valleys & Living Folklore',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    badge: "God's Own Country",
    attractions: ['Alleppey Backwaters', 'Munnar Tea Valleys', 'Fort Kochi'],
    food: 'Karimeen Pollichathu, Appam with Stew, Banana Leaf Sadhya',
    culture: 'Kathakali theatrics, Theyyam rituals, Aranmula mirrors',
    accentColor: '#0E6251'
  },
  {
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    tagline: 'Snow-Crested Valleys, Ancient Monasteries & Pine Trails',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    badge: 'Himalayan Sanctuary',
    attractions: ['Spiti Key Monastery', 'Chandratal Lake', 'Naggar Castle'],
    food: 'Himachali Siddu with Ghee, Chana Madra, Babru',
    culture: 'Kullu Nati dance, Handwoven shawls, Cham masked dances',
    accentColor: '#1F618D'
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    tagline: 'Medieval Cenotaphs, Stone Temples & River Sanctuaries',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
    badge: 'Heart of Heritage',
    attractions: ['Orchha Chhattris', 'Khajuraho Temples', 'Gwalior Fort'],
    food: 'Bundelkhandi Bafla, Bhutte ka Kees, Poha Jalebi',
    culture: 'Gond tribal paintings, Rai folk dance, Chanderi weaving',
    accentColor: '#7D6608'
  },
  {
    id: 'goa',
    name: 'Goa',
    tagline: 'Golden Shores, Portuguese Cathedrals & Spice Hills',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    badge: 'Coastal Heritage',
    attractions: ['Old Goa Basilica', 'Fontainhas Latin Quarter', 'Divar Island'],
    food: 'Goan Fish Curry Thali, Earthen Poi, Bebinca',
    culture: 'Mando acoustic singing, Azulejo tiles, Shigmo celebrations',
    accentColor: '#9C640C'
  }
];

// Curated Hidden Gems
const HIDDEN_GEMS = [
  {
    id: 'orchha-heritage',
    destinationId: 'orchha-heritage',
    name: 'Betwa River Cenotaphs & Rapids',
    location: 'Orchha, Madhya Pradesh',
    stateId: 'madhya-pradesh',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
    description: 'Fourteen monumental 16th-century stone cenotaphs perched along the rocky Betwa river, where vultures nest and evening aartis float across the water.',
    recommender: 'Bundelkhand Community Rovers',
    rating: 4.96,
    reviewsCount: 312,
    badge: 'Secret Heritage'
  },
  {
    id: 'panna-meena-kund',
    destinationId: 'amber-fort',
    name: 'Panna Meena ka Kund Stepwell',
    location: 'Amer, Rajasthan',
    stateId: 'rajasthan',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    description: 'An architectural marvel of interlocking diamond-pattern staircases built in the 16th century, tucked behind the busy tourist pathways of Jaipur.',
    recommender: 'Jaipur Native Heritage Guild',
    rating: 4.88,
    reviewsCount: 194,
    badge: 'Hidden Stepwell'
  },
  {
    id: 'nirona-rogan',
    destinationId: 'rann-of-kutch',
    name: 'Nirona Village Rogan Atelier',
    location: 'Nirona, Kutch, Gujarat',
    stateId: 'gujarat',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
    description: 'The sole remaining ancestral village where the Khatri family creates mesmerizing Rogan textile art using boiled castor oil paste and brass needles.',
    recommender: 'Kutch Artisan Cooperative',
    rating: 4.98,
    reviewsCount: 165,
    badge: 'Artisan Sanctuary'
  },
  {
    id: 'alleppey-kuttanad',
    destinationId: 'alleppey-backwaters',
    name: 'Kuttanad Country Canoe Canals',
    location: 'Kuttanad, Alleppey, Kerala',
    stateId: 'kerala',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    description: 'Silent narrow village waterways where motorboats cannot pass. Glide under flowering hibiscus canopies and meet coir spinners on wooden canoes.',
    recommender: 'Vembanad Canoe Collective',
    rating: 4.95,
    reviewsCount: 240,
    badge: 'Eco Waterway'
  },
  {
    id: 'langza-fossil',
    destinationId: 'spiti-valley',
    name: 'Langza High Altitude Fossil Village',
    location: 'Spiti Valley, Himachal Pradesh',
    stateId: 'himachal-pradesh',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    description: 'A 4,400-meter village guarded by a giant golden Buddha statue, where marine ammonite fossils from the ancient Tethys Sea still lie in the soil.',
    recommender: 'Spiti Eco-Community Guild',
    rating: 4.97,
    reviewsCount: 152,
    badge: 'Ancient Highlands'
  },
  {
    id: 'divar-island',
    destinationId: 'old-goa',
    name: 'Divar Island Mangrove & Ferry Trails',
    location: 'Mandovi Estuary, Goa',
    stateId: 'goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    description: 'A peaceful river island reachable only by public barge ferry, featuring sleepy Portuguese hamlets, lush paddy fields, and migratory wetland birds.',
    recommender: 'Goan Heritage Chroniclers',
    rating: 4.91,
    reviewsCount: 180,
    badge: 'Island Secret'
  }
];

// Experience Category Tabs
const EXPERIENCE_TABS = [
  { id: 'all', label: 'All Experiences', filterKey: 'All' },
  { id: 'food', label: 'Traditional Food', filterKey: 'Food' },
  { id: 'folk', label: 'Folk Dance & Music', filterKey: 'Folk' },
  { id: 'crafts', label: 'Art & Handicrafts', filterKey: 'Craft' },
  { id: 'festivals', label: 'Cultural Festivals', filterKey: 'Festiv' },
  { id: 'village', label: 'Village Experiences', filterKey: 'Village' },
  { id: 'workshops', label: 'Local Workshops', filterKey: 'Workshop' }
];

// Community User Contributions
const COMMUNITY_CONTRIBUTIONS = [
  {
    id: 'contrib-1',
    title: 'Sunrise Aarti over Betwa River Steps',
    destination: 'Orchha River Ghats',
    state: 'Madhya Pradesh',
    contributor: 'Rameshwar Bundela, Resident Heritage Guide',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
    description: 'At 05:45 AM, local temple priests chant ancient Sanskrit hymns while lamps reflect on the rushing river water. Free to attend and deeply spiritual.',
    status: 'Verified by YaatraSaathi Council',
    destinationId: 'orchha-heritage'
  },
  {
    id: 'contrib-2',
    title: 'Secret Stepwell Tunnels to Jaigarh Fort',
    destination: 'Amber Ridge',
    state: 'Rajasthan',
    contributor: 'Meera Sen, Archaeological Researcher',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    description: 'The underground medieval tunnel connecting Amber to Jaigarh Fort is now safely restored with atmospheric oil-lantern style lighting.',
    status: 'Verified by YaatraSaathi Council',
    destinationId: 'amber-fort'
  },
  {
    id: 'contrib-3',
    title: 'Kuttanad Duck Farming & Floating Canal Market',
    destination: 'Vembanad Canals',
    state: 'Kerala',
    contributor: 'Parvathi & Unnikrishnan Nair, Farm Hosts',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    description: 'Catch the early morning boat convoy where local farm families trade fresh tapioca, small freshwater crabs, and tender coconuts from canoe to canoe.',
    status: 'Community Endorsed',
    destinationId: 'alleppey-backwaters'
  }
];

export default function ExplorePage({
  favorites = [],
  onToggleFavorite,
  tripItems = [],
  onToggleTrip,
  onNavigateToPlace,
  onNavigateToState,
  onNavigate
}) {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [activeExpTab, setActiveExpTab] = useState('all');
  const [activeModalExperience, setActiveModalExperience] = useState(null);

  // Handle Search Input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedStateFilter('all');
    setSelectedCategoryFilter('all');
    setActiveExpTab('all');
  };

  // Quick shortcut selection
  const handleShortcutClick = (queryText) => {
    setSearchQuery(queryText);
    const el = document.getElementById('search-results-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter experiences based on active category tab & search
  const filteredExperiences = useMemo(() => {
    return MOCK_EXPERIENCES.filter((exp) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        exp.title?.toLowerCase().includes(q) ||
        exp.shortDescription?.toLowerCase().includes(q) ||
        exp.location?.toLowerCase().includes(q) ||
        exp.state?.toLowerCase().includes(q) ||
        exp.category?.toLowerCase().includes(q);

      const matchesState =
        selectedStateFilter === 'all' || exp.stateId === selectedStateFilter;

      let matchesTab = true;
      if (activeExpTab !== 'all') {
        const tabObj = EXPERIENCE_TABS.find((t) => t.id === activeExpTab);
        if (tabObj) {
          const key = tabObj.filterKey.toLowerCase();
          matchesTab =
            exp.category?.toLowerCase().includes(key) ||
            exp.title?.toLowerCase().includes(key) ||
            exp.shortDescription?.toLowerCase().includes(key);
        }
      }

      return matchesSearch && matchesState && matchesTab;
    });
  }, [searchQuery, selectedStateFilter, activeExpTab]);

  // Filter destinations based on search and state
  const filteredDestinations = useMemo(() => {
    return MOCK_DESTINATIONS.filter((dest) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        dest.name?.toLowerCase().includes(q) ||
        dest.tagline?.toLowerCase().includes(q) ||
        dest.state?.toLowerCase().includes(q) ||
        dest.location?.toLowerCase().includes(q) ||
        dest.overview?.toLowerCase().includes(q);

      const matchesState =
        selectedStateFilter === 'all' || dest.stateId === selectedStateFilter;

      return matchesSearch && matchesState;
    });
  }, [searchQuery, selectedStateFilter]);

  return (
    <div className="min-h-screen bg-[#FFF8EF] text-[#38291F] pb-24">
      {/* ========================================================================= */}
      {/* A. PAGE HERO SECTION                                                      */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-[#38291F] py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 border-b border-[#E7C9A5]/30">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=2200&q=85"
            alt="Explore Incredible India Landscape"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#38291F] via-[#38291F]/75 to-[#38291F]/50" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs font-bold tracking-wider uppercase shadow-md bg-[#F36B21] border border-[#F36B21]/30 animate-fadeIn">
            <Compass className="w-3.5 h-3.5 text-amber-200" />
            <span>DISCOVER REGIONAL CULTURE & HERITAGE</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight sm:leading-none drop-shadow-md animate-fadeInUp">
            Explore <span className="text-[#E7C9A5]">Incredible India</span>
          </h1>

          <p className="max-w-3xl mx-auto text-slate-200 text-sm sm:text-lg sm:leading-relaxed font-medium drop-shadow-sm animate-fadeInUp">
            Discover hidden places, experience local culture, and explore destinations recommended by local communities.
          </p>

          {/* Destination Search Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by destination, state, experience, or hidden gem…"
                  className="w-full pl-11 pr-10 py-3.5 text-sm sm:text-base bg-white/95 backdrop-blur-md text-[#38291F] placeholder-slate-400 rounded-xl border border-white/40 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F36B21]"
                  aria-label="Search destinations and experiences"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search text"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('search-results-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-3.5 px-6 rounded-xl bg-[#F36B21] hover:bg-[#D94E0B] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 shrink-0 active:scale-95 transition-all duration-200"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Search</span>
              </button>
            </div>

            {/* Location & Category Shortcuts */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-[#E7C9A5] font-semibold">Quick Shortcuts:</span>
              {['Rajasthan', 'Kerala', 'Himachal Pradesh', 'Goa', 'Heritage & Forts', 'Nature & Lakes', 'Beaches', 'Spiritual'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleShortcutClick(item)}
                  className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium backdrop-blur-xs transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-20">

        {/* ========================================================================= */}
        {/* B. DESTINATION CATEGORIES                                                 */}
        {/* ========================================================================= */}
        <section aria-labelledby="destination-categories-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-3 border-b border-[#E7C9A5]/40">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F36B21]/10 text-[#F36B21] text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-[#F36B21]/20">
                <Compass className="w-3.5 h-3.5 text-[#F36B21]" />
                <span>Themes & Landscapes</span>
              </div>
              <h2
                id="destination-categories-heading"
                className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#38291F] tracking-tight"
              >
                Destination Categories
              </h2>
              <p className="text-[#64748B] text-xs sm:text-sm max-w-2xl mt-1">
                Choose a terrain or theme to discover handpicked sanctuaries, historical monuments, and remote natural wonders.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DESTINATION_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="group relative bg-white rounded-2xl border border-[#F2E4D2] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#38291F]/90 via-[#38291F]/35 to-transparent" />
                    
                    <div className="absolute bottom-3 left-3 right-3 text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                        <Icon className="w-4 h-4 text-amber-200" />
                      </div>
                      <h3 className="font-display font-bold text-base sm:text-lg leading-tight text-white drop-shadow-sm">
                        {cat.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                      {cat.desc}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery(cat.query);
                        const el = document.getElementById('search-results-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center justify-between w-full pt-2 border-t border-[#F2E4D2] text-xs font-bold text-[#F36B21] group-hover:text-[#D94E0B] transition-colors"
                    >
                      <span>Explore {cat.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* C. EXPLORE BY STATE (8 DISTINCT STATE HUBS)                               */}
        {/* ========================================================================= */}
        <section id="explore-states" aria-labelledby="explore-states-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-3 border-b border-[#E7C9A5]/40">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-900 text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-amber-500/20">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>Regional Destination Hubs</span>
              </div>
              <h2
                id="explore-states-heading"
                className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#38291F] tracking-tight"
              >
                Explore by State
              </h2>
              <p className="text-[#64748B] text-xs sm:text-sm max-w-2xl mt-1">
                Each state possesses its own soul, cuisine, folk traditions, and sacred architecture. Click to open its dedicated state destination page.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATE_CARDS.map((state) => (
              <div
                key={state.id}
                className="group relative bg-white rounded-2xl border border-[#F2E4D2] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={state.image}
                    alt={state.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#38291F]/90 via-[#38291F]/30 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-[#38291F] shadow-xs backdrop-blur-md">
                      {state.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight leading-tight drop-shadow-sm">
                      {state.name}
                    </h3>
                    <p className="text-[11px] text-[#E7C9A5] line-clamp-1 font-medium">
                      {state.tagline}
                    </p>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-[#38291F] block text-[11px] uppercase tracking-wide">
                        Key Attractions:
                      </span>
                      <p className="text-[#64748B] line-clamp-1">
                        {state.attractions.join(' • ')}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-[#38291F] block text-[11px] uppercase tracking-wide">
                        Food Speciality:
                      </span>
                      <p className="text-[#64748B] line-clamp-1">
                        {state.food}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-[#38291F] block text-[11px] uppercase tracking-wide">
                        Cultural Heritage:
                      </span>
                      <p className="text-[#64748B] line-clamp-1">
                        {state.culture}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F2E4D2]">
                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigateToState) {
                          onNavigateToState(state.id);
                        } else {
                          window.location.href = `/explore/${state.id}`;
                        }
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#F36B21] hover:bg-[#D94E0B] text-white shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <span>Explore {state.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* D. HIDDEN GEMS NEAR YOU (COMMUNITY PICKS)                                 */}
        {/* ========================================================================= */}
        <section aria-labelledby="hidden-gems-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-3 border-b border-[#E7C9A5]/40">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Locally Sourced Secrets</span>
              </div>
              <h2
                id="hidden-gems-heading"
                className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#38291F] tracking-tight"
              >
                Hidden Gems Near You
              </h2>
              <p className="text-[#64748B] text-xs sm:text-sm max-w-2xl mt-1">
                Lesser-known sanctuaries, secluded stepwells, and artisan hamlets recommended directly by native community custodians.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HIDDEN_GEMS.map((gem) => {
              const isFav = favorites.includes(gem.destinationId);
              return (
                <div
                  key={gem.id}
                  className="group relative bg-white rounded-2xl border border-[#F2E4D2] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="relative h-52 overflow-hidden bg-slate-900">
                    <img
                      src={gem.image}
                      alt={gem.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#38291F]/90 via-[#38291F]/35 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F36B21] text-white shadow-xs">
                        {gem.badge}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleFavorite && onToggleFavorite(gem.destinationId)}
                      aria-label="Bookmark hidden gem"
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#38291F] shadow-sm transition-transform active:scale-90"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'text-[#F36B21] fill-[#F36B21]' : 'text-slate-600'}`} />
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-display font-extrabold text-lg sm:text-xl tracking-tight leading-tight text-white drop-shadow-sm">
                        {gem.name}
                      </h3>
                      <p className="text-[11px] text-[#E7C9A5] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#F36B21]" />
                        <span>{gem.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed line-clamp-3">
                      {gem.description}
                    </p>

                    <div className="space-y-3 pt-2 border-t border-[#F2E4D2]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{gem.recommender}</span>
                        </span>
                        {gem.rating && (
                          <span className="font-bold text-[#38291F] flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>{gem.rating}</span>
                            <span className="text-slate-400 font-normal">({gem.reviewsCount})</span>
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (onNavigateToPlace) {
                            onNavigateToPlace(gem.destinationId);
                          }
                        }}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#FFF8EF] hover:bg-[#F2E4D2] text-[#38291F] border border-[#E7C9A5] shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#F36B21]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* E. LOCAL EXPERIENCES (CATEGORY FILTER & CARDS)                            */}
        {/* ========================================================================= */}
        <section id="local-experiences" aria-labelledby="local-exp-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-3 border-b border-[#E7C9A5]/40">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F36B21]/10 text-[#F36B21] text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-[#F36B21]/20">
                <Utensils className="w-3.5 h-3.5 text-[#F36B21]" />
                <span>Hands-on Immersion</span>
              </div>
              <h2
                id="local-exp-heading"
                className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#38291F] tracking-tight"
              >
                Local Experiences
              </h2>
              <p className="text-[#64748B] text-xs sm:text-sm max-w-2xl mt-1">
                Step inside ancestral kitchens, folk performance arenas, and master weaver studios directly with native custodians.
              </p>
            </div>

            {/* Experience Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {EXPERIENCE_TABS.map((tab) => {
                const isActive = activeExpTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveExpTab(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                      isActive
                        ? 'bg-[#F36B21] text-white shadow-xs font-bold scale-[1.02]'
                        : 'bg-white hover:bg-[#F2E4D2] text-[#38291F] border border-[#F2E4D2]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered Experiences Grid */}
          {filteredExperiences.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#E7C9A5] p-10 text-center max-w-md mx-auto shadow-xs my-6">
              <AlertCircle className="w-8 h-8 text-[#F36B21] mx-auto mb-2" />
              <h3 className="font-display font-bold text-lg text-[#38291F]">No experiences match this filter</h3>
              <p className="text-xs text-[#64748B] mt-1 mb-4">Try selecting another experience tab or resetting your search.</p>
              <button
                type="button"
                onClick={() => setActiveExpTab('all')}
                className="py-2 px-4 rounded-xl bg-[#F36B21] text-white text-xs font-bold"
              >
                Reset Experience Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map((exp) => (
                <ExperienceCard
                  key={exp.id}
                  experience={exp}
                  onSelect={() => setActiveModalExperience(exp)}
                  isFavorite={favorites.includes(exp.id)}
                  onToggleFavorite={onToggleFavorite}
                  isInTrip={tripItems.some((item) => item.id === exp.id)}
                  onToggleTrip={onToggleTrip}
                  onNavigateToPlace={() => {
                    if (onNavigateToPlace && exp.destinationId) {
                      onNavigateToPlace(exp.destinationId);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* F. RECOMMENDED DESTINATIONS (ALL 8 STATE HIGHLIGHTS)                       */}
        {/* ========================================================================= */}
        <section id="recommended-destinations" aria-labelledby="recommended-dest-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-3 border-b border-[#E7C9A5]/40">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-900 text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-amber-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Verified Regional Landmarks</span>
              </div>
              <h2
                id="recommended-dest-heading"
                className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#38291F] tracking-tight"
              >
                Recommended Destinations
              </h2>
              <p className="text-[#64748B] text-xs sm:text-sm max-w-2xl mt-1">
                Signature architectural, riverine, and mountain landmarks with comprehensive travel intelligence and route coordinates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDestinations.map((dest) => {
              const isFav = favorites.includes(dest.id);
              return (
                <div
                  key={dest.id}
                  className="group relative bg-white rounded-2xl border border-[#F2E4D2] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#38291F]/90 via-[#38291F]/30 to-transparent" />
                    
                    <button
                      type="button"
                      onClick={() => onToggleFavorite && onToggleFavorite(dest.id)}
                      aria-label="Save destination"
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#38291F] shadow-sm transition-transform active:scale-90"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'text-[#F36B21] fill-[#F36B21]' : 'text-slate-600'}`} />
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wider block">
                        {dest.state}
                      </span>
                      <h3 className="font-display font-extrabold text-lg tracking-tight leading-tight text-white drop-shadow-sm">
                        {dest.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      {dest.tagline || dest.overview}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-[#F2E4D2]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {dest.verifiedStatus || 'Community Curated'}
                        </span>
                        {dest.rating && (
                          <span className="font-bold text-[#38291F] flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>{dest.rating}</span>
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (onNavigateToPlace) {
                            onNavigateToPlace(dest.id);
                          }
                        }}
                        className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-[#F36B21] hover:bg-[#D94E0B] text-white shadow-xs flex items-center justify-center gap-1 transition-all active:scale-95"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* G. COMMUNITY RECOMMENDATIONS                                              */}
        {/* ========================================================================= */}
        <section aria-labelledby="community-contrib-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-3 border-b border-[#E7C9A5]/40">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-emerald-500/20">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span>Traveler & Host Submissions</span>
              </div>
              <h2
                id="community-contrib-heading"
                className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#38291F] tracking-tight"
              >
                Community Recommendations
              </h2>
              <p className="text-[#64748B] text-xs sm:text-sm max-w-2xl mt-1">
                Authentic tips and secret spots shared by local community residents, guides, and independent explorers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('contribute');
              }}
              className="py-2.5 px-5 rounded-xl bg-[#F36B21] hover:bg-[#D94E0B] text-white font-bold text-xs shadow-xs flex items-center gap-2 self-start sm:self-auto transition-all active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share a Gem</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMMUNITY_CONTRIBUTIONS.map((contrib) => (
              <div
                key={contrib.id}
                className="bg-white rounded-2xl border border-[#F2E4D2] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <img
                    src={contrib.image}
                    alt={contrib.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#38291F]/90 via-[#38291F]/30 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                      {contrib.status}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-display font-bold text-base leading-tight text-white drop-shadow-sm">
                      {contrib.title}
                    </h3>
                    <p className="text-[11px] text-[#E7C9A5]">
                      {contrib.destination} • {contrib.state}
                    </p>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    "{contrib.description}"
                  </p>

                  <div className="pt-3 border-t border-[#F2E4D2] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={contrib.avatar}
                        alt={contrib.contributor}
                        className="w-8 h-8 rounded-full object-cover border border-[#F2E4D2]"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#38291F] line-clamp-1 leading-tight">
                          {contrib.contributor}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigateToPlace && contrib.destinationId) {
                          onNavigateToPlace(contrib.destinationId);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#F36B21] hover:bg-[#FFF8EF] transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Search Results Anchor Section for Direct Jump */}
        <div id="search-results-section" />

      </main>

      {/* Experience Details Modal Drawer */}
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
