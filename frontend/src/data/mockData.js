export const CATEGORIES = [
  "All Experiences",
  "Local Food",
  "Folk Dance & Music",
  "Handicrafts & Workshops",
  "Heritage & Cultural Walks",
  "Nature & Adventure",
  "Festivals & Traditions"
];

export const STATE_THEMES = [
  {
    id: "rajasthan",
    name: "Rajasthan",
    subheading: "Royal Heritage",
    tagline: "Land of Kings, Palaces & Golden Sands",
    featuredDestination: "Amber Fort & Palace, Jaipur",
    description: "Immerse in grand Rajput hill forts, desert folk ballads, intricate block-printed textiles, and royal haveli architecture.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    destinationId: "amber-fort",
    palette: {
      primary: "#8F2635",    // Burgundy
      accent: "#D9A441",     // Royal Gold
      bgSubtle: "#F6E9D2",   // Sand Cream
      dark: "#39251F"        // Deep Brown
    },
    badge: "Royal Heritage",
    stats: "4 Heritage Circuits • 12 Experiences"
  },
  {
    id: "gujarat",
    name: "Gujarat",
    subheading: "Vibrant Culture",
    tagline: "Vibrant Colors, Living Heritage & Artisan Craftsmanship",
    featuredDestination: "White Desert & Great Rann of Kutch",
    description: "Celebrated for the ethereal white salt desert, geometric stepwell architecture, rhythmic Garba dance, and master textile embroidery.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80",
    destinationId: "rann-of-kutch",
    palette: {
      primary: "#D85B32",    // Terracotta
      accent: "#E6B93F",     // Marigold
      secondary: "#176B67",  // Teal
      bgSubtle: "#FFF8EC"    // Warm White
    },
    badge: "Vibrant Culture",
    stats: "3 Artisan Hubs • 10 Experiences"
  },
  {
    id: "west-bengal",
    name: "West Bengal",
    subheading: "Art, Literature & Heritage",
    tagline: "Cradle of Literature, Grand Architecture & Cultural Renaissance",
    featuredDestination: "Victoria Memorial & Kolkata Heritage Streets",
    description: "Steeped in colonial marble architecture, adda conversations, historic tramways, terracotta temples, and Himalayan tea estates.",
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    destinationId: "victoria-memorial",
    palette: {
      primary: "#7A2946",    // Wine
      accent: "#D6A64F",     // Antique Gold
      bgSubtle: "#E8DCCB",   // Ivory
      dark: "#342B30"        // Charcoal
    },
    badge: "Art & Literature",
    stats: "4 Cultural Walks • 14 Experiences"
  },
  {
    id: "assam",
    name: "Assam",
    subheading: "Nature & Living Traditions",
    tagline: "Serene Riverways, Living Traditions & Lush Tea Valleys",
    featuredDestination: "Majuli Island & Brahmaputra Basin",
    description: "Discover the world's largest freshwater river island, UNESCO one-horned rhino sanctuaries, rhythmic Bihu dance, and heirloom tea gardens.",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1626014303757-64669344464c?auto=format&fit=crop&w=1200&q=80",
    destinationId: "majuli-island",
    palette: {
      primary: "#285943",    // Forest Green
      accent: "#C49A54",     // Bamboo Gold
      bgSubtle: "#E9E4D5",   // Mist Cream
      dark: "#1D352A"        // Deep Green
    },
    badge: "Nature & Traditions",
    stats: "3 Nature Trails • 8 Experiences"
  }
];

