import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TripPlannerView from './components/TripPlannerView';
import GeneratingItineraryView from './components/GeneratingItineraryView';
import SmartItineraryView from './components/SmartItineraryView';
import RouteMapBudgetView from './components/RouteMapBudgetView';
import ExperiencesPage from './pages/ExperiencesPage';
import PlaceDetailsPage from './pages/PlaceDetailsPage';
import ContributionFormPage from './pages/ContributionFormPage';
import ProfilePage from './pages/ProfilePage';
import TripDrawer from './components/TripDrawer';
import Footer from './components/Footer';

const PATH_TO_VIEW = {
  '/': 'experiences',
  '/experiences': 'experiences',
  '/place-details': 'place-details',
  '/planner': 'planner',
  '/generating': 'generating',
  '/itinerary': 'itinerary',
  '/route-budget': 'route_budget',
  '/route_budget': 'route_budget',
  '/contribute': 'contribute',
  '/profile': 'profile',
};

const VIEW_TO_PATH = {
  'experiences': '/experiences',
  'place-details': '/place-details',
  'planner': '/planner',
  'generating': '/generating',
  'itinerary': '/itinerary',
  'route_budget': '/route-budget',
  'contribute': '/contribute',
  'profile': '/profile',
};

function getViewFromPath() {
  if (typeof window === 'undefined') return 'experiences';
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  return PATH_TO_VIEW[path] || 'experiences';
}

export default function App() {
  const [currentView, setCurrentViewState] = useState(getViewFromPath);

  const setCurrentView = (target) => {
    const viewId = PATH_TO_VIEW[target] || target;
    const path = VIEW_TO_PATH[viewId] || (target.startsWith('/') ? target : `/${target}`);

    if (window.location.pathname !== path) {
      window.history.pushState({ view: viewId }, '', path);
    }
    setCurrentViewState(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentViewState(getViewFromPath());
    };

    window.addEventListener('popstate', handlePopState);

    // If initial landing was root '/', sync browser address bar to '/experiences'
    if (window.location.pathname === '/' || !window.location.pathname) {
      window.history.replaceState({ view: 'experiences' }, '', '/experiences');
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  // Trip Items State
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

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-slideDown">
          <div className="bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-lg shadow-level-3 border border-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Shared Header Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenTrip={() => setIsTripDrawerOpen(true)}
        tripCount={tripItems.length}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {/* Bhavna's Modules */}
        {currentView === 'experiences' && (
          <ExperiencesPage
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            tripItems={tripItems}
            onToggleTrip={handleToggleTrip}
          />
        )}
        {currentView === 'place-details' && (
          <PlaceDetailsPage
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            tripItems={tripItems}
            onToggleTrip={handleToggleTrip}
            onNavigateToExperiences={() => setCurrentView('experiences')}
          />
        )}
        {currentView === 'contribute' && (
          <ContributionFormPage
            onCancel={() => setCurrentView('experiences')}
            onShowToast={showToast}
          />
        )}
        {currentView === 'profile' && (
          <ProfilePage
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            tripItems={tripItems}
            onToggleTrip={handleToggleTrip}
            onNavigateToPlace={() => setCurrentView('place-details')}
            onNavigateToExperiences={() => setCurrentView('experiences')}
            onShowToast={showToast}
          />
        )}

        {/* Team Planner Views */}
        {currentView === 'planner' && (
          <TripPlannerView onNavigate={setCurrentView} />
        )}
        {currentView === 'generating' && (
          <GeneratingItineraryView onNavigate={setCurrentView} />
        )}
        {currentView === 'itinerary' && (
          <SmartItineraryView onNavigate={setCurrentView} />
        )}
        {currentView === 'route_budget' && (
          <RouteMapBudgetView onNavigate={setCurrentView} />
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
