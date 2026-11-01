import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ExperiencesPage from './pages/ExperiencesPage';
import ExplorePage from './pages/ExplorePage';
import PlaceDetailsPage from './pages/PlaceDetailsPage';
import ContributionFormPage from './pages/ContributionFormPage';
import ProfilePage from './pages/ProfilePage';
import StateDestinationPage from './pages/StateDestinationPage';
import TripPlannerView from './components/TripPlannerView';
import GeneratingItineraryView from './components/GeneratingItineraryView';
import SmartItineraryView from './components/SmartItineraryView';
import RouteMapBudgetView from './components/RouteMapBudgetView';
import TripDrawer from './components/TripDrawer';
import Footer from './components/Footer';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDestinationId, setSelectedDestinationId] = useState('amber-fort');
  const [selectedStateId, setSelectedStateId] = useState('rajasthan');

  // Wishlist / Favorites persisted in browser localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('yatrasaathi_wishlist');
      return saved ? JSON.parse(saved) : ['exp-pottery', 'orchha-heritage'];
    } catch (e) {
      return ['exp-pottery', 'orchha-heritage'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('yatrasaathi_wishlist', JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  const [tripItems, setTripItems] = useState([
    {
      id: 'exp-food-walk',
      title: 'Bundelkhand Local Food Walk',
      category: 'Local Food',
      price: 850,
      duration: '3.5 Hours',
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80'
    }
  ]);
  const [isTripDrawerOpen, setIsTripDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Show Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Toggle Favorite / Wishlist Bookmark with duplicate prevention
  const handleToggleFavorite = (id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        showToast('Removed from your Wishlist');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Saved to your Wishlist! 🔖');
        return Array.from(new Set([...prev, id]));
      }
    });
  };

  // Toggle Trip Item
  const handleToggleTrip = (item) => {
    setTripItems((prev) => {
      const exists = prev.some((t) => t.id === item.id);
      if (exists) {
        showToast(`Removed "${item.title || item.name}" from your trip`);
        return prev.filter((t) => t.id !== item.id);
      } else {
        showToast(`Added "${item.title || item.name}" to your trip plan! 🎒`);
        return [...prev, item];
      }
    });
  };

  // Remove Trip Item from Drawer
  const handleRemoveTripItem = (id) => {
    setTripItems((prev) => prev.filter((t) => t.id !== id));
    showToast('Item removed from trip');
  };

  // Clear Trip
  const handleClearTrip = () => {
    setTripItems([]);
    showToast('Trip itinerary cleared');
  };

  // Navigation handlers with URL history push
  const navigateToState = (stateId) => {
    setSelectedStateId(stateId);
    setActiveTab('state-details');
    window.history.pushState({ tab: 'state-details', stateId }, '', `/explore/${stateId}`);
  };

  const navigateToPlace = (destId) => {
    if (destId) setSelectedDestinationId(destId);
    setActiveTab('place-details');
    window.history.pushState({ tab: 'place-details', destId }, '', '/place-details');
  };

  const navigateToExplore = () => {
    setActiveTab('explore');
    window.history.pushState({ tab: 'explore' }, '', '/explore');
  };

  const navigateToHome = () => {
    setActiveTab('home');
    window.history.pushState({ tab: 'home' }, '', '/');
  };

  const handleTabChange = (tab) => {
    let targetTab = tab;
    if (tab === 'home') targetTab = 'home';
    if (tab === 'explore') targetTab = 'explore';
    if (tab === 'experiences') targetTab = 'experiences';
    if (tab === 'route-budget') targetTab = 'route_budget';

    setActiveTab(targetTab);
    if (targetTab === 'home') {
      window.history.pushState({ tab: 'home' }, '', '/');
    } else if (targetTab === 'explore') {
      window.history.pushState({ tab: 'explore' }, '', '/explore');
    } else if (targetTab === 'experiences') {
      window.history.pushState({ tab: 'experiences' }, '', '/experiences');
    } else if (targetTab === 'place-details') {
      window.history.pushState({ tab: 'place-details' }, '', '/place-details');
    } else if (targetTab === 'contribute') {
      window.history.pushState({ tab: 'contribute' }, '', '/contribute');
    } else if (targetTab === 'profile') {
      window.history.pushState({ tab: 'profile' }, '', '/profile');
    } else if (targetTab === 'planner') {
      window.history.pushState({ tab: 'planner' }, '', '/planner');
    } else if (targetTab === 'generating') {
      window.history.pushState({ tab: 'generating' }, '', '/generating');
    } else if (targetTab === 'itinerary') {
      window.history.pushState({ tab: 'itinerary' }, '', '/itinerary');
    } else if (targetTab === 'route_budget') {
      window.history.pushState({ tab: 'route_budget' }, '', '/route-budget');
    }
  };

  // Global Scroll Restoration: Reset to top on any page, route, or target change
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, [activeTab, selectedStateId, selectedDestinationId]);

  // Browser route synchronization on load and on popstate (browser back/forward)
  useEffect(() => {
    const syncRouteFromUrl = () => {
      const path = window.location.pathname.toLowerCase();
      const validStates = [
        'rajasthan',
        'gujarat',
        'west-bengal',
        'assam',
        'kerala',
        'himachal-pradesh',
        'madhya-pradesh',
        'goa'
      ];

      // Match /explore/:stateId
      const exploreMatch = path.match(/^\/explore\/([a-z-]+)\/?$/);
      if (exploreMatch && validStates.includes(exploreMatch[1])) {
        setSelectedStateId(exploreMatch[1]);
        setActiveTab('state-details');
        return;
      }

      if (path === '/' || path === '') {
        setActiveTab('home');
        return;
      }

      if (path === '/explore' || path === '/explore/') {
        setActiveTab('explore');
        return;
      }

      if (path.startsWith('/experiences')) {
        setActiveTab('experiences');
        return;
      }

      if (path.startsWith('/place-details') || path.startsWith('/places')) {
        setActiveTab('place-details');
      } else if (path.startsWith('/planner')) {
        setActiveTab('planner');
      } else if (path.startsWith('/generating')) {
        setActiveTab('generating');
      } else if (path.startsWith('/itinerary')) {
        setActiveTab('itinerary');
      } else if (path.startsWith('/route-budget') || path.startsWith('/route_budget')) {
        setActiveTab('route_budget');
      } else if (path.startsWith('/contribute')) {
        setActiveTab('contribute');
      } else if (path.startsWith('/profile')) {
        setActiveTab('profile');
      } else {
        setActiveTab('home');
      }
    };

    syncRouteFromUrl();
    window.addEventListener('popstate', syncRouteFromUrl);
    return () => window.removeEventListener('popstate', syncRouteFromUrl);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8EF] font-sans text-[#38291F]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-slideDown">
          <div className="bg-[#38291F] text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-lg shadow-level-3 border border-[#38291F]/40 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#F36B21] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab === 'state-details' ? 'explore' : activeTab}
        setActiveTab={handleTabChange}
        tripItems={tripItems}
        favoritesCount={favorites.length}
        onOpenTrip={() => setIsTripDrawerOpen(true)}
      />

      {/* Dynamic View rendering assigned modules */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && (
          <HomePage
            onNavigateToState={navigateToState}
            onNavigateToPlace={navigateToPlace}
            onNavigate={handleTabChange}
          />
        )}
        {activeTab === 'state-details' && (
          <StateDestinationPage
            stateId={selectedStateId}
            onBackToExplore={navigateToExplore}
            onNavigateToPlace={navigateToPlace}
            onSelectOtherState={(stId) => {
              navigateToState(stId);
            }}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            tripItems={tripItems}
            onToggleTrip={handleToggleTrip}
          />
        )}
        {activeTab === 'explore' && (
          <ExplorePage
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            tripItems={tripItems}
            onToggleTrip={handleToggleTrip}
            onNavigateToPlace={navigateToPlace}
            onNavigateToState={navigateToState}
            onNavigate={handleTabChange}
          />
        )}
        {activeTab === 'experiences' && (
          <ExperiencesPage
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            tripItems={tripItems}
            onToggleTrip={handleToggleTrip}
            onNavigateToPlace={navigateToPlace}
            onNavigateToState={navigateToState}
            onNavigate={handleTabChange}
          />
        )}
        {activeTab === 'place-details' && (
          <PlaceDetailsPage
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            tripItems={tripItems}
            onToggleTrip={handleToggleTrip}
            selectedDestinationId={selectedDestinationId}
            onSelectDestination={setSelectedDestinationId}
            onNavigateToExperiences={navigateToExplore}
          />
        )}
        {activeTab === 'contribute' && (
          <ContributionFormPage
            onCancel={navigateToExplore}
            onShowToast={showToast}
          />
        )}
        {activeTab === 'profile' && (
          <ProfilePage
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            tripItems={tripItems}
            onToggleTrip={handleToggleTrip}
            onNavigateToPlace={navigateToPlace}
            onNavigateToExperiences={navigateToExplore}
            onShowToast={showToast}
          />
        )}

        {/* Teammate Expedition & Itinerary Views */}
        {activeTab === 'planner' && (
          <TripPlannerView onNavigate={handleTabChange} />
        )}
        {activeTab === 'generating' && (
          <GeneratingItineraryView onNavigate={handleTabChange} />
        )}
        {activeTab === 'itinerary' && (
          <SmartItineraryView onNavigate={handleTabChange} />
        )}
        {activeTab === 'route_budget' && (
          <RouteMapBudgetView onNavigate={handleTabChange} />
        )}
      </main>

      {/* Trip Drawer */}
      <TripDrawer
        isOpen={isTripDrawerOpen}
        onClose={() => setIsTripDrawerOpen(false)}
        tripItems={tripItems}
        onRemoveItem={handleRemoveTripItem}
        onClearTrip={handleClearTrip}
      />

      {/* Teammate Footer */}
      <Footer />
    </div>
  );
}