export const STATE_SPECIALITIES = [
  {
    stateId: "rajasthan",
    name: "Rajasthan",
    title: "Rajasthan — Royal Heritage",
    subtitle: "Land of Kings, Palaces & Golden Sands",
    introduction: "Discover the regal grandeur of the Thar desert, where heroic ballads echo through sandstone ramparts, vibrant turbans dance against golden dunes, and centuries-old culinary secrets are guarded in royal havelis.",
    bannerImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=80",
    theme: {
      primary: "#8F2635",    // Burgundy
      accent: "#D9A441",     // Antique Gold
      bgSubtle: "#F6E9D2",   // Sand Cream
      dark: "#39251F",       // Deep Brown
      badgeBg: "rgba(143, 38, 53, 0.9)"
    },
    actionLabel: "Explore Rajasthan",
    categories: ["Local Food", "Folk Culture", "Handicrafts", "Places and Heritage"],
    specialities: [
      {
        id: "raj-food",
        category: "Local Food",
        title: "Royal Rajput Cuisine",
        items: ["Dal Baati Churma", "Gatte ki Sabzi", "Ghewar"],
        description: "Rich, slow-simmered flavors prepared in pure ghee over earthen hearths, from spicy panchmel dal to honeycomb saffron ghewar.",
        image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80",
        actionType: "experience",
        targetId: "exp-raj-dal-baati",
        filterCategory: "Local Food"
      },
      {
        id: "raj-folk",
        category: "Folk Culture",
        title: "Desert Ballads & Dance",
        items: ["Ghoomar dance", "Kalbeliya folk dance", "Traditional folk music"],
        description: "Hypnotic swirling black skirt pirouettes, resonant morchang melodies, and soulful Manganiyar oral ballads beneath desert stars.",
        image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
        actionType: "experience",
        targetId: "exp-raj-folk-dance",
        filterCategory: "Folk Dance & Music"
      },
      {
        id: "raj-crafts",
        category: "Handicrafts",
        title: "Artisan Guild Creations",
        items: ["Blue pottery", "Block printing", "Bandhani textiles"],
        description: "Hand-turned cobalt quartz vases, hand-carved teakwood block print textiles from Sanganer, and intricate tie-dye Bandhani silks.",
        image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
        actionType: "experience",
        targetId: "exp-raj-blue-pottery",
        filterCategory: "Handicrafts & Workshops"
      },
      {
        id: "raj-places",
        category: "Places and Heritage",
        title: "Forts, Palaces & Dunes",
        items: ["Hawa Mahal", "Amber Fort", "Thar Desert"],
        description: "The 953-casement pink facade of Hawa Mahal, the mirror-inlaid halls of Amber Fort, and undulating ripples of the golden Thar.",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
        actionType: "place",
        targetId: "amber-fort",
        filterCategory: "All Experiences"
      }
    ],
    natureAdventure: {
      title: "Thar Desert Starlight & Dunes Expedition",
      description: "Venture beyond the palaces into the ripples of Sam Sand Dunes, witness golden sunsets atop camel caravans, and stargaze under pollution-free desert night skies.",
      items: ["Sam Sand Dunes Camel Safari", "Desert National Park Wildlife Walk", "Starlight Camping in Khuri"],
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80"
    },
    travelInfo: {
      bestTimeToVisit: "October to March (pleasant days, cool desert nights)",
      weather: "Warm sunny days (20°C - 28°C), cool desert nights (8°C - 14°C)",
      connectivity: "Jaipur International Airport (JAI), Jodhpur (JDH), Udaipur (UDR); extensive railway network.",
      travelTips: [
        "Carry lightweight cottons for daytime and warm woolen shawls for desert evenings.",
        "Always seek permission before photographing locals in traditional desert attire.",
        "Stay hydrated and savor authentic dal baati churma cooked over slow earthen hearths."
      ]
    }
  },
  {
    stateId: "gujarat",
    name: "Gujarat",
    title: "Gujarat — Vibrant Culture",
    subtitle: "Vibrant Colors, Living Heritage & Artisan Craftsmanship",
    introduction: "Enter a kaleidoscopic land of mirror-worked tapestries, geometric subterranean stepwells, intricate double-ikat silk looms, and exhilarating nine-night Garba celebrations across shimmering salt deserts.",
    bannerImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1600&q=80",
    theme: {
      primary: "#D85B32",    // Terracotta
      accent: "#E6B93F",     // Marigold
      secondary: "#176B67",  // Teal
      bgSubtle: "#FFF8EC",   // Warm White
      badgeBg: "rgba(216, 91, 50, 0.9)"
    },
    actionLabel: "Explore Gujarat",
    categories: ["Local Food", "Folk Culture", "Handicrafts", "Places and Heritage"],
    specialities: [
      {
        id: "guj-food",
        category: "Local Food",
        title: "Heirloom Gujarati Farsan",
        items: ["Dhokla", "Thepla", "Undhiyu"],
        description: "Spongy mustard-tempered khaman, fragrant fenugreek theplas, and slow-cooked earthen-pot winter undhiyu paired with hot jalebis.",
        image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
        actionType: "experience",
        targetId: "exp-guj-thali",
        filterCategory: "Local Food"
      },
      {
        id: "guj-folk",
        category: "Folk Culture",
        title: "Garba & Festive Rhythms",
        items: ["Garba", "Dandiya Raas", "Traditional folk music"],
        description: "Circular rhythmic claps, spinning colorful chaniya cholis with mirror work, and ringing wooden dandiya sticks honoring the Mother Goddess.",
        image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80",
        actionType: "experience",
        targetId: "exp-guj-garba",
        filterCategory: "Festivals & Traditions"
      },
      {
        id: "guj-crafts",
        category: "Handicrafts",
        title: "Master Textile Artistry",
        items: ["Bandhani textiles", "Kutch embroidery", "Patola weaving"],
        description: "Mathematical double-warp Patan Patola silk weaves, Rabari mirror-and-chain embroidery, and delicate Jamnagar tie-dye knots.",
        image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
        actionType: "experience",
        targetId: "exp-guj-patola-weaving",
        filterCategory: "Handicrafts & Workshops"
      },
      {
        id: "guj-places",
        category: "Places and Heritage",
        title: "Salt Pans & Sacred Stepwells",
        items: ["Rann of Kutch", "Rani ki Vav", "Modhera Sun Temple"],
        description: "The infinite crystalline salt crust of Great Rann, the multi-tiered sculpted Queen's Stepwell, and the equinox-aligned Modhera Sun Temple.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
        actionType: "place",
        targetId: "rann-of-kutch",
        filterCategory: "All Experiences"
      }
    ],
    natureAdventure: {
      title: "White Rann Moonlight & Gir Forest Wilderness",
      description: "Walk the surreal crystalline salt expanse during full moon nights, or take a morning jeep safari through the teak forests of Gir to spot wild Asiatic lions.",
      items: ["White Rann Midnight Salt Walk", "Gir National Park Lion Safari", "Little Rann Wild Ass Sanctuary"],
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
    },
    travelInfo: {
      bestTimeToVisit: "November to February (Rann Utsav season and comfortable wildlife temperatures)",
      weather: "Dry and temperate (15°C - 30°C); cold breezes on the open Rann salt flats.",
      connectivity: "Sardar Vallabhbhai Patel International Airport, Ahmedabad (AMD), Bhuj (BHJ); high-speed Vande Bharat rail corridor.",
      travelTips: [
        "Obtain the mandatory online permit before visiting the Great Rann of Kutch border zones.",
        "Modest dress is appreciated when visiting ancient stepwells and temple compounds.",
        "Pair spicy Kathiyawadi garlic chutney with fresh bajra rotla and jaggery."
      ]
    }
  },
  {
    stateId: "west-bengal",
    name: "West Bengal",
    title: "West Bengal — Art & Literature",
    subtitle: "Cradle of Literature, Renaissance Arts & Heritage Architecture",
    introduction: "Immerse in Bengal's intellectual resonance and artistic spirit, renowned for passionate street-corner addas, terracotta temples, mystic Baul singers, heritage electric trams, and high-altitude Himalayan tea estates.",
    bannerImage: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80",
    theme: {
      primary: "#7A2946",    // Wine
      accent: "#D6A64F",     // Antique Gold
      bgSubtle: "#E8DCCB",   // Ivory
      dark: "#342B30",       // Charcoal
      badgeBg: "rgba(122, 41, 70, 0.9)"
    },
    actionLabel: "Explore West Bengal",
    categories: ["Local Food", "Folk Culture and Arts", "Handicrafts", "Places and Heritage"],
    specialities: [
      {
        id: "bengal-food",
        category: "Local Food",
        title: "Legendary Bengal Delicacies",
        items: ["Mishti doi", "Sandesh", "Kolkata-style kathi rolls"],
        description: "Slow-baked earthen cup sweetened curd (mishti doi), seasonal nolen gur date-palm sandesh, and Nizam's paratha-wrapped kathi rolls.",
        image: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80",
        actionType: "experience",
        targetId: "exp-bengal-culinary",
        filterCategory: "Local Food"
      },
      {
        id: "bengal-folk",
        category: "Folk Culture and Arts",
        title: "Baul Melodies & Festivities",
        items: ["Baul music", "Chhau dance traditions", "Durga Puja artistry"],
        description: "Mystic ektara songs of rural wandering minstrels, acrobatic masked martial Chhau performances, and the UNESCO living street festival of Durga Puja.",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
        actionType: "experience",
        targetId: "exp-bengal-tram",
        filterCategory: "Heritage & Cultural Walks"
      },
      {
        id: "bengal-crafts",
        category: "Handicrafts",
        title: "Heirloom Bengal Crafts",
        items: ["Terracotta crafts", "Kantha embroidery", "Dokra metal craft"],
        description: "Bishnupur burnt-clay relief plaques, recycled saree running-stitch Kantha embroideries, and ancient lost-wax bell-metal Dokra figurines.",
        image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
        actionType: "experience",
        targetId: "exp-bengal-kumartuli",
        filterCategory: "Handicrafts & Workshops"
      },
      {
        id: "bengal-places",
        category: "Places and Heritage",
        title: "Marble Palaces & Misty Hills",
        items: ["Victoria Memorial", "Bishnupur terracotta temples", "Darjeeling tea gardens"],
        description: "The immaculate Makrana marble memorial overlooking Kolkata's Maidan, the 17th-century brick temples of Bishnupur, and misty Himalayan tea slopes.",
        image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
        actionType: "place",
        targetId: "victoria-memorial",
        filterCategory: "All Experiences"
      }
    ],
    natureAdventure: {
      title: "Darjeeling Himalayan Foothills & Sunderbans Mangroves",
      description: "Ascend to high-altitude misty tea ridges overlooking Kangchenjunga, or cruise deep into the estuarine mangrove maze of the Sunderbans tiger reserve.",
      items: ["Tiger Hill Sunrise & Himalayan Trek", "Darjeeling Toy Train Heritage Ride", "Sunderbans Mangrove Boat Trail"],
      image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
    },
    travelInfo: {
      bestTimeToVisit: "October to March (ideal for cultural festivals and pleasant Kolkata weather; April-May for Darjeeling)",
      weather: "Plains: Mild winter (14°C - 26°C); Hills: Crisp mountain chill (5°C - 15°C)",
      connectivity: "Netaji Subhash Chandra Bose International Airport, Kolkata (CCU), Bagdogra (IXB); Howrah & Sealdah rail hubs.",
      travelTips: [
        "Ride the historic Route 36 electric tramway across the Maidan early in the morning.",
        "Join an evening adda at College Street's iconic Indian Coffee House.",
        "Always sample fresh warm rosogollas straight from the earthen handis."
      ]
    }
  },
  {
    stateId: "assam",
    name: "Assam",
    title: "Assam — Nature & Traditions",
    subtitle: "Serene Riverways, Living Traditions & Lush Tea Valleys",
    introduction: "Journey along the mighty Brahmaputra river through misty biodiversity corridors, home to the prehistoric one-horned rhinoceros, ancient Satra monastic guilds, golden Muga silk looms, and crisp single-estate orthodox black teas.",
    bannerImage: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1600&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1626014303757-64669344464c?auto=format&fit=crop&w=1600&q=80",
    theme: {
      primary: "#285943",    // Forest Green
      accent: "#C49A54",     // Bamboo Gold
      bgSubtle: "#E9E4D5",   // Mist Cream
      dark: "#1D352A",       // Deep Green
      badgeBg: "rgba(40, 89, 67, 0.9)"
    },
    actionLabel: "Explore Assam",
    categories: ["Local Food", "Folk Culture", "Handicrafts", "Places and Nature"],
    specialities: [
      {
        id: "assam-food",
        category: "Local Food",
        title: "Indigenous Assamese Flavors",
        items: ["Khar", "Masor tenga", "Pitha"],
        description: "Digestive raw-papaya alkaline khar, fresh riverfish slow-poached in sour elephant-apple broth (masor tenga), and sesame-filled rice pithas.",
        image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
        actionType: "experience",
        targetId: "exp-assam-tea-tasting",
        filterCategory: "Local Food"
      },
      {
        id: "assam-folk",
        category: "Folk Culture",
        title: "Bihu Rhythms & Weaving",
        items: ["Bihu dance", "Bihu folk music", "Traditional weaving culture"],
        description: "Energetic spring festival steps accompanied by wild buffalo-horn Pepa melodies and heirloom frame-loom weaving in indigenous Mishing villages.",
        image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
        actionType: "experience",
        targetId: "exp-assam-bihu",
        filterCategory: "Folk Dance & Music"
      },
      {
        id: "assam-crafts",
        category: "Handicrafts",
        title: "Golden Silk & Bamboo Guilds",
        items: ["Muga silk", "Bamboo and cane crafts", "Traditional Assamese textiles"],
        description: "Gleaming golden wild silk that shines brighter with each wash, split-bamboo japi conical hats, and theatrical clay masks from Chamaguri Satra.",
        image: "https://images.unsplash.com/photo-1626014303757-64669344464c?auto=format&fit=crop&w=800&q=80",
        actionType: "experience",
        targetId: "exp-assam-mask-making",
        filterCategory: "Handicrafts & Workshops"
      },
      {
        id: "assam-places",
        category: "Places and Nature",
        title: "Rhino Reserves & Island Sanctuaries",
        items: ["Kaziranga National Park", "Majuli Island", "Assam's tea gardens"],
        description: "UNESCO-protected marshlands sheltering two-thirds of the world's great one-horned rhinos, the sacred riverine island of Majuli, and endless tea estates.",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
        actionType: "place",
        targetId: "majuli-island",
        filterCategory: "All Experiences"
      }
    ],
    natureAdventure: {
      title: "Kaziranga Grasslands & Brahmaputra River Expeditions",
      description: "Glide down the Brahmaputra at dawn to spot endangered Gangetic river dolphins, or take an open-top safari through the tall elephant grass of Kaziranga.",
      items: ["Kaziranga Central Range Rhino Safari", "Brahmaputra Sunset Dolphin Cruise", "Gibbon Wildlife Sanctuary Canopy Walk"],
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
    },
    travelInfo: {
      bestTimeToVisit: "November to April (national parks open, clear blue skies, pleasant temperatures)",
      weather: "Mild and pleasant (10°C - 25°C) with morning river mists",
      connectivity: "Lokpriya Gopinath Bordoloi International Airport, Guwahati (GAU), Jorhat (JRH); Guwahati railway terminus.",
      travelTips: [
        "Book Kaziranga morning elephant and jeep safari slots at least 3 weeks in advance.",
        "Respect the silence and sacred customs when visiting Vaishnavite Satra prayer halls in Majuli.",
        "Sample pure single-origin orthodox golden tea without milk or sugar."
      ]
    }
  }
];

