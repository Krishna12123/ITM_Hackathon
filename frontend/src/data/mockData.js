export const CATEGORIES = [
  "All Experiences",
  "Local Food",
  "Culture & Folk Dance",
  "Handicrafts",
  "Nature & Adventure",
  "Village Experiences"
];

export const MOCK_DESTINATIONS = [
  {
    id: "orchha-heritage",
    name: "Orchha Heritage & River Sanctuary",
    state: "Madhya Pradesh",
    location: "Bundelkhand, Madhya Pradesh, India",
    rating: 4.8,
    reviewsCount: 342,
    verifiedStatus: "State Tourism Verified",
    tagline: "Medieval palaces, soaring cenotaphs, and serene Betwa riverbanks",
    heroImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Nestled along the rocky granite boulders of the tranquil Betwa River, Orchha is a preserved 16th-century capital established by the Bundela Rajput kings. Unlike overcrowded heritage circuits, Orchha invites travelers to stroll at a slow rhythm through towering Chattris (cenotaphs), mural-adorned palaces like Raja Mahal and Jahangir Mahal, and sacred river ghats echoing evening aartis.",
    highlights: [
      "Jahangir Mahal — Exemplary blend of Rajput and Mughal stone filigree.",
      "Chhattris on Betwa Ghat — Sunset reflection across boulder-strewn waters.",
      "Ram Raja Temple — The only temple in India where Lord Rama is venerated as a reigning monarch.",
      "Betwa River Nature Kayaking & Vulture Sanctuary trail."
    ],
    travelTips: [
      "Morning heritage walks (6:30 AM) offer golden hour lighting with almost no crowds.",
      "Combine the light & sound show at Orchha Fort in the evening for rich Bundelkhand folklore.",
      "Carry water and slip-resistant footwear for exploring fort ramparts and river rocks."
    ],
    openingHours: "08:00 AM – 06:00 PM (Daily)",
    entryFee: "₹100 (Indian Citizens) / ₹400 (Foreign Nationals) — Covers Raja Mahal & Jahangir Mahal",
    bestVisitingTime: "October to March (Pleasant daytime temperatures: 18°C – 26°C)",
    mapCoordinates: {
      lat: 25.3524,
      lng: 78.6416,
      elevation: "248m above sea level",
      nearestTransit: "Jhansi Railway Station (18 km, 30 min cab ride)"
    },
    relatedExperiences: ["exp-food-walk", "exp-folk-music", "exp-pottery", "exp-nature-walk"]
  },
  {
    id: "majuli-island",
    name: "Majuli Riverine Heritage Island",
    state: "Assam",
    location: "Brahmaputra Basin, Jorhat, Assam",
    rating: 4.9,
    reviewsCount: 219,
    verifiedStatus: "UNESCO Tentative & Eco-Certified",
    tagline: "World's largest inhabited freshwater island and cradle of Neo-Vaishnavite culture",
    heroImage: "https://images.unsplash.com/photo-1626014303757-64669344464c?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1626014303757-64669344464c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Majuli is an enchanting world woven between the swirling currents of the Brahmaputra River. It is celebrated for its 15th-century Satras (monastic hermitages), indigenous mask-making traditions of Chamaguri Satra, and stilted bamboo villages inhabited by the warm Mishing tribe.",
    highlights: [
      "Chamaguri Satra handmade bamboo & clay theatrical mask studios.",
      "Auniati Satra ancient relic museum and devotional musical prayers.",
      "Cycling along serene paddy fields and birding wetlands at sunset."
    ],
    travelTips: [
      "Access via ferry from Nimati Ghat (Jorhat); check ferry times before departure.",
      "Respect monastery etiquette: remove footwear and maintain quiet demeanor inside prayer halls."
    ],
    openingHours: "Open year-round; Satras receive visitors 09:00 AM – 05:00 PM",
    entryFee: "Free entry to island; voluntary donations at monastery cultural centers",
    bestVisitingTime: "November to April (Raas Mahotsav festival in November is prime)",
    mapCoordinates: {
      lat: 26.9535,
      lng: 94.2185,
      elevation: "84m above sea level",
      nearestTransit: "Jorhat Airport (35 km + 45m river ferry)"
    },
    relatedExperiences: ["exp-village-life", "exp-pottery", "exp-cooking"]
  }
];

