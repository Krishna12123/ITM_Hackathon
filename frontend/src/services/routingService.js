/**
 * YatraSaathi MVP — Configurable Routing Service
 * Default Provider: Open Source Routing Machine (OSRM)
 * 
 * Supports configurable API base URL, timeout guards, request aborting,
 * real road geometry extraction, unit formatting, and explicit status states
 * (SUCCESS, LOADING, NO_ROUTE, NETWORK_ERROR, UNSUPPORTED_MODE).
 */

export const ROUTING_CONFIG = {
  providerName: 'Open Source Routing Machine (OSRM)',
  providerAttribution: 'Route data © OpenStreetMap contributors, OSRM',
  // Configurable via Vite env variable (VITE_ROUTING_API_BASE_URL) or default public instance
  baseUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ROUTING_API_BASE_URL) 
    || 'https://router.project-osrm.org/route/v1',
  timeoutMs: 9000,
  supportedModes: {
    driving: {
      profile: 'driving',
      label: 'Driving',
      disclaimer: 'Estimated standard driving duration based on road network speeds (does not reflect live traffic conditions).'
    },
    walking: {
      profile: null, // OSRM standard public service is vehicle road routing, not pedestrian
      label: 'Walking',
      unsupportedMessage: 'Pedestrian walking routes are not supported by the public road routing provider. Open Google Maps Directions for pedestrian-friendly pathways.'
    },
    transit: {
      profile: null, // Public transit requires live timetable scheduling graphs
      label: 'Transit',
      unsupportedMessage: 'Public transit schedule routing (train, metro, bus) requires live transit timetables. Open Google Maps Directions for live departure schedules.'
    }
  }
};

/**
 * Format raw meters into human-readable distance with correct units
 */