export const MOCK_DESTINATIONS = [
  {
    id: "amber-fort",
    name: "Amber Fort & Rajput Royal Palace",
    state: "Rajasthan",
    stateId: "rajasthan",
    location: "Amer, Jaipur, Rajasthan, India",
    rating: 4.92,
    reviewsCount: 524,
    verifiedStatus: "UNESCO World Heritage Site",
    tagline: "Opulent yellow-sandstone ramparts, mirror palaces, and Maota lake vistas",
    heroImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Perched atop the rugged Cheel ka Teela (Hill of Eagles), Amber Fort is a masterpiece of Rajput architecture fused with delicate Mughal ornamentation. Built in red sandstone and white marble, its series of four courtyards culminates in the Sheesh Mahal (Mirror Palace), illuminated by thousands of convex glass inlays reflecting gentle candle flames.",
    highlights: [
      "Sheesh Mahal — Thousand-mirror hall reflecting starlight and oil lamps.",
      "Ganesh Pol gateway with exquisite fresco portraits in natural vegetable dyes.",
      "Panoramic views overlooking Maota Lake and the Aravalli defensive walls.",
      "Royal elephant pathway and stepwell tunnels leading to Jaigarh Fort."
    ],
    travelTips: [
      "Arrive early at 8:00 AM to explore the Diwan-e-Aam before peak mid-day heat.",
      "Evening sound & light show brings medieval Rajput folklore to life."
    ],
    openingHours: "08:00 AM – 06:00 PM (Daily)",
    entryFee: "₹100 (Indian Citizens) / ₹500 (Foreign Nationals)",
    bestVisitingTime: "October to March (Warm sunny days: 20°C – 28°C)",
    mapCoordinates: {
      lat: 26.9855,
      lng: 75.8513,
      elevation: "420m above sea level",
      nearestTransit: "Jaipur International Airport (22 km) / Jaipur Junction Railway (14 km)"
    },
    relatedExperiences: ["exp-raj-folk-dance", "exp-raj-dal-baati", "exp-raj-blue-pottery", "exp-raj-desert-safari"]
  },
  {
    id: "rann-of-kutch",
    name: "Great Rann of Kutch White Desert",
    state: "Gujarat",
    stateId: "gujarat",
    location: "Kutch District, Gujarat, India",
    rating: 4.89,
    reviewsCount: 412,
    verifiedStatus: "State Tourism Icon & Biosphere Reserve",
    tagline: "Ethereal glistening salt pans under infinite desert skylines",
    heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "The Great Rann of Kutch is one of the largest salt deserts in the world, spanning over 7,500 square kilometers. Under the full moon, the pristine white crystalline ground mirrors the sky in a surreal silvery luminescence. Nearby artisan hamlets like Nirona, Hodka, and Bhujodi preserve Rogan art, copper bell chime forging, and mirror-work embroidery.",
    highlights: [
      "Full moon night walks across the shimmering crystalline salt expanse.",
      "Rogan art demonstration in Nirona — the sole surviving family preserving this castor-oil technique.",
      "Traditional circular Bhunga mud houses with insulated thatch and mirror work.",
      "Flamingo sanctuary migration in the southern Kutch marshlands."
    ],
    travelTips: [
      "Inner Line Permit (ILP) is required for border area entry (can be easily obtained online).",
      "Carry polarized sunglasses and warm layers for chilly desert evenings."
    ],
    openingHours: "Open daily; best experienced during sunrise, sunset, and full moon hours",
    entryFee: "₹100 (Adults) / ₹50 (Children) + Vehicle permit fee",
    bestVisitingTime: "November to February (Rann Utsav season)",
    mapCoordinates: {
      lat: 23.8344,
      lng: 69.8354,
      elevation: "15m above sea level",
      nearestTransit: "Bhuj Airport & Railway Station (85 km)"
    },
    relatedExperiences: ["exp-guj-rann-walk", "exp-guj-garba", "exp-guj-patola-weaving", "exp-guj-thali"]
  },
  {
    id: "victoria-memorial",
    name: "Victoria Memorial & Heritage Enclave",
    state: "West Bengal",
    stateId: "west-bengal",
    location: "Queens Way, Maidan, Kolkata, West Bengal",
    rating: 4.88,
    reviewsCount: 680,
    verifiedStatus: "National Historic Monument",
    tagline: "Pristine Makrana white marble dome surrounded by sprawling green lawns",
    heroImage: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Constructed of the same white Makrana marble as the Taj Mahal, the Victoria Memorial stands at the heart of Kolkata's Maidan. Flanked by 64 acres of landscaped gardens, reflecting pools, and heritage bronze sculptures, it houses an extraordinary gallery of rare 18th-century Bengal school paintings, colonial manuscripts, and historical photography.",
    highlights: [
      "Royal Gallery featuring Thomas Daniell oil canvases and Mughal miniatures.",
      "Sprawling Maidan morning walks among carriage horses and banyan trees.",
      "Vintage tram ride from nearby Esplanade through historic tree-lined avenues.",
      "Cultural adda discussions at the heritage Kolkata Academy of Fine Arts."
    ],
    travelTips: [
      "Garden tickets are available separately from museum gallery admission.",
      "Pair with sunset tea at Princep Ghat overlooking the Vidyasagar Setu bridge."
    ],
    openingHours: "Gardens: 06:00 AM – 06:00 PM | Galleries: 10:00 AM – 05:00 PM (Closed Mondays)",
    entryFee: "₹50 (Indian Citizens) / ₹500 (Foreign Nationals) — Garden entry ₹20",
    bestVisitingTime: "October to March (Pleasant festive season, Durga Puja through winter)",
    mapCoordinates: {
      lat: 22.5448,
      lng: 88.3426,
      elevation: "9m above sea level",
      nearestTransit: "Rabindra Sadan Metro (800m) / Howrah Railway Junction (5 km)"
    },
    relatedExperiences: ["exp-bengal-culinary", "exp-bengal-kumartuli", "exp-bengal-tram", "exp-bengal-tea-plucking"]
  },
  {
    id: "majuli-island",
    name: "Majuli Riverine Heritage Island",
    state: "Assam",
    stateId: "assam",
    location: "Brahmaputra Basin, Jorhat, Assam",
    rating: 4.9,
    reviewsCount: 219,
    verifiedStatus: "UNESCO Tentative & Eco-Certified",
    tagline: "World's largest inhabited freshwater island and cradle of Neo-Vaishnavite culture",
    heroImage: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1626014303757-64669344464c?auto=format&fit=crop&w=800&q=80"
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
    relatedExperiences: ["exp-assam-tea-tasting", "exp-assam-bihu", "exp-assam-mask-making", "exp-assam-brahmaputra"]
  },
  {
    id: "orchha-heritage",
    name: "Orchha Heritage & River Sanctuary",
    state: "Madhya Pradesh",
    stateId: "madhya-pradesh",
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
      "Combine the light & sound show at Orchha Fort in the evening for rich Bundelkhand folklore."
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
  }
];