export const MOCK_EXPERIENCES = [
  {
    id: "exp-food-walk",
    title: "Bundelkhand Local Food Walk",
    category: "Local Food",
    location: "Old City Gate, Orchha, Madhya Pradesh",
    rating: 4.9,
    reviewsCount: 148,
    duration: "3.5 Hours",
    price: 850,
    priceNote: "per person (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Rameshwar Tiwari",
      role: "3rd-Gen Culinary Historian",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Bestseller",
    shortDescription: "Taste traditional Bedmi Puri, roasted Bhutte ka Kees, and slow-simmered kulhad chai in historic family havelis.",
    highlights: ["6 authentic culinary stops", "Private haveli kitchen tasting", "Fresh regional spice identification"]
  },
  {
    id: "exp-folk-music",
    title: "Traditional Folk Music Evening",
    category: "Culture & Folk Dance",
    location: "Betwa Riverside Amphitheatre, Bundelkhand",
    rating: 4.85,
    reviewsCount: 112,
    duration: "2.5 Hours",
    price: 1200,
    priceNote: "per guest (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Sharda Devi & Folk Ensemble",
      role: "Folk Music Virtuoso",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Cultural Highlight",
    shortDescription: "Experience an evocative evening of Bundeli and Rajasthani folk songs, dholak rhythms, and heritage storytelling.",
    highlights: ["Traditional acoustic instruments demo", "Oral histories of medieval balladeers", "Open-air tea with the artists"]
  },
  {
    id: "exp-pottery",
    title: "Pottery and Handicraft Workshop",
    category: "Handicrafts",
    location: "Artisans Guild Lane, Orchha Cluster",
    rating: 4.95,
    reviewsCount: 94,
    duration: "4 Hours",
    price: 950,
    priceNote: "per person (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Dinesh Prajapati",
      role: "Master Craftsman",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Hands-on Masterclass",
    shortDescription: "Shape terracotta relief tiles, try the potter's wheel, and learn natural pit-firing techniques from master artisans.",
    highlights: ["Clay preparation and wheel-turning", "Hands-on terracotta votive carving", "Take home your personal clay creation"]
  },
  {
    id: "exp-village-life",
    title: "Village Life and Farming Experience",
    category: "Village Experiences",
    location: "Taraigram Eco Village, Orchha Outskirts",
    rating: 4.92,
    reviewsCount: 86,
    duration: "5 Hours",
    price: 1400,
    priceNote: "per person (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Lakshman Singh",
      role: "Community Farming Elder",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Community Living",
    shortDescription: "Spend the morning walking organic farm tracks, harvesting seasonal produce, and sharing lunch with a rural farming family.",
    highlights: ["Guided organic agriculture walk", "Cow milking & traditional grain grinding", "Wood-fired farmstead thali lunch"]
  },
  {
    id: "exp-nature-walk",
    title: "Guided Nature and Riverside Walk",
    category: "Nature & Adventure",
    location: "Betwa River Sanctuary, Madhya Pradesh",
    rating: 4.78,
    reviewsCount: 65,
    duration: "2.5 Hours",
    price: 650,
    priceNote: "per person (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Chandan Rawat",
      role: "Sanctuary Naturalist",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Eco Discovery",
    shortDescription: "Walk along the Betwa boulder rapids while spotting rare resident river birds, kingfishers, and long-billed vultures.",
    highlights: ["Birdwatching through spotting scope", "Granite boulder trail navigation", "Herbal botany and river ecosystem talk"]
  },
  {
    id: "exp-cooking",
    title: "Local Cooking with a Host",
    category: "Local Food",
    location: "Heritage Quarter Kitchen, Orchha",
    rating: 4.91,
    reviewsCount: 78,
    duration: "3 Hours",
    price: 1100,
    priceNote: "per guest (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Ananya Dixit",
      role: "Homestyle Culinary Host",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Home Kitchen",
    shortDescription: "Step inside a family courtyard to learn heirloom recipes: Bundelkhandi Tholi, spicy kadhi, and jaggery delicacies.",
    highlights: ["Hands-on traditional spice grinding on sil-batta", "Step-by-step bread making over earthen hearth", "Full communal meal included"]
  }
];
