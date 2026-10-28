import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Car, 
  Train, 
  Footprints, 
  Map as MapIcon, 
  AlertCircle,
  Locate,
  Loader2,
  RotateCcw,
  AlertTriangle,
  X,
  Info,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { calculateRoute, ROUTING_CONFIG, buildGoogleMapsDirectionsUrl } from '../services/routingService';

/**
 * RouteMap — Reusable Interactive Map & Navigation Component
 * 
 * Features:
 * - Leaflet map with OpenStreetMap compliant tiles and attribution
 * - Verified destination marker and rich details popup
 * - User current-location detection with distinct pulsing marker
 * - Real road route geometry rendering (never straight lines)
 * - Distance and estimated duration display with units and non-traffic disclaimers
 * - Driving, Walking, and Transit mode selector
 * - Configurable routing provider architecture (OSRM driving default)
 * - Keyless Google Maps Directions universal URL generator
 * - Complete loading, error, unsupported mode, and empty states
 */
export default function RouteMap({ destination }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const destMarkerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const activeAbortControllerRef = useRef(null);

  // Extract destination coordinates, name, address, elevation, and transit info
  const coords = destination?.mapCoordinates;
  const dLat = typeof coords?.lat === 'number' ? coords.lat : parseFloat(coords?.lat);
  const dLng = typeof coords?.lng === 'number' ? coords.lng : parseFloat(coords?.lng);
  const destinationName = destination?.name || 'Selected Destination';
  const destinationAddress = destination?.location || '';
  const hasValidCoords = !isNaN(dLat) && !isNaN(dLng) && dLat !== 0 && dLng !== 0;

  // Transient state for user geolocation (never persisted or sent to external trackers)
  const [userCoords, setUserCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Travel Mode selection: 'driving' | 'walking' | 'transit'
  const [selectedTravelMode, setSelectedTravelMode] = useState('driving');

  // Route lifecycle states: 'IDLE' | 'LOADING' | 'SUCCESS' | 'NO_ROUTE' | 'NETWORK_ERROR' | 'UNSUPPORTED_MODE'
  const [routeStatus, setRouteStatus] = useState('IDLE');
  const [routeData, setRouteData] = useState(null);
  const [routeErrorMessage, setRouteErrorMessage] = useState(null);

  // Distinct marker icon for the user's current location (Pulsing Blue Radar Dot)
  const userLocationIcon = useMemo(() => {
    return L.divIcon({
      className: 'yatra-user-location-marker',
      html: `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          <div style="
            position: absolute;
            inset: -3px;
            border-radius: 50%;
            background: rgba(37, 99, 235, 0.28);
            border: 1px solid rgba(37, 99, 235, 0.5);
            animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            position: relative;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background-color: #2563EB;
            border: 3px solid #FFFFFF;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="width: 6px; height: 6px; border-radius: 50%; background-color: #FFFFFF;"></div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18]
    });
  }, []);

  // Destination custom marker icon (YatraSaathi Signature Terracotta Orange #EA580C)
  const destMarkerIcon = useMemo(() => {
    return L.divIcon({
      className: 'yatra-dest-marker',
      html: `
        <div style="
          background-color: #EA580C;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.4), 0 2px 4px rgba(0,0,0,0.2);
          border: 2.5px solid #FFFFFF;
          cursor: pointer;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -34]
    });
  }, []);

  // 1. Clear active route layer helper
  const clearRouteLayer = useCallback(() => {
    const map = mapInstanceRef.current;
    if (map && routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
  }, []);

  // 2. Request and Render Route from Configurable Provider
  const requestRoute = useCallback(async (originCoords, mode) => {
    const map = mapInstanceRef.current;
    if (!map || !hasValidCoords || !originCoords) return;

    // Abort in-flight requests to respect provider limits and prevent stale race conditions
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    activeAbortControllerRef.current = abortController;

    clearRouteLayer();
    setRouteStatus('LOADING');
    setRouteData(null);
    setRouteErrorMessage(null);

    // Explicit handling for unsupported modes (e.g. Walking and Transit with OSRM)
    // Avoids drawing synthetic straight lines and clearly informs the user
    if (mode === 'walking' || mode === 'transit') {
      const unsupportedMsg = ROUTING_CONFIG.supportedModes[mode]?.unsupportedMessage;
      setRouteStatus('UNSUPPORTED_MODE');
      setRouteErrorMessage(unsupportedMsg);
      map.fitBounds([[originCoords.lat, originCoords.lng], [dLat, dLng]], { padding: [45, 45], maxZoom: 15 });
      return;
    }

    const result = await calculateRoute({
      origin: originCoords,
      destination: { lat: dLat, lng: dLng },
      mode,
      signal: abortController.signal
    });

    if (result.status === 'ABORTED') return;

    if (result.status === 'SUCCESS') {
      setRouteStatus('SUCCESS');
      setRouteData(result);

      // Draw real returned road geometry as Leaflet polyline (never a straight line!)
      const polyline = L.polyline(result.latLngs, {
        color: '#0F766E', // Tertiary deep teal
        weight: 5,
        opacity: 0.88,
        lineJoin: 'round'
      }).addTo(map);

      routeLayerRef.current = polyline;

      // Fit map viewport to comfortably frame the complete route
      map.fitBounds(polyline.getBounds(), { padding: [45, 45] });
    } else if (result.status === 'NO_ROUTE') {
      setRouteStatus('NO_ROUTE');
      setRouteErrorMessage(result.message);
      // Fit both origin and destination without drawing a straight line
      map.fitBounds([[originCoords.lat, originCoords.lng], [dLat, dLng]], { padding: [45, 45], maxZoom: 15 });
    } else if (result.status === 'NETWORK_ERROR') {
      setRouteStatus('NETWORK_ERROR');
      setRouteErrorMessage(result.message);
      map.fitBounds([[originCoords.lat, originCoords.lng], [dLat, dLng]], { padding: [45, 45], maxZoom: 15 });
    } else {
      setRouteStatus('NO_ROUTE');
      setRouteErrorMessage(result.message || 'Route could not be calculated.');
      map.fitBounds([[originCoords.lat, originCoords.lng], [dLat, dLng]], { padding: [45, 45], maxZoom: 15 });
    }
  }, [hasValidCoords, dLat, dLng, clearRouteLayer]);

  // 3. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || !hasValidCoords) return;

    // Clean up previous instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [dLat, dLng],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true
    });

    mapInstanceRef.current = map;

    // Compliant OpenStreetMap tile provider with required attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Destination Marker with Rich Popup
    const marker = L.marker([dLat, dLng], { icon: destMarkerIcon }).addTo(map);
    destMarkerRef.current = marker;

    const popupContent = `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px 2px; min-width: 170px;">
        <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #EA580C; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">
          Verified Destination
        </span>
        <h4 style="font-size: 13px; font-weight: 700; color: #0F172A; margin: 0 0 3px 0; line-height: 1.3;">
          ${destinationName}
        </h4>
        <p style="font-size: 11px; color: #64748B; margin: 0 0 6px 0; line-height: 1.3;">
          ${destinationAddress}
        </p>
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; border-top: 1px solid #E2E8F0; padding-top: 4px;">
          <span style="font-weight: 700; color: #F59E0B;">★ ${destination?.rating || '4.8'}</span>
          <span style="color: #64748B;">Alt: ${coords?.elevation || 'Sea level'}</span>
        </div>
      </div>
    `;
    marker.bindPopup(popupContent);

    // Re-plot user marker & recalculate route if user location was previously granted
    if (userCoords) {
      const uMarker = L.marker([userCoords.lat, userCoords.lng], { icon: userLocationIcon }).addTo(map);
      uMarker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; padding: 2px;">
          <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #2563EB; display: block; margin-bottom: 2px;">
            Your Current Location
          </span>
          <span style="font-size: 11px; color: #475569; font-family: monospace;">
            ${userCoords.lat.toFixed(4)}° N, ${userCoords.lng.toFixed(4)}° E
          </span>
        </div>
      `);
      userMarkerRef.current = uMarker;
      requestRoute(userCoords, selectedTravelMode);
    }

    // Invalidate map size on mount & on window resize / orientation change
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (activeAbortControllerRef.current) {
        activeAbortControllerRef.current.abort();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [dLat, dLng, destinationName, destinationAddress, destination?.rating, coords?.elevation, hasValidCoords, destMarkerIcon, userLocationIcon]);

  // 4. Geolocation Action: "Use My Current Location"
  const handleGetLocation = () => {
    setLocationError(null);

    // Check browser Geolocation API support
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported by your current browser.');
      return;
    }

    // Inform user if protocol is insecure (browser geolocation requires HTTPS or localhost)
    if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      setLocationError('Browser geolocation requires a secure HTTPS connection or localhost environment.');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const newCoords = { lat: userLat, lng: userLng };

        setUserCoords(newCoords);

        const map = mapInstanceRef.current;
        if (!map) return;

        // Clean up previous marker if present
        if (userMarkerRef.current) {
          map.removeLayer(userMarkerRef.current);
          userMarkerRef.current = null;
        }

        // Add visually distinct user location marker
        const uMarker = L.marker([userLat, userLng], { icon: userLocationIcon }).addTo(map);
        uMarker.bindPopup(`
          <div style="font-family: 'Inter', sans-serif; padding: 2px;">
            <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #2563EB; display: block; margin-bottom: 2px;">
              Your Current Location
            </span>
            <span style="font-size: 11px; color: #475569; font-family: monospace;">
              ${userLat.toFixed(4)}° N, ${userLng.toFixed(4)}° E
            </span>
          </div>
        `);
        userMarkerRef.current = uMarker;

        // Calculate route if destination coordinates exist
        if (hasValidCoords) {
          requestRoute(newCoords, selectedTravelMode);
        } else {
          map.setView([userLat, userLng], 14);
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              'Location permission was denied. Please allow location access in your browser settings to calculate routes from your position, or use Google Maps Directions below.'
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError(
              'Location information is currently unavailable. Please verify your GPS or network connectivity.'
            );
            break;
          case error.TIMEOUT:
            setLocationError(
              'Location request timed out. Please click the button to try again.'
            );
            break;
          default:
            setLocationError('An unexpected error occurred while detecting your current location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 // Fresh GPS reading, no stale caching
      }
    );
  };

  // 5. Handle Travel Mode Change
  const handleModeChange = (mode) => {
    setSelectedTravelMode(mode);
    if (userCoords && hasValidCoords) {
      requestRoute(userCoords, mode);
    }
  };

  // 6. Reset Location & Map View
  const handleClearLocation = () => {
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
    }

    setUserCoords(null);
    setRouteStatus('IDLE');
    setRouteData(null);
    setRouteErrorMessage(null);
    setLocationError(null);

    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    clearRouteLayer();

    if (hasValidCoords) {
      map.setView([dLat, dLng], 14);
    }
  };

  // 7. Dynamic Google Maps Directions URL (URL & URLSearchParams, api=1, mode, origin when granted)
  const googleMapsDirectionsUrl = useMemo(() => {
    return buildGoogleMapsDirectionsUrl({
      destination,
      origin: userCoords,
      travelMode: selectedTravelMode
    });
  }, [destination, userCoords, selectedTravelMode]);

  return (
    <section aria-labelledby="location-directions-heading" className="bg-card rounded-xl overflow-hidden border border-border-subtle shadow-level-1 space-y-0">
      {/* 1. SECTION HEADER: "Location & Directions" */}
      <div className="p-4 sm:p-5 border-b border-border-subtle bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h2 id="location-directions-heading" className="font-display font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
              Location & Directions
            </h2>
          </div>
          <p className="text-xs text-slate-500 pl-9">
            Explore destination geography, detect starting origin, and preview verified route geometry.
          </p>
        </div>

        {/* Status Badge & Reset Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto pl-9 sm:pl-0">
          {userCoords && (
            <button
              type="button"
              onClick={handleClearLocation}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-2.5 py-1 rounded-full border border-border-subtle shadow-xs transition-colors"
              title="Clear detected location and route"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset View</span>
            </button>
          )}

          {hasValidCoords ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-tertiary bg-tertiary/10 px-2.5 py-0.5 rounded-full shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
              GPS Ready
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full shrink-0">
              No Coordinates
            </span>
          )}
        </div>
      </div>

      {/* 2. GEOLOCATION ALERT BANNER (Denied, Timeout, Unavailable, Insecure) */}
      {locationError && (
        <div className="p-3.5 bg-red-50 border-b border-red-200 text-red-900 text-xs flex items-start justify-between gap-2.5 animate-fadeIn">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{locationError}</p>
          </div>
          <button
            type="button"
            onClick={() => setLocationError(null)}
            className="text-red-500 hover:text-red-700 p-0.5 shrink-0"
            aria-label="Dismiss location alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. STATE: UNSUPPORTED MODE NOTICE (Walking / Transit with Road Engine) */}
      {routeStatus === 'UNSUPPORTED_MODE' && routeErrorMessage && (
        <div className="p-3.5 bg-blue-50/95 border-b border-blue-200 text-blue-900 text-xs flex items-start justify-between gap-2.5 animate-fadeIn">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-blue-950 block">Specialized Navigation Required</span>
              <p className="leading-relaxed text-blue-800">{routeErrorMessage}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setRouteStatus('IDLE')}
            className="text-blue-500 hover:text-blue-700 p-0.5 shrink-0"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4. STATE: NO ROUTE FOUND NOTICE */}
      {routeStatus === 'NO_ROUTE' && routeErrorMessage && (
        <div className="p-3.5 bg-amber-50/95 border-b border-amber-200 text-amber-900 text-xs flex items-start justify-between gap-2.5 animate-fadeIn">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-950 block">No Contiguous Road Route</span>
              <p className="leading-relaxed text-amber-800">{routeErrorMessage}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setRouteStatus('IDLE')}
            className="text-amber-500 hover:text-amber-700 p-0.5 shrink-0"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 5. STATE: NETWORK / TIMEOUT ERROR NOTICE */}
      {routeStatus === 'NETWORK_ERROR' && routeErrorMessage && (
        <div className="p-3.5 bg-red-50 border-b border-red-200 text-red-900 text-xs flex items-start justify-between gap-2.5 animate-fadeIn">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-red-950 block">Routing Service Connection Error</span>
              <p className="leading-relaxed text-red-800">{routeErrorMessage}</p>
              <button
                type="button"
                onClick={() => userCoords && requestRoute(userCoords, selectedTravelMode)}
                className="text-xs font-bold text-red-700 hover:underline inline-flex items-center gap-1 pt-0.5"
              >
                <span>Retry calculation</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setRouteStatus('IDLE')}
            className="text-red-500 hover:text-red-700 p-0.5 shrink-0"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 6. INTERACTIVE MAP CONTAINER OR GRACEFUL EMPTY STATE */}
      {hasValidCoords ? (
        <div className="relative w-full h-72 sm:h-80 md:h-96 bg-slate-100 z-0">
          <div
            ref={mapContainerRef}
            className="w-full h-full"
            style={{ minHeight: '288px' }}
          />

          {/* Floating Action: Use My Current Location Button */}
          <div className="absolute top-3 right-3 z-[1000]">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isLocating}
              className={`px-3 py-2 rounded-xl text-xs font-bold shadow-level-2 border transition-all flex items-center gap-1.5 active:scale-95 ${
                userCoords
                  ? "bg-blue-600 text-white border-blue-700 hover:bg-blue-700"
                  : "bg-white/95 hover:bg-white text-slate-800 hover:text-primary border-slate-200/90 backdrop-blur-md"
              } ${isLocating ? 'opacity-80 cursor-wait' : ''}`}
              title="Detect my current location via browser GPS"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  <span>Locating…</span>
                </>
              ) : (
                <>
                  <Locate className={`w-3.5 h-3.5 ${userCoords ? 'text-white' : 'text-primary'}`} />
                  <span>{userCoords ? 'Update Location' : 'Use Current Location'}</span>
                </>
              )}
            </button>
          </div>

          {/* Floating Loading Route Overlay */}
          {routeStatus === 'LOADING' && (
            <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-level-2 border border-slate-700">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Calculating road route via {ROUTING_CONFIG.providerName}…</span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-subtle/50 flex flex-col items-center justify-center space-y-2.5 min-h-[220px]">
          <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-sm text-slate-900">
            Coordinates Unavailable
          </h3>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            Geographic coordinates are currently not defined for {destinationName}. You can still use the Google Maps Directions button below with the registered location name.
          </p>
        </div>
      )}

      {/* 7. STATE: SUCCESS — ROUTE DETAILS CARD WITH METRICS & DISCLAIMERS */}
      {routeStatus === 'SUCCESS' && routeData && (
        <div className="bg-emerald-50/90 border-t border-b border-emerald-200 p-4 space-y-2 text-xs text-emerald-950 animate-fadeIn">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-base text-emerald-950 leading-tight">
                    {routeData.formattedDistance}
                  </span>
                  <span className="text-emerald-700">•</span>
                  <span className="font-display font-bold text-base text-emerald-950 leading-tight">
                    {routeData.formattedDuration}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-800 font-medium">
                  Verified road route ({routeData.mode})
                </span>
              </div>
            </div>

            <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-200/70 border border-emerald-300/80 px-2 py-0.5 rounded-md shrink-0">
              Road Geometry Loaded
            </span>
          </div>

          {/* Factual Disclaimer (Does not imply live traffic) */}
          <div className="pt-2 border-t border-emerald-200/70 text-[10px] text-emerald-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-1 leading-normal">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-700 shrink-0" />
              <span>{routeData.disclaimer}</span>
            </span>
            <span className="text-emerald-700/80">{routeData.attribution}</span>
          </div>
        </div>
      )}

      {/* 8. STARTING-POINT & DESTINATION CONTEXT CARD */}
      <div className="bg-slate-900 text-white p-3.5 px-4 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-slate-800">
        {/* Origin Info */}
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
            <Locate className="w-3 h-3" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Starting Origin
            </span>
            <span className="text-slate-200 font-medium truncate block">
              {userCoords
                ? `${userCoords.lat.toFixed(4)}° N, ${userCoords.lng.toFixed(4)}° E (GPS)`
                : 'Current device location (via Google Maps)'}
            </span>
          </div>
        </div>

        {/* Destination Info */}
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-3 h-3" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Destination
            </span>
            <span className="text-slate-200 font-medium truncate block">
              {destinationName} {hasValidCoords ? `(${dLat.toFixed(2)}, ${dLng.toFixed(2)})` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* 9. CONTROLS, TRAVEL-MODE SELECTOR, & PROMINENT GOOGLE MAPS BUTTON */}
      <div className="p-4 sm:p-5 bg-white text-xs text-slate-700 space-y-4">
        {/* Travel Mode Selector: Driving, Walking, Transit */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Select Travel Mode
            </span>
            {userCoords && routeStatus === 'LOADING' && (
              <span className="text-[10px] font-semibold text-primary flex items-center gap-1">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                Calculating…
              </span>
            )}
            {userCoords && routeStatus === 'SUCCESS' && (
              <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Route active
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Travel mode selector">
            {/* Driving Mode Button */}
            <button
              type="button"
              onClick={() => handleModeChange('driving')}
              disabled={routeStatus === 'LOADING'}
              className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                selectedTravelMode === 'driving'
                  ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary/30'
                  : 'border-border-subtle hover:border-slate-300 bg-white text-slate-700'
              }`}
              title="Driving road route (OSRM embedded)"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Driving</span>
            </button>

            {/* Walking Mode Button */}
            <button
              type="button"
              onClick={() => handleModeChange('walking')}
              disabled={routeStatus === 'LOADING'}
              className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                selectedTravelMode === 'walking'
                  ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary/30'
                  : 'border-border-subtle hover:border-slate-300 bg-white text-slate-700'
              }`}
              title="Walking pedestrian pathways (via Google Maps)"
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Walking</span>
            </button>

            {/* Transit Mode Button */}
            <button
              type="button"
              onClick={() => handleModeChange('transit')}
              disabled={routeStatus === 'LOADING'}
              className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                selectedTravelMode === 'transit'
                  ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary/30'
                  : 'border-border-subtle hover:border-slate-300 bg-white text-slate-700'
              }`}
              title="Public transit / rail navigation (via Google Maps)"
            >
              <Train className="w-3.5 h-3.5" />
              <span>Transit</span>
            </button>
          </div>
        </div>

        {/* Prominent Google Maps Directions Action Button */}
        <div>
          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-primary hover:bg-primary-hover flex items-center justify-center gap-2 shadow-level-1 transition-all active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`Get directions in Google Maps to ${destinationName} using ${selectedTravelMode} mode`}
            title={`Open Google Maps directions in a new tab (${selectedTravelMode} mode)`}
          >
            <Navigation className="w-4 h-4 stroke-[2.2]" />
            <span>
              Get Directions in Google Maps
              {selectedTravelMode ? ` (${selectedTravelMode.charAt(0).toUpperCase() + selectedTravelMode.slice(1)})` : ''}
            </span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-0.5">
            <span>
              {userCoords
                ? '• GPS origin prefilled in Google Maps'
                : '• Opens Google Maps with selected destination'}
            </span>
            <span className="hidden sm:inline">Opens in new tab safely</span>
          </div>
        </div>

        {/* Nearest Transit Hub & Connectivity Details */}
        <div className="pt-2.5 border-t border-border-subtle flex items-start gap-2 text-xs text-slate-600">
          <span className="font-bold text-slate-700 shrink-0">Nearest Transit:</span>
          <span>{coords?.nearestTransit || 'Local transit details available upon arrival.'}</span>
        </div>
      </div>
    </section>
  );
}