export const MOCK_EXPERIENCES = [
  // --- RAJASTHAN EXPERIENCES ---
  {
    id: "exp-raj-folk-dance",
    title: "Kalbeliya & Ghoomar Desert Folk Evening",
    category: "Folk Dance & Music",
    state: "Rajasthan",
    stateId: "rajasthan",
    location: "Sam Sand Dunes, Jaisalmer, Rajasthan",
    rating: 4.94,
    reviewsCount: 168,
    duration: "3 Hours",
    price: 1350,
    priceNote: "per guest (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Gulabo Bai Ensemble",
      role: "Kalbeliya Folk Master",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Royal Cultural Night",
    shortDescription: "Experience hypnotic swirling Kalbeliya dances, pulsating chang and dholak rhythms, and fireside desert poetry under the starry Thar sky.",
    highlights: ["Live acoustic Morchang and Kamaicha recitals", "Hands-on Ghoomar step introduction", "Traditional hot spiced chai around the dunes fire"]
  },
  {
    id: "exp-raj-dal-baati",
    title: "Royal Dal Baati Churma Kitchen Masterclass",
    category: "Local Food",
    state: "Rajasthan",
    stateId: "rajasthan",
    location: "Heritage Haveli, Old Jaipur, Rajasthan",
    rating: 4.91,
    reviewsCount: 132,
    duration: "3.5 Hours",
    price: 1100,
    priceNote: "per person (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Ranveer Singh Rathore",
      role: "Rajput Culinary Historian",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Royal Kitchen",
    shortDescription: "Learn to bake golden baatis over cow-dung ember hearths, slow-simmer five-lentil Panchmel dal, and hand-pound cardamom churma.",
    highlights: ["Heirloom royal spice blends on sil-batta", "Baking baatis in traditional earthen pots", "Communal royal thali lunch in courtyard"]
  },
  {
    id: "exp-raj-blue-pottery",
    title: "Sanganer Hand-Block Print & Blue Pottery Studio",
    category: "Handicrafts & Workshops",
    state: "Rajasthan",
    stateId: "rajasthan",
    location: "Sanganer Artisan Quarter, Jaipur",
    rating: 4.96,
    reviewsCount: 105,
    duration: "4 Hours",
    price: 1250,
    priceNote: "per guest (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Mohan Lal Prajapat",
      role: "National Awardee Craftsman",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Artisan Guild",
    shortDescription: "Carve wooden printing blocks, formulate cobalt blue glazes from quartz powder, and take home your personalized hand-printed cotton stole.",
    highlights: ["Quartz dough shaping without potter's wheel", "Natural indigo & madder root dye dipping", "Take home your custom printed scarf"]
  },
  {
    id: "exp-raj-desert-safari",
    title: "Thar Starlight Camel Caravan & Dunes Storytelling",
    category: "Nature & Adventure",
    state: "Rajasthan",
    stateId: "rajasthan",
    location: "Khuri Village, Thar Desert, Rajasthan",
    rating: 4.88,
    reviewsCount: 97,
    duration: "5 Hours",
    price: 1500,
    priceNote: "per person (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Devendra Singh",
      role: "Desert Pioneer & Elder",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Wilderness Heritage",
    shortDescription: "Trek gentle desert ridges on camel-back to non-commercial undulating sand dunes for sunset, followed by nomadic folklore around a tamarisk fire.",
    highlights: ["Silent non-commercial dunes away from jeep crowds", "Stargazing navigation using ancient desert celestial markers", "Fresh bajra roti and garlic chutney cooked over embers"]
  },

  // --- GUJARAT EXPERIENCES ---
  {
    id: "exp-guj-rann-walk",
    title: "White Rann Midnight Full Moon Walk",
    category: "Nature & Adventure",
    state: "Gujarat",
    stateId: "gujarat",
    location: "Dhordo Salt Edge, Great Rann of Kutch, Gujarat",
    rating: 4.97,
    reviewsCount: 154,
    duration: "3 Hours",
    price: 1400,
    priceNote: "per person (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Karanbhai Rabari",
      role: "Kutch Desert Naturalist",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Full Moon Special",
    shortDescription: "Walk onto the crystalline white salt desert as the moonlight transforms the landscape into an endless silver mirror.",
    highlights: ["Zero-light pollution celestial viewing", "Telescopic lunar observation", "Hot ginger tea served in clay kulhads on the salt flats"]
  },
  {
    id: "exp-guj-garba",
    title: "Kathiyawadi Folk Garba & Dandiya Workshop",
    category: "Festivals & Traditions",
    state: "Gujarat",
    stateId: "gujarat",
    location: "Law Garden Cultural Enclave, Ahmedabad, Gujarat",
    rating: 4.9,
    reviewsCount: 118,
    duration: "2.5 Hours",
    price: 850,
    priceNote: "per person (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Bhavik & Hetal Patel",
      role: "Folk Dance Choreographers",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Vibrant Tradition",
    shortDescription: "Master rhythmic 3-Taali Garba, Dodhiya spins, and resonant brass Dandiya beats accompanied by live shehnai and dhol players.",
    highlights: ["Handcrafted wood Dandiya sticks provided", "Traditional Kedia and Chaniya choli costume styling", "Step-by-step guidance for beginners"]
  },
  {
    id: "exp-guj-patola-weaving",
    title: "Patan Double-Ikat Patola Silk Weaving Masterclass",
    category: "Handicrafts & Workshops",
    state: "Gujarat",
    stateId: "gujarat",
    location: "Salvi Patola Lane, Patan, Gujarat",
    rating: 4.98,
    reviewsCount: 88,
    duration: "3.5 Hours",
    price: 1300,
    priceNote: "per guest (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Rohit Salvi",
      role: "Master Double-Ikat Weaver",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Heritage Masterclass",
    shortDescription: "Witness the mind-bending mathematical precision of double-warp and weft silk tie-dyeing practiced by only 4 families in the world.",
    highlights: ["Geometric knot tying on pure mulberry silk", "Natural turmeric, pomegranate rind & indigo vat demo", "Patan handloom trial experience"]
  },
  {
    id: "exp-guj-thali",
    title: "Heirloom Gujarati Thali & Farsan Culinary Journey",
    category: "Local Food",
    state: "Gujarat",
    stateId: "gujarat",
    location: "Old Heritage Quarter, Ahmedabad, Gujarat",
    rating: 4.93,
    reviewsCount: 172,
    duration: "3 Hours",
    price: 950,
    priceNote: "per person (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Savitaben Joshi",
      role: "Traditional Culinary Matriarch",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Authentic Flavors",
    shortDescription: "Taste sweet-and-sour dal, steaming spongy nylon khaman, hand-rolled theplas, and slow-cooked seasonal undhiyu with jalebis.",
    highlights: ["Live tempering of mustard and curry leaves on wood fire", "Seven-component farsan tasting", "Courtyard dining in 200-year-old wooden pol house"]
  },

  // --- WEST BENGAL EXPERIENCES ---
  {
    id: "exp-bengal-culinary",
    title: "Kolkata Heritage Adda & Street Food Trail",
    category: "Local Food",
    state: "West Bengal",
    stateId: "west-bengal",
    location: "College Street & North Kolkata, West Bengal",
    rating: 4.95,
    reviewsCount: 210,
    duration: "3.5 Hours",
    price: 900,
    priceNote: "per person (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Subir Mukherjee",
      role: "Literary Historian & Food Writer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Bestseller Walk",
    shortDescription: "Stroll colonial book market alleys, sipping lebu cha at Coffee House while tasting diamond fish fry, kathi rolls, and warm mishti doi.",
    highlights: ["Historical Coffee House intellectual adda table", "6 heritage culinary stops operating since 1910s", "Warm nolen gur sandesh tasting"]
  },
  {
    id: "exp-bengal-kumartuli",
    title: "Kumartuli Clay Idol Sculptors Guild Walk",
    category: "Handicrafts & Workshops",
    state: "West Bengal",
    stateId: "west-bengal",
    location: "Kumartuli Artisan Enclave, Kolkata, West Bengal",
    rating: 4.92,
    reviewsCount: 140,
    duration: "2.5 Hours",
    price: 800,
    priceNote: "per guest (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Bishnupada Pal",
      role: "Senior Clay Sculptor",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Artisan Enclave",
    shortDescription: "Walk narrow cobblestone lanes where fifth-generation idol makers sculpt divine figures from sacred Hooghly river clay and rice straw.",
    highlights: ["Witness the delicate Chakshu Daan (painting of eyes)", "Traditional jute and river clay armature techniques", "Open dialogue with studio sculptors"]
  },
  {
    id: "exp-bengal-tram",
    title: "Colonial Architecture & Heritage Tramway Odyssey",
    category: "Heritage & Cultural Walks",
    state: "West Bengal",
    stateId: "west-bengal",
    location: "Esplanade to Shyambazar, Kolkata, West Bengal",
    rating: 4.87,
    reviewsCount: 94,
    duration: "3 Hours",
    price: 750,
    priceNote: "per guest (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Debashis Banerjee",
      role: "Calcutta Tramways Enthusiast",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Vintage Heritage",
    shortDescription: "Ride Asia's oldest operating wooden electric tram through heritage corridors, discovering European colonnades and neoclassical mansions.",
    highlights: ["Reserved heritage wooden tram car journey", "Gothic High Court and Writers' Building walking stops", "Traditional terracotta kulhad tea stop"]
  },
  {
    id: "exp-bengal-tea-plucking",
    title: "Darjeeling Misty Tea Garden Tasting & Plucking",
    category: "Nature & Adventure",
    state: "West Bengal",
    stateId: "west-bengal",
    location: "Happy Valley Tea Estate, Darjeeling, West Bengal",
    rating: 4.96,
    reviewsCount: 165,
    duration: "4 Hours",
    price: 1350,
    priceNote: "per person (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Pemba Sherpa",
      role: "High-Altitude Tea Estate Guide",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Himalayan Aroma",
    shortDescription: "Trek steep emerald slopes overlooking Mount Kanchenjunga, pluck 'two leaves and a bud', and taste First Flush Muscatel black teas.",
    highlights: ["Traditional woven bamboo basket plucking demo", "Factory roller and oxidation chamber tour", "Sommelier tea cupping of 5 distinct flushes"]
  },

  // --- ASSAM EXPERIENCES ---
  {
    id: "exp-assam-tea-tasting",
    title: "Organic Assam CTC & Orthodox Tea Sommelier Session",
    category: "Local Food",
    state: "Assam",
    stateId: "assam",
    location: "Jorhat Tea Research Heritage Bungalow, Assam",
    rating: 4.93,
    reviewsCount: 122,
    duration: "3 Hours",
    price: 950,
    priceNote: "per person (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Bhaskar Barua",
      role: "Master Tea Blender & Sommelier",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Living Tradition",
    shortDescription: "Sample rich, malty golden-tipped orthodox black teas in a 19th-century colonial planter's stilted wooden chang-bungalow.",
    highlights: ["Tasting 6 single-estate single-origin teas", "Leaf rolling and roasting hands-on session", "Traditional Assamese pitha rice cakes served"]
  },
  {
    id: "exp-assam-bihu",
    title: "Bihu Folk Dance & Dhol Rhythm Masterclass",
    category: "Folk Dance & Music",
    state: "Assam",
    stateId: "assam",
    location: "Srimanta Sankaradeva Kalakshetra, Guwahati, Assam",
    rating: 4.91,
    reviewsCount: 98,
    duration: "2.5 Hours",
    price: 850,
    priceNote: "per guest (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Monika Saikia & Troupe",
      role: "Bihu Dance Virtuoso",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Rhythmic Celebrations",
    shortDescription: "Learn swift hand movements and graceful hip-swaying Bihu steps accompanied by the resonant beat of the wild buffalo-horn Pepa and Dhol.",
    highlights: ["Muga golden silk mekhela chador draping demonstration", "Traditional buffalo horn Pepa flute acoustic demo", "Energetic communal dance circle"]
  },
  {
    id: "exp-assam-mask-making",
    title: "Chamaguri Satra Bamboo & Clay Mask Guild",
    category: "Handicrafts & Workshops",
    state: "Assam",
    stateId: "assam",
    location: "Chamaguri Satra, Majuli Island, Assam",
    rating: 4.98,
    reviewsCount: 114,
    duration: "4 Hours",
    price: 1150,
    priceNote: "per guest (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1626014303757-64669344464c?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Kushakanta Goswami",
      role: "Sangeet Natak Akademi Awardee",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "UNESCO Heritage",
    shortDescription: "Shape mythical theatrical masks using bamboo splits, organic Brahmaputra river clay, cow dung, and natural earth pigments.",
    highlights: ["Artisan split-bamboo framework weaving", "Applying fine khadi cloth and mud slip coating", "Demonstration of animated jaw movement masks"]
  },
  {
    id: "exp-assam-brahmaputra",
    title: "Brahmaputra Dolphin & River Sanctuary Kayak Trail",
    category: "Nature & Adventure",
    state: "Assam",
    stateId: "assam",
    location: "Kaziranga River Confluence, Assam",
    rating: 4.89,
    reviewsCount: 82,
    duration: "3.5 Hours",
    price: 1450,
    priceNote: "per person (sample demo rate)",
    isDemo: true,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    host: {
      name: "Dipen Doley",
      role: "Indigenous Mishing River Guide",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    badge: "Eco Riverine",
    shortDescription: "Paddle tranquil tributaries of the Brahmaputra near Kaziranga to spot endangered freshwater Gangetic river dolphins and migratory water birds.",
    highlights: ["Stable tandem expedition kayaks with certified river marshals", "Freshwater dolphin surfacing lookout points", "Visit to a stilted Mishing riverine bamboo hamlet"]
  },

  // --- ORCHHA (ORIGINAL MOCK DATA PRESERVED) ---
  {
    id: "exp-food-walk",
    title: "Bundelkhand Local Food Walk",
    category: "Local Food",
    state: "Madhya Pradesh",
    stateId: "madhya-pradesh",
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
    category: "Folk Dance & Music",
    state: "Madhya Pradesh",
    stateId: "madhya-pradesh",
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
    category: "Handicrafts & Workshops",
    state: "Madhya Pradesh",
    stateId: "madhya-pradesh",
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
    id: "exp-nature-walk",
    title: "Guided Nature and Riverside Walk",
    category: "Nature & Adventure",
    state: "Madhya Pradesh",
    stateId: "madhya-pradesh",
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
  }
];