export function formatRouteDistance(meters) {
  if (typeof meters !== 'number' || isNaN(meters)) return 'N/A';
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Format raw seconds into human-readable duration with correct units
 */
export function formatRouteDuration(seconds) {
  if (typeof seconds !== 'number' || isNaN(seconds)) return 'N/A';
  const totalMinutes = Math.round(seconds / 60);
  if (totalMinutes < 1) {
    return '< 1 min';
  }
  if (totalMinutes < 60) {
    return `${totalMinutes} min${totalMinutes > 1 ? 's' : ''}`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;
  if (remainingMins === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMins} min${remainingMins > 1 ? 's' : ''}`;
}

/**
 * Build a standard, keyless Google Maps Directions URL using URL and URLSearchParams
 * Spec: https://developers.google.com/maps/documentation/urls/get-started#directions-action
 *
 * Requirements:
 * - Uses URL and URLSearchParams
 * - api=1
 * - Destination: verified coordinates lat,lng or address/location fallback (never hardcoded)
 * - Travel Mode: driving | walking | transit
 * - Origin: Included only when user permission has been granted; omitted otherwise so Google Maps requests or determines it.
 * - No Google Maps API key needed.
 *
 * @param {Object} params
 * @param {Object} params.destination - Destination object { mapCoordinates: { lat, lng }, location, name }
 * @param {Object|null} [params.origin] - User's coordinates { lat, lng } if granted; omitted otherwise
 * @param {string} [params.travelMode] - 'driving' | 'walking' | 'transit'
 * @returns {string} Fully constructed Google Maps Directions URL
 */
export function buildGoogleMapsDirectionsUrl({ destination, origin = null, travelMode = 'driving' }) {
  const url = new URL('https://www.google.com/maps/dir/');
  url.searchParams.set('api', '1');

  // Destination: prioritize verified numeric coordinates, fallback to location address or name
  const dLat = destination?.mapCoordinates?.lat;
  const dLng = destination?.mapCoordinates?.lng;
  if (typeof dLat === 'number' && typeof dLng === 'number' && !isNaN(dLat) && !isNaN(dLng)) {
    url.searchParams.set('destination', `${dLat},${dLng}`);
  } else if (destination?.location) {
    url.searchParams.set('destination', destination.location);
  } else if (destination?.name) {
    url.searchParams.set('destination', destination.name);
  }

  // Add destination place name for richer display in Google Maps
  if (destination?.name) {
    url.searchParams.set('destination_place_id', destination.name);
  }

  // Origin: Use user's coordinates when permission has been granted; otherwise omit origin entirely
  const oLat = origin?.lat;
  const oLng = origin?.lng;
  if (typeof oLat === 'number' && typeof oLng === 'number' && !isNaN(oLat) && !isNaN(oLng)) {
    url.searchParams.set('origin', `${oLat},${oLng}`);
  }

  // Travel Mode: driving, walking, transit
  const validModes = {
    driving: 'driving',
    walking: 'walking',
    transit: 'transit'
  };
  const modeKey = (travelMode || 'driving').toLowerCase();
  url.searchParams.set('travelmode', validModes[modeKey] || 'driving');

  return url.toString();
}

/**
 * Request a verified road route from origin to destination
 * @param {Object} params
 * @param {Object} params.origin - { lat: number, lng: number }
 * @param {Object} params.destination - { lat: number, lng: number }
 * @param {string} params.mode - 'driving' | 'walking' | 'transit'
 * @param {AbortSignal} [params.signal] - optional abort signal
 * @returns {Promise<Object>} Result object with status and route details
 */
export async function calculateRoute({ origin, destination, mode = 'driving', signal }) {
  // 1. Validate coordinates
  const oLat = typeof origin?.lat === 'number' ? origin.lat : parseFloat(origin?.lat);
  const oLng = typeof origin?.lng === 'number' ? origin.lng : parseFloat(origin?.lng);
  const dLat = typeof destination?.lat === 'number' ? destination.lat : parseFloat(destination?.lat);
  const dLng = typeof destination?.lng === 'number' ? destination.lng : parseFloat(destination?.lng);

  if (isNaN(oLat) || isNaN(oLng) || isNaN(dLat) || isNaN(dLng)) {
    return {
      status: 'INVALID_COORDINATES',
      message: 'Valid origin and destination coordinates are required to calculate a route.'
    };
  }

  // 2. Validate travel mode support
  const modeConfig = ROUTING_CONFIG.supportedModes[mode];
  if (!modeConfig || !modeConfig.profile) {
    return {
      status: 'UNSUPPORTED_MODE',
      mode,
      message: modeConfig?.unsupportedMessage || `Travel mode '${mode}' is not supported by the routing service.`
    };
  }

  // 3. Construct URL: baseUrl/profile/oLng,oLat;dLng,dLat?overview=full&geometries=geojson
  const profile = modeConfig.profile;
  const endpoint = `${ROUTING_CONFIG.baseUrl}/${profile}/${oLng},${oLat};${dLng},${dLat}?overview=full&geometries=geojson`;

  // 4. Execute request with timeout guard
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), ROUTING_CONFIG.timeoutMs);

  const combinedSignal = signal || timeoutController.signal;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      signal: combinedSignal,
      headers: {
        'Accept': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    let data = null;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      if (data && (data.code === 'NoRoute' || data.code === 'NoSegment' || data.code === 'ImpossibleRoute' || data.code === 'InvalidUrl')) {
        return {
          status: 'NO_ROUTE',
          message: 'No continuous road route found between these locations. This may occur if traveling across non-contiguous land or ferry connections. Use Google Maps Directions for multi-modal travel.'
        };
      }
      return {
        status: 'NETWORK_ERROR',
        message: `Routing service returned HTTP status ${response.status}.`
      };
    }

    // 5. Handle response status codes
    if (data.code === 'Ok' && Array.isArray(data.routes) && data.routes.length > 0) {
      const primaryRoute = data.routes[0];
      const rawCoordinates = primaryRoute.geometry?.coordinates; // [lng, lat]

      if (!Array.isArray(rawCoordinates) || rawCoordinates.length < 2) {
        return {
          status: 'NO_ROUTE',
          message: 'Routing service could not resolve continuous road geometry between these locations.'
        };
      }

      // Convert [lng, lat] array to Leaflet [lat, lng] array
      const latLngs = rawCoordinates.map(([cLng, cLat]) => [cLat, cLng]);

      return {
        status: 'SUCCESS',
        mode,
        latLngs,
        distanceMeters: primaryRoute.distance,
        formattedDistance: formatRouteDistance(primaryRoute.distance),
        durationSeconds: primaryRoute.duration,
        formattedDuration: formatRouteDuration(primaryRoute.duration),
        disclaimer: modeConfig.disclaimer,
        provider: ROUTING_CONFIG.providerName,
        attribution: ROUTING_CONFIG.providerAttribution
      };
    } else if (data.code === 'NoRoute') {
      return {
        status: 'NO_ROUTE',
        message: 'No viable road route found between your current location and this destination. This may occur if traveling across non-contiguous land or across water bodies without road bridges.'
      };
    } else {
      return {
        status: 'NO_ROUTE',
        message: data.message || 'Routing provider was unable to calculate a road route for this journey.'
      };
    }
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      return {
        status: 'ABORTED',
        message: 'Routing request was cancelled or timed out.'
      };
    }

    return {
      status: 'NETWORK_ERROR',
      message: 'Unable to connect to the routing service. Please verify your internet connection or try again shortly.'
    };
  }
}
