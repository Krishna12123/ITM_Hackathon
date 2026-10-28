import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TripPlannerView from './components/TripPlannerView';
import GeneratingItineraryView from './components/GeneratingItineraryView';
import SmartItineraryView from './components/SmartItineraryView';
import RouteMapBudgetView from './components/RouteMapBudgetView';
import Footer from './components/Footer';

export default function App() {
  const [currentView, setCurrentView] = useState('planner');

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      {/* Exact Stitch Header */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main View Router */}
      <div className="flex-1 w-full">
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
      </div>

      {/* Exact Stitch Footer */}
      <Footer />
    </div>
  );
}
